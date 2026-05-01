import type { Metadata } from "next";
import { ClerkProvider, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Show } from "@/components/auth/show";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrokerFlow AI - Stop Lead Leakage",
  description:
    "AI WhatsApp receptionist for Indian real estate brokers. Auto-qualify leads from 99acres and MagicBricks."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>
        <ClerkProvider>
          <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur">
            <div className="container flex h-16 items-center justify-between">
              <Link href="/" className="inline-flex items-center gap-2 font-semibold">
                <Building2 className="h-5 w-5 text-primary" />
                <span>BrokerFlow AI</span>
              </Link>
              <div className="flex items-center gap-2">
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <button className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className={cn(buttonVariants({ size: "sm" }))}>Start Free</button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <Link className={cn(buttonVariants({ variant: "outline", size: "sm" }))} href="/dashboard">
                    Dashboard
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </Show>
              </div>
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
