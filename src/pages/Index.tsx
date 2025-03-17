
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import StoryExamples from "@/components/home/StoryExamples";
import Testimonials from "@/components/home/Testimonials";
import CtaSection from "@/components/home/CtaSection";
import { initializePreGeneratedStories } from "@/services/stories/preGeneratedStories";

const Index = () => {
  useEffect(() => {
    // Preload and initialize story data for the demo page
    const initStories = async () => {
      try {
        await initializePreGeneratedStories();
        console.log("Pre-generated stories initialized on Index page");
      } catch (error) {
        console.error("Failed to initialize pre-generated stories:", error);
      }
    };
    
    initStories();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />
        
        {/* How It Works */}
        <HowItWorks />
        
        {/* Story Examples */}
        <StoryExamples />
        
        {/* Testimonials */}
        <Testimonials />
        
        {/* CTA Section */}
        <CtaSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
