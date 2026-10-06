export interface TratamientoClinico {
  id: string;
  nombre: string;
  categoria: string;
  etiqueta: string;
  imagen: string;
  descripcionCorta: string;
  descripcionCompleta: string;
  indicacionClinica: string;
  esDestacado: boolean;
  precioEstimadoClp?: number;
}
