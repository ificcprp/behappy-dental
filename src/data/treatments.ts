export type TreatmentCategory =
  | "Tratamientos Estéticos"
  | "Especialidades"
  | "Tratamientos Generales"
  | "Tratamientos"
  | "Prevención";

export interface Treatment {
  id: string;
  name: string;
  slug: string;
  category: TreatmentCategory;
  tag: string;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  image: string;
  recommendedFor: string;
  popular?: boolean;
}

export const TREATMENTS: Treatment[] = [
  // 1. Blanqueamiento Dental
  {
    id: "blanqueamiento-dental",
    name: "Blanqueamiento Dental",
    slug: "blanqueamiento-dental",
    category: "Tratamientos Estéticos",
    tag: "TRATAMIENTOS ESTÉTICOS",
    shortDescription: "Tu camino de vuelta a una sonrisa blanca y luminosa.",
    fullDescription: "Procedimiento profesional en clínica complementado con férulas ambulatorias personalizadas. Aclara hasta 4 a 6 tonos de forma segura y sin dañar el esmalte dental.",
    benefits: [
      "Tecnología LED con mínima o nula sensibilidad",
      "Esmalte 100% protegido bajo supervisión médica",
      "Resultados visibles desde la primera sesión",
      "Kit de mantenimiento ambulatorio incluido"
    ],
    image: "/images/treatments_real/blanqueamiento.jpg",
    recommendedFor: "Pacientes con tinciones por café, té, mate, tabaco o el paso de los años.",
    popular: true
  },

  // 2. Ortodoncia
  {
    id: "ortodoncia",
    name: "Ortodoncia",
    slug: "ortodoncia",
    category: "Tratamientos Estéticos",
    tag: "TRATAMIENTOS ESTÉTICOS",
    shortDescription: "Alineación perfecta para una sonrisa saludable y estética.",
    fullDescription: "Tratamiento correctivo mediante brackets de zafiro estéticos o metálicos de autoligado de baja fricción para alinear los dientes y corregir la oclusión de forma duradera.",
    benefits: [
      "Corrección eficaz de cualquier grado de apiñamiento",
      "Mejora funcional de la masticación y articulación",
      "Opciones de brackets transparentes de zafiro",
      "Controles mensuales con especialistas certificados"
    ],
    image: "/images/treatments_real/ortodoncia.jpg",
    recommendedFor: "Casos de maloclusión, dientes montados o quienes buscan una opción probada y accesible.",
    popular: true
  },

  // 3. Implantes Dentales
  {
    id: "implantes-dentales",
    name: "Implantes Dentales",
    slug: "implantes-dentales",
    category: "Especialidades",
    tag: "ESPECIALIDADES",
    shortDescription: "La única solución que reemplaza la raíz para una sensación 100% natural.",
    fullDescription: "Fijaciones de titanio grado médico que se integran biológicamente al hueso para sostener coronas individuales o puentes fijos con estabilidad y fisonomía total.",
    benefits: [
      "Preserva el hueso maxilar y la fisonomía facial",
      "Masticación idéntica a un diente natural",
      "No desgasta los dientes vecinos",
      "Material biocompatible con garantía clínica"
    ],
    image: "/images/treatments_real/implantes.jpg",
    recommendedFor: "Pérdida de una, varias o todas las piezas dentales.",
    popular: true
  },

  // 4. Radiografías
  {
    id: "radiografias",
    name: "Radiografías",
    slug: "radiografias",
    category: "Tratamientos Generales",
    tag: "TRATAMIENTOS GENERALES",
    shortDescription: "Diagnóstico preciso, tratamiento efectivo.",
    fullDescription: "Imágenes digitales de alta resolución inmediatas en pantalla que permiten ver entre los dientes y el interior del hueso maxilar con mínima radiación.",
    benefits: [
      "Hasta 80% menos radiación que la película tradicional",
      "Resultados digitales en segundos en pantalla clínica",
      "Diagnóstico certero para un tratamiento efectivo y sin sorpresas"
    ],
    image: "/images/treatments_real/radiografias.jpg",
    recommendedFor: "Evaluación inicial, controles y planificación previa a cirugías o endodoncias."
  },

  // 5. Extracción Dental
  {
    id: "extraccion-dental",
    name: "Extracción Dental",
    slug: "extraccion-dental",
    category: "Tratamientos Generales",
    tag: "TRATAMIENTOS GENERALES",
    shortDescription: "Extracciones seguras sin complicaciones, con recuperación rápida.",
    fullDescription: "Remoción conservadora de raíces o piezas no restaurables protegiendo el alveolo óseo para futuras rehabilitaciones con implante o prótesis.",
    benefits: [
      "Técnica atraumática y mínima molestia post-operatoria",
      "Preservación del tejido óseo circundante",
      "Protocolo de anestesia confortable e instrucciones claras"
    ],
    image: "/images/treatments_real/extraccion.jpg",
    recommendedFor: "Dientes no recuperables por caries profunda o fracturas longitudinales."
  },

  // 6. Invisalign
  {
    id: "invisalign",
    name: "Invisalign",
    slug: "invisalign",
    category: "Tratamientos Estéticos",
    tag: "TRATAMIENTOS ESTÉTICOS",
    shortDescription: "Alineación dental invisible con brackets Invisalign.",
    fullDescription: "Alineadores transparentes y removibles con tecnología 3D de última generación. Corrige apiñamientos, espacios y mordidas sin cables metálicos ni heridas.",
    benefits: [
      "100% removible para comer y realizar tu higiene diaria",
      "Prácticamente invisible a la vista",
      "Planificación 3D digital ClinCheck previa",
      "Menos visitas de urgencia y tiempos predecibles"
    ],
    image: "/images/treatments_real/invisalign.jpg",
    recommendedFor: "Adultos y jóvenes que buscan corregir su sonrisa sin alterar su imagen social o laboral.",
    popular: true
  },

  // 7. Coronas Dentales
  {
    id: "coronas-dentales",
    name: "Coronas Dentales",
    slug: "coronas-dentales",
    category: "Tratamientos",
    tag: "TRATAMIENTOS",
    shortDescription: "Fundas protésicas que restauran o protegen dientes debilitados.",
    fullDescription: "Fundas protésicas cerámicas de zirconio y disilicato de alta resistencia que devuelven la fuerza, estética y función a piezas fracturadas o tratadas endodónticamente.",
    benefits: [
      "Materiales libres de metal biocompatibles",
      "Translucidez idéntica al esmalte dental natural",
      "Ajuste milimétrico y sellado hermético marginal"
    ],
    image: "/images/treatments_real/coronas.jpg",
    recommendedFor: "Dientes con grandes destrucciones por caries, fracturas o post-tratamiento de conducto."
  },

  // 8. Revisión Dental
  {
    id: "revision-dental",
    name: "Revisión Dental",
    slug: "revision-dental",
    category: "Prevención",
    tag: "PREVENCIÓN",
    shortDescription: "La importancia de las revisiones dentales periódicas.",
    fullDescription: "Examen clínico minucioso con cámara intraoral y diagnóstico preventivo para detectar problemas antes de que causen dolor o gastos mayores.",
    benefits: [
      "Detección precoz de caries invisibles y problemas de encía",
      "Presupuesto claro, honesto y transparente",
      "Planificación preventiva económica para toda la familia"
    ],
    image: "/images/treatments_real/revision.jpg",
    recommendedFor: "Nuevos pacientes o quienes no han visitado al dentista en más de 6 meses.",
    popular: true
  },

  // 9. Prótesis dentales
  {
    id: "protesis-dentales",
    name: "Prótesis dentales",
    slug: "protesis-dentales",
    category: "Tratamientos",
    tag: "TRATAMIENTOS",
    shortDescription: "Solución versátil para reemplazar dientes, apoyada en tu estructura natural.",
    fullDescription: "Prótesis fijas, flexibles o removibles tradicionales, adaptadas ergonómicamente a la anatomía de tu boca para recuperar la masticación, fonética y sonrisa.",
    benefits: [
      "Recuperación inmediata de la masticación y habla",
      "Ajuste anatómico seguro y confortable",
      "Opciones fijas sobre implantes y removibles de alta estética"
    ],
    image: "/images/treatments_real/protesis.jpg",
    recommendedFor: "Pacientes con pérdida de múltiples piezas dentales."
  },

  // 10. Odontopediatría
  {
    id: "odontopediatria",
    name: "Odontopediatría",
    slug: "odontopediatria",
    category: "Especialidades",
    tag: "ESPECIALIDADES",
    shortDescription: "Cuidado dental divertido y sin miedo para los más pequeños.",
    fullDescription: "Atención adaptada a la psicología del niño: sellantes protectores, fluoración, curaciones suaves y educación de higiene oral en familia en un ambiente cálido.",
    benefits: [
      "Ambiente amigable que elimina la fobia dental desde la infancia",
      "Prevención de caries en dientes temporales y definitivos",
      "Monitoreo del crecimiento y desarrollo maxilofacial"
    ],
    image: "/images/treatments_real/odontopediatria.jpg",
    recommendedFor: "Bebés, niños y adolescentes desde su primer diente.",
    popular: true
  },

  // 11. Limpieza Dental
  {
    id: "limpieza-dental",
    name: "Limpieza Dental",
    slug: "limpieza-dental",
    category: "Prevención",
    tag: "PREVENCIÓN",
    shortDescription: "Prevención experta para encías sanas y aliento fresco.",
    fullDescription: "Remoción profunda de sarro supragingival y subgingival mediante ultrasonido indoloro, pulido con pasta fluorada y eliminación de tinciones superficiales.",
    benefits: [
      "Previene el sangrado de encías y el mal aliento",
      "Elimina placa bacteriana calcificada que el cepillo no remueve",
      "Protección fluorada remineralizante del esmalte"
    ],
    image: "/images/treatments_real/limpieza.jpg",
    recommendedFor: "Toda persona al menos cada 6 meses para mantener encías saludables.",
    popular: true
  },

  // 12. Periodontitis
  {
    id: "periodontitis",
    name: "Periodontitis",
    slug: "periodontitis",
    category: "Especialidades",
    tag: "ESPECIALIDADES",
    shortDescription: "Tratamiento efectivo contra el sangrado y pérdida ósea.",
    fullDescription: "Terapia periodontal especializada que detiene la inflamación y desinfección bacteriana profunda para salvar piezas dentales con movilidad o retracción gingival.",
    benefits: [
      "Detiene el avance de la pérdida de soporte óseo",
      "Elimina el sangrado y la inflamación de encías",
      "Salva tus piezas dentales naturales a largo plazo"
    ],
    image: "/images/treatments_real/periodontitis.jpg",
    recommendedFor: "Encías que sangran al cepillarse, encías enrojecidas o movilidad dental."
  },

  // 13. Extracción muelas del juicio
  {
    id: "extraccion-muelas-juicio",
    name: "Extracción muelas del juicio",
    slug: "extraccion-muelas-juicio",
    category: "Tratamientos",
    tag: "TRATAMIENTOS",
    shortDescription: "Alivia dolor y previene apiñamiento con cirugía experta.",
    fullDescription: "Extracción quirúrgica atraumática realizada por cirujanos dentales experimentados, con protocolos de medicación preventiva para una rápida recuperación.",
    benefits: [
      "Procedimiento rápido con técnica mínimamente invasiva",
      "Evita quistes, infecciones y daño a molares vecinos",
      "Control y acompañamiento post-operatorio guiado"
    ],
    image: "/images/treatments_real/extraccion-muelas-juicio.jpg",
    recommendedFor: "Molares impactados, inclinados, retenidos o que causan apiñamiento."
  },

  // 14. Prevención de caries y periodontitis
  {
    id: "prevencion-de-caries-y-periodontitis",
    name: "Prevención de caries y periodontitis",
    slug: "prevencion-de-caries-y-periodontitis",
    category: "Prevención",
    tag: "PREVENCIÓN",
    shortDescription: "Una sonrisa sana puede durar toda la vida con hábitos simples.",
    fullDescription: "Programa integral preventivo que combina aplicación de barniz de flúor de alta liberación, sellantes de fosas y fisuras y educación técnica en cepillado interproximal.",
    benefits: [
      "Evita tratamientos costosos e invasivos a futuro",
      "Refuerza activamente el esmalte contra el ataque de ácidos",
      "Planes preventivos continuos para toda la familia"
    ],
    image: "/images/treatments_real/prevencion-caries.jpg",
    recommendedFor: "Adultos y niños que desean preservar su dentadura natural intacta."
  },

  // 15. Diseño de Sonrisa
  {
    id: "diseno-de-sonrisa",
    name: "Diseño de Sonrisa",
    slug: "diseno-de-sonrisa",
    category: "Tratamientos Estéticos",
    tag: "TRATAMIENTOS ESTÉTICOS",
    shortDescription: "Armonía, proporción y naturalidad diseñadas exclusivamente para tu rostro.",
    fullDescription: "Evaluación estética integral donde planificamos digitalmente la forma, tamaño y color ideal de tus dientes para lograr una sonrisa radiante y perfectamente balanceada.",
    benefits: [
      "Planificación digital previa a cualquier intervención física",
      "Carillas cerámicas ultrafinas o en resina estratificada",
      "Resultados duraderos y de máxima naturalidad estética"
    ],
    image: "/images/treatments_real/diseno-sonrisa.jpg",
    recommendedFor: "Personas con dientes desgastados, manchas severas o asimetrías faciales.",
    popular: true
  },

  // 16. Protector Bucal (Bruxismo)
  {
    id: "protector-bucal-bruxismo",
    name: "Protector Bucal (Bruxismo)",
    slug: "protector-bucal-bruxismo",
    category: "Tratamientos Generales",
    tag: "TRATAMIENTOS GENERALES",
    shortDescription: "Férulas a medida que protegen tus dientes del rechinar nocturno.",
    fullDescription: "Férula mio-relajante acrílica de alta precisión fabricada a medida para desprogramar la musculatura masticatoria y absorber las fuerzas del rechinamiento involuntario nocturno.",
    benefits: [
      "Protege dientes y coronas de fisuras y desgaste severo",
      "Reduce dolores musculares de mandíbula y dolor de cabeza",
      "Mejora notablemente la calidad y profundidad del descanso"
    ],
    image: "/images/treatments_real/bruxismo.jpg",
    recommendedFor: "Personas con estrés, apretamiento nocturno o dolor de mandíbula matutino."
  },

  // 17. Caries dental
  {
    id: "caries-dental",
    name: "Caries dental",
    slug: "caries-dental",
    category: "Tratamientos Generales",
    tag: "TRATAMIENTOS GENERALES",
    shortDescription: "Elimina la caries y restaura la fuerza de tu diente.",
    fullDescription: "Remoción minuciosa del tejido cariado y reconstrucción anatómica estética con resinas compuestas de última generación, con acabado pulido e imperceptible.",
    benefits: [
      "Restaura la resistencia y anatomía original de la pieza",
      "Materiales estéticos del color exacto de tu esmalte",
      "Detiene el avance de la infección antes de llegar al nervio"
    ],
    image: "/images/treatments_real/caries.jpg",
    recommendedFor: "Caries iniciales o profundas y reemplazo de amalgamas oscuras."
  },

  // 18. Endodoncia (Tratamiento de conducto)
  {
    id: "endodoncia-tratamiento-de-conducto",
    name: "Endodoncia (Tratamiento de conducto)",
    slug: "endodoncia-tratamiento-de-conducto",
    category: "Especialidades",
    tag: "ESPECIALIDADES",
    shortDescription: "Salva tus dientes dañados y elimina el dolor de raíz.",
    fullDescription: "Eliminación del nervio dental infectado o inflamado con instrumentación mecanizada, desinfección química profunda y obturación hermética que conserva tu diente en boca.",
    benefits: [
      "Alivio inmediato y definitivo del dolor agudo de muela",
      "Permite conservar tu propio diente natural",
      "Realizado con técnicas de anestesia localizada 100% confortables"
    ],
    image: "/images/treatments_real/endodoncia.jpg",
    recommendedFor: "Dolor pulsátil, sensibilidad extrema al calor/frío o abscesos dentales."
  },

  // 19. Reconstrucción de Mordida
  {
    id: "reconstruccion-mordida",
    name: "Reconstrucción de Mordida",
    slug: "reconstruccion-mordida",
    category: "Tratamientos Generales",
    tag: "TRATAMIENTOS GENERALES",
    shortDescription: "Recupera la función masticatoria y protege tu articulación.",
    fullDescription: "Tratamiento integral multidisciplinario que restablece la altura y alineación oclusal perdida por desgaste severo o pérdida de piezas dentales posteriores.",
    benefits: [
      "Alivia dolores de la articulación temporomandibular (ATM)",
      "Detiene el desgaste acelerado y colapso de la mordida",
      "Restaura la armonía y altura facial estética"
    ],
    image: "/images/treatments_real/reconstruccion-mordida.jpg",
    recommendedFor: "Desgaste severo por bruxismo crónico o colapso de mordida posterior."
  },

  // 20. Anestesia
  {
    id: "anestesia",
    name: "Anestesia",
    slug: "anestesia",
    category: "Tratamientos Generales",
    tag: "TRATAMIENTOS GENERALES",
    shortDescription: "Procedimientos sin dolor con técnicas seguras y confortables.",
    fullDescription: "Protocolos avanzados de insensibilización y confort que incluyen gel anestésico tópico previo, técnicas de inyección lenta y un trato empático para una experiencia sin estrés ni dolor.",
    benefits: [
      "Procedimientos 100% indoloros y tranquilos",
      "Aplicación previa de anestesia tópica sin pinchazos bruscos",
      "Atención cálida ideal para pacientes con aprensión o fobia dental"
    ],
    image: "/images/treatments_real/anestesia.jpg",
    recommendedFor: "Todo paciente que requiera procedimientos clínicos con máxima tranquilidad y cero dolor."
  }
];

export const CATEGORIES = [
  "Todos",
  "Tratamientos Estéticos",
  "Especialidades",
  "Tratamientos Generales",
  "Tratamientos",
  "Prevención"
] as const;
