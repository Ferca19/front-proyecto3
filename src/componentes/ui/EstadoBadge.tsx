import React from "react";
import { CriticidadReclamoS, EstadoReclamoS, PrioridadReclamoS, TipoReclamoS } from "../../interfaces/gestion-reclamo/interfaces-reclamo";


interface EstadoBadgeProps {
  estado?: string | null; // acepta undefined o null
}

const colorMap: Record<string, string> = {
  // ---------------- ESTADOS RECLAMO ----------------
  [EstadoReclamoS[1]]: "bg-yellow-100 text-yellow-800", // PENDIENTE
  [EstadoReclamoS[2]]: "bg-blue-100 text-blue-800",     // ASIGNADO
  [EstadoReclamoS[3]]: "bg-purple-100 text-purple-800", // EN_ANALISIS
  [EstadoReclamoS[4]]: "bg-indigo-100 text-indigo-800", // EN_PROGRESO
  [EstadoReclamoS[5]]: "bg-green-100 text-green-800",   // RESUELTO
  [EstadoReclamoS[6]]: "bg-gray-300 text-gray-800",     // CERRADO
  [EstadoReclamoS[7]]: "bg-red-100 text-red-800",       // CANCELADO

  // ---------------- TIPO RECLAMO ----------------
  [TipoReclamoS[1]]: "bg-blue-100 text-blue-800",    // TECNICO
  [TipoReclamoS[2]]: "bg-teal-100 text-teal-800",    // ADMINISTRATIVO
  [TipoReclamoS[3]]: "bg-orange-100 text-orange-800",// FACTURACION
  [TipoReclamoS[4]]: "bg-purple-100 text-purple-800",// SOPORTE
  [TipoReclamoS[5]]: "bg-green-100 text-green-800",  // CONSULTA
  [TipoReclamoS[6]]: "bg-yellow-100 text-yellow-800",// GARANTIA
  [TipoReclamoS[7]]: "bg-gray-200 text-gray-800",    // OTRO

  // ---------------- CRITICIDAD ----------------
  [CriticidadReclamoS[1]]: "bg-green-100 text-green-800",   // BAJA
  [CriticidadReclamoS[2]]: "bg-yellow-100 text-yellow-800", // MEDIA
  [CriticidadReclamoS[3]]: "bg-orange-100 text-orange-800", // ALTA
  [CriticidadReclamoS[4]]: "bg-red-100 text-red-800",       // CRITICA

  // ---------------- PRIORIDAD ----------------
  [PrioridadReclamoS[1]]: "bg-green-100 text-green-800",   // BAJA
  [PrioridadReclamoS[2]]: "bg-yellow-100 text-yellow-800", // MEDIA
  [PrioridadReclamoS[3]]: "bg-orange-100 text-orange-800", // ALTA
  [PrioridadReclamoS[4]]: "bg-red-100 text-red-800",       // URGENTE
};



export const EstadoBadge: React.FC<EstadoBadgeProps> = ({ estado }) => {
  // Si no hay estado, no renderiza nada (o podrías mostrar un badge "SIN ESTADO")
  if (!estado) {
    return (
      <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-50 text-gray-400">
        Sin estado
      </span>
    );
  }

  const color = colorMap[estado] || "bg-gray-100 text-gray-800";

  return (
    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${color}`}>
      {estado}
    </span>
  );
};
