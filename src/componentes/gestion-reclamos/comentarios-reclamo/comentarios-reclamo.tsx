import { useEffect, useRef, useState } from "react";
import type { Comentario } from "../../../interfaces/gestion-reclamo/interfaces-reclamo";
import MessageBubble from "./recurso-mensajes";
import { useSesion } from "../../herramientas/context/SesionContext";
import { X } from "lucide-react";
import ReclamoService from "../reclamo/reclamo-service";





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
  reclamoId,
  comentarios,
  onClose,
}: {
  reclamoId: string;
  comentarios: Comentario[];
  onClose: () => void;
}) {

  const [comentariosTraidos, setComentariosTraidos] = useState<Comentario[]>(comentarios);


  const handleBuscarComentarios = async () => {
    const respuesta = await ReclamoService.obtenerComentarios(reclamoId);
    setComentariosTraidos(respuesta);
  }





    const { sesion } = useSesion();
  const usuarioId = sesion.usuarioId;


  //===================== REFERENCIAS Y STATE ============================================
  const bottomRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState("");

  //===================== AUTO SCROLL ====================================================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comentariosTraidos]);

  //===================== AGRUPAR MENSAJES POR FECHA ======================================
  const groupedMessages = comentariosTraidos.reduce((acc, comment) => {
    const dateKey = formatMessageDate(comment.createdAt);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(comment);
    return acc;
  }, {} as Record<string, Comentario[]>);

  //===================== ENVIAR COMENTARIO (TEMPORAL) ===================================
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      contenido: inputText,
      reclamoId: reclamoId
    };
    
    await ReclamoService.crearComentario(payload)
    handleBuscarComentarios();
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
            {Object.values(comentariosTraidos)
            .slice(0, 3)
            .map((comentario) => (
                <img
                key={comentario.usuario.id}
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
                key={comentario.id}
                comentario={comentario}
                user={comentario.usuario}
                isCurrentUser={comentario.usuario.id === usuarioId}
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
