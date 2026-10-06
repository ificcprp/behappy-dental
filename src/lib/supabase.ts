import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ashnfzjnpcddwoseovmm.supabase.co";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_secret_9bE7pXbSpkyfNhx8fDtQew_v-HCtdiN";

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface AppointmentRecord {
  id?: string;
  patient_name: string;
  patient_phone: string;
  patient_email?: string;
  doctor_id?: string;
  doctor_name?: string;
  treatment_id: string;
  treatment_name: string;
  preferred_date?: string;
  preferred_time_slot?: string;
  notes?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  status?: "solicitada" | "confirmada" | "atendida" | "cancelada";
  created_at?: string;
}
