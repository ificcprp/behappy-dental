export const CLINIC_INFO = {
  name: "Centro Dental BeHappy",
  tagline: "Sonrisas Felices · Ñuñoa",
  legalName: "Centro Dental BeHappy SpA",
  address: {
    street: "Suecia 3580, OF. 304",
    commune: "Ñuñoa",
    city: "Santiago",
    region: "Región Metropolitana",
    country: "Chile",
    full: "Suecia 3580, OF. 304, Ñuñoa, Región Metropolitana, Chile",
    googleMapsEmbedUrl: "https://maps.google.com/maps?q=Suecia%203580,%20%C3%91u%C3%B1oa&t=m&z=15&ie=UTF8&output=embed",
    googleMapsDirectUrl: "https://maps.google.com/?q=Suecia+3580+Nunoa+Santiago"
  },
  contact: {
    phone: "+56 9 4757 8597",
    phoneClean: "56947578597",
    whatsappNumber: "56947578597",
    email: "ceobehappy@gmail.com",
    instagram: "https://www.instagram.com/dentalbehappynunoa",
    facebook: "https://www.facebook.com"
  },
  hours: {
    weekdays: "Lunes ~ Viernes: 10:00 - 20:00",
    saturday: "Sábado: 10:00 - 18:00",
    sunday: "Domingos y feriados: Cerrado"
  },
  stats: {
    experienceYears: "13+",
    specialistsCount: "8",
    rating: "4.9",
    satisfiedPatients: "4,500+"
  },
  tracking: {
    googleAnalytics: "G-E70JV667YE",
    facebookPixel: "1353498186525546"
  },
  dentalink: {
    agendaUrl: "https://00b229f2077285343f1ffac76fd853c23816acec.agenda.softwaredentalink.com/",
    apiBaseUrl: "https://api.dentalink.healthatom.com/api/v1",
    sucursalId: 1,
    dentistaIds: {
      "dr-johnny-lugo": null,
      "dra-keila-rodriguez": null,
      "dra-gabriela-fernandez": null,
      "dr-juan-jose-herrera": null,
      "dr-william": null,
      "dra-maria-helena": null,
      "dra-natascha-martins": null,
      "dra-maythe-gamboa": null
    } as Record<string, number | null>
  }
};
