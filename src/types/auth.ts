export type UserRole = "paciente" | "doctor" | "recepcion" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  rut: string;
  phone: string;
  role: UserRole;
  prevision?: string;
  convenioLevel?: "20%" | "40%" | "60%" | "Ninguno";
  specialty?: string; // For doctors
  avatarUrl?: string;
  createdAt: string;
}

export interface PatientAppointment {
  id: string;
  date: string;
  time: string;
  doctorName: string;
  treatmentName: string;
  status: "confirmada" | "pendiente" | "en_espera" | "en_box" | "completada" | "cancelada";
  box?: string;
  price?: number;
  convenioDiscount?: number;
  patientName?: string;
  patientRut?: string;
  patientPhone?: string;
  notes?: string;
}

export interface ClinicalRecord {
  id: string;
  patientId: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  treatmentPerformed: string;
  prescription?: string;
  nextStep?: string;
}

export interface OdontogramTooth {
  toothNumber: number;
  status: "sano" | "caries" | "obturado" | "corona" | "implante" | "extraccion_indicada";
  surfaceNotes?: string;
}
