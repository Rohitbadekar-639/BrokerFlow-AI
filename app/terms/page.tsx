export default function TermsPage() {
  return (
    <main className="container max-w-3xl space-y-4 py-10">
      <h1 className="text-3xl font-semibold">Terms of Service</h1>
      <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-IN")}</p>
      <p>BrokerFlow AI provides SaaS tools for real estate lead qualification and communication workflow automation.</p>
      <p>By using this service, you agree to provide lawful data, comply with WhatsApp platform rules, and avoid spam behavior.</p>
      <p>Paid plans are billed in INR and renewed as per your selected payment mandate with Razorpay.</p>
      <p>We may suspend accounts for abuse, fraud, illegal activity, or payment failures.</p>
    </main>
  );
}
