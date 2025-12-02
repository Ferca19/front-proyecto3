import React from 'react';
import { formatMessageTime } from './comentarios-reclamo';
import type { Comentario } from '../../../interfaces/gestion-reclamo/interfaces-reclamo';
import type { Usuario } from '../../../interfaces/gestion-usuario/interfaces-usuario';


export interface ChatMessageProps {
  comentario: Comentario;
  user?: Usuario;
  isCurrentUser: boolean;
}

const MessageBubble: React.FC<ChatMessageProps> = ({ comentario, user, isCurrentUser }) => {
  return (
    <div className={`flex w-full mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'} group`}>

      <div className={`max-w-[75%] sm:max-w-[70%]`}>
        {/* User Name (only for others) */}
        {!isCurrentUser && user && (
          <p className="text-xs text-gray-500 ml-1 mb-1 font-medium">
            {user.nombre} <span className="text-gray-400 font-normal">• {user.rol?.nombre}</span>
          </p>
        )}

        {/* Bubble Container */}
        <div
          className={`relative px-4 py-3 shadow-sm text-sm md:text-base leading-relaxed break-words
            ${isCurrentUser 
              ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' 
              : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-sm'
            }
          `}
        >
          {comentario.contenido}
          
          {/* Timestamp inside bubble */}
          <div className={`text-[10px] mt-1 text-right w-full 
            ${isCurrentUser ? 'text-blue-200' : 'text-gray-400'}`}>
            {formatMessageTime(comentario.createdAt)}
          </div>
        </div>
      </div>

      {/* Avatar for current user (optional, usually chat apps don't show my avatar next to my bubble, but adding logic just in case user wants it) */}
      {/* Keeping standard pattern: no avatar for self next to bubble */}
    </div>
  );
};

export default MessageBubble;