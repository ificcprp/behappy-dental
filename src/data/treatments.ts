export interface Treatment {
  id: string;
  name: string;
  slug: string;
  category: "Ortodoncia" | "Estética Dental" | "Implantes y Rehabilitación" | "Prevención y Salud" | "Cirugía y Endodoncia" | "Infantil y Diagnóstico";
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  image?: string;
  recommendedFor: string;
  popular?: boolean;
}

export const TREATMENTS: Treatment[] = [
  // 1. Ortodoncia
  {
    id: "invisalign",
    name: "Invisalign® (Alineadores Invisibles)",
    slug: "invisalign",
    category: "Ortodoncia",
    shortDescription: "Alineación dental transparente y removible con tecnología 3D de última generación.",
    fullDescription: "El sistema de ortodoncia más cómodo, discreto y avanzado del mundo. Corrige apiñamientos, espacios y mordidas sin brackets metálicos ni heridas.",
    benefits: ["100% removible para comer y cepillarte", "Prácticamente invisible a la vista", "Menos visitas al sillón y tiempos predecibles", "Planificación 3D digital ClinCheck"],
    recommendedFor: "Adultos y jóvenes que buscan corregir su sonrisa sin alterar su imagen social o laboral.",
    popular: true
  },
  {
    id: "ortodoncia",
    name: "Ortodoncia Convencional y Estética",
    slug: "ortodoncia",
    category: "Ortodoncia",
    shortDescription: "Alineación perfecta para una sonrisa saludable, funcional y estéticamente equilibrada.",
    fullDescription: "Tratamiento correctivo mediante brackets de zafiro estéticos o metálicos de autoligado de baja fricción para alinear los dientes y corregir la oclusión.",
    benefits: ["Corrección eficaz de cualquier grado de apiñamiento", "Mejora funcional de la masticación", "Opciones de brackets transparentes de zafiro"],
    recommendedFor: "Casos complejos de maloclusión o quienes buscan una opción probada y accesible."
  },

  // 2. Estética Dental
  {
    id: "diseno-de-sonrisa",
    name: "Diseño de Sonrisa",
    slug: "diseno-de-sonrisa",
    category: "Estética Dental",
    shortDescription: "Armonía, proporción y naturalidad diseñadas exclusivamente a la medida de tu rostro.",
    fullDescription: "Evaluación estética integral donde planificamos digitalmente la forma, tamaño y color ideal de tus dientes para lograr una sonrisa radiante y proporcionada.",
    benefits: ["Planificación digital previa a cualquier intervención", "Carillas cerámicas ultrafinas o en resina estratificada", "Resultados duraderos y de máxima naturalidad"],
    recommendedFor: "Personas con dientes desgastados, manchas severas o asimetrías que desean una transformación armónica.",
    popular: true
  },
  {
    id: "blanqueamiento-dental",
    name: "Blanqueamiento Dental LED",
    slug: "blanqueamiento-dental",
    category: "Estética Dental",
    shortDescription: "Tu camino de vuelta a una sonrisa blanca, luminosa y sin dañar el esmalte.",
    fullDescription: "Procedimiento profesional en clínica complementado con férulas ambulatorias personalizadas. Aclara hasta 4 a 6 tonos de forma segura y controlada.",
    benefits: ["Tecnología LED con mínima o nula sensibilidad", "Esmalte 100% protegido bajo supervisión médica", "Resultados visibles en la primera sesión"],
    image: "/images/treatments/blanqueamiento.jpg",
    recommendedFor: "Pacientes con tinciones por café, té, mate, tabaco o el paso de los años.",
    popular: true
  },

  // 3. Implantes y Rehabilitación
  {
    id: "implantes-dentales",
    name: "Implantes Dentales Osteointegrados",
    slug: "implantes-dentales",
    category: "Implantes y Rehabilitación",
    shortDescription: "La única solución definitiva que reemplaza la raíz para una sensación 100% natural.",
    fullDescription: "Fijaciones de titanio grado médico que se integran biológicamente al hueso para sostener coronas individuales o puentes fijos con estabilidad total.",
    benefits: ["Preserva el hueso maxilar y la fisonomía facial", "Masticación idéntica a un diente natural", "No desgasta los dientes vecinos"],
    image: "/images/treatments/implantes.jpg",
    recommendedFor: "Pérdida de una, varias o todas las piezas dentales.",
    popular: true
  },
  {
    id: "coronas-dentales",
    name: "Coronas y Puentes Dentales",
    slug: "coronas-dentales",
    category: "Implantes y Rehabilitación",
    shortDescription: "Fundas protésicas de zirconio y disilicato que restauran y protegen dientes debilitados.",
    fullDescription: "Recubrimientos cerámicos de alta resistencia fabricados con tecnología CAD/CAM que devuelven la fuerza y estética a piezas fracturadas o tratadas endodónticamente.",
    benefits: ["Materiales libres de metal biocompatibles", "Translucidez idéntica al esmalte dental natural", "Ajuste milimétrico y sellado perfecto"],
    recommendedFor: "Dientes con grandes destrucciones por caries, fracturas o post-tratamiento de conducto."
  },
  {
    id: "protesis-dentales",
    name: "Prótesis Dentales",
    slug: "protesis-dentales",
    category: "Implantes y Rehabilitación",
    shortDescription: "Solución versátil para reemplazar múltiples dientes con máxima comodidad y estética.",
    fullDescription: "Prótesis fijas sobre implantes, flexibles o removibles tradicionales, adaptadas ergonómicamente a la anatomía de tu boca.",
    benefits: ["Recuperación inmediata de la masticación y fonética", "Ajuste anatómico seguro", "Opciones fijas y semifijas"],
    recommendedFor: "Pacientes con pérdida de múltiples piezas dentales."
  },
  {
    id: "reconstruccion-mordida",
    name: "Reconstrucción de Mordida y Oclusión",
    slug: "reconstruccion-mordida",
    category: "Implantes y Rehabilitación",
    shortDescription: "Recupera la función masticatoria y protege la articulación temporomandibular (ATM).",
    fullDescription: "Tratamiento multidisciplinario que restablece la altura y alineación oclusal perdida por desgaste severo o pérdida de piezas posteriores.",
    benefits: ["Alivia dolores articulares y de cabeza", "Detiene el desgaste acelerado de los dientes", "Restaura la altura facial juvenil"],
    recommendedFor: "Desgaste severo por bruxismo crónico o mordidas colapsadas."
  },

  // 4. Prevención y Salud
  {
    id: "limpieza-dental",
    name: "Limpieza Dental Profesional (Destartraje + Profilaxis)",
    slug: "limpieza-dental",
    category: "Prevención y Salud",
    shortDescription: "Prevención experta con ultrasonido para encías sanas y aliento fresco.",
    fullDescription: "Remoción profunda de sarro supragingival y subgingival mediante ultrasonido indoloro, pulido con pasta fluorada y eliminación de tinciones superficiales.",
    benefits: ["Previene el sangrado de encías y mal aliento", "Elimina placa bacteriana que el cepillo no alcanza", "Protección fluorada remineralizante"],
    recommendedFor: "Toda persona al menos cada 6 meses para evitar tratamientos costosos.",
    popular: true
  },
  {
    id: "protector-bucal-bruxismo",
    name: "Plano de Alivio y Protector para Bruxismo",
    slug: "protector-bucal-bruxismo",
    category: "Prevención y Salud",
    shortDescription: "Férulas mio-relajantes a medida que protegen tus dientes del apretamiento nocturno.",
    fullDescription: "Dispositivo acrílico de alta precisión diseñado para desprogramar la musculatura masticatoria y absorber las fuerzas del rechinamiento involuntario.",
    benefits: ["Protege coronas y esmalte de fisuras y fracturas", "Reduce dolores de cuello, mandíbula y cefaleas matutinas", "Mejora la calidad del descanso"],
    image: "/images/treatments/bruxismo.jpeg",
    recommendedFor: "Personas con estrés, dolor de mandíbula al despertar o desgaste visible de los bordes dentales."
  },
  {
    id: "periodontitis",
    name: "Tratamiento Periodontal y de Encías",
    slug: "periodontitis",
    category: "Prevención y Salud",
    shortDescription: "Tratamiento clínico eficaz contra el sangrado gingival y la pérdida de soporte óseo.",
    fullDescription: "Terapia periodontal que detiene la inflamación y desinfección bacteriana profunda para salvar piezas con movilidad o retracción de encía.",
    benefits: ["Detiene el avance de la pérdida ósea", "Elimina el sangrado y la inflamación de encías", "Salva dientes naturales"],
    recommendedFor: "Encías que sangran al cepillarse, encías rojas o dientes con sensación de flojedad."
  },
  {
    id: "revision-dental",
    name: "Evaluación Diagnóstica Preventiva",
    slug: "revision-dental",
    category: "Prevención y Salud",
    shortDescription: "Detectamos problemas incipientes antes de que se conviertan en dolor o gastos mayores.",
    fullDescription: "Examen clínico minucioso con cámara intraoral y radiografías digitales para chequear dientes, encías, restauraciones previas y oclusión.",
    benefits: ["Presupuesto claro y transparente sin sorpresas", "Planificación preventiva económica", "Detección precoz de caries invisibles"],
    recommendedFor: "Nuevos pacientes o quienes no han visitado al dentista en más de un año.",
    popular: true
  },

  // 5. Cirugía y Endodoncia
  {
    id: "endodoncia-tratamiento-de-conducto",
    name: "Endodoncia (Tratamiento de Conducto)",
    slug: "endodoncia-tratamiento-de-conducto",
    category: "Cirugía y Endodoncia",
    shortDescription: "Salva tu diente natural y elimina el dolor de raíz en una o dos sesiones.",
    fullDescription: "Eliminación del nervio dental infectado o inflamado con instrumentación mecanizada, desinfección química profunda y obturación tridimensional hermética.",
    benefits: ["Alivio inmediato del dolor agudo de muela", "Permite conservar tu propio diente en boca", "Realizado con anestesia localizada 100% confortable"],
    recommendedFor: "Dolor pulsátil, sensibilidad intensa al calor/frío o abscesos dentales."
  },
  {
    id: "extraccion-muelas-juicio",
    name: "Cirugía de Muelas del Juicio (Terceros Molares)",
    slug: "extraccion-muelas-juicio",
    category: "Cirugía y Endodoncia",
    shortDescription: "Alivia el dolor, previene infecciones y evita el apiñamiento de tu ortodoncia.",
    fullDescription: "Extracción quirúrgica atraumática realizada por cirujanos dentales experimentados, con protocolos de medicación preventiva para una recuperación rápida y sin dolor.",
    benefits: ["Procedimiento rápido con técnica mínimamente invasiva", "Evita quistes y daños a los molares vecinos", "Control post-operatorio guiado"],
    recommendedFor: "Molares impactados, inclinados, retenidos o que causan inflamación recurrente."
  },
  {
    id: "extraccion-dental",
    name: "Extracción Dental Simple y Quirúrgica",
    slug: "extraccion-dental",
    category: "Cirugía y Endodoncia",
    shortDescription: "Extracciones seguras y sin complicaciones con anestesia confortable.",
    fullDescription: "Remoción conservadora de raíces o piezas no restaurables protegiendo el alveolo óseo para futuras rehabilitaciones con implante.",
    benefits: ["Mínima molestia post-operatoria", "Cuidado del tejido óseo circundante", "Instrucciones claras de cuidados inmediatos"],
    recommendedFor: "Dientes no recuperables o con fracturas longitudinales."
  },

  // 6. Infantil y Diagnóstico
  {
    id: "odontopediatria",
    name: "Odontopediatría Integral",
    slug: "odontopediatria",
    category: "Infantil y Diagnóstico",
    shortDescription: "Cuidado dental divertido, respetuoso y sin miedos para los más pequeños del hogar.",
    fullDescription: "Atención adaptada a la psicología del niño: sellantes protectores, fluoración, curaciones suaves y educación de higiene oral en familia.",
    benefits: ["Ambiente amigable y cariñoso que elimina la fobia dental", "Prevención de caries en dientes de leche y definitivos", "Monitoreo del crecimiento maxilar"],
    image: "/images/treatments/odontopediatria.jpg",
    recommendedFor: "Bebés, niños y adolescentes desde su primer diente.",
    popular: true
  },
  {
    id: "radiografias",
    name: "Radiografías Dentales Digitales",
    slug: "radiografias",
    category: "Infantil y Diagnóstico",
    shortDescription: "Diagnóstico preciso con mínima radiación gracias a sensores digitales de alta definición.",
    fullDescription: "Imágenes de alta resolución inmediatas en pantalla que permiten ver entre los dientes y el interior del hueso maxilar.",
    benefits: ["Hasta 80% menos radiación que la película tradicional", "Resultados en segundos", "Diagnóstico certero para un tratamiento efectivo"],
    image: "/images/treatments/radiografias.jpeg",
    recommendedFor: "Complemento obligatorio para diagnósticos certeros en evaluación inicial o cirugías."
  }
];

export const CATEGORIES = [
  "Todos",
  "Ortodoncia",
  "Estética Dental",
  "Implantes y Rehabilitación",
  "Prevención y Salud",
  "Cirugía y Endodoncia",
  "Infantil y Diagnóstico"
] as const;
