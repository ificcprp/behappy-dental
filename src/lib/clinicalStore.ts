import { PatientAppointment, ClinicalRecord, OdontogramTooth } from "@/types/auth";
import { INITIAL_APPOINTMENTS, INITIAL_CLINICAL_RECORDS, INITIAL_ODONTOGRAM } from "@/data/portalMockData";

const STORAGE_APPOINTMENTS_KEY = "behappy_appointments_data";
const STORAGE_RECORDS_KEY = "behappy_clinical_records_data";
const STORAGE_ODONTOGRAM_KEY = "behappy_odontogram_data";
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
