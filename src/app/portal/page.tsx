"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { DEMO_USERS, INITIAL_APPOINTMENTS, INITIAL_CLINICAL_RECORDS, INITIAL_ODONTOGRAM } from "@/data/portalMockData";
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
  ShieldCheck
} from "lucide-react";

function PortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active role state
  const initialRoleParam = searchParams.get("role") as UserRole | null;
  const initialTabParam = searchParams.get("tab") as "dashboard" | "cms" | "citas" | "usuarios" | null;
  
  const [activeRole, setActiveRole] = useState<UserRole>(initialRoleParam || "paciente");
  const [activeUser, setActiveUser] = useState<UserProfile>(DEMO_USERS[initialRoleParam || "paciente"]);

  // Admin Sidebar Sub-tab
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

  // Local data state
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

  // Admin user role management
  const [userList, setUserList] = useState<UserProfile[]>([]);

  // Load session & users on mount
  useEffect(() => {
    const session = getCurrentSession();
    if (initialRoleParam) {
      setActiveRole(initialRoleParam);
      if (session && session.role === initialRoleParam) {
        setActiveUser(session);
      } else {
        const demo = DEMO_USERS[initialRoleParam] || DEMO_USERS.paciente;
        setActiveUser(demo);
        setCurrentSession(demo);
      }
    } else if (session) {
      setActiveRole(session.role);
      setActiveUser(session);
    }

    const reg = getRegisteredUsers();
    setUserList(reg);
  }, [initialRoleParam]);

  // Sync clinical store (appointments, SOAP records, odontogram) in real-time
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

  // Sync role change
  const handleRoleSwitch = (newRole: UserRole) => {
    setActiveRole(newRole);
    const demo = DEMO_USERS[newRole] || DEMO_USERS.paciente;
    setActiveUser(demo);
    setCurrentSession(demo);
    router.replace(`/portal?role=${newRole}`);
  };

  // Logout handler
  const handleLogout = () => {
    clearCurrentSession();
    router.push("/login");
  };

  // SOAP Save
  const handleSaveSoap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!soapDiagnosis || !soapTreatment) return;

    addStoredClinicalRecord({
      patientId: soapPatient || "Paciente en Consulta",
      doctorName: activeUser.fullName,
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

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#f4f4f6] flex flex-col">
      
      {/* Top Bar with Brand and Architectural Role Switcher */}
      <header className="bg-[#0e0e12] border-b border-[#1f1f26] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white p-0.5 border border-neutral-700">
                <Image
                  src="/images/brand/logo.png"
                  alt="Centro Dental BeHappy"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <span className="font-semibold text-sm tracking-tight text-white block">
                  Centro Dental BeHappy
                </span>
                <span className="text-[10px] font-mono tracking-[0.16em] text-neutral-400 uppercase block">
                  Portal Clínico & Gestión
                </span>
              </div>
            </a>
          </div>

          {/* Architectural Role Switcher Tabs */}
          <div className="flex items-center border border-[#2b2b34] bg-[#141419] p-0.5">
            <button
              onClick={() => handleRoleSwitch("paciente")}
              className={`px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition ${
                activeRole === "paciente"
                  ? "bg-white text-black font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              01 · Paciente
            </button>

            <button
              onClick={() => handleRoleSwitch("doctor")}
              className={`px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition ${
                activeRole === "doctor"
                  ? "bg-white text-black font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              02 · Doctor(a)
            </button>

            <button
              onClick={() => handleRoleSwitch("recepcion")}
              className={`px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition ${
                activeRole === "recepcion"
                  ? "bg-white text-black font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              03 · Recepción
            </button>

            <button
              onClick={() => handleRoleSwitch("admin")}
              className={`px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition ${
                activeRole === "admin"
                  ? "bg-white text-black font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              04 · Admin
            </button>
          </div>

          {/* User profile & exit */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-medium text-white">{activeUser.fullName}</div>
              <div className="text-[10px] font-mono text-neutral-400">
                {activeUser.email} · <span className="uppercase text-neutral-300 font-bold">{activeRole}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 border border-[#2b2b34] bg-[#141419] hover:bg-neutral-800 text-neutral-300 hover:text-white transition text-xs font-mono flex items-center gap-1.5"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Salir</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* ========================================================================= */}
        {/* 1. ROLE: PACIENTE (Client View) */}
        {/* ========================================================================= */}
        {activeRole === "paciente" && (
          <div className="space-y-8">
            
            {/* Patient Header Welcome (Editorial Ledger) */}
            <div className="border border-[#222228] bg-[#121216] p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase block">
                  EXPEDIENTE CLÍNICO · {activeUser.convenioLevel || "CONVENIO BEHAPPY"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-white">
                  {activeUser.fullName}
                </h2>
                <p className="text-xs font-mono text-neutral-400">
                  RUT: {activeUser.rut} · Previsión: {activeUser.prevision} · Sede: Suecia 3580, Ñuñoa
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <a
                  href="/#agendar"
                  className="px-5 py-2.5 bg-white text-black hover:bg-neutral-200 text-xs font-mono tracking-widest uppercase font-bold transition flex items-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Agendar Nueva Hora
                </a>

                <a
                  href={createWhatsAppUrl(`Hola Centro Dental BeHappy, soy ${activeUser.fullName} y tengo una consulta sobre mi tratamiento.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 border border-neutral-700 hover:border-white text-white text-xs font-mono tracking-widest uppercase transition flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Quick KPI Ledger */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 border border-[#222228] bg-[#121216] space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 block uppercase">Próxima Cita</span>
                <span className="text-base font-normal text-white block">
                  {appointments.length > 0 ? `${appointments[0].date} ${appointments[0].time}` : "Sin citas agendadas"}
                </span>
                <span className="text-[11px] font-mono text-neutral-400 block">
                  {appointments.length > 0 ? `${appointments[0].doctorName} (${appointments[0].box || "Box 1"})` : "Disponible para agendar"}
                </span>
              </div>

              <div className="p-5 border border-[#222228] bg-[#121216] space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 block uppercase">Ahorro Convenio</span>
                <span className="text-base font-normal text-emerald-400 block">
                  {(() => {
                    const totalSavings = appointments.reduce((acc, a) => acc + (a.convenioDiscount || 0), 0);
                    return totalSavings > 0 ? `$${totalSavings.toLocaleString("es-CL")} CLP` : "$0 CLP";
                  })()}
                </span>
                <span className="text-[11px] font-mono text-neutral-400 block">Bonificación directa</span>
              </div>

              <div className="p-5 border border-[#222228] bg-[#121216] space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 block uppercase">Tratamiento Activo</span>
                <span className="text-base font-normal text-white block">
                  {appointments.length > 0 ? appointments[0].treatmentName : (clinicalRecords.length > 0 ? clinicalRecords[0].treatmentPerformed : "Sin tratamiento activo")}
                </span>
                <span className="text-[11px] font-mono text-neutral-400 block">
                  {appointments.length > 0 ? "En curso" : "Consulta preventiva"}
                </span>
              </div>

              <div className="p-5 border border-[#222228] bg-[#121216] space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 block uppercase">Estado Bucal</span>
                <span className="text-base font-normal text-white block">
                  {clinicalRecords.length > 0 ? "Ficha al día" : "Ingreso Inicial"}
                </span>
                <span className="text-[11px] font-mono text-neutral-400 block">
                  {clinicalRecords.length > 0 ? "Control registrado" : "Pendiente de diagnóstico"}
                </span>
              </div>
            </div>

            {/* Sub-Tabs */}
            <div className="border-b border-[#222228] flex gap-6 text-xs font-mono tracking-wider uppercase">
              <button
                onClick={() => setPatientTab("citas")}
                className={`pb-3 transition ${
                  patientTab === "citas"
                    ? "text-white border-b-2 border-white font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                01 · Mis Citas
              </button>

              <button
                onClick={() => setPatientTab("ficha")}
                className={`pb-3 transition ${
                  patientTab === "ficha"
                    ? "text-white border-b-2 border-white font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                02 · Ficha Clínica
              </button>

              <button
                onClick={() => setPatientTab("odontograma")}
                className={`pb-3 transition ${
                  patientTab === "odontograma"
                    ? "text-white border-b-2 border-white font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                03 · Odontograma
              </button>

              <button
                onClick={() => setPatientTab("convenio")}
                className={`pb-3 transition ${
                  patientTab === "convenio"
                    ? "text-white border-b-2 border-white font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                04 · Convenio
              </button>
            </div>

            {/* Sub-Tab 1: Mis Citas */}
            {patientTab === "citas" && (
              <div className="border border-[#222228] bg-[#121216] divide-y divide-[#222228]">
                {appointments.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <Calendar className="w-8 h-8 text-neutral-600 mx-auto" />
                    <h3 className="text-sm font-medium text-white">No tienes citas agendadas</h3>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                      Puedes agendar tu hora de evaluación con nuestros especialistas mediante el agendador web o vía WhatsApp oficial.
                    </p>
                    <div className="pt-2">
                      <a
                        href="/#agendar"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Agendar Cita Ahora
                      </a>
                    </div>
                  </div>
                ) : (
                  appointments.slice(0, 3).map((item) => (
                    <div key={item.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{item.treatmentName}</span>
                          <span className="px-2 py-0.5 border border-neutral-700 text-[10px] font-mono uppercase text-neutral-300">
                            {item.status.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 font-light">
                          Especialista: <strong className="text-white font-normal">{item.doctorName}</strong> · Box: {item.box || "Box 1"}
                        </p>
                        <p className="text-xs font-mono text-neutral-400">
                          {item.date} a las {item.time} hrs
                        </p>
                      </div>

                      <div className="text-right flex items-center sm:flex-col gap-2 shrink-0">
                        <div>
                          <span className="text-sm font-mono text-white block">
                            ${((item.price ?? 35000) - (item.convenioDiscount ?? 0)).toLocaleString("es-CL")} CLP
                          </span>
                          {item.convenioDiscount ? (
                            <span className="text-[10px] font-mono text-neutral-400 block line-through">
                              Arancel base: ${item.price?.toLocaleString("es-CL")}
                            </span>
                          ) : null}
                        </div>

                        <a
                          href={createWhatsAppUrl(`Hola Centro Dental BeHappy, deseo consultar por mi cita de ${item.treatmentName} con ${item.doctorName}.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 border border-neutral-700 hover:border-white text-[10px] font-mono uppercase tracking-wider text-neutral-300 transition"
                        >
                          Reagendar
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
                  <div className="p-12 border border-[#222228] bg-[#121216] text-center space-y-3">
                    <Sparkles className="w-8 h-8 text-neutral-600 mx-auto" />
                    <h3 className="text-sm font-medium text-white">Sin registros clínicos aún</h3>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                      Tus evaluaciones, diagnósticos odontológicos, evolución de tratamientos y recetas electrónicas se reflejarán aquí una vez atendido por el doctor en box.
                    </p>
                  </div>
                ) : (
                  clinicalRecords.map((rec) => (
                  <div key={rec.id} className="p-6 border border-[#222228] bg-[#121216] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#222228] pb-3 text-xs font-mono">
                      <div>
                        <span className="text-white font-semibold block">{rec.doctorName}</span>
                        <span className="text-neutral-400">{rec.date} · Folio #{rec.id}</span>
                      </div>
                      <span className="text-neutral-400">Atención Presencial</span>
                    </div>

                    <div className="space-y-2 text-xs text-neutral-300 font-light leading-relaxed">
                      <div>
                        <strong className="text-neutral-400 font-mono uppercase block text-[10px]">Diagnóstico:</strong>
                        <p className="text-sm text-white">{rec.diagnosis}</p>
                      </div>

                      <div>
                        <strong className="text-neutral-400 font-mono uppercase block text-[10px]">Procedimiento Realizado:</strong>
                        <p>{rec.treatmentPerformed}</p>
                      </div>

                      {rec.prescription && (
                        <div className="p-3 border border-[#2b2b34] bg-[#16161d]">
                          <strong className="text-neutral-300 font-mono uppercase block text-[10px]">Indicaciones y Prescripción:</strong>
                          <p className="text-xs text-neutral-300">{rec.prescription}</p>
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
              <div className="p-6 border border-[#222228] bg-[#121216] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-4">
                  <div>
                    <h3 className="text-base font-normal tracking-tight text-white">Odontograma Digital Clínico</h3>
                    <p className="text-xs font-mono text-neutral-400">
                      Nomenclatura FDI estándar (32 piezas) · Haz clic en cualquier pieza para rotar su condición clínica
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                    <span className="px-2 py-0.5 border border-[#2b2b34] bg-[#16161d] text-emerald-400">● Sano</span>
                    <span className="px-2 py-0.5 border border-rose-800 bg-rose-950/40 text-rose-300">● Caries</span>
                    <span className="px-2 py-0.5 border border-blue-800 bg-blue-950/40 text-blue-300">● Obturado</span>
                    <span className="px-2 py-0.5 border border-amber-800 bg-amber-950/40 text-amber-300">● Corona</span>
                    <span className="px-2 py-0.5 border border-purple-800 bg-purple-950/40 text-purple-300">● Implante</span>
                    <span className="px-2 py-0.5 border border-neutral-700 bg-neutral-900 text-neutral-400">● Extracción</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-11 gap-2 pt-2">
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
                        title={`Pieza #${tooth.toothNumber}: ${tooth.status} (Clic para cambiar estado)`}
                        className={`p-3 border text-center transition cursor-pointer hover:scale-105 select-none ${
                          isHealthy
                            ? "border-[#2b2b34] bg-[#16161d] hover:border-emerald-500 text-emerald-400"
                            : isCaries
                            ? "border-rose-700 bg-rose-950/50 hover:border-rose-400 text-rose-200"
                            : isObturado
                            ? "border-blue-700 bg-blue-950/50 hover:border-blue-400 text-blue-200"
                            : isCorona
                            ? "border-amber-700 bg-amber-950/50 hover:border-amber-400 text-amber-200"
                            : isImplante
                            ? "border-purple-700 bg-purple-950/50 hover:border-purple-400 text-purple-200"
                            : "border-neutral-700 bg-neutral-900 line-through text-neutral-500"
                        }`}
                      >
                        <span className="text-xs font-mono font-bold block text-white">#{tooth.toothNumber}</span>
                        <span className="text-[9px] font-mono uppercase block tracking-wider mt-1 truncate">
                          {tooth.status.replace("_", " ")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-Tab 4: Convenio */}
            {patientTab === "convenio" && (
              <div className="p-6 border border-[#222228] bg-[#121216] space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">PLAN ORO ACTIVO</span>
                  <h3 className="text-xl font-normal text-white">Cobertura Dental 40%</h3>
                  <p className="text-xs text-neutral-400 font-light">
                    Suscripción activa con bonificaciones preventivas y aranceles reducidos.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-light">
                  <div className="p-4 border border-[#2b2b34] bg-[#16161d] space-y-1.5">
                    <span className="font-mono text-emerald-400 text-[10px] uppercase font-bold block">100% Bonificado</span>
                    <h4 className="font-medium text-white text-sm">Prevención Anual</h4>
                    <p className="text-neutral-400">2 limpiezas con ultrasonido y radiografías al año sin copago.</p>
                  </div>

                  <div className="p-4 border border-[#2b2b34] bg-[#16161d] space-y-1.5">
                    <span className="font-mono text-neutral-300 text-[10px] uppercase font-bold block">40% Cobertura</span>
                    <h4 className="font-medium text-white text-sm">Ortodoncia & Resinas</h4>
                    <p className="text-neutral-400">Ahorro en alineadores Invisalign y tapaduras estéticas.</p>
                  </div>

                  <div className="p-4 border border-[#2b2b34] bg-[#16161d] space-y-1.5">
                    <span className="font-mono text-neutral-300 text-[10px] uppercase font-bold block">20% Cobertura</span>
                    <h4 className="font-medium text-white text-sm">Cirugía e Implantes</h4>
                    <p className="text-neutral-400">Cobertura en implantes de titanio y extracciones complejas.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. ROLE: DOCTOR (Clinical View) */}
        {/* ========================================================================= */}
        {activeRole === "doctor" && (
          <div className="space-y-8">
            
            {/* Doctor Header */}
            <div className="border border-[#222228] bg-[#121216] p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0">
                  <Image
                    src={activeUser.avatarUrl || "/images/doctors/dr-johnny-lugo.png"}
                    alt={activeUser.fullName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block">
                    CUERPO MÉDICO · ODONTÓLOGO ESPECIALISTA
                  </span>
                  <h2 className="text-2xl font-normal text-white">{activeUser.fullName}</h2>
                  <p className="text-xs font-mono text-neutral-400">{activeUser.specialty}</p>
                </div>
              </div>

              <button
                onClick={() => alert("Horas de box bloqueadas temporalmente en el sistema.")}
                className="px-4 py-2 border border-neutral-700 hover:border-white text-xs font-mono uppercase tracking-wider text-neutral-300 transition"
              >
                Bloquear Horas Pabellón
              </button>
            </div>

            {/* Daily Agenda Table */}
            <div className="border border-[#222228] bg-[#121216] divide-y divide-[#222228]">
              <div className="p-4 bg-[#16161d] flex items-center justify-between text-xs font-mono">
                <span className="font-bold uppercase text-white">Agenda Clínica de Hoy</span>
                <span className="text-neutral-400">Jornada 10:00 - 20:00 hrs</span>
              </div>

              {appointments.length === 0 ? (
                <div className="p-10 text-center space-y-2">
                  <Clock className="w-6 h-6 text-neutral-600 mx-auto" />
                  <p className="text-xs text-neutral-300 font-medium">No hay pacientes citados para hoy</p>
                  <p className="text-[11px] font-mono text-neutral-500">
                    Las citas agendadas por la web o ingresadas en recepción aparecerán aquí en tiempo real.
                  </p>
                </div>
              ) : (
                appointments.map((item) => (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{item.time} hrs</span>
                        <span className="text-sm font-medium text-white">· {item.patientName}</span>
                        <span className="text-xs font-mono text-neutral-400">({item.patientRut || "Sin RUT"})</span>
                      </div>
                      <p className="text-xs text-neutral-400 font-light">
                        Procedimiento: <strong className="text-white font-normal">{item.treatmentName}</strong> · {item.box || "Box 1"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusChange(item.id, "en_box")}
                        className="px-3 py-1.5 border border-neutral-700 hover:border-white text-[11px] font-mono uppercase text-neutral-200 transition"
                      >
                        Pasar a Box
                      </button>
                      <button
                        onClick={() => handleStatusChange(item.id, "completada")}
                        className="px-3 py-1.5 bg-white text-black font-bold text-[11px] font-mono uppercase transition hover:bg-neutral-200"
                      >
                        Finalizar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* SOAP Form */}
            <div className="p-6 border border-[#222228] bg-[#121216] space-y-4">
              <div className="flex items-center justify-between border-b border-[#222228] pb-3">
                <div>
                  <h3 className="text-base font-normal text-white">Evolución Clínica (SOAP)</h3>
                  <p className="text-xs font-mono text-neutral-400">Ingreso a la Ficha Electrónica del Paciente</p>
                </div>
                {soapSavedToast && (
                  <span className="text-xs font-mono text-emerald-400">✓ Guardado en Ficha</span>
                )}
              </div>

              <form onSubmit={handleSaveSoap} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Nombre o RUT del Paciente</label>
                    <input
                      type="text"
                      required
                      value={soapPatient}
                      onChange={(e) => setSoapPatient(e.target.value)}
                      list="soap-patients-list"
                      placeholder="Escriba o seleccione paciente..."
                      className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono placeholder-neutral-500 focus:outline-none focus:border-white"
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
                    <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Diagnóstico (CIE-10)</label>
                    <input
                      type="text"
                      required
                      value={soapDiagnosis}
                      onChange={(e) => setSoapDiagnosis(e.target.value)}
                      placeholder="Ej: K02.1 Caries dentina / K07.2 Maloclusión"
                      className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Procedimiento y Técnica Realizada</label>
                  <textarea
                    rows={3}
                    required
                    value={soapTreatment}
                    onChange={(e) => setSoapTreatment(e.target.value)}
                    placeholder="Descripción clínica: Aislamiento absoluto, resina pieza 1.4..."
                    className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Prescripción e Indicaciones</label>
                  <input
                    type="text"
                    value={soapPrescription}
                    onChange={(e) => setSoapPrescription(e.target.value)}
                    placeholder="Ej: Ibuprofeno 400mg c/8hrs si molestia, reposo relativo"
                    className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-white text-black font-bold font-mono text-xs uppercase tracking-widest hover:bg-neutral-200 transition"
                >
                  Guardar en Ficha
                </button>
              </form>
            </div>

            {/* Doctor Odontogram Quick-Chart */}
            <div className="p-6 border border-[#222228] bg-[#121216] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
                <div>
                  <h3 className="text-base font-normal text-white">Odontograma Clínico en Box</h3>
                  <p className="text-xs font-mono text-neutral-400">
                    Marca las piezas tratadas en esta sesión haciendo clic sobre la pieza dental
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                  <span className="px-2 py-0.5 border border-[#2b2b34] bg-[#16161d] text-emerald-400">● Sano</span>
                  <span className="px-2 py-0.5 border border-rose-800 bg-rose-950/40 text-rose-300">● Caries</span>
                  <span className="px-2 py-0.5 border border-blue-800 bg-blue-950/40 text-blue-300">● Obturado</span>
                  <span className="px-2 py-0.5 border border-amber-800 bg-amber-950/40 text-amber-300">● Corona</span>
                  <span className="px-2 py-0.5 border border-purple-800 bg-purple-950/40 text-purple-300">● Implante</span>
                  <span className="px-2 py-0.5 border border-neutral-700 bg-neutral-900 text-neutral-400">● Extracción</span>
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
                      className={`p-3 border text-center transition cursor-pointer hover:scale-105 select-none ${
                        isHealthy
                          ? "border-[#2b2b34] bg-[#16161d] hover:border-emerald-500 text-emerald-400"
                          : isCaries
                          ? "border-rose-700 bg-rose-950/50 hover:border-rose-400 text-rose-200"
                          : isObturado
                          ? "border-blue-700 bg-blue-950/50 hover:border-blue-400 text-blue-200"
                          : isCorona
                          ? "border-amber-700 bg-amber-950/50 hover:border-amber-400 text-amber-200"
                          : isImplante
                          ? "border-purple-700 bg-purple-950/50 hover:border-purple-400 text-purple-200"
                          : "border-neutral-700 bg-neutral-900 line-through text-neutral-500"
                      }`}
                    >
                      <span className="text-xs font-mono font-bold block text-white">#{tooth.toothNumber}</span>
                      <span className="text-[9px] font-mono uppercase block tracking-wider mt-1 truncate">
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
        {/* 3. ROLE: RECEPCION (Front-Desk View) */}
        {/* ========================================================================= */}
        {activeRole === "recepcion" && (
          <div className="space-y-8">
            <div className="border border-[#222228] bg-[#121216] p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block">
                  RECEPCIÓN & SALA DE ESPERA
                </span>
                <h2 className="text-2xl font-normal text-white">Módulo de Admisión</h2>
                <p className="text-xs font-mono text-neutral-400">Suecia 3580, Ñuñoa</p>
              </div>

              <button
                onClick={() => setShowWalkinModal(true)}
                className="px-4 py-2.5 bg-white text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Paciente Walk-In
              </button>
            </div>

            {/* Live Flow Table */}
            <div className="border border-[#222228] bg-[#121216] divide-y divide-[#222228]">
              {appointments.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <Clock className="w-8 h-8 text-neutral-600 mx-auto" />
                  <h3 className="text-sm font-medium text-white">No hay citas registradas en recepción</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    Los pacientes que agenden en la web o lleguen a la clínica en Suecia 3580 se gestionan aquí.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setShowWalkinModal(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-black font-bold text-xs font-mono uppercase tracking-wider hover:bg-neutral-200 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Registrar Paciente Presencial
                    </button>
                  </div>
                </div>
              ) : (
                appointments.map((item) => (
                  <div key={item.id} className="p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{item.patientName}</span>
                        <span className="text-xs font-mono text-neutral-400">· {item.patientPhone || "+56 9 4757 8597"}</span>
                        <span className="px-2 py-0.5 border border-neutral-700 text-[10px] font-mono uppercase text-neutral-300">
                          {item.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 font-light">
                        {item.treatmentName} · {item.doctorName} · {item.time} hrs
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={createWhatsAppUrl(`¡Hola ${item.patientName}! Le recordamos su cita de ${item.treatmentName} en BeHappy Ñuñoa para hoy a las ${item.time} hrs. ¿Nos confirma su asistencia?`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 border border-neutral-700 hover:border-white text-xs font-mono uppercase text-neutral-200 transition"
                      >
                        WhatsApp
                      </a>
                      <button
                        onClick={() => handleStatusChange(item.id, "en_espera")}
                        className="px-2.5 py-1.5 border border-neutral-700 hover:border-white text-xs font-mono uppercase text-neutral-300 transition"
                      >
                        Llegó
                      </button>
                      <button
                        onClick={() => handleStatusChange(item.id, "completada")}
                        className="px-2.5 py-1.5 bg-white text-black font-bold text-xs font-mono uppercase transition hover:bg-neutral-200"
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
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-[#121216] border border-[#222228] max-w-md w-full p-6 space-y-4">
                  <h3 className="text-base font-normal text-white">Paciente Presencial (Walk-In)</h3>
                  <form onSubmit={handleWalkinSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Nombre Completo</label>
                      <input
                        type="text"
                        required
                        value={walkinName}
                        onChange={(e) => setWalkinName(e.target.value)}
                        placeholder="Ej: Marcelo Vidal Ríos"
                        className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Doctor Asignado</label>
                      <select
                        value={walkinDoctor}
                        onChange={(e) => setWalkinDoctor(e.target.value)}
                        className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
                      >
                        <option value="Dr. Johnny Lugo">Dr. Johnny Lugo (Ortodoncia)</option>
                        <option value="Dra. Keila Rodríguez González">Dra. Keila Rodríguez González (Estética)</option>
                        <option value="Dr. Juan José Herrera">Dr. Juan José Herrera (Implantes)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Motivo</label>
                      <input
                        type="text"
                        value={walkinTreatment}
                        onChange={(e) => setWalkinTreatment(e.target.value)}
                        className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowWalkinModal(false)}
                        className="px-4 py-2 border border-neutral-700 text-xs font-mono uppercase text-neutral-400"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-white text-black font-bold text-xs font-mono uppercase"
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
        {/* 4. ROLE: ADMIN / CEO (Executive Management View with Sidebar CMS) */}
        {/* ========================================================================= */}
        {activeRole === "admin" && (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Admin Sidebar Navigation */}
            <aside className="w-full lg:w-72 shrink-0 bg-[#121216] border border-[#222228] p-5 lg:sticky lg:top-24 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
                    ADMINISTRACIÓN CENTRAL
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Panel de Control
                </h3>
                <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                  Dirección · Centro Dental BeHappy
                </p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-1.5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setAdminTab("dashboard")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 transition text-left ${
                    adminTab === "dashboard"
                      ? "bg-white text-black font-bold shadow-sm"
                      : "text-neutral-300 hover:bg-[#1a1a22] hover:text-white"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Dashboard Ejecutivo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminTab("cms")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 transition text-left ${
                    adminTab === "cms"
                      ? "bg-white text-black font-bold shadow-sm"
                      : "text-neutral-300 hover:bg-[#1a1a22] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 shrink-0" />
                    <span>Editor CMS Web</span>
                  </div>
                  <span
                    className={`text-[9px] px-2 py-0.5 uppercase tracking-wider font-bold ${
                      adminTab === "cms"
                        ? "bg-black text-white"
                        : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    }`}
                  >
                    VIVO
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminTab("citas")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 transition text-left ${
                    adminTab === "citas"
                      ? "bg-white text-black font-bold shadow-sm"
                      : "text-neutral-300 hover:bg-[#1a1a22] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>Control de Citas</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {appointments.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminTab("usuarios")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 transition text-left ${
                    adminTab === "usuarios"
                      ? "bg-white text-black font-bold shadow-sm"
                      : "text-neutral-300 hover:bg-[#1a1a22] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UsersIcon className="w-4 h-4 shrink-0" />
                    <span>Usuarios & Roles</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {userList.length}
                  </span>
                </button>
              </nav>

              {/* Enlace directo a Propuesta Editorial Web */}
              <div className="pt-4 border-t border-[#222228] space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase block font-bold">
                  Documento Comercial
                </span>
                <a
                  href="/propuesta.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs font-mono text-emerald-300 hover:text-white px-2.5 py-2 bg-emerald-950/40 border border-emerald-800/80 hover:bg-emerald-900/60 transition rounded"
                >
                  <span>📄 Editar Propuesta PDF ↗</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Quick links to live public website */}
              <div className="pt-4 border-t border-[#222228] space-y-2.5">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block">
                  Ver Sitio Web en Vivo
                </span>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs font-mono text-neutral-300 hover:text-white px-2.5 py-2 hover:bg-[#1a1a22] transition"
                >
                  <span>Página de Inicio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="/tratamientos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs font-mono text-neutral-300 hover:text-white px-2.5 py-2 hover:bg-[#1a1a22] transition"
                >
                  <span>Los 20 Tratamientos</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="/contacto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs font-mono text-neutral-300 hover:text-white px-2.5 py-2 hover:bg-[#1a1a22] transition"
                >
                  <span>Contacto & Ubicación</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </aside>

            {/* Admin Content Area */}
            <div className="flex-1 w-full min-w-0 space-y-6">

              {/* 1. CMS TAB: Full Live CMS Editor */}
              {adminTab === "cms" && (
                <SiteCmsEditor />
              )}

              {/* 2. DASHBOARD TAB */}
              {adminTab === "dashboard" && (
                <div className="space-y-6">
                  {/* Executive Header Banner */}
                  <div className="border border-[#222228] bg-[#121216] p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block">
                        DIRECCIÓN MÉDICA & ADMINISTRACIÓN CENTRAL
                      </span>
                      <h2 className="text-2xl font-normal text-white">Dashboard Ejecutivo</h2>
                      <p className="text-xs font-mono text-neutral-400">
                        Métricas consolidadas BeHappy Ñuñoa · Conectado en tiempo real
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setAdminTab("cms")}
                        className="px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-mono tracking-wider uppercase font-bold transition flex items-center gap-2"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        Abrir Editor CMS Web
                      </button>
                    </div>
                  </div>

                  {/* Executive KPIs */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 border border-[#222228] bg-[#121216] space-y-1">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase block">Ingresos Mes</span>
                      <span className="text-xl font-mono font-bold text-white block">
                        ${appointments
                          .filter((a) => a.status === "completada" || a.status === "en_box")
                          .reduce((acc, curr) => acc + ((curr.price ?? 35000) - (curr.convenioDiscount ?? 0)), 0)
                          .toLocaleString("es-CL")} CLP
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 block">Calculado en tiempo real</span>
                    </div>

                    <div className="p-5 border border-[#222228] bg-[#121216] space-y-1">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase block">Citas Registradas</span>
                      <span className="text-xl font-mono font-bold text-white block">{appointments.length}</span>
                      <span className="text-[10px] font-mono text-neutral-400 block">Agendadas en sistema</span>
                    </div>

                    <div className="p-5 border border-[#222228] bg-[#121216] space-y-1">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase block">Pacientes en Base</span>
                      <span className="text-xl font-mono font-bold text-white block">
                        {new Set([
                          ...userList.filter((u) => u.role === "paciente").map((u) => u.fullName),
                          ...appointments.map((a) => a.patientName).filter(Boolean)
                        ]).size}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 block">Fichas activas</span>
                    </div>

                    <div className="p-5 border border-[#222228] bg-[#121216] space-y-1">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase block">Planes Convenio</span>
                      <span className="text-xl font-mono font-bold text-white block">
                        {appointments.filter((a) => (a.convenioDiscount ?? 0) > 0).length} Activos
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 block">Con descuento aplicado</span>
                    </div>
                  </div>

                  {/* Operational Status & CMS Banner */}
                  <div className="border border-[#222228] bg-[#121216] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                        GESTIÓN DE CONTENIDOS EN TIEMPO REAL
                      </span>
                      <h4 className="text-base text-white font-medium">
                        Edición Directa del Sitio Web Público
                      </h4>
                      <p className="text-xs text-neutral-400">
                        Modifica los 20 tratamientos, los 8 doctores del equipo, los teléfonos de WhatsApp, los cintillos y las ofertas de convenios sin tocar código.
                      </p>
                    </div>
                    <button
                      onClick={() => setAdminTab("cms")}
                      className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-mono tracking-wider uppercase whitespace-nowrap transition"
                    >
                      Ir a Módulo CMS →
                    </button>
                  </div>
                </div>
              )}

              {/* 3. CITAS TAB */}
              {adminTab === "citas" && (
                <div className="border border-[#222228] bg-[#121216] p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#222228] pb-4">
                    <div>
                      <h3 className="font-normal text-lg text-white">Control General de Citas & Boxes</h3>
                      <p className="text-xs font-mono text-neutral-400 mt-0.5">
                        Supervisión integral de agendas de todos los odontólogos
                      </p>
                    </div>
                    <span className="px-3 py-1 border border-neutral-700 text-xs font-mono text-neutral-300">
                      {appointments.length} Citas Registradas
                    </span>
                  </div>

                  {appointments.length === 0 ? (
                    <div className="p-12 text-center space-y-3">
                      <Calendar className="w-8 h-8 text-neutral-600 mx-auto" />
                      <h3 className="text-sm font-medium text-white">No hay citas registradas en el sistema</h3>
                      <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                        Cuando un paciente agende desde el sitio web o se registre en recepción, aparecerá listado aquí con su estado, doctor asignado y detalle de cobro.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="border-b border-[#222228] text-neutral-400 uppercase">
                          <tr>
                            <th className="py-3 px-3">Paciente</th>
                            <th className="py-3 px-3">Fecha / Hora</th>
                            <th className="py-3 px-3">Doctor & Tratamiento</th>
                            <th className="py-3 px-3">Box</th>
                            <th className="py-3 px-3">Total</th>
                            <th className="py-3 px-3">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#222228]">
                          {appointments.map((a) => (
                            <tr key={a.id} className="hover:bg-[#18181f] transition">
                              <td className="py-3.5 px-3">
                                <div className="font-medium text-white">{a.patientName || "Paciente Registrado"}</div>
                                <div className="text-[10px] text-neutral-400">{a.patientPhone || "+56 9 4757 8597"}</div>
                              </td>
                              <td className="py-3.5 px-3">
                                <div className="text-white">{a.date}</div>
                                <div className="text-[10px] text-neutral-400">{a.time}</div>
                              </td>
                              <td className="py-3.5 px-3">
                                <div className="text-white">{a.treatmentName}</div>
                                <div className="text-[10px] text-neutral-400">{a.doctorName}</div>
                              </td>
                              <td className="py-3.5 px-3 text-neutral-300 font-bold">{a.box}</td>
                              <td className="py-3.5 px-3 text-emerald-400 font-bold">
                                ${((a.price ?? 35000) - (a.convenioDiscount ?? 0)).toLocaleString("es-CL")}
                              </td>
                              <td className="py-3.5 px-3">
                                <select
                                  value={a.status}
                                  onChange={(e) => handleStatusChange(a.id, e.target.value as PatientAppointment["status"])}
                                  className="px-2.5 py-1 bg-[#18181f] border border-[#2b2b34] text-white text-[11px]"
                                >
                                  <option value="confirmada">Confirmada</option>
                                  <option value="en_espera">En Espera</option>
                                  <option value="en_box">En Box</option>
                                  <option value="completada">Completada</option>
                                  <option value="cancelada">Cancelada</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* 4. USUARIOS TAB */}
              {adminTab === "usuarios" && (
                <div className="border border-[#222228] bg-[#121216] p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#222228] pb-4">
                    <div>
                      <h3 className="font-normal text-lg text-white">Segmentación y Control de Roles</h3>
                      <p className="text-xs font-mono text-neutral-400 mt-0.5">
                        Administración de cuentas con acceso al portal (Admin, Doctor, Recepción, Paciente)
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowNewUserModal(true)}
                      className="px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-mono tracking-wider uppercase font-bold transition flex items-center gap-2"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      + Nuevo Usuario
                    </button>
                  </div>

                  {/* Search Filter */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                      <input
                        type="text"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder="Buscar por nombre, email o RUT..."
                        className="w-full pl-9 pr-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>
                    <span className="text-xs font-mono text-neutral-400 shrink-0">
                      {userList.length} registrados
                    </span>
                  </div>

                  {/* Users Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="border-b border-[#222228] text-neutral-400 uppercase">
                        <tr>
                          <th className="py-2.5 px-3">Usuario</th>
                          <th className="py-2.5 px-3">RUT</th>
                          <th className="py-2.5 px-3">Rol Asignado</th>
                          <th className="py-2.5 px-3">Detalle</th>
                          <th className="py-2.5 px-3 text-right">Modificar Rol</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#222228]">
                        {userList
                          .filter((u) => {
                            if (!userSearch) return true;
                            const query = userSearch.toLowerCase();
                            return (
                              u.fullName.toLowerCase().includes(query) ||
                              u.email.toLowerCase().includes(query) ||
                              (u.rut && u.rut.toLowerCase().includes(query))
                            );
                          })
                          .map((usr) => (
                            <tr key={usr.id} className="hover:bg-[#18181f] transition">
                              <td className="py-3 px-3">
                                <div className="font-medium text-white">{usr.fullName}</div>
                                <div className="text-[10px] text-neutral-400">{usr.email}</div>
                              </td>
                              <td className="py-3 px-3 text-neutral-300">{usr.rut}</td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 border uppercase text-[10px] font-bold ${
                                  usr.role === "admin"
                                    ? "bg-purple-950/60 border-purple-700 text-purple-300"
                                    : usr.role === "doctor"
                                    ? "bg-blue-950/60 border-blue-700 text-blue-300"
                                    : usr.role === "recepcion"
                                    ? "bg-amber-950/60 border-amber-700 text-amber-300"
                                    : "bg-neutral-800 border-neutral-700 text-neutral-300"
                                }`}>
                                  {usr.role}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-neutral-400">
                                {usr.specialty || usr.prevision || "Convenio BeHappy"}
                              </td>
                              <td className="py-3 px-3 text-right">
                                <select
                                  value={usr.role}
                                  onChange={(e) => handleAdminRoleChange(usr.id, e.target.value as UserRole)}
                                  className="px-2 py-1 bg-[#18181f] border border-[#2b2b34] text-white text-[11px]"
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
                </div>
              )}

            </div>

            {/* Create New User Modal */}
            {showNewUserModal && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-[#121216] border border-[#222228] max-w-md w-full p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#222228] pb-3">
                    <h3 className="text-base font-normal text-white">Registrar Nuevo Usuario / Rol</h3>
                    <button
                      onClick={() => setShowNewUserModal(false)}
                      className="text-neutral-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateUser} className="space-y-3 font-mono text-xs">
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 mb-1">Nombre Completo *</label>
                      <input
                        type="text"
                        required
                        value={newUserData.fullName}
                        onChange={(e) => setNewUserData({ ...newUserData, fullName: e.target.value })}
                        placeholder="Ej: Dr. Roberto Gómez"
                        className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 mb-1">Correo Electrónico *</label>
                      <input
                        type="email"
                        required
                        value={newUserData.email}
                        onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                        placeholder="usuario@behappydental.cl"
                        className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 mb-1">RUT</label>
                        <input
                          type="text"
                          value={newUserData.rut}
                          onChange={(e) => setNewUserData({ ...newUserData, rut: e.target.value })}
                          placeholder="18.990.221-5"
                          className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 mb-1">Teléfono</label>
                        <input
                          type="tel"
                          value={newUserData.phone}
                          onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                          placeholder="+56 9 8899 7766"
                          className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 mb-1">Rol a Asignar *</label>
                        <select
                          value={newUserData.role}
                          onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as UserRole })}
                          className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                        >
                          <option value="paciente">Paciente</option>
                          <option value="doctor">Doctor</option>
                          <option value="recepcion">Recepción</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 mb-1">Previsión / Detalle</label>
                        <input
                          type="text"
                          value={newUserData.prevision}
                          onChange={(e) => setNewUserData({ ...newUserData, prevision: e.target.value })}
                          placeholder="Fonasa / Isapre"
                          className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 mb-1">Contraseña</label>
                      <input
                        type="password"
                        value={newUserData.password}
                        onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                        placeholder="admin"
                        className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-2.5 pt-3 border-t border-[#222228]">
                      <button
                        type="button"
                        onClick={() => setShowNewUserModal(false)}
                        className="px-4 py-2 border border-neutral-700 text-xs font-mono uppercase text-neutral-400 hover:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-white text-black font-bold text-xs font-mono uppercase hover:bg-neutral-200"
                      >
                        Crear y Activar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

    </div>
  );
}

export default function PortalPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#faf8f5] text-[#141413] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-6 h-6 border-2 border-[#141413] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono uppercase tracking-widest text-[#78736a]">Cargando portal clínico...</p>
          </div>
        </div>
      }
    >
      <PortalContent />
    </React.Suspense>
  );
}
