"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  UserRole,
  UserProfile,
  PatientAppointment,
  ClinicalRecord,
  OdontogramTooth,
  InformedConsent,
  DentalBudget
} from "@/types/auth";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import {
  getCurrentSession,
  setCurrentSession,
  clearCurrentSession,
  getRegisteredUsers,
  updateUserRole,
  registerNewUser
} from "@/lib/authService";
import {
  getStoredAppointments,
  addStoredAppointment,
  syncAppointmentToCloud,
  updateStoredAppointmentStatus,
  getStoredClinicalRecords,
  addStoredClinicalRecord,
  getStoredOdontogram,
  updateStoredToothStatus,
  getStoredConsents,
  addStoredConsent,
  getStoredBudgets,
  addStoredBudget,
  syncClinicalFromServer,
  clearClinicalLocalData,
  CLINICAL_CHANGE_EVENT
} from "@/lib/clinicalStore";
import { SiteCmsEditor } from "@/components/portal/SiteCmsEditor";
import { getCMSData, CMSData, DEFAULT_CMS_DATA } from "@/lib/cmsStore";
import { DOCTORS } from "@/data/doctors";
import { TREATMENTS } from "@/data/treatments";
import { toast } from "sonner";
import {
  Calendar,
  CheckCircle2,
  Plus,
  MessageCircle,
  LogOut,
  ArrowRight,
  ArrowLeft,
  LayoutDashboard,
  Globe,
  Users as UsersIcon,
  ExternalLink,
  Search,
  UserPlus,
  X,
  Clock,
  Sparkles,
  ShieldCheck,
  FileText,
  Stethoscope,
  Activity,
  Layers,
  ChevronRight,
  UserCheck,
  CreditCard,
  Printer
} from "lucide-react";
import { AnatomicalOdontogram } from "@/components/portal/AnatomicalOdontogram";
import { ClinicalDocumentModal } from "@/components/portal/ClinicalDocumentModal";
import { ClinicalBudgetPlan } from "@/components/portal/ClinicalBudgetPlan";
import { InformedConsentModal } from "@/components/portal/InformedConsentModal";
import { AdminUserManagement } from "@/components/portal/AdminUserManagement";
import { DentalinkIntegrationPanel } from "@/components/portal/DentalinkIntegrationPanel";
import { FlowClubManagementPanel } from "@/components/portal/FlowClubManagementPanel";
import { CLINIC_INFO } from "@/data/clinicInfo";

