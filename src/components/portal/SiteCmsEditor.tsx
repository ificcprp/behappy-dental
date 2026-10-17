"use client";

import React, { useState, useEffect } from "react";
import {
  getCMSData,
  saveCMSData,
  publishCMSData,
  resetCMSData,
  CMSData,
  DEFAULT_MEMBERSHIP_PLANS,
  DEFAULT_HERO,
  DEFAULT_WELCOME_SECTION,
  DEFAULT_PREVENTION_SECTION,
  DEFAULT_AUTH_PORTAL,
  DEFAULT_HEADER_CONFIG,
} from "@/lib/cmsStore";
import { Treatment } from "@/data/treatments";
import { Doctor } from "@/data/doctors";
import {
  Sparkles,
  Layers,
  HeartHandshake,
  CreditCard,
  Stethoscope,
  Users,
  Percent,
  PhoneCall,
  Bell,
  Check,
  KeyRound,
  Layout,
} from "lucide-react";

// Submódulos modulares Enterprise
import { CmsGlobalToolbar } from "./cms/CmsGlobalToolbar";
import { VersionHistoryModal } from "./cms/VersionHistoryModal";
import { HeroEditor } from "./cms/HeroEditor";
import { PilaresEditor } from "./cms/PilaresEditor";
import { PrevencionEditor } from "./cms/PrevencionEditor";
import { MembershipsFlowEditor } from "./cms/MembershipsFlowEditor";
import { TreatmentsCatalogEditor } from "./cms/TreatmentsCatalogEditor";
import { DoctorsStaffEditor } from "./cms/DoctorsStaffEditor";
import { CampaignsEditor } from "./cms/CampaignsEditor";
import { ContactLocationEditor } from "./cms/ContactLocationEditor";
import { AnnouncementsTickerEditor } from "./cms/AnnouncementsTickerEditor";
import { AuthPortalEditor } from "./cms/AuthPortalEditor";
import { HeaderMenuEditor } from "./cms/HeaderMenuEditor";

// Presets de imágenes oficiales de Centro Dental BeHappy
const CLINIC_PRESET_IMAGES = {
  hero: [
    { label: "Paciente Sonrisa (Default)", path: "/images/hero-woman.jpg" },
    { label: "Interior Box Dental", path: "/images/clinic-interior.jpg" },
    { label: "Equipo de Especialistas", path: "/images/doctors_real/dra-keila-rodriguez.jpg" },
    { label: "Tratamiento Invisalign", path: "/images/treatments_real/invisalign.jpg" },
    { label: "Diseño de Sonrisa", path: "/images/treatments_real/diseno-sonrisa.jpg" },
  ],
  treatments: [
    { label: "Blanqueamiento", path: "/images/treatments_real/blanqueamiento.jpg" },
    { label: "Ortodoncia", path: "/images/treatments_real/ortodoncia.jpg" },
    { label: "Implantes", path: "/images/treatments_real/implantes.jpg" },
    { label: "Invisalign", path: "/images/treatments_real/invisalign.jpg" },
    { label: "Coronas & Carillas", path: "/images/treatments_real/coronas.jpg" },
    { label: "Limpieza Dental", path: "/images/treatments_real/limpieza.jpg" },
    { label: "Odontopediatría", path: "/images/treatments_real/odontopediatria.jpg" },
    { label: "Endodoncia", path: "/images/treatments_real/endodoncia.jpg" },
    { label: "Diseño Sonrisa", path: "/images/treatments_real/diseno-sonrisa.jpg" },
    { label: "Bruxismo", path: "/images/treatments_real/bruxismo.jpg" },
    { label: "Radiografías", path: "/images/treatments_real/radiografias.jpg" },
  ],
  doctors: [
    { label: "Dra. Keila Rodríguez", path: "/images/doctors/dra-keila-rodriguez.png" },
    { label: "Dra. Gabriela Fernández", path: "/images/doctors/dra-gabriela-fernandez.png" },
    { label: "Dra. Maythe Gamboa", path: "/images/doctors/dra-maythe-gamboa.png" },
    { label: "Dra. María Helena", path: "/images/doctors/dra-maria-helena.png" },
    { label: "Dr. William", path: "/images/doctors/dr-william.png" },
    { label: "Dr. Johnny Lugo", path: "/images/doctors/dr-johnny-lugo.png" },
    { label: "Dr. Juan José Herrera", path: "/images/doctors/dr-juan-jose-herrera.png" },
    { label: "Dra. Natascha Martins", path: "/images/doctors/dra-natascha-martins.png" },
  ],
};

