import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { qualifyLeadConversation } from "@/lib/groq";
import { auth } from "@clerk/nextjs/server";

const schema = z.object({
  message: z.string().min(1),
  context: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const input = schema.parse(body);
    const ai = await qualifyLeadConversation({
      lastUserMessage: input.message,
      conversationContext: input.context
    });
    return NextResponse.json({ ok: true, ai });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI reply route failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
