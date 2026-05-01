import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireBrokerUser } from "@/lib/current-user";

export async function GET() {
  const broker = await requireBrokerUser();
  if (!broker) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const userId = broker.id;

  const [{ count: total }, { count: qualified }, { count: booked }, { data: leads }] =
    await Promise.all([
      supabaseAdmin.from("leads").select("*", { count: "exact", head: true }).eq("user_id", userId),
      supabaseAdmin
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("qualified", true),
      supabaseAdmin
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "appointment_booked"),
      supabaseAdmin
        .from("leads")
        .select("id,name,source,phone_number,status,location_preference,budget,intent,ai_confidence,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(25)
    ]);

  return NextResponse.json({
    ok: true,
    summary: {
      totalLeads: total ?? 0,
      qualifiedLeads: qualified ?? 0,
      appointmentsScheduled: booked ?? 0
    },
    leads: leads ?? []
  });
}
