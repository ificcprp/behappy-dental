"use client";

import React, { useState, useEffect } from "react";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { DOCTORS } from "@/data/doctors";
import { toast } from "sonner";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Server,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  Info
} from "lucide-react";

interface SlotItem {
  id_dentista: number;
  id_sucursal: number;
  id_sillon: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
}

export function DentalinkIntegrationPanel() {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("all");
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "live" | "preview" | "error">("checking");
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [lastCheckTime, setLastCheckTime] = useState<string>("");

  const checkAvailability = async (date: string, docId?: string) => {
    setLoading(true);
    try {
      const url = new URL("/api/dentalink/disponibilidad", window.location.origin);
      url.searchParams.set("fecha", date);
      if (docId && docId !== "all") {
        url.searchParams.set("id_dentista", docId);
      }

      const res = await fetch(url.toString());
      const data = await res.json();

      if (res.ok && data.success) {
        setSlots(data.slots || []);
        setConnectionStatus(data.source === "dentalink_live_api" ? "live" : "preview");
        setLastCheckTime(new Date().toLocaleTimeString("es-CL"));
      } else {
        setConnectionStatus("error");
        toast.error(data.error || "No fue posible verificar disponibilidad.");
      }
    } catch (err) {
      setConnectionStatus("error");
      toast.error("Error de conexión al consultar el endpoint de Dentalink.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAvailability(selectedDate, selectedDoctorId);
  }, []);

  return (
    <div className="space-y-6">
      {/* Official Architecture Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-blue-700 uppercase font-bold">
              PROTOCOLO PRIMARIO CLINICAL HEADLESS
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Integración Dentalink (HealthAtom Cloud)
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Sincronización bidireccional entre BeHappy Web y el software clínico maestro de Suecia 3580
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={CLINIC_INFO.dentalink?.agendaUrl || "https://00b229f2077285343f1ffac76fd853c23816acec.agenda.softwaredentalink.com/"}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-mono uppercase tracking-wider rounded font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <span>Agenda Dentalink Oficial</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Legal & Architectural Clarity Notice (No duplicates/orphans) */}
      <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-5 flex items-start gap-3.5 text-xs text-blue-900 font-light">
        <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-blue-950">
            Separación Estricta de Responsabilidades (Cumplimiento Ley 20.584 de Chile):
          </p>
          <p className="text-blue-800">
            <strong>Dentalink es la Fuente Única Oficial</strong> para la Ficha Clínica Electrónica, Odontograma definitivo en sillón, emisión de Boletas Electrónicas SII (DTE) y liquidaciones médicas. 
            El motor de <strong>BeHappy Web opera como Front-Office</strong>: capta pacientes por campañas digitales (Google/Meta), califica mediante triaje e inyecta reservas automáticamente en la agenda de los sillones.
          </p>
        </div>
      </div>

      {/* Real Connection Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-2 shadow-2xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Estado del Enlace API</span>
          <div className="flex items-center gap-2">
            {connectionStatus === "live" ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-base font-bold font-mono text-emerald-700">LIVE (En Línea)</span>
              </>
            ) : connectionStatus === "preview" ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-base font-bold font-mono text-amber-700">MODO PREVIEW</span>
              </>
            ) : connectionStatus === "checking" ? (
              <span className="text-sm font-mono text-slate-500">Verificando...</span>
            ) : (
              <span className="text-base font-bold font-mono text-red-600">Error Conexión</span>
            )}
          </div>
          <span className="text-[10px] font-mono text-slate-500 block">
            {connectionStatus === "live"
              ? "Token validado con HealthAtom"
              : "Operando con fallback seguro"}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-2xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Sucursal Asignada</span>
          <span className="text-lg font-bold font-mono text-slate-900 block">Sucursal #1</span>
          <span className="text-[10px] font-mono text-slate-500 block">Suecia 3580, Ñuñoa (3 Boxes)</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-2xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Slots Libres Detectados</span>
          <span className="text-lg font-bold font-mono text-slate-900 block">
            {loading ? "..." : `${slots.length} Disponibles`}
          </span>
          <span className="text-[10px] font-mono text-slate-500 block">Para fecha seleccionada</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-2xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Último Ping</span>
          <span className="text-base font-bold font-mono text-slate-900 block">
            {lastCheckTime || "Sin verificar"}
          </span>
          <span className="text-[10px] font-mono text-slate-500 block">Latencia estimada &lt; 250ms</span>
        </div>
      </div>

      {/* Interactive Slot Tester */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Verificador de Disponibilidad en Tiempo Real
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Consulta en vivo de sillones vacíos en Dentalink vía GET /api/dentalink/disponibilidad
            </p>
          </div>

          <button
            type="button"
            onClick={() => checkAvailability(selectedDate, selectedDoctorId)}
            disabled={loading}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-mono uppercase font-bold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Consultar Ahora</span>
          </button>
        </div>

        {/* Date and Doctor Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">
              Fecha de Consulta *
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                checkAvailability(e.target.value, selectedDoctorId);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">
              Odontólogo de BeHappy
            </label>
            <select
              value={selectedDoctorId}
              onChange={(e) => {
                setSelectedDoctorId(e.target.value);
                checkAvailability(selectedDate, e.target.value);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white"
            >
              <option value="all">Todos los Odontólogos de la Sede</option>
              {DOCTORS.map((doc, idx) => (
                <option key={doc.id} value={String(idx + 1)}>
                  {doc.name} ({doc.specialty})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Available Slots Grid */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>Sillones y Horarios Retornados por Dentalink:</span>
            <span>{slots.length} franjas encontradas</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs font-mono text-slate-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
              <span>Consultando agenda de Dentalink Cloud...</span>
            </div>
          ) : slots.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded border border-slate-200 space-y-1">
              <Calendar className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-700">Sin slots disponibles en esta fecha</p>
              <p className="text-[11px] font-mono text-slate-500">
                Selecciona otra fecha o verifica los bloqueos de agenda en el panel clásico de Dentalink.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {slots.map((s, idx) => (
                <div
                  key={`${s.fecha}-${s.hora_inicio}-${idx}`}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-center transition"
                >
                  <span className="text-xs font-mono font-bold text-slate-900 block">
                    {s.hora_inicio} hrs
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 block">
                    Sillón #{s.id_sillon || 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Token & Configuration Reference Box */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-xs">
        <h4 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900">
          Credenciales y Variables de Entorno del Engine
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase text-slate-500 block">DENTALINK_API_TOKEN</span>
            <span className="font-semibold text-slate-800">
              {connectionStatus === "live" ? "•••••••••••• (Configurado)" : "Modo Preview (No configurado)"}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase text-slate-500 block">DENTALINK_SUCURSAL_ID</span>
            <span className="font-semibold text-slate-800">1 (Centro Dental BeHappy)</span>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase text-slate-500 block">DENTALINK_TIMEOUT_MS</span>
            <span className="font-semibold text-slate-800">8000 ms (Con fallback WhatsApp)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
