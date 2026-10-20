"use client";

import React from "react";
import Image from "next/image";
import { UserRole, UserProfile } from "@/types/auth";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import {
  LayoutDashboard,
  Activity,
  ShieldCheck,
  Clock,
  CreditCard,
  Globe,
  Users,
  Calendar,
  FileText,
  Stethoscope,
  Layers,
  Sparkles,
  ExternalLink,
  MessageCircle,
  LogOut,
  X,
  Plus,
} from "lucide-react";

export interface PortalSidebarProps {
  currentUser: UserProfile;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  // Sub-tabs
  adminTab: "dashboard" | "dentalink" | "citas" | "pagos_club" | "cms" | "usuarios" | "consentimientos";
  setAdminTab: (tab: "dashboard" | "dentalink" | "citas" | "pagos_club" | "cms" | "usuarios" | "consentimientos") => void;
  doctorTab: "agenda" | "soap" | "odontograma" | "presupuesto" | "consentimientos" | "todo";
  setDoctorTab: (tab: "agenda" | "soap" | "odontograma" | "presupuesto" | "consentimientos" | "todo") => void;
  recepcionTab: "sala" | "citas" | "cobros" | "todo";
  setRecepcionTab: (tab: "sala" | "citas" | "cobros" | "todo") => void;
  patientTab: "citas" | "ficha" | "odontograma" | "presupuesto" | "consentimientos" | "convenio";
  setPatientTab: (tab: "citas" | "ficha" | "odontograma" | "presupuesto" | "consentimientos" | "convenio") => void;
  // Dynamic counts
  counts: {
    appointments: number;
    patientAppointments: number;
    consents: number;
    patientConsents: number;
    records: number;
    patientRecords: number;
    users: number;
    clubUsers: number;
    budgets: number;
  };
  // Mobile drawer state
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  // Actions
  onLogout: () => void;
  onOpenWalkin?: () => void;
}

const roleMeta: Record<UserRole, { badge: string; subtitle: string; color: string; pillColor: string }> = {
  admin: {
    badge: "DIRECCIÓN MÉDICA",
    subtitle: "Administración Central & CMS",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    pillColor: "bg-purple-600 text-white",
  },
  doctor: {
    badge: "CUERPO MÉDICO",
    subtitle: "Box Clínico · Sillón Dental",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    pillColor: "bg-blue-600 text-white",
  },
  recepcion: {
    badge: "RECEPCIÓN & SALA",
    subtitle: "Admisión & Gestión de Pacientes",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    pillColor: "bg-amber-600 text-white",
  },
  paciente: {
    badge: "EXPEDIENTE PACIENTE",
    subtitle: "Portal de Salud Dental",
    color: "bg-teal-50 text-teal-700 border-teal-200",
    pillColor: "bg-teal-600 text-white",
  },
};

