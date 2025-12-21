import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Trophy, Code, Zap, Users, CheckCircle2, Calendar, MapPin, ExternalLink,
    Lightbulb, Rocket, Award, MessageSquare, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

const Hackathons = () => {
    const [hackathons, setHackathons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedHackathon, setSelectedHackathon] = useState<any | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

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

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-gradient-hero">
                <div className="container px-4 text-center max-w-4xl mx-auto">
                    <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                        Hackathons & Events
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Compete, Innovate & <br />
                        <span className="text-gradient-primary">Win Big</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                        Join our vibrant community of developers. Showcase your skills and accelerate your career.
                    </p>
                </div>
            </section>

            {/* Upcoming Hackathons List */}
            <section className="py-20">
                <div className="container px-4">
                    <h2 className="text-3xl font-bold mb-10 text-center">Upcoming Hackathons</h2>

                    {loading ? (
                        <div className="text-center">Loading events...</div>
                    ) : hackathons.length === 0 ? (
                        <div className="text-center text-muted-foreground">No upcoming hackathons scheduled. Check back soon!</div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {hackathons.map((hackathon) => (
                                <motion.div
                                    key={hackathon._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="group bg-card border border-border rounded-xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${hackathon.mode === 'Online' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {hackathon.mode}
                                        </span>
                                    </div>

                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="bg-primary/10 text-primary p-3 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                            <Trophy className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold leading-tight">{hackathon.name}</h3>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Deadline: <span className="font-medium text-red-500">{hackathon.registrationDeadline ? new Date(hackathon.registrationDeadline).toLocaleDateString() : 'TBA'}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                                        {hackathon.description}
                                    </p>

                                    {/* Tech Stack Chips */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {hackathon.techStack.split(',').map((tech: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-secondary/50 text-secondary-foreground text-[10px] rounded-md font-medium border border-secondary">
                                                {tech.trim()}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-auto space-y-3 pt-4 border-t border-border/50">
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-primary" />
                                                <span>{new Date(hackathon.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(hackathon.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Users className="w-3.5 h-3.5 text-primary" />
                                                <span>Team: {hackathon.teamSize?.min}-{hackathon.teamSize?.max}</span>
                                            </div>
                                        </div>

                                        {(hackathon.helplineNumber || hackathon.organizerContact) && (
                                            <div className="flex flex-col gap-1 text-[10px] text-muted-foreground bg-muted/30 p-2 rounded-lg">
                                                {hackathon.helplineNumber && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold">Helpline:</span> {hackathon.helplineNumber}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <Button className="w-full shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300" onClick={() => setSelectedHackathon(hackathon)}>
                                            Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* VISUAL PROCESS FLOW SECTION */}
            <section className="py-20 bg-secondary/5 border-y border-border/40">
                <div className="container px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-primary font-semibold tracking-wider text-sm uppercase">Roadmap to Victory</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2">How It Works</h2>
                        <p className="text-muted-foreground mt-4">
                            From registration to the grand finale, here's your journey to becoming a hackathon champion.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connector Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2 z-0" />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                            {[
                                { icon: Users, title: "1. Register & Team Up", desc: "Sign up individually or form a team of up to 4 innovators." },
                                { icon: Lightbulb, title: "2. Ideate & Build", desc: "Brainstorm solutions and code your prototype within the timeframe." },
                                { icon: Rocket, title: "3. Submit Project", desc: "Submit your code text stack and demo video before the deadline." },
                                { icon: Trophy, title: "4. Win Prizes", desc: "Top teams win cash prizes, swag, and internship opportunities." }
                            ].map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-card border border-border p-6 rounded-2xl text-center shadow-lg relative group hover:-translate-y-2 transition-transform duration-300"
                                >
                                    <div className="w-14 h-14 mx-auto bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <step.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ADVANTAGES / BENEFITS SECTION */}
            <section className="py-20">
                <div className="container px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-primary font-semibold tracking-wider text-sm uppercase">Why Participate?</span>
                            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">Unlock Your Potential</h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Hackathons are more than just coding competitions. They are gateways to career growth, networking, and real-world problem solving.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { title: "Career Acceleration", desc: "Top performers get direct interview opportunities with partner companies." },
                                    { title: "Networking", desc: "Connect with like-minded developers, mentors, and industry leaders." },
                                    { title: "Skill Validation", desc: "Prove your expertise by building tangible projects under pressure." },
                                    { title: "Exciting Prizes", desc: "Win cash rewards, gadgets, and exclusive merchandise." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="mt-1">
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{item.title}</h4>
                                            <p className="text-muted-foreground">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                            <div className="relative grid grid-cols-2 gap-4">
                                <div className="space-y-4 mt-8">
                                    <div className="bg-card p-6 rounded-2xl border border-border shadow-xl">
                                        <Code className="w-10 h-10 text-blue-500 mb-4" />
                                        <div className="text-2xl font-bold">50+</div>
                                        <div className="text-sm text-muted-foreground">Projects Built</div>
                                    </div>
                                    <div className="bg-card p-6 rounded-2xl border border-border shadow-xl">
                                        <Users className="w-10 h-10 text-purple-500 mb-4" />
                                        <div className="text-2xl font-bold">200+</div>
                                        <div className="text-sm text-muted-foreground">Participants</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-card p-6 rounded-2xl border border-border shadow-xl">
                                        <Trophy className="w-10 h-10 text-yellow-500 mb-4" />
                                        <div className="text-2xl font-bold">₹1L+</div>
                                        <div className="text-sm text-muted-foreground">Prizes Won</div>
                                    </div>
                                    <div className="bg-card p-6 rounded-2xl border border-border shadow-xl">
                                        <Award className="w-10 h-10 text-red-500 mb-4" />
                                        <div className="text-2xl font-bold">10+</div>
                                        <div className="text-sm text-muted-foreground">Hiring Partners</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section className="py-20 bg-primary text-primary-foreground">
                <div className="container px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12">Voice of Champions</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: "Alex Johnson", role: "Full Stack Developer", quote: "Winning the NexByte Webathon gave me the confidence to launch my own startup. The mentorship was invaluable." },
                            { name: "Sarah Williams", role: "AI Enthusiast", quote: "The problem statements were challenging and relevant. It pushed me to learn new ML frameworks in just 48 hours!" },
                            { name: "Rahul Gupta", role: "Frontend Ninja", quote: "Best organization I've seen. Smooth process, great support, and the networking helped me land my first internship." }
                        ].map((t, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-left"
                            >
                                <div className="mb-4 text-yellow-300">
                                    {[1, 2, 3, 4, 5].map(star => <span key={star}>★</span>)}
                                </div>
                                <p className="italic mb-6 opacity-90">"{t.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold">{t.name}</div>
                                        <div className="text-xs opacity-75">{t.role}</div>
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
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Phone</Label>
                                                <Input type="tel" required value={individualForm.phone} onChange={e => setIndividualForm({ ...individualForm, phone: e.target.value })} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Organization/College</Label>
                                                    <Input required value={individualForm.organization} onChange={e => setIndividualForm({ ...individualForm, organization: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Roll Number</Label>
                                                    <Input required value={individualForm.rollNumber} onChange={e => setIndividualForm({ ...individualForm, rollNumber: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>GitHub Profile</Label>
                                            <Input type="url" placeholder="https://github.com/..." value={individualForm.github} onChange={e => setIndividualForm({ ...individualForm, github: e.target.value })} />
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

                                        <div className="border border-border p-4 rounded-lg bg-secondary/10">
                                            <h4 className="font-semibold mb-2 text-sm">Team Leader</h4>
                                            <div className="grid grid-cols-2 gap-4 mb-2">
                                                <Input placeholder="Name" required value={teamForm.leader.fullName} onChange={e => setTeamForm({ ...teamForm, leader: { ...teamForm.leader, fullName: e.target.value } })} />
                                                <Input placeholder="Email" type="email" required value={teamForm.leader.email} onChange={e => setTeamForm({ ...teamForm, leader: { ...teamForm.leader, email: e.target.value } })} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input placeholder="Phone" required value={teamForm.leader.phone} onChange={e => setTeamForm({ ...teamForm, leader: { ...teamForm.leader, phone: e.target.value } })} />
                                                <Input placeholder="Roll Number" required value={teamForm.leader.rollNumber} onChange={e => setTeamForm({ ...teamForm, leader: { ...teamForm.leader, rollNumber: e.target.value } })} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mt-2">
                                                <Input placeholder="Organization/College" required value={teamForm.leader.organization} onChange={e => setTeamForm({ ...teamForm, leader: { ...teamForm.leader, organization: e.target.value } })} />
                                                <Input placeholder="GitHub" value={teamForm.leader.github} onChange={e => setTeamForm({ ...teamForm, leader: { ...teamForm.leader, github: e.target.value } })} />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label>Team Members (Optional)</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input placeholder="Member 1 Name" value={teamForm.member1.fullName} onChange={e => setTeamForm({ ...teamForm, member1: { ...teamForm.member1, fullName: e.target.value } })} />
                                                <Input placeholder="Member 1 Email" value={teamForm.member1.email} onChange={e => setTeamForm({ ...teamForm, member1: { ...teamForm.member1, email: e.target.value } })} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input placeholder="Member 2 Name" value={teamForm.member2.fullName} onChange={e => setTeamForm({ ...teamForm, member2: { ...teamForm.member2, fullName: e.target.value } })} />
                                                <Input placeholder="Member 2 Email" value={teamForm.member2.email} onChange={e => setTeamForm({ ...teamForm, member2: { ...teamForm.member2, email: e.target.value } })} />
                                            </div>
                                        </div>

                                        <Button type="submit" className="w-full">Register Team</Button>
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
        </div >
    );
};

export default Hackathons;
