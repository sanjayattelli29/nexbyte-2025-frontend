import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TechnologyServices from "@/components/services/TechnologyServices";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Technology = () => {
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
                            Technology Services
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Innovative Technology For <br />
                            <span className="text-gradient-primary">Digital Transformation</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                            We build robust, scalable, and cutting-edge technology solutions that power business growth.
                        </p>
                        {/* 
                            Note: The reusable component handles modals internally. 
                            The hero CTA could trigger a general enquiry modal if needed, 
                            but for now we link to contact or similar. 
                            The original code opened the modal with empty service.
                            Since we moved state inside the component, we might lose external triggering unless we lift state up or use context.
                            However, user request was primarily about aggregation view.
                            For now, let's keep the hero simple or direct to the grid. 
                         */}
                        <Button size="lg" asChild>
                            <a href="#services">Explore Services <ArrowRight className="ml-2 w-4 h-4" /></a>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section id="services" className="py-20">
                <div className="container px-4">
                    <TechnologyServices layout="grid" />
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Technology;
