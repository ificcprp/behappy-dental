export type PrevisionSalud =
  | "Fonasa"
  | "Isapre Banmédica"
  | "Isapre Colmena"
  | "Isapre Cruz Blanca"
  | "Isapre Consalud"
  | "Particular"
  | "Convenio BeHappy";

export interface Paciente {
  id: string;
  email: string;
  nombreCompleto: string;
  rut: string;
  telefono: string;
  prevision: PrevisionSalud;
  porcentajeConvenio: number; // e.g. 20, 40
  activo: boolean;
  creadoEn: string;
}
