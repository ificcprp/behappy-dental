"use client";

import React, { useState } from "react";
import { TREATMENTS } from "@/data/treatments";
import { DOCTORS } from "@/data/doctors";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface BookingFormProps {
  initialDoctorId?: string;
  initialTreatmentId?: string;
}

export function AppointmentBookingSection({ initialDoctorId, initialTreatmentId }: BookingFormProps) {
  const [selectedTreatment, setSelectedTreatment] = useState(initialTreatmentId || "revision-dental");
  const [selectedDoctor, setSelectedDoctor] = useState(initialDoctorId || "any");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredSlot, setPreferredSlot] = useState("tarde");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedData, setConfirmedData] = useState<{ whatsappUrl: string; name: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim()) {
      toast.error("Por favor ingrese su nombre completo.");
      return;
    }

    if (!patientPhone.trim() || patientPhone.trim().length < 8) {
      toast.error("Por favor ingrese un número de teléfono o WhatsApp válido.");
      return;
    }

    setIsSubmitting(true);

    try {
      const treatmentObj = TREATMENTS.find((t) => t.id === selectedTreatment);
      const doctorObj = DOCTORS.find((d) => d.id === selectedDoctor);

      const payload = {
        patient_name: patientName,
        patient_phone: patientPhone.startsWith("+56") ? patientPhone : `+56 9 ${patientPhone.replace(/\D/g, "")}`,
        patient_email: patientEmail || null,
        doctor_id: doctorObj ? doctorObj.id : null,
        doctor_name: doctorObj ? doctorObj.name : "Primer especialista disponible",
        treatment_id: selectedTreatment,
        treatment_name: treatmentObj ? treatmentObj.name : "Evaluación General",
        preferred_date: preferredDate || null,
        preferred_time_slot: preferredSlot === "manana" ? "Mañana (10:00 - 14:00)" : "Tarde (14:00 - 20:00)",
        notes: notes || null,
        utm_source: "web_booking_engine",
      };

      const res = await fetch("/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al procesar la cita");
      }

      toast.success("¡Solicitud registrada correctamente!");
      setConfirmedData({
        whatsappUrl: data.whatsappUrl,
        name: patientName,
      });

      // Redirect directly to WhatsApp after confirmation
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank");
      }
    } catch (err: any) {
      toast.error(err.message || "Ocurrió un error al enviar su solicitud");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="agendar" className="py-24 bg-[#faf8f5] text-[#141413] border-b border-[#e5e0d5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono tracking-[0.22em] text-[#78736a] uppercase block">
            MESA DE AGENDAMIENTO · ATENCIÓN PRESENCIAL
          </span>
          <h2 className="text-3xl sm:text-5xl font-normal tracking-[-0.03em] text-[#141413]">
            Reserva tu Cita de Evaluación
          </h2>
          <p className="text-sm sm:text-base text-[#66635d] font-light max-w-2xl leading-relaxed">
            Complete el formulario para ingresar su requerimiento en el sistema de recepción. Confirmación inmediata vía WhatsApp y respaldo en base de datos clínica.
          </p>
        </div>

        {/* Confirmation State */}
        {confirmedData ? (
          <div className="border border-[#141413] bg-white p-8 sm:p-12 text-center space-y-6">
            <div className="w-12 h-12 bg-[#141413] text-[#faf8f5] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-normal tracking-tight text-[#141413]">
                Solicitud Registrada, {confirmedData.name}
              </h3>
              <p className="text-[#66635d] text-sm max-w-md mx-auto font-light leading-relaxed">
                Su requerimiento ha quedado ingresado en recepción de Centro Dental BeHappy. Para coordinar el box y horario definitivo al instante:
              </p>
            </div>

            <div className="pt-2">
              <a
                href={confirmedData.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#141413] text-[#faf8f5] hover:bg-black text-xs font-mono tracking-widest uppercase font-bold transition"
              >
                <MessageCircle className="w-4 h-4" />
                Confirmar Hora por WhatsApp Ahora
              </a>
            </div>

            <button
              onClick={() => {
                setConfirmedData(null);
                setPatientName("");
                setPatientPhone("");
                setNotes("");
              }}
              className="text-xs font-mono tracking-wider text-[#78736a] hover:text-[#141413] underline block mx-auto"
            >
              Registrar otra cita
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="border border-[#e5e0d5] bg-white p-8 sm:p-10 space-y-8">
            
            {/* Step 1: Tratamiento y Doctor */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block border-b border-[#f0ede6] pb-2">
                01 · TRATAMIENTO Y ESPECIALISTA
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono text-[#141413] uppercase tracking-wider mb-2">
                    Procedimiento Solicitado *
                  </label>
                  <select
                    value={selectedTreatment}
                    onChange={(e) => setSelectedTreatment(e.target.value)}
                    className="w-full px-4 py-3 rounded-[2px] border border-[#e5e0d5] bg-[#faf8f5] text-[#141413] text-sm focus:border-[#141413] focus:outline-none"
                  >
                    {TREATMENTS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#141413] uppercase tracking-wider mb-2">
                    Especialista de Preferencia
                  </label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full px-4 py-3 rounded-[2px] border border-[#e5e0d5] bg-[#faf8f5] text-[#141413] text-sm focus:border-[#141413] focus:outline-none"
                  >
                    <option value="any">Cualquier especialista disponible</option>
                    {DOCTORS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} · {d.role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Fecha y Turno */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block border-b border-[#f0ede6] pb-2">
                02 · PREFERENCIA DE FECHA Y HORARIO
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono text-[#141413] uppercase tracking-wider mb-2">
                    Fecha Tentativa
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-[2px] border border-[#e5e0d5] bg-[#faf8f5] text-[#141413] text-sm focus:border-[#141413] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#141413] uppercase tracking-wider mb-2">
                    Jornada de Preferencia
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPreferredSlot("manana")}
                      className={`py-3 text-xs font-mono tracking-wider uppercase border transition ${
                        preferredSlot === "manana"
                          ? "bg-[#141413] text-[#faf8f5] border-[#141413]"
                          : "bg-[#faf8f5] border-[#e5e0d5] text-[#78736a]"
                      }`}
                    >
                      Mañana (10-14 hrs)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreferredSlot("tarde")}
                      className={`py-3 text-xs font-mono tracking-wider uppercase border transition ${
                        preferredSlot === "tarde"
                          ? "bg-[#141413] text-[#faf8f5] border-[#141413]"
                          : "bg-[#faf8f5] border-[#e5e0d5] text-[#78736a]"
                      }`}
                    >
                      Tarde (14-20 hrs)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Datos de Contacto */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block border-b border-[#f0ede6] pb-2">
                03 · IDENTIFICACIÓN DEL PACIENTE
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono text-[#141413] uppercase tracking-wider mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Marcelo Vidal Ríos"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-4 py-3 rounded-[2px] border border-[#e5e0d5] bg-[#faf8f5] text-[#141413] text-sm focus:border-[#141413] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#141413] uppercase tracking-wider mb-2">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+56 9 1234 5678"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-[2px] border border-[#e5e0d5] bg-[#faf8f5] text-[#141413] text-sm focus:border-[#141413] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#141413] uppercase tracking-wider mb-2">
                  Correo Electrónico (Opcional)
                </label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-[2px] border border-[#e5e0d5] bg-[#faf8f5] text-[#141413] text-sm focus:border-[#141413] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#141413] uppercase tracking-wider mb-2">
                  Observaciones o Síntomas Previos
                </label>
                <textarea
                  rows={2}
                  placeholder="Describa si tiene dolor agudo, molestia en mordida o si busca evaluación estética..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-[2px] border border-[#e5e0d5] bg-[#faf8f5] text-[#141413] text-sm focus:border-[#141413] focus:outline-none"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-[#f0ede6]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-[2px] bg-[#141413] text-[#faf8f5] hover:bg-black disabled:opacity-50 text-xs font-mono tracking-[0.2em] uppercase font-bold transition shadow-sm flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? "Registrando en Sistema..." : "Registrar Solicitud de Cita"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

      </div>
    </section>
  );
}
