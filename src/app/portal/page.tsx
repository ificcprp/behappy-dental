"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { UserRole, UserProfile, PatientAppointment, ClinicalRecord, OdontogramTooth } from "@/types/auth";
import { createWhatsAppUrl } from "@/data/clinicInfo";
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
  updateStoredAppointmentStatus,
  getStoredClinicalRecords,
  addStoredClinicalRecord,
  getStoredOdontogram,
  updateStoredToothStatus,
  CLINICAL_CHANGE_EVENT
} from "@/lib/clinicalStore";
import { SiteCmsEditor } from "@/components/portal/SiteCmsEditor";
import {
  Calendar,
  CheckCircle2,
  Plus,
  MessageCircle,
  LogOut,
  ArrowRight,
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
  UserCheck
} from "lucide-react";

function PortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active session gate
  const [sessionLoading, setSessionLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Active role state
  const [activeRole, setActiveRole] = useState<UserRole>("paciente");

  // Admin simulation view (strictly restricted to Admin users)
  const initialRoleParam = searchParams.get("role") as UserRole | null;
  const initialTabParam = searchParams.get("tab") as "dashboard" | "cms" | "citas" | "usuarios" | null;
  const [adminSimulatedRole, setAdminSimulatedRole] = useState<UserRole | null>(null);

  // Admin Navigation Sub-tab
  const [adminTab, setAdminTab] = useState<"dashboard" | "cms" | "citas" | "usuarios">(initialTabParam || "dashboard");
  const [userSearch, setUserSearch] = useState("");
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState<{
    fullName: string;
    email: string;
    rut: string;
    phone: string;
    role: UserRole;
    prevision: string;
    password?: string;
  }>({
    fullName: "",
    email: "",
    rut: "",
    phone: "",
    role: "paciente",
    prevision: "Fonasa",
    password: "admin"
  });

  // Patient Sub-tabs
  const [patientTab, setPatientTab] = useState<"citas" | "ficha" | "odontograma" | "convenio">("citas");

  // Clinical data store state
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [clinicalRecords, setClinicalRecords] = useState<ClinicalRecord[]>([]);
  const [odontogram, setOdontogram] = useState<OdontogramTooth[]>([]);

  // Doctor SOAP note form
  const [soapPatient, setSoapPatient] = useState("");
  const [soapDiagnosis, setSoapDiagnosis] = useState("");
  const [soapTreatment, setSoapTreatment] = useState("");
  const [soapPrescription, setSoapPrescription] = useState("");
  const [soapSavedToast, setSoapSavedToast] = useState(false);

  // Reception walk-in modal
  const [showWalkinModal, setShowWalkinModal] = useState(false);
  const [walkinName, setWalkinName] = useState("");
  const [walkinDoctor, setWalkinDoctor] = useState("Dr. Johnny Lugo");
  const [walkinTreatment, setWalkinTreatment] = useState("Consulta de Urgencia Dental");

  // Admin user list
  const [userList, setUserList] = useState<UserProfile[]>([]);

  // 1. Session verification & authentication gate
  useEffect(() => {
    const session = getCurrentSession();
    if (!session) {
      // Unauthenticated access: redirect to login immediately
      router.replace("/login");
      return;
    }

    setCurrentUser(session);
    
    // If the user is an admin, allow role simulation for QA/testing if explicitly passed
    if (session.role === "admin" && initialRoleParam) {
      setActiveRole(initialRoleParam);
      setAdminSimulatedRole(initialRoleParam);
    } else {
      setActiveRole(session.role);
      setAdminSimulatedRole(null);
    }

    setUserList(getRegisteredUsers());
    setSessionLoading(false);
  }, [initialRoleParam, router]);

  // 2. Synchronize clinical store in real-time
  useEffect(() => {
    const syncClinical = () => {
      setAppointments(getStoredAppointments());
      setClinicalRecords(getStoredClinicalRecords());
      setOdontogram(getStoredOdontogram());
    };
    syncClinical();
    window.addEventListener(CLINICAL_CHANGE_EVENT, syncClinical);
    return () => window.removeEventListener(CLINICAL_CHANGE_EVENT, syncClinical);
  }, []);

  // Logout handler
  const handleLogout = () => {
    clearCurrentSession();
    router.replace("/login");
  };

  // Admin Role Simulation Handler (only for Admin)
  const handleAdminSimulateRole = (role: UserRole) => {
    if (currentUser?.role !== "admin") return;
    setActiveRole(role);
    setAdminSimulatedRole(role);
    router.replace(`/portal?role=${role}`);
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
    setTimeout(() => setSoapSavedToast(false), 3000);
  };

  // Walk-in Submit
  const handleWalkinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName) return;

    addStoredAppointment({
      date: "Hoy",
      time: "Ahora (Walk-in)",
      doctorName: walkinDoctor,
      treatmentName: walkinTreatment,
      status: "en_espera",
      box: "Box 1",
      price: 35000,
      convenioDiscount: 14000,
      patientName: walkinName,
      patientPhone: "+56 9 4757 8597"
    });

    setShowWalkinModal(false);
    setWalkinName("");
  };

  // Change Appointment Status
  const handleStatusChange = (id: string, newStatus: PatientAppointment["status"]) => {
    updateStoredAppointmentStatus(id, newStatus);
  };

  // Interactive Odontogram Tooth Click
  const handleToothClick = (tooth: OdontogramTooth) => {
    const statuses: OdontogramTooth["status"][] = ["sano", "caries", "obturado", "corona", "implante", "extraccion_indicada"];
    const currentIdx = statuses.indexOf(tooth.status);
    const nextStatus = statuses[(currentIdx + 1) % statuses.length];
    updateStoredToothStatus(tooth.toothNumber, nextStatus);
  };

  // Admin Change Role
  const handleAdminRoleChange = (userId: string, targetRole: UserRole) => {
    updateUserRole(userId, targetRole);
    setUserList(getRegisteredUsers());
  };

  // Admin Create New User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.email || !newUserData.fullName) return;
    registerNewUser({
      fullName: newUserData.fullName,
      email: newUserData.email,
      password: newUserData.password || "BeHappy2026!",
      rut: newUserData.rut || "11.222.333-4",
      phone: newUserData.phone || "+56 9 1234 5678",
      role: newUserData.role,
      prevision: newUserData.prevision,
    });
    setUserList(getRegisteredUsers());
    setShowNewUserModal(false);
    setNewUserData({
      fullName: "",
      email: "",
      rut: "",
      phone: "",
      role: "paciente",
      prevision: "Fonasa",
      password: "admin"
    });
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
            <Link href="/" className="flex items-center gap-2.5 group">
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
            </Link>

            <span className={`hidden sm:inline-flex px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border ${currentRoleMeta.color}`}>
              {currentRoleMeta.badge}
            </span>
          </div>

          {/* Right Action Block */}
          <div className="flex items-center gap-3">
            
            {/* ADMIN ONLY: Safe Simulation Switcher (strictly hidden from ordinary patients/doctors) */}
            {currentUser.role === "admin" && (
              <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded border border-slate-300/80 text-[11px] font-mono">
                <span className="px-2 text-[10px] uppercase font-bold text-slate-500">Vista:</span>
                {(["paciente", "doctor", "recepcion", "admin"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleAdminSimulateRole(r)}
                    className={`px-2.5 py-1 rounded capitalize transition ${
                      activeRole === r
                        ? "bg-white text-slate-900 font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}

            {/* Authenticated User Identity */}
            <div className="text-right hidden md:block">
              <span className="text-xs font-semibold text-slate-900 block leading-tight">
                {currentUser.fullName}
              </span>
              <span className="text-[10px] font-mono text-slate-500 block">
                {currentUser.rut || currentUser.email}
              </span>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition text-xs font-mono flex items-center gap-1.5 shadow-2xs"
              title="Cerrar sesión de forma segura"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>

        </div>
      </header>

      {/* Admin QA notice if simulating */}
      {currentUser.role === "admin" && adminSimulatedRole && adminSimulatedRole !== "admin" && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs px-4 py-2 text-center font-mono flex items-center justify-center gap-2">
          <span>● MODO AUDITORÍA ADMINISTRATIVA: Estás previsualizando la vista de rol <strong>{adminSimulatedRole.toUpperCase()}</strong>.</span>
          <button
            onClick={() => handleAdminSimulateRole("admin")}
            className="underline font-bold hover:text-black ml-2"
          >
            Volver a Administrador →
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN CLINICAL CONTENT AREA */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
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
                  RUT: {currentUser.rut || "18.452.931-K"} · Previsión: {currentUser.prevision || "Fonasa / Isapre"} · Sede: Suecia 3580, OF. 304, Ñuñoa
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
                  href={createWhatsAppUrl(`Hola Centro Dental BeHappy, soy ${currentUser.fullName} y tengo una consulta sobre mi tratamiento.`)}
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
                  {appointments.length > 0 ? `${appointments[0].date} ${appointments[0].time}` : "Sin citas agendadas"}
                </span>
                <span className="text-[11px] font-mono text-slate-500 block truncate">
                  {appointments.length > 0 ? `${appointments[0].doctorName}` : "Disponible para agendar"}
                </span>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-1 shadow-2xs">
                <span className="text-[10px] font-mono tracking-widest text-slate-500 block uppercase">Ahorro Convenio</span>
                <span className="text-base font-semibold text-emerald-600 block">
                  {(() => {
                    const totalSavings = appointments.reduce((acc, a) => acc + (a.convenioDiscount || 0), 0);
                    return totalSavings > 0 ? `$${totalSavings.toLocaleString("es-CL")} CLP` : "$0 CLP";
                  })()}
                </span>
                <span className="text-[11px] font-mono text-slate-500 block">Bonificación directa aplicada</span>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-1 shadow-2xs">
                <span className="text-[10px] font-mono tracking-widest text-slate-500 block uppercase">Tratamiento Activo</span>
                <span className="text-base font-semibold text-slate-900 block truncate">
                  {appointments.length > 0 ? appointments[0].treatmentName : (clinicalRecords.length > 0 ? clinicalRecords[0].treatmentPerformed : "Sin tratamiento activo")}
                </span>
                <span className="text-[11px] font-mono text-slate-500 block">
                  {appointments.length > 0 ? "En curso clínico" : "Consulta preventiva"}
                </span>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-1 shadow-2xs">
                <span className="text-[10px] font-mono tracking-widest text-slate-500 block uppercase">Estado Bucal</span>
                <span className="text-base font-semibold text-slate-900 block">
                  {clinicalRecords.length > 0 ? "Ficha al día" : "Ingreso Inicial"}
                </span>
                <span className="text-[11px] font-mono text-slate-500 block">
                  {clinicalRecords.length > 0 ? "Control registrado" : "Pendiente de diagnóstico"}
                </span>
              </div>
            </div>

            {/* Sub-Tabs Navigation */}
            <div className="border-b border-slate-200 flex gap-6 text-xs font-mono tracking-wider uppercase">
              <button
                onClick={() => setPatientTab("citas")}
                className={`pb-3 transition ${
                  patientTab === "citas"
                    ? "text-slate-900 border-b-2 border-slate-900 font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                1. Mis Citas ({appointments.length})
              </button>

              <button
                onClick={() => setPatientTab("ficha")}
                className={`pb-3 transition ${
                  patientTab === "ficha"
                    ? "text-slate-900 border-b-2 border-slate-900 font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                2. Ficha Clínica ({clinicalRecords.length})
              </button>

              <button
                onClick={() => setPatientTab("odontograma")}
                className={`pb-3 transition ${
                  patientTab === "odontograma"
                    ? "text-slate-900 border-b-2 border-slate-900 font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                3. Mi Odontograma (32 piezas)
              </button>

              <button
                onClick={() => setPatientTab("convenio")}
                className={`pb-3 transition ${
                  patientTab === "convenio"
                    ? "text-slate-900 border-b-2 border-slate-900 font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                4. Mi Convenio & Beneficios
              </button>
            </div>

            {/* Sub-Tab 1: Mis Citas */}
            {patientTab === "citas" && (
              <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100 shadow-2xs overflow-hidden">
                {appointments.length === 0 ? (
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
                  appointments.map((item) => (
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

                        <a
                          href={createWhatsAppUrl(`Hola Centro Dental BeHappy, deseo coordinar mi cita de ${item.treatmentName} con ${item.doctorName}.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 border border-slate-300 hover:border-slate-800 rounded text-[10px] font-mono uppercase tracking-wider text-slate-700 transition bg-white"
                        >
                          Coordinar por WhatsApp
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Sub-Tab 2: Ficha Clínica */}
            {patientTab === "ficha" && (
              <div className="space-y-4">
                {clinicalRecords.length === 0 ? (
                  <div className="p-12 bg-white border border-slate-200 rounded-lg text-center space-y-3 shadow-2xs">
                    <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
                    <h3 className="text-sm font-semibold text-slate-900">Sin registros clínicos aún</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Tus evaluaciones, diagnósticos odontológicos, evolución de tratamientos y recetas electrónicas se reflejarán aquí una vez atendido por el doctor en box.
                    </p>
                  </div>
                ) : (
                  clinicalRecords.map((rec) => (
                    <div key={rec.id} className="p-6 bg-white border border-slate-200 rounded-lg space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs font-mono">
                        <div>
                          <span className="text-slate-900 font-bold block text-sm">{rec.doctorName}</span>
                          <span className="text-slate-500">{rec.date} · Folio Clínico #{rec.id}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
                          Atención Acreditada
                        </span>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Odontograma Digital Anatómico</h3>
                    <p className="text-xs font-mono text-slate-500">
                      Nomenclatura FDI estándar (32 piezas dentales) · Código visual de tu condición actual
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-800">● Sano</span>
                    <span className="px-2 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-800">● Caries</span>
                    <span className="px-2 py-0.5 rounded border border-blue-200 bg-blue-50 text-blue-800">● Obturado</span>
                    <span className="px-2 py-0.5 rounded border border-purple-200 bg-purple-50 text-purple-800">● Corona</span>
                    <span className="px-2 py-0.5 rounded border border-teal-200 bg-teal-50 text-teal-800">● Implante</span>
                    <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-500">● Extracción</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-11 gap-2.5 pt-2">
                  {odontogram.map((tooth) => {
                    const isHealthy = tooth.status === "sano";
                    const isCaries = tooth.status === "caries";
                    const isObturado = tooth.status === "obturado";
                    const isCorona = tooth.status === "corona";
                    const isImplante = tooth.status === "implante";

                    return (
                      <div
                        key={tooth.toothNumber}
                        className={`p-3 rounded border text-center transition select-none ${
                          isHealthy
                            ? "border-slate-200 bg-slate-50/70 text-slate-700"
                            : isCaries
                            ? "border-amber-300 bg-amber-50/80 text-amber-900"
                            : isObturado
                            ? "border-blue-300 bg-blue-50/80 text-blue-900"
                            : isCorona
                            ? "border-purple-300 bg-purple-50/80 text-purple-900"
                            : isImplante
                            ? "border-teal-300 bg-teal-50/80 text-teal-900"
                            : "border-slate-300 bg-slate-100 line-through text-slate-400"
                        }`}
                      >
                        <span className="text-xs font-mono font-bold block text-slate-900">#{tooth.toothNumber}</span>
                        <span className="text-[9px] font-mono uppercase block tracking-wider mt-1 truncate font-medium">
                          {tooth.status.replace("_", " ")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-Tab 4: Convenio */}
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
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-slate-100 border border-slate-300 shrink-0">
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
                  <p className="text-xs font-mono text-slate-500">{currentUser.specialty || "Cirujano Dentista"}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-slate-500 block">Jornada Clínica Activa</span>
                <span className="text-xs font-semibold text-slate-900">Lunes a Viernes 10:00 - 20:00</span>
              </div>
            </div>

            {/* Daily Agenda Table */}
            <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100 shadow-2xs overflow-hidden">
              <div className="p-4 bg-slate-50 flex items-center justify-between text-xs font-mono">
                <span className="font-bold uppercase text-slate-900">Agenda Médica del Día</span>
                <span className="text-slate-500">Pacientes Citados: {appointments.length}</span>
              </div>

              {appointments.length === 0 ? (
                <div className="p-10 text-center space-y-2">
                  <Clock className="w-6 h-6 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-700 font-semibold">No hay pacientes citados para hoy</p>
                  <p className="text-[11px] font-mono text-slate-500">
                    Las citas agendadas por la web pública o registradas en recepción impactan aquí en tiempo real.
                  </p>
                </div>
              ) : (
                appointments.map((item) => (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">{item.time} hrs</span>
                        <span className="text-sm font-semibold text-slate-900">· {item.patientName}</span>
                        <span className="text-xs font-mono text-slate-500">({item.patientRut || "Sin RUT"})</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 text-slate-700 border border-slate-200">
                          {item.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-light">
                        Procedimiento: <strong className="text-slate-900 font-medium">{item.treatmentName}</strong> · {item.box || "Box 1"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusChange(item.id, "en_box")}
                        className="px-3 py-1.5 rounded border border-slate-300 hover:border-slate-800 text-[11px] font-mono uppercase text-slate-800 transition bg-white"
                      >
                        Pasar a Box
                      </button>
                      <button
                        onClick={() => handleStatusChange(item.id, "completada")}
                        className="px-3 py-1.5 rounded bg-slate-900 text-white font-bold text-[11px] font-mono uppercase transition hover:bg-black"
                      >
                        Finalizar ✓
                      </button>
                    </div>
                  </div>
                ))
              )}
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Odontograma Clínico en Sillón</h3>
                  <p className="text-xs font-mono text-slate-500">
                    Haz clic sobre cualquier pieza para actualizar su estado de atención en tiempo real
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-800">● Sano</span>
                  <span className="px-2 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-800">● Caries</span>
                  <span className="px-2 py-0.5 rounded border border-blue-200 bg-blue-50 text-blue-800">● Obturado</span>
                  <span className="px-2 py-0.5 rounded border border-purple-200 bg-purple-50 text-purple-800">● Corona</span>
                  <span className="px-2 py-0.5 rounded border border-teal-200 bg-teal-50 text-teal-800">● Implante</span>
                  <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-500">● Extracción</span>
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-11 gap-2 pt-1">
                {odontogram.map((tooth) => {
                  const isHealthy = tooth.status === "sano";
                  const isCaries = tooth.status === "caries";
                  const isObturado = tooth.status === "obturado";
                  const isCorona = tooth.status === "corona";
                  const isImplante = tooth.status === "implante";

                  return (
                    <button
                      key={tooth.toothNumber}
                      type="button"
                      onClick={() => handleToothClick(tooth)}
                      title={`Pieza #${tooth.toothNumber}: ${tooth.status} (Clic para rotar estado)`}
                      className={`p-3 rounded border text-center transition cursor-pointer hover:scale-105 select-none ${
                        isHealthy
                          ? "border-slate-200 bg-slate-50/70 hover:border-emerald-500 text-slate-700"
                          : isCaries
                          ? "border-amber-300 bg-amber-50/80 hover:border-amber-500 text-amber-900"
                          : isObturado
                          ? "border-blue-300 bg-blue-50/80 hover:border-blue-500 text-blue-900"
                          : isCorona
                          ? "border-purple-300 bg-purple-50/80 hover:border-purple-500 text-purple-900"
                          : isImplante
                          ? "border-teal-300 bg-teal-50/80 hover:border-teal-500 text-teal-900"
                          : "border-slate-300 bg-slate-100 line-through text-slate-400"
                      }`}
                    >
                      <span className="text-xs font-mono font-bold block text-slate-900">#{tooth.toothNumber}</span>
                      <span className="text-[9px] font-mono uppercase block tracking-wider mt-1 truncate font-medium">
                        {tooth.status.replace("_", " ")}
                      </span>
                    </button>
                  );
                })}
              </div>
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

            {/* Live Flow Table */}
            <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100 shadow-2xs overflow-hidden">
              <div className="p-4 bg-slate-50 flex items-center justify-between text-xs font-mono">
                <span className="font-bold uppercase text-slate-900">Flujo de Pacientes en Sala</span>
                <span className="text-slate-500">Total en Turno: {appointments.length}</span>
              </div>

              {appointments.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <Clock className="w-8 h-8 text-slate-400 mx-auto" />
                  <h3 className="text-sm font-semibold text-slate-900">No hay citas registradas en recepción</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Los pacientes que agenden en la web pública o lleguen directamente a Suecia 3580 se gestionan aquí.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setShowWalkinModal(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs font-mono uppercase tracking-wider rounded transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Registrar Paciente Presencial
                    </button>
                  </div>
                </div>
              ) : (
                appointments.map((item) => (
                  <div key={item.id} className="p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-slate-50/60 transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">{item.patientName}</span>
                        <span className="text-xs font-mono text-slate-500">· {item.patientPhone || "+56 9 4757 8597"}</span>
                        <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-100 text-[10px] font-mono uppercase text-slate-700">
                          {item.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-light">
                        {item.treatmentName} · {item.doctorName} · {item.time} hrs
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={createWhatsAppUrl(`¡Hola ${item.patientName}! Le recordamos su cita de ${item.treatmentName} en BeHappy Ñuñoa para hoy a las ${item.time} hrs. ¿Nos confirma su asistencia?`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded border border-slate-300 hover:border-slate-800 text-xs font-mono uppercase text-slate-800 transition bg-white"
                      >
                        WhatsApp
                      </a>
                      <button
                        onClick={() => handleStatusChange(item.id, "en_espera")}
                        className="px-2.5 py-1.5 rounded border border-slate-300 hover:border-slate-800 text-xs font-mono uppercase text-slate-800 transition bg-white"
                      >
                        Llegó
                      </button>
                      <button
                        onClick={() => handleStatusChange(item.id, "completada")}
                        className="px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-mono uppercase transition shadow-2xs"
                      >
                        Cobrado ✓
                      </button>
                    </div>
                  </div>
                ))
              )}
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
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">Doctor Asignado *</label>
                      <select
                        value={walkinDoctor}
                        onChange={(e) => setWalkinDoctor(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs font-mono"
                      >
                        <option value="Dr. Johnny Lugo">Dr. Johnny Lugo (Ortodoncia)</option>
                        <option value="Dra. Keila Rodríguez González">Dra. Keila Rodríguez González (Estética)</option>
                        <option value="Dr. Juan José Herrera">Dr. Juan José Herrera (Implantes)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">Motivo de Atención *</label>
                      <input
                        type="text"
                        required
                        value={walkinTreatment}
                        onChange={(e) => setWalkinTreatment(e.target.value)}
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
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
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

              {/* Navigation Tabs */}
              <nav className="space-y-1 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setAdminTab("dashboard")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded transition text-left ${
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
                  onClick={() => setAdminTab("cms")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded transition text-left ${
                    adminTab === "cms"
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 shrink-0" />
                    <span>Editor CMS Web</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">
                    VIVO
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminTab("citas")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded transition text-left ${
                    adminTab === "citas"
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>Control de Citas</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{appointments.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminTab("usuarios")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded transition text-left ${
                    adminTab === "usuarios"
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UsersIcon className="w-4 h-4 shrink-0" />
                    <span>Usuarios & Roles</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{userList.length}</span>
                </button>
              </nav>

              {/* Live Web Links */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
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
                  <span>20 Tratamientos</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </aside>

            {/* Admin Main Dynamic Pane */}
            <div className="flex-1 w-full space-y-6">
              
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
                        Métricas consolidadas BeHappy Ñuñoa · Conectado en tiempo real
                      </p>
                    </div>

                    <button
                      onClick={() => setAdminTab("cms")}
                      className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-mono text-xs uppercase tracking-wider rounded font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Abrir Editor CMS Web</span>
                    </button>
                  </div>

                  {/* Real Metrics Grid (Without fake figures) */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-2xs">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">Ingresos del Mes</span>
                      <span className="text-xl font-bold font-mono text-slate-900 block">
                        {(() => {
                          const completed = appointments.filter((a) => a.status === "completada");
                          const total = completed.reduce((acc, a) => acc + ((a.price ?? 35000) - (a.convenioDiscount ?? 0)), 0);
                          return `$${total.toLocaleString("es-CL")} CLP`;
                        })()}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 block">Calculado en tiempo real</span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-2xs">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">Citas Registradas</span>
                      <span className="text-xl font-bold font-mono text-slate-900 block">{appointments.length}</span>
                      <span className="text-[10px] font-mono text-slate-500 block">Agendadas en sistema</span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-2xs">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">Pacientes en Base</span>
                      <span className="text-xl font-bold font-mono text-slate-900 block">{userList.length}</span>
                      <span className="text-[10px] font-mono text-slate-500 block">Fichas activas registradas</span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-2xs">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">Planes Convenio</span>
                      <span className="text-xl font-bold font-mono text-emerald-600 block">
                        {userList.filter((u) => u.convenioLevel).length} Activos
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 block">Con descuento aplicado</span>
                    </div>
                  </div>

                  {/* CMS Fast Jump Banner */}
                  <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">GESTIÓN DE CONTENIDOS EN TIEMPO REAL</span>
                      <h4 className="text-base font-semibold text-slate-900">Edición Directa del Sitio Web Público</h4>
                      <p className="text-xs text-slate-600 font-light max-w-xl">
                        Modifica los 20 tratamientos, 8 doctores del equipo, teléfonos de WhatsApp, cintillos y ofertas de convenios sin tocar código.
                      </p>
                    </div>
                    <button
                      onClick={() => setAdminTab("cms")}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-mono text-xs uppercase tracking-wider rounded font-bold transition flex items-center gap-1.5 shrink-0 shadow-sm"
                    >
                      <span>Ir a Módulo CMS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: SITE CMS EDITOR */}
              {adminTab === "cms" && (
                <div className="space-y-4">
                  <SiteCmsEditor />
                </div>
              )}

              {/* TAB 3: GLOBAL APPOINTMENTS */}
              {adminTab === "citas" && (
                <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100 shadow-xs overflow-hidden">
                  <div className="p-4 bg-slate-50 flex items-center justify-between text-xs font-mono">
                    <span className="font-bold uppercase text-slate-900">Control Global de Citas Médicas</span>
                    <span className="text-slate-500">{appointments.length} Citas Registradas</span>
                  </div>

                  {appointments.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-xs">
                      No hay citas en la base de datos actualmente.
                    </div>
                  ) : (
                    appointments.map((a) => (
                      <div key={a.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 text-sm">{a.patientName}</span>
                            <span className="text-xs font-mono text-slate-500">· {a.treatmentName}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 text-slate-700">
                              {a.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">
                            {a.date} {a.time} · Doctor: {a.doctorName} · {a.patientPhone || "Sin teléfono"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStatusChange(a.id, "completada")}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-[11px] font-mono uppercase rounded transition font-bold"
                          >
                            Marcar Atendida
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 4: USERS & ROLES */}
              {adminTab === "usuarios" && (
                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Buscar usuario por nombre o correo..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-900 focus:bg-white"
                      />
                    </div>

                    <button
                      onClick={() => setShowNewUserModal(true)}
                      className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-mono text-xs uppercase tracking-wider rounded font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Crear Usuario</span>
                    </button>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                        <tr>
                          <th className="p-3">Nombre & RUT</th>
                          <th className="p-3">Correo & Teléfono</th>
                          <th className="p-3">Previsión</th>
                          <th className="p-3">Rol Asignado</th>
                          <th className="p-3 text-right">Modificar Rol</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {userList
                          .filter((u) =>
                            u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
                            u.email.toLowerCase().includes(userSearch.toLowerCase())
                          )
                          .map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50/60 transition">
                              <td className="p-3">
                                <div className="font-semibold text-slate-900">{u.fullName}</div>
                                <div className="text-[10px] text-slate-500">{u.rut || "Sin RUT"}</div>
                              </td>
                              <td className="p-3">
                                <div className="text-slate-800">{u.email}</div>
                                <div className="text-[10px] text-slate-500">{u.phone || "Sin teléfono"}</div>
                              </td>
                              <td className="p-3 text-slate-700">
                                {u.prevision || "Particular"}
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${roleLabels[u.role]?.color || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <select
                                  value={u.role}
                                  onChange={(e) => handleAdminRoleChange(u.id, e.target.value as UserRole)}
                                  className="px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 text-[11px] font-mono focus:outline-none focus:border-slate-900"
                                >
                                  <option value="paciente">Paciente</option>
                                  <option value="doctor">Doctor</option>
                                  <option value="recepcion">Recepción</option>
                                  <option value="admin">Admin</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Modal Create User */}
                  {showNewUserModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                      <div className="bg-white border border-slate-200 rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <h3 className="text-base font-semibold text-slate-900">Crear Nuevo Usuario</h3>
                          <button onClick={() => setShowNewUserModal(false)} className="text-slate-400 hover:text-slate-800">
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">Nombre Completo *</label>
                            <input
                              type="text"
                              required
                              value={newUserData.fullName}
                              onChange={(e) => setNewUserData({ ...newUserData, fullName: e.target.value })}
                              placeholder="Ej: Carolina Morales Silva"
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">Correo Electrónico *</label>
                            <input
                              type="email"
                              required
                              value={newUserData.email}
                              onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                              placeholder="correo@ejemplo.cl"
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs font-mono"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">RUT</label>
                              <input
                                type="text"
                                value={newUserData.rut}
                                onChange={(e) => setNewUserData({ ...newUserData, rut: e.target.value })}
                                placeholder="12.345.678-9"
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">Rol</label>
                              <select
                                value={newUserData.role}
                                onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as UserRole })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs font-mono"
                              >
                                <option value="paciente">Paciente</option>
                                <option value="doctor">Doctor</option>
                                <option value="recepcion">Recepción</option>
                                <option value="admin">Admin</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => setShowNewUserModal(false)}
                              className="px-4 py-2 border border-slate-300 rounded text-xs font-mono uppercase text-slate-600"
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs font-mono uppercase rounded shadow-sm"
                            >
                              Guardar Usuario
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
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
