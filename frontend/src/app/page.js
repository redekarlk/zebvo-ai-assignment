import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import TemplateGrid from "@/components/landing/TemplateGrid";

export default function Home() {
  return (
    <div className="bg-black min-h-screen text-foreground selection:bg-[#333] selection:text-white">
      <Navbar />
      <main>
        <HeroSection />
        <TemplateGrid />
      </main>
    </div>
  );
}
