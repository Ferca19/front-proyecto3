import type { SelectProyecto } from "../gestion-proyecto/interfaces-proyecto";
import type { Area, Usuario } from "../gestion-usuario/interfaces-usuario";

 


export interface Reclamo {
    id: string;
    _id: string;
    titulo: string;
    descripcion: string;
    estado: number;
    tipo: number;
    prioridad?: number;
    criticidad?: number;
    proyecto: SelectProyecto
    fechaCalificacion: string;
    fechaCierre: string;
    clienteId: string;
    areaId: string;
    area: Area;
    calificacion: number;
    asignadoA?: string;
    comentarioCliente: string;
    imagen_url: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}


export interface HistorialReclamo {
    id: string;
    tipoEvento: number;
    descripcion: string;
    reclamoId: string;
    usuarioId: string;
    estadoAnterior: number;
    estadoNuevo: number;
    prioridadAnterior: number;
    prioridadNueva: number;
    criticidadAnterior: number;
    criticidadNueva: number;
    areaAnteriorId: string;
    areaNuevaId: string;
    usuario: Usuario;
    createdAt: string;

}

export const TipoEventoHistorial = {
    CREACION: 1,
    ASIGNACION: 2,
    REASIGNACION: 3,
    CAMBIO_ESTADO: 4,
    CAMBIO_PRIORIDAD: 5,
    CAMBIO_CRITICIDAD: 6,
    COMENTARIO_INTERNO: 7,
    ARCHIVO_ADJUNTO: 8,
    CIERRE: 9,
    CALIFICACION: 10,
    CANCELACION: 11,
}





export const EstadoReclamo = {
    PENDIENTE: 1,
    ASIGNADO: 2,
    EN_ANALISIS: 3,
    EN_PROGRESO: 4,
    RESUELTO: 5,
    CERRADO: 6,
    CANCELADO: 7,
}

export const EstadoReclamoS: Record<number, string> = {
    1: 'PENDIENTE',
    2: 'ASIGNADO',
    3: 'EN_ANALISIS',
    4: 'EN_PROGRESO',
    5: 'RESUELTO',
    6: 'CERRADO',
    7: 'CANCELADO',
}

export const TipoReclamo = {
    TECNICO: 1,
    ADMINISTRATIVO: 2,
    FACTURACION: 3,
    SOPORTE: 4,
    CONSULTA: 5,
    GARANTIA: 6,
    OTRO: 7,
}

export const TipoReclamoS: Record<number, string> = {
    1: 'TECNICO',
    2: 'ADMINISTRATIVO',
    3: 'FACTURACION',
    4: 'SOPORTE',
    5: 'CONSULTA',
    6: 'GARANTIA',
    7: 'OTRO',
}

export const CriticidadReclamo = {
    BAJA: 1,
    MEDIA: 2,
    ALTA: 3,
    CRITICA: 4,
}

export const CriticidadReclamoS: Record<number, string> = {
    1: 'BAJA',
    2: 'MEDIA',
    3: 'ALTA',
    4: 'CRITICA',
}

export const PrioridadReclamo = {
    BAJA: 1,
    MEDIA: 2,
    ALTA: 3,
    URGENTE: 4,
}

export const PrioridadReclamoS: Record<number, string> = {
    1: 'BAJA',
    2: 'MEDIA',
    3: 'ALTA',
    4: 'URGENTE',
}



export interface Comentario {
  _id: string;
  contenido: string;
  reclamoId: string;
  usuario: Usuario;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date | null;
}

export interface SelectArea {
    id: string;
    nombre: string;
}
