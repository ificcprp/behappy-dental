"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { DEMO_USERS, INITIAL_APPOINTMENTS, INITIAL_CLINICAL_RECORDS, INITIAL_ODONTOGRAM } from "@/data/portalMockData";
import { UserRole, UserProfile, PatientAppointment, ClinicalRecord, OdontogramTooth } from "@/types/auth";
import { createWhatsAppUrl } from "@/data/clinicInfo";
import {
  Calendar,
  CheckCircle2,
  Plus,
  MessageCircle,
  LogOut,
  ArrowRight
} from "lucide-react";

function PortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active role state
  const initialRoleParam = searchParams.get("role") as UserRole | null;
  const [activeRole, setActiveRole] = useState<UserRole>(initialRoleParam || "paciente");
  const [activeUser, setActiveUser] = useState<UserProfile>(DEMO_USERS[initialRoleParam || "paciente"]);

  // Patient Sub-tabs
  const [patientTab, setPatientTab] = useState<"citas" | "ficha" | "odontograma" | "convenio">("citas");

  // Local data state
  const [appointments, setAppointments] = useState<PatientAppointment[]>(INITIAL_APPOINTMENTS);
  const [clinicalRecords, setClinicalRecords] = useState<ClinicalRecord[]>(INITIAL_CLINICAL_RECORDS);
  const [odontogram, setOdontogram] = useState<OdontogramTooth[]>(INITIAL_ODONTOGRAM);

  // Doctor SOAP note form
  const [soapPatient, setSoapPatient] = useState("Constanza Valenzuela Morales");
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
  const [userList, setUserList] = useState<UserProfile[]>([
    DEMO_USERS.paciente,
    DEMO_USERS.doctor,
    DEMO_USERS.recepcion,
    DEMO_USERS.admin,
    {
      id: "usr_05",
      email: "matias.alarcon@gmail.com",
      fullName: "Matías Alarcón Ramos",
      rut: "20.184.920-5",
      phone: "+56 9 7721 9402",
      role: "paciente",
      prevision: "Fonasa",
      convenioLevel: "20%",
      createdAt: "2025-02-10"
    }
  ]);

  // Sync role change
  const handleRoleSwitch = (newRole: UserRole) => {
    setActiveRole(newRole);
    setActiveUser(DEMO_USERS[newRole]);
    router.replace(`/portal?role=${newRole}`);
  };

  // SOAP Save
  const handleSaveSoap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!soapDiagnosis || !soapTreatment) return;

    const newRecord: ClinicalRecord = {
      id: `rec-${Date.now()}`,
      patientId: "usr_paciente_01",
      doctorName: activeUser.fullName,
      date: new Date().toISOString().split("T")[0],
      diagnosis: soapDiagnosis,
      treatmentPerformed: soapTreatment,
      prescription: soapPrescription,
      nextStep: "Control en 15 días"
    };

    setClinicalRecords([newRecord, ...clinicalRecords]);
    setSoapDiagnosis("");
    setSoapTreatment("");
    setSoapPrescription("");
    setSoapSavedToast(true);
    setTimeout(() => setSoapSavedToast(false), 3000);
  };

  // Walk-in Submit
  const handleWalkinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName) return;

    const newAppointment: PatientAppointment = {
      id: `cita-${Date.now()}`,
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
    };

    setAppointments([newAppointment, ...appointments]);
    setShowWalkinModal(false);
    setWalkinName("");
  };

  // Change Appointment Status
  const handleStatusChange = (id: string, newStatus: PatientAppointment["status"]) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  // Admin Change Role
  const handleAdminRoleChange = (userId: string, targetRole: UserRole) => {
    setUserList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: targetRole } : u))
    );
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
            <div className="text-right hidden lg:block">
              <div className="text-xs font-medium text-white">{activeUser.fullName}</div>
              <div className="text-[10px] font-mono text-neutral-400">{activeUser.email}</div>
            </div>
            <a
              href="/"
              className="p-2 border border-[#2b2b34] bg-[#141419] hover:bg-neutral-800 text-neutral-300 hover:text-white transition"
              title="Volver a la web pública"
            >
              <LogOut className="w-3.5 h-3.5" />
            </a>
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
                  EXPEDIENTE CLÍNICO Nº {activeUser.rut} · CONVENIO ACTIVO 40%
                </span>
                <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-white">
                  {activeUser.fullName}
                </h2>
                <p className="text-xs font-mono text-neutral-400">
                  Previsión: {activeUser.prevision} · Sede: Suecia 3580, Ñuñoa · Ficha activa
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
                <span className="text-base font-normal text-white block">Hoy 10:30 hrs</span>
                <span className="text-[11px] font-mono text-neutral-400 block">Dr. Johnny Lugo (Box 1)</span>
              </div>

              <div className="p-5 border border-[#222228] bg-[#121216] space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 block uppercase">Ahorro Convenio</span>
                <span className="text-base font-normal text-emerald-400 block">$184.000 CLP</span>
                <span className="text-[11px] font-mono text-neutral-400 block">En ortodoncia & profilaxis</span>
              </div>

              <div className="p-5 border border-[#222228] bg-[#121216] space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 block uppercase">Tratamiento Activo</span>
                <span className="text-base font-normal text-purple-300 block">Invisalign®</span>
                <span className="text-[11px] font-mono text-neutral-400 block">Alineador 14 de 24</span>
              </div>

              <div className="p-5 border border-[#222228] bg-[#121216] space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 block uppercase">Estado Bucal</span>
                <span className="text-base font-normal text-white block">Saludable</span>
                <span className="text-[11px] font-mono text-neutral-400 block">Control semestral al día</span>
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
                {appointments.slice(0, 3).map((item) => (
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
                          ${(item.price! - item.convenioDiscount!).toLocaleString("es-CL")} CLP
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 block line-through">
                          Arancel base: ${item.price?.toLocaleString("es-CL")}
                        </span>
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
                ))}
              </div>
            )}

            {/* Sub-Tab 2: Ficha Clínica */}
            {patientTab === "ficha" && (
              <div className="space-y-4">
                {clinicalRecords.map((rec) => (
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
                ))}
              </div>
            )}

            {/* Sub-Tab 3: Odontograma */}
            {patientTab === "odontograma" && (
              <div className="p-6 border border-[#222228] bg-[#121216] space-y-6">
                <div>
                  <h3 className="text-base font-normal tracking-tight text-white">Odontograma Digital</h3>
                  <p className="text-xs font-mono text-neutral-400">Esquema clínico de piezas tratadas</p>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-2 pt-2">
                  {odontogram.map((tooth) => (
                    <div
                      key={tooth.toothNumber}
                      className={`p-3 border text-center transition ${
                        tooth.status === "sano"
                          ? "border-[#2b2b34] bg-[#16161d]"
                          : "border-neutral-500 bg-[#202028] text-white"
                      }`}
                    >
                      <span className="text-xs font-mono font-bold block text-white">#{tooth.toothNumber}</span>
                      <span className="text-[9px] font-mono uppercase block tracking-wider mt-1 text-neutral-400">
                        {tooth.status}
                      </span>
                    </div>
                  ))}
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
                    <span className="font-mono text-purple-300 text-[10px] uppercase font-bold block">40% Descuento</span>
                    <h4 className="font-medium text-white text-sm">Ortodoncia & Resinas</h4>
                    <p className="text-neutral-400">Ahorro en alineadores Invisalign y tapaduras estéticas.</p>
                  </div>

                  <div className="p-4 border border-[#2b2b34] bg-[#16161d] space-y-1.5">
                    <span className="font-mono text-sky-300 text-[10px] uppercase font-bold block">20% Descuento</span>
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

              {appointments.map((item) => (
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
              ))}
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
                    <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">Paciente Citado</label>
                    <select
                      value={soapPatient}
                      onChange={(e) => setSoapPatient(e.target.value)}
                      className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
                    >
                      <option value="Constanza Valenzuela Morales">Constanza Valenzuela Morales (18.492.381-4)</option>
                      <option value="Matías Alarcón Ramos">Matías Alarcón Ramos (20.184.920-5)</option>
                    </select>
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
              {appointments.map((item) => (
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
              ))}
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
        {/* 4. ROLE: ADMIN / CEO (Executive Management View) */}
        {/* ========================================================================= */}
        {activeRole === "admin" && (
          <div className="space-y-8">
            <div className="border border-[#222228] bg-[#121216] p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block">
                  DIRECCIÓN MÉDICA & ADMINISTRACIÓN CENTRAL
                </span>
                <h2 className="text-2xl font-normal text-white">Dashboard Ejecutivo</h2>
                <p className="text-xs font-mono text-neutral-400">Métricas consolidadas BeHappy Ñuñoa</p>
              </div>

              <span className="px-3 py-1 border border-neutral-700 text-[10px] font-mono uppercase text-neutral-300">
                Sistema Operativo · 2026
              </span>
            </div>

            {/* Executive KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 border border-[#222228] bg-[#121216] space-y-1">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Ingresos Mes</span>
                <span className="text-xl font-mono font-bold text-white block">$8.450.000 CLP</span>
                <span className="text-[10px] font-mono text-emerald-400 block">+14% vs anterior</span>
              </div>

              <div className="p-5 border border-[#222228] bg-[#121216] space-y-1">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Citas del Mes</span>
                <span className="text-xl font-mono font-bold text-white block">142</span>
                <span className="text-[10px] font-mono text-neutral-400 block">94% asistencia</span>
              </div>

              <div className="p-5 border border-[#222228] bg-[#121216] space-y-1">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Nuevos Pacientes</span>
                <span className="text-xl font-mono font-bold text-white block">+38</span>
                <span className="text-[10px] font-mono text-neutral-400 block">Captación orgánica & Meta</span>
              </div>

              <div className="p-5 border border-[#222228] bg-[#121216] space-y-1">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Planes Convenio</span>
                <span className="text-xl font-mono font-bold text-white block">76 Activos</span>
                <span className="text-[10px] font-mono text-neutral-400 block">Retención 18 meses</span>
              </div>
            </div>

            {/* User & Role Management Table */}
            <div className="border border-[#222228] bg-[#121216] p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#222228] pb-3">
                <h3 className="font-normal text-base text-white">Segmentación y Control de Roles de Usuario</h3>
                <span className="text-xs font-mono text-neutral-400">{userList.length} usuarios registrados</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b border-[#222228] text-neutral-400 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Usuario</th>
                      <th className="py-2.5 px-3">RUT</th>
                      <th className="py-2.5 px-3">Rol Asignado</th>
                      <th className="py-2.5 px-3">Detalle</th>
                      <th className="py-2.5 px-3 text-right">Modificar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222228]">
                    {userList.map((usr) => (
                      <tr key={usr.id} className="hover:bg-[#18181f] transition">
                        <td className="py-3 px-3">
                          <div className="font-medium text-white">{usr.fullName}</div>
                          <div className="text-[10px] text-neutral-400">{usr.email}</div>
                        </td>
                        <td className="py-3 px-3 text-neutral-300">{usr.rut}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 border border-neutral-700 uppercase text-[10px]">
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
        <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono uppercase text-neutral-400">Cargando portal...</p>
          </div>
        </div>
      }
    >
      <PortalContent />
    </React.Suspense>
  );
}
