export default function RefundPolicyPage() {
  return (
    <main className="container max-w-3xl space-y-4 py-10">
      <h1 className="text-3xl font-semibold">Refund & Cancellation Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-IN")}</p>
      <p>Subscriptions can be cancelled anytime from your dashboard or by contacting support.</p>
      <p>Refunds for accidental duplicate charges are reviewed and processed within 7 business days.</p>
      <p>Partial month refunds are not guaranteed for consumed service periods unless required by law.</p>
    </main>
  );
}
