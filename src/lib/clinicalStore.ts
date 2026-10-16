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

export function updateStoredAppointmentStatus(
  id: string,
  newStatus: PatientAppointment["status"]
): PatientAppointment[] {
  const current = getStoredAppointments();
  const updated = current.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
  saveStoredAppointments(updated);

  if (typeof window !== "undefined") {
    fetch("/api/citas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
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
