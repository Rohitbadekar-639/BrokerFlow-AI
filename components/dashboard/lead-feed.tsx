import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LeadRow {
  id: string;
  name: string | null;
  source: string;
  phone_number: string;
  status: "new" | "qualifying" | "hot" | "appointment_booked";
  location_preference: string | null;
  budget: string | null;
  intent: "buy" | "rent" | "unknown";
  ai_confidence: number | string;
  created_at: string;
}

const statusLabelMap: Record<LeadRow["status"], string> = {
  new: "New",
  qualifying: "Qualifying",
  hot: "Hot",
  appointment_booked: "Appointment Booked"
};

const statusVariantMap = {
  new: "new",
  qualifying: "qualifying",
  hot: "hot",
  appointment_booked: "booked"
} as const;

export function LeadFeed({
  leads,
  onSelectLead
}: {
  leads: LeadRow[];
  onSelectLead?: (lead: LeadRow) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Feed</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="border-b border-border text-left text-muted-foreground">
            <tr>
              <th className="py-2">Lead</th>
              <th className="py-2">Source</th>
              <th className="py-2">Location</th>
              <th className="py-2">Budget</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="cursor-pointer border-b border-border/60 transition hover:bg-secondary/30"
                onClick={() => onSelectLead?.(lead)}
              >
                <td className="py-3">
                  <p className="font-medium">{lead.name ?? lead.phone_number}</p>
                  <p className="text-xs text-muted-foreground">{lead.phone_number}</p>
                </td>
                <td>{lead.source}</td>
                <td>{lead.location_preference ?? "Unknown"}</td>
                <td>{lead.budget ?? "Not shared"}</td>
                <td>
                  <Badge variant={statusVariantMap[lead.status]}>{statusLabelMap[lead.status]}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
