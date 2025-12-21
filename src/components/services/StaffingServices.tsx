import { useState } from "react";
import { API_BASE_URL } from "@/config";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    Briefcase,
    Clock,
    UserCheck,
    CheckCircle2,
    ArrowRight,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Service Metadata
const services = [
    {
        id: "it_staffing",
        icon: Briefcase,
        title: "IT Staffing",
        description: "Project-based or role-based IT staffing solutions to scale your team.",
        benefits: ["Rapid Scalability", "Vetted Developers", "Flexible Engagement", "Reduced Hiring Costs"],
        color: "primary"
    },
    {
        id: "contract_hiring",
        icon: Clock,
        title: "Contract Hiring",
        description: "Short-term contract hiring for specific projects or seasonal needs.",
        benefits: ["Immediate Joining", "Short-term Commitment", "Specialized Skills", "Payroll Management"],
        color: "accent"
    },
    {
        id: "full_time_recruitment",
        icon: Users,
        title: "Full-Time Recruitment",
        description: "End-to-end recruitment for permanent positions in your organization.",
        benefits: ["Cultural Fit", "Long-term Retention", "Leadership Hiring", "Thorough Screening"],
        color: "success"
    },
    {
        id: "talent_screening",
        icon: UserCheck,
        title: "Talent Screening",
        description: "Professional screening services to validate candidates before you hire.",
        benefits: ["Technical Assessment", "Soft Skills Review", "Background Verification", "Detailed Reports"],
        color: "primary"
    }
];

interface StaffingServicesProps {
    layout?: "grid" | "carousel";
}

