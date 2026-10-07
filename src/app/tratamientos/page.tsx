import { Metadata } from "next";
import { TreatmentsSection } from "@/components/dental/TreatmentsSection";
import { AppointmentBookingSection } from "@/components/dental/AppointmentBookingSection";

export const metadata: Metadata = {
  title: "Tratamientos Dentales | Centro Dental BeHappy Ñuñoa",
  description:
    "Explora nuestros 20 tratamientos y procesos de cuidado dental en Ñuñoa: Blanqueamiento, Ortodoncia, Implantes, Invisalign, Coronas, Odontopediatría, Endodoncia, Periodontitis y más.",
};

export default function TratamientosPage() {
  return (
    <div className="bg-[#faf8f5] text-[#141413] min-h-screen">
      {/* 20 Real Treatment Cards Grid matching high-end editorial clinical design */}
      <TreatmentsSection />

      {/* Appointment Booking Desk */}
      <AppointmentBookingSection />
    </div>
  );
}
