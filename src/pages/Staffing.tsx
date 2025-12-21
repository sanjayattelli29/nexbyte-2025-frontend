import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StaffingServices from "../components/services/StaffingServices";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Staffing = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-gradient-hero">
                <div className="container px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                            Staffing & Talent Solutions
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Build Your Dream Team <br />
                            <span className="text-gradient-primary">Faster & Better</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                            From contract hiring to full-time recruitment, we connect you with top-tier talent tailored to your needs.
                        </p>
                        <Button size="lg" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
                            Find Talent Now <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20" id="services">
                <div className="container px-4">
                    <StaffingServices layout="grid" />
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Staffing;
