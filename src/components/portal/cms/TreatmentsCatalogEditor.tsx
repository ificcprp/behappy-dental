"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Treatment, TreatmentCategory } from "@/data/treatments";
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  Stethoscope,
  X,
  CreditCard,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface TreatmentsCatalogEditorProps {
  treatments: Treatment[];
  onUpdateTreatments: (updated: Treatment[]) => void;
  presetImages: { label: string; path: string }[];
}

export function TreatmentsCatalogEditor({
  treatments,
  onUpdateTreatments,
  presetImages,
}: TreatmentsCatalogEditorProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("TODAS");
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [modalTab, setModalTab] = useState<"general" | "aranceles" | "clinica">("general");

  const categories = [
    "TODAS",
    "Tratamientos Estéticos",
    "Especialidades",
    "Tratamientos Generales",
    "Tratamientos",
    "Prevención",
  ];

  const filtered = treatments.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.tag.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "TODAS" || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSaveTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTreatment) return;

    const exists = treatments.some((t) => t.id === editingTreatment.id);
    let updated: Treatment[];
    if (exists) {
      updated = treatments.map((t) =>
        t.id === editingTreatment.id ? editingTreatment : t
      );
    } else {
      updated = [editingTreatment, ...treatments];
    }

    onUpdateTreatments(updated);
    setEditingTreatment(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Eliminar el tratamiento "${name}" del catálogo?`)) {
      const updated = treatments.filter((t) => t.id !== id);
      onUpdateTreatments(updated);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por nombre, slug o etiqueta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none font-mono"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setEditingTreatment({
              id: `tratamiento-${Date.now()}`,
              name: "Nuevo Procedimiento Dental",
              slug: `nuevo-procedimiento-${Date.now().toString().slice(-4)}`,
              category: "Tratamientos Generales",
              tag: "TRATAMIENTOS GENERALES",
              shortDescription: "Descripción breve del nuevo procedimiento dental...",
              fullDescription: "Protocolo clínico y detalles de la intervención...",
              benefits: ["Diagnóstico digital de precisión", "Confort biológico y sin dolor"],
              image: "/images/treatments_real/blanqueamiento.jpg",
              recommendedFor: "Pacientes con requerimiento de rehabilitación o estética.",
              popular: false,
              priceBaseCLP: 45000,
              priceClubCLP: 27000,
              fonasaCode: "02-01-001",
              boxDurationMinutes: 30,
              isActive: true,
              installmentsMax: 12,
            });
            setModalTab("general");
          }}
          className="px-4 py-2 bg-slate-900 text-white font-mono text-xs uppercase font-bold flex items-center justify-center gap-1.5 rounded hover:bg-slate-800 transition shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Tratamiento</span>
        </button>
      </div>

      {/* Treatments Table with Tariff Matrix View */}
      <div className="border border-slate-200 bg-white rounded-lg shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="border-b border-slate-200 text-slate-600 uppercase bg-slate-50">
            <tr>
              <th className="p-3 w-14">Foto</th>
              <th className="p-3">Nombre & Slug</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Matriz Aranceles</th>
              <th className="p-3">Sillón Box</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/80 transition">
                <td className="p-3">
                  <div className="relative w-12 h-10 bg-slate-100 border border-slate-200 rounded overflow-hidden">
                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                  </div>
                </td>
                <td className="p-3">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 font-sans">
                    <span>{t.name}</span>
                    {t.popular && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-teal-50 text-teal-700 border border-teal-200 rounded font-mono font-bold">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">/{t.slug}</div>
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 border border-slate-200 bg-slate-50 rounded text-[10px] text-slate-600 uppercase font-mono">
                    {t.tag}
                  </span>
                </td>
                <td className="p-3">
                  <div className="text-slate-900 font-bold">
                    {t.priceBaseCLP
                      ? `$${t.priceBaseCLP.toLocaleString("es-CL")}`
                      : "A consultar"}
                  </div>
                  {t.priceClubCLP && (
                    <div className="text-[10px] text-amber-600 font-bold">
                      Club: ${t.priceClubCLP.toLocaleString("es-CL")}
                    </div>
                  )}
                </td>
                <td className="p-3 text-slate-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{t.boxDurationMinutes || 30} min</span>
                  </div>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => {
                        setEditingTreatment({ ...t });
                        setModalTab("general");
                      }}
                      className="px-3 py-1.5 border border-slate-200 hover:border-slate-800 bg-white text-slate-800 rounded text-[11px] font-mono uppercase inline-flex items-center gap-1 transition cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleDelete(t.id, t.name)}
                      className="p-1.5 border border-slate-200 hover:border-red-300 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal with 3 Sub-tabs */}
      {editingTreatment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-sky-600" />
                <span>Editar Ficha de Tratamiento Clínico</span>
              </h3>
              <button
                onClick={() => setEditingTreatment(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 gap-4 text-xs font-mono">
              <button
                type="button"
                onClick={() => setModalTab("general")}
                className={`pb-2 border-b-2 uppercase transition ${
                  modalTab === "general"
                    ? "border-sky-600 text-sky-600 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                1. General & Visual
              </button>
              <button
                type="button"
                onClick={() => setModalTab("aranceles")}
                className={`pb-2 border-b-2 uppercase transition flex items-center gap-1 ${
                  modalTab === "aranceles"
                    ? "border-amber-500 text-amber-600 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>2. Matriz Aranceles</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab("clinica")}
                className={`pb-2 border-b-2 uppercase transition flex items-center gap-1 ${
                  modalTab === "clinica"
                    ? "border-emerald-600 text-emerald-600 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>3. Box & Protocolo</span>
              </button>
            </div>

            <form onSubmit={handleSaveTreatment} className="space-y-4">
              {/* TAB 1: GENERAL */}
              {modalTab === "general" && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1 font-bold">
                      Nombre del Tratamiento *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingTreatment.name}
                      onChange={(e) =>
                        setEditingTreatment({ ...editingTreatment, name: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded focus:bg-white focus:border-slate-800 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1 font-bold">
                        Slug URL amigable
                      </label>
                      <input
                        type="text"
                        required
                        value={editingTreatment.slug}
                        onChange={(e) =>
                          setEditingTreatment({ ...editingTreatment, slug: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1 font-bold">
                        Categoría
                      </label>
                      <select
                        value={editingTreatment.category}
                        onChange={(e) =>
                          setEditingTreatment({
                            ...editingTreatment,
                            category: e.target.value as TreatmentCategory,
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
                      >
                        <option value="Tratamientos Estéticos">Tratamientos Estéticos</option>
                        <option value="Especialidades">Especialidades</option>
                        <option value="Tratamientos Generales">Tratamientos Generales</option>
                        <option value="Tratamientos">Tratamientos</option>
                        <option value="Prevención">Prevención</option>
                      </select>
                    </div>
                  </div>

                  {/* Preset Photos & Input */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono uppercase text-slate-600 font-bold">
                      Fotografía Clínica del Tratamiento
                    </label>
                    <div className="flex gap-2.5 items-center">
                      <input
                        type="text"
                        value={editingTreatment.image}
                        onChange={(e) =>
                          setEditingTreatment({ ...editingTreatment, image: e.target.value })
                        }
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
                      />
                      <div className="relative w-14 h-11 border border-slate-200 bg-slate-100 rounded overflow-hidden shrink-0">
                        <Image
                          src={editingTreatment.image || "/images/treatments_real/blanqueamiento.jpg"}
                          alt={editingTreatment.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="text-[10px] font-mono text-slate-400 mr-1 self-center">
                        Presets:
                      </span>
                      {presetImages.slice(0, 6).map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() =>
                            setEditingTreatment({ ...editingTreatment, image: img.path })
                          }
                          className="text-[10px] font-mono px-2 py-0.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded text-slate-700"
                        >
                          {img.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1 font-bold">
                      Descripción Corta (Visible en tarjeta pública)
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={editingTreatment.shortDescription}
                      onChange={(e) =>
                        setEditingTreatment({
                          ...editingTreatment,
                          shortDescription: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1 font-bold">
                      Indicación Clínica (&quot;Recomendado para&quot;)
                    </label>
                    <input
                      type="text"
                      value={editingTreatment.recommendedFor}
                      onChange={(e) =>
                        setEditingTreatment({
                          ...editingTreatment,
                          recommendedFor: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="popularCheck"
                      checked={editingTreatment.popular || false}
                      onChange={(e) =>
                        setEditingTreatment({
                          ...editingTreatment,
                          popular: e.target.checked,
                        })
                      }
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <label htmlFor="popularCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
                      Marcar como &quot;Tratamiento Destacado / Alta Demanda&quot;
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: ARANCELES */}
              {modalTab === "aranceles" && (
                <div className="space-y-4 bg-slate-50 p-4 border border-slate-200 rounded-md">
                  <div className="border-b border-slate-200 pb-2">
                    <span className="text-xs font-mono font-bold text-amber-700 uppercase">
                      Matriz de Aranceles & Transparencia Fonasa / Isapre
                    </span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Define el arancel particular y el copago preferente para socios del Club BeHappy.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1 font-bold">
                        Arancel Particular Base (CLP)
                      </label>
                      <input
                        type="number"
                        value={editingTreatment.priceBaseCLP || ""}
                        onChange={(e) =>
                          setEditingTreatment({
                            ...editingTreatment,
                            priceBaseCLP: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="35000"
                        className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-900 text-xs font-mono rounded focus:border-slate-800 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-amber-700 mb-1 font-bold">
                        Arancel Club BeHappy (CLP)
                      </label>
                      <input
                        type="number"
                        value={editingTreatment.priceClubCLP || ""}
                        onChange={(e) =>
                          setEditingTreatment({
                            ...editingTreatment,
                            priceClubCLP: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="21000"
                        className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-900 text-xs font-mono rounded focus:border-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  {editingTreatment.priceBaseCLP && editingTreatment.priceClubCLP ? (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded text-xs font-mono flex items-center justify-between">
                      <span>Descuento socios Club:</span>
                      <span className="font-bold">
                        {Math.round(
                          ((editingTreatment.priceBaseCLP - editingTreatment.priceClubCLP) /
                            editingTreatment.priceBaseCLP) *
                            100
                        )}
                        % de ahorro
                      </span>
                    </div>
                  ) : null}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1 font-bold">
                        Código Fonasa / MLE
                      </label>
                      <input
                        type="text"
                        value={editingTreatment.fonasaCode || ""}
                        onChange={(e) =>
                          setEditingTreatment({
                            ...editingTreatment,
                            fonasaCode: e.target.value,
                          })
                        }
                        placeholder="ej: 02-01-001"
                        className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-900 text-xs font-mono rounded focus:border-slate-800 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1 font-bold">
                        Cuotas sin interés Transbank
                      </label>
                      <input
                        type="number"
                        value={editingTreatment.installmentsMax || 12}
                        onChange={(e) =>
                          setEditingTreatment({
                            ...editingTreatment,
                            installmentsMax: parseInt(e.target.value) || 12,
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-900 text-xs font-mono rounded focus:border-slate-800 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BOX & PROTOCOLO */}
              {modalTab === "clinica" && (
                <div className="space-y-4 bg-slate-50 p-4 border border-slate-200 rounded-md">
                  <div className="border-b border-slate-200 pb-2">
                    <span className="text-xs font-mono font-bold text-emerald-700 uppercase">
                      Parámetros de Box & Seguridad del Paciente
                    </span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Configura el tiempo de sillón para agendamiento y el consentimiento informado.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1 font-bold">
                        Tiempo de Sillón / Box
                      </label>
                      <select
                        value={editingTreatment.boxDurationMinutes || 30}
                        onChange={(e) =>
                          setEditingTreatment({
                            ...editingTreatment,
                            boxDurationMinutes: parseInt(e.target.value) || 30,
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-900 text-xs font-mono rounded focus:border-slate-800 outline-none"
                      >
                        <option value={30}>30 minutos (Control / Profilaxis)</option>
                        <option value={45}>45 minutos (Restauraciones simples)</option>
                        <option value={60}>60 minutos (Endodoncia / Cirugía)</option>
                        <option value={90}>90 minutos (Implante / Rehabilitación)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1 font-bold">
                        URL Consentimiento Informado (PDF)
                      </label>
                      <input
                        type="text"
                        value={editingTreatment.informedConsentUrl || ""}
                        onChange={(e) =>
                          setEditingTreatment({
                            ...editingTreatment,
                            informedConsentUrl: e.target.value,
                          })
                        }
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-900 text-xs font-mono rounded focus:border-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1 font-bold">
                      Descripción Protocolar y Técnica Detallada
                    </label>
                    <textarea
                      rows={3}
                      value={editingTreatment.fullDescription}
                      onChange={(e) =>
                        setEditingTreatment({
                          ...editingTreatment,
                          fullDescription: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-900 text-xs rounded focus:border-slate-800 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTreatment(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-mono uppercase rounded transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white font-bold text-xs font-mono uppercase rounded hover:bg-slate-800 transition cursor-pointer"
                >
                  Guardar Tratamiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
