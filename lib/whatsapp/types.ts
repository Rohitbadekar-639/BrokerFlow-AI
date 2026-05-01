export type WhatsAppProvider = "mock" | "twilio" | "meta";

export interface SendWhatsAppMessageParams {
  to: string;
  message: string;
}

export interface WhatsAppAdapter {
  sendMessage(input: SendWhatsAppMessageParams): Promise<{ providerMessageId?: string }>;
}
