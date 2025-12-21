import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import {
    Calendar,
    MapPin,
    ArrowRight,
    Loader2,
    PhoneCall,
    Clock,
    CheckCircle2,
    BookOpen,
    Briefcase,
    GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface TrainingServicesProps {
    layout?: "grid" | "carousel";
}

const TrainingServices = ({ layout = "grid" }: TrainingServicesProps) => {
    const [programs, setPrograms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProgram, setSelectedProgram] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

    // Application Form State
    const [formData, setFormData] = useState({
        fullName: "", email: "", phone: "", age: "", collegeName: "", year: "",
        resumeLink: "", whyJoin: "", whyApply: "", portfolioLink: ""
    });

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/programs`);
                const data = await response.json();
                if (data.success) {
                    setPrograms(data.data.filter((p: any) => p.status === "Active"));
                }
            } catch (error) {
                console.error("Error fetching programs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrograms();
    }, []);

    const handleApplyClick = (program: any) => {
        setSelectedProgram(program);
        // Reset form
        setFormData({
            fullName: "", email: "", phone: "", age: "", collegeName: "", year: "",
            resumeLink: "", whyJoin: "", whyApply: "", portfolioLink: ""
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            ...formData,
            programType: selectedProgram.type,
            [selectedProgram.type === "Training" ? "trainingId" : "internshipId"]: selectedProgram._id
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/program-applications`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await response.json();

            if (data.success) {
                toast.success("Application Submitted Successfully!");
                setIsModalOpen(false);
            } else {
                toast.error(data.message || "Failed to submit application");
            }
        } catch (error) {
            toast.error("Error submitting application. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const trainings = programs.filter(p => p.type === 'Training');
    const internships = programs.filter(p => p.type === 'Internship');

    const toggleReadMore = (id: string) => {
        setExpandedMap(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderTrainingCard = (program: any) => {
        const isExpanded = expandedMap[program._id];
        // Classic, clean, academic look for Training
        return (
            <motion.div key={program._id} className={`snap-center flex-shrink-0 ${layout === "carousel" ? "min-w-[320px] md:min-w-[400px]" : "w-full"}`}>
                <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 border-blue-100 bg-white group hover:-translate-y-1">
                    <CardHeader className="pb-4 border-b border-blue-50/50">
                        <div className="flex justify-between items-start mb-3">
                            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                                <GraduationCap className="w-3 h-3" /> Training
                            </span>
                            {program.fee > 0 && <span className="text-sm font-bold text-blue-600">₹{program.fee}</span>}
                        </div>
                        <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight line-clamp-2">{program.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 pt-4 space-y-4">
                        <div className="text-sm text-gray-600 relative">
                            <p className={isExpanded ? '' : 'line-clamp-3'}>{program.description}</p>
                            {program.description.length > 120 && (
                                <button onClick={() => toggleReadMore(program._id)} className="text-xs text-blue-600 font-medium mt-1 hover:underline">
                                    {isExpanded ? "Read Less" : "Read More"}
                                </button>
                            )}
                        </div>

                        <div className="flex gap-4 text-xs font-medium text-gray-500">
                            <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-400" /> {program.duration}</div>
                            <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-blue-400" /> {program.mode}</div>
                        </div>

                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                            <p className="font-semibold text-xs text-blue-800 mb-2 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Skills You'll Learn:
                            </p>
                            <p className="text-xs text-gray-600 leading-relaxed">{program.skillsCovered}</p>
                        </div>

                        <div className="space-y-1 pt-2 text-xs text-gray-500">
                            <div className="flex justify-between"><span>Start Date:</span> <span className="text-gray-900 font-medium">{new Date(program.startDate).toLocaleDateString()}</span></div>
                            <div className="flex justify-between"><span>Apply By:</span> <span className="text-red-500 font-medium">{program.registrationDeadline ? new Date(program.registrationDeadline).toLocaleDateString() : "Open"}</span></div>
                        </div>
                        {program.helplineNumber && (
                            <div className="flex items-center justify-center gap-2 text-xs text-blue-600 bg-blue-50 py-2 rounded-lg mt-2">
                                <PhoneCall className="w-3 h-3" /> <span>Helpline: {program.helplineNumber}</span>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="pt-2">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200" onClick={() => handleApplyClick(program)}>
                            Enroll Now <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        );
    };

    const renderInternshipCard = (program: any) => {
        const isExpanded = expandedMap[program._id];
        // Professional, "Career" look - Purple/Green for Internship
        // Removed background Briefcase icon
        return (
            <motion.div key={program._id} className={`snap-center flex-shrink-0 ${layout === "carousel" ? "min-w-[320px] md:min-w-[400px]" : "w-full"}`}>
                <Card className="h-full flex flex-col hover:shadow-2xl transition-all duration-300 border-purple-100 bg-gradient-to-b from-white to-purple-50/20 group hover:-translate-y-1 relative overflow-hidden">
                    <CardHeader className="pb-4 relative z-10">
                        <div className="flex justify-between items-start mb-3">
                            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                                <Briefcase className="w-3 h-3" /> Internship
                            </span>
                            {program.stipend > 0 && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">₹{program.stipend}/mo</span>}
                        </div>
                        <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight line-clamp-2">{program.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 pt-2 space-y-4 relative z-10">
                        <div className="text-sm text-gray-600">
                            <p className={isExpanded ? '' : 'line-clamp-3'}>{program.description}</p>
                            {program.description.length > 120 && (
                                <button onClick={() => toggleReadMore(program._id)} className="text-xs text-purple-600 font-medium mt-1 hover:underline">
                                    {isExpanded ? "Read Less" : "Read More"}
                                </button>
                            )}
                        </div>

                        <div className="flex gap-4 text-xs font-medium text-gray-500">
                            <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-purple-500" /> {program.duration}</div>
                            <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-purple-500" /> {program.mode}</div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                            <p className="font-semibold text-xs text-purple-900 mb-2">Requirements:</p>
                            <p className="text-xs text-gray-600 leading-relaxed">{program.requiredSkills}</p>
                        </div>

                        {/* Rounds - ONLY for Internships */}
                        {program.rounds && program.rounds.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-[10px] uppercase font-bold text-gray-400">Selection Process</p>
                                <div className="space-y-1">
                                    {program.rounds.map((round: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center text-xs bg-purple-50/50 p-2 rounded border border-purple-100">
                                            <span className="font-medium text-purple-900">{round.name}</span>
                                            <span className="text-gray-500">{new Date(round.startDate).toLocaleDateString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-purple-100">
                            <span className="text-xs text-gray-500">DeadLine: <span className="text-red-500 font-medium">{program.registrationDeadline ? new Date(program.registrationDeadline).toLocaleDateString() : "Open"}</span></span>
                            {program.helplineNumber && (
                                <div className="flex items-center gap-1 text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded">
                                    <PhoneCall className="w-3 h-3" /> <span>{program.helplineNumber}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="pt-2 relative z-10">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200" onClick={() => handleApplyClick(program)}>
                            Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        );
    }

    return (
        <>
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            ) : (
                <div className="space-y-16">
                    {/* Training Section */}
                    {trainings.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold">Training Programs</h2>
                            </div>
                            <div className={layout === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex overflow-x-auto gap-6 pb-6 snap-x"}>
                                {trainings.map(renderTrainingCard)}
                            </div>
                        </section>
                    )}

                    {/* Internship Section */}
                    {internships.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold">Internship Opportunities</h2>
                            </div>
                            <div className={layout === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex overflow-x-auto gap-6 pb-6 snap-x"}>
                                {internships.map(renderInternshipCard)}
                            </div>
                        </section>
                    )}

                    {programs.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            No active programs found at the moment. Please check back later!
                        </div>
                    )}
                </div>
            )}

            {/* Application Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Apply for {selectedProgram?.title}</DialogTitle>
                        <DialogDescription>
                            Complete the form below to submit your application.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input required value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" />
                            </div>
                            <div className="space-y-2">
                                <Label>Age</Label>
                                <Input required type="number" min="16" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} placeholder="21" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>College / University Name</Label>
                            <Input required value={formData.collegeName} onChange={e => setFormData({ ...formData, collegeName: e.target.value })} placeholder="XYZ Institute of Technology" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Year of Study</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} required>
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
                                <Input required type="url" value={formData.resumeLink} onChange={e => setFormData({ ...formData, resumeLink: e.target.value })} placeholder="https://..." />
                            </div>
                        </div>

                        {selectedProgram?.type === "Training" ? (
                            <div className="space-y-2">
                                <Label>Why do you want to join this training?</Label>
                                <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm border-gray-200" required value={formData.whyJoin} onChange={e => setFormData({ ...formData, whyJoin: e.target.value })} placeholder="Tell us about your learning goals..." />
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <Label>Why should we hire you for this internship?</Label>
                                    <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm border-gray-200" required value={formData.whyApply} onChange={e => setFormData({ ...formData, whyApply: e.target.value })} placeholder="Highlight your skills and passion..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>Portfolio / GitHub Link</Label>
                                    <Input value={formData.portfolioLink} onChange={e => setFormData({ ...formData, portfolioLink: e.target.value })} placeholder="https://github.com/..." />
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
        </>
    );
};

export default TrainingServices;
