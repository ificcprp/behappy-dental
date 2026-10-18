"use client";

import React, { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";

interface ImageUploadButtonProps {
  onUploaded: (url: string) => void;
  label?: string;
  compact?: boolean;
}

export function ImageUploadButton({ onUploaded, label = "Subir imagen", compact = false }: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Solo imágenes");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Máx 5 MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json().catch(() => null);

      if (res.ok && json?.url) {
        onUploaded(json.url);
      } else {
        setError(json?.error || "Error al subir");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className={`inline-flex items-center gap-1.5 border border-[#cfc9be] bg-white hover:bg-[#f4f1ea] text-[#141413] font-mono uppercase tracking-wider transition disabled:opacity-50 ${
          compact ? "px-2.5 py-1.5 text-[10px]" : "px-3 py-2 text-[11px]"
        }`}
      >
        {uploading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Upload className="w-3.5 h-3.5" />
        )}
        <span>{uploading ? "Subiendo..." : label}</span>
      </button>
      {error && <span className="text-[10px] text-rose-600 font-mono">{error}</span>}
    </div>
  );
}