function normalizeIdentity(value?: string | null): string {
  return (value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function matchesPatient(
  identity: { name?: string | null; rut?: string | null; email?: string | null; phone?: string | null },
  user: UserProfile
): boolean {
  const targets = [user.fullName, user.rut, user.email, user.phone]
    .map(normalizeIdentity)
    .filter(Boolean);
  if (targets.length === 0) return false;
  return [identity.name, identity.rut, identity.email, identity.phone]
    .map(normalizeIdentity)
    .some((candidate) => candidate.length > 0 && targets.includes(candidate));
}

function PortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active session gate
  const [sessionLoading, setSessionLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Active role state
  const [activeRole, setActiveRole] = useState<UserRole>("paciente");

  // Admin Navigation Sub-tab
  const initialTabParam = searchParams.get("tab") as "dashboard" | "dentalink" | "citas" | "pagos_club" | "cms" | "usuarios" | "consentimientos" | null;
  const [adminTab, setAdminTab] = useState<"dashboard" | "dentalink" | "citas" | "pagos_club" | "cms" | "usuarios" | "consentimientos">(initialTabParam || "dashboard");

  // Patient Sub-tabs
  const [patientTab, setPatientTab] = useState<"citas" | "ficha" | "odontograma" | "presupuesto" | "consentimientos" | "convenio">("citas");

  // Clinical data store state
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [clinicalRecords, setClinicalRecords] = useState<ClinicalRecord[]>([]);
  const [odontogram, setOdontogram] = useState<OdontogramTooth[]>([]);
  const [consents, setConsents] = useState<InformedConsent[]>([]);
  const [budgets, setBudgets] = useState<DentalBudget[]>([]);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  // Legal Document & Flow Payment states
  const [selectedRecordForDocument, setSelectedRecordForDocument] = useState<ClinicalRecord | null>(null);
  const [showFlowPaymentModal, setShowFlowPaymentModal] = useState(false);
  const [flowPaymentData, setFlowPaymentData] = useState<{
    appointmentId?: string;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    amount: number;
    subject: string;
  } | null>(null);
  const [flowPaymentLoading, setFlowPaymentLoading] = useState(false);

  // Doctor SOAP note form
  const [soapPatient, setSoapPatient] = useState("");
  const [soapDiagnosis, setSoapDiagnosis] = useState("");
  const [soapTreatment, setSoapTreatment] = useState("");
  const [soapPrescription, setSoapPrescription] = useState("");
  const [soapSavedToast, setSoapSavedToast] = useState(false);
  const [doctorAgendaFilter, setDoctorAgendaFilter] = useState<"mis_citas" | "todas">("mis_citas");

  // CMS dynamic reactive data
  const [cmsData, setCmsData] = useState<CMSData>(DEFAULT_CMS_DATA);
  useEffect(() => {
    setCmsData(getCMSData());
    const handleCmsUpdate = (e: any) => {
      if (e.detail) setCmsData(e.detail);
      else setCmsData(getCMSData());
    };
    window.addEventListener("behappy_cms_updated", handleCmsUpdate);
    return () => window.removeEventListener("behappy_cms_updated", handleCmsUpdate);
  }, []);

  const availableDoctors = (cmsData?.doctors && cmsData.doctors.length > 0) ? cmsData.doctors : DOCTORS;

  const patientAppointments = useMemo(
    () =>
      currentUser
        ? appointments.filter((item) =>
            matchesPatient(
              { name: item.patientName, rut: item.patientRut, email: item.patientEmail, phone: item.patientPhone },
              currentUser
            )
          )
        : [],
    [appointments, currentUser]
  );

  const patientClinicalRecords = useMemo(
    () =>
      currentUser
        ? clinicalRecords.filter((record) => matchesPatient({ name: record.patientId }, currentUser))
        : [],
    [clinicalRecords, currentUser]
  );

  const patientConsents = useMemo(
    () =>
      currentUser
        ? consents.filter((consent) => matchesPatient({ name: consent.patientName, rut: consent.patientRut }, currentUser))
        : [],
    [consents, currentUser]
  );

  // Reception walk-in & search state
  const [showWalkinModal, setShowWalkinModal] = useState(false);
  const [walkinName, setWalkinName] = useState("");
  const [walkinPhone, setWalkinPhone] = useState("");
  const [walkinBox, setWalkinBox] = useState("Box 1");
  const [walkinDoctor, setWalkinDoctor] = useState(DOCTORS[0]?.name || "Doctor Tratante");
  const [walkinTreatment, setWalkinTreatment] = useState("Consulta de Urgencia Dental");
  const [receptionSearch, setReceptionSearch] = useState("");

  // Admin user list
  const [userList, setUserList] = useState<UserProfile[]>([]);

  useEffect(() => {
    const handleUsersUpdate = (e: any) => {
      if (e.detail) setUserList(e.detail);
      else setUserList(getRegisteredUsers());
    };
    window.addEventListener("behappy_users_updated", handleUsersUpdate);
    return () => window.removeEventListener("behappy_users_updated", handleUsersUpdate);
  }, []);

  // 1. Session verification & authentication gate
  useEffect(() => {
    const session = getCurrentSession();
    if (!session) {
      router.replace("/login");
      return;
    }

    setCurrentUser(session);
    setActiveRole(session.role);
    setUserList(getRegisteredUsers());
    setSessionLoading(false);
  }, [router]);

  // 2. Synchronize clinical store in real-time
  useEffect(() => {
    const syncClinical = () => {
      setAppointments(getStoredAppointments());
      setClinicalRecords(getStoredClinicalRecords());
      setOdontogram(getStoredOdontogram());
      setConsents(getStoredConsents());
      setBudgets(getStoredBudgets());
    };
    syncClinical();
    window.addEventListener(CLINICAL_CHANGE_EVENT, syncClinical);

    // Staff sessions pull real cloud data (citas + fichas) periodically
    const session = getCurrentSession();
    let interval: ReturnType<typeof setInterval> | undefined;
    if (session && session.role !== "paciente") {
      void syncClinicalFromServer();
      interval = setInterval(() => {
        void syncClinicalFromServer();
      }, 45000);
    }

    return () => {
      window.removeEventListener(CLINICAL_CHANGE_EVENT, syncClinical);
      if (interval) clearInterval(interval);
    };
  }, []);

  // Logout handler
  const handleLogout = () => {
    clearClinicalLocalData();
    clearCurrentSession();
    router.replace("/login");
  };

  // SOAP Save
  const handleSaveSoap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!soapDiagnosis || !soapTreatment || !currentUser) return;

    addStoredClinicalRecord({
      patientId: soapPatient || "Paciente en Consulta",
      doctorName: currentUser.fullName,
      date: new Date().toISOString().split("T")[0],
      diagnosis: soapDiagnosis,
      treatmentPerformed: soapTreatment,
      prescription: soapPrescription,
      nextStep: "Control en 15 días"
    });

    setSoapDiagnosis("");
    setSoapTreatment("");
    setSoapPrescription("");
    setSoapPatient("");
    setSoapSavedToast(true);
    toast.success("Evolución clínica guardada en la ficha del paciente");
    setTimeout(() => setSoapSavedToast(false), 3000);
  };

  // Walk-in Submit
  const handleWalkinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName) return;

    const appointment = addStoredAppointment({
      date: "Hoy",
      time: "Ahora (Walk-in)",
      doctorName: walkinDoctor,
      treatmentName: walkinTreatment,
      status: "en_espera",
      box: walkinBox || "Box 1",
      price: 35000,
      convenioDiscount: 0,
      patientName: walkinName,
      patientPhone: walkinPhone || "Sin teléfono"
    });

    syncAppointmentToCloud(appointment);

    setShowWalkinModal(false);
    toast.success(`Paciente ${walkinName} ingresado a sala de espera`);
    setWalkinName("");
    setWalkinPhone("");
  };

  // Change Appointment Status
  const handleStatusChange = (id: string, newStatus: PatientAppointment["status"]) => {
    updateStoredAppointmentStatus(id, newStatus);
    const statusText: Record<PatientAppointment["status"], string> = {
      pendiente: "Pendiente",
      confirmada: "Confirmada",
      en_espera: "En Sala de Espera",
      en_box: "En Box Clínico",
      completada: "Atención Finalizada",
      cancelada: "Cancelada"
    };
    toast.success(`Estado actualizado: ${statusText[newStatus] || newStatus}`);
  };

  // Interactive Odontogram Tooth Click
  const handleToothClick = (tooth: OdontogramTooth) => {
    const statuses: OdontogramTooth["status"][] = ["sano", "caries", "obturado", "corona", "implante", "extraccion_indicada"];
    const currentIdx = statuses.indexOf(tooth.status);
    const nextStatus = statuses[(currentIdx + 1) % statuses.length];
    updateStoredToothStatus(tooth.toothNumber, nextStatus);
  };

  // Loading Screen (Prevents any unauthorized visual leak)
  if (sessionLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#0f172a] border-t-transparent rounded-full animate-spin" />
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono tracking-[0.24em] text-slate-500 uppercase block">
            CENTRO DENTAL BEHAPPY · PLATAFORMA CLÍNICA
          </span>
          <p className="text-xs text-slate-700 font-medium">Verificando credenciales de acceso seguro...</p>
        </div>
      </div>
    );
  }

  // Label configuration by role
  const roleLabels: Record<UserRole, { badge: string; subtitle: string; color: string }> = {
    paciente: {
      badge: "PACIENTE ACTIVO",
      subtitle: "Portal de Salud Dental & Ficha Personal",
      color: "bg-teal-50 text-teal-700 border-teal-200"
    },
    doctor: {
      badge: "CUERPO MÉDICO",
      subtitle: "Box Clínico · Evolución & Agenda del Día",
      color: "bg-blue-50 text-blue-700 border-blue-200"
    },
    recepcion: {
      badge: "RECEPCIÓN & ADMISIÓN",
      subtitle: "Gestión de Sala de Espera · Sede Suecia 3580",
      color: "bg-amber-50 text-amber-700 border-amber-200"
    },
    admin: {
      badge: "DIRECCIÓN MÉDICA",
      subtitle: "Administración Central, CMS & Control Total",
      color: "bg-purple-50 text-purple-700 border-purple-200"
    }
  };

  const currentRoleMeta = roleLabels[activeRole] || roleLabels.paciente;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col antialiased">
      
      {/* ========================================================================= */}
      {/* DEDICATED MEDICAL APPLICATION TOPBAR (No marketing header clashing) */}
      {/* ========================================================================= */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Brand & Clinic Context */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white p-0.5 border border-slate-300 shadow-sm">
                <Image
                  src="/images/brand/logo.png"
                  alt="Centro Dental BeHappy"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <span className="font-semibold text-sm tracking-tight text-slate-900 block leading-tight">
                  Centro Dental BeHappy
                </span>
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block">
                  {currentRoleMeta.subtitle}
                </span>
              </div>
            </a>

            <span className={`hidden sm:inline-flex px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border ${currentRoleMeta.color}`}>
              {currentRoleMeta.badge}
            </span>
          </div>

          {/* Right Action Block: Authenticated User & Actions */}
          <div className="flex items-center gap-3">
            
            {/* Authenticated User Identity */}
            <div className="text-right flex flex-col justify-center">
              <span className="text-xs font-semibold text-slate-900 block leading-tight">
                {currentUser.fullName}
              </span>
              <span className="text-[10px] font-mono text-slate-500 block">
                {currentUser.email}
              </span>
            </div>

            {/* Link back to public web */}
            <a
              href="/"
              className="px-2.5 py-1.5 rounded border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition text-xs font-mono flex items-center gap-1 shadow-2xs shrink-0"
              title="Volver al sitio web principal"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Web</span>
            </a>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition text-xs font-mono flex items-center gap-1.5 shadow-2xs shrink-0"
              title="Cerrar sesión de forma segura"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CLINICAL CONTENT AREA */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full min-w-0 max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* ========================================================================= */}
        {/* 1. ROLE: PACIENTE (Personal Health Ledger) */}
        {/* ========================================================================= */}
        {activeRole === "paciente" && (
          <div className="space-y-6">
            
            {/* Patient Header Welcome Card */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono tracking-[0.2em] text-teal-700 uppercase font-bold block">
                  EXPEDIENTE CLÍNICO DIGITAL · {currentUser.convenioLevel || "CONVENIO BEHAPPY ACTIVO"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                  {currentUser.fullName}
                </h2>
                <p className="text-xs font-mono text-slate-500">
                  {currentUser.rut ? `RUT: ${currentUser.rut} · ` : ""}Previsión: {currentUser.prevision || "Particular / Fonasa / Isapre"} · Sede: Suecia 3580, OF. 304, Ñuñoa
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <a
                  href="/#agendar"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-mono tracking-wider uppercase font-bold rounded transition flex items-center gap-2 shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Agendar Nueva Hora
                </a>

                <a
                  href={buildWhatsAppUrl(`Hola Centro Dental BeHappy, soy ${currentUser.fullName} y tengo una consulta sobre mi tratamiento.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 border border-slate-300 hover:border-slate-800 bg-white text-slate-800 text-xs font-mono tracking-wider uppercase rounded transition flex items-center gap-1.5 shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  WhatsApp Dental
                </a>
              </div>
            </div>

            {/* Quick KPI Ledger */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-1 shadow-2xs">
                <span className="text-[10px] font-mono tracking-widest text-slate-500 block uppercase">Próxima Cita</span>
                <span className="text-base font-semibold text-slate-900 block truncate">
                  {patientAppointments.length > 0 ? `${patientAppointments[0].date} ${patientAppointments[0].time}` : "Sin citas agendadas"}
                </span>
                <span className="text-[11px] font-mono text-slate-500 block truncate">
                  {patientAppointments.length > 0 ? `${patientAppointments[0].doctorName}` : "Disponible para agendar"}
                </span>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-1 shadow-2xs">
                <span className="text-[10px] font-mono tracking-widest text-slate-500 block uppercase">Ahorro Convenio</span>
                <span className="text-base font-semibold text-emerald-600 block">
                  {(() => {
                    const totalSavings = patientAppointments.reduce((acc, a) => acc + (a.convenioDiscount || 0), 0);
                    return totalSavings > 0 ? `$${totalSavings.toLocaleString("es-CL")} CLP` : "$0 CLP";
                  })()}
                </span>
                <span className="text-[11px] font-mono text-slate-500 block">Bonificación directa aplicada</span>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-1 shadow-2xs">
                <span className="text-[10px] font-mono tracking-widest text-slate-500 block uppercase">Tratamiento Activo</span>
                <span className="text-base font-semibold text-slate-900 block truncate">
                  {patientAppointments.length > 0 ? patientAppointments[0].treatmentName : (patientClinicalRecords.length > 0 ? patientClinicalRecords[0].treatmentPerformed : "Sin tratamiento activo")}
                </span>
                <span className="text-[11px] font-mono text-slate-500 block">
                  {patientAppointments.length > 0 ? "En curso clínico" : "Consulta preventiva"}
                </span>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-1 shadow-2xs">
                <span className="text-[10px] font-mono tracking-widest text-slate-500 block uppercase">Estado Bucal</span>
                <span className="text-base font-semibold text-slate-900 block">
                  {patientClinicalRecords.length > 0 ? "Ficha al día" : "Ingreso Inicial"}
                </span>
                <span className="text-[11px] font-mono text-slate-500 block">
                  {patientClinicalRecords.length > 0 ? "Control registrado" : "Pendiente de diagnóstico"}
                </span>
              </div>
            </div>

            {/* Sub-Tabs Navigation */}
            <div className="border-b border-slate-200 flex gap-6 text-xs font-mono tracking-wider uppercase overflow-x-auto scrollbar-none">
              <button
                onClick={() => setPatientTab("citas")}
                className={`pb-3 transition shrink-0 ${
                  patientTab === "citas"
                    ? "text-slate-900 border-b-2 border-slate-900 font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                1. Mis Citas ({patientAppointments.length})
              </button>

              <button
                onClick={() => setPatientTab("ficha")}
                className={`pb-3 transition shrink-0 ${
                  patientTab === "ficha"
                    ? "text-slate-900 border-b-2 border-slate-900 font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                2. Ficha Clínica ({patientClinicalRecords.length})
              </button>

              <button
                onClick={() => setPatientTab("odontograma")}
                className={`pb-3 transition shrink-0 ${
                  patientTab === "odontograma"
                    ? "text-slate-900 border-b-2 border-slate-900 font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                3. Mi Odontograma (32 piezas)
              </button>

              <button
                onClick={() => setPatientTab("presupuesto")}
                className={`pb-3 transition shrink-0 ${
                  patientTab === "presupuesto"
                    ? "text-slate-900 border-b-2 border-slate-900 font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                4. Mi Presupuesto Dental
              </button>

              <button
                onClick={() => setPatientTab("consentimientos")}
                className={`pb-3 transition shrink-0 ${
                  patientTab === "consentimientos"
                    ? "text-slate-900 border-b-2 border-slate-900 font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                5. Consentimientos ({patientConsents.length})
              </button>

              <button
                onClick={() => setPatientTab("convenio")}
                className={`pb-3 transition shrink-0 ${
                  patientTab === "convenio"
                    ? "text-slate-900 border-b-2 border-slate-900 font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                6. Convenio & Beneficios
              </button>
            </div>

            {/* Sub-Tab 1: Mis Citas */}
            {patientTab === "citas" && (
              <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100 shadow-2xs overflow-hidden">
                {patientAppointments.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
                    <h3 className="text-sm font-semibold text-slate-900">No tienes citas agendadas</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Puedes agendar tu hora de evaluación con nuestros especialistas mediante el agendador web o vía WhatsApp oficial.
                    </p>
                    <div className="pt-2">
                      <a
                        href="/#agendar"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-mono font-bold text-xs uppercase tracking-wider rounded transition"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Agendar Cita Ahora
                      </a>
                    </div>
                  </div>
                ) : (
                  patientAppointments.map((item) => (
                    <div key={item.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-sm">{item.treatmentName}</span>
                          <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-100 text-[10px] font-mono uppercase text-slate-700">
                            {item.status.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-light">
                          Especialista: <strong className="text-slate-900 font-medium">{item.doctorName}</strong> · Box: {item.box || "Box 1"}
                        </p>
                        <p className="text-xs font-mono text-slate-500">
                          {item.date} a las {item.time} hrs · Suecia 3580, Ñuñoa
                        </p>
                      </div>

                      <div className="text-right flex items-center sm:flex-col gap-2 shrink-0">
                        <div>
                          <span className="text-sm font-mono font-bold text-slate-900 block">
                            ${((item.price ?? 35000) - (item.convenioDiscount ?? 0)).toLocaleString("es-CL")} CLP
                          </span>
                          {item.convenioDiscount ? (
                            <span className="text-[10px] font-mono text-slate-400 block line-through">
                              Arancel base: ${item.price?.toLocaleString("es-CL")}
                            </span>
                          ) : null}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const amountToPay = (item.price ?? 35000) - (item.convenioDiscount ?? 0);
                              setFlowPaymentData({
                                appointmentId: item.id,
                                patientName: currentUser.fullName,
                                patientEmail: currentUser.email,
                                patientPhone: currentUser.phone || "",
                                amount: amountToPay,
                                subject: `Copago Cita · ${item.treatmentName}`,
                              });
                              setShowFlowPaymentModal(true);
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-mono uppercase tracking-wider font-semibold transition flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Pagar Online Flow</span>
                          </button>

                          <a
                            href={buildWhatsAppUrl(`Hola Centro Dental BeHappy, deseo coordinar mi cita de ${item.treatmentName} con ${item.doctorName}.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 border border-slate-300 hover:border-slate-800 rounded text-[10px] font-mono uppercase tracking-wider text-slate-700 transition bg-white text-center"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Sub-Tab 2: Ficha Clínica */}
            {patientTab === "ficha" && (
              <div className="space-y-4">
                {patientClinicalRecords.length === 0 ? (
                  <div className="p-12 bg-white border border-slate-200 rounded-lg text-center space-y-3 shadow-2xs">
                    <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
                    <h3 className="text-sm font-semibold text-slate-900">Sin registros clínicos aún</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Tus evaluaciones, diagnósticos odontológicos, evolución de tratamientos y recetas electrónicas se reflejarán aquí una vez atendido por el doctor en box.
                    </p>
                  </div>
                ) : (
                  patientClinicalRecords.map((rec) => (
                    <div key={rec.id} className="p-6 bg-white border border-slate-200 rounded-lg space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs font-mono">
                        <div>
                          <span className="text-slate-900 font-bold block text-sm">{rec.doctorName}</span>
                          <span className="text-slate-500">{rec.date} · Folio Clínico #{rec.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
                            Atención Acreditada
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedRecordForDocument(rec)}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-black text-white text-[10px] font-mono uppercase tracking-wider rounded transition flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Ficha Legal (Ley 20.584)</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-slate-700 font-light leading-relaxed">
                        <div>
                          <strong className="text-slate-500 font-mono uppercase block text-[10px]">Diagnóstico Clínico:</strong>
                          <p className="text-sm text-slate-900 font-medium">{rec.diagnosis}</p>
                        </div>

                        <div>
                          <strong className="text-slate-500 font-mono uppercase block text-[10px]">Procedimiento Realizado:</strong>
                          <p>{rec.treatmentPerformed}</p>
                        </div>

                        {rec.prescription && (
                          <div className="p-3 border border-slate-200 bg-slate-50 rounded">
                            <strong className="text-slate-700 font-mono uppercase block text-[10px]">Indicaciones y Prescripción Farmacológica:</strong>
                            <p className="text-xs text-slate-800">{rec.prescription}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Sub-Tab 3: Odontograma */}
            {patientTab === "odontograma" && (
              <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-lg space-y-6 shadow-2xs">
                <AnatomicalOdontogram teeth={odontogram} isDoctorMode={false} />
              </div>
            )}

            {/* Sub-Tab 4: Mi Presupuesto Dental */}
            {patientTab === "presupuesto" && (
              <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-2xs">
                <ClinicalBudgetPlan
                  odontogram={odontogram}
                  patientName={currentUser.fullName}
                  patientRut={currentUser.rut || ""}
                  patientEmail={currentUser.email}
                  patientPhone={currentUser.phone || ""}
                  convenioLevel={currentUser.convenioLevel || "40%"}
                  onPayWithFlow={(amount, subject) => {
                    setFlowPaymentData({
                      patientName: currentUser.fullName,
                      patientEmail: currentUser.email || "",
                      patientPhone: currentUser.phone || "",
                      amount,
                      subject,
                    });
                    setShowFlowPaymentModal(true);
                  }}
                />
              </div>
            )}

            {/* Sub-Tab 5: Consentimientos Informados (Ley 20.584) */}
            {patientTab === "consentimientos" && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-teal-700 uppercase font-bold block">
                      MARCO LEGAL CHILENO · LEY 20.584
                    </span>
                    <h3 className="text-xl font-semibold text-slate-900">
                      Consentimientos Informados Digitales
                    </h3>
                    <p className="text-xs text-slate-500 font-light">
                      Documentos suscritos con firma biométrica digital para procedimientos clínicos y quirúrgicos en box.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConsentModal(true)}
                    className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-mono uppercase tracking-wider font-bold rounded flex items-center gap-2 shadow-xs transition cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Firmar Nuevo Consentimiento</span>
                  </button>
                </div>

                {patientConsents.length === 0 ? (
                  <div className="p-12 bg-white border border-slate-200 rounded-lg text-center space-y-3 shadow-2xs">
                    <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto" />
                    <h3 className="text-sm font-semibold text-slate-900">Sin consentimientos firmados aún</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Antes de someterse a cirugías de exodoncia, endodoncia o implantes, firmará digitalmente el consentimiento informado reglamentario con su odontólogo tratante.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setShowConsentModal(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 hover:border-slate-800 bg-white text-slate-800 text-xs font-mono uppercase rounded transition cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Revisar y Firmar Protocolo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {patientConsents.map((c) => (
                      <div key={c.id} className="p-5 bg-white border border-slate-200 rounded-lg space-y-3 shadow-2xs">
                        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold block flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Firmado Digitalmente
                            </span>
                            <h4 className="font-semibold text-slate-900 text-sm">{c.title}</h4>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono shrink-0">
                            {c.signedDate ? c.signedDate.split("T")[0] : ""}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-slate-500 space-y-1">
                          <p>Paciente: <strong className="text-slate-800">{c.patientName}</strong> ({c.patientRut})</p>
                          <p>Cirujano Dentista: <span className="text-slate-800">{c.doctorName}</span></p>
                          <p className="text-[10px] text-slate-400 truncate">Folio Certificado: {c.id}</p>
                        </div>
                        {c.signatureDataUrl && (
                          <div className="p-2 border border-slate-100 bg-slate-50 rounded flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-500">Rúbrica registrada:</span>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={c.signatureDataUrl} alt="Firma" className="h-8 max-w-[120px] object-contain" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sub-Tab 6: Convenio */}
            {patientTab === "convenio" && (
              <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-lg space-y-6 shadow-2xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-widest text-teal-700 uppercase font-bold">MEMBRESÍA ACTIVA FAMILIAR</span>
                  <h3 className="text-xl font-semibold text-slate-900">Cobertura Preferencial BeHappy (20% al 60%)</h3>
                  <p className="text-xs text-slate-500 font-light">
                    Suscripción vigente con bonificaciones preventivas continuas en Suecia 3580.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-5 border border-slate-200 bg-slate-50 rounded-lg space-y-2">
                    <span className="font-mono text-emerald-700 text-[10px] uppercase font-bold block">100% Bonificado</span>
                    <h4 className="font-semibold text-slate-900 text-sm">Prevención & Diagnóstico</h4>
                    <p className="text-slate-600">2 limpiezas con ultrasonido y radiografías al año sin copago para el titular.</p>
                  </div>

                  <div className="p-5 border border-slate-200 bg-slate-50 rounded-lg space-y-2">
                    <span className="font-mono text-blue-700 text-[10px] uppercase font-bold block">40% Cobertura</span>
                    <h4 className="font-semibold text-slate-900 text-sm">Ortodoncia & Resinas</h4>
                    <p className="text-slate-600">Descuento escalonado en alineadores invisibles Invisalign y restauraciones estéticas.</p>
                  </div>

                  <div className="p-5 border border-slate-200 bg-slate-50 rounded-lg space-y-2">
                    <span className="font-mono text-purple-700 text-[10px] uppercase font-bold block">20% Cobertura</span>
                    <h4 className="font-semibold text-slate-900 text-sm">Cirugía e Implantes</h4>
                    <p className="text-slate-600">Cobertura arancelaria en implantes osteointegrados y exodoncias complejas.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. ROLE: DOCTOR (Clinical Workstation) */}
        {/* ========================================================================= */}
        {activeRole === "doctor" && (
          <div className="space-y-6">
            
            {/* Doctor Header */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-300 shrink-0">
                  <Image
                    src={currentUser.avatarUrl || "/images/doctors/dr-johnny-lugo.png"}
                    alt={currentUser.fullName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-widest text-blue-700 uppercase font-bold block">
                    CUERPO MÉDICO ACREDITADO · SUPERINTENDENCIA DE SALUD
                  </span>
                  <h2 className="text-2xl font-semibold text-slate-900">{currentUser.fullName}</h2>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <p className="text-xs font-mono text-slate-700 font-semibold">{currentUser.specialty || "Cirujano Dentista"}</p>
                    {currentUser.boxAssigned && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {currentUser.boxAssigned}
                      </span>
                    )}
                    {currentUser.clinicalRegistrationNumber && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Reg. SIS: {currentUser.clinicalRegistrationNumber}
                      </span>
                    )}
                    {currentUser.rut && (
                      <span className="text-xs font-mono text-slate-400">
                        RUT: {currentUser.rut}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-left md:text-right space-y-1">
                <span className="text-xs font-mono text-slate-500 block">Jornada Clínica Activa</span>
                <span className="text-xs font-semibold text-slate-900 block">Lunes a Viernes 10:00 - 20:00</span>
                <span className="text-[11px] font-mono text-emerald-600 font-medium">Sede Suecia 3580, Ñuñoa</span>
              </div>
            </div>

            {/* Legal Protocol Notice (Dentalink is primary EHR) */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4 flex items-start gap-3 text-xs text-blue-900 font-light">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-blue-950">Protocolo Primario Ley 20.584:</strong> La Ficha Clínica oficial, el Odontograma en box y la emisión de Boletas SII residen exclusivamente en <strong>Dentalink</strong> (HealthAtom en el sillón clínico). Este módulo web opera como visor de triaje, admisión y derivación de citas web.
              </div>
            </div>

            {/* Daily Agenda Table */}
            <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100 shadow-2xs overflow-hidden">
              <div className="p-4 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold uppercase text-slate-900">Agenda Médica del Día</span>
                  <span className="px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 font-bold text-[10px]">
                    {appointments.length} Cita{appointments.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Filter toggle */}
                <div className="inline-flex rounded-md border border-slate-200 bg-white p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setDoctorAgendaFilter("mis_citas")}
                    className={`px-3 py-1 rounded transition text-[11px] cursor-pointer ${
                      doctorAgendaFilter === "mis_citas"
                        ? "bg-slate-900 text-white font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Mis Pacientes {currentUser?.boxAssigned ? `(${currentUser.boxAssigned})` : ""}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDoctorAgendaFilter("todas")}
                    className={`px-3 py-1 rounded transition text-[11px] cursor-pointer ${
                      doctorAgendaFilter === "todas"
                        ? "bg-slate-900 text-white font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Toda la Clínica ({appointments.length})
                  </button>
                </div>
              </div>

              {(() => {
                const filteredDoctorAppointments = appointments.filter((item) => {
                  if (doctorAgendaFilter === "todas") return true;
                  if (!currentUser) return true;
                  const cName = currentUser.fullName.toLowerCase().replace(/^(dr\.|dra\.)\s*/, "").trim();
                  const itemDoc = (item.doctorName || "").toLowerCase().replace(/^(dr\.|dra\.)\s*/, "").trim();
                  const matchName = itemDoc && (itemDoc.includes(cName) || cName.includes(itemDoc));
                  const matchBox = currentUser.boxAssigned && item.box === currentUser.boxAssigned;
                  return matchName || matchBox;
                });

                if (filteredDoctorAppointments.length === 0) {
                  return (
                    <div className="p-10 text-center space-y-2">
                      <Clock className="w-6 h-6 text-slate-400 mx-auto" />
                      <p className="text-xs text-slate-700 font-semibold">
                        {doctorAgendaFilter === "mis_citas"
                          ? `No hay citas directas agendadas para ${currentUser?.fullName} hoy`
                          : "No hay pacientes citados para hoy"}
                      </p>
                      <p className="text-[11px] font-mono text-slate-500 max-w-md mx-auto">
                        {doctorAgendaFilter === "mis_citas"
                          ? "Puedes revisar todas las citas del día cambiando el filtro a 'Toda la Clínica' o admitir pacientes walk-in desde recepción."
                          : "Las citas agendadas por la web pública o registradas en recepción impactan aquí en tiempo real."}
                      </p>
                    </div>
                  );
                }

                return filteredDoctorAppointments.map((item) => {
                  const patientUser = userList.find((u) => matchesPatient({ name: item.patientName, rut: item.patientRut, email: item.patientEmail }, u));
                  const isClubMember = (patientUser?.convenioLevel && patientUser.convenioLevel !== "Ninguno") || Boolean(item.convenioDiscount);
                  const clubTier = patientUser?.convenioLevel || (item.convenioDiscount ? "Convenio Activo" : null);

                  return (
                    <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900">{item.time} hrs</span>
                          <span className="text-sm font-semibold text-slate-900">· {item.patientName}</span>
                          <span className="text-xs font-mono text-slate-500">({item.patientRut || "Sin RUT"})</span>
                          
                          {/* Dentalink Sync Badge */}
                          {item.dentalinkCitaId ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              Dentalink #{item.dentalinkCitaId}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-600">
                              Web Box 1
                            </span>
                          )}

                          {/* Club BeHappy Badge */}
                          {isClubMember && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                              <span>👑 Club BeHappy</span>
                              {clubTier && <span>({clubTier})</span>}
                            </span>
                          )}

                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 text-slate-700 border border-slate-200">
                            {item.status.replace("_", " ")}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 font-light">
                          Procedimiento: <strong className="text-slate-900 font-medium">{item.treatmentName}</strong> · {item.box || "Box 1"}
                          {item.doctorName && item.doctorName !== currentUser?.fullName && (
                            <span className="text-slate-500"> · Asignado a: <strong className="text-slate-700">{item.doctorName}</strong></span>
                          )}
                        </p>

                        {/* Web Triage Anamnesis Note */}
                        {item.notes && (
                          <div className="inline-block bg-amber-50/80 border border-amber-200/80 rounded px-2.5 py-1 text-[11px] font-mono text-amber-900">
                            <span className="font-bold text-amber-950 uppercase tracking-wider text-[9px] mr-1">Triaje Web:</span>
                            {item.notes}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            const pName = item.patientName || "Paciente en Box";
                            setSoapPatient(pName);
                            handleStatusChange(item.id, "en_box");
                            toast.info(`Paciente ${pName} cargado en Box y Ficha SOAP`);
                          }}
                          className="px-3 py-1.5 rounded border border-slate-300 hover:border-slate-800 text-[11px] font-mono uppercase text-slate-800 transition bg-white cursor-pointer"
                          title="Pasar paciente a box y precargar su ficha SOAP"
                        >
                          Pasar a Box
                        </button>
                        <button
                          onClick={() => handleStatusChange(item.id, "completada")}
                          className="px-3 py-1.5 rounded bg-slate-900 text-white font-bold text-[11px] font-mono uppercase transition hover:bg-black cursor-pointer"
                        >
                          Finalizar ✓
                        </button>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* SOAP Form (Ficha de Evolución) */}
            <div className="p-6 bg-white border border-slate-200 rounded-lg space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Evolución Clínica (Método SOAP)</h3>
                  <p className="text-xs font-mono text-slate-500">Ingreso a la Ficha Electrónica del Paciente</p>
                </div>
                {soapSavedToast && (
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    ✓ Guardado en Ficha
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveSoap} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">Nombre o RUT del Paciente *</label>
                    <input
                      type="text"
                      required
                      value={soapPatient}
                      onChange={(e) => setSoapPatient(e.target.value)}
                      list="soap-patients-list"
                      placeholder="Escriba o seleccione paciente..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs font-mono placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white"
                    />
                    <datalist id="soap-patients-list">
                      {userList.map((u) => (
                        <option key={u.id} value={`${u.fullName} (${u.rut || u.email})`} />
                      ))}
                      {appointments.map((a) => (
                        <option key={a.id} value={`${a.patientName} (${a.patientPhone || "Sin fono"})`} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">Diagnóstico (CIE-10 / Odontológico) *</label>
                    <input
                      type="text"
                      required
                      value={soapDiagnosis}
                      onChange={(e) => setSoapDiagnosis(e.target.value)}
                      placeholder="Ej: K02.1 Caries de la dentina / K07.2 Maloclusión"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">Procedimiento y Técnica Realizada *</label>
                  <textarea
                    rows={3}
                    required
                    value={soapTreatment}
                    onChange={(e) => setSoapTreatment(e.target.value)}
                    placeholder="Descripción clínica: Aislamiento absoluto, remoción de caries, grabado ácido, adhesivo y resina compuesta pieza 1.4..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">Prescripción e Indicaciones Post-Box</label>
                  <input
                    type="text"
                    value={soapPrescription}
                    onChange={(e) => setSoapPrescription(e.target.value)}
                    placeholder="Ej: Ibuprofeno 400mg c/8hrs si molestia, higiene con cepillo suave, reposo relativo"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-bold font-mono text-xs uppercase tracking-wider rounded transition shadow-sm"
                  >
                    Guardar en Ficha
                  </button>
                </div>
              </form>
            </div>

            {/* Doctor Odontogram Quick-Chart */}
            <div className="p-6 bg-white border border-slate-200 rounded-lg space-y-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Odontograma Interactivo FDI & Diagnóstico</h3>
                  <p className="text-xs font-mono text-slate-500">Mapeo anatómico en sillón con derivación arancelaria directa</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBudgetModal(true)}
                    className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Presupuesto desde Odontograma</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConsentModal(true)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Consentimiento Ley 20.584</span>
                  </button>
                </div>
              </div>
              <AnatomicalOdontogram
                teeth={odontogram}
                isDoctorMode={true}
                onToothClick={handleToothClick}
              />
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. ROLE: RECEPCION (Front-Desk Desk) */}
        {/* ========================================================================= */}
        {activeRole === "recepcion" && (
          <div className="space-y-6">
            
            <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-amber-700 uppercase font-bold block">
                  RECEPCIÓN & SALA DE ESPERA
                </span>
                <h2 className="text-2xl font-semibold text-slate-900">Módulo de Admisión</h2>
                <p className="text-xs font-mono text-slate-500">Suecia 3580, OF. 304, Ñuñoa</p>
              </div>

              <button
                onClick={() => setShowWalkinModal(true)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs font-mono uppercase tracking-wider rounded flex items-center gap-1.5 shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                Paciente Walk-In
              </button>
            </div>

            {/* Legal Protocol Notice for Reception */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-4 flex items-start gap-3 text-xs text-amber-900 font-light">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-amber-950">Protocolo de Admisión:</strong> La agenda oficial de sillones y cobros DTE se gestionan en Dentalink. Este módulo web permite registrar pacientes presenciales, cobrar abonos Flow y confirmar asistencia por WhatsApp.
              </div>
            </div>

            {/* Live Flow Table with Search */}
            <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100 shadow-2xs overflow-hidden">
              <div className="p-4 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold uppercase text-slate-900">Flujo de Pacientes en Sala</span>
                  <span className="px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 font-bold text-[10px]">
                    {appointments.length} Cita{appointments.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Reception Search */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={receptionSearch}
                    onChange={(e) => setReceptionSearch(e.target.value)}
                    placeholder="Filtrar por paciente, RUT o fono..."
                    className="w-full pl-8 pr-3 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-800"
                  />
                  {receptionSearch && (
                    <button
                      type="button"
                      onClick={() => setReceptionSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {(() => {
                const filteredReceptionAppointments = appointments.filter((item) => {
                  if (!receptionSearch.trim()) return true;
                  const q = receptionSearch.toLowerCase().trim();
                  const name = (item.patientName || "").toLowerCase();
                  const rut = (item.patientRut || "").toLowerCase();
                  const phone = (item.patientPhone || "").toLowerCase();
                  const doc = (item.doctorName || "").toLowerCase();
                  const treat = (item.treatmentName || "").toLowerCase();
                  return name.includes(q) || rut.includes(q) || phone.includes(q) || doc.includes(q) || treat.includes(q);
                });

                if (filteredReceptionAppointments.length === 0) {
                  return (
                    <div className="p-12 text-center space-y-3">
                      <Clock className="w-8 h-8 text-slate-400 mx-auto" />
                      <h3 className="text-sm font-semibold text-slate-900">
                        {receptionSearch ? "No se encontraron pacientes para esta búsqueda" : "No hay citas registradas en recepción"}
                      </h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        {receptionSearch ? "Intenta con otro término o limpia el buscador." : "Los pacientes que agenden en la web pública o lleguen directamente a Suecia 3580 se gestionan aquí."}
                      </p>
                      {!receptionSearch && (
                        <div className="pt-2">
                          <button
                            onClick={() => setShowWalkinModal(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs font-mono uppercase tracking-wider rounded transition cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Registrar Paciente Presencial
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }

                return filteredReceptionAppointments.map((item) => {
                  const patientUser = userList.find((u) => matchesPatient({ name: item.patientName, rut: item.patientRut, email: item.patientEmail }, u));
                  const isClubMember = (patientUser?.convenioLevel && patientUser.convenioLevel !== "Ninguno") || Boolean(item.convenioDiscount);
                  const isFlowPaid = item.paymentStatus === "abono_flow" || item.paymentStatus === "pagado";

                  return (
                    <div key={item.id} className="p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-slate-50/60 transition">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-slate-900 text-sm">{item.patientName}</span>
                          <span className="text-xs font-mono text-slate-500">{item.patientPhone ? `· ${item.patientPhone}` : ""}</span>
                          
                          {/* Dentalink Sync Badge */}
                          {item.dentalinkCitaId ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              Dentalink #{item.dentalinkCitaId}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-600">
                              Web Directa
                            </span>
                          )}

                          {/* Payment Status Badge */}
                          {isFlowPaid ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Abono Web $10.000 Pagado ✓
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-50 text-amber-700 border border-amber-200">
                              Pago Pendiente en Caja
                            </span>
                          )}

                          {/* Club Badge */}
                          {isClubMember && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                              👑 Socio Club
                            </span>
                          )}

                          <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-100 text-[10px] font-mono uppercase text-slate-700">
                            {item.status.replace("_", " ")}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 font-light">
                          {item.treatmentName} · {item.doctorName} · {item.time} hrs · {item.box || "Box 1"}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const amount = (item.price ?? 35000) - (item.convenioDiscount ?? 0);
                            setFlowPaymentData({
                              appointmentId: item.id,
                              patientName: item.patientName || "Paciente",
                              patientEmail: item.patientEmail || userList.find((u) => u.fullName.toLowerCase() === (item.patientName || "").toLowerCase())?.email || "",
                              patientPhone: item.patientPhone || "",
                              amount,
                              subject: `Atención en Sede · ${item.treatmentName}`,
                            });
                            setShowFlowPaymentModal(true);
                          }}
                          className="px-2.5 py-1.5 rounded bg-slate-900 hover:bg-black text-white text-xs font-mono uppercase transition flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Cobro Flow</span>
                        </button>

                        <a
                          href={buildWhatsAppUrl(`¡Hola ${item.patientName}! Le recordamos su cita de ${item.treatmentName} en BeHappy Ñuñoa para hoy a las ${item.time} hrs. ¿Nos confirma su asistencia?`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded border border-slate-300 hover:border-slate-800 text-xs font-mono uppercase text-slate-800 transition bg-white"
                        >
                          WhatsApp
                        </a>
                        <button
                          onClick={() => handleStatusChange(item.id, "en_espera")}
                          className="px-2.5 py-1.5 rounded border border-slate-300 hover:border-slate-800 text-xs font-mono uppercase text-slate-800 transition bg-white cursor-pointer"
                        >
                          Llegó
                        </button>
                        <button
                          onClick={() => handleStatusChange(item.id, "completada")}
                          className="px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-mono uppercase transition shadow-2xs cursor-pointer"
                        >
                          Cobrado ✓
                        </button>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Walk-in Modal */}
            {showWalkinModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                <div className="bg-white border border-slate-200 rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl">
                  <h3 className="text-base font-semibold text-slate-900">Ingreso Paciente Presencial (Walk-In)</h3>
                  <form onSubmit={handleWalkinSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">Nombre Completo *</label>
                      <input
                        type="text"
                        required
                        value={walkinName}
                        onChange={(e) => setWalkinName(e.target.value)}
                        placeholder="Ej: Marcelo Vidal Ríos"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">Teléfono / WhatsApp</label>
                        <input
                          type="tel"
                          value={walkinPhone}
                          onChange={(e) => setWalkinPhone(e.target.value)}
                          placeholder="+56 9 8765 4321"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">Box Clínico</label>
                        <select
                          value={walkinBox}
                          onChange={(e) => setWalkinBox(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs font-mono"
                        >
                          <option value="Box 1">Box 1 (Principal)</option>
                          <option value="Box 2">Box 2 (Ortodoncia)</option>
                          <option value="Box 3">Box 3 (Cirugía / Rayos)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">Doctor Asignado *</label>
                      <select
                        value={walkinDoctor}
                        onChange={(e) => setWalkinDoctor(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs font-mono"
                      >
                        {availableDoctors.map((doc) => (
                          <option key={doc.id} value={doc.name}>
                            {doc.name} ({doc.specialty})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">Motivo de Atención *</label>
                      <input
                        type="text"
                        required
                        value={walkinTreatment}
                        onChange={(e) => setWalkinTreatment(e.target.value)}
                        placeholder="Ej: Urgencia dolor dental, Evaluación..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowWalkinModal(false)}
                        className="px-4 py-2 border border-slate-300 rounded text-xs font-mono uppercase text-slate-600"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs font-mono uppercase rounded shadow-sm"
                      >
                        Ingresar a Sala
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. ROLE: ADMIN (Executive Central & CMS Platform) */}
        {/* ========================================================================= */}
        {activeRole === "admin" && (
          <div className="flex flex-col lg:flex-row gap-8 items-start w-full min-w-0 max-w-full">
            
            {/* Admin Sidebar Navigation */}
            <aside className="w-full lg:w-64 shrink-0 bg-white border border-slate-200 rounded-lg p-5 lg:sticky lg:top-20 space-y-6 shadow-xs">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                  <span className="text-[10px] font-mono tracking-[0.2em] text-purple-700 uppercase font-bold">
                    ADMINISTRACIÓN CENTRAL
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                  Panel de Control
                </h3>
                <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                  Dirección · Centro Dental BeHappy
                </p>
              </div>

              {/* Categorized Navigation Tabs */}
              <div className="space-y-4 font-mono text-xs">
                {/* 1. DIRECCIÓN & ENLACE MAESTRO */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block px-1">
                    Dirección & Enlace
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdminTab("dashboard")}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded transition text-left cursor-pointer ${
                      adminTab === "dashboard"
                        ? "bg-slate-900 text-white font-bold shadow-xs"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 shrink-0" />
                    <span>Dashboard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminTab("dentalink")}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded transition text-left cursor-pointer ${
                      adminTab === "dentalink"
                        ? "bg-slate-900 text-white font-bold shadow-xs"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 shrink-0 text-blue-600" />
                      <span>Enlace Dentalink</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold uppercase">
                      API
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminTab("consentimientos")}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded transition text-left cursor-pointer ${
                      adminTab === "consentimientos"
                        ? "bg-slate-900 text-white font-bold shadow-xs"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>Auditoría Ley 20.584</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">{consents.length}</span>
                  </button>
                </div>

                {/* 2. OPERACIÓN & CAPTACIÓN WEB */}
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block px-1">
                    Operación & Web
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdminTab("citas")}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded transition text-left cursor-pointer ${
                      adminTab === "citas"
                        ? "bg-slate-900 text-white font-bold shadow-xs"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>Citas Web & Triaje</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">{appointments.length}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminTab("pagos_club")}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded transition text-left cursor-pointer ${
                      adminTab === "pagos_club"
                        ? "bg-slate-900 text-white font-bold shadow-xs"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>Pagos Flow & Club</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {userList.filter((u) => u.convenioLevel && u.convenioLevel !== "Ninguno").length}
                    </span>
                  </button>
                </div>

                {/* 3. CONTENIDO & SISTEMA */}
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block px-1">
                    Contenido & Sistema
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdminTab("cms")}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded transition text-left cursor-pointer ${
                      adminTab === "cms"
                        ? "bg-slate-900 text-white font-bold shadow-xs"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 shrink-0 text-teal-600" />
                      <span>Editor CMS Web</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">
                      VIVO
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminTab("usuarios")}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded transition text-left cursor-pointer ${
                      adminTab === "usuarios"
                        ? "bg-slate-900 text-white font-bold shadow-xs"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <UsersIcon className="w-4 h-4 shrink-0" />
                      <span>Usuarios & Roles</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">{userList.length}</span>
                  </button>
                </div>
              </div>

              {/* Direct Access to Dentalink Master Cloud Agenda */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider">
                  Acceso Dentalink Maestro
                </span>
                <a
                  href={CLINIC_INFO.dentalink?.agendaUrl || "https://00b229f2077285343f1ffac76fd853c23816acec.agenda.softwaredentalink.com/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs text-blue-700 hover:text-blue-900 font-mono py-1.5 px-2.5 bg-blue-50/70 hover:bg-blue-100/70 rounded border border-blue-200/80 transition"
                >
                  <span className="font-semibold">Agenda Dentalink Cloud</span>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                </a>
              </div>

              {/* Live Web Links */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider">Acceso Público</span>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 font-mono py-1"
                >
                  <span>Página de Inicio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="/tratamientos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 font-mono py-1"
                >
                  <span>Catálogo de Tratamientos</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </aside>

            {/* Admin Main Dynamic Pane */}
            <div className="flex-1 w-full min-w-0 max-w-full space-y-6">
              
              {/* TAB 1: EXECUTIVE DASHBOARD */}
              {adminTab === "dashboard" && (
                <div className="space-y-6">
                  
                  {/* Top Header Card */}
                  <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-purple-700 uppercase font-bold block">
                        DIRECCIÓN MÉDICA & ADMINISTRACIÓN CENTRAL
                      </span>
                      <h2 className="text-2xl font-semibold text-slate-900">Dashboard Ejecutivo</h2>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        Headless Front-Office · BeHappy Ñuñoa (Suecia 3580)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAdminTab("dentalink")}
                        className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-mono text-xs uppercase tracking-wider rounded font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Activity className="w-3.5 h-3.5" />
                        <span>Enlace Dentalink</span>
                      </button>
                      <button
                        onClick={() => setAdminTab("cms")}
                        className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-mono text-xs uppercase tracking-wider rounded font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Editor CMS Web</span>
                      </button>
                    </div>
                  </div>

                  {/* Architecture Banner (Zero Duplication & Single Source of Truth) */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-600 dark:text-emerald-400 font-bold">
                          ARQUITECTURA DE INTEGRACIÓN HEADLESS
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Dentalink es la Fuente Única Oficial (100%)</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-normal max-w-2xl leading-relaxed">
                        La Historia Clínica Electrónica (Ley 20.584), el Odontograma en box y las Boletas Electrónicas SII residen exclusivamente en Dentalink. Este panel administra la captación digital, triaje de pacientes, pasarela Flow.cl y contenidos editoriales.
                      </p>
                    </div>
                    <a
                      href={CLINIC_INFO.dentalink?.agendaUrl || "https://00b229f2077285343f1ffac76fd853c23816acec.agenda.softwaredentalink.com/"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 border border-slate-200 dark:border-white/20 text-slate-800 dark:text-white rounded text-xs font-mono uppercase tracking-wider font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs"
                    >
                      <span>Abrir Dentalink</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
                    </a>
                  </div>

                  {/* Executive KPI Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-2xs">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">Enlace Dentalink</span>
                      <span className="text-lg font-bold font-mono text-blue-700 block">HealthAtom Cloud</span>
                      <span className="text-[10px] font-mono text-slate-500 block">Sucursal #1 · Suecia 3580</span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-2xs">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">Citas Web Headless</span>
                      <span className="text-xl font-bold font-mono text-slate-900 block">{appointments.length}</span>
                      <span className="text-[10px] font-mono text-slate-500 block">Captadas por triaje web</span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-2xs">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">Abonos Online Flow</span>
                      <span className="text-xl font-bold font-mono text-slate-900 block">
                        {(() => {
                          const paid = appointments.filter((a) => a.paymentStatus === "pagado" || a.paymentStatus === "abono_flow");
                          const total = paid.reduce((acc, a) => acc + (a.paymentStatus === "abono_flow" ? 10000 : (a.price ?? 35000)), 0);
                          return `$${total.toLocaleString("es-CL")} CLP`;
                        })()}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 block">Webpay / Flow.cl Chile</span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-2xs">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">Club BeHappy</span>
                      <span className="text-xl font-bold font-mono text-emerald-600 block">
                        {userList.filter((u) => u.convenioLevel && u.convenioLevel !== "Ninguno").length} Miembros
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 block">Convenios sincronizados</span>
                    </div>
                  </div>

                  {/* Telemetry CAC / Origin Breakdown Card */}
                  <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900">
                          Telemetría de Captación & Atribución Publicitaria (CAC)
                        </h4>
                        <p className="text-xs text-slate-500 font-mono">
                          Origen de pacientes inyectados a Dentalink desde campañas digitales
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                        {appointments.length} Conversiones Totales
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                      <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                        <span className="text-[10px] uppercase text-slate-500 block">Google Search Ads</span>
                        <span className="text-base font-bold text-slate-900 block">
                          {appointments.filter((a) => (a.utmSource || "").toLowerCase().includes("google")).length}
                        </span>
                        <span className="text-[10px] text-slate-400 block">Palabras clave de intención</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                        <span className="text-[10px] uppercase text-slate-500 block">Meta Ads (Instagram)</span>
                        <span className="text-base font-bold text-slate-900 block">
                          {appointments.filter((a) => (a.utmSource || "").toLowerCase().includes("meta") || (a.utmSource || "").toLowerCase().includes("instagram")).length}
                        </span>
                        <span className="text-[10px] text-slate-400 block">Estética & Ortodoncia</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                        <span className="text-[10px] uppercase text-slate-500 block">Web Directa / SEO</span>
                        <span className="text-base font-bold text-slate-900 block">
                          {appointments.filter((a) => !(a.utmSource || "").toLowerCase().includes("google") && !(a.utmSource || "").toLowerCase().includes("meta") && !(a.utmSource || "").toLowerCase().includes("instagram")).length}
                        </span>
                        <span className="text-[10px] text-slate-400 block">Tráfico orgánico Ñuñoa</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                        <span className="text-[10px] uppercase text-slate-500 block">Tasa Inyección Dentalink</span>
                        <span className="text-base font-bold text-emerald-600 block">100% Fallback Seguro</span>
                        <span className="text-[10px] text-slate-400 block">Cero pacientes perdidos</span>
                      </div>
                    </div>
                  </div>

                  {/* CMS Fast Jump Banner */}
                  <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">GESTIÓN DE CONTENIDOS EN TIEMPO REAL</span>
                      <h4 className="text-base font-semibold text-slate-900">Edición Directa del Sitio Web Público</h4>
                      <p className="text-xs text-slate-600 font-light max-w-xl">
                        Modifica el catálogo de 20 tratamientos, equipo de 8 doctores, teléfonos de WhatsApp de guardia, cintillo de anuncios y convenios en vivo.
                      </p>
                    </div>
                    <button
                      onClick={() => setAdminTab("cms")}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-mono text-xs uppercase tracking-wider rounded font-bold transition flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
                    >
                      <span>Ir a Módulo CMS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: DENTALINK INTEGRATION MONITOR */}
              {adminTab === "dentalink" && (
                <DentalinkIntegrationPanel />
              )}

              {/* TAB 3: WEB APPOINTMENTS & TRIAGE QUEUE */}
              {adminTab === "citas" && (
                <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100 shadow-xs overflow-hidden">
                  <div className="p-4 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-600" />
                      <span className="font-bold uppercase text-slate-900">Cola de Citas Web & Sincronización Dentalink</span>
                    </div>
                    <span className="text-slate-500">{appointments.length} Citas Registradas</span>
                  </div>

                  {appointments.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-xs font-mono">
                      No hay citas en la cola actualmente. Las citas agendadas desde la web pública se reflejarán aquí.
                    </div>
                  ) : (
                    appointments.map((a) => (
                      <div key={a.id} className="p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-slate-50/60 transition">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-slate-900 text-sm">{a.patientName}</span>
                            <span className="text-xs font-mono text-slate-500">· {a.treatmentName}</span>
                            
                            {/* Dentalink Sync Badge */}
                            {a.dentalinkCitaId ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Dentalink #{a.dentalinkCitaId}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                Fallback WhatsApp
                              </span>
                            )}

                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 text-slate-700 border border-slate-200">
                              {a.status}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 font-mono mt-0.5">
                            Fecha: {a.date} {a.time} · Especialista: {a.doctorName} · Tel: {a.patientPhone || "Sin fono"}
                            {a.utmSource && (
                              <span className="text-slate-400"> · Origen: <strong className="text-slate-600">{a.utmSource}</strong></span>
                            )}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {a.patientPhone && (
                            <a
                              href={buildWhatsAppUrl(`¡Hola ${a.patientName}! Le escribimos desde Centro Dental BeHappy (Ñuñoa) para coordinar su cita de ${a.treatmentName} agendada para el ${a.date} a las ${a.time} hrs.`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded border border-slate-300 hover:border-slate-800 text-[11px] font-mono uppercase text-slate-800 transition bg-white flex items-center gap-1"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>WhatsApp</span>
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => handleStatusChange(a.id, "confirmada")}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-mono uppercase rounded transition font-bold cursor-pointer"
                          >
                            Confirmar
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(a.id, "completada")}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-[11px] font-mono uppercase rounded transition font-bold cursor-pointer"
                          >
                            Atendida ✓
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 4: FLOW PAYMENTS & CLUB BEHAPPY */}
              {adminTab === "pagos_club" && (
                <FlowClubManagementPanel userList={userList} appointments={appointments} />
              )}

              {/* TAB 5: SITE CMS EDITOR */}
              {adminTab === "cms" && (
                <div className="space-y-4">
                  <SiteCmsEditor />
                </div>
              )}

              {/* TAB 6: USERS & ROLES */}
              {adminTab === "usuarios" && (
                <AdminUserManagement currentUser={currentUser} />
              )}

              {/* TAB 7: INFORMED CONSENT AUDIT (LEY 20.584) */}
              {adminTab === "consentimientos" && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                        <span className="text-[10px] font-mono tracking-widest text-emerald-700 uppercase font-bold">
                          MARCO LEGAL CLÍNICO · LEY 20.584 & SUPERINTENDENCIA DE SALUD
                        </span>
                      </div>
                      <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
                        Auditoría de Consentimientos Informados
                      </h2>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        Trazabilidad de rúbricas biométricas en canvas para cirugía, endodoncia, ortodoncia e implantes en box
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowConsentModal(true)}
                      className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-mono uppercase tracking-wider rounded font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Emitir Consentimiento</span>
                    </button>
                  </div>

                  {/* KPIs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-2xs">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">Total Suscritos</span>
                      <span className="text-xl font-bold font-mono text-slate-900 block">{consents.length}</span>
                      <span className="text-[10px] font-mono text-slate-500 block">Registrados en expediente web</span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-2xs">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">Rúbrica Biométrica</span>
                      <span className="text-xl font-bold font-mono text-emerald-600 block">
                        {consents.filter((c) => c.status === "firmado" && c.signatureDataUrl).length} Firmados
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 block">Con firma digital en canvas</span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-2xs">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">Pacientes Acreditados</span>
                      <span className="text-xl font-bold font-mono text-slate-900 block">
                        {new Set(consents.map((c) => c.patientRut || c.patientName)).size}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 block">Expedientes con consentimiento</span>
                    </div>
                  </div>

                  {/* Consents Ledger Table */}
                  <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100 shadow-xs overflow-hidden">
                    <div className="p-4 bg-slate-50 flex items-center justify-between text-xs font-mono">
                      <span className="font-bold uppercase text-slate-900">Libro Maestro de Consentimientos Digitales</span>
                      <span className="text-slate-500">{consents.length} Documentos</span>
                    </div>

                    {consents.length === 0 ? (
                      <div className="p-12 text-center space-y-3 font-mono">
                        <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto" />
                        <h4 className="text-sm font-semibold text-slate-900">No hay consentimientos registrados en este momento</h4>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                          Los consentimientos informados firmados por pacientes desde su portal o emitidos por odontólogos en box quedarán registrados aquí de forma auditable.
                        </p>
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => setShowConsentModal(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs font-mono uppercase tracking-wider rounded transition cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Emitir Consentimiento de Prueba
                          </button>
                        </div>
                      </div>
                    ) : (
                      consents.map((c) => (
                        <div key={c.id} className="p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-slate-50/60 transition">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-slate-900 text-sm">{c.patientName}</span>
                              <span className="text-xs font-mono text-slate-500">· RUT: {c.patientRut || "Sin RUT"}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-50 text-teal-800 border border-teal-200">
                                {c.title}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Firmado ✓
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 font-mono mt-0.5">
                              Odontólogo: <strong className="text-slate-700">{c.doctorName}</strong> · Fecha de Suscripción: {c.signedDate} · Folio #{c.id.slice(0, 8)}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {c.signatureDataUrl && (
                              <div className="h-10 w-24 bg-slate-50 border border-slate-200 rounded p-1 flex items-center justify-center overflow-hidden">
                                <img
                                  src={c.signatureDataUrl}
                                  alt="Rúbrica Digital"
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                            )}

                            <span className="text-[10px] font-mono text-slate-400">
                              Ley 20.584 Art. 14
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Modal Ficha Clínica Legal (Ley 20.584) */}
        {selectedRecordForDocument && (
          <ClinicalDocumentModal
            record={selectedRecordForDocument}
            patient={currentUser}
            onClose={() => setSelectedRecordForDocument(null)}
          />
        )}

        {/* Modal de Cobro Flow.cl */}
        {showFlowPaymentModal && flowPaymentData && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-300 rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono tracking-widest text-emerald-700 uppercase font-bold block">
                    PASARELA TRANSBANK / WEBPAY PLUS
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">
                    Cobro en Línea Flow.cl
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFlowPaymentModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-800 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded text-xs font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Paciente:</span>
                  <strong className="text-slate-900">{flowPaymentData.patientName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Concepto:</span>
                  <span className="text-slate-800">{flowPaymentData.subject}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                  <span className="text-slate-500 uppercase">Monto a Cobrar:</span>
                  <span className="text-lg font-bold text-slate-900">
                    ${flowPaymentData.amount.toLocaleString("es-CL")} CLP
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <label className="block text-[11px] font-mono uppercase text-slate-600 font-medium">
                  Email para envío de boleta y comprobante *
                </label>
                <input
                  type="email"
                  required
                  value={flowPaymentData.patientEmail}
                  onChange={(e) =>
                    setFlowPaymentData({
                      ...flowPaymentData,
                      patientEmail: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFlowPaymentModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-xs font-mono uppercase text-slate-600 hover:border-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={flowPaymentLoading}
                  onClick={async () => {
                    if (!flowPaymentData.patientEmail || !flowPaymentData.patientEmail.includes("@")) {
                      toast.error("Por favor ingrese un correo electrónico válido para recibir el comprobante.");
                      return;
                    }
                    setFlowPaymentLoading(true);
                    toast.info("Conectando con pasarela segura Flow.cl (Webpay Plus)...");
                    try {
                      const res = await fetch("/api/pagos/flow/create", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          type: "copago_tratamiento",
                          amount: flowPaymentData.amount,
                          subject: flowPaymentData.subject,
                          email: flowPaymentData.patientEmail,
                          patientName: flowPaymentData.patientName,
                          patientPhone: flowPaymentData.patientPhone,
                          appointmentId: flowPaymentData.appointmentId,
                        }),
                      });
                      const data = await res.json();
                      if (data.redirectUrl) {
                        toast.success("Redirigiendo a Webpay...");
                        window.location.href = data.redirectUrl;
                        return;
                      } else {
                        toast.error(data.error || "No fue posible conectar con Flow Webpay.");
                      }
                    } catch (err) {
                      console.error("Error processing portal Flow payment:", err);
                      toast.error("Error de conexión con la pasarela. Intente nuevamente.");
                    } finally {
                      setFlowPaymentLoading(false);
                    }
                  }}
                  className="px-5 py-2 bg-slate-900 hover:bg-black text-white font-mono text-xs uppercase tracking-wider font-bold rounded flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {flowPaymentLoading ? (
                    <span>Conectando...</span>
                  ) : (
                    <>
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Ir a Pagar con Webpay</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Presupuesto Odontológico Integral */}
        {showBudgetModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-slate-300 rounded-lg max-w-4xl w-full p-6 sm:p-8 space-y-4 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
              <ClinicalBudgetPlan
                odontogram={odontogram}
                patientName={soapPatient || currentUser?.fullName || "Paciente en Box"}
                patientRut={currentUser?.rut || ""}
                patientEmail={currentUser?.email || ""}
                patientPhone={currentUser?.phone || ""}
                convenioLevel={currentUser?.convenioLevel || "40%"}
                onClose={() => setShowBudgetModal(false)}
                onPayWithFlow={(amount, subject) => {
                  setShowBudgetModal(false);
                  setFlowPaymentData({
                    patientName: soapPatient || currentUser?.fullName || "Paciente en Box",
                    patientEmail: currentUser?.email || "",
                    patientPhone: currentUser?.phone || "",
                    amount,
                    subject,
                  });
                  setShowFlowPaymentModal(true);
                }}
              />
            </div>
          </div>
        )}

        {/* Modal Consentimiento Informado (Ley 20.584) */}
        {showConsentModal && (
          <InformedConsentModal
            patientName={soapPatient || currentUser?.fullName || "Paciente en Box"}
            patientRut={currentUser?.rut || ""}
            doctorName={activeRole === "doctor" ? (currentUser?.fullName || availableDoctors[0]?.name || "Doctor Tratante") : (appointments[0]?.doctorName || availableDoctors[0]?.name || "Doctor Tratante")}
            onClose={() => setShowConsentModal(false)}
            onConsentSigned={(consent) => {
              addStoredConsent(consent);
              setShowConsentModal(false);
            }}
          />
        )}

      </main>

    </div>
  );
}

export default function PortalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#0f172a] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500">
            Cargando Portal BeHappy OS...
          </p>
        </div>
      }
    >
      <PortalContent />
    </Suspense>
  );
}
