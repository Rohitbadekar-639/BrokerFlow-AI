import Groq from "groq-sdk";
import { z } from "zod";
import { LeadQualification } from "@/types/lead";

const qualificationSchema = z.object({
  name: z.string().optional(),
  budget: z.string().optional(),
  locationPreference: z.string().optional(),
  intent: z.enum(["buy", "rent", "unknown"]).default("unknown"),
  confidence: z.number().min(0).max(1).default(0),
  qualified: z.boolean().default(false),
  nextQuestion: z.string().optional(),
  reason: z.string().optional(),
  replyMessage: z.string()
});

const systemPrompt = `You are BrokerFlow AI, a polite and concise Indian real-estate assistant on WhatsApp.
Goals:
1) Collect name, budget range in INR, location preference, and intent (buy/rent).
2) Keep response natural and short (max 2 lines), with a warm local tone.
3) If information is incomplete, ask one targeted follow-up question.
4) Mark qualified=true only if intent is known and at least 2 of [budget, location, name] are captured.
5) Return valid JSON only.
`;

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

export async function qualifyLeadConversation(params: {
  lastUserMessage: string;
  conversationContext?: string;
}): Promise<LeadQualification & { replyMessage: string }> {
  if (!groq) {
    return {
      intent: "unknown",
      confidence: 0.35,
      qualified: false,
      reason: "GROQ_API_KEY missing",
      nextQuestion: "Can I know your preferred location and budget range?",
      replyMessage: "Thanks for reaching out. Can I know your preferred location and budget range?"
    };
  }

  const completion = await groq.chat.completions.create({
    model: "llama3-70b-8192",
    temperature: 0.2,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Context: ${params.conversationContext ?? "None"}\nLatest message: ${params.lastUserMessage}`
      }
    ],
    response_format: { type: "json_object" }
  });

  const text = completion.choices[0]?.message?.content ?? "{}";
  const parsed = qualificationSchema.parse(JSON.parse(text));

  return parsed;
}
