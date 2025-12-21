import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrainingServices from "@/components/services/TrainingServices";
import { CheckCircle2, Briefcase, BookOpen, GraduationCap, Award } from "lucide-react";
import { motion } from "framer-motion";

// Static Services Data (Success Stories / Why Choose Us) - Kept here as it's specific to the page "Why Choose Us" section
const services = [
    {
        icon: Briefcase,
        title: "Project-Based Internships",
        description: "Gain real-world experience by working on live projects under expert mentorship.",
        benefits: ["Real-time Project Work", "Mentor Guidance", "Industry Exposure", "Team Collaboration"],
        color: "primary"
    },
    {
        icon: BookOpen,
        title: "Industry-Focused Training",
        description: "Comprehensive training programs covering the latest technologies and market trends.",
        benefits: ["Full Stack Development", "Data Science & AI", "Digital Marketing", "Cloud Computing"],
        color: "accent"
    },
    {
        icon: GraduationCap,
        title: "Skill Development",
        description: "Enhance your professional skills with our specialized courses and workshops.",
        benefits: ["Soft Skills Training", "Resume Building", "Interview Prep", "Communication Skills"],
        color: "success"
    },
    {
        icon: Award,
        title: "Certification",
        description: "Earn industry-recognized certificates to boost your resume and career prospects.",
        benefits: ["Completion Certificate", "Project Experience Letter", "Letters of Recommendation", "Digital Badges"],
        color: "primary"
    }
];

const Training = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-gradient-hero">
                <div className="container px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto"
                    >
                        <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                            Training & Internships
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Launch Your Career With <br />
                            <span className="text-gradient-primary">Real Experience</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                            Bridge the gap between academic learning and industry requirements with our
                            hands-on internships and expert-led training programs.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Programs Section */}
            <section className="py-20 bg-secondary/20">
                <div className="container px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Explore Our Programs</h2>
                        <p className="text-muted-foreground">Find the perfect opportunity to kickstart your journey.</p>
                    </div>

                    <TrainingServices layout="grid" />
                </div>
            </section>

            {/* Why Choose Us Grid */}
            <section className="py-20">
                <div className="container px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose NexByte?</h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-primary/10 text-primary`}>
                                    <service.icon className="w-7 h-7" />
                                </div>

                                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                                <p className="text-muted-foreground mb-6">{service.description}</p>

                                <ul className="space-y-3">
                                    {service.benefits.map((benefit) => (
                                        <li key={benefit} className="flex items-center gap-3 text-sm">
                                            <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Training;
