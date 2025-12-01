

export interface EstadisticasCompletas {
    generales: EstadisticasGenerales;
    porEstado: EstadisticasPorEstado[];
    porArea: EstadisticasPorArea[];
    porPrioridad: EstadisticasPorPrioridad[];
    porCriticidad: EstadisticasPorCriticidad[];
    tiemposPorEstado: TiemposPorEstado[];

}

export interface EstadisticasGenerales {
    totalReclamos: number;
    reclamosResueltos: number;
    reclamosEnCurso: number;
    reclamosCerrados: number;
    reclamosPendientes: number;
    tiempoPromedioResolucionHoras: number;
    tiempoPromedioResolucionDias: number;
}

export interface EstadisticasPorEstado {
    estado: number;
    cantidad: number;
    porcentaje: number;
}

export interface EstadisticasPorArea {
    areaId: string;
    areaNombre: string;
    cantidad: number;
    porcentaje: number;
}

export interface EstadisticasPorPrioridad {
    prioridad: number;
    cantidad: number;
    porcentaje: number;
}

export interface EstadisticasPorCriticidad {
    criticidad: number;
    cantidad: number;
    porcentaje: number;
}

export interface TiemposPorEstado {
    estado: number;
    tiempoPromedioHoras: number;
    tiempoPromedioDias: number;
}
