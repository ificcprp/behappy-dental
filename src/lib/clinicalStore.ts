import {
  PatientAppointment,
  ClinicalRecord,
  OdontogramTooth,
  InformedConsent,
  DentalBudget
} from "@/types/auth";
import { INITIAL_APPOINTMENTS, INITIAL_CLINICAL_RECORDS, INITIAL_ODONTOGRAM } from "@/data/portalMockData";

const STORAGE_APPOINTMENTS_KEY = "behappy_appointments_data";
const STORAGE_RECORDS_KEY = "behappy_clinical_records_data";
const STORAGE_ODONTOGRAM_KEY = "behappy_odontogram_data";
const STORAGE_CONSENTS_KEY = "behappy_informed_consents_data";
const STORAGE_BUDGETS_KEY = "behappy_dental_budgets_data";
export const CLINICAL_CHANGE_EVENT = "behappy_clinical_updated";

/* =========================================================================
   1. APPOINTMENTS STORE
   ========================================================================= */

export function getStoredAppointments(): PatientAppointment[] {
  if (typeof window === "undefined") return INITIAL_APPOINTMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_APPOINTMENTS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_APPOINTMENTS_KEY, JSON.stringify(INITIAL_APPOINTMENTS));
      return INITIAL_APPOINTMENTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading stored appointments:", err);
    return INITIAL_APPOINTMENTS;
  }
}

export function saveStoredAppointments(appointments: PatientAppointment[]): PatientAppointment[] {
  if (typeof window === "undefined") return appointments;
  try {
    localStorage.setItem(STORAGE_APPOINTMENTS_KEY, JSON.stringify(appointments));
    window.dispatchEvent(new CustomEvent(CLINICAL_CHANGE_EVENT, { detail: { appointments } }));
    return appointments;
  } catch (err) {
    console.error("Error saving appointments:", err);
    return appointments;
  }
}

