"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Doctor } from "@/data/doctors";
import {
  Plus,
  Trash2,
  Edit2,
  Users,
  X,
  ExternalLink,
  ShieldCheck,
  Clock,
} from "lucide-react";

interface DoctorsStaffEditorProps {
  doctors: Doctor[];
  onUpdateDoctors: (updated: Doctor[]) => void;
  presetImages: { label: string; path: string }[];
}

export function DoctorsStaffEditor({
  doctors,
  onUpdateDoctors,
  presetImages,
}: DoctorsStaffEditorProps) {
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;

    const exists = doctors.some((d) => d.id === editingDoctor.id);
    let updated: Doctor[];
    if (exists) {
      updated = doctors.map((d) =>
        d.id === editingDoctor.id ? editingDoctor : d
      );
    } else {
      updated = [...doctors, editingDoctor];
    }

    onUpdateDoctors(updated);
    setEditingDoctor(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Eliminar al especialista "${name}" del cuerpo médico?`)) {
      onUpdateDoctors(doctors.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 border border-slate-200 rounded-lg shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Staff Médico Acreditado & Asignación de Box</span>
          </h3>
          <p className="text-xs text-slate-600 font-light mt-0.5">
            Especialistas con registro oficial ante la Superintendencia de Salud de Chile.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingDoctor({
              id: `doc-${Date.now()}`,
              name: "Dr. Nuevo Especialista",
              slug: `dr-nuevo-${Date.now().toString().slice(-4)}`,
              role: "Cirujano Dentista",
              specialty: "Odontología Integral y Rehabilitación",
              schedule: "Lunes a Viernes 10:00 - 20:00 (Previa reserva)",
              description: "Especialista clínico certificado con amplia trayectoria en odontología digital.",
              image: "/images/doctors/dra-keila-rodriguez.png",
              tags: ["Odontología Integral"],
              sisRegistrationNumber: "748921",
              universityDegree: "Cirujano Dentista · Universidad de Chile",
              isAvailableOnline: true,
              assignedBox: "Box 1",
            });
          }}
          className="px-4 py-2 bg-slate-900 text-white font-mono text-xs uppercase font-bold flex items-center gap-1.5 rounded hover:bg-slate-800 transition shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Especialista</span>
        </button>
      </div>

      {/* Grid of Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="border border-slate-200 bg-white rounded-lg p-4 flex flex-col justify-between space-y-4 hover:border-slate-400 shadow-xs transition"
          >
            <div className="space-y-3">
              <div className="relative w-full h-48 bg-slate-100 overflow-hidden border border-slate-200 rounded">
                <Image
                  src={doc.image}
                  alt={doc.name}
                  fill
                  className="object-cover object-top"
                />
                {doc.isAvailableOnline !== false && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono text-[9px] uppercase font-bold rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>En Box</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900">{doc.name}</h4>
                <span className="text-[11px] font-mono text-purple-700 block mt-0.5 font-bold">
                  {doc.role}
                </span>

                {/* SIS & Box Pill */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px] font-mono">
                  {doc.sisRegistrationNumber ? (
                    <span className="px-1.5 py-0.5 bg-sky-50 border border-sky-200 text-sky-800 rounded font-bold">
                      SIS: {doc.sisRegistrationNumber}
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 rounded">
                      Sin N° SIS
                    </span>
                  )}
                  {doc.assignedBox && (
                    <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded">
                      {doc.assignedBox}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono mt-2">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="truncate">{doc.schedule}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 font-light line-clamp-3 leading-relaxed">
                {doc.description}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setEditingDoctor({ ...doc })}
                className="flex-1 py-1.5 border border-slate-200 hover:border-slate-800 bg-white text-xs font-mono uppercase text-slate-800 rounded flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Editar</span>
              </button>
              <button
                onClick={() => handleDelete(doc.id, doc.name)}
                className="p-1.5 border border-slate-200 hover:border-red-300 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                title="Eliminar especialista"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Doctor Modal */}
      {editingDoctor && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" />
                <span>Ficha Profesional del Especialista</span>
              </h3>
              <button
                onClick={() => setEditingDoctor(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoctor} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1 font-bold">
                  Nombre Completo con Título Oficial *
                </label>
                <input
                  type="text"
                  required
                  value={editingDoctor.name}
                  onChange={(e) =>
                    setEditingDoctor({ ...editingDoctor, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1 font-bold">
                    Rol / Título
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDoctor.role}
                    onChange={(e) =>
                      setEditingDoctor({ ...editingDoctor, role: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1 font-bold">
                    Especialidad Principal
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDoctor.specialty}
                    onChange={(e) =>
                      setEditingDoctor({ ...editingDoctor, specialty: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Registro SIS & Box */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-[11px] font-mono text-purple-700 uppercase font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Acreditación Superintendencia de Salud</span>
                  </span>
                  <a
                    href="https://rnpi.superdesalud.gob.cl/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono text-sky-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Validador SIS Oficial</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-600 mb-1 font-bold">
                      N° Registro Individual SIS
                    </label>
                    <input
                      type="text"
                      value={editingDoctor.sisRegistrationNumber || ""}
                      onChange={(e) =>
                        setEditingDoctor({
                          ...editingDoctor,
                          sisRegistrationNumber: e.target.value,
                        })
                      }
                      placeholder="ej: 541289"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 text-slate-900 text-xs font-mono rounded focus:border-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-600 mb-1 font-bold">
                      Sillón / Box Asignado
                    </label>
                    <select
                      value={editingDoctor.assignedBox || "Box 1"}
                      onChange={(e) =>
                        setEditingDoctor({
                          ...editingDoctor,
                          assignedBox: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 text-slate-900 text-xs font-mono rounded focus:border-slate-800 outline-none"
                    >
                      <option value="Box 1">Box 1 (Cirugía & Rehabilitación)</option>
                      <option value="Box 2">Box 2 (Ortodoncia & Estética)</option>
                      <option value="Box 3">Box 3 (Endodoncia & Prevención)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Photo & Presets */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase text-slate-600 font-bold">
                  Fotografía Oficial del Doctor
                </label>
                <div className="flex gap-2.5 items-center">
                  <input
                    type="text"
                    value={editingDoctor.image}
                    onChange={(e) =>
                      setEditingDoctor({ ...editingDoctor, image: e.target.value })
                    }
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
                  />
                  <div className="relative w-12 h-14 border border-slate-200 bg-slate-100 rounded overflow-hidden shrink-0">
                    <Image
                      src={editingDoctor.image || "/images/doctors/dra-keila-rodriguez.png"}
                      alt={editingDoctor.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-[10px] font-mono text-slate-400 mr-1 self-center">
                    Presets:
                  </span>
                  {presetImages.slice(0, 6).map((dImg, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        setEditingDoctor({ ...editingDoctor, image: dImg.path })
                      }
                      className="text-[10px] font-mono px-2 py-0.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded text-slate-700"
                    >
                      {dImg.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1 font-bold">
                  Horario de Atención de Box
                </label>
                <input
                  type="text"
                  required
                  value={editingDoctor.schedule}
                  onChange={(e) =>
                    setEditingDoctor({ ...editingDoctor, schedule: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1 font-bold">
                  Biografía & Trayectoria Clínica
                </label>
                <textarea
                  rows={3}
                  value={editingDoctor.description}
                  onChange={(e) =>
                    setEditingDoctor({ ...editingDoctor, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="availCheck"
                  checked={editingDoctor.isAvailableOnline !== false}
                  onChange={(e) =>
                    setEditingDoctor({
                      ...editingDoctor,
                      isAvailableOnline: e.target.checked,
                    })
                  }
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="availCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Activo para agendamiento directo en línea
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingDoctor(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-mono uppercase rounded transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white font-bold text-xs font-mono uppercase rounded hover:bg-slate-800 transition cursor-pointer"
                >
                  Guardar Especialista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
