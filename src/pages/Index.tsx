import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import TrainingTeaserSection from "@/components/TrainingTeaserSection";
import PlatformsSection from "@/components/PlatformsSection";
import AnalyticsSection from "@/components/AnalyticsSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SocialGoalsSection from "@/components/SocialGoalsSection"; // NEW
import AIGoalsSection from "@/components/AIGoalsSection"; // NEW
import PremiumAdsShowcase from "@/components/PremiumAdsShowcase"; // NEW


const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <PremiumAdsShowcase /> {/* NEW - Private Ads System */}
        <section id="social-goals">

          <SocialGoalsSection /> {/* NEW */}
        </section>
        <section id="ai-goals">
          <AIGoalsSection /> {/* NEW */}
        </section>
        <section id="services">
          <ServicesSection />
        </section>
        <section id="training-teaser">
          <TrainingTeaserSection />
        </section>
        <section id="platforms">
          <PlatformsSection />
        </section>
        <section id="analytics">
          <AnalyticsSection />
        </section>
        <section id="about">
          <AboutSection />
        </section>
        <section id="testimonials">
          <TestimonialsSection />
        </section>
        <section id="contact">
          <ContactSection />
        </section>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
