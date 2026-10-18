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
  specialty?: string; // For doctors (e.g. Ortodoncia, Implantes)
  boxAssigned?: string; // For doctors (e.g. Box 1, Box 2)
  clinicalRegistrationNumber?: string; // For doctors (Registro SIS / Superintendencia)
  shift?: string; // For recepcion (e.g. Turno Mañana, Tarde, Completo)
  assignedDesk?: string; // For recepcion (e.g. Recepción Central Suecia 3580)
  positionTitle?: string; // For admin (e.g. Dirección Médica, Administración Central)
  emergencyContact?: string; // For pacientes (Nombre y teléfono de contacto)
  avatarUrl?: string;
  password?: string; // For credential management and handoff
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
  patientEmail?: string;
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

export interface InformedConsent {
  id: string;
  patientId: string;
  patientName: string;
  patientRut: string;
  doctorName: string;
  procedureType: "cirugia_exodoncia" | "endodoncia" | "implantes" | "ortodoncia" | "estetica";
  title: string;
  signedDate: string;
  signatureDataUrl?: string;
  status: "firmado" | "pendiente";
  witnessName?: string;
}

export interface BudgetItem {
  id: string;
  toothNumber?: number;
  procedureName: string;
  phase: "fase1_preventiva" | "fase2_curativa" | "fase3_rehabilitadora";
  basePrice: number;
  convenioDiscount: number;
  finalCopay: number;
  notes?: string;
}

export interface DentalBudget {
  id: string;
  patientId: string;
  patientName: string;
  patientRut: string;
  date: string;
  items: BudgetItem[];
  totalBasePrice: number;
  totalDiscount: number;
  totalCopay: number;
  status: "propuesto" | "aceptado" | "pagado_abono" | "completado";
  flowOrderId?: string;
}
