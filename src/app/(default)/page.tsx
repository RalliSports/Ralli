export const metadata = {
  title: "Ralli - Sports Betting with Friends",
  description:
    "Compete with friends in NFL, NBA, Soccer, and Baseball betting. PvP sports gambling reimagined.",
};

import HeroProfessional from "@/components/hero-professional";
import SportsCategories from "@/components/sports-categories";
import FeaturesPlanet from "@/components/features-planet";
import RalliTestimonials from "@/components/ralli-testimonials";
import Cta from "@/components/cta";
import SportsCoverage from "@/components/sports-coverage-new";

export default function Home() {
  return (
    <>
      <HeroProfessional />
      {/* <SportsCategories /> */}
      <SportsCoverage />
      <FeaturesPlanet />
      <RalliTestimonials />
      <Cta />
    </>
  );
}
