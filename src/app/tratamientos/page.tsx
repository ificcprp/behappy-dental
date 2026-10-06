import { Metadata } from "next";
import { RealTreatmentsGrid } from "@/components/dental/RealTreatmentsGrid";
import { AppointmentBookingSection } from "@/components/dental/AppointmentBookingSection";

export const metadata: Metadata = {
  title: "Tratamientos Dentales | Centro Dental BeHappy Ñuñoa",
  description:
    "Explora nuestros 20 tratamientos y procesos de cuidado dental en Ñuñoa: Blanqueamiento, Ortodoncia, Implantes, Invisalign, Coronas, Odontopediatría, Endodoncia, Periodontitis y más.",
};

export default function TratamientosPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* 20 Real Treatment Cards Grid matching the Real Site */}
      <RealTreatmentsGrid />

      {/* Appointment Booking Desk */}
      <div className="bg-[#0f0f13] border-t border-neutral-900">
        <AppointmentBookingSection />
      </div>
    </div>
  );
}
