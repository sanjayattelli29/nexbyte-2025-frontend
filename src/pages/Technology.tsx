import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Globe,
    Smartphone,
    Cloud,
    Code2,
    Database,
    CheckCircle2,
    ArrowRight,
    X,
    Loader2,
    Paintbrush
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Service Metadata with Schema Logic
const services = [
    {
        id: "web_development",
        icon: Globe,
        title: "Web Development",
        description: "Modern, responsive, and high-performance websites built with the latest technologies.",
        benefits: ["React/Next.js", "SEO Optimized", "Fast Performance", "Mobile Responsive"],
        color: "accent"
    },
    {
        id: "custom_software",
        icon: Code2,
        title: "Custom Software Development",
        description: "Tailored software solutions designed to meet your specific business needs and workflows.",
        benefits: ["Scalable architecture", "Custom features", "Integration support", "Maintenance included"],
        color: "primary"
    },
    {
        id: "app_development",
        icon: Smartphone,
        title: "App Development",
        description: "Native and cross-platform mobile applications for iOS and Android.",
        benefits: ["Flutter/React Native", "User-friendly UI/UX", "App Store Deployment", "Push Notifications"],
        color: "success"
    },
    {
        id: "cloud_solutions",
        icon: Cloud,
        title: "Cloud Solutions",
        description: "Secure and scalable cloud infrastructure setup and management.",
        benefits: ["AWS/Azure/GCP", "Cloud Migration", "Cost Optimization", "Security Audits"],
        color: "primary"
    },
    {
        id: "it_consulting",
        icon: Database,
        title: "IT Consulting",
        description: "Expert guidance on digital transformation and technology strategy.",
        benefits: ["Tech Stack Selection", "Process Automation", "System Architecture", "Legacy Modernization"],
        color: "accent"
    },
    {
        id: "ui_ux_design",
        icon: Paintbrush,
        title: "UI / UX Design",
        description: "User-centric design services for websites and mobile applications.",
        benefits: ["Figma Design", "Prototyping", "User Research", "Brand Consistency"],
        color: "success"
    }
];

