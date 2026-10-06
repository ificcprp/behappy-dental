"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getCMSData, saveCMSData, resetCMSData, CMSData, CMSPromotion } from "@/lib/cmsStore";
import { Treatment } from "@/data/treatments";
import { Doctor } from "@/data/doctors";
import {
  Save,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Stethoscope,
  Users,
  PhoneCall,
  Bell,
  Sparkles,
  Home
} from "lucide-react";
import { CMSHero, DEFAULT_HERO } from "@/lib/cmsStore";

export function SiteCmsEditor() {
  const [cmsData, setCmsData] = useState<CMSData>(getCMSData());
  const [activeTab, setActiveTab] = useState<"hero" | "tratamientos" | "doctores" | "contacto" | "anuncios" | "promos">("hero");
  const [toastMessage, setToastToastMessage] = useState<string | null>(null);

  // Edit Treatment Modal State
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [treatmentSearch, setTreatmentSearch] = useState("");

  // Edit Doctor Modal State
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  // New Announcement Input State
  const [newAnnouncement, setNewAnnouncement] = useState("");

  useEffect(() => {
    setCmsData(getCMSData());
  }, []);

  const triggerToast = (msg: string) => {
    setToastToastMessage(msg);
    setTimeout(() => setToastToastMessage(null), 3500);
  };

  const handleSaveAll = () => {
    saveCMSData(cmsData);
    triggerToast("✓ Cambios guardados y publicados con éxito en el sitio web");
  };

  const handleReset = () => {
    if (confirm("¿Estás seguro de restablecer todos los textos y tratamientos a los valores originales de fábrica?")) {
      const reset = resetCMSData();
      setCmsData(reset);
      triggerToast("✓ Contenido restaurado a los valores predeterminados");
    }
  };

  // Treatment Handlers
  const handleSaveTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTreatment) return;

    const updatedList = cmsData.treatments.map((t) =>
      t.id === editingTreatment.id ? editingTreatment : t
    );

    // If it's a new treatment not found in list
    if (!cmsData.treatments.some((t) => t.id === editingTreatment.id)) {
      updatedList.push(editingTreatment);
    }

    const updated = { ...cmsData, treatments: updatedList };
    setCmsData(updated);
    saveCMSData(updated);
    setEditingTreatment(null);
    triggerToast(`✓ Tratamiento "${editingTreatment.name}" actualizado`);
  };

  // Doctor Handlers
  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;

    const updatedDoctors = cmsData.doctors.map((d) =>
      d.id === editingDoctor.id ? editingDoctor : d
    );

    const updated = { ...cmsData, doctors: updatedDoctors };
    setCmsData(updated);
    saveCMSData(updated);
    setEditingDoctor(null);
    triggerToast(`✓ Datos del doctor "${editingDoctor.name}" actualizados`);
  };

  // Contact Info Handlers
  const handleContactChange = (field: string, value: string) => {
    const updated = {
      ...cmsData,
      clinicInfo: {
        ...cmsData.clinicInfo,
        contact: {
          ...cmsData.clinicInfo.contact,
          [field]: value
        }
      }
    };
    setCmsData(updated);
  };

  const handleHoursChange = (field: string, value: string) => {
    const updated = {
      ...cmsData,
      clinicInfo: {
        ...cmsData.clinicInfo,
        hours: {
          ...cmsData.clinicInfo.hours,
          [field]: value
        }
      }
    };
    setCmsData(updated);
  };

  // Hero Handlers
  const handleHeroChange = (field: keyof CMSHero, value: string) => {
    const updated = {
      ...cmsData,
      hero: {
        ...(cmsData.hero || DEFAULT_HERO),
        [field]: value
      }
    };
    setCmsData(updated);
  };

  // Announcements Handlers
  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;

    const updatedAnnouncements = [newAnnouncement.trim(), ...cmsData.announcements];
    const updated = { ...cmsData, announcements: updatedAnnouncements };
    setCmsData(updated);
    saveCMSData(updated);
    setNewAnnouncement("");
    triggerToast("✓ Nuevo anuncio agregado al marquesina superior");
  };

  const handleDeleteAnnouncement = (index: number) => {
    const updatedAnnouncements = cmsData.announcements.filter((_, i) => i !== index);
    const updated = { ...cmsData, announcements: updatedAnnouncements };
    setCmsData(updated);
    saveCMSData(updated);
    triggerToast("✓ Anuncio eliminado");
  };

  // Filtered Treatments
  const filteredTreatments = cmsData.treatments.filter((t) =>
    t.name.toLowerCase().includes(treatmentSearch.toLowerCase()) ||
    t.tag.toLowerCase().includes(treatmentSearch.toLowerCase()) ||
    t.category.toLowerCase().includes(treatmentSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-black font-mono font-bold text-xs px-4 py-3 rounded shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Bar */}
      <div className="border border-[#222228] bg-[#121216] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase font-bold block mb-1">
            MÓDULO DE GESTIÓN CENTRAL · ROL ADMINISTRADOR
          </span>
          <h2 className="text-2xl font-normal text-white">CMS: Editor del Sitio Web</h2>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Modifica en tiempo real los textos de portada, los 20 tratamientos, doctores, teléfonos, horarios y avisos públicos de behappydental.cl
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSaveAll}
            className="px-4 py-2 bg-white text-black font-bold font-mono text-xs uppercase tracking-wider hover:bg-neutral-200 transition flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar Todo</span>
          </button>

          <button
            onClick={handleReset}
            className="px-3.5 py-2 border border-neutral-700 hover:border-neutral-500 text-neutral-300 font-mono text-xs uppercase tracking-wider transition flex items-center gap-1.5"
            title="Restablecer a valores iniciales"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 border border-neutral-700 hover:border-white text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-wider transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver Web</span>
          </a>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#222228] pb-3">
        <button
          onClick={() => setActiveTab("hero")}
          className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition flex items-center gap-2 border ${
            activeTab === "hero"
              ? "bg-[#1f1f26] text-white border-purple-500 font-semibold"
              : "bg-[#121216] text-neutral-400 border-[#222228] hover:text-white"
          }`}
        >
          <Home className="w-4 h-4 text-purple-400" />
          <span>Portada & Hero</span>
        </button>

        <button
          onClick={() => setActiveTab("tratamientos")}
          className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition flex items-center gap-2 border ${
            activeTab === "tratamientos"
              ? "bg-[#1f1f26] text-white border-purple-500 font-semibold"
              : "bg-[#121216] text-neutral-400 border-[#222228] hover:text-white"
          }`}
        >
          <Stethoscope className="w-4 h-4 text-purple-400" />
          <span>Tratamientos ({cmsData.treatments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("doctores")}
          className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition flex items-center gap-2 border ${
            activeTab === "doctores"
              ? "bg-[#1f1f26] text-white border-purple-500 font-semibold"
              : "bg-[#121216] text-neutral-400 border-[#222228] hover:text-white"
          }`}
        >
          <Users className="w-4 h-4 text-blue-400" />
          <span>Equipo Médico ({cmsData.doctors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("contacto")}
          className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition flex items-center gap-2 border ${
            activeTab === "contacto"
              ? "bg-[#1f1f26] text-white border-purple-500 font-semibold"
              : "bg-[#121216] text-neutral-400 border-[#222228] hover:text-white"
          }`}
        >
          <PhoneCall className="w-4 h-4 text-emerald-400" />
          <span>Sede, Teléfonos & Horarios</span>
        </button>

        <button
          onClick={() => setActiveTab("anuncios")}
          className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition flex items-center gap-2 border ${
            activeTab === "anuncios"
              ? "bg-[#1f1f26] text-white border-purple-500 font-semibold"
              : "bg-[#121216] text-neutral-400 border-[#222228] hover:text-white"
          }`}
        >
          <Bell className="w-4 h-4 text-amber-400" />
          <span>Ticker & Mensajes Top ({cmsData.announcements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("promos")}
          className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition flex items-center gap-2 border ${
            activeTab === "promos"
              ? "bg-[#1f1f26] text-white border-purple-500 font-semibold"
              : "bg-[#121216] text-neutral-400 border-[#222228] hover:text-white"
          }`}
        >
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>Promociones & Seguro</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 0: PORTADA & HERO */}
      {/* ========================================================================= */}
      {activeTab === "hero" && (
        <div className="border border-[#222228] bg-[#121216] p-6 space-y-6">
          <div className="border-b border-[#222228] pb-4">
            <h3 className="text-base font-normal text-white">
              Portada Principal (Hero Banner)
            </h3>
            <p className="text-xs text-neutral-400 font-light mt-1">
              Personaliza el mensaje de bienvenida oficial, títulos y enlaces de reserva en la página de inicio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Kicker de Bienvenida (Saludo)
              </label>
              <input
                type="text"
                value={cmsData.hero?.welcomeKicker || "Bienvenidos a"}
                onChange={(e) => handleHeroChange("welcomeKicker", e.target.value)}
                placeholder="Bienvenidos a"
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Título Principal de la Clínica
              </label>
              <input
                type="text"
                value={cmsData.hero?.title || "Centro Dental BeHappy"}
                onChange={(e) => handleHeroChange("title", e.target.value)}
                placeholder="Centro Dental BeHappy"
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Bajada / Descripción Principal
              </label>
              <textarea
                rows={2}
                value={cmsData.hero?.subtitle || "Centro dental en Ñuñoa con la última tecnología y tratamientos de la más alta calidad."}
                onChange={(e) => handleHeroChange("subtitle", e.target.value)}
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Texto Botón Principal
              </label>
              <input
                type="text"
                value={cmsData.hero?.primaryCtaText || "Reserva aquí"}
                onChange={(e) => handleHeroChange("primaryCtaText", e.target.value)}
                placeholder="Reserva aquí"
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Enlace Botón Principal (WhatsApp o URL)
              </label>
              <input
                type="text"
                value={cmsData.hero?.primaryCtaUrl || "https://api.whatsapp.com/send/?phone=56947578597&text&type=phone_number&app_absent=0"}
                onChange={(e) => handleHeroChange("primaryCtaUrl", e.target.value)}
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Texto Botón Secundario
              </label>
              <input
                type="text"
                value={cmsData.hero?.secondaryCtaText || "Agendar con agendador →"}
                onChange={(e) => handleHeroChange("secondaryCtaText", e.target.value)}
                placeholder="Agendar con agendador →"
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Ruta Imagen Fondo
              </label>
              <input
                type="text"
                value={cmsData.hero?.bgImage || "/images/hero-woman.jpg"}
                onChange={(e) => handleHeroChange("bgImage", e.target.value)}
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
              />
            </div>
          </div>

          {/* Preview Box */}
          <div className="p-4 border border-[#2b2b34] bg-[#0c0c10] space-y-2">
            <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block">
              Vista Previa Rápida
            </span>
            <div className="p-6 bg-black/90 border border-neutral-800 text-center space-y-2 rounded">
              <span className="text-neutral-300 text-sm block">{cmsData.hero?.welcomeKicker}</span>
              <h4 className="text-xl font-bold text-white">{cmsData.hero?.title}</h4>
              <p className="text-xs text-neutral-300 max-w-md mx-auto">{cmsData.hero?.subtitle}</p>
              <div className="pt-2">
                <span className="px-5 py-1.5 rounded-full border border-white text-white text-xs inline-block">
                  {cmsData.hero?.primaryCtaText}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveAll}
              className="px-6 py-2.5 bg-white text-black font-bold font-mono text-xs uppercase tracking-wider hover:bg-neutral-200 transition"
            >
              Guardar Cambios de Portada
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: TRATAMIENTOS */}
      {/* ========================================================================= */}
      {activeTab === "tratamientos" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#121216] p-4 border border-[#222228]">
            <input
              type="text"
              placeholder="Buscar tratamiento por nombre o categoría..."
              value={treatmentSearch}
              onChange={(e) => setTreatmentSearch(e.target.value)}
              className="px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs w-full sm:w-80"
            />

            <button
              onClick={() =>
                setEditingTreatment({
                  id: `tratamiento-${Date.now()}`,
                  name: "Nuevo Tratamiento Dental",
                  slug: "nuevo-tratamiento",
                  category: "Tratamientos Generales",
                  tag: "TRATAMIENTOS GENERALES",
                  shortDescription: "Descripción breve del nuevo tratamiento dental...",
                  fullDescription: "Protocolo clínico detallado de la intervención...",
                  benefits: ["Resultados clínicos óptimos", "Procedimiento confortable"],
                  image: "/images/treatments_real/blanqueamiento.jpg",
                  recommendedFor: "Pacientes con requerimiento clínico específico.",
                  popular: false
                })
              }
              className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs uppercase flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Tratamiento</span>
            </button>
          </div>

          {/* Treatments Table */}
          <div className="border border-[#222228] bg-[#121216] overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-[#222228] text-neutral-400 uppercase bg-[#0f0f13]">
                <tr>
                  <th className="p-3 w-14">Foto</th>
                  <th className="p-3">Nombre & Slug</th>
                  <th className="p-3">Categoría / Etiqueta</th>
                  <th className="p-3">Descripción Breve</th>
                  <th className="p-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222228]">
                {filteredTreatments.map((t) => (
                  <tr key={t.id} className="hover:bg-[#18181f] transition">
                    <td className="p-3">
                      <div className="relative w-12 h-10 bg-neutral-900 border border-neutral-800 overflow-hidden">
                        <Image
                          src={t.image}
                          alt={t.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-white">{t.name}</div>
                      <div className="text-[10px] text-neutral-500">{t.slug}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 border border-neutral-700 text-[10px] text-neutral-300 uppercase">
                        {t.tag}
                      </span>
                    </td>
                    <td className="p-3 max-w-xs text-neutral-300 font-sans text-xs truncate">
                      {t.shortDescription}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setEditingTreatment({ ...t })}
                        className="px-3 py-1.5 border border-neutral-700 hover:border-white text-white text-[11px] font-mono uppercase inline-flex items-center gap-1 transition"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Editar</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DOCTORES */}
      {/* ========================================================================= */}
      {activeTab === "doctores" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cmsData.doctors.map((doc) => (
            <div key={doc.id} className="border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="relative w-full h-44 bg-[#18181f] overflow-hidden border border-neutral-800">
                  <Image
                    src={doc.image}
                    alt={doc.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{doc.name}</h4>
                  <span className="text-[11px] font-mono text-purple-400 block mt-0.5">{doc.role}</span>
                  <span className="text-[10px] text-neutral-400 font-mono block mt-1">{doc.schedule}</span>
                </div>
                <p className="text-xs text-neutral-300 font-light line-clamp-3 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <button
                onClick={() => setEditingDoctor({ ...doc })}
                className="w-full py-2 border border-neutral-700 hover:border-white text-xs font-mono uppercase text-white flex items-center justify-center gap-1.5 transition"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Editar Doctor</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CONTACTO & SEDE */}
      {/* ========================================================================= */}
      {activeTab === "contacto" && (
        <div className="border border-[#222228] bg-[#121216] p-6 space-y-6">
          <h3 className="text-base font-normal text-white border-b border-[#222228] pb-3">
            Canales de Admisión y Ubicación
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">WhatsApp de Atención</label>
              <input
                type="text"
                value={cmsData.clinicInfo.contact.phone}
                onChange={(e) => handleContactChange("phone", e.target.value)}
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">Número Limpio (WhatsApp Link)</label>
              <input
                type="text"
                value={cmsData.clinicInfo.contact.whatsappNumber}
                onChange={(e) => handleContactChange("whatsappNumber", e.target.value)}
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">Correo Electrónico Oficial</label>
              <input
                type="email"
                value={cmsData.clinicInfo.contact.email}
                onChange={(e) => handleContactChange("email", e.target.value)}
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">Dirección Clínica (Texto Completo)</label>
              <input
                type="text"
                value={cmsData.clinicInfo.address.full}
                onChange={(e) => {
                  const updated = {
                    ...cmsData,
                    clinicInfo: {
                      ...cmsData.clinicInfo,
                      address: {
                        ...cmsData.clinicInfo.address,
                        full: e.target.value
                      }
                    }
                  };
                  setCmsData(updated);
                }}
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">Horario Lunes a Viernes</label>
              <input
                type="text"
                value={cmsData.clinicInfo.hours.weekdays}
                onChange={(e) => handleHoursChange("weekdays", e.target.value)}
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">Horario Sábados</label>
              <input
                type="text"
                value={cmsData.clinicInfo.hours.saturday}
                onChange={(e) => handleHoursChange("saturday", e.target.value)}
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveAll}
              className="px-6 py-2.5 bg-white text-black font-bold font-mono text-xs uppercase tracking-wider hover:bg-neutral-200 transition"
            >
              Guardar Cambios de Contacto
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TICKER & ANUNCIOS */}
      {/* ========================================================================= */}
      {activeTab === "anuncios" && (
        <div className="space-y-6">
          <form onSubmit={handleAddAnnouncement} className="border border-[#222228] bg-[#121216] p-5 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="Escribe un nuevo mensaje para la barra superior..."
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
              className="flex-1 px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-white text-black font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Anuncio</span>
            </button>
          </form>

          <div className="border border-[#222228] bg-[#121216] divide-y divide-[#222228]">
            {cmsData.announcements.map((msg, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-neutral-500">#{idx + 1}</span>
                  <span className="text-xs text-neutral-200">{msg}</span>
                </div>
                <button
                  onClick={() => handleDeleteAnnouncement(idx)}
                  className="p-1.5 text-neutral-400 hover:text-red-400 transition"
                  title="Eliminar mensaje"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PROMOS */}
      {/* ========================================================================= */}
      {activeTab === "promos" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cmsData.promotions.map((promo, idx) => (
            <div key={promo.id} className="border border-[#222228] bg-[#121216] p-5 space-y-4">
              <span className="text-[10px] font-mono text-pink-400 uppercase block font-semibold">{promo.tag}</span>
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Título de la Campaña</label>
                  <input
                    type="text"
                    value={promo.title}
                    onChange={(e) => {
                      const updatedPromos = [...cmsData.promotions];
                      updatedPromos[idx].title = e.target.value;
                      setCmsData({ ...cmsData, promotions: updatedPromos });
                    }}
                    className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Descuento o Beneficio</label>
                  <input
                    type="text"
                    value={promo.discount}
                    onChange={(e) => {
                      const updatedPromos = [...cmsData.promotions];
                      updatedPromos[idx].discount = e.target.value;
                      setCmsData({ ...cmsData, promotions: updatedPromos });
                    }}
                    className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Descripción</label>
                  <textarea
                    rows={2}
                    value={promo.description}
                    onChange={(e) => {
                      const updatedPromos = [...cmsData.promotions];
                      updatedPromos[idx].description = e.target.value;
                      setCmsData({ ...cmsData, promotions: updatedPromos });
                    }}
                    className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSaveAll}
                  className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs uppercase"
                >
                  Guardar Promo
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDITAR TRATAMIENTO */}
      {/* ========================================================================= */}
      {editingTreatment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-[#2b2b34] max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#222228] pb-3">
              <h3 className="text-base font-bold text-white">Editar Tratamiento Dental</h3>
              <button
                onClick={() => setEditingTreatment(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTreatment} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Nombre del Tratamiento *</label>
                <input
                  type="text"
                  required
                  value={editingTreatment.name}
                  onChange={(e) => setEditingTreatment({ ...editingTreatment, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Etiqueta de Categoría</label>
                  <input
                    type="text"
                    required
                    value={editingTreatment.tag}
                    onChange={(e) => setEditingTreatment({ ...editingTreatment, tag: e.target.value })}
                    className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Categoría Filtro</label>
                  <select
                    value={editingTreatment.category}
                    onChange={(e) => setEditingTreatment({ ...editingTreatment, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
                  >
                    <option value="Tratamientos Estéticos">Tratamientos Estéticos</option>
                    <option value="Especialidades">Especialidades</option>
                    <option value="Tratamientos Generales">Tratamientos Generales</option>
                    <option value="Tratamientos">Tratamientos</option>
                    <option value="Prevención">Prevención</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Ruta de Imagen</label>
                <input
                  type="text"
                  value={editingTreatment.image}
                  onChange={(e) => setEditingTreatment({ ...editingTreatment, image: e.target.value })}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Descripción Corta (Card Pública)</label>
                <textarea
                  rows={2}
                  required
                  value={editingTreatment.shortDescription}
                  onChange={(e) => setEditingTreatment({ ...editingTreatment, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Descripción Completa (Modal Clínico)</label>
                <textarea
                  rows={3}
                  value={editingTreatment.fullDescription}
                  onChange={(e) => setEditingTreatment({ ...editingTreatment, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Indicación Médica (Recomendado para)</label>
                <input
                  type="text"
                  value={editingTreatment.recommendedFor}
                  onChange={(e) => setEditingTreatment({ ...editingTreatment, recommendedFor: e.target.value })}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={editingTreatment.popular || false}
                  onChange={(e) => setEditingTreatment({ ...editingTreatment, popular: e.target.checked })}
                  className="rounded border-neutral-700 bg-neutral-900 text-purple-500"
                />
                <label htmlFor="popularCheck" className="text-xs text-neutral-300">
                  Marcar como "Alta Demanda" en la web
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#222228]">
                <button
                  type="button"
                  onClick={() => setEditingTreatment(null)}
                  className="px-4 py-2 border border-neutral-700 text-neutral-300 text-xs font-mono uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black font-bold text-xs font-mono uppercase hover:bg-neutral-200 transition"
                >
                  Guardar Tratamiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDITAR DOCTOR */}
      {/* ========================================================================= */}
      {editingDoctor && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-[#2b2b34] max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#222228] pb-3">
              <h3 className="text-base font-bold text-white">Editar Datos del Especialista</h3>
              <button
                onClick={() => setEditingDoctor(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoctor} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={editingDoctor.name}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Rol / Título</label>
                  <input
                    type="text"
                    required
                    value={editingDoctor.role}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, role: e.target.value })}
                    className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Días de Atención</label>
                  <input
                    type="text"
                    required
                    value={editingDoctor.schedule}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, schedule: e.target.value })}
                    className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Especialidad Clínica</label>
                <input
                  type="text"
                  value={editingDoctor.specialty}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, specialty: e.target.value })}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Reseña Profesional</label>
                <textarea
                  rows={3}
                  value={editingDoctor.description}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#222228]">
                <button
                  type="button"
                  onClick={() => setEditingDoctor(null)}
                  className="px-4 py-2 border border-neutral-700 text-neutral-300 text-xs font-mono uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black font-bold text-xs font-mono uppercase hover:bg-neutral-200 transition"
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