const StaffingServices = ({ layout = "grid" }: StaffingServicesProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedServiceId, setSelectedServiceId] = useState("");

    // Common Details State
    const [companyDetails, setCompanyDetails] = useState({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        industry: "",
        companySize: "",
        hiringTimeline: "",
        budgetRange: "",
        preferredContact: "Email",
        additionalNotes: ""
    });

    // Specific Requirements State
    const [staffingRequirements, setStaffingRequirements] = useState<any>({});

    const handleOpenModal = (serviceId?: string) => {
        if (serviceId) {
            setSelectedServiceId(serviceId);
            setStep(2);
        } else {
            setSelectedServiceId("");
            setStep(1);
        }
        setCompanyDetails({
            companyName: "", contactPerson: "", email: "", phone: "", industry: "",
            companySize: "", hiringTimeline: "", budgetRange: "", preferredContact: "Email", additionalNotes: ""
        });
        setStaffingRequirements({});
        setIsModalOpen(true);
    };

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const selectedService = services.find(s => s.id === selectedServiceId);

        const payload = {
            serviceCategory: selectedService?.title,
            companyDetails,
            staffingRequirements
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/staffing-applications`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Request Submitted Successfully!");
                setIsModalOpen(false);
            } else {
                toast.error("Failed to submit request");
            }
        } catch (error) {
            toast.error("Error submitting request");
        } finally {
            setSubmitting(false);
        }
    };

    const renderSpecificFields = () => {
        switch (selectedServiceId) {
            case "it_staffing":
                return (
                    <>
                        <div className="space-y-2">
                            <Label>Engagement Type</Label>
                            <Select onValueChange={(v) => setStaffingRequirements({ ...staffingRequirements, engagementType: v })}>
                                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Project Based">Project Based</SelectItem>
                                    <SelectItem value="Role Based">Role Based</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Roles Required (Comma separated)</Label>
                            <Input placeholder="e.g. Frontend Dev, QA" onChange={(e) => setStaffingRequirements({ ...staffingRequirements, rolesRequired: e.target.value.split(',') })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Number of Resources</Label>
                            <Input type="number" onChange={(e) => setStaffingRequirements({ ...staffingRequirements, numberOfResources: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Skills Required (Comma separated)</Label>
                            <Input placeholder="React, Node.js..." onChange={(e) => setStaffingRequirements({ ...staffingRequirements, skillsRequired: e.target.value.split(',') })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Experience Level</Label>
                            <Input placeholder="e.g. 3-5 Years" onChange={(e) => setStaffingRequirements({ ...staffingRequirements, experienceLevel: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Work Mode</Label>
                            <Select onValueChange={(v) => setStaffingRequirements({ ...staffingRequirements, workMode: v })}>
                                <SelectTrigger><SelectValue placeholder="Select Mode" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Remote">Remote</SelectItem>
                                    <SelectItem value="On-Site">On-Site</SelectItem>
                                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                );
            case "contract_hiring":
                return (
                    <>
                        <div className="space-y-2">
                            <Label>Contract Duration</Label>
                            <Input placeholder="e.g. 3 Months" onChange={(e) => setStaffingRequirements({ ...staffingRequirements, contractDuration: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Roles Required</Label>
                            <Input placeholder="UI/UX Designer..." onChange={(e) => setStaffingRequirements({ ...staffingRequirements, rolesRequired: e.target.value.split(',') })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Number of Resources</Label>
                            <Input type="number" onChange={(e) => setStaffingRequirements({ ...staffingRequirements, numberOfResources: e.target.value })} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="renewal" onChange={(e) => setStaffingRequirements({ ...staffingRequirements, renewalOption: e.target.checked })} />
                            <Label htmlFor="renewal">Renewal Option?</Label>
                        </div>
                    </>
                );
            case "full_time_recruitment":
                return (
                    <>
                        <div className="space-y-2">
                            <Label>Roles Required</Label>
                            <Input placeholder="Senior Engineer..." onChange={(e) => setStaffingRequirements({ ...staffingRequirements, rolesRequired: e.target.value.split(',') })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input placeholder="Bangalore..." onChange={(e) => setStaffingRequirements({ ...staffingRequirements, location: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Salary Range (LPA)</Label>
                            <Input placeholder="18-25 LPA" onChange={(e) => setStaffingRequirements({ ...staffingRequirements, salaryRange: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Experience Range</Label>
                            <Input placeholder="5-8 Years" onChange={(e) => setStaffingRequirements({ ...staffingRequirements, experienceRange: e.target.value })} />
                        </div>
                    </>
                );
            case "talent_screening":
                return (
                    <>
                        <div className="space-y-2">
                            <Label>Roles to Screen</Label>
                            <Input placeholder="Frontend Dev..." onChange={(e) => setStaffingRequirements({ ...staffingRequirements, rolesToScreen: e.target.value.split(',') })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Number of Candidates</Label>
                            <Input type="number" onChange={(e) => setStaffingRequirements({ ...staffingRequirements, numberOfCandidates: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Payment Type</Label>
                            <Select onValueChange={(v) => setStaffingRequirements({ ...staffingRequirements, paymentType: v })}>
                                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Per Candidate">Per Candidate</SelectItem>
                                    <SelectItem value="Bulk">Bulk</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className={layout === "grid" ? "grid md:grid-cols-2 lg:grid-cols-2 gap-8" : "flex overflow-x-auto gap-6 pb-6 snap-x"}>
            {services.map((service, index) => (
                <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`group bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col ${layout === "carousel" ? "min-w-[320px] snap-center" : ""}`}
                >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-primary/10 text-primary`}>
                        <service.icon className="w-7 h-7" />
                    </div>

                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-6 flex-1">{service.description}</p>

                    <ul className="space-y-3 mb-6">
                        {service.benefits.map((benefit) => (
                            <li key={benefit} className="flex items-center gap-3 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                                <span>{benefit}</span>
                            </li>
                        ))}
                    </ul>

                    <Button variant="outline" className="w-full mt-auto" onClick={() => handleOpenModal(service.id)}>
                        Hire for {service.title}
                    </Button>
                </motion.div>
            ))}

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {step === 1 ? "Select Staffing Service" :
                                step === 2 ? "Company Details" :
                                    "Specific Requirements"}
                        </DialogTitle>
                        <DialogDescription>
                            {step === 1 ? "Choose the hiring model that fits your needs." :
                                step === 2 ? "Tell us about your organization." :
                                    "Define the talent or scope you are looking for."}
                        </DialogDescription>
                    </DialogHeader>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="mt-4"
                        >
                            {step === 1 && (
                                <div className="grid grid-cols-2 gap-4">
                                    {services.map(s => (
                                        <div
                                            key={s.id}
                                            className={`cursor-pointer border rounded-lg p-4 hover:bg-secondary/50 transition-colors ${selectedServiceId === s.id ? 'border-primary bg-primary/5' : ''}`}
                                            onClick={() => setSelectedServiceId(s.id)}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <s.icon className="w-5 h-5 text-primary" />
                                                <span className="font-semibold text-sm">{s.title}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2">{s.description}</p>
                                        </div>
                                    ))}
                                    <Button className="col-span-2 mt-4" disabled={!selectedServiceId} onClick={handleNextStep}>
                                        Next Step
                                    </Button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Company Name</Label>
                                            <Input required value={companyDetails.companyName} onChange={e => setCompanyDetails({ ...companyDetails, companyName: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Contact Person</Label>
                                            <Input required value={companyDetails.contactPerson} onChange={e => setCompanyDetails({ ...companyDetails, contactPerson: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Email</Label>
                                            <Input required type="email" value={companyDetails.email} onChange={e => setCompanyDetails({ ...companyDetails, email: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Phone</Label>
                                            <Input required type="tel" value={companyDetails.phone} onChange={e => setCompanyDetails({ ...companyDetails, phone: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Industry</Label>
                                            <Input value={companyDetails.industry} onChange={e => setCompanyDetails({ ...companyDetails, industry: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Company Size</Label>
                                            <Input value={companyDetails.companySize} onChange={e => setCompanyDetails({ ...companyDetails, companySize: e.target.value })} placeholder="e.g. 50-100" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Hiring Timeline</Label>
                                            <Input value={companyDetails.hiringTimeline} onChange={e => setCompanyDetails({ ...companyDetails, hiringTimeline: e.target.value })} placeholder="e.g. Immediate" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Budget Range</Label>
                                            <Input value={companyDetails.budgetRange} onChange={e => setCompanyDetails({ ...companyDetails, budgetRange: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Additional Notes</Label>
                                        <Textarea value={companyDetails.additionalNotes} onChange={e => setCompanyDetails({ ...companyDetails, additionalNotes: e.target.value })} placeholder="Any specific requirements..." />
                                    </div>

                                    <Button className="w-full" onClick={handleNextStep}>
                                        Next: Role Details
                                    </Button>
                                </div>
                            )}

                            {step === 3 && (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="bg-secondary/20 p-4 rounded-lg border mb-4">
                                        <h4 className="font-semibold text-sm mb-2 text-primary">
                                            {services.find(s => s.id === selectedServiceId)?.title} Requirements
                                        </h4>
                                        <div className="grid grid-cols-1 gap-4">
                                            {renderSpecificFields()}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                                        <Button type="submit" className="flex-1" disabled={submitting}>
                                            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                            Submit Request
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StaffingServices;
