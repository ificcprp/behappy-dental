export interface FichaClinicaSOAP {
  id: string;
  pacienteId: string;
  doctorNombre: string;
  fecha: string;
  subjetivo?: string;
  objetivo?: string;
  diagnostico: string;
  tratamientoRealizado: string;
  receta?: string;
  proximoPaso?: string;
}

export type EstadoPiezaDental =
  | "sano"
  | "caries"
  | "obturado"
  | "corona"
  | "implante"
  | "extraccion_indicada";

export interface PiezaOdontograma {
  numeroPiezaFDI: number;
  estado: EstadoPiezaDental;
  notasSuperficie?: string;
}
