import { supabaseAdmin } from "@/lib/supabase";
import { qualifyLeadConversation } from "@/lib/groq";
import { LeadStatus } from "@/types/lead";
import { getWhatsAppAdapter } from "@/lib/whatsapp/adapters";

function mapStatus(qualified: boolean, confidence: number): LeadStatus {
  if (qualified && confidence > 0.85) return "appointment_booked";
  if (qualified) return "hot";
  if (confidence > 0.45) return "qualifying";
  return "new";
}

export async function processIncomingLead(payload: {
  brokerUserId: string;
  source: "99acres" | "magicbricks" | "manual";
  mobile: string;
  initialMessage: string;
}) {
  const { data: setting } = await supabaseAdmin
    .from("settings")
    .select("whatsapp_provider")
    .eq("user_id", payload.brokerUserId)
    .single();

  const ai = await qualifyLeadConversation({
    lastUserMessage: payload.initialMessage
  });

  const status = mapStatus(ai.qualified, ai.confidence);

  const { data: lead, error: leadError } = await supabaseAdmin
    .from("leads")
    .insert({
      user_id: payload.brokerUserId,
      source: payload.source,
      phone_number: payload.mobile,
      status,
      name: ai.name ?? null,
      budget: ai.budget ?? null,
      location_preference: ai.locationPreference ?? null,
      intent: ai.intent ?? "unknown",
      ai_confidence: ai.confidence,
      qualified: ai.qualified
    })
    .select("*")
    .single();

  if (leadError) {
    throw new Error(`Lead insert failed: ${leadError.message}`);
  }

  await supabaseAdmin.from("messages").insert([
    { lead_id: lead.id, role: "user", content: payload.initialMessage },
    { lead_id: lead.id, role: "assistant", content: ai.replyMessage }
  ]);

  const adapter = getWhatsAppAdapter(setting?.whatsapp_provider ?? "mock");
  await adapter.sendMessage({
    to: payload.mobile,
    message: ai.replyMessage
  });

  if (ai.qualified) {
    await supabaseAdmin.from("agent_alerts").insert({
      user_id: payload.brokerUserId,
      lead_id: lead.id,
      alert_type: "qualified_lead",
      meta: {
        confidence: ai.confidence,
        reason: ai.reason ?? "Lead meets qualification threshold"
      }
    });
  }

  return { lead, ai };
}
