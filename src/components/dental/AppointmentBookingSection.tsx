"use client";

import React, { useState, useEffect } from "react";
import { TREATMENTS, Treatment } from "@/data/treatments";
import { DOCTORS, Doctor } from "@/data/doctors";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { getCMSData, CMSData } from "@/lib/cmsStore";
import { CheckCircle2, MessageCircle, ArrowRight, Calendar, Download } from "lucide-react";
import { toast } from "sonner";
import { addStoredAppointment } from "@/lib/clinicalStore";

interface BookingFormProps {
  initialDoctorId?: string;
  initialTreatmentId?: string;
}

export function AppointmentBookingSection({ initialDoctorId, initialTreatmentId }: BookingFormProps) {
  const [treatmentsList, setTreatmentsList] = useState<Treatment[]>(TREATMENTS);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(DOCTORS);

  const [selectedTreatment, setSelectedTreatment] = useState(initialTreatmentId || "revision-dental");
  const [selectedDoctor, setSelectedDoctor] = useState(initialDoctorId || "any");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredSlot, setPreferredSlot] = useState("tarde");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedData, setConfirmedData] = useState<{
    whatsappUrl: string;
    name: string;
    treatmentName: string;
    doctorName: string;
    date: string;
    timeSlot: string;
  } | null>(null);

  // Load dynamic CMS data and listen to triage selection events
  useEffect(() => {
    const cms = getCMSData();
    if (cms?.treatments && cms.treatments.length > 0) setTreatmentsList(cms.treatments);
    if (cms?.doctors && cms.doctors.length > 0) setDoctorsList(cms.doctors);

    const handleCmsUpdate = (e: Event) => {
      const custom = (e as CustomEvent<CMSData>).detail;
      if (custom?.treatments && custom.treatments.length > 0) setTreatmentsList(custom.treatments);
      if (custom?.doctors && custom.doctors.length > 0) setDoctorsList(custom.doctors);
    };

    const handleTriageSelected = (e: Event) => {
      const detail = (e as CustomEvent<{ treatmentName: string }>).detail;
      if (detail?.treatmentName) {
        // Find matching treatment in list
        const match = treatmentsList.find(
          (t) => t.name.toLowerCase().includes(detail.treatmentName.toLowerCase()) ||
                 detail.treatmentName.toLowerCase().includes(t.name.toLowerCase())
        );
        if (match) setSelectedTreatment(match.id);
      }
    };

    window.addEventListener("behappy_cms_updated", handleCmsUpdate);
    window.addEventListener("behappy_triage_selected", handleTriageSelected);
    return () => {
      window.removeEventListener("behappy_cms_updated", handleCmsUpdate);
      window.removeEventListener("behappy_triage_selected", handleTriageSelected);
    };
  }, [treatmentsList]);

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
      const treatmentObj = treatmentsList.find((t) => t.id === selectedTreatment);
      const doctorObj = doctorsList.find((d) => d.id === selectedDoctor);

      const doctorDisplayName = doctorObj ? doctorObj.name : "Primer especialista disponible";
      const treatmentDisplayName = treatmentObj ? treatmentObj.name : "Evaluación General";
      const timeSlotDisplay = preferredSlot === "manana" ? "Mañana (10:00 - 14:00)" : "Tarde (14:00 - 20:00)";

      const payload = {
        patient_name: patientName,
        patient_phone: patientPhone.startsWith("+56") ? patientPhone : `+56 9 ${patientPhone.replace(/\D/g, "")}`,
        patient_email: patientEmail || null,
        doctor_id: doctorObj ? doctorObj.id : null,
        doctor_name: doctorDisplayName,
        treatment_id: selectedTreatment,
        treatment_name: treatmentDisplayName,
        preferred_date: preferredDate || null,
        preferred_time_slot: timeSlotDisplay,
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

      // Persist to local clinical store for instant visibility in Portal (Doctor, Recepción, Admin)
      addStoredAppointment({
        date: preferredDate || "Por coordinar",
        time: preferredSlot === "manana" ? "10:00 - 14:00" : "14:00 - 20:00",
        doctorName: doctorDisplayName,
        treatmentName: treatmentDisplayName,
        status: "pendiente",
        box: "Box 1",
        price: 35000,
        convenioDiscount: 0,
        patientName: patientName,
        patientPhone: payload.patient_phone,
        notes: notes || undefined,
      });

      toast.success("¡Solicitud registrada correctamente en la recepción clínica!");
      setConfirmedData({
        whatsappUrl: data.whatsappUrl,
        name: patientName,
        treatmentName: treatmentDisplayName,
        doctorName: doctorDisplayName,
        date: preferredDate || "Fecha a confirmar",
        timeSlot: timeSlotDisplay,
      });
    } catch (err: any) {
      toast.error(err.message || "Ocurrió un error al enviar su solicitud");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = () => {
    if (!confirmedData) return "#";
    const title = encodeURIComponent(`Cita Dental BeHappy: ${confirmedData.treatmentName}`);
    const details = encodeURIComponent(`Cita médica con ${confirmedData.doctorName} en Centro Dental BeHappy. Franja: ${confirmedData.timeSlot}. Teléfono clínica: +56 9 4757 8597.`);
    const location = encodeURIComponent("Suecia 3580, OF. 304, Ñuñoa, Santiago");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  // Generate Downloadable .ics File
  const handleDownloadIcs = () => {
    if (!confirmedData) return;
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Centro Dental BeHappy//Cita Medica//ES",
      "BEGIN:VEVENT",
      `SUMMARY:Cita Dental BeHappy: ${confirmedData.treatmentName}`,
      `DESCRIPTION:Atención con ${confirmedData.doctorName}. Sede Suecia 3580, Ñuñoa.`,
      "LOCATION:Suecia 3580, OF. 304, Ñuñoa, Santiago",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "cita-behappy-dental.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            Ingreso inmediato a la recepción de Suecia 3580. Recibirás tu ticket digital, confirmación médica y sincronización con tu calendario.
          </p>
        </div>

        {/* Confirmation State (Digital Health Ticket) */}
        {confirmedData ? (
          <div className="border border-[#141413] bg-white p-8 sm:p-12 text-center space-y-6 shadow-sm rounded-[2px]">
            <div className="w-12 h-12 bg-[#141413] text-[#faf8f5] flex items-center justify-center mx-auto rounded-full">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-[0.2em] text-emerald-700 uppercase font-bold block">
                TICKET DIGITAL CONFIRMADO · FOLIO EN RECEPCIÓN
              </span>
              <h3 className="text-2xl font-normal tracking-tight text-[#141413]">
                Solicitud Registrada con Éxito, {confirmedData.name}
              </h3>
              <p className="text-[#66635d] text-sm max-w-md mx-auto font-light leading-relaxed">
                Tu hora para <strong className="text-black font-medium">{confirmedData.treatmentName}</strong> con <strong className="text-black font-medium">{confirmedData.doctorName}</strong> ha quedado asignada.
              </p>
            </div>

            {/* Ticket details pill */}
            <div className="p-4 bg-[#faf8f5] border border-[#e5e0d5] max-w-md mx-auto text-left text-xs font-mono space-y-1.5 rounded">
              <div className="flex justify-between">
                <span className="text-neutral-500">Sede:</span>
                <span className="font-bold text-black">Suecia 3580, OF. 304, Ñuñoa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Franja:</span>
                <span className="font-bold text-black">{confirmedData.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Box:</span>
                <span className="font-bold text-black">Box Clínico Asignado</span>
              </div>
            </div>

            {/* Action buttons (WhatsApp + Calendar Sync) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={confirmedData.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#141413] text-[#faf8f5] hover:bg-black text-xs font-mono tracking-wider uppercase font-bold transition rounded-[2px]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Coordinar Box por WhatsApp
              </a>

              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 border border-neutral-300 hover:border-black text-xs font-mono tracking-wider uppercase text-neutral-800 transition rounded-[2px]"
              >
                <Calendar className="w-4 h-4" />
                Google Calendar
              </a>

              <button
                type="button"
                onClick={handleDownloadIcs}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 border border-neutral-300 hover:border-black text-xs font-mono tracking-wider uppercase text-neutral-800 transition rounded-[2px]"
              >
                <Download className="w-4 h-4" />
                Apple / .ics
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setConfirmedData(null)}
                className="text-xs font-mono text-[#78736a] hover:text-[#141413] underline underline-offset-4"
              >
                Agendar otra cita para familiar o acompañante
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="border border-[#e5e0d5] bg-white p-6 sm:p-10 space-y-8 rounded-[2px] shadow-xs">
            
            {/* Step 1: Medical choice */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block border-b border-[#f0ede6] pb-2">
                01 · SELECCIÓN CLÍNICA & TRATAMIENTO
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="treatment" className="block text-xs font-mono uppercase text-[#141413] font-medium mb-2">
                    Tratamiento Requerido *
                  </label>
                  <select
                    id="treatment"
                    value={selectedTreatment}
                    onChange={(e) => setSelectedTreatment(e.target.value)}
                    className="w-full px-4 py-3 bg-[#faf8f5] border border-[#ded9cd] text-[#141413] text-xs font-mono rounded-[2px] focus:outline-none focus:border-[#141413]"
                  >
                    {treatmentsList.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="doctor" className="block text-xs font-mono uppercase text-[#141413] font-medium mb-2">
                    Especialista de Preferencia
                  </label>
                  <select
                    id="doctor"
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full px-4 py-3 bg-[#faf8f5] border border-[#ded9cd] text-[#141413] text-xs font-mono rounded-[2px] focus:outline-none focus:border-[#141413]"
                  >
                    <option value="any">Cualquier especialista disponible</option>
                    {doctorsList.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} · {d.role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Date & Slot */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block border-b border-[#f0ede6] pb-2">
                02 · DISPONIBILIDAD HORARIA PREFERENTE
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="preferredDate" className="block text-xs font-mono uppercase text-[#141413] font-medium mb-2">
                    Fecha Sugerida
                  </label>
                  <input
                    type="date"
                    id="preferredDate"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-4 py-3 bg-[#faf8f5] border border-[#ded9cd] text-[#141413] text-xs font-mono rounded-[2px] focus:outline-none focus:border-[#141413]"
                  />
                </div>

                <div>
                  <label htmlFor="slot" className="block text-xs font-mono uppercase text-[#141413] font-medium mb-2">
                    Franja Horaria
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPreferredSlot("manana")}
                      className={`py-3 px-3 border text-xs font-mono rounded-[2px] transition text-center ${
                        preferredSlot === "manana"
                          ? "bg-[#141413] text-[#faf8f5] border-[#141413] font-bold"
                          : "bg-[#faf8f5] text-[#141413] border-[#ded9cd] hover:border-[#141413]"
                      }`}
                    >
                      Mañana (10:00 - 14:00)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreferredSlot("tarde")}
                      className={`py-3 px-3 border text-xs font-mono rounded-[2px] transition text-center ${
                        preferredSlot === "tarde"
                          ? "bg-[#141413] text-[#faf8f5] border-[#141413] font-bold"
                          : "bg-[#faf8f5] text-[#141413] border-[#ded9cd] hover:border-[#141413]"
                      }`}
                    >
                      Tarde (14:00 - 20:00)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Patient info */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block border-b border-[#f0ede6] pb-2">
                03 · ANTECEDENTES DEL PACIENTE
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-mono uppercase text-[#141413] font-medium mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Ej: Macarena Valdés Soto"
                    className="w-full px-4 py-3 bg-[#faf8f5] border border-[#ded9cd] text-[#141413] text-xs rounded-[2px] focus:outline-none focus:border-[#141413]"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-mono uppercase text-[#141413] font-medium mb-2">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+56 9 1234 5678"
                    className="w-full px-4 py-3 bg-[#faf8f5] border border-[#ded9cd] text-[#141413] text-xs font-mono rounded-[2px] focus:outline-none focus:border-[#141413]"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-mono uppercase text-[#141413] font-medium mb-2">
                    Correo Electrónico (Opcional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="paciente@correo.cl"
                    className="w-full px-4 py-3 bg-[#faf8f5] border border-[#ded9cd] text-[#141413] text-xs rounded-[2px] focus:outline-none focus:border-[#141413]"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-xs font-mono uppercase text-[#141413] font-medium mb-2">
                    Motivo o Síntoma Principal
                  </label>
                  <input
                    type="text"
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej: Molestia molar derecho, control anual, etc."
                    className="w-full px-4 py-3 bg-[#faf8f5] border border-[#ded9cd] text-[#141413] text-xs rounded-[2px] focus:outline-none focus:border-[#141413]"
                  />
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 border-t border-[#f0ede6] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] font-mono text-[#78736a]">
                Sin cobro inicial de reserva · Confirmación presencial
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#141413] text-[#faf8f5] hover:bg-black text-xs font-mono tracking-widest uppercase font-bold transition rounded-[2px] disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {isSubmitting ? (
                  <span>Registrando...</span>
                ) : (
                  <>
                    <span>Confirmar Cita de Evaluación</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </section>
  );
}
