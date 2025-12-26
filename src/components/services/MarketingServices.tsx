import { useState } from "react";
import { API_BASE_URL } from "@/config";
import { motion, AnimatePresence } from "framer-motion";
import {
    Share2,
    TrendingUp,
    Video,
    Palette,
    Users,
    ArrowRight,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

const services = [
    {
        id: "social_media_management",
        icon: Share2,
        title: "Social Media Management",
        description: "End-to-end management with content planning, scheduling, and community engagement.",
        benefits: ["Content calendar", "Daily posting", "Community management", "Brand consistency"],
        color: "primary"
    },
    {
        id: "social_media_ads",
        icon: TrendingUp,
        title: "Social Media Ads",
        description: "Strategic paid campaigns with targeting, A/B testing, and ROI optimization.",
        benefits: ["Targeted campaigns", "A/B testing", "Budget management", "Performance tracking"],
        color: "accent"
    },
    {
        id: "video_content_strategy",
        icon: Video,
        title: "Video Content Strategy",
        description: "Engaging video content optimized for Reels, Shorts, and long-form platforms.",
        benefits: ["Platform-specific formats", "Trending content", "Script & storyboard", "Post-production"],
        color: "primary"
    },
    {
        id: "branding_design",
        icon: Palette,
        title: "Branding & Design",
        description: "Complete identity design including logos, color palettes, and brand guidelines.",
        benefits: ["Logo design", "Brand guidelines", "Visual identity", "Marketing collateral"],
        color: "accent"
    },
    {
        id: "audience_growth",
        icon: Users,
        title: "Audience Growth",
        description: "Organic strategies to build a loyal community and increase followers.",
        benefits: ["Organic growth", "Influencer partnerships", "Engagement tactics", "In-depth analytics"],
        color: "success"
    }
];

interface MarketingServicesProps {
    layout?: "grid" | "carousel";
}

const MarketingServices = ({ layout = "grid" }: MarketingServicesProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedServiceId, setSelectedServiceId] = useState("");

    // --- State Management ---
    const [clientDetails, setClientDetails] = useState({
        fullName: "", email: "", phone: "", businessName: "", industry: "",
        brandStage: "", monthlyBudgetRange: "", timeline: "",
        primaryGoal: "", preferredPlatforms: [] as string[], additionalNotes: ""
    });

    const [marketingRequirements, setMarketingRequirements] = useState<any>({});
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]); // Helper for multi-select

    const handleOpenModal = (serviceId?: string) => {
        setIsModalOpen(true);
        setStep(serviceId ? 2 : 1); // Skip to details if service clicked, else select service
        setSelectedServiceId(serviceId || "");

        // Reset Logic
        setClientDetails({
            fullName: "", email: "", phone: "", businessName: "", industry: "",
            brandStage: "", monthlyBudgetRange: "", timeline: "",
            primaryGoal: "", preferredPlatforms: [], additionalNotes: ""
        });
        setMarketingRequirements({});
        setSelectedPlatforms([]);
    };

    const handleNextStep = () => {
        if (step === 2) {
            // Prepare specific requirements structure based on service
            const baseReqs = { serviceType: services.find(s => s.id === selectedServiceId)?.title };

            if (selectedServiceId === 'social_media_management') {
                // Pre-fill platform keys if needed
                const platformObj: any = {};
                selectedPlatforms.forEach(p => platformObj[p.toLowerCase()] = {});
                setMarketingRequirements({ ...baseReqs, platforms: platformObj });
            } else {
                setMarketingRequirements({ ...baseReqs });
            }
        }
        setStep(step + 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        // Merge helper state back into requirements if needed
        let finalReqs = { ...marketingRequirements };
        if (selectedServiceId !== 'social_media_management') {
            // For others, platforms is just an array
            if (selectedPlatforms.length > 0) finalReqs.platforms = selectedPlatforms;
        }

        const payload = {
            clientDetails: {
                ...clientDetails,
                serviceCategory: "Digital Marketing",
                selectedService: services.find(s => s.id === selectedServiceId)?.title,
                preferredPlatforms: selectedPlatforms // redundant but matches asked schema top level
            },
            digitalMarketingRequirements: finalReqs
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/marketing-applications`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Marketing Inquiry Submitted!");
                setIsModalOpen(false);
            } else {
                toast.error("Submission failed");
            }
        } catch (error) {
            toast.error("Error submitting request");
        } finally {
            setSubmitting(false);
        }
    };

    const togglePlatform = (platform: string) => {
        if (selectedPlatforms.includes(platform)) {
            setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
        } else {
            setSelectedPlatforms([...selectedPlatforms, platform]);
        }
    };

    // Helper to update deeply nested platform specific fields
    const updatePlatformField = (platform: string, field: string, value: any) => {
        setMarketingRequirements((prev: any) => ({
            ...prev,
            platforms: {
                ...prev.platforms,
                [platform.toLowerCase()]: {
                    ...prev.platforms?.[platform.toLowerCase()],
                    [field]: value
                }
            }
        }));
    };

    const renderSpecificFields = () => {
        switch (selectedServiceId) {
            case "social_media_management":
                return (
                    <div className="space-y-4">
                        <Label>Select Platforms to Manage <span className="text-red-500">*</span></Label>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {['Instagram', 'LinkedIn', 'Facebook', 'YouTube', 'Twitter'].map(p => (
                                <div key={p}
                                    className={`px-3 py-1 rounded-full text-xs cursor-pointer border ${selectedPlatforms.includes(p) ? 'bg-primary text-white border-primary' : 'bg-background border-border'}`}
                                    onClick={() => togglePlatform(p)}
                                >
                                    {p}
                                </div>
                            ))}
                        </div>

                        {/* Dynamic fields for each selected platform */}
                        {selectedPlatforms.map(p => (
                            <div key={p} className="p-3 border rounded-md bg-secondary/10 space-y-3">
                                <h4 className="font-semibold text-sm">{p} Details</h4>
                                <Input placeholder="Posting Frequency (e.g. Daily)" onChange={(e) => updatePlatformField(p, 'postingFrequency', e.target.value)} />
                                <Input placeholder="Content Types (comma sep)" onChange={(e) => updatePlatformField(p, 'contentTypes', e.target.value.split(','))} />
                                {p === 'Instagram' && <div className="flex items-center gap-2"><input type="checkbox" onChange={(e) => updatePlatformField(p, 'communityManagement', e.target.checked)} /><Label>Community Management</Label></div>}
                                {p === 'LinkedIn' && <Input placeholder="Engagement Activities (comma sep)" onChange={(e) => updatePlatformField(p, 'engagementActivities', e.target.value.split(','))} />}
                                {p === 'YouTube' && <Input placeholder="Upload Content Types (Shorts, Long)" onChange={(e) => updatePlatformField(p, 'contentTypes', e.target.value.split(','))} />}
                            </div>
                        ))}

                        <div className="flex items-center gap-2 mt-4"><input type="checkbox" onChange={(e) => setMarketingRequirements({ ...marketingRequirements, contentCalendarRequired: e.target.checked })} /><Label>Content Calendar Required?</Label></div>
                    </div>
                );
            case "social_media_ads":
                return (
                    <div className="space-y-4">
                        <Label>Select Ad Platforms <span className="text-red-500">*</span></Label>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {['Instagram Ads', 'Facebook Ads', 'LinkedIn Ads', 'YouTube Ads', 'Google Ads'].map(p => (
                                <div key={p}
                                    className={`px-3 py-1 rounded-full text-xs cursor-pointer border ${selectedPlatforms.includes(p) ? 'bg-primary text-white border-primary' : 'bg-background border-border'}`}
                                    onClick={() => togglePlatform(p)}
                                >
                                    {p}
                                </div>
                            ))}
                        </div>
                        <Input type="number" required placeholder="Monthly Ad Spend" onChange={(e) => setMarketingRequirements({ ...marketingRequirements, monthlyAdSpend: e.target.value })} />
                        <div className="space-y-2">
                            <Label>Ad Objectives (Comma separated) <span className="text-red-500">*</span></Label>
                            <Input required placeholder="Leads, Sales, Traffic..." onChange={(e) => setMarketingRequirements({ ...marketingRequirements, adObjective: e.target.value.split(',') })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Target Audience (Location) <span className="text-red-500">*</span></Label>
                            <Input required placeholder="India, USA..." onChange={(e) => setMarketingRequirements({ ...marketingRequirements, targetAudience: { ...marketingRequirements.targetAudience, location: e.target.value } })} />
                        </div>
                    </div>
                );
            case "video_content_strategy":
                return (
                    <div className="space-y-4">
                        <Label>Target Platforms <span className="text-red-500">*</span></Label>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {['Instagram Reels', 'YouTube Shorts', 'YouTube Long'].map(p => (
                                <div key={p} onClick={() => togglePlatform(p)} className={`px-3 py-1 rounded-full text-xs cursor-pointer border ${selectedPlatforms.includes(p) ? 'bg-primary text-white' : ''}`}>{p}</div>
                            ))}
                        </div>
                        <Input type="number" required placeholder="Videos Per Month" onChange={(e) => setMarketingRequirements({ ...marketingRequirements, videosPerMonth: e.target.value })} />
                        <Input required placeholder="Content Style (e.g. Educational)" onChange={(e) => setMarketingRequirements({ ...marketingRequirements, contentStyle: e.target.value.split(',') })} />
                        <div className="flex items-center gap-2"><input type="checkbox" onChange={(e) => setMarketingRequirements({ ...marketingRequirements, scriptWritingRequired: e.target.checked })} /><Label>Script Writing?</Label></div>
                    </div>
                );
            case "branding_design":
                return (
                    <div className="space-y-4">
                        <Input required placeholder="Branding Needs (Logo, Colors...)" onChange={(e) => setMarketingRequirements({ ...marketingRequirements, brandingNeeds: e.target.value.split(',') })} />
                        <Input required placeholder="Collaterals (Banners, Deck...)" onChange={(e) => setMarketingRequirements({ ...marketingRequirements, marketingCollaterals: e.target.value.split(',') })} />
                        <Input type="number" required placeholder="Revision Rounds" onChange={(e) => setMarketingRequirements({ ...marketingRequirements, revisionRounds: e.target.value })} />
                    </div>
                );
            case "audience_growth":
                return (
                    <div className="space-y-4">
                        <Label>Grow on Platforms <span className="text-red-500">*</span></Label>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {['Instagram', 'LinkedIn', 'Twitter'].map(p => (
                                <div key={p} onClick={() => togglePlatform(p)} className={`px-3 py-1 rounded-full text-xs cursor-pointer border ${selectedPlatforms.includes(p) ? 'bg-primary text-white' : ''}`}>{p}</div>
                            ))}
                        </div>
                        <Input required placeholder="Growth Strategies (e.g. Influencers)" onChange={(e) => setMarketingRequirements({ ...marketingRequirements, growthStrategies: e.target.value.split(',') })} />
                        <Input required placeholder="Timeline (e.g. 3-6 Months)" onChange={(e) => setMarketingRequirements({ ...marketingRequirements, expectedGrowthTimeline: e.target.value })} />
                    </div>
                );

            default: return null;
        }
    };

    return (
        <>
            <div className={layout === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex overflow-x-auto gap-6 pb-6 snap-x"}>
                {services.map((service, index) => (
                    <motion.div
                        key={service.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={`group bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${layout === "carousel" ? "min-w-[300px] md:min-w-[350px] snap-center" : ""}`}
                    >
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-primary/10 text-primary`}><service.icon className="w-7 h-7" /></div>
                        <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                        <p className="text-muted-foreground mb-6 line-clamp-3">{service.description}</p>
                        <Button variant="outline" className="w-full" onClick={() => handleOpenModal(service.id)}>Start Project</Button>
                    </motion.div>
                ))}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{step === 1 ? "Select Service" : step === 2 ? "Client Details" : "Project Requirements"}</DialogTitle>
                        <DialogDescription>{step === 1 ? "Choose a service." : step === 2 ? "Tell us about your brand." : "Specific goals."}</DialogDescription>
                    </DialogHeader>

                    <AnimatePresence mode="wait">
                        <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="mt-4">
                            {step === 1 && (
                                <div className="grid grid-cols-2 gap-4">
                                    {services.map(s => (
                                        <div key={s.id} className={`cursor-pointer border rounded-lg p-4 hover:bg-secondary/50 ${selectedServiceId === s.id ? 'border-primary bg-primary/5' : ''}`} onClick={() => setSelectedServiceId(s.id)}>
                                            <div className="flex items-center gap-2 mb-2"><s.icon className="w-5 h-5 text-primary" /><span className="font-semibold text-sm">{s.title}</span></div>
                                        </div>
                                    ))}
                                    <Button className="col-span-2 mt-4" disabled={!selectedServiceId} onClick={handleNextStep}>Next Step</Button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input required placeholder="Full Name" value={clientDetails.fullName} onChange={e => setClientDetails({ ...clientDetails, fullName: e.target.value })} />
                                        <Input required placeholder="Business Name" value={clientDetails.businessName} onChange={e => setClientDetails({ ...clientDetails, businessName: e.target.value })} />
                                        <Input required placeholder="Email" type="email" value={clientDetails.email} onChange={e => setClientDetails({ ...clientDetails, email: e.target.value })} />
                                        <Input required placeholder="Phone" value={clientDetails.phone} onChange={e => setClientDetails({ ...clientDetails, phone: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input required placeholder="Industry" value={clientDetails.industry} onChange={e => setClientDetails({ ...clientDetails, industry: e.target.value })} />
                                        <Input required placeholder="Monthly Budget" value={clientDetails.monthlyBudgetRange} onChange={e => setClientDetails({ ...clientDetails, monthlyBudgetRange: e.target.value })} />
                                    </div>
                                    <Input required placeholder="Primary Goal" value={clientDetails.primaryGoal} onChange={e => setClientDetails({ ...clientDetails, primaryGoal: e.target.value })} />
                                    <Textarea required placeholder="Additional Notes" value={clientDetails.additionalNotes} onChange={e => setClientDetails({ ...clientDetails, additionalNotes: e.target.value })} />
                                    <Button className="w-full" onClick={handleNextStep}>Next: Strategy</Button>
                                </div>
                            )}

                            {step === 3 && (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="bg-secondary/20 p-4 rounded-lg border mb-4">
                                        <h4 className="font-semibold text-sm mb-2 text-primary">{services.find(s => s.id === selectedServiceId)?.title} Plan</h4>
                                        {renderSpecificFields()}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                                        <Button type="submit" className="flex-1" disabled={submitting}>
                                            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Submit Inquiry"}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default MarketingServices;
