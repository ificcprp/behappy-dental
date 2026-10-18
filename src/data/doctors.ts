export interface Doctor {
  id: string;
  name: string;
  slug: string;
  role: string;
  specialty: string;
  description: string;
  image: string;
  tags: string[];
  schedule: string;
  // Campos Enterprise CMS
  sisRegistrationNumber?: string;
  universityDegree?: string;
  isAvailableOnline?: boolean;
  assignedBox?: "Box 1" | "Box 2" | "Box 3";
  allowedTreatmentIds?: string[];
}

export const DOCTORS: Doctor[] = [
  {
    id: "dr-johnny-lugo",
    name: "Dr. Johnny Lugo",
    slug: "dr-johnny-lugo",
    role: "Ortodoncista Especialista",
    specialty: "Ortodoncia e Invisalign®",
    description: "Especialista certificado en alineación dental invisible Invisalign y ortodoncia correctiva de alta precisión con más de 10 años de experiencia clínica.",
    image: "/images/doctors/dr-johnny-lugo.png",
    tags: ["Invisalign", "Brackets", "Alineadores"],
    schedule: "Lunes a Viernes 10:00 - 20:00 / Sábado 10:00 - 18:00 (Previa reserva)",
    assignedBox: "Box 1",
    sisRegistrationNumber: "SIS-84920",
    universityDegree: "Univ. Central de Venezuela / Revalidación Univ. de Chile · Especialista en Ortodoncia",
    isAvailableOnline: true
  },
  {
    id: "dra-keila-rodriguez",
    name: "Dra. Keila Rodríguez González",
    slug: "dra-keila-rodriguez-gonzalez",
    role: "Rehabilitadora Estética",
    specialty: "Odontología Estética y Restauradora",
    description: "Especializada en diseño de sonrisa personalizado, carillas de porcelana y resina de alta estética, devolviendo armonía y naturalidad al rostro.",
    image: "/images/doctors/dra-keila-rodriguez.png",
    tags: ["Diseño de Sonrisa", "Carillas", "Blanqueamiento"],
    schedule: "Lunes a Viernes 10:00 - 20:00 / Sábado 10:00 - 18:00 (Previa reserva)",
    assignedBox: "Box 2",
    sisRegistrationNumber: "SIS-85104",
    universityDegree: "Universidad de Los Andes · Especialista en Odontología Restauradora y Estética",
    isAvailableOnline: true
  },
  {
    id: "dra-gabriela-fernandez",
    name: "Dra. Gabriela Fernández",
    slug: "dra-gabriela-fernandez",
    role: "Ortodoncista Especialista",
    specialty: "Ortodoncia y Ortopedia Dentomaxilofacial",
    description: "Certificada en sistemas Invisalign y ortodoncia interceptiva en adolescentes y adultos, enfocada en salud funcional de la articulación.",
    image: "/images/doctors/dra-gabriela-fernandez.png",
    tags: ["Ortodoncia", "Invisalign", "Mordida"],
    schedule: "Lunes a Viernes 10:00 - 20:00 / Sábado 10:00 - 18:00 (Previa reserva)",
    assignedBox: "Box 1",
    sisRegistrationNumber: "SIS-86412",
    universityDegree: "Universidad Mayor · Especialista en Ortodoncia y Ortopedia Dentomaxilofacial",
    isAvailableOnline: true
  },
  {
    id: "dr-juan-jose-herrera",
    name: "Dr. Juan José Herrera",
    slug: "dr-juan-jose-herrera",
    role: "Periodoncista e Implantólogo",
    specialty: "Periodoncia e Implantes Dentales",
    description: "Especialista en regeneración ósea, tratamiento avanzado de encías y colocación de implantes de titanio que devuelven la función 100% natural.",
    image: "/images/doctors/dr-juan-jose-herrera.png",
    tags: ["Implantes", "Periodoncia", "Cirugía"],
    schedule: "Lunes a Viernes 10:00 - 20:00 / Sábado 10:00 - 18:00 (Previa reserva)",
    assignedBox: "Box 3",
    sisRegistrationNumber: "SIS-83719",
    universityDegree: "Universidad de Concepción · Especialista en Periodoncia e Implantología Quirúrgica",
    isAvailableOnline: true
  },
  {
    id: "dr-william",
    name: "Dr. William",
    slug: "dr-william",
    role: "Odontopediatra Especialista",
    specialty: "Odontología Infantil",
    description: "Enfoque empático, libre de ansiedad y lúdico para niños y adolescentes. Prevención temprana y cuidado del desarrollo dental infantil.",
    image: "/images/doctors/dr-william.png",
    tags: ["Niños", "Prevención", "Sin Dolor"],
    schedule: "Lunes a Viernes 10:00 - 20:00 / Sábado 10:00 - 18:00 (Previa reserva)",
    assignedBox: "Box 2",
    sisRegistrationNumber: "SIS-87291",
    universityDegree: "Universidad de Chile · Especialista en Odontopediatría Integral",
    isAvailableOnline: true
  },
  {
    id: "dra-maria-helena",
    name: "Dra. María Helena",
    slug: "dra-maria-helena",
    role: "Especialista en Prótesis Dental",
    specialty: "Rehabilitación Oral y Prótesis",
    description: "Experta en prótesis fijas, removibles y materiales de vanguardia para pacientes que buscan recuperar la función masticatoria completa.",
    image: "/images/doctors/dra-maria-helena.png",
    tags: ["Prótesis", "Coronas", "Rehabilitación"],
    schedule: "Lunes a Viernes 10:00 - 20:00 / Sábado 10:00 - 18:00 (Previa reserva)",
    assignedBox: "Box 2",
    sisRegistrationNumber: "SIS-84115",
    universityDegree: "Universidad de Chile · Especialista en Rehabilitación Oral y Prótesis Fija",
    isAvailableOnline: true
  },
  {
    id: "dra-natascha-martins",
    name: "Dra. Natascha Martins",
    slug: "dra-natascha-martins",
    role: "Endodoncista Especializada",
    specialty: "Endodoncia y Tratamiento de Conducto",
    description: "Manejo del dolor agudo y salvamento de piezas dentales comprometidas mediante instrumentación rotatoria y tecnología microscópica sin dolor.",
    image: "/images/doctors/dra-natascha-martins.png",
    tags: ["Tratamiento de Conducto", "Urgencias", "Sin Dolor"],
    schedule: "Lunes a Viernes 10:00 - 20:00 / Sábado 10:00 - 18:00 (Previa reserva)",
    assignedBox: "Box 1",
    sisRegistrationNumber: "SIS-85930",
    universityDegree: "Universidad de Valparaíso · Especialista en Endodoncia Mecanizada",
    isAvailableOnline: true
  },
  {
    id: "dra-maythe-gamboa",
    name: "Dra. Maythe Gamboa",
    slug: "dra-maythe-gamboa",
    role: "Patóloga Estomatológica",
    specialty: "Patología y Medicina Bucal",
    description: "Diagnóstico temprano y tratamiento especializado de lesiones de mucosa oral, glándulas salivales y salud bucal integral.",
    image: "/images/doctors/dra-maythe-gamboa.png",
    tags: ["Diagnóstico", "Medicina Bucal", "Prevención"],
    schedule: "Lunes a Viernes 10:00 - 20:00 / Sábado 10:00 - 18:00 (Previa reserva)",
    assignedBox: "Box 2",
    sisRegistrationNumber: "SIS-88204",
    universityDegree: "Universidad de Chile · Especialista en Medicina y Patología Bucal",
    isAvailableOnline: true
  }
];
