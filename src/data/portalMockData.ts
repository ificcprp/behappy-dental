import { UserProfile, PatientAppointment, ClinicalRecord, OdontogramTooth } from "@/types/auth";

export const DEMO_USERS: Record<string, UserProfile> = {
  paciente: {
    id: "usr_paciente_01",
    email: "paciente@behappydental.cl",
    fullName: "Paciente BeHappy",
    rut: "Por registrar",
    phone: "+56 9 4757 8597",
    role: "paciente",
    prevision: "Particular / Fonasa / Isapre",
    convenioLevel: "Ninguno",
    createdAt: new Date().toISOString().split("T")[0]
  },
  doctor: {
    id: "usr_doctor_01",
    email: "dr.lugo@behappydental.cl",
    fullName: "Dr. Johnny Lugo",
    rut: "16.128.940-K",
    phone: "+56 9 4757 8597",
    role: "doctor",
    specialty: "Ortodoncista Especialista (Invisalign®)",
    avatarUrl: "/images/doctors/dr-johnny-lugo.png",
    createdAt: "2024-03-01"
  },
  recepcion: {
    id: "usr_recepcion_01",
    email: "recepcion@behappydental.cl",
    fullName: "Recepción BeHappy",
    rut: "Suecia 3580",
    phone: "+56 9 4757 8597",
    role: "recepcion",
    createdAt: "2024-06-10"
  },
  admin: {
    id: "usr_admin_01",
    email: "ceobehappy@gmail.com",
    fullName: "Dirección Médica & CEO BeHappy",
    rut: "Suecia 3580, OF. 304",
    phone: "+56 9 4757 8597",
    role: "admin",
    createdAt: "2023-11-01"
  }
};

// Citas iniciales en cero para uso real (se van agregando con reservas reales)
export const INITIAL_APPOINTMENTS: PatientAppointment[] = [];

// Ficha clínica inicial en cero para uso real
export const INITIAL_CLINICAL_RECORDS: ClinicalRecord[] = [];

// Odontograma anatómico estándar adulto (32 piezas limpias en estado sano)
export const INITIAL_ODONTOGRAM: OdontogramTooth[] = [
  // Cuadrante 1 (Superior Derecho): 18 a 11
  { toothNumber: 18, status: "sano" },
  { toothNumber: 17, status: "sano" },
  { toothNumber: 16, status: "sano" },
  { toothNumber: 15, status: "sano" },
  { toothNumber: 14, status: "sano" },
  { toothNumber: 13, status: "sano" },
  { toothNumber: 12, status: "sano" },
  { toothNumber: 11, status: "sano" },
  // Cuadrante 2 (Superior Izquierdo): 21 a 28
  { toothNumber: 21, status: "sano" },
  { toothNumber: 22, status: "sano" },
  { toothNumber: 23, status: "sano" },
  { toothNumber: 24, status: "sano" },
  { toothNumber: 25, status: "sano" },
  { toothNumber: 26, status: "sano" },
  { toothNumber: 27, status: "sano" },
  { toothNumber: 28, status: "sano" },
  // Cuadrante 4 (Inferior Derecho): 48 a 41
  { toothNumber: 48, status: "sano" },
  { toothNumber: 47, status: "sano" },
  { toothNumber: 46, status: "sano" },
  { toothNumber: 45, status: "sano" },
  { toothNumber: 44, status: "sano" },
  { toothNumber: 43, status: "sano" },
  { toothNumber: 42, status: "sano" },
  { toothNumber: 41, status: "sano" },
  // Cuadrante 3 (Inferior Izquierdo): 31 a 38
  { toothNumber: 31, status: "sano" },
  { toothNumber: 32, status: "sano" },
  { toothNumber: 33, status: "sano" },
  { toothNumber: 34, status: "sano" },
  { toothNumber: 35, status: "sano" },
  { toothNumber: 36, status: "sano" },
  { toothNumber: 37, status: "sano" },
  { toothNumber: 38, status: "sano" },
];
