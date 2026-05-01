import { SendWhatsAppMessageParams, WhatsAppAdapter } from "@/lib/whatsapp/types";

class MockWhatsAppAdapter implements WhatsAppAdapter {
  async sendMessage(input: SendWhatsAppMessageParams) {
    console.info("Mock WhatsApp send", input);
    return { providerMessageId: `mock_${Date.now()}` };
  }
}

class TwilioWhatsAppAdapter implements WhatsAppAdapter {
  async sendMessage(input: SendWhatsAppMessageParams) {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_WHATSAPP_FROM;
    if (!sid || !token || !from) throw new Error("Twilio WhatsApp env vars missing");

    const auth = Buffer.from(`${sid}:${token}`).toString("base64");
    const body = new URLSearchParams({
      To: `whatsapp:${input.to}`,
      From: from.startsWith("whatsapp:") ? from : `whatsapp:${from}`,
      Body: input.message
    });

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    if (!response.ok) throw new Error(`Twilio send failed: ${response.statusText}`);
    const json = (await response.json()) as { sid?: string };
    return { providerMessageId: json.sid };
  }
}

class MetaWhatsAppAdapter implements WhatsAppAdapter {
  async sendMessage(input: SendWhatsAppMessageParams) {
    const token = process.env.META_WABA_ACCESS_TOKEN;
    const phoneNumberId = process.env.META_WABA_PHONE_NUMBER_ID;
    if (!token || !phoneNumberId) throw new Error("Meta WhatsApp env vars missing");

    const response = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: input.to,
        type: "text",
        text: { body: input.message }
      })
    });
    if (!response.ok) throw new Error(`Meta send failed: ${response.statusText}`);
    const json = (await response.json()) as { messages?: Array<{ id?: string }> };
    return { providerMessageId: json.messages?.[0]?.id };
  }
}

export function getWhatsAppAdapter(provider: "mock" | "twilio" | "meta"): WhatsAppAdapter {
  switch (provider) {
    case "twilio":
      return new TwilioWhatsAppAdapter();
    case "meta":
      return new MetaWhatsAppAdapter();
    default:
      return new MockWhatsAppAdapter();
  }
}
