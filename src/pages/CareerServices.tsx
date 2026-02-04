
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRight, ArrowRight, Loader2, CheckCircle2,
    Briefcase, Code, GraduationCap, Laptop, BookOpen,
    Target, Star, Users, Globe, Award, HelpCircle, UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// --- TYPES ---
interface CareerRole {
    role: string;
    description: string;
}

interface CareerPathStep {
    title: string;
    description: string;
}

interface FAQ {
    question: string;
    answer: string;
}

interface Technology {
    _id: string;
    name: string;
    tagline: string;
    intro: string;
    overview: string;
    roleOpportunities: CareerRole[];
    expertGuidance: string;
    benefits: string[];
    careerPath: CareerPathStep[];
    toolsCovered: string[];
    faqs: FAQ[];
    ctaText: string;
    sections?: any[]; // Legacy fallback
    sectionVisibility?: {
        overview?: boolean;
        roles?: boolean;
        curriculum?: boolean;
        benefits?: boolean;
        expertGuidance?: boolean;
        faqs?: boolean;
    };
}

const CareerServices = () => {
    const { toast } = useToast();
    const [selectedTechId, setSelectedTechId] = useState<string | null>(null);
    const [enquiryForm, setEnquiryForm] = useState({
        name: "", email: "", phone: "", status: "Fresher", role: "Aspiring Developer", timeSlot: "", notes: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Technologies (Sidebar)
    const { data: technologies, isLoading: techsLoading } = useQuery({
        queryKey: ["career-technologies"],
        queryFn: async () => {
            const res = await fetch("http://localhost:5000/api/career/technologies");
            const json = await res.json();
            return json.data as Technology[];
        },
    });

    // Fetch Selected Technology Details
    const { data: selectedTech, isLoading: techDetailsLoading } = useQuery({
        queryKey: ["career-technology", selectedTechId],
        queryFn: async () => {
            if (!selectedTechId) return null;
            const res = await fetch(`http://localhost:5000/api/career/technologies/${selectedTechId}`);
            const json = await res.json();
            return json.data as Technology;
        },
        enabled: !!selectedTechId,
    });

    useEffect(() => {
        if (technologies && technologies.length > 0 && !selectedTechId) {
            setSelectedTechId(technologies[0]._id);
        }
    }, [technologies, selectedTechId]);

    const handleEnquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTech) return;

        setIsSubmitting(true);
        try {
            const response = await fetch("http://localhost:5000/api/career/enquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...enquiryForm, technology: selectedTech.name }),
            });

            const result = await response.json();
            if (result.success) {
                toast({ title: "Success", description: "Your enquiry has been submitted successfully!" });
                setEnquiryForm({ name: "", email: "", phone: "", status: "Fresher", role: "", timeSlot: "", notes: "" });
            } else {
                toast({ title: "Error", description: "Failed to submit enquiry.", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Animated Background Icons
    const bgIcons = [Code, Briefcase, Laptop, Globe, GraduationCap, Target];

    return (
        <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 flex flex-col">
            <Navbar />

            {/* HERO BANNER */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white min-h-[400px] flex items-center pt-20">
                <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
                    {[...Array(15)].map((_, i) => {
                        const Icon = bgIcons[i % bgIcons.length];
                        return (
                            <Icon key={i} className="absolute animate-float text-indigo-300"
                                style={{
                                    left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                                    width: `${Math.random() * 40 + 20}px`, height: `${Math.random() * 40 + 20}px`,
                                    animationDuration: `${Math.random() * 15 + 10}s`, animationDelay: `${Math.random() * 5}s`
                                }}
                            />
                        );
                    })}
                </div>
                <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="p-3 rounded-full bg-indigo-500/20 backdrop-blur-md mb-6 border border-indigo-500/30">
                        <Briefcase className="w-8 h-8 text-indigo-300" />
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-white to-indigo-200">
                        Accelerate Your Career
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg md:text-xl text-indigo-200/80 max-w-2xl mx-auto leading-relaxed">
                        Master top technologies, get expert mentorship, and secure your dream role with our curated career paths.
                    </motion.p>
                </div>
            </div>

            {/* MAIN LAYOUT */}
            <div className="container mx-auto px-4 lg:px-6 py-12 -mt-20 relative z-20 mb-20">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* SIDEBAR NAVIGATION */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="w-full lg:w-1/4 flex-shrink-0">
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden sticky top-24">
                            <div className="p-5 bg-gradient-to-r from-indigo-50 to-white border-b border-indigo-100 flex items-center justify-between">
                                <h3 className="font-bold text-indigo-950 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-indigo-600" /> Career Paths
                                </h3>
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600">{technologies?.length || 0}</span>
                            </div>
                            <ScrollArea className="h-[400px] lg:h-[calc(100vh-250px)]">
                                {techsLoading ? (
                                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-indigo-600" /></div>
                                ) : (
                                    <div className="p-2 space-y-1">
                                        {technologies?.map((tech) => (
                                            <button key={tech._id} onClick={() => setSelectedTechId(tech._id)} className={`w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 flex justify-between items-center group ${selectedTechId === tech._id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"}`}>
                                                <span className="truncate">{tech.name}</span>
                                                {selectedTechId === tech._id && <ChevronRight className="w-4 h-4 ml-2" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </motion.div>

                    {/* CONTENT AREA */}
                    <div className="w-full lg:w-3/4 min-h-[600px]">
                        {techDetailsLoading ? (
                            <div className="flex justify-center items-center h-full bg-white rounded-3xl shadow-sm border border-slate-100 min-h-[400px]">
                                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                            </div>
                        ) : selectedTech ? (
                            <AnimatePresence mode="wait">
                                <motion.div key={selectedTech._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="space-y-8">

                                    {/* 1. Header Card */}
                                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                                            <Target className="w-40 h-40 text-indigo-600 rotate-12 transform translate-x-10 -translate-y-10" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-lg">Career Track</span>
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-current" /> High Demand
                                                </span>
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{selectedTech.name}</h2>
                                            <p className="text-xl text-indigo-600 font-medium mb-6">{selectedTech.tagline}</p>
                                            <p className="text-slate-600 leading-relaxed text-lg">{selectedTech.intro}</p>
                                        </div>
                                    </div>

                                    {/* 2. Overview */}
                                    {selectedTech.overview && selectedTech.sectionVisibility?.overview !== false && (
                                        <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100">
                                            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm"><BookOpen className="w-5 h-5" /></div>
                                                Program Overview
                                            </h3>
                                            <div className="prose prose-indigo max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: selectedTech.overview }} />
                                        </div>
                                    )}

                                    {/* 3. Role Opportunities */}
                                    {selectedTech.roleOpportunities?.length > 0 && selectedTech.sectionVisibility?.roles !== false && (
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3 px-2">
                                                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm"><Briefcase className="w-5 h-5" /></div>
                                                Role Opportunities
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {selectedTech.roleOpportunities.map((role, idx) => (
                                                    <Card key={idx} className="border-slate-200 hover:border-purple-200 hover:shadow-lg transition-all cursor-default group">
                                                        <CardHeader className="pb-2">
                                                            <CardTitle className="text-lg text-slate-800 group-hover:text-purple-700 transition-colors">{role.role}</CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <p className="text-sm text-slate-500 leading-relaxed">{role.description}</p>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 4. Career Path Timeline */}
                                    {selectedTech.careerPath?.length > 0 && selectedTech.sectionVisibility?.curriculum !== false && (
                                        <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100">
                                            <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm"><TrendingUpIcon className="w-5 h-5" /></div>
                                                Your Career Roadmap
                                            </h3>
                                            <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pl-8">
                                                {selectedTech.careerPath.map((step, idx) => (
                                                    <div key={idx} className="relative">
                                                        <span className="absolute -left-[41px] top-1 h-6 w-6 rounded-full border-4 border-white bg-blue-600 shadow-md"></span>
                                                        <h4 className="text-lg font-bold text-slate-900 mb-1">{step.title}</h4>
                                                        <p className="text-slate-600 text-sm">{step.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 5. Benefits & Tools */}
                                    {(selectedTech.sectionVisibility?.benefits !== false) && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {selectedTech.benefits?.length > 0 && (
                                                <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                                                    <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2"><Award className="w-5 h-5" /> Key Benefits</h3>
                                                    <ul className="space-y-3">
                                                        {selectedTech.benefits.map((b, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-emerald-800 text-sm font-medium">
                                                                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" /> {b}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {selectedTech.toolsCovered?.length > 0 && (
                                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                                                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"><Laptop className="w-5 h-5" /> Tools Covered</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedTech.toolsCovered.map((t, i) => (
                                                            <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 shadow-sm">
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* 6. Expert Guidance */}
                                    {selectedTech.expertGuidance && selectedTech.sectionVisibility?.expertGuidance !== false && (
                                        <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-3xl border border-indigo-100">
                                            <h3 className="text-2xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                                                <UserCheck className="w-6 h-6 text-indigo-600" /> Expert Guidance
                                            </h3>
                                            <p className="text-indigo-800 leading-relaxed whitespace-pre-wrap">{selectedTech.expertGuidance}</p>
                                        </div>
                                    )}

                                    {/* 7. FAQs */}
                                    {selectedTech.faqs?.length > 0 && selectedTech.sectionVisibility?.faqs !== false && (
                                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                                            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                                <HelpCircle className="w-6 h-6 text-slate-400" /> Frequently Asked Questions
                                            </h3>
                                            <Accordion type="single" collapsible className="w-full">
                                                {selectedTech.faqs.map((faq, i) => (
                                                    <AccordionItem key={i} value={`item-${i}`}>
                                                        <AccordionTrigger className="text-left font-medium text-slate-900 hover:text-indigo-600">{faq.question}</AccordionTrigger>
                                                        <AccordionContent className="text-slate-600">{faq.answer}</AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        </div>
                                    )}

                                    {/* ENQUIRY FORM */}
                                    <div id="booking-section" className="relative rounded-3xl overflow-hidden shadow-2xl mt-12 bg-slate-900">
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pointer-events-none" />
                                        <div className="relative z-10 p-8 lg:p-12">
                                            <div className="text-center mb-10">
                                                <h2 className="text-3xl font-bold text-white mb-4">
                                                    {selectedTech.ctaText || `Ready to Master ${selectedTech.name}?`}
                                                </h2>
                                                <p className="text-indigo-200 max-w-2xl mx-auto text-lg">
                                                    Book a free consultation with our career architects. Design your roadmap to success today.
                                                </p>
                                            </div>
                                            <Card className="bg-white/5 border-white/10 backdrop-blur-md shadow-2xl max-w-4xl mx-auto">
                                                <CardContent className="p-6 md:p-10">
                                                    <form onSubmit={handleEnquirySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {/* Form fields as previously defined */}
                                                        {[{ id: "name", label: "Full Name", type: "text" }, { id: "email", label: "Email Address", type: "email" }, { id: "phone", label: "Phone Number", type: "tel" }, { id: "role", label: "Aspiring Role", type: "text" }, { id: "timeSlot", label: "Preferred Time", type: "text" }].map(f => (
                                                            <div key={f.id} className="space-y-2">
                                                                <Label htmlFor={f.id} className="text-indigo-100 font-medium ml-1">{f.label}</Label>
                                                                <Input id={f.id} type={f.type} required={f.id !== 'role' && f.id !== 'timeSlot'} className="bg-slate-950/30 border-slate-700/50 text-white placeholder:text-slate-500 focus:ring-indigo-500 focus:border-indigo-500 h-12 rounded-xl" value={enquiryForm[f.id as keyof typeof enquiryForm]} onChange={(e) => setEnquiryForm({ ...enquiryForm, [f.id]: e.target.value })} />
                                                            </div>
                                                        ))}
                                                        <div className="space-y-2">
                                                            <Label htmlFor="status" className="text-indigo-100 font-medium ml-1">Current Status</Label>
                                                            <select id="status" className="w-full h-12 px-3 rounded-xl text-sm bg-slate-950/30 border border-slate-700/50 text-white focus:ring-indigo-500" value={enquiryForm.status} onChange={(e) => setEnquiryForm({ ...enquiryForm, status: e.target.value })}>
                                                                <option value="Fresher" className="bg-slate-900">Fresher / Student</option>
                                                                <option value="Experienced" className="bg-slate-900">Experienced Professional</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-span-1 md:col-span-2 space-y-2">
                                                            <Label htmlFor="notes" className="text-indigo-100 font-medium ml-1">Additional Notes</Label>
                                                            <Textarea id="notes" className="bg-slate-950/30 border-slate-700/50 text-white focus:ring-indigo-500 min-h-[100px] rounded-xl" value={enquiryForm.notes} onChange={(e) => setEnquiryForm({ ...enquiryForm, notes: e.target.value })} />
                                                        </div>
                                                        <div className="col-span-1 md:col-span-2 pt-4">
                                                            <Button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-6 text-lg shadow-xl hover:shadow-indigo-600/30 transition-all rounded-xl">
                                                                {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</> : <><ArrowRight className="mr-2 h-5 w-5" /> Submit Enquiry</>}
                                                            </Button>
                                                        </div>
                                                    </form>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>

                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh] text-slate-400 bg-white rounded-3xl shadow-sm border border-slate-100">
                                <div className="bg-slate-50 p-6 rounded-full mb-6 animate-pulse"><ArrowRight className="w-10 h-10 text-slate-300" /></div>
                                <h3 className="text-2xl font-bold text-slate-700 mb-2">Start Your Journey</h3>
                                <p className="max-w-md text-lg">Select a technology from the menu to discover your future career path.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
            <style>{`
                @keyframes float { 0% { transform: translateY(0px) rotate(0deg); opacity: 0; } 10% { opacity: 0.5; } 90% { opacity: 0.5; } 100% { transform: translateY(-100px) rotate(20deg); opacity: 0; } }
                .animate-float { animation-name: float; animation-timing-function: linear; animation-iteration-count: infinite; }
            `}</style>
        </div>
    );
};

// Helper Icon for Roadmap
function TrendingUpIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    )
}

export default CareerServices;
