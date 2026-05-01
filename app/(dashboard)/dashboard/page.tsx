import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { requireBrokerUser } from "@/lib/current-user";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const broker = await requireBrokerUser();
  if (!broker) redirect("/sign-in");

  const [{ count: total }, { count: qualified }, { count: booked }, { data: leads }] =
    await Promise.all([
      supabaseAdmin.from("leads").select("*", { count: "exact", head: true }).eq("user_id", broker.id),
      supabaseAdmin
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("user_id", broker.id)
        .eq("qualified", true),
      supabaseAdmin
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("user_id", broker.id)
        .eq("status", "appointment_booked"),
      supabaseAdmin
        .from("leads")
        .select("id,name,source,phone_number,status,location_preference,budget,intent,ai_confidence,created_at")
        .eq("user_id", broker.id)
        .order("created_at", { ascending: false })
        .limit(40)
    ]);

  return (
    <main className="container space-y-6 py-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Broker Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Track pipeline health, inspect every lead, and jump in when AI marks a hot buyer.
        </p>
      </div>
      <DashboardClient
        summary={{
          totalLeads: total ?? 0,
          qualifiedLeads: qualified ?? 0,
          appointments: booked ?? 0
        }}
        leads={leads ?? []}
      />
    </main>
  );
}
