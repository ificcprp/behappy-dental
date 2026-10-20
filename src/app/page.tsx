import { Hero } from "@/components/dental/Hero";
import { ClinicalTriageSection } from "@/components/dental/ClinicalTriageSection";
import { RealCardsAndWelcomeSection } from "@/components/dental/RealCardsAndWelcomeSection";
import { PreventionSection } from "@/components/dental/PreventionSection";
import { ConveniosPromosSection } from "@/components/dental/ConveniosPromosSection";
import { EspecialidadesTratamientosCarousel } from "@/components/dental/EspecialidadesTratamientosCarousel";
import { DoctorsSection } from "@/components/dental/DoctorsSection";
import { AppointmentBookingSection } from "@/components/dental/AppointmentBookingSection";
import { LocationHoursSection } from "@/components/dental/LocationHoursSection";
import { getPublishedCMS } from "@/lib/cmsServer";

export default async function Home() {
  const cms = await getPublishedCMS();

  return (
    <div className="space-y-0">
      <Hero initialHero={cms.hero} />
      <ClinicalTriageSection />
      <RealCardsAndWelcomeSection />
      <PreventionSection />
      <ConveniosPromosSection />
      <EspecialidadesTratamientosCarousel />
      <DoctorsSection />
      <AppointmentBookingSection />
      <LocationHoursSection />
    </div>
  );
}
