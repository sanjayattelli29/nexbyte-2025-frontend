import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Trophy, Code, Zap, Users, CheckCircle2, Calendar, MapPin, ExternalLink,
    Lightbulb, Rocket, Award, MessageSquare, Clock, ArrowLeft, ArrowRight, Star, ShieldCheck, Target, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Carousel from "@/components/Carousel";

const Hackathons = () => {
    const [hackathons, setHackathons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedHackathon, setSelectedHackathon] = useState<any | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

    // Application Form States
    const [individualForm, setIndividualForm] = useState({
        fullName: "", email: "", phone: "", organization: "", rollNumber: "", experienceLevel: "Beginner", github: ""
    });

    const [teamForm, setTeamForm] = useState({
        teamName: "",
        leader: { fullName: "", email: "", phone: "", organization: "", rollNumber: "", experienceLevel: "Intermediate", github: "" },
        member1: { fullName: "", email: "" },
        member2: { fullName: "", email: "" },
        member3: { fullName: "", email: "" }
    });

    useEffect(() => {
        fetchHackathons();
    }, []);

    const fetchHackathons = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/hackathons`);
            const data = await response.json();
            if (data.success) {
                // Filter out hidden hackathons
                const visibleHackathons = data.data.filter((h: any) => !h.isHidden);
                console.log('Fetched hackathons:', visibleHackathons);
                setHackathons(visibleHackathons);
            }
        } catch (error) {
            console.error("Error fetching hackathons:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleIndividualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                hackathonId: selectedHackathon?._id,
                participantType: "Individual",
                ...individualForm
            };
            const response = await fetch(`${API_BASE_URL}/api/applications`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (data.success) {
                setShowSuccess(true);
            } else {
                toast.error("Submission failed");
            }
        } catch (error) {
            toast.error("Error submitting application");
        }
    };

    const handleTeamSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Filter empty members
            const members = [teamForm.member1, teamForm.member2, teamForm.member3].filter(m => m.email);

            const payload = {
                hackathonId: selectedHackathon?._id,
                participantType: "Team",
                teamName: teamForm.teamName,
                role: "Leader",
                leader: teamForm.leader,
                teamMembers: members
            };

            const response = await fetch(`${API_BASE_URL}/api/applications`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (data.success) {
                setShowSuccess(true);
            } else {
                toast.error("Submission failed");
            }
        } catch (error) {
            toast.error("Error submitting application");
        }
    };

    const toggleReadMore = (id: string) => {
        setExpandedMap(prev => ({ ...prev, [id]: !prev[id] }));
    };



    const renderHackathonCard = (hackathon: any) => {
        const isExpanded = expandedMap[hackathon._id];
        const truncateText = (text: string, maxLength: number) => {
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + '...';
        };

        return <motion.div
            key={hackathon._id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="w-full"
        >
            <Card className="w-full bg-white border border-orange-200/60 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                <div className="flex flex-col md:flex-row">
                    {/* Left Section - Main Content */}
                    <div className="p-4 md:p-8 flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                                <div className="bg-orange-100 text-orange-600 p-2 md:p-3 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                                    <Trophy className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-1 md:mb-2 leading-tight">{hackathon.name}</h3>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                        <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-semibold ${hackathon.mode === 'Online'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {hackathon.mode}
                                        </span>
                                        <span className="text-[10px] md:text-xs text-gray-500 font-medium">
                                            Team: {hackathon.teamSize?.min || 1}-{hackathon.teamSize?.max || 4} ppl
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-3 md:line-clamp-none">
                                {isExpanded ? hackathon.description : truncateText(hackathon.description, 120)}
                                {hackathon.description.length > 120 && (
                                    <button
                                        type="button"
                                        onClick={() => toggleReadMore(hackathon._id)}
                                        className="text-orange-600 hover:text-orange-700 font-medium ml-1 text-xs"
                                    >
                                        {isExpanded ? 'Less' : 'More'}
                                    </button>
                                )}
                            </p>

                            {/* Tech Stack - Compact */}
                            <div className="mb-3">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <Code className="w-3 h-3 text-orange-600" />
                                    <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wide">Tech Stack</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {hackathon.techStack.split(',').slice(0, 6).map((tech: string, i: number) => (
                                        <span key={i} className="px-2 py-0.5 bg-orange-50 text-orange-700 text-[10px] rounded border border-orange-200 font-medium">
                                            {tech.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Benefits - Compact */}
                            {hackathon.benefits && (
                                <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-100">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Sparkles className="w-3 h-3 text-purple-600" />
                                        <span className="text-[10px] font-bold text-purple-700 uppercase">Perks</span>
                                    </div>
                                    <p className="text-xs text-gray-700 leading-snug line-clamp-2">{hackathon.benefits}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Section - Sidebar/Footer */}
                    <div className="md:w-72 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-t md:border-t-0 md:border-l border-orange-200/50 p-4 md:p-6 flex flex-col justify-between">
                        <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                            {hackathon.prizeMoney && (
                                <div className="col-span-2 md:col-span-1 bg-white/80 p-2.5 rounded-xl border border-orange-200 shadow-sm text-center">
                                    <p className="text-[10px] font-bold text-orange-600 uppercase mb-0.5">Prize Pool</p>
                                    <p className="text-lg md:text-xl font-extrabold text-gray-900">{hackathon.prizeMoney}</p>
                                </div>
                            )}

                            <div className="bg-white/60 p-2.5 rounded-lg border border-orange-100">
                                <p className="text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Start Date</p>
                                <p className="text-xs md:text-sm font-bold text-gray-900">{new Date(hackathon.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                            </div>

                            <div className="bg-white/60 p-2.5 rounded-lg border border-orange-100">
                                <p className="text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Register By</p>
                                <p className="text-xs md:text-sm font-bold text-red-600">{new Date(hackathon.registrationDeadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                            </div>

                            {(hackathon.helplineNumber || hackathon.organizerContact) && (
                                <div className="col-span-2 md:col-span-1 flex items-center gap-2 bg-white/60 p-2 rounded-lg border border-orange-100">
                                    <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
                                    <span className="text-xs font-medium text-gray-700 truncate">{hackathon.helplineNumber || hackathon.organizerContact}</span>
                                </div>
                            )}
                        </div>

                        <Button
                            onClick={() => setSelectedHackathon(hackathon)}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 md:py-3 text-sm rounded-xl shadow-md shadow-orange-200 mt-4 md:mt-6 transition-all"
                        >
                            Apply Now
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
            ;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-orange-50 via-amber-50 to-white relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-0 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
                </div>

                <div className="container px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-orange-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 border border-orange-200 shadow-sm">
                            <Trophy className="w-3.5 h-3.5" />
                            Hackathons & Challenges
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-gray-900 tracking-tight">
                            Compete, Innovate & <br />
                            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">Win Big</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
                            Join our vibrant community of developers. Showcase your skills and accelerate your career through exciting coding challenges.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-100 rounded-lg shadow-sm">
                                <Trophy className="w-4 h-4 text-orange-600" />
                                <span className="font-medium text-gray-700">Win Prizes</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-100 rounded-lg shadow-sm">
                                <Users className="w-4 h-4 text-orange-600" />
                                <span className="font-medium text-gray-700">Team Collaboration</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-100 rounded-lg shadow-sm">
                                <Code className="w-4 h-4 text-orange-600" />
                                <span className="font-medium text-gray-700">Real Projects</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Hackathons Section with Carousel */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white">
                    <Trophy className="w-12 h-12 animate-bounce text-orange-500 mb-4" />
                    <p className="text-gray-600 font-medium">Loading amazing hackathons...</p>
                </div>
            ) : hackathons.length === 0 ? (
                <section className="py-20">
                    <div className="container px-4 text-center">
                        <div className="max-w-md mx-auto">
                            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Hackathons Yet</h3>
                            <p className="text-gray-600">Check back soon for exciting coding challenges!</p>
                        </div>
                    </div>
                </section>
            ) : (
                <section className="py-16 bg-gradient-to-b from-orange-50/30 to-transparent">
                    <div className="container mx-auto px-4 mb-10">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4 bg-orange-50 text-orange-700 border-orange-200">
                                <Trophy className="w-4 h-4" />
                                <span className="uppercase tracking-wider">Upcoming Challenges</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Hackathons</h2>
                        </motion.div>
                    </div>
                    <Carousel>
                        {hackathons.map(renderHackathonCard)}
                    </Carousel>
                </section>
            )}

            {/* VISUAL PROCESS FLOW SECTION */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white border-y border-gray-200/40">
                <div className="container px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-orange-200">
                            <Rocket className="w-3.5 h-3.5" />
                            Roadmap to Victory
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">How It Works</h2>
                        <p className="text-gray-600 mt-4">
                            From registration to the grand finale, here's your journey to becoming a hackathon champion.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connector Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-200 to-transparent -translate-y-1/2 z-0" />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                            {[
                                { icon: Users, title: "1. Register & Team Up", desc: "Sign up individually or form a team of up to 4 innovators." },
                                { icon: Lightbulb, title: "2. Ideate & Build", desc: "Brainstorm solutions and code your prototype within the timeframe." },
                                { icon: Rocket, title: "3. Submit Project", desc: "Submit your code, tech stack and demo video before the deadline." },
                                { icon: Trophy, title: "4. Win Prizes", desc: "Top teams win cash prizes, swag, and internship opportunities." }
                            ].map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white border-2 border-orange-100 p-6 rounded-2xl text-center shadow-lg relative group hover:-translate-y-2 hover:border-orange-300 transition-all duration-300"
                                >
                                    <div className="w-14 h-14 mx-auto bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                                        <step.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2 text-gray-900">{step.title}</h3>
                                    <p className="text-sm text-gray-600">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ADVANTAGES / BENEFITS SECTION */}
            <section className="container mx-auto px-4 py-20 mt-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center mb-16 text-center"
                >
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 rounded-full text-xs font-bold mb-6 uppercase tracking-wide border-2 border-orange-200 shadow-md">
                        <ShieldCheck className="w-4 h-4" />
                        Why Participate
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Unlock Your Potential</h2>
                    <p className="text-gray-600 text-base md:text-lg max-w-2xl">Hackathons are gateways to career growth, networking, and real-world problem-solving excellence</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card className="p-8 h-full border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-xl group bg-gradient-to-br from-white to-orange-50/30">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Trophy className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Career Acceleration</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Top performers get direct interview opportunities with partner companies and exclusive job placement support.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-sm text-gray-700">
                                    <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                    <span>Direct company interviews</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-700">
                                    <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                    <span>Internship opportunities</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-700">
                                    <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                    <span>Portfolio enhancement</span>
                                </li>
                            </ul>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="p-8 h-full border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-xl group bg-gradient-to-br from-white to-purple-50/30">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Network & Connect</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Build lasting connections with like-minded developers, industry mentors, and tech leaders.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-sm text-gray-700">
                                    <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                                    <span>Meet industry experts</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-700">
                                    <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                                    <span>Collaborate with peers</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-700">
                                    <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                                    <span>Join tech community</span>
                                </li>
                            </ul>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Card className="p-8 h-full border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl group bg-gradient-to-br from-white to-blue-50/30">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Win Exciting Prizes</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Compete for cash rewards, gadgets, swag, and exclusive recognition for your innovative solutions.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-sm text-gray-700">
                                    <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span>Cash prizes & rewards</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-700">
                                    <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span>Premium merchandise</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-700">
                                    <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span>Certificates & badges</span>
                                </li>
                            </ul>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section className="py-20 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 text-white relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                <div className="container px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                            <Award className="w-3.5 h-3.5" />
                            Success Stories
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">Voice of Champions</h2>
                        <p className="text-white/90 text-lg">Hear from our past winners and participants</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            { name: "Alex Johnson", role: "Full Stack Developer", quote: "Winning the NexByte Webathon gave me the confidence to launch my own startup. The mentorship was invaluable." },
                            { name: "Sarah Williams", role: "AI Enthusiast", quote: "The problem statements were challenging and relevant. It pushed me to learn new ML frameworks in just 48 hours!" },
                            { name: "Rahul Gupta", role: "Frontend Ninja", quote: "Best organization I've seen. Smooth process, great support, and the networking helped me land my first internship." }
                        ].map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl text-left shadow-xl hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="mb-4 flex gap-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-700 italic mb-6 leading-relaxed">"{t.quote}"</p>
                                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{t.name}</p>
                                        <p className="text-sm text-gray-600">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Application Modal */}
            <Dialog open={!!selectedHackathon} onOpenChange={(open) => {
                if (!open) {
                    setSelectedHackathon(null);
                    setShowSuccess(false);
                }
            }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    {!showSuccess ? (
                        <>
                            <DialogHeader>
                                <DialogTitle>Apply for {typeof selectedHackathon === 'object' ? selectedHackathon?.name : ''}</DialogTitle>
                                <DialogDescription>
                                    Select your participation type and fill in the details.
                                </DialogDescription>
                            </DialogHeader>

                            <Tabs defaultValue="individual" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                    <TabsTrigger value="individual">Individual Participant</TabsTrigger>
                                    <TabsTrigger value="team">Team Registration</TabsTrigger>
                                </TabsList>

                                {/* INDIVIDUAL FORM */}
                                <TabsContent value="individual">
                                    <form onSubmit={handleIndividualSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Full Name</Label>
                                                <Input required value={individualForm.fullName} onChange={e => setIndividualForm({ ...individualForm, fullName: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Email</Label>
                                                <Input type="email" required value={individualForm.email} onChange={e => setIndividualForm({ ...individualForm, email: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Phone</Label>
                                                <Input type="tel" required value={individualForm.phone} onChange={e => setIndividualForm({ ...individualForm, phone: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Organization</Label>
                                                <Input required value={individualForm.organization} onChange={e => setIndividualForm({ ...individualForm, organization: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Roll Number</Label>
                                                <Input value={individualForm.rollNumber} onChange={e => setIndividualForm({ ...individualForm, rollNumber: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Experience Level</Label>
                                                <select className="w-full border rounded-md px-3 py-2" value={individualForm.experienceLevel} onChange={e => setIndividualForm({ ...individualForm, experienceLevel: e.target.value })}>
                                                    <option>Beginner</option>
                                                    <option>Intermediate</option>
                                                    <option>Advanced</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>GitHub Profile (Optional)</Label>
                                            <Input type="url" value={individualForm.github} onChange={e => setIndividualForm({ ...individualForm, github: e.target.value })} />
                                        </div>
                                        <Button type="submit" className="w-full">Submit Application</Button>
                                    </form>
                                </TabsContent>

                                {/* TEAM FORM */}
                                <TabsContent value="team">
                                    <form onSubmit={handleTeamSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Team Name</Label>
                                            <Input required value={teamForm.teamName} onChange={e => setTeamForm({ ...teamForm, teamName: e.target.value })} />
                                        </div>
                                        <div className="border-t pt-4">
                                            <h4 className="font-semibold mb-4">Team Leader Details</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Full Name</Label>
                                                    <Input required value={teamForm.leader.fullName} onChange={e => setTeamForm({ ...teamForm, leader: { ...teamForm.leader, fullName: e.target.value } })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Email</Label>
                                                    <Input type="email" required value={teamForm.leader.email} onChange={e => setTeamForm({ ...teamForm, leader: { ...teamForm.leader, email: e.target.value } })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Phone</Label>
                                                    <Input type="tel" required value={teamForm.leader.phone} onChange={e => setTeamForm({ ...teamForm, leader: { ...teamForm.leader, phone: e.target.value } })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Organization</Label>
                                                    <Input required value={teamForm.leader.organization} onChange={e => setTeamForm({ ...teamForm, leader: { ...teamForm.leader, organization: e.target.value } })} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border-t pt-4">
                                            <h4 className="font-semibold mb-4">Team Members (Optional - Up to 3)</h4>
                                            {[1, 2, 3].map(num => {
                                                const key = `member${num}` as 'member1' | 'member2' | 'member3';
                                                return (
                                                    <div key={num} className="grid grid-cols-2 gap-4 mb-4">
                                                        <div className="space-y-2">
                                                            <Label>Member {num} Name</Label>
                                                            <Input value={teamForm[key].fullName} onChange={e => setTeamForm({ ...teamForm, [key]: { ...teamForm[key], fullName: e.target.value } })} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Member {num} Email</Label>
                                                            <Input type="email" value={teamForm[key].email} onChange={e => setTeamForm({ ...teamForm, [key]: { ...teamForm[key], email: e.target.value } })} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <Button type="submit" className="w-full">Submit Team Application</Button>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                            >
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </motion.div>
                            <h3 className="text-2xl font-bold mb-2">Application Submitted!</h3>
                            <p className="text-muted-foreground mb-6">
                                Good luck! We'll review your application and get back to you soon.
                            </p>
                            <Button onClick={() => { setShowSuccess(false); setSelectedHackathon(null); }}>
                                Close
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
};

export default Hackathons;
