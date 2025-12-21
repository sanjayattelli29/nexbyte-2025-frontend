import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface Program {
    _id: string;
    type: string;
    title: string;
    description: string;
    duration: string;
    mode: string;
    fee?: number;
    stipend?: number;
    skillsCovered: string;
    requiredSkills?: string;
    startDate: string;
    endDate?: string;
    registrationDeadline?: string;
    helplineNumber?: string;
    rounds?: { name: string }[];
}

interface Hackathon {
    _id: string;
    name: string;
    description: string;
    mode: string;
    startDate: string;
    registrationDeadline?: string;
    techStack: string;
    teamSize?: { min: number; max: number };
    isHidden?: boolean;
}

interface SectionHeaderProps {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    color: string;
}
import {
    Calendar,
    MapPin,
    ArrowRight,
    ArrowLeft,
    Loader2,
    Trophy,
    Users,
    ExternalLink,
    Zap,
    Briefcase,
    GraduationCap,
    Clock,
    PhoneCall,
    TrendingUp,
    ShieldCheck,
    Globe,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Events = () => {
    const [trainings, setTrainings] = useState<Program[]>([]);
    const [internships, setInternships] = useState<Program[]>([]);
    const [hackathons, setHackathons] = useState<Hackathon[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

    // Modal States
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
    const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);

    // Form States
    const [programForm, setProgramForm] = useState({
        fullName: "", email: "", phone: "", age: "", collegeName: "", year: "",
        resumeLink: "", whyJoin: "", whyApply: "", portfolioLink: ""
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [programsRes, hackathonsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/programs`),
                    fetch(`${API_BASE_URL}/api/hackathons`)
                ]);

                const programsData = await programsRes.json();
                const hackathonsData = await hackathonsRes.json();

                if (programsData.success) {
                    setTrainings(programsData.data.filter((p: Program) => p.type === "Training"));
                    setInternships(programsData.data.filter((p: Program) => p.type === "Internship"));
                }

                if (hackathonsData.success) {
                    setHackathons(hackathonsData.data.filter((h: Hackathon) => !h.isHidden));
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleReadMore = (id: string) => {
        setExpandedMap(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleProgramApply = (program: Program) => {
        setSelectedProgram(program);
        setProgramForm({
            fullName: "", email: "", phone: "", age: "", collegeName: "", year: "",
            resumeLink: "", whyJoin: "", whyApply: "", portfolioLink: ""
        });
        setIsProgramModalOpen(true);
    };

    const handleProgramSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...programForm,
                programType: selectedProgram.type,
                [selectedProgram.type === "Training" ? "trainingId" : "internshipId"]: selectedProgram._id
            };
            const response = await fetch(`${API_BASE_URL}/api/program-applications`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Application Submitted Successfully!");
                setIsProgramModalOpen(false);
            } else {
                toast.error("Failed to submit application");
            }
        } catch (error) {
            toast.error("Error submitting application");
        } finally {
            setSubmitting(false);
        }
    };

    const SectionHeader = ({ title, subtitle, icon: Icon, color }: SectionHeaderProps) => {
        const colorClasses = {
            blue: 'bg-blue-50 text-blue-700 border-blue-200',
            purple: 'bg-purple-50 text-purple-700 border-purple-200',
            orange: 'bg-orange-50 text-orange-700 border-orange-200',
            green: 'bg-green-50 text-green-700 border-green-200'
        };
        
        return (
            <div className="flex flex-col container mx-auto px-4 mb-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4 w-fit ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
                        <Icon className="w-4 h-4" />
                        <span className="uppercase tracking-wider">{subtitle}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
                </motion.div>
            </div>
        );
    };

    // --- CAROUSEL COMPONENT ---
    const Carousel = ({ children }: { children: React.ReactNode[] }) => {
        const [currentIndex, setCurrentIndex] = useState(0);

        if (!children || children.length === 0) return null;

        const nextSlide = () => {
            setCurrentIndex((prev) => (prev + 1) % children.length);
        };

        const prevSlide = () => {
            setCurrentIndex((prev) => (prev - 1 + children.length) % children.length);
        };

        return (
            <div className="container mx-auto px-4 relative max-w-7xl">
                <div className="relative overflow-hidden min-h-[380px] px-16">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="flex justify-center w-full"
                        >
                            {children[currentIndex]}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {children.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-gray-200 p-3 rounded-full shadow-lg text-gray-700 hover:text-primary hover:scale-110 hover:bg-white transition-all z-20 hover:shadow-xl"
                            aria-label="Previous slide"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-gray-200 p-3 rounded-full shadow-lg text-gray-700 hover:text-primary hover:scale-110 hover:bg-white transition-all z-20 hover:shadow-xl"
                            aria-label="Next slide"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        
                        {/* Carousel Indicators */}
                        <div className="flex justify-center gap-2 mt-6">
                            {children.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`transition-all duration-300 rounded-full ${
                                        index === currentIndex
                                            ? 'bg-primary w-8 h-2'
                                            : 'bg-gray-300 hover:bg-gray-400 w-2 h-2'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    };

    // --- NEW WIDE CARD DESIGNS (COMPACT) ---

    const renderTrainingCard = (program: Program) => {
        const isExpanded = expandedMap[program._id];
        return (
            <motion.div
                key={program._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="w-full"
            >
                <Card className="w-full bg-white border border-blue-200/60 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                    <div className="flex flex-col md:flex-row min-h-[320px]">
                        {/* LEFT CONTENT */}
                        <div className="p-7 md:p-8 flex-1 flex flex-col justify-between">
                            <div className="space-y-5">
                                <div className="flex justify-between items-start gap-4">
                                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-black text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg tracking-wider shadow-md">
                                        🎓 TRAINING
                                    </span>
                                    {program.fee > 0 && (
                                        <span className="text-blue-700 font-bold text-lg bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">₹{program.fee.toLocaleString()}</span>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">{program.title}</h3>
                                    <div className="text-gray-600 text-sm leading-relaxed">
                                        <p className={isExpanded ? '' : 'line-clamp-3'}>{program.description}</p>
                                        {program.description.length > 150 && (
                                            <button onClick={() => toggleReadMore(program._id)} className="text-blue-600 font-semibold text-sm mt-2 hover:underline inline-flex items-center gap-1">
                                                {isExpanded ? "Show Less" : "Read More"} <ArrowRight className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-5">
                                <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span>{program.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span>{program.mode}</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                                    <p className="text-xs text-blue-700 font-bold uppercase mb-2 tracking-wide">Skills You'll Master</p>
                                    <p className="text-sm text-gray-800 font-medium">{program.skillsCovered}</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT PANEL */}
                        <div className="md:w-80 bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 border-l border-blue-200/50 p-7 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-xs text-gray-500 font-bold uppercase mb-1.5 tracking-wide">Start Date</p>
                                    <p className="text-gray-900 font-bold text-lg">{new Date(program.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                                {program.endDate && (
                                    <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                                        <p className="text-xs text-gray-500 font-bold uppercase mb-1.5 tracking-wide">End Date</p>
                                        <p className="text-gray-900 font-bold text-lg">{new Date(program.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                )}
                                <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-xs text-gray-500 font-bold uppercase mb-1.5 tracking-wide">Apply Before</p>
                                    <p className="text-red-600 font-bold text-lg">{program.registrationDeadline ? new Date(program.registrationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Open"}</p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-300/50 text-white font-semibold py-6 text-base" onClick={() => handleProgramApply(program)}>
                                    Apply Now <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>

                                {program.helplineNumber && (
                                    <div className="flex items-center justify-center gap-2 text-blue-700 font-semibold text-xs bg-white/70 backdrop-blur-sm py-2 rounded-lg">
                                        <PhoneCall className="w-3.5 h-3.5" /> {program.helplineNumber}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        );
    };

    const renderInternshipCard = (program: Program) => {
        const isExpanded = expandedMap[program._id];
        return (
            <motion.div
                key={program._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="w-full"
            >
                <Card className="w-full bg-white border border-purple-200/60 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                    <div className="flex flex-col md:flex-row min-h-[320px]">
                        {/* LEFT CONTENT */}
                        <div className="p-7 md:p-8 flex-1 flex flex-col justify-between">
                            <div className="space-y-5">
                                <div className="flex justify-between items-start gap-4">
                                    <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-black text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg tracking-wider shadow-md">
                                        💼 INTERNSHIP
                                    </span>
                                    {program.stipend > 0 && (
                                        <span className="text-green-700 font-bold text-sm bg-green-100 px-3 py-1.5 rounded-lg border border-green-300 flex items-center gap-1">
                                            💰 ₹{program.stipend.toLocaleString()}/mo
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-purple-600 transition-colors">{program.title}</h3>
                                    <div className="text-gray-600 text-sm leading-relaxed">
                                        <p className={isExpanded ? '' : 'line-clamp-3'}>{program.description}</p>
                                        {program.description.length > 150 && (
                                            <button onClick={() => toggleReadMore(program._id)} className="text-purple-600 font-semibold text-sm mt-2 hover:underline inline-flex items-center gap-1">
                                                {isExpanded ? "Show Less" : "Read More"} <ArrowRight className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-5">
                                <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <span>{program.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <span>{program.mode}</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                                    <p className="text-xs text-purple-700 font-bold uppercase mb-2 tracking-wide">Required Skills</p>
                                    <p className="text-sm text-gray-800 font-medium mb-3">{program.requiredSkills}</p>
                                    {program.rounds && program.rounds.length > 0 && (
                                        <div className="pt-3 border-t border-purple-200">
                                            <p className="text-xs text-purple-700 font-bold uppercase mb-2 tracking-wide">Rounds of Internship</p>
                                            <div className="flex flex-wrap gap-2">
                                                {program.rounds.map((r: { name: string }, i: number) => (
                                                    <span key={i} className="text-[10px] bg-white border border-purple-300 px-2 py-1 rounded-md text-purple-700 font-bold">{r.name}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT PANEL */}
                        <div className="md:w-80 bg-gradient-to-br from-purple-50 via-purple-50 to-pink-50 border-l border-purple-200/50 p-7 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-xs text-gray-500 font-bold uppercase mb-1.5 tracking-wide">Start Date</p>
                                    <p className="text-gray-900 font-bold text-lg">{new Date(program.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                                {program.endDate && (
                                    <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                                        <p className="text-xs text-gray-500 font-bold uppercase mb-1.5 tracking-wide">End Date</p>
                                        <p className="text-gray-900 font-bold text-lg">{new Date(program.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                )}
                                <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-xs text-gray-500 font-bold uppercase mb-1.5 tracking-wide">Application Deadline</p>
                                    <p className="text-red-600 font-bold text-lg">{program.registrationDeadline ? new Date(program.registrationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Rolling Basis"}</p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <Button className="w-full bg-purple-600 hover:bg-purple-700 shadow-lg text-white font-semibold py-6 text-base" onClick={() => handleProgramApply(program)}>
                                    Apply Now <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>

                                {program.helplineNumber && (
                                    <div className="flex items-center justify-center gap-2 text-purple-700 font-semibold text-xs bg-white/70 backdrop-blur-sm py-2 rounded-lg">
                                        <PhoneCall className="w-3.5 h-3.5" /> {program.helplineNumber}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        );
    }

    const renderHackathonCard = (hackathon: Hackathon & { prizeMoney?: string; benefits?: string }) => {
        const isExpanded = expandedMap[hackathon._id];
        const truncateText = (text: string, maxLength: number) => {
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + '...';
        };

        return (
            <motion.div
                key={hackathon._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="w-full"
            >
                <Card className="w-full bg-white border border-orange-200/60 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                    <div className="flex flex-col md:flex-row min-h-[320px]">
                        <div className="p-7 md:p-8 flex-1 flex flex-col justify-between">
                            <div className="space-y-5">
                                <div className="flex flex-wrap justify-between items-start gap-3">
                                    <div className="flex gap-2">
                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border shadow-sm ${hackathon.mode === 'Online' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-black border-green-600' : 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-600'}`}>
                                            {hackathon.mode === 'Online' ? '🌐 ONLINE' : '📍 OFFLINE'}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-orange-700 text-[10px] font-bold bg-gradient-to-r from-orange-100 to-yellow-100 px-3 py-1.5 rounded-lg border border-orange-300 shadow-sm">
                                            <Trophy className="w-3.5 h-3.5" /> WIN PRIZES
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-600 text-[10px] font-bold bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-300">
                                        <Users className="w-3.5 h-3.5" /> {hackathon.teamSize?.min}-{hackathon.teamSize?.max} Members
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-orange-600 transition-colors">{hackathon.name}</h3>
                                    <div className="text-gray-600 text-sm leading-relaxed">
                                        <p className={isExpanded ? '' : 'line-clamp-3'}>{hackathon.description}</p>
                                        {hackathon.description.length > 150 && (
                                            <button onClick={() => toggleReadMore(hackathon._id)} className="text-orange-600 font-semibold text-sm mt-2 hover:underline inline-flex items-center gap-1">
                                                {isExpanded ? "Show Less" : "Read More"} <ArrowRight className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-200">
                                    <p className="text-xs text-orange-800 font-bold uppercase mb-3 flex items-center gap-1.5"><Zap className="w-4 h-4" /> Tech Stack</p>
                                    <div className="flex flex-wrap gap-2">
                                        {hackathon.techStack.split(",").map((tech: string, idx: number) => (
                                            <span key={idx} className="text-xs px-3 py-1.5 bg-white text-gray-700 rounded-lg border border-orange-300 font-semibold shadow-sm hover:shadow-md transition-shadow">
                                                {tech.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {hackathon.benefits && (
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200 mt-4">
                                        <p className="text-xs text-purple-800 font-bold uppercase mb-2 flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> What You'll Get</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">{hackathon.benefits}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="md:w-80 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-l border-orange-200/50 p-7 flex flex-col justify-between">
                            <div className="space-y-4">
                                {hackathon.prizeMoney && (
                                    <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 p-4 rounded-xl shadow-lg text-center mb-4">
                                        <Trophy className="w-6 h-6 text-white mx-auto mb-2" />
                                        <p className="text-xs font-bold text-white uppercase tracking-wider mb-1">Prize Pool</p>
                                        <p className="text-2xl font-extrabold text-white">{hackathon.prizeMoney}</p>
                                    </div>
                                )}

                                <div className="bg-white p-4 rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-xs text-gray-500 font-bold uppercase mb-1.5 tracking-wide">Start Date</p>
                                    <p className="text-gray-900 font-bold text-lg">{hackathon.startDate}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-xs text-gray-500 font-bold uppercase mb-1.5 tracking-wide">Register Before</p>
                                    <p className="text-red-600 font-bold text-lg">{hackathon.registrationDeadline || "Open"}</p>
                                </div>
                            </div>

                            <Link to="/services/hackathons" className="w-full mt-6">
                                <Button className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-orange-700 hover:to-red-600 text-white shadow-lg shadow-orange-300/50 font-semibold py-6 text-base">
                                    View Details <ExternalLink className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </motion.div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-blue-50 via-purple-50 to-white relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
                </div>
                
                <div className="container px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-blue-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 border border-blue-200 shadow-sm">
                            <Calendar className="w-3.5 h-3.5" />
                            Events & Opportunities
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-gray-900 tracking-tight">
                            Learn, Compete &{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                                Grow Together
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
                            Discover our latest training programs, internships, and hackathons designed to accelerate your career and unlock new opportunities.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
                                <GraduationCap className="w-5 h-5 text-blue-600" />
                                <span className="font-medium text-gray-700">{trainings.length} Training Programs</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
                                <Briefcase className="w-5 h-5 text-purple-600" />
                                <span className="font-medium text-gray-700">{internships.length} Internships</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
                                <Trophy className="w-5 h-5 text-orange-600" />
                                <span className="font-medium text-gray-700">{hackathons.length} Hackathons</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                    <p className="text-gray-600 font-medium">Loading amazing opportunities...</p>
                </div>
            ) : (
                <div className="space-y-16 pb-20 pt-8">

                    {/* Training Section */}
                    {trainings.length > 0 && (
                        <section className="py-8 bg-gradient-to-b from-blue-50/30 to-transparent">
                            <SectionHeader title="Expert-Led Training" subtitle="Skill Development" icon={GraduationCap} color="blue" />
                            <Carousel>
                                {trainings.map(renderTrainingCard)}
                            </Carousel>
                        </section>
                    )}

                    {/* Internships Section */}
                    {internships.length > 0 && (
                        <section className="py-8 bg-gradient-to-b from-purple-50/30 to-transparent">
                            <SectionHeader title="Internship Opportunities" subtitle="Real Experience" icon={Briefcase} color="purple" />
                            <Carousel>
                                {internships.map(renderInternshipCard)}
                            </Carousel>
                        </section>
                    )}

                    {/* Hackathons Section */}
                    {hackathons.length > 0 && (
                        <section className="py-8 bg-gradient-to-b from-orange-50/30 to-transparent">
                            <SectionHeader title="Hackathons & Challenges" subtitle="Compete & Win" icon={Trophy} color="orange" />
                            <Carousel>
                                {hackathons.map(renderHackathonCard)}
                            </Carousel>
                        </section>
                    )}

                    {/* NEW: Why Choose Our Programs Section (Benefits) */}
                    <section className="container mx-auto px-4 py-20 mt-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center mb-16 text-center"
                        >
                            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-full text-xs font-bold mb-6 uppercase tracking-wide border-2 border-green-200 shadow-md">
                                <ShieldCheck className="w-4 h-4" />
                                Career Benefits
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Why Join Our Programs?</h2>
                            <p className="text-gray-600 text-base md:text-lg max-w-2xl">Discover the advantages that set our programs apart and accelerate your career growth</p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <Card className="border-2 border-blue-100 shadow-xl bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full overflow-hidden">
                                    <CardHeader className="text-center pb-3 pt-8">
                                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg">
                                            <TrendingUp className="w-10 h-10" />
                                        </div>
                                        <CardTitle className="text-2xl font-bold text-gray-900">Skill Growth</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 pt-2 px-6 pb-6">
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                <span>Technical Experts</span>
                                                <span className="text-blue-600 text-sm">95%</span>
                                            </div>
                                            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: "95%" }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1, delay: 0.3 }}
                                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                <span>Practical Knowledge</span>
                                                <span className="text-blue-600 text-sm">98%</span>
                                            </div>
                                            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: "98%" }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1, delay: 0.5 }}
                                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Card className="border-2 border-purple-200 shadow-2xl bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative md:scale-105 h-full overflow-visible">
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-6 py-2 rounded-full uppercase tracking-wider shadow-lg z-10">
                                        Most Popular
                                    </div>
                                    <CardHeader className="text-center pb-3 pt-10">
                                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg">
                                            <ShieldCheck className="w-10 h-10" />
                                        </div>
                                        <CardTitle className="text-2xl font-bold text-gray-900">Career Security</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center text-sm text-gray-600 pt-2 px-6 pb-6">
                                        <p className="mb-8 font-medium leading-relaxed text-base">Recognized certifications boosting your employability and career prospects.</p>
                                        <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-200">
                                            <div className="flex justify-center items-end gap-4 h-32 w-full">
                                                <div className="flex flex-col items-center gap-2 w-1/3">
                                                    <div className="w-full bg-gradient-to-t from-purple-400 to-purple-300 h-16 rounded-t-lg shadow-md"></div>
                                                    <span className="text-xs font-bold text-gray-600">Q1</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-2 w-1/3">
                                                    <div className="w-full bg-gradient-to-t from-purple-500 to-purple-400 h-20 rounded-t-lg shadow-md"></div>
                                                    <span className="text-xs font-bold text-gray-600">Q2</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-2 w-1/3">
                                                    <div className="w-full bg-gradient-to-t from-purple-600 to-purple-500 h-32 rounded-t-lg shadow-lg relative">
                                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow-lg">
                                                            100%
                                                        </div>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-600">Q3</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Card className="border-2 border-green-100 shadow-xl bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full overflow-hidden">
                                    <CardHeader className="text-center pb-3 pt-8">
                                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg">
                                            <Globe className="w-10 h-10" />
                                        </div>
                                        <CardTitle className="text-2xl font-bold text-gray-900">Global Network</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center text-sm text-gray-600 pt-2 px-6 pb-6">
                                        <p className="mb-8 font-medium leading-relaxed text-base">Connect with mentors & peers worldwide through our exclusive community.</p>
                                        <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-200">
                                            <div className="flex justify-center -space-x-4">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="w-14 h-14 rounded-full border-4 border-white bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-sm font-bold text-white shadow-lg hover:scale-110 hover:z-10 transition-transform">
                                                        U{i}
                                                    </div>
                                                ))}
                                                <div className="w-14 h-14 rounded-full border-4 border-white bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-xs font-bold text-white shadow-lg hover:scale-110 hover:z-10 transition-transform">
                                                    +1k
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </section>
                </div>
            )}

            {/* Application Modal */}
            <Dialog open={isProgramModalOpen} onOpenChange={setIsProgramModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Apply for {selectedProgram?.title}</DialogTitle>
                        <DialogDescription>
                            Complete the form below to submit your application for this {selectedProgram?.type.toLowerCase()}.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleProgramSubmit} className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input required value={programForm.fullName} onChange={e => setProgramForm({ ...programForm, fullName: e.target.value })} placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input required type="email" value={programForm.email} onChange={e => setProgramForm({ ...programForm, email: e.target.value })} placeholder="john@example.com" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input required type="tel" value={programForm.phone} onChange={e => setProgramForm({ ...programForm, phone: e.target.value })} placeholder="+91 98765 43210" />
                            </div>
                            <div className="space-y-2">
                                <Label>Age</Label>
                                <Input required type="number" min="16" value={programForm.age} onChange={e => setProgramForm({ ...programForm, age: e.target.value })} placeholder="21" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>College / University Name</Label>
                            <Input required value={programForm.collegeName} onChange={e => setProgramForm({ ...programForm, collegeName: e.target.value })} placeholder="XYZ Institute of Technology" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Year of Study</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={programForm.year} onChange={e => setProgramForm({ ...programForm, year: e.target.value })} required>
                                    <option value="">Select Year</option>
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                    <option value="Graduate">Graduate</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Resume Link (Google Drive/LinkedIn)</Label>
                                <Input required type="url" value={programForm.resumeLink} onChange={e => setProgramForm({ ...programForm, resumeLink: e.target.value })} placeholder="https://..." />
                            </div>
                        </div>

                        {selectedProgram?.type === "Training" ? (
                            <div className="space-y-2">
                                <Label>Why do you want to join this training?</Label>
                                <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm border-gray-200" required value={programForm.whyJoin} onChange={e => setProgramForm({ ...programForm, whyJoin: e.target.value })} placeholder="Tell us about your learning goals..." />
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <Label>Why should we hire you for this internship?</Label>
                                    <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm border-gray-200" required value={programForm.whyApply} onChange={e => setProgramForm({ ...programForm, whyApply: e.target.value })} placeholder="Highlight your skills and passion..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>Portfolio / GitHub Link</Label>
                                    <Input value={programForm.portfolioLink} onChange={e => setProgramForm({ ...programForm, portfolioLink: e.target.value })} placeholder="https://github.com/..." />
                                </div>
                            </>
                        )}

                        <Button type="submit" className="w-full" disabled={submitting}>
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Submit Application
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
};

export default Events;
