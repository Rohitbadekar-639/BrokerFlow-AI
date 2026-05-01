import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { BROKERFLOW_PLAN_AMOUNT_PAISE, getRazorpayClient } from "@/lib/payments";
import { requireBrokerUser } from "@/lib/current-user";
import { supabaseAdmin } from "@/lib/supabase";

const schema = z.object({
  amountPaise: z.number().int().positive().optional(),
  purpose: z.string().default("BrokerFlow AI Monthly Plan")
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const broker = await requireBrokerUser();
  if (!broker) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const amount = parsed.data.amountPaise ?? BROKERFLOW_PLAN_AMOUNT_PAISE;
  const razorpay = getRazorpayClient();
  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: `brokerflow_${Date.now()}`,
    notes: {
      brokerUserId: broker.id,
      clerkUserId: userId,
      purpose: parsed.data.purpose
    }
  });

  await supabaseAdmin.from("payment_orders").insert({
    user_id: broker.id,
    razorpay_order_id: order.id,
    amount_paise: amount,
    currency: "INR",
    status: "created"
  });

  return NextResponse.json({
    ok: true,
    order,
    keyId: process.env.RAZORPAY_KEY_ID
  });
}
