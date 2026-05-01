import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, MessageSquareText, PhoneCall, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckoutButton } from "@/components/landing/checkout-button";

const faqs = [
  {
    q: "Will this work with 99acres and MagicBricks leads?",
    a: "Yes. BrokerFlow AI can ingest leads from email parsing and webhook flows, then start WhatsApp qualification automatically."
  },
  {
    q: "Can I integrate Twilio or Meta WhatsApp API later?",
    a: "Yes. This starter includes a webhook abstraction so you can swap your provider with minimal changes."
  },
  {
    q: "Is this suitable for a solo broker?",
    a: "Absolutely. It is designed mobile-first for independent brokers and small agencies."
  }
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="inline-flex items-center rounded-full border border-border bg-secondary/40 px-4 py-1 text-xs text-muted-foreground">
            Built for Indian Real Estate Brokers
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Stop Lead Leakage with an AI WhatsApp Receptionist
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            BrokerFlow AI instantly responds to every incoming lead from 99acres and MagicBricks,
            qualifies buyers/tenants, and alerts you when a deal is hot.
          </p>
          <div className="mx-auto mt-6 grid max-w-3xl gap-2 text-sm text-muted-foreground md:grid-cols-3">
            <p className="inline-flex items-center justify-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> 24x7 lead response</p>
            <p className="inline-flex items-center justify-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> AI qualification workflow</p>
            <p className="inline-flex items-center justify-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Payment-ready SaaS setup</p>
          </div>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/sign-up">
              <Button size="lg">Start Free Setup</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Demo Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container grid gap-4 pb-16 md:grid-cols-3">
        {[
          { title: "Instant Response", icon: MessageSquareText, body: "Reply in seconds on WhatsApp and never lose early-stage prospects." },
          { title: "Smart Qualification", icon: Building2, body: "Capture budget, location, and intent before you spend time calling." },
          { title: "Agent Alert", icon: PhoneCall, body: "Get notified only when the lead is warm and ready for a site visit." }
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <item.icon className="h-5 w-5 text-primary" />
              <CardTitle className="pt-2">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{item.body}</CardContent>
          </Card>
        ))}
      </section>

      <section className="container pb-16">
        <Card className="bg-gradient-to-br from-primary/20 to-secondary/40">
          <CardContent className="flex flex-col items-start gap-3 p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold">Simple Pricing for Growing Broker Teams</h3>
              <p className="text-sm text-muted-foreground">1 seat, unlimited leads, AI qualification engine</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">₹999/mo</p>
              <p className="text-xs text-muted-foreground">No hidden setup charges. Cancel anytime.</p>
              <div className="mt-2">
                <CheckoutButton />
              </div>
              <Link href="/sign-up" className="mt-2 inline-flex items-center gap-1 text-xs text-primary">
                Start subscription <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="container pb-20">
        <div className="mb-6 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <h2 className="text-xl font-semibold">FAQs</h2>
        </div>
        <div className="grid gap-3">
          {faqs.map((faq) => (
            <Card key={faq.q}>
              <CardHeader>
                <CardTitle className="text-base">{faq.q}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{faq.a}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/80 py-8">
        <div className="container flex flex-col items-start justify-between gap-4 text-sm text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} BrokerFlow AI. Built for Indian brokers.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/refund-policy" className="hover:text-foreground">Refund Policy</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
