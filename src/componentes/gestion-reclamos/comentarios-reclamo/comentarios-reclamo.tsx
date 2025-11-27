import { useEffect, useRef, useState } from "react";
import type { Comentario } from "../../../interfaces/gestion-reclamo/interfaces-reclamo";
import MessageBubble from "./recurso-mensajes";
import { useSesion } from "../../herramientas/context/SesionContext";
import { X } from "lucide-react";





export const formatMessageTime = (dateInput: string | Date): string => {
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
};

export const formatMessageDate = (dateInput: string | Date): string => {
  const date = new Date(dateInput);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return 'Hoy';
  }

  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};


export default function ComentariosForm({
  comentarios,
  onClose,
}: {
  comentarios: Comentario[];
    onClose: () => void;
}) {

    const comentariosMock: Comentario[] = [
  {
    _id: "CMT-001",
    contenido: "Se verificó el reclamo y se solicitó más información al usuario.",
    reclamoId: "R-100",
    usuario: {
      _id: 1,
      nombre: "Lucía",
      apellido: "Gómez",
      email: "lucia.gomez@empresa.com",
      rol: {
        id: 2,
        nombre: "Empleado"
      },
      createdAt: "2024-11-01T12:00:00",
      updatedAt: "2024-12-05T14:30:00",
      deletedAt: null,
      area: {
        _id: "AREA-02",
        nombre: "Soporte Técnico",
      },
      telefono: "3815551234",
      direccion: "Av. Mitre 450",
      localidad: "San Miguel de Tucumán"
    },
    createdAt: "2025-01-01T09:10:00",
    updatedAt: "2025-01-01T09:10:00",
    deletedAt: null
  },

  {
    _id: "CMT-002",
    contenido: "Se asignó el reclamo a un técnico especializado.",
    reclamoId: "R-100",
    usuario: {
      _id: 2,
      nombre: "Martín",
      apellido: "Rivas",
      email: "martin.rivas@empresa.com",
      rol: {
        id: 1,
        nombre: "Administrador"
      },
      createdAt: "2023-08-10T10:00:00",
      updatedAt: "2024-10-22T16:00:00",
      deletedAt: null,
      area: {
        _id: "AREA-01",
        nombre: "Administración",
      },
      telefono: "3814449988",
      direccion: "Belgrano 1020",
      localidad: "Yerba Buena"
    },
    createdAt: "2025-01-01T11:45:00",
    updatedAt: "2025-01-01T11:45:00",
    deletedAt: null
  },

  {
    _id: "CMT-003",
    contenido: "Se realizaron las pruebas iniciales y no se reprodujo el error. Se continuará investigando.",
    reclamoId: "R-100",
    usuario: {
      _id: 3,
      nombre: "Federico",
      apellido: "Cagliero",
      email: "federico.cagliero@empresa.com",
      rol: {
        id: 1,
        nombre: "Administrador"
      },
      createdAt: "2024-02-15T14:00:00",
      updatedAt: "2024-12-01T12:00:00",
      deletedAt: null,
      area: {
        _id: "AREA-02",
        nombre: "Soporte Técnico",
      },
      telefono: "3816001122",
      direccion: "San Martín 870",
      localidad: "Tafí Viejo"
    },
    createdAt: "2025-01-02T08:30:00",
    updatedAt: "2025-01-02T08:30:00",
    deletedAt: null
  },

  {
    _id: "CMT-004",
    contenido: "Se encontró la causa del problema y se corrigió en el sistema.",
    reclamoId: "R-100",
    usuario: {
      _id: 1,
      nombre: "Lucía",
      apellido: "Gómez",
      email: "lucia.gomez@empresa.com",
      rol: {
        id: 2,
        nombre: "Empleado"
      },
      createdAt: "2024-11-01T12:00:00",
      updatedAt: "2024-12-05T14:30:00",
      deletedAt: null,
      area: {
        _id: "AREA-02",
        nombre: "Soporte Técnico",
      }
    },
    createdAt: "2025-01-03T09:00:00",
    updatedAt: "2025-01-03T09:00:00",
    deletedAt: null
  }
];





    const { sesion } = useSesion();
  const usuarioId = sesion.usuarioId;


  //===================== REFERENCIAS Y STATE ============================================
  const bottomRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState("");

  //===================== AUTO SCROLL ====================================================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comentariosMock]);

  //===================== AGRUPAR MENSAJES POR FECHA ======================================
  const groupedMessages = comentariosMock.reduce((acc, comment) => {
    const dateKey = formatMessageDate(comment.createdAt);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(comment);
    return acc;
  }, {} as Record<string, Comentario[]>);

  //===================== ENVIAR COMENTARIO (TEMPORAL) ===================================
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    alert("Enviar comentario a API: " + inputText);
    setInputText("");
  };

  //=======================================================================================
  //                                      RENDER
  //=======================================================================================

  return (
    <div className="flex flex-col h-[600px] w-full max-w-3xl mx-auto bg-gray-50 rounded-xl shadow-xl overflow-hidden border border-gray-200">

      {/* HEADER */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
            <h2 className="text-lg font-bold text-gray-800">Comentarios del Reclamo</h2>
            <p className="text-xs text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            En línea
            </p>
        </div>

        {/* AVATARES (más a la izquierda) */}
        <div className="flex -space-x-2 overflow-hidden mr-10">
            {Object.values(comentariosMock)
            .slice(0, 3)
            .map((comentario) => (
                <img
                key={comentario.usuario._id}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                src={`https://ui-avatars.com/api/?name=${comentario.usuario.nombre}&background=random`}
                alt={comentario.usuario.nombre}
                />
            ))}
        </div>

        <button 
            onClick={onClose}
            className="absolute p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors justify-end right-4 top-4"
        >
            <X size={20} />
        </button>
        </div>

      {/* MENSAJES */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {Object.keys(groupedMessages).map((dateLabel) => (
          <div key={dateLabel}>
            {/* Separador de fecha */}
            <div className="flex justify-center mb-6">
              <span className="bg-gray-200 text-gray-600 text-xs py-1 px-3 rounded-full font-medium shadow-sm">
                {dateLabel}
              </span>
            </div>

            {/* Burbujas */}
            {groupedMessages[dateLabel].map((comentario) => (
              <MessageBubble
                key={comentario._id}
                comentario={comentario}
                user={comentario.usuario}
                isCurrentUser={comentario.usuario._id === Number(usuarioId)}
              />
            ))}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* INPUT (TEMPORAL) */}
      <div className="bg-white p-4 border-t border-gray-200">
        <form onSubmit={handleSend} className="flex gap-2 items-end">
          <div className="relative flex-1">
            <textarea
              className="w-full bg-gray-100 text-gray-800 border-0 rounded-xl px-4 py-3
                         focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all
                         resize-none text-sm shadow-inner"
              rows={1}
              placeholder="Escribe un comentario..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300
                       disabled:cursor-not-allowed text-white p-3 rounded-full
                       shadow-lg transition-transform active:scale-95 flex-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </form>

        <p className="text-[10px] text-gray-400 mt-2 text-center">
          Presiona Enter para enviar
        </p>
      </div>
    </div>
  );
}
