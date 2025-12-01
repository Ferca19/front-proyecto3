import React, { useRef, useState } from "react";
import { Upload, X, File, Image as ImageIcon } from "lucide-react";

interface CargaArchivosProps {
  label?: string;
  onFilesChange: (files: File[]) => void;
}

export default function CargaArchivos({
  label = "Subir archivos",
  onFilesChange,
}: CargaArchivosProps) {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);

    const newFiles = [...files, ...selected];
    setFiles(newFiles);
    onFilesChange(newFiles);

    // reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}

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

      {/* Lista de archivos */}
      {files.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {files.map((file, i) => (
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
                onClick={() => handleRemove(i)}
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
