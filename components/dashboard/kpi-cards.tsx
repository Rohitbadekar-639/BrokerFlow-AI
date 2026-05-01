import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function KpiCards({
  totalLeads,
  qualifiedLeads,
  appointments
}: {
  totalLeads: number;
  qualifiedLeads: number;
  appointments: number;
}) {
  const items = [
    { label: "Total Leads", value: totalLeads },
    { label: "Qualified Leads", value: qualifiedLeads },
    { label: "Appointments Scheduled", value: appointments }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{item.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