export function PortalSidebar({
  currentUser,
  activeRole,
  setActiveRole,
  adminTab,
  setAdminTab,
  doctorTab,
  setDoctorTab,
  recepcionTab,
  setRecepcionTab,
  patientTab,
  setPatientTab,
  counts,
  mobileOpen,
  setMobileOpen,
  onLogout,
  onOpenWalkin,
}: PortalSidebarProps) {
  const currentMeta = roleMeta[activeRole] || roleMeta.paciente;

  const handleNavClick = (callback: () => void) => {
    callback();
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main Docked Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 xl:w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0 select-none shadow-xl lg:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* TOP BRAND HEADER */}
        <div>
          <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3">
            <a href="/" className="flex items-center gap-2.5 min-w-0 group">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white p-0.5 border border-slate-300 shadow-2xs shrink-0">
                <Image
                  src="/images/brand/logo.png"
                  alt="Centro Dental BeHappy"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-sm tracking-tight text-slate-900 block leading-tight truncate">
                  Centro Dental BeHappy
                </span>
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block truncate">
                  Suecia 3580 · Ñuñoa
                </span>
              </div>
            </a>

            {/* Close button for mobile */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ACTIVE ROLE BADGE & ROLE SWITCHER (For Admin / Testing) */}
          <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200/80">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Rol Activo
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border ${currentMeta.color}`}
              >
                {currentMeta.badge}
              </span>
            </div>

            {/* Quick Role Switcher for Admin user */}
            {currentUser?.role === "admin" && (
              <div className="mt-2.5 pt-2 border-t border-slate-200/60">
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mb-1.5">
                  <span className="uppercase tracking-wider font-semibold">Cambiar vista de rol:</span>
                </div>
                <div className="grid grid-cols-4 gap-1 bg-white p-1 rounded border border-slate-200 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => handleNavClick(() => setActiveRole("admin"))}
                    className={`py-1 rounded text-center font-bold transition cursor-pointer ${
                      activeRole === "admin"
                        ? "bg-purple-600 text-white shadow-2xs"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                    title="Administración Central & CMS"
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavClick(() => setActiveRole("doctor"))}
                    className={`py-1 rounded text-center font-bold transition cursor-pointer ${
                      activeRole === "doctor"
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                    title="Cuerpo Médico en Box"
                  >
                    Doctor
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavClick(() => setActiveRole("recepcion"))}
                    className={`py-1 rounded text-center font-bold transition cursor-pointer ${
                      activeRole === "recepcion"
                        ? "bg-amber-600 text-white shadow-2xs"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                    title="Recepción & Admisión"
                  >
                    Recep
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavClick(() => setActiveRole("paciente"))}
                    className={`py-1 rounded text-center font-bold transition cursor-pointer ${
                      activeRole === "paciente"
                        ? "bg-teal-600 text-white shadow-2xs"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                    title="Portal de Salud Paciente"
                  >
                    Pac
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE SCROLLABLE NAVIGATION ITEMS */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 font-mono text-xs">
          
          {/* ========================================================================= */}
          {/* 1. ADMIN NAVIGATION */}
          {/* ========================================================================= */}
          {activeRole === "admin" && (
            <>
              {/* Category: Dirección & Enlace */}
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block px-2 mb-1">
                  Dirección & Enlace
                </span>
                <button
                  type="button"
                  onClick={() => handleNavClick(() => setAdminTab("dashboard"))}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition text-left cursor-pointer ${
                    adminTab === "dashboard"
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span className="truncate">Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick(() => setAdminTab("dentalink"))}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition text-left cursor-pointer ${
                    adminTab === "dentalink"
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Activity className="w-4 h-4 shrink-0 text-blue-600" />
                    <span className="truncate">Enlace Dentalink</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold uppercase shrink-0">
                    API
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick(() => setAdminTab("consentimientos"))}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition text-left cursor-pointer ${
                    adminTab === "consentimientos"
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span className="truncate">Auditoría Ley 20.584</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold shrink-0">
                    {counts.consents}
                  </span>
                </button>
              </div>

              {/* Category: Operación & Web */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block px-2 mb-1">
                  Operación & Web
                </span>
                <button
                  type="button"
                  onClick={() => handleNavClick(() => setAdminTab("citas"))}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition text-left cursor-pointer ${
                    adminTab === "citas"
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span className="truncate">Citas Web & Triaje</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold shrink-0">
                    {counts.appointments}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick(() => setAdminTab("pagos_club"))}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition text-left cursor-pointer ${
                    adminTab === "pagos_club"
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CreditCard className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span className="truncate">Pagos Flow & Club</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold shrink-0">
                    {counts.clubUsers}
                  </span>
                </button>
              </div>

              {/* Category: Contenido & Sistema */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block px-2 mb-1">
                  Contenido & Sistema
                </span>
                <button
                  type="button"
                  onClick={() => handleNavClick(() => setAdminTab("cms"))}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition text-left cursor-pointer ${
                    adminTab === "cms"
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Globe className="w-4 h-4 shrink-0 text-teal-600" />
                    <span className="truncate">Editor CMS Web</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase shrink-0">
                    VIVO
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick(() => setAdminTab("usuarios"))}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition text-left cursor-pointer ${
                    adminTab === "usuarios"
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Users className="w-4 h-4 shrink-0" />
                    <span className="truncate">Usuarios & Roles</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold shrink-0">
                    {counts.users}
                  </span>
                </button>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* 2. DOCTOR NAVIGATION */}
          {/* ========================================================================= */}
          {activeRole === "doctor" && (
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block px-2 mb-1">
                Atención Médica en Box
              </span>
              <button
                type="button"
                onClick={() => handleNavClick(() => setDoctorTab("agenda"))}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition text-left cursor-pointer ${
                  doctorTab === "agenda"
                    ? "bg-slate-900 text-white font-bold shadow-xs"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Calendar className="w-4 h-4 shrink-0 text-blue-600" />
                  <span className="truncate">Agenda del Día</span>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold shrink-0">
                  {counts.appointments}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick(() => setDoctorTab("soap"))}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition text-left cursor-pointer ${
                  doctorTab === "soap"
                    ? "bg-slate-900 text-white font-bold shadow-xs"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <FileText className="w-4 h-4 shrink-0 text-emerald-600" />
                <span className="truncate">Evolución SOAP</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick(() => setDoctorTab("odontograma"))}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition text-left cursor-pointer ${
                  doctorTab === "odontograma"
                    ? "bg-slate-900 text-white font-bold shadow-xs"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Stethoscope className="w-4 h-4 shrink-0 text-teal-600" />
                  <span className="truncate">Odontograma FDI</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-bold shrink-0">
                  32 Pzs
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick(() => setDoctorTab("presupuesto"))}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition text-left cursor-pointer ${
                  doctorTab === "presupuesto"
                    ? "bg-slate-900 text-white font-bold shadow-xs"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Layers className="w-4 h-4 shrink-0 text-amber-600" />
                  <span className="truncate">Presupuestos</span>
                </div>
                {counts.budgets > 0 && (
                  <span className="text-[10px] text-slate-500 font-semibold shrink-0">
                    {counts.budgets}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleNavClick(() => setDoctorTab("consentimientos"))}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition text-left cursor-pointer ${
                  doctorTab === "consentimientos"
                    ? "bg-slate-900 text-white font-bold shadow-xs"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-purple-600" />
                  <span className="truncate">Consentimientos Ley</span>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold shrink-0">
                  {counts.consents}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick(() => setDoctorTab("todo"))}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition text-left cursor-pointer ${
                  doctorTab === "todo"
                    ? "bg-slate-900 text-white font-bold shadow-xs"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0 text-slate-500" />
                <span className="truncate">Box Completo</span>
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. RECEPCIÓN NAVIGATION */}
          {/* ========================================================================= */}
          {activeRole === "recepcion" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block px-2 mb-1">
                  Admisión & Sala de Espera
                </span>
                <button
                  type="button"
                  onClick={() => handleNavClick(() => setRecepcionTab("sala"))}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition text-left cursor-pointer ${
                    recepcionTab === "sala"
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Users className="w-4 h-4 shrink-0 text-amber-600" />
                    <span className="truncate">Flujo en Sala</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold shrink-0">
                    {counts.appointments}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick(() => setRecepcionTab("citas"))}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition text-left cursor-pointer ${
                    recepcionTab === "citas"
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Calendar className="w-4 h-4 shrink-0 text-blue-600" />
                  <span className="truncate">Agenda del Día</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick(() => setRecepcionTab("cobros"))}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition text-left cursor-pointer ${
                    recepcionTab === "cobros"
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <CreditCard className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="truncate">Caja & Cobros Flow</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick(() => setRecepcionTab("todo"))}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition text-left cursor-pointer ${
                    recepcionTab === "todo"
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0 text-slate-500" />
                  <span className="truncate">Admisión Completa</span>
                </button>
              </div>

              {/* Quick Action Button for Reception: Walk-In */}
              {onOpenWalkin && (
                <div className="pt-2 border-t border-slate-100 px-1">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenWalkin();
                      setMobileOpen(false);
                    }}
                    className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 rounded-md font-bold transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer text-xs uppercase tracking-wider"
                  >
                    <Plus className="w-4 h-4 text-amber-700" />
                    <span>Paciente Walk-In</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. PACIENTE NAVIGATION */}
          {/* ========================================================================= */}
          {activeRole === "paciente" && (
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block px-2 mb-1">
                Mi Expediente de Salud
              </span>
              <button
                type="button"
                onClick={() => handleNavClick(() => setPatientTab("citas"))}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition text-left cursor-pointer ${
                  patientTab === "citas"
                    ? "bg-slate-900 text-white font-bold shadow-xs"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Calendar className="w-4 h-4 shrink-0 text-teal-600" />
                  <span className="truncate">Mis Citas</span>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold shrink-0">
                  {counts.patientAppointments}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick(() => setPatientTab("ficha"))}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition text-left cursor-pointer ${
                  patientTab === "ficha"
                    ? "bg-slate-900 text-white font-bold shadow-xs"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 shrink-0 text-blue-600" />
                  <span className="truncate">Ficha Clínica</span>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold shrink-0">
                  {counts.patientRecords}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick(() => setPatientTab("odontograma"))}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition text-left cursor-pointer ${
                  patientTab === "odontograma"
                    ? "bg-slate-900 text-white font-bold shadow-xs"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Stethoscope className="w-4 h-4 shrink-0 text-indigo-600" />
                <span className="truncate">Mi Odontograma</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick(() => setPatientTab("presupuesto"))}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition text-left cursor-pointer ${
                  patientTab === "presupuesto"
                    ? "bg-slate-900 text-white font-bold shadow-xs"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Layers className="w-4 h-4 shrink-0 text-emerald-600" />
                <span className="truncate">Mi Presupuesto</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick(() => setPatientTab("consentimientos"))}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition text-left cursor-pointer ${
                  patientTab === "consentimientos"
                    ? "bg-slate-900 text-white font-bold shadow-xs"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-purple-600" />
                  <span className="truncate">Consentimientos</span>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold shrink-0">
                  {counts.patientConsents}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick(() => setPatientTab("convenio"))}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition text-left cursor-pointer ${
                  patientTab === "convenio"
                    ? "bg-slate-900 text-white font-bold shadow-xs"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
                  <span className="truncate">Club BeHappy</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-bold shrink-0">
                  {currentUser?.convenioLevel || "Convenio"}
                </span>
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* EXTERNAL INTEGRATIONS & CLINIC SHORTCUTS */}
          {/* ========================================================================= */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            {/* Direct Dentalink Agenda Cloud access for staff */}
            {activeRole !== "paciente" && (
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block px-2">
                  Dentalink Softwaredentalink
                </span>
                <a
                  href={CLINIC_INFO.dentalink?.agendaUrl || "https://00b229f2077285343f1ffac76fd853c23816acec.agenda.softwaredentalink.com/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-blue-700 hover:text-blue-900 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/80 transition text-xs font-mono"
                  title="Abrir la agenda oficial en Softwaredentalink"
                >
                  <span className="font-semibold truncate">Agenda Dentalink Cloud</span>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1.5" />
                </a>
              </div>
            )}

            {/* Public Web Links */}
            <div className="space-y-1 pt-1">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block px-2">
                Accesos Directos
              </span>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-3 py-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition text-xs"
              >
                <span className="truncate">Sitio Web Público</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
              </a>
              <a
                href="/tratamientos"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-3 py-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition text-xs"
              >
                <span className="truncate">Catálogo de Aranceles</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
              </a>
              <a
                href={buildWhatsAppUrl("Hola Centro Dental BeHappy, me comunico desde el Portal Clínico.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-3 py-1.5 rounded text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60 transition text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">WhatsApp Clínico</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM USER PROFILE & LOGOUT FOOTER */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/60 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold text-xs font-mono uppercase shadow-2xs">
              {currentUser.fullName ? currentUser.fullName.charAt(0) : "U"}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-slate-900 block truncate leading-tight">
                {currentUser.fullName}
              </span>
              <span className="text-[10px] font-mono text-slate-500 block truncate">
                {currentUser.email}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            title="Cerrar sesión de forma segura"
            className="p-1.5 rounded border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition shrink-0 cursor-pointer shadow-2xs"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
}
