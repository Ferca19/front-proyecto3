import React, { useRef, useState, useEffect } from "react";
import { Upload, X, File, Image as ImageIcon, Download } from "lucide-react";
import type { ArchivoAdjunto } from "../../../interfaces/gestion-reclamo/interfaces-reclamo";


interface CargaArchivosProps {
  label?: string;

  /** Archivos existentes (vienen del backend) */
  archivosRemotos?: ArchivoAdjunto[];

  /** Callback con archivos locales nuevos */
  onFilesChange: (files: File[]) => void;

  /** Callback si eliminás un archivo remoto (opcional) */
  onEliminarRemoto?: (id: string) => void;
}

export default function CargaArchivos({
  label = "Subir archivos",
  archivosRemotos = [],
  onFilesChange,
  onEliminarRemoto,
}: CargaArchivosProps) {
  const [filesLocales, setFilesLocales] = useState<File[]>([]);
  const [filesRemotos, setFilesRemotos] = useState<ArchivoAdjunto[]>(archivosRemotos);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFilesRemotos(archivosRemotos);
  }, [archivosRemotos]);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);

    const newLocalFiles = [...filesLocales, ...selected];
    setFilesLocales(newLocalFiles);
    onFilesChange(newLocalFiles);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveLocal = (index: number) => {
    const newFiles = filesLocales.filter((_, i) => i !== index);
    setFilesLocales(newFiles);
    onFilesChange(newFiles);
  };

  const handleRemoveRemote = (id: string) => {
    setFilesRemotos((prev) => prev.filter((f) => f._id !== id));
    onEliminarRemoto?.(id);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}

      {/* DROPZONE */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl
          cursor-pointer hover:border-primary/60 transition-all flex flex-col items-center gap-2"
      >
        <Upload size={32} className="text-gray-500" />
        <p className="text-gray-500 text-sm">Click para seleccionar archivos</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />

      {/* LISTA DE ARCHIVOS REMOTOS */}
      {filesRemotos.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {filesRemotos.map((file) => (
            <div
              key={file._id}
              className="flex items-center justify-between p-2 bg-blue-50 rounded-lg text-black"
            >
              <div className="flex items-center gap-2">
                {file.mimeType.startsWith("image/") ? (
                  <ImageIcon size={18} />
                ) : (
                  <File size={18} />
                )}
                <span className="text-sm">{file.nombreOriginal}</span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={file.url || file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/70"
                >
                  <Download size={18} />
                </a>

                {onEliminarRemoto && (
                  <button
                    onClick={() => handleRemoveRemote(file._id)}
                    type="button"
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LISTA DE ARCHIVOS LOCALES */}
      {filesLocales.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {filesLocales.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 bg-gray-100 rounded-lg text-black"
            >
              <div className="flex items-center gap-2">
                {file.type.startsWith("image/") ? (
                  <ImageIcon size={18} />
                ) : (
                  <File size={18} />
                )}
                <span className="text-sm">{file.name}</span>
              </div>

              <button
                onClick={() => handleRemoveLocal(i)}
                type="button"
                className="text-red-600 hover:text-red-800"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
