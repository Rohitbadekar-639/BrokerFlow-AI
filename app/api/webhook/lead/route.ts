import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { processIncomingLead } from "@/lib/lead-processor";
import { supabaseAdmin } from "@/lib/supabase";

const webhookSchema = z.object({
  brokerUserId: z.string().uuid().optional(),
  brokerClerkUserId: z.string().optional(),
  source: z.enum(["99acres", "magicbricks", "manual"]),
  mobile: z.string().min(10),
  emailBody: z.string().min(8)
});

function parseLeadMessage(emailBody: string): string {
  const lines = emailBody.split("\n").map((line) => line.trim()).filter(Boolean);
  const probable = lines.find((line) => /budget|location|buy|rent|looking/i.test(line));
  return probable ?? lines.join(" ").slice(0, 500);
}

export async function POST(request: NextRequest) {
  try {
    const webhookToken = process.env.LEAD_WEBHOOK_TOKEN;
    if (webhookToken) {
      const requestToken = request.headers.get("x-brokerflow-token");
      if (requestToken !== webhookToken) {
        return NextResponse.json({ ok: false, error: "Unauthorized webhook" }, { status: 401 });
      }
    }

    const body = await request.json();
    const payload = webhookSchema.parse(body);
    const initialMessage = parseLeadMessage(payload.emailBody);
    let resolvedBrokerUserId = payload.brokerUserId;

    if (!resolvedBrokerUserId && payload.brokerClerkUserId) {
      const { data: brokerRow } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("clerk_user_id", payload.brokerClerkUserId)
        .single();
      resolvedBrokerUserId = brokerRow?.id;
    }
    if (!resolvedBrokerUserId) {
      return NextResponse.json(
        { ok: false, error: "brokerUserId or brokerClerkUserId is required" },
        { status: 400 }
      );
    }

    const result = await processIncomingLead({
      brokerUserId: resolvedBrokerUserId,
      source: payload.source,
      mobile: payload.mobile,
      initialMessage
    });

    return NextResponse.json({
      ok: true,
      leadId: result.lead.id,
      status: result.lead.status,
      ai: result.ai
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected webhook failure";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