const Technology = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(1); // 1: Service Selection, 2: Common Details, 3: Specific Details

    // Form State
    const [selectedServiceId, setSelectedServiceId] = useState("");
    const [commonDetails, setCommonDetails] = useState({
        fullName: "",
        email: "",
        phone: "",
        companyName: "",
        industry: "",
        budgetRange: "",
        timeline: "",
        preferredContact: "Email",
        projectBrief: ""
    });

    // Dynamic Specific Details State
    const [specificDetails, setSpecificDetails] = useState<any>({});

    const handleOpenModal = (serviceId?: string) => {
        if (serviceId) {
            setSelectedServiceId(serviceId);
            setStep(2); // Skip selection if clicked from card
        } else {
            setSelectedServiceId("");
            setStep(1);
        }
        setCommonDetails({
            fullName: "", email: "", phone: "", companyName: "", industry: "",
            budgetRange: "", timeline: "", preferredContact: "Email", projectBrief: ""
        });
        setSpecificDetails({});
        setIsModalOpen(true);
    };

    const handleNextStep = () => {
        // Basic validation could go here
        setStep(step + 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const selectedService = services.find(s => s.id === selectedServiceId);

        const payload = {
            serviceCategory: selectedService?.title,
            commonDetails,
            serviceDetails: specificDetails
        };

        try {
            const response = await fetch("http://localhost:5000/api/technology-applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Enquiry Submitted Successfully!");
                setIsModalOpen(false);
            } else {
                toast.error("Failed to submit enquiry");
            }
        } catch (error) {
            toast.error("Error submitting enquiry");
        } finally {
            setSubmitting(false);
        }
    };

    const renderSpecificFields = () => {
        switch (selectedServiceId) {
            case "custom_software":
                return (
                    <>
                        <div className="space-y-2">
                            <Label>Software Type</Label>
                            <Select onValueChange={(v) => setSpecificDetails({ ...specificDetails, softwareType: v })}>
                                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CRM">CRM</SelectItem>
                                    <SelectItem value="ERP">ERP</SelectItem>
                                    <SelectItem value="SaaS">SaaS Product</SelectItem>
                                    <SelectItem value="Internal Tool">Internal Tool</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Approx Users Count</Label>
                            <Input type="number" onChange={(e) => setSpecificDetails({ ...specificDetails, usersCount: e.target.value })} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="sca" className="rounded border-gray-300" onChange={(e) => setSpecificDetails({ ...specificDetails, scalabilityRequired: e.target.checked })} />
                            <Label htmlFor="sca">Scalability Required?</Label>
                        </div>
                    </>
                );
            case "web_development":
                return (
                    <>
                        <div className="space-y-2">
                            <Label>Website Type</Label>
                            <Select onValueChange={(v) => setSpecificDetails({ ...specificDetails, websiteType: v })}>
                                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Business">Business</SelectItem>
                                    <SelectItem value="E-commerce">E-commerce</SelectItem>
                                    <SelectItem value="Portfolio">Portfolio</SelectItem>
                                    <SelectItem value="Management">Management</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Number of Pages (Approx)</Label>
                            <Input type="number" onChange={(e) => setSpecificDetails({ ...specificDetails, numberOfPages: e.target.value })} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="seo" onChange={(e) => setSpecificDetails({ ...specificDetails, seoRequired: e.target.checked })} />
                            <Label htmlFor="seo">SEO Required?</Label>
                        </div>
                    </>
                );
            case "app_development":
                return (
                    <>
                        <div className="space-y-2">
                            <Label>App Type</Label>
                            <Select onValueChange={(v) => setSpecificDetails({ ...specificDetails, appType: v })}>
                                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Mobile Application">Mobile Application</SelectItem>
                                    <SelectItem value="Watch App">Watch App</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Platform</Label>
                            <Select onValueChange={(v) => setSpecificDetails({ ...specificDetails, platform: v })}>
                                <SelectTrigger><SelectValue placeholder="Select Platform" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="iOS">iOS</SelectItem>
                                    <SelectItem value="Android">Android</SelectItem>
                                    <SelectItem value="Both">Both (Cross Platform)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                );
            case "cloud_solutions":
                return (
                    <>
                        <div className="space-y-2">
                            <Label>Current Infrastructure</Label>
                            <Input placeholder="e.g. On-Premise, AWS..." onChange={(e) => setSpecificDetails({ ...specificDetails, currentInfrastructure: e.target.value })} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="audit" onChange={(e) => setSpecificDetails({ ...specificDetails, securityAuditRequired: e.target.checked })} />
                            <Label htmlFor="audit">Security Audit Required?</Label>
                        </div>
                    </>
                );
            case "it_consulting":
                return (
                    <>
                        <div className="space-y-2">
                            <Label>Current Challenges</Label>
                            <Textarea placeholder="Describe your current tech challenges..." onChange={(e) => setSpecificDetails({ ...specificDetails, currentChallenges: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Company Size</Label>
                            <Select onValueChange={(v) => setSpecificDetails({ ...specificDetails, companySize: v })}>
                                <SelectTrigger><SelectValue placeholder="Select Size" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1-10">1-10</SelectItem>
                                    <SelectItem value="11-50">11-50</SelectItem>
                                    <SelectItem value="50-100">50-100</SelectItem>
                                    <SelectItem value="100+">100+</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                );
            case "ui_ux_design":
                return (
                    <>
                        <div className="space-y-2">
                            <Label>Design Type</Label>
                            <Select onValueChange={(v) => setSpecificDetails({ ...specificDetails, designType: v })}>
                                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Website">Website</SelectItem>
                                    <SelectItem value="Mobile App">Mobile App</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Screens Required (Approx)</Label>
                            <Input type="number" onChange={(e) => setSpecificDetails({ ...specificDetails, screensRequired: e.target.value })} />
                        </div>
                    </>
                );
            default:
                return <p className="text-sm text-muted-foreground">Please proceed to submit your general enquiry.</p>;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-gradient-hero">
                <div className="container px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                            Technology Services
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Innovative Technology For <br />
                            <span className="text-gradient-primary">Digital Transformation</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                            We build robust, scalable, and cutting-edge technology solutions that power business growth.
                        </p>
                        <Button size="lg" onClick={() => handleOpenModal()}>
                            Request a Quote <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20">
                <div className="container px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
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
                                    Enquire Now
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />

            {/* Application Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {step === 1 ? "Select a Service" :
                                step === 2 ? "Tell us about yourself" :
                                    "Project Details"}
                        </DialogTitle>
                        <DialogDescription>
                            {step === 1 ? "Choose the service you are interested in." :
                                step === 2 ? "We need some basic details to contact you." :
                                    "Help us understand your requirements better."}
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
                                            <Label>Full Name</Label>
                                            <Input required value={commonDetails.fullName} onChange={e => setCommonDetails({ ...commonDetails, fullName: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Email</Label>
                                            <Input required type="email" value={commonDetails.email} onChange={e => setCommonDetails({ ...commonDetails, email: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Phone</Label>
                                            <Input required type="tel" value={commonDetails.phone} onChange={e => setCommonDetails({ ...commonDetails, phone: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Company Name</Label>
                                            <Input value={commonDetails.companyName} onChange={e => setCommonDetails({ ...commonDetails, companyName: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Industry</Label>
                                            <Input value={commonDetails.industry} onChange={e => setCommonDetails({ ...commonDetails, industry: e.target.value })} placeholder="e.g. E-commerce" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Timeline</Label>
                                            <Input value={commonDetails.timeline} onChange={e => setCommonDetails({ ...commonDetails, timeline: e.target.value })} placeholder="e.g. 2 Months" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Budget Range (Optional)</Label>
                                        <Select onValueChange={(v) => setCommonDetails({ ...commonDetails, budgetRange: v })}>
                                            <SelectTrigger><SelectValue placeholder="Select Budget" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="< 1L">Less than 1L</SelectItem>
                                                <SelectItem value="1L - 3L">1L - 3L</SelectItem>
                                                <SelectItem value="3L - 10L">3L - 10L</SelectItem>
                                                <SelectItem value="10L+">10L+</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Project Brief</Label>
                                        <Textarea required value={commonDetails.projectBrief} onChange={e => setCommonDetails({ ...commonDetails, projectBrief: e.target.value })} placeholder="Briefly describe what you need..." />
                                    </div>

                                    <Button className="w-full" onClick={handleNextStep}>
                                        Next: Specific Details
                                    </Button>
                                </div>
                            )}

                            {step === 3 && (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="bg-secondary/20 p-4 rounded-lg border mb-4">
                                        <h4 className="font-semibold text-sm mb-2 text-primary">
                                            {services.find(s => s.id === selectedServiceId)?.title} Details
                                        </h4>
                                        <div className="grid grid-cols-1 gap-4">
                                            {renderSpecificFields()}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                                        <Button type="submit" className="flex-1" disabled={submitting}>
                                            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                            Submit Enquiry
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

export default Technology;
