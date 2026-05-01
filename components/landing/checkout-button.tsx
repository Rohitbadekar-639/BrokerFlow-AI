"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const { isSignedIn } = useAuth();

  async function loadScript() {
    if (window.Razorpay) return true;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return new Promise<boolean>((resolve) => {
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
    });
  }

  async function startCheckout() {
    if (!isSignedIn) {
      window.location.href = "/sign-up";
      return;
    }
    setLoading(true);
    const scriptLoaded = await loadScript();
    if (!scriptLoaded) {
      setLoading(false);
      return;
    }

    const orderRes = await fetch("/api/payments/create-order", { method: "POST", body: "{}" });
    const orderJson = await orderRes.json();
    if (!orderJson.ok) {
      setLoading(false);
      return;
    }

    const razorpay = new window.Razorpay({
      key: orderJson.keyId,
      order_id: orderJson.order.id,
      amount: orderJson.order.amount,
      currency: "INR",
      name: "BrokerFlow AI",
      description: "BrokerFlow AI Monthly Plan",
      handler: async (response: Record<string, string>) => {
        await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response)
        });
        window.location.href = "/dashboard";
      },
      theme: { color: "#21c07c" }
    });
    razorpay.open();
    setLoading(false);
  }

  return (
    <Button size="lg" onClick={startCheckout} disabled={loading}>
      {loading ? "Loading..." : "Subscribe with Razorpay"}
    </Button>
  );
}
