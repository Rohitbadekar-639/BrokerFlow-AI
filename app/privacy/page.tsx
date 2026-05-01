export default function PrivacyPage() {
  return (
    <main className="container max-w-3xl space-y-4 py-10">
      <h1 className="text-3xl font-semibold">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-IN")}</p>
      <p>
        BrokerFlow AI stores broker profile data, lead messages, and settings only for providing lead automation,
        analytics, and notifications.
      </p>
      <p>
        We do not sell personal data. Data is processed through secure providers including Supabase, Clerk, Groq,
        and your configured WhatsApp provider.
      </p>
      <p>You can request deletion of your account data by contacting our support email listed on the contact page.</p>
    </main>
  );
}
