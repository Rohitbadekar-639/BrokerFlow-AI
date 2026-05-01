export type LeadStatus = "new" | "qualifying" | "hot" | "appointment_booked";

export interface LeadQualification {
  name?: string;
  budget?: string;
  locationPreference?: string;
  intent?: "buy" | "rent" | "unknown";
  confidence: number;
  qualified: boolean;
  nextQuestion?: string;
  reason?: string;
}
