import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Brain, Cloud, Code, Database, Globe, Lock, Cpu, Layers, Box, Terminal, Zap, Shield, ArrowRight } from "lucide-react";

const topics = [
    { title: "Artificial Intelligence & Generative AI", icon: Brain, color: "text-purple-400", bg: "from-purple-500/20 to-indigo-500/20", border: "border-purple-500/20" },
    { title: "Machine Learning & Data Science", icon: Layers, color: "text-blue-400", bg: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/20" },
    { title: "Cloud Computing", icon: Cloud, color: "text-sky-400", bg: "from-sky-500/20 to-blue-500/20", border: "border-sky-500/20" },
    { title: "DevOps & Platform Engineering", icon: Terminal, color: "text-orange-400", bg: "from-orange-500/20 to-red-500/20", border: "border-orange-500/20" },
    { title: "Cybersecurity", icon: Lock, color: "text-red-400", bg: "from-red-500/20 to-pink-500/20", border: "border-red-500/20" },
    { title: "Data Engineering & Analytics", icon: Database, color: "text-teal-400", bg: "from-teal-500/20 to-emerald-500/20", border: "border-teal-500/20" },
    { title: "Full Stack Software Development", icon: Code, color: "text-indigo-400", bg: "from-indigo-500/20 to-violet-500/20", border: "border-indigo-500/20" },
    { title: "AI Tools & Automation", icon: Zap, color: "text-yellow-400", bg: "from-yellow-500/20 to-orange-500/20", border: "border-yellow-500/20" },
    { title: "Edge Computing & IoT", icon: Globe, color: "text-green-400", bg: "from-green-500/20 to-lime-500/20", border: "border-green-500/20" },
    { title: "Blockchain & Web3", icon: Box, color: "text-emerald-400", bg: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/20" },
    { title: "AR / VR / XR", icon: Cpu, color: "text-pink-400", bg: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/20" },
    { title: "Quantum Computing", icon: Shield, color: "text-violet-400", bg: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/20" },
];

const TrainingDiscovery = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-32 px-4 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/10 to-primary/5" />
                    {/* Animated Glow Orbs */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: "2s" }} />

                    <div className="container mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary"
                        >
                            🚀 Upskill with Industry Experts
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70"
                        >
                            Future-Proof <br className="hidden md:block" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">Your Career</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                        >
                            Dive into our curated training programs covering the world's most transformative technologies.
                        </motion.p>
                    </div>
                </section>

                {/* Topics Grid */}
                <section className="py-24 px-4 container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {topics.map((topic, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link to={`/trainings/${encodeURIComponent(topic.title)}`} className="block h-full">
                                    <div className={`h-full relative group p-1 rounded-2xl bg-gradient-to-br ${topic.bg} hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300`}>
                                        <div className="absolute inset-0 rounded-2xl bg-background opacity-90 group-hover:opacity-10 transition-opacity duration-300" />

                                        <div className={`relative h-full bg-background/50 backdrop-blur-sm border ${topic.border} rounded-xl p-6 flex flex-col transition-transform group-hover:-translate-y-1`}>
                                            <div className="mb-6 w-14 h-14 rounded-xl bg-background shadow-sm border border-border/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <topic.icon className={`w-7 h-7 ${topic.color}`} />
                                            </div>

                                            <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors">
                                                {topic.title}
                                            </h3>

                                            <p className="text-sm text-muted-foreground mb-6 flex-1">
                                                Master {topic.title} with hands-on projects and expert guidance.
                                            </p>

                                            <div className="flex items-center text-sm font-semibold text-primary/80 group-hover:text-primary">
                                                View Courses <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default TrainingDiscovery;
