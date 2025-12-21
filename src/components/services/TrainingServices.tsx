import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { motion } from "framer-motion";
import {
    Calendar,
    MapPin,
    ArrowRight,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface TrainingServicesProps {
    layout?: "grid" | "carousel";
}

const TrainingServices = ({ layout = "grid" }: TrainingServicesProps) => {
    const [programs, setPrograms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProgram, setSelectedProgram] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("all");

    // Application Form State
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        age: "",
        collegeName: "",
        year: "",
        resumeLink: "",
        whyJoin: "", // for training
        whyApply: "", // for internship
        portfolioLink: "" // for internship
    });

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/programs`);
            const data = await response.json();
            if (data.success) {
                setPrograms(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch programs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyClick = (program: any) => {
        setSelectedProgram(program);
        setFormData({
            fullName: "", email: "", phone: "", age: "", collegeName: "", year: "",
            resumeLink: "", whyJoin: "", whyApply: "", portfolioLink: ""
        });
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
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
                toast.error("Failed to submit application");
            }
        } catch (error) {
            toast.error("Error submitting application");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredPrograms = activeTab === "all"
        ? programs
        : programs.filter(p => p.type === (activeTab === "training" ? "Training" : "Internship"));

    return (
        <>
            <Tabs defaultValue="all" className="w-full max-w-4xl mx-auto mb-12" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All Programs</TabsTrigger>
                    <TabsTrigger value="training">Training</TabsTrigger>
                    <TabsTrigger value="internship">Internships</TabsTrigger>
                </TabsList>
            </Tabs>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : filteredPrograms.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    No active programs found at the moment. Please check back later!
                </div>
            ) : (
                <div className={layout === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex overflow-x-auto gap-6 pb-6 snap-x"}>
                    {filteredPrograms.map((program) => (
                        <Card key={program._id} className={`flex flex-col hover:shadow-lg transition-shadow border-primary/20 ${layout === "carousel" ? "min-w-[300px] md:min-w-[320px] snap-center" : ""}`}>
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${program.type === 'Training' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                        {program.type}
                                    </span>
                                    {program.isPaid && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">Stipend Available</span>}
                                </div>
                                <CardTitle className="line-clamp-2">{program.title}</CardTitle>
                                <CardDescription className="line-clamp-2 mt-2">{program.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4 text-sm text-muted-foreground">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        <span>{program.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span>{program.mode}</span>
                                    </div>
                                </div>

                                {/* Dynamic Details based on Type */}
                                {program.type === "Training" ? (
                                    <div className="bg-secondary/50 p-3 rounded-md">
                                        <p className="font-semibold text-foreground">Skills Covered:</p>
                                        <p className="text-xs line-clamp-2">{program.skillsCovered}</p>
                                        {program.fee > 0 && <p className="mt-2 text-xs font-medium">Fee: ₹{program.fee}</p>}
                                    </div>
                                ) : (
                                    <div className="bg-secondary/50 p-3 rounded-md">
                                        <p className="font-semibold text-foreground">Required Skills:</p>
                                        <p className="text-xs line-clamp-2">{program.requiredSkills}</p>
                                        {program.stipend > 0 && <p className="mt-2 text-xs font-medium">Stipend: ₹{program.stipend}/mo</p>}
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                                    <span>Start: {new Date(program.startDate).toLocaleDateString()}</span>
                                    <span>Apply by: {new Date(program.endDate).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full group" onClick={() => handleApplyClick(program)}>
                                    Apply Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Apply for {selectedProgram?.title}</DialogTitle>
                        <DialogDescription>
                            Complete the form below to submit your application for this {selectedProgram?.type.toLowerCase()}.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
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