export function SiteCmsEditor() {
  const [cmsData, setCmsData] = useState<CMSData>(getCMSData());
  const [activeTab, setActiveTab] = useState<
    | "header"
    | "hero"
    | "pilares"
    | "prevencion"
    | "membresias"
    | "tratamientos"
    | "doctores"
    | "promos"
    | "contacto"
    | "anuncios"
    | "auth"
  >("header");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  useEffect(() => {
    setCmsData(getCMSData());
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Guardar Borrador (Sin alterar producción)
  const handleSaveDraft = () => {
    const updated = saveCMSData(cmsData, {
      status: "draft",
      versionTag: `Borrador ${new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`,
      changeSummary: "Borrador de cambios en preparación",
    });
    setCmsData(updated);
    triggerToast("✓ Borrador guardado exitosamente");
  };

  // Publicar Cambios en Producción
  const handlePublish = () => {
    const summary = prompt(
      "Resumen de los cambios a publicar (ej: 'Actualización de aranceles y convenio'):",
      "Publicación oficial desde Portal Dental"
    );
    if (summary === null) return; // Cancelado por usuario

    const updated = publishCMSData(
      cmsData,
      `v${new Date().toISOString().slice(0, 10)} · ${new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`,
      summary
    );
    setCmsData(updated);
    triggerToast("✓ Cambios publicados en producción y versionados en Supabase");
  };

  // Restablecer Valores Oficiales
  const handleReset = () => {
    if (
      confirm(
        "¿Estás seguro de restablecer todos los textos, imágenes y planes a los valores predeterminados oficiales de Centro Dental BeHappy?"
      )
    ) {
      const reset = resetCMSData();
      setCmsData(reset);
      triggerToast("✓ Contenido restaurado a los valores oficiales");
    }
  };

  // Restaurar Versión Histórica desde Rollback Modal
  const handleRestoreFromHistory = (restoredPayload: CMSData) => {
    setCmsData(restoredPayload);
    saveCMSData(restoredPayload, {
      status: "published",
      versionTag: "Restauración histórica aplicada",
      changeSummary: "Rollback ejecutado desde auditoría",
    });
    triggerToast("✓ Versión histórica restaurada y publicada en vivo");
  };

  return (
    <div className="space-y-6 w-full min-w-0 max-w-full">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-black px-4 py-2.5 font-mono text-xs font-bold uppercase shadow-2xl flex items-center gap-2 border border-emerald-400 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Toolbar Global de Control */}
      <CmsGlobalToolbar
        currentStatus={cmsData.currentStatus || "published"}
        versionTag={cmsData.versionTag || "v2.0 Producción"}
        lastUpdated={cmsData.lastUpdated}
        colorScheme={cmsData.headerConfig?.colorScheme || cmsData.siteColorScheme || "blanco"}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onReset={handleReset}
      />

      {/* Tabs Navigation (Adaptive Scrollable Bar) */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-[#0e0e12] p-1.5 border border-[#222228] rounded-md scrollbar-none">
        <button
          onClick={() => setActiveTab("header")}
          className={`px-3 py-2 text-xs font-mono tracking-wider uppercase transition flex items-center gap-2 border rounded-xs shrink-0 whitespace-nowrap ${
            activeTab === "header"
              ? "bg-[#18181f] text-sky-400 border-sky-500/70 font-bold"
              : "border-transparent text-neutral-400 hover:text-white hover:bg-[#141419]"
          }`}
        >
          <Layout className="w-3.5 h-3.5 shrink-0" />
          <span>0. Menú</span>
        </button>

        <button
          onClick={() => setActiveTab("hero")}
          className={`px-3 py-2 text-xs font-mono tracking-wider uppercase transition flex items-center gap-2 border rounded-xs shrink-0 whitespace-nowrap ${
            activeTab === "hero"
              ? "bg-[#18181f] text-purple-400 border-purple-500/70 font-bold"
              : "border-transparent text-neutral-400 hover:text-white hover:bg-[#141419]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>1. Hero</span>
        </button>

        <button
          onClick={() => setActiveTab("pilares")}
          className={`px-3 py-2 text-xs font-mono tracking-wider uppercase transition flex items-center gap-2 border rounded-xs shrink-0 whitespace-nowrap ${
            activeTab === "pilares"
              ? "bg-[#18181f] text-teal-400 border-teal-500/70 font-bold"
              : "border-transparent text-neutral-400 hover:text-white hover:bg-[#141419]"
          }`}
        >
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span>2. Pilares</span>
        </button>

        <button
          onClick={() => setActiveTab("prevencion")}
          className={`px-3 py-2 text-xs font-mono tracking-wider uppercase transition flex items-center gap-2 border rounded-xs shrink-0 whitespace-nowrap ${
            activeTab === "prevencion"
              ? "bg-[#18181f] text-emerald-400 border-emerald-500/70 font-bold"
              : "border-transparent text-neutral-400 hover:text-white hover:bg-[#141419]"
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5 shrink-0" />
          <span>3. Prevención</span>
        </button>

        <button
          onClick={() => setActiveTab("membresias")}
          className={`px-3 py-2 text-xs font-mono tracking-wider uppercase transition flex items-center gap-2 border rounded-xs shrink-0 whitespace-nowrap ${
            activeTab === "membresias"
              ? "bg-[#18181f] text-amber-400 border-amber-500/70 font-bold"
              : "border-transparent text-neutral-400 hover:text-white hover:bg-[#141419]"
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 shrink-0" />
          <span>4. Club</span>
        </button>

        <button
          onClick={() => setActiveTab("tratamientos")}
          className={`px-3 py-2 text-xs font-mono tracking-wider uppercase transition flex items-center gap-2 border rounded-xs shrink-0 whitespace-nowrap ${
            activeTab === "tratamientos"
              ? "bg-[#18181f] text-cyan-400 border-cyan-500/70 font-bold"
              : "border-transparent text-neutral-400 hover:text-white hover:bg-[#141419]"
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5 shrink-0" />
          <span>5. Catálogo</span>
        </button>

        <button
          onClick={() => setActiveTab("doctores")}
          className={`px-3 py-2 text-xs font-mono tracking-wider uppercase transition flex items-center gap-2 border rounded-xs shrink-0 whitespace-nowrap ${
            activeTab === "doctores"
              ? "bg-[#18181f] text-blue-400 border-blue-500/70 font-bold"
              : "border-transparent text-neutral-400 hover:text-white hover:bg-[#141419]"
          }`}
        >
          <Users className="w-3.5 h-3.5 shrink-0" />
          <span>6. Staff SIS</span>
        </button>

        <button
          onClick={() => setActiveTab("promos")}
          className={`px-3 py-2 text-xs font-mono tracking-wider uppercase transition flex items-center gap-2 border rounded-xs shrink-0 whitespace-nowrap ${
            activeTab === "promos"
              ? "bg-[#18181f] text-pink-400 border-pink-500/70 font-bold"
              : "border-transparent text-neutral-400 hover:text-white hover:bg-[#141419]"
          }`}
        >
          <Percent className="w-3.5 h-3.5 shrink-0" />
          <span>7. Promos</span>
        </button>

        <button
          onClick={() => setActiveTab("contacto")}
          className={`px-3 py-2 text-xs font-mono tracking-wider uppercase transition flex items-center gap-2 border rounded-xs shrink-0 whitespace-nowrap ${
            activeTab === "contacto"
              ? "bg-[#18181f] text-amber-300 border-amber-400/70 font-bold"
              : "border-transparent text-neutral-400 hover:text-white hover:bg-[#141419]"
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5 shrink-0" />
          <span>8. Contacto</span>
        </button>

        <button
          onClick={() => setActiveTab("anuncios")}
          className={`px-3 py-2 text-xs font-mono tracking-wider uppercase transition flex items-center gap-2 border rounded-xs shrink-0 whitespace-nowrap ${
            activeTab === "anuncios"
              ? "bg-[#18181f] text-rose-400 border-rose-500/70 font-bold"
              : "border-transparent text-neutral-400 hover:text-white hover:bg-[#141419]"
          }`}
        >
          <Bell className="w-3.5 h-3.5 shrink-0" />
          <span>9. Marquesina</span>
        </button>

        <button
          onClick={() => setActiveTab("auth")}
          className={`px-3 py-2 text-xs font-mono tracking-wider uppercase transition flex items-center gap-2 border rounded-xs shrink-0 whitespace-nowrap ${
            activeTab === "auth"
              ? "bg-[#18181f] text-emerald-400 border-emerald-500/70 font-bold"
              : "border-transparent text-neutral-400 hover:text-white hover:bg-[#141419]"
          }`}
        >
          <KeyRound className="w-3.5 h-3.5 shrink-0" />
          <span>10. Acceso</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "header" && (
        <HeaderMenuEditor
          headerConfig={cmsData.headerConfig || DEFAULT_HEADER_CONFIG}
          onChange={(updated) => {
            const next = { ...cmsData, headerConfig: updated };
            setCmsData(next);
            saveCMSData(next);
            triggerToast("✓ Estilo de cabecera y navegación actualizado");
          }}
        />
      )}

      {activeTab === "hero" && (
        <HeroEditor
          hero={cmsData.hero || DEFAULT_HERO}
          onUpdateHero={(updated) => {
            const next = { ...cmsData, hero: updated };
            setCmsData(next);
            saveCMSData(next);
          }}
          presetImages={CLINIC_PRESET_IMAGES.hero}
        />
      )}

      {activeTab === "pilares" && (
        <PilaresEditor
          welcomeSection={cmsData.welcomeSection || DEFAULT_WELCOME_SECTION}
          onUpdateWelcomeSection={(updated) => {
            const next = { ...cmsData, welcomeSection: updated };
            setCmsData(next);
            saveCMSData(next);
          }}
          presetImages={CLINIC_PRESET_IMAGES.hero}
        />
      )}

      {activeTab === "prevencion" && (
        <PrevencionEditor
          preventionSection={cmsData.preventionSection || DEFAULT_PREVENTION_SECTION}
          onUpdatePreventionSection={(updated) => {
            const next = { ...cmsData, preventionSection: updated };
            setCmsData(next);
            saveCMSData(next);
          }}
        />
      )}

      {activeTab === "membresias" && (
        <MembershipsFlowEditor
          plans={cmsData.membershipPlans || DEFAULT_MEMBERSHIP_PLANS}
          onUpdatePlans={(updated) => {
            const next = { ...cmsData, membershipPlans: updated };
            setCmsData(next);
            saveCMSData(next);
          }}
        />
      )}

      {activeTab === "tratamientos" && (
        <TreatmentsCatalogEditor
          treatments={cmsData.treatments}
          onUpdateTreatments={(updated) => {
            const next = { ...cmsData, treatments: updated };
            setCmsData(next);
            saveCMSData(next);
            triggerToast("✓ Catálogo de tratamientos actualizado");
          }}
          presetImages={CLINIC_PRESET_IMAGES.treatments}
        />
      )}

      {activeTab === "doctores" && (
        <DoctorsStaffEditor
          doctors={cmsData.doctors}
          onUpdateDoctors={(updated) => {
            const next = { ...cmsData, doctors: updated };
            setCmsData(next);
            saveCMSData(next);
            triggerToast("✓ Staff médico actualizado");
          }}
          presetImages={CLINIC_PRESET_IMAGES.doctors}
        />
      )}

      {activeTab === "promos" && (
        <CampaignsEditor
          promotions={cmsData.promotions}
          onUpdatePromotions={(updated) => {
            const next = { ...cmsData, promotions: updated };
            setCmsData(next);
            saveCMSData(next);
            triggerToast("✓ Campañas actualizadas");
          }}
        />
      )}

      {activeTab === "contacto" && (
        <ContactLocationEditor
          clinicInfo={cmsData.clinicInfo}
          onUpdateClinicInfo={(updated) => {
            const next = { ...cmsData, clinicInfo: updated };
            setCmsData(next);
          }}
          onSave={() => {
            saveCMSData(cmsData);
            triggerToast("✓ Canales oficiales y horarios guardados");
          }}
        />
      )}

      {activeTab === "anuncios" && (
        <AnnouncementsTickerEditor
          announcements={cmsData.announcements}
          onUpdateAnnouncements={(updated) => {
            const next = { ...cmsData, announcements: updated };
            setCmsData(next);
            saveCMSData(next);
            triggerToast("✓ Anuncios marquesina actualizados");
          }}
        />
      )}

      {activeTab === "auth" && (
        <AuthPortalEditor
          authPortal={cmsData.authPortal || DEFAULT_AUTH_PORTAL}
          onUpdateAuthPortal={(updated) => {
            const next = { ...cmsData, authPortal: updated };
            setCmsData(next);
            saveCMSData(next);
            triggerToast("✓ Portal de Acceso actualizado");
          }}
          triggerToast={triggerToast}
        />
      )}

      {/* Modal de Historial y Rollback */}
      <VersionHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onRestoreSuccess={handleRestoreFromHistory}
      />
    </div>
  );
}
