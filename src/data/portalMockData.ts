import { UserProfile, PatientAppointment, ClinicalRecord, OdontogramTooth } from "@/types/auth";

export const DEMO_USERS: Record<string, UserProfile> = {
  paciente: {
    id: "usr_paciente_01",
    email: "constanza.valenzuela@gmail.com",
    fullName: "Constanza Valenzuela Morales",
    rut: "18.492.381-4",
    phone: "+56 9 8834 2911",
    role: "paciente",
    prevision: "Isapre Banmédica",
    convenioLevel: "40%",
    createdAt: "2025-01-15"
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
    fullName: "Camila Soto Navarrete",
    rut: "19.340.521-2",
    phone: "+56 9 4757 8597",
    role: "recepcion",
    createdAt: "2024-06-10"
  },
  admin: {
    id: "usr_admin_01",
    email: "ceobehappy@gmail.com",
    fullName: "Dirección Médica & CEO BeHappy",
    rut: "15.932.100-3",
    phone: "+56 9 4757 8597",
    role: "admin",
    createdAt: "2023-11-01"
  }
};

export const INITIAL_APPOINTMENTS: PatientAppointment[] = [
  {
    id: "cita-101",
    date: "Hoy",
    time: "10:30",
    doctorName: "Dr. Johnny Lugo",
    treatmentName: "Control de Ortodoncia Invisible (Invisalign)",
    status: "en_box",
    box: "Box 1",
    price: 45000,
    convenioDiscount: 18000,
    patientName: "Constanza Valenzuela Morales",
    patientRut: "18.492.381-4",
    patientPhone: "+56 9 8834 2911",
    notes: "Revisión de alineadores etapa 14. Buen avance oclusal."
  },
  {
    id: "cita-102",
    date: "Hoy",
    time: "11:15",
    doctorName: "Dr. Johnny Lugo",
    treatmentName: "Instalación de Brackets Zafiro",
    status: "en_espera",
    box: "Box 1",
    price: 320000,
    convenioDiscount: 128000,
    patientName: "Matías Alarcón Ramos",
    patientRut: "20.184.920-5",
    patientPhone: "+56 9 7721 9402",
    notes: "Paciente en sala de espera. Firmó consentimiento informado."
  },
  {
    id: "cita-103",
    date: "Hoy",
    time: "12:00",
    doctorName: "Dra. Keila Rodríguez González",
    treatmentName: "Diseño de Sonrisa & Carillas",
    status: "confirmada",
    box: "Box 2",
    price: 180000,
    convenioDiscount: 72000,
    patientName: "Francisca Silva Donoso",
    patientRut: "17.409.832-1",
    patientPhone: "+56 9 9123 4567",
    notes: "Prueba de mock-up estético de sector anterior."
  },
  {
    id: "cita-104",
    date: "Hoy",
    time: "15:00",
    doctorName: "Dr. Juan José Herrera",
    treatmentName: "Implante Dental de Titanio",
    status: "confirmada",
    box: "Pabellón Quirúrgico",
    price: 480000,
    convenioDiscount: 192000,
    patientName: "Eduardo Vergara Palma",
    patientRut: "14.590.219-8",
    patientPhone: "+56 9 6543 2198",
    notes: "Cirugía guiada implante pieza 3.6 con injerto particulado."
  },
  {
    id: "cita-105",
    date: "Mañana",
    time: "10:00",
    doctorName: "Dra. Gabriela Fernández",
    treatmentName: "Diagnóstico Clínico Integral + Radiografías",
    status: "pendiente",
    box: "Box 3",
    price: 30000,
    convenioDiscount: 12000,
    patientName: "Rodrigo Toledo Benítez",
    patientRut: "19.821.492-3",
    patientPhone: "+56 9 8456 7890",
    notes: "Pendiente confirmación por WhatsApp."
  }
];

export const INITIAL_CLINICAL_RECORDS: ClinicalRecord[] = [
  {
    id: "rec-01",
    patientId: "usr_paciente_01",
    doctorName: "Dr. Johnny Lugo",
    date: "2025-09-12",
    diagnosis: "Maloclusión Clase II división 1 con apiñamiento anteroinferior moderado.",
    treatmentPerformed: "Escaneo intraoral iTero 3D y entrega de set inicial de alineadores Invisalign (1 al 6). Indicaciones de uso 22 hrs/día.",
    prescription: "Cera de alivio ortodóncico, colutorio con clorhexidina 0.12% por 7 días.",
    nextStep: "Control mensual de cambio de alineador."
  },
  {
    id: "rec-02",
    patientId: "usr_paciente_01",
    doctorName: "Dra. Keila Rodríguez González",
    date: "2025-08-04",
    diagnosis: "Gingivitis marginal inducida por biopelícula en sector posteroinferior.",
    treatmentPerformed: "Destartraje supragingival con ultrasonido Piezon y pulido profiláctico con pasta de grano fino.",
    prescription: "Cepillo dental de cerdas ultra suaves, seda dental con cera.",
    nextStep: "Control preventivo a los 6 meses."
  }
];

export const INITIAL_ODONTOGRAM: OdontogramTooth[] = [
  { toothNumber: 11, status: "sano" },
  { toothNumber: 12, status: "obturado", surfaceNotes: "Resina compuesta vestibular mesial" },
  { toothNumber: 13, status: "sano" },
  { toothNumber: 14, status: "sano" },
  { toothNumber: 15, status: "sano" },
  { toothNumber: 16, status: "corona", surfaceNotes: "Corona de circonio monolítico cementada" },
  { toothNumber: 21, status: "sano" },
  { toothNumber: 22, status: "sano" },
  { toothNumber: 26, status: "caries", surfaceNotes: "Caries esmalte oclusal detectada" },
  { toothNumber: 36, status: "implante", surfaceNotes: "Implante de titanio óseointegrado" },
  { toothNumber: 46, status: "obturado", surfaceNotes: "Incrustación onlay estética" }
];
