
import { Calendar, ArrowRight, UserPlus, X, CheckCircle2, RefreshCw, FilePlus, UserCheck, Flag, Flame, MessageSquare, Paperclip, Star, XCircle } from "lucide-react";

import { CriticidadReclamo, EstadoReclamo, PrioridadReclamo, TipoEventoHistorial, type HistorialReclamo } from "../../../interfaces/gestion-reclamo/interfaces-reclamo";
import { Badge } from "../../ui/Badge";
import { useEffect, useRef } from "react";

export interface StatusConfig {
  label: string;
  color: string;
}

export const getStatusConfig = (status: number): StatusConfig => {
  switch (status) {

    case EstadoReclamo.PENDIENTE: // PENDIENTE
      return { 
        label: "Pendiente", 
        color: "bg-yellow-50 text-yellow-700 border-yellow-200" 
      };

    case EstadoReclamo.ASIGNADO: // ASIGNADO
      return { 
        label: "Asignado", 
        color: "bg-blue-50 text-blue-700 border-blue-200" 
      };

    case EstadoReclamo.EN_ANALISIS: // EN_ANALISIS
      return { 
        label: "En Análisis", 
        color: "bg-indigo-50 text-indigo-700 border-indigo-200" 
      };

    case EstadoReclamo.EN_PROGRESO: // EN_PROGRESO
      return { 
        label: "En Progreso", 
        color: "bg-amber-50 text-amber-700 border-amber-200" 
      };

    case EstadoReclamo.RESUELTO: // RESUELTO
      return { 
        label: "Resuelto", 
        color: "bg-green-50 text-green-700 border-green-200" 
      };

    case EstadoReclamo.CERRADO: // CERRADO
      return { 
        label: "Cerrado", 
        color: "bg-emerald-50 text-emerald-700 border-emerald-200" 
      };

    case EstadoReclamo.CANCELADO: // CANCELADO
      return { 
        label: "Cancelado", 
        color: "bg-gray-100 text-gray-700 border-gray-300" 
      };

    default:
      return { 
        label: "Sin Estado", 
        color: "bg-gray-100 text-gray-600 border-gray-200" 
      };
  }
};


export const getPriorityConfig = (priority: number): StatusConfig => {
  switch (priority) {

    case PrioridadReclamo.BAJA: // BAJA
      return { 
        label: "Baja", 
        color: "bg-slate-100 text-slate-600 border-slate-200" 
      };

    case PrioridadReclamo.MEDIA: // MEDIA
      return { 
        label: "Media", 
        color: "bg-yellow-50 text-yellow-600 border-yellow-200" 
      };

    case PrioridadReclamo.ALTA: // ALTA
      return { 
        label: "Alta", 
        color: "bg-orange-50 text-orange-600 border-orange-200" 
      };

    case PrioridadReclamo.URGENTE: // URGENTE
      return { 
        label: "Urgente", 
        color: "bg-red-50 text-red-700 border-red-300" 
      };

    default:
      return { 
        label: "-", 
        color: "bg-gray-50 text-gray-400 border-gray-200" 
      };
  }
};

export const getCriticidadConfig = (criticidad: number): StatusConfig => {
  switch (criticidad) {

    case CriticidadReclamo.BAJA: // BAJA
      return { 
        label: "Baja", 
        color: "bg-slate-100 text-slate-600 border-slate-200" 
      };

    case CriticidadReclamo.MEDIA: // MEDIA
      return { 
        label: "Media", 
        color: "bg-yellow-50 text-yellow-600 border-yellow-200" 
      };

    case CriticidadReclamo.ALTA: // ALTA
      return { 
        label: "Alta", 
        color: "bg-orange-50 text-orange-600 border-orange-200" 
      };

    case CriticidadReclamo.CRITICA: // CRITICA
      return { 
        label: "Critica", 
        color: "bg-red-50 text-red-700 border-red-300" 
      };

    default:
      return { 
        label: "-", 
        color: "bg-gray-50 text-gray-400 border-gray-200" 
      };
  }
};


