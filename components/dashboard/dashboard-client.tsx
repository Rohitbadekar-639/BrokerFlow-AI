"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { LeadFeed } from "@/components/dashboard/lead-feed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Lead = {
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
};

export function DashboardClient({
  summary,
  leads
}: {
  summary: { totalLeads: number; qualifiedLeads: number; appointments: number };
  leads: Lead[];
}) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const confidencePct = selectedLead
    ? Number.isNaN(Number(selectedLead.ai_confidence))
      ? 0
      : Number(selectedLead.ai_confidence) * 100
    : 0;

  const statusData = useMemo(() => {
    const base = { new: 0, qualifying: 0, hot: 0, appointment_booked: 0 };
    for (const lead of leads) base[lead.status] += 1;
    return [
      { name: "New", value: base.new },
      { name: "Qualifying", value: base.qualifying },
      { name: "Hot", value: base.hot },
      { name: "Booked", value: base.appointment_booked }
    ];
  }, [leads]);

  return (
    <div className="space-y-6">
      <KpiCards
        totalLeads={summary.totalLeads}
        qualifiedLeads={summary.qualifiedLeads}
        appointments={summary.appointments}
      />
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2f3340" />
              <XAxis dataKey="name" stroke="#A1A7B3" />
              <YAxis stroke="#A1A7B3" allowDecimals={false} />
              <Tooltip
                contentStyle={{ border: "1px solid #343b4d", background: "#11141d", borderRadius: 8 }}
              />
              <Bar dataKey="value" fill="#21c07c" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <LeadFeed leads={leads} onSelectLead={setSelectedLead} />

      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="grid gap-2 text-sm">
              <p>
                <span className="text-muted-foreground">Lead:</span> {selectedLead.name ?? "Unknown"}
              </p>
              <p>
                <span className="text-muted-foreground">Phone:</span> {selectedLead.phone_number}
              </p>
              <p>
                <span className="text-muted-foreground">Source:</span> {selectedLead.source}
              </p>
              <p>
                <span className="text-muted-foreground">Intent:</span> {selectedLead.intent}
              </p>
              <p>
                <span className="text-muted-foreground">Budget:</span> {selectedLead.budget ?? "Not shared"}
              </p>
              <p>
                <span className="text-muted-foreground">Location:</span>{" "}
                {selectedLead.location_preference ?? "Not shared"}
              </p>
              <p>
                <span className="text-muted-foreground">AI Confidence:</span>{" "}
                {confidencePct.toFixed(0)}%
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
