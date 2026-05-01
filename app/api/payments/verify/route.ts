import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { verifyRazorpayPaymentSignature } from "@/lib/payments";
import { requireBrokerUser } from "@/lib/current-user";
import { supabaseAdmin } from "@/lib/supabase";

const schema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1)
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

  const valid = verifyRazorpayPaymentSignature({
    orderId: parsed.data.razorpay_order_id,
    paymentId: parsed.data.razorpay_payment_id,
    signature: parsed.data.razorpay_signature
  });
  if (!valid) return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 });

  await supabaseAdmin
    .from("payment_orders")
    .update({
      status: "paid",
      razorpay_payment_id: parsed.data.razorpay_payment_id,
      updated_at: new Date().toISOString()
    })
    .eq("user_id", broker.id)
    .eq("razorpay_order_id", parsed.data.razorpay_order_id);

  await supabaseAdmin
    .from("settings")
    .upsert({ user_id: broker.id, billing_status: "active" }, { onConflict: "user_id" });

  return NextResponse.json({ ok: true });
}