export const getEventConfig = (type: number) => {
  switch (type) {

    case TipoEventoHistorial.CREACION: // CREACION
      return { title: "Reclamo Creado", color: "text-blue-600", bg: "bg-blue-600" };

    case TipoEventoHistorial.ASIGNACION: // ASIGNACION
      return { title: "Asignación", color: "text-indigo-600", bg: "bg-indigo-600" };

    case TipoEventoHistorial.REASIGNACION: // REASIGNACION
      return { title: "Reasignación", color: "text-purple-600", bg: "bg-purple-600" };

    case TipoEventoHistorial.CAMBIO_ESTADO: // CAMBIO_ESTADO
      return { title: "Cambio de Estado", color: "text-amber-600", bg: "bg-amber-600" };

    case TipoEventoHistorial.CAMBIO_PRIORIDAD: // CAMBIO_PRIORIDAD
      return { title: "Cambio de Prioridad", color: "text-rose-600", bg: "bg-rose-600" };

    case TipoEventoHistorial.CAMBIO_CRITICIDAD: // CAMBIO_CRITICIDAD
      return { title: "Cambio de Criticidad", color: "text-red-600", bg: "bg-red-600" };

    case TipoEventoHistorial.COMENTARIO_INTERNO: // COMENTARIO_INTERNO
      return { title: "Comentario Interno", color: "text-slate-600", bg: "bg-slate-600" };

    case TipoEventoHistorial.ARCHIVO_ADJUNTO: // ARCHIVO_ADJUNTO
      return { title: "Archivo Adjunto", color: "text-teal-600", bg: "bg-teal-600" };

    case TipoEventoHistorial.CIERRE: // CIERRE
      return { title: "Cierre del Reclamo", color: "text-green-600", bg: "bg-green-600" };

    case TipoEventoHistorial.CALIFICACION: // CALIFICACION
      return { title: "Calificación", color: "text-yellow-600", bg: "bg-yellow-600" };

    case TipoEventoHistorial.CANCELACION: // CANCELACION
      return { title: "Cancelación", color: "text-gray-700", bg: "bg-gray-700" };

    default:
      return { title: "Evento Registrado", color: "text-gray-600", bg: "bg-gray-600" };
  }
};


export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return {
    full: date.toLocaleString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' }),
    time: date.toLocaleString('es-ES', { hour: '2-digit', minute:'2-digit' }),
    day: date.toLocaleString('es-ES', { day: '2-digit', month: 'short' })
  };
};

