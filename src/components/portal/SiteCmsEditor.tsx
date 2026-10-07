"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  getCMSData,
  saveCMSData,
  resetCMSData,
  CMSData,
  CMSPromotion,
  CMSHero,
  DEFAULT_HERO,
  CMSWelcomeSection,
  DEFAULT_WELCOME_SECTION,
  CMSPreventionSection,
  DEFAULT_PREVENTION_SECTION
} from "@/lib/cmsStore";
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
  Home,
  ShieldCheck,
  Layers,
  Image as ImageIcon
} from "lucide-react";

// Preset clinic images for 1-click selection by operators
const CLINIC_PRESET_IMAGES = {
  hero: [
    { label: "Portada Oficial (Mujer)", path: "/images/hero-woman.jpg" },
    { label: "Interior Box Clínico", path: "/images/clinic-interior.jpg" }
  ],
  promos: [
    { label: "Seguro Dental Familiar", path: "/images/promos/seguro-dental.png" },
    { label: "Campaña Diagnóstico", path: "/images/promos/promos-vigentes.png" }
  ],
  treatments: [
    { label: "Blanqueamiento", path: "/images/treatments_real/blanqueamiento.jpg" },
    { label: "Ortodoncia Metálica", path: "/images/treatments_real/ortodoncia.jpg" },
    { label: "Invisalign", path: "/images/treatments_real/invisalign.jpg" },
    { label: "Implantes", path: "/images/treatments_real/implantes.jpg" },
    { label: "Limpieza Profilaxis", path: "/images/treatments_real/limpieza.jpg" },
    { label: "Coronas", path: "/images/treatments_real/coronas.jpg" },
    { label: "Endodoncia", path: "/images/treatments_real/endodoncia.jpg" },
    { label: "Diseño Sonrisa", path: "/images/treatments_real/diseno-sonrisa.jpg" },
    { label: "Bruxismo", path: "/images/treatments_real/bruxismo.jpg" },
    { label: "Radiografías", path: "/images/treatments_real/radiografias.jpg" }
  ],
  doctors: [
    { label: "Dra. Keila Rodríguez", path: "/images/doctors/dra-keila-rodriguez.png" },
    { label: "Dra. Gabriela Fernández", path: "/images/doctors/dra-gabriela-fernandez.png" },
    { label: "Dra. Maythe Gamboa", path: "/images/doctors/dra-maythe-gamboa.png" },
    { label: "Dra. María Helena", path: "/images/doctors/dra-maria-helena.png" },
    { label: "Dr. William", path: "/images/doctors/dr-william.png" },
    { label: "Dr. Johnny Lugo", path: "/images/doctors/dr-johnny-lugo.png" },
    { label: "Dr. Juan José Herrera", path: "/images/doctors/dr-juan-jose-herrera.png" },
    { label: "Dra. Natascha Martins", path: "/images/doctors/dra-natascha-martins.png" }
  ]
};

