import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketingServices from "@/components/services/MarketingServices";
import TechnologyServices from "@/components/services/TechnologyServices";
import TrainingServices from "@/components/services/TrainingServices";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Complete Digital Services for{" "}
              <span className="text-gradient-primary">Modern Businesses</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              From strategy to execution, we provide comprehensive digital solutions that drive
              real results. Our integrated approach ensures every aspect of your digital presence
              works together seamlessly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Marketing Services Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Marketing
              </span>
              <h2 className="text-2xl md:text-3xl font-bold">Social Media & Marketing</h2>
              <p className="text-muted-foreground mt-2">Comprehensive campaigns to boost engagement and growth.</p>
            </div>
            <Link to="/services/marketing" className="hidden md:flex items-center text-primary font-medium hover:underline">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          <MarketingServices layout="carousel" />
          <div className="md:hidden mt-6 text-center">
            <Link to="/services/marketing">
              <Button variant="outline">View All Marketing Services</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Technology Services Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
                Technology
              </span>
              <h2 className="text-2xl md:text-3xl font-bold">Technology & Development</h2>
              <p className="text-muted-foreground mt-2">Cutting-edge software and web solutions for your business.</p>
            </div>
            <Link to="/services/technology" className="hidden md:flex items-center text-accent font-medium hover:underline">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          <TechnologyServices layout="carousel" />
          <div className="md:hidden mt-6 text-center">
            <Link to="/services/technology">
              <Button variant="outline">View All Technology Services</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Training Services Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-success/10 text-success rounded-full text-sm font-medium mb-4">
                Learning
              </span>
              <h2 className="text-2xl md:text-3xl font-bold">Training & Internships</h2>
              <p className="text-muted-foreground mt-2">Upskill with expert-led programs and gain real-world experience.</p>
            </div>
            <Link to="/services/training" className="hidden md:flex items-center text-success font-medium hover:underline">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          <TrainingServices layout="carousel" />
          <div className="md:hidden mt-6 text-center">
            <Link to="/services/training">
              <Button variant="outline">View All Training Programs</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
