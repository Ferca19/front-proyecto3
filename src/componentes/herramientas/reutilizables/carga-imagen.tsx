import React, { useRef, useState } from "react";
import { Upload, X, Eye } from "lucide-react";

interface CargaImagenProps {
  label?: string;
  onFileSelect: (file: File | null) => void;
  defaultPreview?: string;
}

export default function CargaImagen({
  label = "Subir imagen",
  onFileSelect,
  defaultPreview,
}: CargaImagenProps) {
  const [preview, setPreview] = useState<string | null>(defaultPreview || null);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      onFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onFileSelect(null);

    // 🔹 Resetea el input correctamente para permitir subir otra imagen igual si se desea
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClickUpload = () => {
    // 🔹 Permite volver a abrir el selector aunque haya una imagen previa o se haya eliminado
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}

      <div
        onClick={handleClickUpload}
        className={`relative w-48 h-48 flex items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition-all overflow-hidden
          ${preview ? "border-transparent" : "border-gray-300 hover:border-primary/60"}`}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Vista previa"
              className="w-full h-full object-cover shadow-md"
            />

            {/* Botón eliminar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 z-20"
            >
              <X size={16} />
            </button>

            {/* Overlay con ícono de ojo */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
              className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center"
            >
              <Eye size={36} className="text-white" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <Upload size={36} className="mb-2" />
            <span className="text-sm">Click para seleccionar</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Modal para vista ampliada */}
      {showModal && preview && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 cursor-zoom-out"
        >
          <img
            src={preview}
            alt="Vista ampliada"
            className="w-80 h-80 object-contain rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
