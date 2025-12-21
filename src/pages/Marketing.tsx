import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketingServices from "@/components/services/MarketingServices";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Marketing = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-gradient-hero">
                <div className="container px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto">
                        <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">Digital Marketing</span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Complete Social Media & <br /><span className="text-gradient-primary">Marketing Solutions</span></h1>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">From strategy to execution, we drive real engagement and growth.</p>
                        <Link to="/contact">
                            <Button size="lg">Get Started <ArrowRight className="ml-2 w-4 h-4" /></Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20">
                <div className="container px-4">
                    <MarketingServices layout="grid" />
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Marketing;
