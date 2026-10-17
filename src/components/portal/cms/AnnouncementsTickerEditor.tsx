"use client";

import React, { useState } from "react";
import { Plus, Trash2, Bell } from "lucide-react";

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
      <div className="border border-slate-200 bg-white p-4 rounded-lg shadow-xs flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-rose-600" />
            <span>Cintillo Rotativo Superior (Ticker Marquesina)</span>
          </h3>
          <p className="text-xs text-slate-600 font-light mt-0.5">
            Mensajes continuos en la barra superior rotativa que capturan la atención del paciente.
          </p>
        </div>
        <span className="text-[10px] font-mono text-rose-700 border border-rose-200 bg-rose-50 px-2.5 py-1 rounded font-bold uppercase">
          {announcements.length} MENSAJES ACTIVOS
        </span>
      </div>

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="border border-slate-200 bg-white rounded-lg p-5 flex flex-col sm:flex-row gap-3 shadow-xs"
      >
        <input
          type="text"
          required
          placeholder="Escribe un nuevo mensaje para la marquesina (ej: '¡Consulta inicial con evaluaciones digitales en Suecia 3580!')..."
          value={newAnnouncement}
          onChange={(e) => setNewAnnouncement(e.target.value)}
          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded outline-none focus:bg-white focus:border-slate-800 font-mono"
        />
        <button
          type="submit"
          className="px-5 py-2 bg-slate-900 text-white font-bold font-mono text-xs uppercase tracking-wider rounded flex items-center justify-center gap-1.5 hover:bg-slate-800 transition shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publicar Anuncio</span>
        </button>
      </form>

      {/* List */}
      <div className="border border-slate-200 bg-white rounded-lg divide-y divide-slate-100 shadow-xs overflow-hidden">
        {announcements.map((msg, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-slate-400 w-6 font-bold">
                #{idx + 1}
              </span>
              <span className="text-xs text-slate-800 font-sans">{msg}</span>
            </div>
            <button
              onClick={() => handleDelete(idx)}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
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
