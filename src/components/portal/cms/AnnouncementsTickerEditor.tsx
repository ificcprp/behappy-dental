"use client";

import React, { useState } from "react";
import { Plus, Trash2, Bell, AlertTriangle, Sparkles, Info } from "lucide-react";

interface AnnouncementsTickerEditorProps {
  announcements: string[];
  onUpdateAnnouncements: (updated: string[]) => void;
}

export function AnnouncementsTickerEditor({
  announcements,
  onUpdateAnnouncements,
}: AnnouncementsTickerEditorProps) {
  const [newAnnouncement, setNewAnnouncement] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;
    onUpdateAnnouncements([newAnnouncement.trim(), ...announcements]);
    setNewAnnouncement("");
  };

  const handleDelete = (index: number) => {
    onUpdateAnnouncements(announcements.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="border border-[#222228] bg-[#121216] p-4 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-rose-400" />
            <span>Cintillo Rotativo Superior (Ticker Marquesina)</span>
          </h3>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            Mensajes continuos en la barra superior rotativa que capturan la atención del paciente.
          </p>
        </div>
        <span className="text-[10px] font-mono text-rose-400 border border-rose-800/60 bg-rose-950/30 px-2.5 py-1">
          {announcements.length} MENSAJES ACTIVOS
        </span>
      </div>

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="border border-[#222228] bg-[#121216] p-5 flex flex-col sm:flex-row gap-3"
      >
        <input
          type="text"
          required
          placeholder="Escribe un nuevo mensaje para la marquesina (ej: '¡Consulta inicial con evaluaciones digitales en Suecia 3580!')..."
          value={newAnnouncement}
          onChange={(e) => setNewAnnouncement(e.target.value)}
          className="flex-1 px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs outline-none focus:border-rose-400 font-mono"
        />
        <button
          type="submit"
          className="px-5 py-2 bg-white text-black font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-neutral-200 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publicar Anuncio</span>
        </button>
      </form>

      {/* List */}
      <div className="border border-[#222228] bg-[#121216] divide-y divide-[#222228]">
        {announcements.map((msg, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between gap-4 hover:bg-[#18181f] transition">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-neutral-500 w-6">
                #{idx + 1}
              </span>
              <span className="text-xs text-neutral-200 font-sans">{msg}</span>
            </div>
            <button
              onClick={() => handleDelete(idx)}
              className="p-1.5 text-neutral-500 hover:text-red-400 transition"
              title="Eliminar mensaje"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
