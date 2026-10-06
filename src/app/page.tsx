import { Hero } from "@/components/dental/Hero";
import { RealCardsAndWelcomeSection } from "@/components/dental/RealCardsAndWelcomeSection";
import { PreventionSection } from "@/components/dental/PreventionSection";
import { ConveniosPromosSection } from "@/components/dental/ConveniosPromosSection";
import { EspecialidadesTratamientosCarousel } from "@/components/dental/EspecialidadesTratamientosCarousel";
import { AppointmentBookingSection } from "@/components/dental/AppointmentBookingSection";
import { TreatmentsSection } from "@/components/dental/TreatmentsSection";
import { DoctorsSection } from "@/components/dental/DoctorsSection";
import { LocationHoursSection } from "@/components/dental/LocationHoursSection";

export default function Home() {
  return (
    <div className="space-y-0">
      <Hero />
      <RealCardsAndWelcomeSection />
      <PreventionSection />
      <ConveniosPromosSection />
      <EspecialidadesTratamientosCarousel />
      <AppointmentBookingSection />
      <DoctorsSection />
      <TreatmentsSection />
      <LocationHoursSection />
    </div>
  );
}
