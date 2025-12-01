import type { SelectCliente } from "../generales/interfaces-generales";

export interface ConsultarProyecto {
  id: string;
  _id: string;
  nombre: string
  descripcion: string
  fechaInicio: string
  fechaFin: string
  estado: number
  presupuesto: number
  cliente: SelectCliente
  fecha: string
}

export interface SelectProyecto {
  id: string;
  nombre: string
}

export const EstadoProyecto = {
  ACTIVO: 1,
  EN_PAUSA: 2,
  FINALIZADO: 3,
  CANCELADO: 4,
};

export const EstadoProyectoS: Record<number, string> = {
  1: "ACTIVO",
  2: "EN_PAUSA",
  3: "FINALIZADO",
  4: "CANCELADO",
};