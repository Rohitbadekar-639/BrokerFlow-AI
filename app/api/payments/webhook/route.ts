import { NextResponse } from "next/server";
import { verifyRazorpayWebhookSignature } from "@/lib/payments";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) return NextResponse.json({ ok: false, error: "Missing signature" }, { status: 400 });

  const valid = verifyRazorpayWebhookSignature(body, signature);
  if (!valid) return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 });

  const event = JSON.parse(body) as {
    event: string;
    payload?: { payment?: { entity?: { order_id?: string; id?: string; status?: string } } };
  };

  const payment = event.payload?.payment?.entity;
  if (event.event === "payment.captured" && payment?.order_id && payment?.id) {
    const { data: updatedOrder } = await supabaseAdmin
      .from("payment_orders")
      .update({
        status: "paid",
        razorpay_payment_id: payment.id,
        updated_at: new Date().toISOString()
      })
      .select("user_id")
      .eq("razorpay_order_id", payment.order_id);

    const userId = updatedOrder?.[0]?.user_id;
    if (userId) {
      await supabaseAdmin
        .from("settings")
        .upsert({ user_id: userId, billing_status: "active" }, { onConflict: "user_id" });
    }
  }

  return NextResponse.json({ ok: true });
}
