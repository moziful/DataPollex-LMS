import Hero from "@/components/Hero";
import FeaturedCoursesSection from "@/components/FeaturedCoursesSection";
import LearningPathwaysSection from "@/components/LearningPathwaysSection";
import ExperienceSection from "@/components/ExperienceSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      <Hero />
      <FeaturedCoursesSection />
      <LearningPathwaysSection />
      <ExperienceSection />
    </div>
  );
}