export default function HistorialReclamoForm({ historial, onClose }:{ historial: HistorialReclamo[], onClose: () => void }) {


  const scrollRef = useRef<HTMLDivElement>(null);

  // Sort by date ascending
  const sorted = [...historial].sort(
  (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Auto scroll to end on load
  useEffect(() => {
  if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
  }
  }, [historial]);

  const getIcon = (type: number) => {
    switch (type) {
      case TipoEventoHistorial.CREACION: // CREACIÓN
        return <FilePlus size={18} />;

      case TipoEventoHistorial.ASIGNACION: // ASIGNACIÓN
        return <UserCheck size={18} />;

      case TipoEventoHistorial.REASIGNACION: // REASIGNACIÓN
        return <UserPlus size={18} />;

      case TipoEventoHistorial.CAMBIO_ESTADO: // CAMBIO ESTADO
        return <RefreshCw size={18} />;

      case TipoEventoHistorial.CAMBIO_PRIORIDAD: // CAMBIO PRIORIDAD
        return <Flag size={18} />;

      case TipoEventoHistorial.CAMBIO_CRITICIDAD: // CAMBIO CRITICIDAD
        return <Flame size={18} />;

      case TipoEventoHistorial.COMENTARIO_INTERNO: // COMENTARIO INTERNO
        return <MessageSquare size={18} />;

      case TipoEventoHistorial.ARCHIVO_ADJUNTO: // ARCHIVO ADJUNTO
        return <Paperclip size={18} />;

      case TipoEventoHistorial.CIERRE: // CIERRE
        return <CheckCircle2 size={18} />;

      case TipoEventoHistorial.CALIFICACION: // CALIFICACIÓN
        return <Star size={18} />;

      case TipoEventoHistorial.CANCELACION: // CANCELACIÓN
        return <XCircle size={18} />;

      default:
        return <Calendar size={18} />;
    }
  };

return (
    <div className="w-full max-w-8xl bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center sticky left-0 right-0 z-20">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Línea de Tiempo del Reclamo</h2>
          <p className="text-slate-500 text-xs">Visualización cronológica de eventos</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Timeline Container */}
      <div 
        ref={scrollRef}
        className="timeline-scroll overflow-x-auto w-full p-8 pb-12 flex-1 relative bg-slate-50/50"
      >
        <div className="flex items-start gap-8 min-w-max px-4 pt-12 relative">
          
          {/* Main Horizontal Line */}
          <div className="absolute top-[67px] left-0 right-0 h-0.5 bg-slate-200 z-0" />

          {sorted.map((item, index) => {
            const eventConfig = getEventConfig(item.tipoEvento);
            const isLast = index === sorted.length - 1;
            const dateInfo = formatDate(item.createdAt);

            return (
              <div key={item.id} className="relative z-10 flex flex-col items-center group w-[300px]">
                
                {/* 1. Date (Above Line) */}
                <div className="mb-4 flex flex-col items-center">
                  <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-full shadow-sm border border-slate-100">
                    {dateInfo.day}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                    {dateInfo.time}
                  </span>
                </div>

                {/* 2. Connection Node (On Line) */}
                <div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center 
                    border-[3px] shadow-sm transition-all duration-300
                    ${isLast 
                      ? `${eventConfig.bg} border-white ring-4 ring-opacity-20 ${eventConfig.color.replace('text', 'ring')}` 
                      : "bg-white border-slate-300 text-slate-400 group-hover:border-slate-400 group-hover:text-slate-600"
                    }
                    ${isLast ? 'text-white scale-110' : ''}
                  `}
                >
                  {getIcon(item.tipoEvento)}
                </div>

                {/* 3. Event Card (Below Line) */}
                <div className="mt-6 w-full px-2">
                  <div className={`
                    bg-white rounded-lg p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] 
                    border border-slate-100 hover:shadow-md transition-shadow duration-300
                    relative overflow-hidden
                    ${isLast ? 'ring-1 ring-blue-100' : ''}
                  `}>
                    
                    {/* Decorative colored strip on top of card */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${eventConfig.bg} opacity-80`} />

                    {/* Header: Event Type */}
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`text-sm font-bold ${eventConfig.color}`}>
                        {eventConfig.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                      {item.descripcion}
                    </p>

                    {/* Changes Section (Conditional Rendering) */}
                    <div className="space-y-3">
                      
                      {/* State Changes */}
                      {item.estadoAnterior !== item.estadoNuevo && (
                        <div className="bg-slate-50 rounded p-2 border border-slate-100">
                          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Estado</p>
                          <div className="flex items-center justify-between gap-1">
                            <Badge className={getStatusConfig(item.estadoAnterior).color}>
                              {getStatusConfig(item.estadoAnterior).label}
                            </Badge>
                            <ArrowRight size={12} className="text-black" />
                            <Badge className={getStatusConfig(item.estadoNuevo).color}>
                              {getStatusConfig(item.estadoNuevo).label}
                            </Badge>
                          </div>
                        </div>
                      )}

                      {/* Priority/Criticality Changes */}
                      {(item.prioridadAnterior !== item.prioridadNueva || item.criticidadAnterior !== item.criticidadNueva || item.areaAnterior !== item.areaNueva) && (
                        <div className="grid grid-cols-1 gap-2">
                          {item.prioridadAnterior !== item.prioridadNueva && (
                             <div className="bg-slate-50 rounded p-2 border border-slate-100">
                              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Prioridad</p>
                              <div className="flex items-center gap-1 flex-wrap">
                                <Badge className={getPriorityConfig(item.prioridadAnterior).color}>
                                  {getPriorityConfig(item.prioridadAnterior).label}
                                </Badge>
                                <ArrowRight size={10} className="text-black" />
                                <Badge className={getPriorityConfig(item.prioridadNueva).color}>
                                  {getPriorityConfig(item.prioridadNueva).label}
                                </Badge>
                              </div>
                            </div>
                          )}
                          {item.criticidadAnterior !== item.criticidadNueva && (
                             <div className="bg-slate-50 rounded p-2 border border-slate-100">
                              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Criticidad</p>
                              <div className="flex items-center gap-1 flex-wrap">
                                <Badge className={getCriticidadConfig(item.criticidadAnterior).color}>
                                  {getCriticidadConfig(item.criticidadAnterior).label}
                                </Badge>
                                <ArrowRight size={10} className="text-black" />
                                <Badge className={getCriticidadConfig(item.criticidadNueva).color}>
                                  {getCriticidadConfig(item.criticidadNueva).label}
                                </Badge>
                              </div>
                            </div>
                          )}
                          {item.areaAnterior !== item.areaNueva && (
                             <div className="bg-slate-50 rounded p-2 border border-slate-100">
                              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Área</p>
                              <div className="flex items-center gap-1 flex-wrap">
                                <span className="font-medium text-slate-700 flex items-center gap-1">
                                  {item.areaAnterior?.nombre ?? "Sin Área"}

                                  <ArrowRight size={10} className="text-black" />

                                  {item.areaNueva?.nombre ?? "Sin Área"}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* User Assignment Changes */}
                      <div className="flex items-center gap-2 text-xs pt-2 border-t border-slate-100 mt-2">
                        <div className="p-1 bg-indigo-50 text-indigo-500 rounded-full">
                          <UserPlus size={12} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] text-black">Responsable:</span>
                          <span className="font-medium text-slate-700">
                            {item.usuario.nombre + " " + item.usuario.apellido}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer ID */}
                    <div className="mt-3 pt-2 text-[9px] text-slate-300 text-right font-mono">
                      Ref: {item.id}
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Spacer at the end */}
          <div className="w-8 shrink-0" />
        </div>
      </div>
    </div>
  );
}
