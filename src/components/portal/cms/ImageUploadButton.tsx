"use client";

import React, { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";

interface ImageUploadButtonProps {
  onUploaded: (url: string) => void;
  label?: string;
  compact?: boolean;
  allowVideo?: boolean;
}

export function ImageUploadButton({
  onUploaded,
  label,
  compact = false,
  allowVideo = false,
}: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultLabel = allowVideo ? "Subir foto o video" : "Subir imagen";
  const displayLabel = label || defaultLabel;

  const handleFile = async (file: File) => {
    setError(null);

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && (!allowVideo || !isVideo)) {
      setError(allowVideo ? "Solo fotos o videos" : "Solo imágenes");
      return;
    }

    const maxSize = allowVideo ? 25 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(allowVideo ? "Máx 25 MB" : "Máx 10 MB");
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

  const acceptString = allowVideo
    ? "image/png,image/jpeg,image/webp,image/avif,video/mp4,video/webm,video/quicktime"
    : "image/png,image/jpeg,image/webp,image/avif";

  return (
    <div className="inline-flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={acceptString}
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
