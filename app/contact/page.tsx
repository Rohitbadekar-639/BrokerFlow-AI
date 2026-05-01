export default function ContactPage() {
  return (
    <main className="container max-w-3xl space-y-4 py-10">
      <h1 className="text-3xl font-semibold">Contact Us</h1>
      <p className="text-muted-foreground">For sales, support, or billing issues, reach us at:</p>
      <p>
        Email: <a className="text-primary underline" href="mailto:support@brokerflowai.com">support@brokerflowai.com</a>
      </p>
      <p>
        Phone/WhatsApp: <a className="text-primary underline" href="tel:+919999999999">+91 99999 99999</a>
      </p>
      <p>Business Hours: Monday to Saturday, 9:00 AM to 7:00 PM (IST).</p>
    </main>
  );
}
