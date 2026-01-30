import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Platforms from "./pages/Platforms";
import Analytics from "./pages/Analytics";
import About from "./pages/About";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Events from "./pages/Events";

import Marketing from "./pages/Marketing";
import Technology from "./pages/Technology";
import Staffing from "./pages/Staffing";
import Training from "./pages/Training";
import Hackathons from "./pages/Hackathons";
import AdminPanel from "./pages/AdminPanel"; // Import AdminPanel
import OfficialRegistration from "./pages/OfficialRegistration";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import LinkedinBenefits from "./pages/LinkedinBenefits";
import TrainingDiscovery from "./pages/TrainingDiscovery"; // NEW

import TrainingListing from "./pages/TrainingListing"; // NEW
import SocialPosts from "./pages/SocialPosts"; // NEW
import PostDetail from "./pages/PostDetail"; // NEW
import AIPosts from "./pages/AIPosts"; // NEW - AI Goals
import AIPostDetail from "./pages/AIPostDetail"; // NEW - AI Goals

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin-panel" element={<AdminPanel />} /> {/* Add Admin Route */}
          <Route path="/services" element={<Services />} />
          <Route path="/services/marketing" element={<Marketing />} />
          <Route path="/services/technology" element={<Technology />} />
          <Route path="/services/staffing" element={<Staffing />} />
          <Route path="/services/training" element={<Training />} />
          <Route path="/services/hackathons" element={<Hackathons />} />
          <Route path="/services/hackathons" element={<Hackathons />} />
          <Route path="/social-posts" element={<SocialPosts />} /> {/* NEW */}
          <Route path="/social-posts/:id" element={<PostDetail />} /> {/* NEW */}
          <Route path="/ai-posts" element={<AIPosts />} /> {/* NEW */}
          <Route path="/ai-posts/:id" element={<AIPostDetail />} /> {/* NEW */}
          <Route path="/training-discovery" element={<TrainingDiscovery />} /> {/* NEW */}
          <Route path="/trainings/:topic" element={<TrainingListing />} /> {/* NEW */}
          <Route path="/events" element={<Events />} />

          <Route path="/platforms" element={<Platforms />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/about" element={<About />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/linkedin-benefits" element={<LinkedinBenefits />} />
          <Route path="/official-registration" element={<OfficialRegistration />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          {/* ADD ALL CUSTOM ROUTES and  ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
