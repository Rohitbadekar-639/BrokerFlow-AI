import crypto from "crypto";
import Razorpay from "razorpay";

export const BROKERFLOW_PLAN_AMOUNT_PAISE = 99900;

export function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Razorpay keys are missing");
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export function verifyRazorpayPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error("RAZORPAY_KEY_SECRET is missing");
  const body = `${params.orderId}|${params.paymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return expected === params.signature;
}

export function verifyRazorpayWebhookSignature(body: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error("RAZORPAY_WEBHOOK_SECRET is missing");
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return expected === signature;
}