export function addStoredAppointment(
  data: Omit<PatientAppointment, "id"> & { id?: string }
): PatientAppointment {
  const current = getStoredAppointments();
  const newAppointment: PatientAppointment = {
    ...data,
    id: data.id || `cita-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  };
  const updated = [newAppointment, ...current];
  saveStoredAppointments(updated);
  return newAppointment;
}

const PORTAL_TO_SERVER_STATUS: Record<PatientAppointment["status"], string> = {
  pendiente: "solicitada",
  confirmada: "confirmada",
  en_espera: "confirmada",
  en_box: "confirmada",
  completada: "atendida",
  cancelada: "cancelada",
};

const SERVER_TO_PORTAL_STATUS: Record<string, PatientAppointment["status"]> = {
  solicitada: "pendiente",
  confirmada: "confirmada",
  en_espera: "en_espera",
  en_box: "en_box",
  atendida: "completada",
  completada: "completada",
  cancelada: "cancelada",
};

export function syncAppointmentToCloud(appointment: PatientAppointment) {
  if (typeof window === "undefined") return;
  fetch("/api/citas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      patient_name: appointment.patientName || "Paciente presencial",
      patient_phone: appointment.patientPhone || "sin-registro",
      patient_email: appointment.patientEmail || null,
      doctor_name: appointment.doctorName,
      treatment_name: appointment.treatmentName,
      preferred_date: appointment.date,
      preferred_time_slot: appointment.time,
      notes: appointment.notes || null,
      utm_source: "walkin_portal",
    }),
  }).catch(() => {});
}

export function updateStoredAppointmentStatus(
  id: string,
  newStatus: PatientAppointment["status"]
): PatientAppointment[] {
  const current = getStoredAppointments();
  const updated = current.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
  saveStoredAppointments(updated);

  if (typeof window !== "undefined" && id.startsWith("srv-")) {
    fetch("/api/citas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id.slice(4), status: PORTAL_TO_SERVER_STATUS[newStatus] }),
    }).catch(() => {});
  }

  return updated;
}

/* =========================================================================
   2. CLINICAL SOAP RECORDS STORE
   ========================================================================= */

export function getStoredClinicalRecords(): ClinicalRecord[] {
  if (typeof window === "undefined") return INITIAL_CLINICAL_RECORDS;
  try {
    const raw = localStorage.getItem(STORAGE_RECORDS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_RECORDS_KEY, JSON.stringify(INITIAL_CLINICAL_RECORDS));
      return INITIAL_CLINICAL_RECORDS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading clinical records:", err);
    return INITIAL_CLINICAL_RECORDS;
  }
}

export function saveStoredClinicalRecords(records: ClinicalRecord[]): ClinicalRecord[] {
  if (typeof window === "undefined") return records;
  try {
    localStorage.setItem(STORAGE_RECORDS_KEY, JSON.stringify(records));
    window.dispatchEvent(new CustomEvent(CLINICAL_CHANGE_EVENT, { detail: { records } }));
    return records;
  } catch (err) {
    console.error("Error saving clinical records:", err);
    return records;
  }
}

export function addStoredClinicalRecord(
  data: Omit<ClinicalRecord, "id"> & { id?: string }
): ClinicalRecord {
  const current = getStoredClinicalRecords();
  const newRecord: ClinicalRecord = {
    ...data,
    id: data.id || `rec-${Date.now()}`,
  };
  const updated = [newRecord, ...current];
  saveStoredClinicalRecords(updated);

  // Cloud sync to /api/clinica/records
  if (typeof window !== "undefined") {
    fetch("/api/clinica/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_id: newRecord.patientId,
        doctor_name: newRecord.doctorName,
        diagnosis: newRecord.diagnosis,
        treatment_performed: newRecord.treatmentPerformed,
        prescription: newRecord.prescription,
        next_step: newRecord.nextStep,
        odontogram_json: getStoredOdontogram(),
      }),
    }).catch(() => {});
  }

  return newRecord;
}

/* =========================================================================
   3. ODONTOGRAM STORE
   ========================================================================= */

export function getStoredOdontogram(): OdontogramTooth[] {
  if (typeof window === "undefined") return INITIAL_ODONTOGRAM;
  try {
    const raw = localStorage.getItem(STORAGE_ODONTOGRAM_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_ODONTOGRAM_KEY, JSON.stringify(INITIAL_ODONTOGRAM));
      return INITIAL_ODONTOGRAM;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading odontogram:", err);
    return INITIAL_ODONTOGRAM;
  }
}

export function saveStoredOdontogram(odontogram: OdontogramTooth[]): OdontogramTooth[] {
  if (typeof window === "undefined") return odontogram;
  try {
    localStorage.setItem(STORAGE_ODONTOGRAM_KEY, JSON.stringify(odontogram));
    window.dispatchEvent(new CustomEvent(CLINICAL_CHANGE_EVENT, { detail: { odontogram } }));
    return odontogram;
  } catch (err) {
    console.error("Error saving odontogram:", err);
    return odontogram;
  }
}

export function updateStoredToothStatus(
  toothNumber: number,
  status: OdontogramTooth["status"],
  notes?: string
): OdontogramTooth[] {
  const current = getStoredOdontogram();
  const updated = current.map((t) =>
    t.toothNumber === toothNumber ? { ...t, status, surfaceNotes: notes ?? t.surfaceNotes } : t
  );
  saveStoredOdontogram(updated);
  return updated;
}

/* =========================================================================
   4. INFORMED CONSENTS STORE (LEY 20.584)
   ========================================================================= */

export function getStoredConsents(): InformedConsent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_CONSENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredConsents(consents: InformedConsent[]): InformedConsent[] {
  if (typeof window === "undefined") return consents;
  try {
    localStorage.setItem(STORAGE_CONSENTS_KEY, JSON.stringify(consents));
    window.dispatchEvent(new CustomEvent(CLINICAL_CHANGE_EVENT, { detail: { consents } }));
    return consents;
  } catch {
    return consents;
  }
}

export function addStoredConsent(consent: InformedConsent): InformedConsent {
  const current = getStoredConsents();
  const updated = [consent, ...current.filter((c) => c.id !== consent.id)];
  saveStoredConsents(updated);
  return consent;
}

/* =========================================================================
   5. DENTAL BUDGETS STORE
   ========================================================================= */

export function getStoredBudgets(): DentalBudget[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_BUDGETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredBudgets(budgets: DentalBudget[]): DentalBudget[] {
  if (typeof window === "undefined") return budgets;
  try {
    localStorage.setItem(STORAGE_BUDGETS_KEY, JSON.stringify(budgets));
    window.dispatchEvent(new CustomEvent(CLINICAL_CHANGE_EVENT, { detail: { budgets } }));
    return budgets;
  } catch {
    return budgets;
  }
}

export function addStoredBudget(budget: DentalBudget): DentalBudget {
  const current = getStoredBudgets();
  const updated = [budget, ...current.filter((b) => b.id !== budget.id)];
  saveStoredBudgets(updated);
  return budget;
}

/* =========================================================================
   6. CLOUD SYNC (STAFF SESSIONS ONLY)
   ========================================================================= */

interface ServerCitaRow {
  id: string;
  patient_name?: string | null;
  patient_phone?: string | null;
  patient_email?: string | null;
  doctor_name?: string | null;
  treatment_name?: string | null;
  preferred_date?: string | null;
  preferred_time_slot?: string | null;
  notes?: string | null;
  status?: string | null;
  created_at?: string | null;
}

interface ServerRecordRow {
  id: string;
  patient_id?: string | null;
  doctor_name?: string | null;
  diagnosis?: string | null;
  treatment_performed?: string | null;
  prescription?: string | null;
  next_step?: string | null;
  created_at?: string | null;
}

function mapServerCita(row: ServerCitaRow): PatientAppointment {
  return {
    id: `srv-${row.id}`,
    date: row.preferred_date || (row.created_at || "").slice(0, 10),
    time: row.preferred_time_slot || "Por coordinar",
    doctorName: row.doctor_name || "Primer especialista disponible",
    treatmentName: row.treatment_name || "Evaluación General",
    status: SERVER_TO_PORTAL_STATUS[String(row.status)] || "pendiente",
    patientName: row.patient_name || "Paciente",
    patientPhone: row.patient_phone || undefined,
    patientEmail: row.patient_email || undefined,
    notes: row.notes || undefined,
  };
}

function mapServerRecord(row: ServerRecordRow): ClinicalRecord {
  return {
    id: `srv-${row.id}`,
    patientId: row.patient_id || "paciente_anonimo",
    doctorName: row.doctor_name || "Especialista Tratante",
    date: (row.created_at || new Date().toISOString()).slice(0, 10),
    diagnosis: row.diagnosis || "Sin diagnóstico registrado",
    treatmentPerformed: row.treatment_performed || "Sin procedimiento registrado",
    prescription: row.prescription || undefined,
    nextStep: row.next_step || undefined,
  };
}

function appointmentDedupeKey(a: PatientAppointment): string {
  return `${(a.patientName || "").trim().toLowerCase()}|${a.date}|${a.treatmentName.trim().toLowerCase()}`;
}

function recordDedupeKey(r: ClinicalRecord): string {
  return `${r.patientId.trim().toLowerCase()}|${r.diagnosis.trim().toLowerCase()}|${r.treatmentPerformed.trim().toLowerCase()}`;
}

export async function syncClinicalFromServer(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (typeof document !== "undefined" && document.hidden) return false;

  try {
    const [citasRes, recordsRes] = await Promise.all([
      fetch("/api/citas", { cache: "no-store" }),
      fetch("/api/clinica/records", { cache: "no-store" }),
    ]);

    let changed = false;

    if (citasRes.ok) {
      const json = await citasRes.json().catch(() => null);
      if (json?.success && Array.isArray(json.citas)) {
        const serverAppointments = (json.citas as ServerCitaRow[]).map(mapServerCita);
        const serverIds = new Set(serverAppointments.map((a) => a.id));
        const serverKeys = new Set(serverAppointments.map(appointmentDedupeKey));
        const current = getStoredAppointments();
        const kept = current.filter((a) => {
          if (serverIds.has(a.id)) return false;
          if (a.id.startsWith("srv-")) return true;
          return !serverKeys.has(appointmentDedupeKey(a));
        });
        const next = [...serverAppointments, ...kept];
        if (JSON.stringify(next) !== JSON.stringify(current)) {
          saveStoredAppointments(next);
          changed = true;
        }
      }
    }

    if (recordsRes.ok) {
      const json = await recordsRes.json().catch(() => null);
      if (json?.success && Array.isArray(json.records)) {
        const serverRecords = (json.records as ServerRecordRow[]).map(mapServerRecord);
        const serverIds = new Set(serverRecords.map((r) => r.id));
        const serverKeys = new Set(serverRecords.map(recordDedupeKey));
        const current = getStoredClinicalRecords();
        const kept = current.filter((r) => {
          if (serverIds.has(r.id)) return false;
          if (r.id.startsWith("srv-")) return true;
          return !serverKeys.has(recordDedupeKey(r));
        });
        const next = [...serverRecords, ...kept];
        if (JSON.stringify(next) !== JSON.stringify(current)) {
          saveStoredClinicalRecords(next);
          changed = true;
        }
      }
    }

    return changed;
  } catch {
    return false;
  }
}

export function clearClinicalLocalData(): void {
  if (typeof window === "undefined") return;
  [
    STORAGE_APPOINTMENTS_KEY,
    STORAGE_RECORDS_KEY,
    STORAGE_ODONTOGRAM_KEY,
    STORAGE_CONSENTS_KEY,
    STORAGE_BUDGETS_KEY,
  ].forEach((key) => {
    try {
      window.localStorage.removeItem(key);
    } catch {}
  });
}