export function SiteCmsEditor() {
  const [cmsData, setCmsData] = useState<CMSData>(getCMSData());
  const [activeTab, setActiveTab] = useState<
    "hero" | "pilares" | "prevencion" | "tratamientos" | "doctores" | "contacto" | "promos" | "anuncios"
  >("hero");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Modals
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [treatmentSearch, setTreatmentSearch] = useState("");
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState("");

  useEffect(() => {
    setCmsData(getCMSData());
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveAll = () => {
    saveCMSData(cmsData);
    triggerToast("✓ Cambios guardados y publicados con éxito en el sitio web");
  };

  const handleReset = () => {
    if (confirm("¿Estás seguro de restablecer todos los textos, imágenes y secciones a los valores oficiales de BeHappy Dental?")) {
      const reset = resetCMSData();
      setCmsData(reset);
      triggerToast("✓ Contenido restaurado a los valores predeterminados oficiales");
    }
  };

  // Treatment Handlers
  const handleSaveTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTreatment) return;

    const exists = cmsData.treatments.some((t) => t.id === editingTreatment.id);
    const updatedList = exists
      ? cmsData.treatments.map((t) => (t.id === editingTreatment.id ? editingTreatment : t))
      : [...cmsData.treatments, editingTreatment];

    const updated = { ...cmsData, treatments: updatedList };
    setCmsData(updated);
    saveCMSData(updated);
    setEditingTreatment(null);
    triggerToast(`✓ Tratamiento "${editingTreatment.name}" guardado`);
  };

  const handleDeleteTreatment = (id: string, name: string) => {
    if (confirm(`¿Eliminar el tratamiento "${name}" del catálogo público?`)) {
      const updatedList = cmsData.treatments.filter((t) => t.id !== id);
      const updated = { ...cmsData, treatments: updatedList };
      setCmsData(updated);
      saveCMSData(updated);
      triggerToast(`✓ Tratamiento "${name}" eliminado`);
    }
  };

  // Doctor Handlers
  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;

    const exists = cmsData.doctors.some((d) => d.id === editingDoctor.id);
    const updatedDoctors = exists
      ? cmsData.doctors.map((d) => (d.id === editingDoctor.id ? editingDoctor : d))
      : [...cmsData.doctors, editingDoctor];

    const updated = { ...cmsData, doctors: updatedDoctors };
    setCmsData(updated);
    saveCMSData(updated);
    setEditingDoctor(null);
    triggerToast(`✓ Especialista "${editingDoctor.name}" guardado`);
  };

  const handleDeleteDoctor = (id: string, name: string) => {
    if (confirm(`¿Eliminar al especialista "${name}" del directorio público?`)) {
      const updatedList = cmsData.doctors.filter((d) => d.id !== id);
      const updated = { ...cmsData, doctors: updatedList };
      setCmsData(updated);
      saveCMSData(updated);
      triggerToast(`✓ Especialista "${name}" eliminado`);
    }
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

  // Welcome / Pillars Handlers
  const handleWelcomeChange = (field: keyof CMSWelcomeSection, value: any) => {
    const updated = {
      ...cmsData,
      welcomeSection: {
        ...(cmsData.welcomeSection || DEFAULT_WELCOME_SECTION),
        [field]: value
      }
    };
    setCmsData(updated);
  };

  const handleWelcomeCardChange = (idx: number, field: string, value: string) => {
    const currentCards = [...(cmsData.welcomeSection?.cards || DEFAULT_WELCOME_SECTION.cards)];
    currentCards[idx] = { ...currentCards[idx], [field]: value };
    handleWelcomeChange("cards", currentCards);
  };

  const handleNewPatientChange = (field: string, value: string) => {
    const currentNP = { ...(cmsData.welcomeSection?.newPatient || DEFAULT_WELCOME_SECTION.newPatient), [field]: value };
    handleWelcomeChange("newPatient", currentNP);
  };

  // Prevention Handlers
  const handlePreventionChange = (field: keyof CMSPreventionSection, value: string) => {
    const updated = {
      ...cmsData,
      preventionSection: {
        ...(cmsData.preventionSection || DEFAULT_PREVENTION_SECTION),
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
    triggerToast("✓ Nuevo anuncio publicado en la barra superior");
  };

  const handleDeleteAnnouncement = (index: number) => {
    const updatedAnnouncements = cmsData.announcements.filter((_, i) => i !== index);
    const updated = { ...cmsData, announcements: updatedAnnouncements };
    setCmsData(updated);
    saveCMSData(updated);
    triggerToast("✓ Anuncio retirado");
  };

  // Filtered Treatments
  const filteredTreatments = cmsData.treatments.filter(
    (t) =>
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

      {/* Main Administrative Action Bar */}
      <div className="border border-[#222228] bg-[#121216] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase font-bold block mb-1">
            PANEL DE ADMINISTRACIÓN CLÍNICA · CONTROL TOTAL CMS
          </span>
          <h2 className="text-2xl font-normal text-white">CMS: Gestor Editorial del Sitio Web</h2>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Edita textos, fotos, teléfonos, horarios y campañas de behappydental.cl sin escribir código. Los cambios impactan en vivo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSaveAll}
            className="px-5 py-2.5 bg-white text-black font-bold font-mono text-xs uppercase tracking-wider hover:bg-neutral-200 transition flex items-center gap-1.5 shadow"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Todo</span>
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2.5 border border-neutral-700 hover:border-neutral-500 text-neutral-300 font-mono text-xs uppercase tracking-wider transition flex items-center gap-1.5"
            title="Restablecer contenido original oficial"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 border border-neutral-700 hover:border-white text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-wider transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver Sitio Web ↗</span>
          </a>
        </div>
      </div>

      {/* Categorized Hierarchy Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 border-b border-[#222228] pb-3">
        <button
          onClick={() => setActiveTab("hero")}
          className={`p-2.5 text-xs font-mono tracking-wider uppercase transition flex flex-col items-center justify-center gap-1 border text-center ${
            activeTab === "hero"
              ? "bg-[#1f1f26] text-white border-purple-500 font-semibold shadow"
              : "bg-[#121216] text-neutral-400 border-[#222228] hover:text-white"
          }`}
        >
          <Home className="w-4 h-4 text-purple-400" />
          <span className="text-[10px]">1. Portada</span>
        </button>

        <button
          onClick={() => setActiveTab("pilares")}
          className={`p-2.5 text-xs font-mono tracking-wider uppercase transition flex flex-col items-center justify-center gap-1 border text-center ${
            activeTab === "pilares"
              ? "bg-[#1f1f26] text-white border-purple-500 font-semibold shadow"
              : "bg-[#121216] text-neutral-400 border-[#222228] hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4 text-teal-400" />
          <span className="text-[10px]">2. Pilares</span>
        </button>

        <button
          onClick={() => setActiveTab("prevencion")}
          className={`p-2.5 text-xs font-mono tracking-wider uppercase transition flex flex-col items-center justify-center gap-1 border text-center ${
            activeTab === "prevencion"
              ? "bg-[#1f1f26] text-white border-purple-500 font-semibold shadow"
              : "bg-[#121216] text-neutral-400 border-[#222228] hover:text-white"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px]">3. Prevención</span>
        </button>

        <button
          onClick={() => setActiveTab("tratamientos")}
          className={`p-2.5 text-xs font-mono tracking-wider uppercase transition flex flex-col items-center justify-center gap-1 border text-center ${
            activeTab === "tratamientos"
              ? "bg-[#1f1f26] text-white border-purple-500 font-semibold shadow"
              : "bg-[#121216] text-neutral-400 border-[#222228] hover:text-white"
          }`}
        >
          <Stethoscope className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px]">4. Catálogo ({cmsData.treatments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("doctores")}
          className={`p-2.5 text-xs font-mono tracking-wider uppercase transition flex flex-col items-center justify-center gap-1 border text-center ${
            activeTab === "doctores"
              ? "bg-[#1f1f26] text-white border-purple-500 font-semibold shadow"
              : "bg-[#121216] text-neutral-400 border-[#222228] hover:text-white"
          }`}
        >
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-[10px]">5. Equipo ({cmsData.doctors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("promos")}
          className={`p-2.5 text-xs font-mono tracking-wider uppercase transition flex flex-col items-center justify-center gap-1 border text-center ${
            activeTab === "promos"
              ? "bg-[#1f1f26] text-white border-purple-500 font-semibold shadow"
              : "bg-[#121216] text-neutral-400 border-[#222228] hover:text-white"
          }`}
        >
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span className="text-[10px]">6. Promociones</span>
        </button>

        <button
          onClick={() => setActiveTab("contacto")}
          className={`p-2.5 text-xs font-mono tracking-wider uppercase transition flex flex-col items-center justify-center gap-1 border text-center ${
            activeTab === "contacto"
              ? "bg-[#1f1f26] text-white border-purple-500 font-semibold shadow"
              : "bg-[#121216] text-neutral-400 border-[#222228] hover:text-white"
          }`}
        >
          <PhoneCall className="w-4 h-4 text-amber-400" />
          <span className="text-[10px]">7. Sede & Datos</span>
        </button>

        <button
          onClick={() => setActiveTab("anuncios")}
          className={`p-2.5 text-xs font-mono tracking-wider uppercase transition flex flex-col items-center justify-center gap-1 border text-center ${
            activeTab === "anuncios"
              ? "bg-[#1f1f26] text-white border-purple-500 font-semibold shadow"
              : "bg-[#121216] text-neutral-400 border-[#222228] hover:text-white"
          }`}
        >
          <Bell className="w-4 h-4 text-rose-400" />
          <span className="text-[10px]">8. Ticker ({cmsData.announcements.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECCIÓN 1: PORTADA & HERO */}
      {/* ========================================================================= */}
      {activeTab === "hero" && (
        <div className="border border-[#222228] bg-[#121216] p-6 space-y-6">
          <div className="border-b border-[#222228] pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-normal text-white">Portada Principal (Hero Banner)</h3>
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                Encabezado principal visible al ingresar a behappydental.cl
              </p>
            </div>
            <span className="text-[10px] font-mono text-purple-400 border border-purple-800/60 bg-purple-950/30 px-2.5 py-1">
              SECCIÓN VISIBLE: ARRIBA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Saludo inicial (Kicker)
              </label>
              <input
                type="text"
                value={cmsData.hero?.welcomeKicker || "Bienvenidos a"}
                onChange={(e) => handleHeroChange("welcomeKicker", e.target.value)}
                placeholder="Bienvenidos a"
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Título Oficial de la Clínica
              </label>
              <input
                type="text"
                value={cmsData.hero?.title || "Centro Dental BeHappy"}
                onChange={(e) => handleHeroChange("title", e.target.value)}
                placeholder="Centro Dental BeHappy"
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-bold focus:border-purple-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Descripción / Bajada Principal
              </label>
              <textarea
                rows={2}
                value={cmsData.hero?.subtitle || ""}
                onChange={(e) => handleHeroChange("subtitle", e.target.value)}
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs leading-relaxed focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Texto Botón Principal (Pill)
              </label>
              <input
                type="text"
                value={cmsData.hero?.primaryCtaText || "Reserva aquí"}
                onChange={(e) => handleHeroChange("primaryCtaText", e.target.value)}
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Enlace Botón Principal (WhatsApp o URL)
              </label>
              <input
                type="text"
                value={cmsData.hero?.primaryCtaUrl || ""}
                onChange={(e) => handleHeroChange("primaryCtaUrl", e.target.value)}
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Texto Botón Secundario (Agendamiento)
              </label>
              <input
                type="text"
                value={cmsData.hero?.secondaryCtaText || "Agendar con agendador →"}
                onChange={(e) => handleHeroChange("secondaryCtaText", e.target.value)}
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
              />
            </div>

            {/* Photo with Live Preview & Presets */}
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Ruta o URL Imagen de Fondo
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cmsData.hero?.bgImage || "/images/hero-woman.jpg"}
                  onChange={(e) => handleHeroChange("bgImage", e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
                />
                <div className="relative w-12 h-9 border border-[#2b2b34] bg-neutral-900 overflow-hidden shrink-0">
                  <Image
                    src={cmsData.hero?.bgImage || "/images/hero-woman.jpg"}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-mono text-neutral-500">Fotos sugeridas:</span>
                {CLINIC_PRESET_IMAGES.hero.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleHeroChange("bgImage", p.path)}
                    className="text-[10px] font-mono px-2 py-0.5 border border-neutral-700 bg-neutral-800 hover:border-purple-400 text-neutral-300 hover:text-white"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-Time Live Preview Visual Box */}
          <div className="p-4 border border-[#2b2b34] bg-[#0c0c10] space-y-2">
            <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block">
              Vista Previa en Vivo (Simulación del Hero)
            </span>
            <div className="relative p-8 bg-black border border-neutral-800 text-center space-y-3 rounded overflow-hidden">
              <span className="text-neutral-300 text-sm block font-light">{cmsData.hero?.welcomeKicker}</span>
              <h4 className="text-2xl font-normal text-white">{cmsData.hero?.title}</h4>
              <p className="text-xs text-neutral-300 max-w-lg mx-auto font-light leading-relaxed">
                {cmsData.hero?.subtitle}
              </p>
              <div className="pt-3 flex items-center justify-center gap-3">
                <span className="px-6 py-2 rounded-full border border-white text-white text-xs font-medium">
                  {cmsData.hero?.primaryCtaText}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-white/10 text-neutral-300 text-[11px] font-mono">
                  {cmsData.hero?.secondaryCtaText}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveAll}
              className="px-6 py-2.5 bg-white text-black font-bold font-mono text-xs uppercase tracking-wider hover:bg-neutral-200 transition"
            >
              Guardar Portada & Hero
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN 2: PILARES & BIENVENIDA */}
      {/* ========================================================================= */}
      {activeTab === "pilares" && (
        <div className="space-y-6">
          {/* Header of Section */}
          <div className="border border-[#222228] bg-[#121216] p-6 space-y-4">
            <div className="border-b border-[#222228] pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-normal text-white">4 Pilares Institucionales & Accesos</h3>
                <p className="text-xs text-neutral-400 font-light mt-0.5">
                  Las 4 tarjetas principales bajo la portada que guían a pacientes hacia cómo llegar, seguro, catálogo y especialistas.
                </p>
              </div>
              <span className="text-[10px] font-mono text-teal-400 border border-teal-800/60 bg-teal-950/30 px-2.5 py-1">
                SECCIÓN 2
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Kicker de Sección
                </label>
                <input
                  type="text"
                  value={cmsData.welcomeSection?.kicker || DEFAULT_WELCOME_SECTION.kicker}
                  onChange={(e) => handleWelcomeChange("kicker", e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Título de Sección
                </label>
                <input
                  type="text"
                  value={cmsData.welcomeSection?.title || DEFAULT_WELCOME_SECTION.title}
                  onChange={(e) => handleWelcomeChange("title", e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-bold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Bajada Explicativa
                </label>
                <textarea
                  rows={2}
                  value={cmsData.welcomeSection?.subtitle || DEFAULT_WELCOME_SECTION.subtitle}
                  onChange={(e) => handleWelcomeChange("subtitle", e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Cards Editor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(cmsData.welcomeSection?.cards || DEFAULT_WELCOME_SECTION.cards).map((card, idx) => (
              <div key={card.id || idx} className="border border-[#222228] bg-[#121216] p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[#222228] pb-2">
                  <span className="text-[11px] font-mono font-bold text-teal-400">
                    TARJETA {card.number} · {card.tag}
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Título</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => handleWelcomeCardChange(idx, "title", e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Descripción</label>
                  <textarea
                    rows={2}
                    value={card.description}
                    onChange={(e) => handleWelcomeCardChange(idx, "description", e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Texto Enlace</label>
                    <input
                      type="text"
                      value={card.linkText}
                      onChange={(e) => handleWelcomeCardChange(idx, "linkText", e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Destino Enlace</label>
                    <input
                      type="text"
                      value={card.linkUrl}
                      onChange={(e) => handleWelcomeCardChange(idx, "linkUrl", e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* New Patient Section Box */}
          <div className="border border-[#222228] bg-[#121216] p-6 space-y-4">
            <div className="border-b border-[#222228] pb-3">
              <span className="text-[10px] font-mono uppercase text-teal-400 font-bold block">
                MÓDULO DE ADMISIÓN: "¿NUEVO COMO PACIENTE? CONTÁCTENOS HOY MISMO"
              </span>
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                Bloque con la fotografía del box clínico de Suecia 3580 e invitación de contacto directo por WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">Título</label>
                <textarea
                  rows={2}
                  value={cmsData.welcomeSection?.newPatient?.title || DEFAULT_WELCOME_SECTION.newPatient.title}
                  onChange={(e) => handleNewPatientChange("title", e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">Texto Botón WhatsApp</label>
                <input
                  type="text"
                  value={cmsData.welcomeSection?.newPatient?.buttonText || DEFAULT_WELCOME_SECTION.newPatient.buttonText}
                  onChange={(e) => handleNewPatientChange("buttonText", e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">Párrafo 1</label>
                <textarea
                  rows={2}
                  value={cmsData.welcomeSection?.newPatient?.description1 || DEFAULT_WELCOME_SECTION.newPatient.description1}
                  onChange={(e) => handleNewPatientChange("description1", e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">Párrafo 2</label>
                <textarea
                  rows={2}
                  value={cmsData.welcomeSection?.newPatient?.description2 || DEFAULT_WELCOME_SECTION.newPatient.description2}
                  onChange={(e) => handleNewPatientChange("description2", e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                />
              </div>

              {/* Photo & Badge */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                    Foto del Box Clínico (Ruta o URL)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={cmsData.welcomeSection?.newPatient?.image || "/images/clinic-interior.jpg"}
                      onChange={(e) => handleNewPatientChange("image", e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
                    />
                    <div className="relative w-16 h-10 border border-[#2b2b34] bg-neutral-900 overflow-hidden shrink-0">
                      <Image
                        src={cmsData.welcomeSection?.newPatient?.image || "/images/clinic-interior.jpg"}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                    Etiqueta sobre la Foto (Badge)
                  </label>
                  <input
                    type="text"
                    value={cmsData.welcomeSection?.newPatient?.imageCaption || "Box Dental · Suecia 3580, Ñuñoa"}
                    onChange={(e) => handleNewPatientChange("imageCaption", e.target.value)}
                    className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#222228]">
              <button
                onClick={handleSaveAll}
                className="px-6 py-2.5 bg-white text-black font-bold font-mono text-xs uppercase tracking-wider hover:bg-neutral-200 transition"
              >
                Guardar Pilares & Admisión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN 3: CRITERIO PREVENTIVO */}
      {/* ========================================================================= */}
      {activeTab === "prevencion" && (
        <div className="border border-[#222228] bg-[#121216] p-6 space-y-6">
          <div className="border-b border-[#222228] pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-normal text-white">Criterio Preventivo & Filosofía Clínica</h3>
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                "Una visita al dentista puede ahorrarte dinero": texto editorial que educa al paciente sobre revisiones periódicas.
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 border border-emerald-800/60 bg-emerald-950/30 px-2.5 py-1">
              SECCIÓN 3
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Kicker Superior
                </label>
                <input
                  type="text"
                  value={cmsData.preventionSection?.kicker || DEFAULT_PREVENTION_SECTION.kicker}
                  onChange={(e) => handlePreventionChange("kicker", e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Texto del Botón / Enlace
                </label>
                <input
                  type="text"
                  value={cmsData.preventionSection?.ctaText || DEFAULT_PREVENTION_SECTION.ctaText}
                  onChange={(e) => handlePreventionChange("ctaText", e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Gran Titular Editorial
              </label>
              <textarea
                rows={2}
                value={cmsData.preventionSection?.title || DEFAULT_PREVENTION_SECTION.title}
                onChange={(e) => handlePreventionChange("title", e.target.value)}
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-sm font-serif"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Cita Médica Destacada (Frase en Cursiva)
              </label>
              <textarea
                rows={2}
                value={cmsData.preventionSection?.quote || DEFAULT_PREVENTION_SECTION.quote}
                onChange={(e) => handlePreventionChange("quote", e.target.value)}
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs italic"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Párrafo Explicativo 1
                </label>
                <textarea
                  rows={4}
                  value={cmsData.preventionSection?.paragraph1 || DEFAULT_PREVENTION_SECTION.paragraph1}
                  onChange={(e) => handlePreventionChange("paragraph1", e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Párrafo Explicativo 2
                </label>
                <textarea
                  rows={4}
                  value={cmsData.preventionSection?.paragraph2 || DEFAULT_PREVENTION_SECTION.paragraph2}
                  onChange={(e) => handlePreventionChange("paragraph2", e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-[#222228]">
            <button
              onClick={handleSaveAll}
              className="px-6 py-2.5 bg-white text-black font-bold font-mono text-xs uppercase tracking-wider hover:bg-neutral-200 transition"
            >
              Guardar Filosofía Preventiva
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN 4: CATÁLOGO DE TRATAMIENTOS */}
      {/* ========================================================================= */}
      {activeTab === "tratamientos" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#121216] p-4 border border-[#222228]">
            <input
              type="text"
              placeholder="Buscar por nombre, categoría o etiqueta..."
              value={treatmentSearch}
              onChange={(e) => setTreatmentSearch(e.target.value)}
              className="px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs w-full sm:w-80 outline-none focus:border-cyan-500"
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
                  benefits: ["Resultados clínicos óptimos", "Procedimiento confortable y seguro"],
                  image: "/images/treatments_real/blanqueamiento.jpg",
                  recommendedFor: "Pacientes con requerimiento clínico específico.",
                  popular: false
                })
              }
              className="px-4 py-2 bg-white text-black font-mono text-xs uppercase font-bold flex items-center justify-center gap-1.5 hover:bg-neutral-200 transition"
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
                  <th className="p-3 w-16">Foto</th>
                  <th className="p-3">Nombre & Slug</th>
                  <th className="p-3">Categoría</th>
                  <th className="p-3">Descripción Breve</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222228]">
                {filteredTreatments.map((t) => (
                  <tr key={t.id} className="hover:bg-[#18181f] transition">
                    <td className="p-3">
                      <div className="relative w-12 h-10 bg-neutral-900 border border-neutral-800 overflow-hidden">
                        <Image src={t.image} alt={t.name} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-white">{t.name}</div>
                      <div className="text-[10px] text-neutral-500">/{t.slug}</div>
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
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingTreatment({ ...t })}
                          className="px-3 py-1.5 border border-neutral-700 hover:border-white text-white text-[11px] font-mono uppercase inline-flex items-center gap-1 transition"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTreatment(t.id, t.name)}
                          className="p-1.5 border border-neutral-800 hover:border-red-500 text-neutral-400 hover:text-red-400 transition"
                          title="Eliminar del catálogo"
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN 5: EQUIPO MÉDICO */}
      {/* ========================================================================= */}
      {activeTab === "doctores" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#121216] p-4 border border-[#222228]">
            <p className="text-xs text-neutral-400 font-light">
              Doctores y especialistas acreditados en la Superintendencia de Salud de Chile.
            </p>
            <button
              onClick={() =>
                setEditingDoctor({
                  id: `doc-${Date.now()}`,
                  name: "Dr. Nuevo Especialista",
                  slug: `dr-nuevo-${Date.now()}`,
                  role: "Cirujano Dentista",
                  specialty: "Odontología Integral",
                  schedule: "Lunes a Viernes 10:00 - 20:00 (Previa reserva)",
                  description: "Especialista clínico con amplia trayectoria en atención dental moderna.",
                  image: "/images/doctors/dra-keila-rodriguez.png",
                  tags: ["Odontología Integral"]
                })
              }
              className="px-4 py-2 bg-white text-black font-mono text-xs uppercase font-bold flex items-center gap-1.5 hover:bg-neutral-200 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Especialista</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cmsData.doctors.map((doc) => (
              <div
                key={doc.id}
                className="border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="relative w-full h-44 bg-[#18181f] overflow-hidden border border-neutral-800">
                    <Image src={doc.image} alt={doc.name} fill className="object-cover object-top" />
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

                <div className="flex items-center gap-2 pt-2 border-t border-[#222228]">
                  <button
                    onClick={() => setEditingDoctor({ ...doc })}
                    className="flex-1 py-1.5 border border-neutral-700 hover:border-white text-xs font-mono uppercase text-white flex items-center justify-center gap-1.5 transition"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                    className="p-1.5 border border-neutral-800 hover:border-red-500 text-neutral-400 hover:text-red-400 transition"
                    title="Eliminar doctor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN 6: PROMOCIONES & SEGURO */}
      {/* ========================================================================= */}
      {activeTab === "promos" && (
        <div className="space-y-6">
          <div className="border border-[#222228] bg-[#121216] p-4 flex justify-between items-center">
            <p className="text-xs text-neutral-400 font-light">
              Campañas vigentes, convenios y planes con descuentos para pacientes.
            </p>
            <button
              onClick={() => {
                const newPromo: CMSPromotion = {
                  id: `promo-${Date.now()}`,
                  tag: "NUEVA PROMOCIÓN BEHAPPY",
                  title: "Nueva Campaña Dental",
                  discount: "20% DSCTO",
                  description: "Descripción de las condiciones y cobertura del beneficio...",
                  badge: "Válido este mes",
                  image: "/images/promos/seguro-dental.png",
                  linkText: "Consultar Beneficio",
                  linkHref: "/#agendar"
                };
                const updated = { ...cmsData, promotions: [...cmsData.promotions, newPromo] };
                setCmsData(updated);
                saveCMSData(updated);
                triggerToast("✓ Nueva promoción agregada");
              }}
              className="px-4 py-2 bg-white text-black font-mono text-xs uppercase font-bold flex items-center gap-1.5 hover:bg-neutral-200 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Campaña</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cmsData.promotions.map((promo, idx) => (
              <div key={promo.id || idx} className="border border-[#222228] bg-[#121216] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#222228] pb-2">
                  <span className="text-[10px] font-mono text-pink-400 uppercase font-bold">
                    CAMPAÑA {idx + 1}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar la promoción "${promo.title}"?`)) {
                        const updatedPromos = cmsData.promotions.filter((_, i) => i !== idx);
                        const updated = { ...cmsData, promotions: updatedPromos };
                        setCmsData(updated);
                        saveCMSData(updated);
                        triggerToast("✓ Campaña eliminada");
                      }
                    }}
                    className="text-neutral-500 hover:text-red-400 p-1"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                      Etiqueta Superior
                    </label>
                    <input
                      type="text"
                      value={promo.tag}
                      onChange={(e) => {
                        const updated = [...cmsData.promotions];
                        updated[idx].tag = e.target.value;
                        setCmsData({ ...cmsData, promotions: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                      Título de la Campaña
                    </label>
                    <input
                      type="text"
                      value={promo.title}
                      onChange={(e) => {
                        const updated = [...cmsData.promotions];
                        updated[idx].title = e.target.value;
                        setCmsData({ ...cmsData, promotions: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                      Descuento o Beneficio (Cifra)
                    </label>
                    <input
                      type="text"
                      value={promo.discount}
                      onChange={(e) => {
                        const updated = [...cmsData.promotions];
                        updated[idx].discount = e.target.value;
                        setCmsData({ ...cmsData, promotions: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                      Descripción del Beneficio
                    </label>
                    <textarea
                      rows={2}
                      value={promo.description}
                      onChange={(e) => {
                        const updated = [...cmsData.promotions];
                        updated[idx].description = e.target.value;
                        setCmsData({ ...cmsData, promotions: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                    />
                  </div>

                  {/* Photo with Live Preview & Presets */}
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                      Ruta o URL de Imagen
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promo.image || "/images/promos/seguro-dental.png"}
                        onChange={(e) => {
                          const updated = [...cmsData.promotions];
                          updated[idx].image = e.target.value;
                          setCmsData({ ...cmsData, promotions: updated });
                        }}
                        className="flex-1 px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
                      />
                      <div className="relative w-12 h-8 border border-[#2b2b34] bg-neutral-900 overflow-hidden shrink-0">
                        <Image
                          src={promo.image || "/images/promos/seguro-dental.png"}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                        Texto Botón
                      </label>
                      <input
                        type="text"
                        value={promo.linkText}
                        onChange={(e) => {
                          const updated = [...cmsData.promotions];
                          updated[idx].linkText = e.target.value;
                          setCmsData({ ...cmsData, promotions: updated });
                        }}
                        className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                        Enlace Destino
                      </label>
                      <input
                        type="text"
                        value={promo.linkHref}
                        onChange={(e) => {
                          const updated = [...cmsData.promotions];
                          updated[idx].linkHref = e.target.value;
                          setCmsData({ ...cmsData, promotions: updated });
                        }}
                        className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
                      />
                    </div>
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN 7: SEDE, CONTACTO & HORARIOS */}
      {/* ========================================================================= */}
      {activeTab === "contacto" && (
        <div className="border border-[#222228] bg-[#121216] p-6 space-y-6">
          <div className="border-b border-[#222228] pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-normal text-white">Canales Oficiales, Ubicación y Horarios</h3>
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                Datos de contacto oficiales que alimentan el footer, navbar y sección de ubicación.
              </p>
            </div>
            <span className="text-[10px] font-mono text-amber-400 border border-amber-800/60 bg-amber-950/30 px-2.5 py-1">
              SECCIÓN 7
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                WhatsApp Visible al Público
              </label>
              <input
                type="text"
                value={cmsData.clinicInfo.contact.phone}
                onChange={(e) => handleContactChange("phone", e.target.value)}
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Número Internacional Limpio (Links WhatsApp)
              </label>
              <input
                type="text"
                value={cmsData.clinicInfo.contact.whatsappNumber}
                onChange={(e) => handleContactChange("whatsappNumber", e.target.value)}
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Correo Electrónico Oficial
              </label>
              <input
                type="email"
                value={cmsData.clinicInfo.contact.email}
                onChange={(e) => handleContactChange("email", e.target.value)}
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Dirección Oficial de la Clínica
              </label>
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
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Horario Lunes a Viernes
              </label>
              <input
                type="text"
                value={cmsData.clinicInfo.hours.weekdays}
                onChange={(e) => handleHoursChange("weekdays", e.target.value)}
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Horario Sábados
              </label>
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
              Guardar Canales & Horarios
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN 8: TICKER & ANUNCIOS SUPERIOR */}
      {/* ========================================================================= */}
      {activeTab === "anuncios" && (
        <div className="space-y-6">
          <form
            onSubmit={handleAddAnnouncement}
            className="border border-[#222228] bg-[#121216] p-5 flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              required
              placeholder="Escribe un nuevo mensaje para la barra superior rotativa..."
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
              className="flex-1 px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs outline-none focus:border-rose-400"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-white text-black font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar Anuncio</span>
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
      {/* MODAL: EDITAR TRATAMIENTO (CON PREVIEW DE IMAGEN & SUGERENCIAS) */}
      {/* ========================================================================= */}
      {editingTreatment && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-[#2b2b34] max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#222228] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-cyan-400" />
                <span>Editar Tratamiento Dental</span>
              </h3>
              <button onClick={() => setEditingTreatment(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTreatment} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                  Nombre del Tratamiento *
                </label>
                <input
                  type="text"
                  required
                  value={editingTreatment.name}
                  onChange={(e) => setEditingTreatment({ ...editingTreatment, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                    Etiqueta Visual
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTreatment.tag}
                    onChange={(e) => setEditingTreatment({ ...editingTreatment, tag: e.target.value })}
                    className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                    Categoría de Filtro
                  </label>
                  <select
                    value={editingTreatment.category}
                    onChange={(e) =>
                      setEditingTreatment({ ...editingTreatment, category: e.target.value as any })
                    }
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

              {/* Treatment Image with Live Preview & Suggestion Chips */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase text-neutral-400">
                  Foto Clínica del Tratamiento
                </label>
                <div className="flex gap-2.5 items-center">
                  <input
                    type="text"
                    value={editingTreatment.image}
                    onChange={(e) => setEditingTreatment({ ...editingTreatment, image: e.target.value })}
                    className="flex-1 px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
                    placeholder="/images/treatments_real/..."
                  />
                  <div className="relative w-14 h-11 border border-[#2b2b34] bg-neutral-900 overflow-hidden shrink-0">
                    <Image
                      src={editingTreatment.image || "/images/treatments_real/blanqueamiento.jpg"}
                      alt={editingTreatment.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                {/* Presets */}
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-[10px] font-mono text-neutral-500 mr-1 self-center">Fotos:</span>
                  {CLINIC_PRESET_IMAGES.treatments.slice(0, 6).map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setEditingTreatment({ ...editingTreatment, image: img.path })}
                      className="text-[10px] font-mono px-2 py-0.5 border border-neutral-800 bg-neutral-900 hover:border-cyan-400 text-neutral-300"
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                  Descripción Corta (Visible en tarjeta pública)
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingTreatment.shortDescription}
                  onChange={(e) => setEditingTreatment({ ...editingTreatment, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                  Protocolo y Descripción Detallada
                </label>
                <textarea
                  rows={3}
                  value={editingTreatment.fullDescription}
                  onChange={(e) => setEditingTreatment({ ...editingTreatment, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                  Indicación Médica (Recomendado para)
                </label>
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
                  className="rounded border-neutral-700 bg-neutral-900 text-cyan-400"
                />
                <label htmlFor="popularCheck" className="text-xs text-neutral-300">
                  Marcar como "Tratamiento Destacado / Alta Demanda"
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
      {/* MODAL: EDITAR DOCTOR (CON PREVIEW DE FOTO & SELECTOR) */}
      {/* ========================================================================= */}
      {editingDoctor && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-[#2b2b34] max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#222228] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Editar Datos del Especialista</span>
              </h3>
              <button onClick={() => setEditingDoctor(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoctor} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={editingDoctor.name}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                    Rol / Título
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDoctor.role}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, role: e.target.value })}
                    className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                    Días / Horario de Atención
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDoctor.schedule}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, schedule: e.target.value })}
                    className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* Doctor Photo with Live Preview & Presets */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase text-neutral-400">
                  Fotografía Oficial del Doctor
                </label>
                <div className="flex gap-2.5 items-center">
                  <input
                    type="text"
                    value={editingDoctor.image}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, image: e.target.value })}
                    className="flex-1 px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
                    placeholder="/images/doctors/..."
                  />
                  <div className="relative w-12 h-14 border border-[#2b2b34] bg-neutral-900 overflow-hidden shrink-0">
                    <Image
                      src={editingDoctor.image || "/images/doctors/dra-keila-rodriguez.png"}
                      alt={editingDoctor.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>
                {/* Presets */}
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-[10px] font-mono text-neutral-500 mr-1 self-center">Fotos:</span>
                  {CLINIC_PRESET_IMAGES.doctors.slice(0, 4).map((dImg, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setEditingDoctor({ ...editingDoctor, image: dImg.path })}
                      className="text-[10px] font-mono px-2 py-0.5 border border-neutral-800 bg-neutral-900 hover:border-blue-400 text-neutral-300"
                    >
                      {dImg.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                  Especialidad Clínica
                </label>
                <input
                  type="text"
                  value={editingDoctor.specialty}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, specialty: e.target.value })}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                  Reseña Profesional
                </label>
                <textarea
                  rows={3}
                  value={editingDoctor.description}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs leading-relaxed"
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
