export type EstadoCita =
  | "confirmada"
  | "en_espera"
  | "en_box"
  | "finalizada"
  | "cancelada";

export interface CitaClinica {
  id: string;
  pacienteId?: string;
  pacienteNombre: string;
  pacienteTelefono: string;
  doctorId: string;
  doctorNombre: string;
  tratamientoId: string;
  tratamientoNombre: string;
  fecha: string;
  hora: string;
  box: string; // ej: "Box 1"
  estado: EstadoCita;
  precioTotalClp: number;
  descuentoConvenioClp: number;
  notas?: string;
}
