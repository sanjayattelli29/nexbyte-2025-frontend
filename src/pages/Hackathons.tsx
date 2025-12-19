import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Trophy, Code, Zap, Users, CheckCircle2, Calendar, MapPin, ExternalLink
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
        fullName: "", email: "", phone: "", organization: "", experienceLevel: "Beginner", github: ""
    });

    const [teamForm, setTeamForm] = useState({
        teamName: "",
        leader: { fullName: "", email: "", phone: "", organization: "", experienceLevel: "Intermediate", github: "" },
        member1: { fullName: "", email: "" },
        member2: { fullName: "", email: "" },
        member3: { fullName: "", email: "" }
    });

    useEffect(() => {
        fetchHackathons();
    }, []);

    const fetchHackathons = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/hackathons");
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
            const response = await fetch("http://localhost:5000/api/applications", {
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

            const response = await fetch("http://localhost:5000/api/applications", {
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
                                    className="group bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-primary/10 text-primary p-3 rounded-xl">
                                            <Trophy className="w-6 h-6" />
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${hackathon.mode === 'Online' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {hackathon.mode}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold mb-2">{hackathon.name}</h3>

                                    {/* Description */}
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
                                        {hackathon.description}
                                    </p>

                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 mt-auto">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{hackathon.startDate}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            <span>Team: {hackathon.teamSize?.min}-{hackathon.teamSize?.max}</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-muted-foreground mb-6">
                                        Stack: <span className="font-medium text-foreground">{hackathon.techStack}</span>
                                    </p>

                                    <Button className="w-full mt-auto" onClick={() => setSelectedHackathon(hackathon)}>
                                        Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

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
                                                <div className="space-y-2">
                                                    <Label>Organization/College</Label>
                                                    <Input required value={individualForm.organization} onChange={e => setIndividualForm({ ...individualForm, organization: e.target.value })} />
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
            </section>

            <Footer />
        </div>
    );
};

export default Hackathons;
