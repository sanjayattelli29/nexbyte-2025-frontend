import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, GraduationCap, Rocket } from "lucide-react";

const TrainingTeaserSection = () => {
    return (
        <section className="py-24 relative overflow-hidden bg-slate-50">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-indigo-100/40 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-t from-violet-100/40 to-transparent rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex-1 text-center lg:text-left"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-bold mb-6">
                            <Rocket className="w-4 h-4" />
                            <span>Level Up Your Career</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 leading-tight">
                            Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">In-Demand Skills</span>
                        </h2>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Join our premium training programs in AI, Full Stack Development, Data Science, and more.
                            Gain hands-on experience, build real-world projects, and get certified to fast-track your career.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/training-discovery">
                                <Button size="lg" className="rounded-full px-8 h-12 text-base bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-xl shadow-indigo-500/20">
                                    Explore Training Programs <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base border-slate-300 hover:bg-white hover:text-indigo-600">
                                    Contact for Bulk Enrollment
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Visual / Graphic */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex-1 relative"
                    >
                        <div className="relative z-10 grid grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center transform translate-y-8">
                                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1">Live Classes</h3>
                                <p className="text-sm text-slate-500">Interactive sessions with experts</p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1">Certification</h3>
                                <p className="text-sm text-slate-500">Industry recognized credentials</p>
                            </div>
                        </div>

                        {/* Decorative blob behind */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-violet-200 to-indigo-200 rounded-full blur-3xl opacity-30 -z-10 transform scale-150" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default TrainingTeaserSection;
