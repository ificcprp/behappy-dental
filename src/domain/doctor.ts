export interface DoctorEspecialista {
  id: string;
  nombre: string;
  cargo: string;
  especialidad: string;
  registroSuperintendencia?: string;
  imagen: string;
  biografia: string;
  boxPredeterminado: string;
  horarios?: string;
}
