
import { useState } from "react";
import { API_BASE_URL } from "@/config";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Trash2, ChevronRight, ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import * as XLSX from "xlsx";

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

interface SectionVisibility {
    overview?: boolean;
    roles?: boolean;
    curriculum?: boolean;
    benefits?: boolean;
    expertGuidance?: boolean;
    faqs?: boolean;
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
    faqs: FAQ[]; // Reverted to faqs to match form state and backend
    ctaText: string;
    order: number;
    sectionVisibility?: SectionVisibility;
    isVisible?: boolean; // NEW
}

interface Enquiry {
    _id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    role: string;
    technology: string;
    timeSlot: string;
    profileLink?: string;
    notes: string;
    submittedAt: string;
}

const CareerGuidanceAdmin = () => {
    const [view, setView] = useState<"home" | "add-careers" | "check-enquiries">("home");

    return (
        <div className="w-full h-full p-6">
            {view === "home" && (
                <div className="flex flex-col gap-6">
                    <h2 className="text-2xl font-bold">Career Guidance Management</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="cursor-pointer hover:shadow-lg transition-all border-blue-200" onClick={() => setView("add-careers")}>
                            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                                <Plus className="w-12 h-12 text-blue-500 mb-4" />
                                <h3 className="text-xl font-bold text-neutral-800">Manage Career Pages</h3>
                                <p className="text-neutral-500 mt-2">Create and edit detailed career pages.</p>
                            </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:shadow-lg transition-all border-green-200" onClick={() => setView("check-enquiries")}>
                            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                                <Table className="w-12 h-12 text-green-500 mb-4" />
                                <h3 className="text-xl font-bold text-neutral-800">Check Enquiries</h3>
                                <p className="text-neutral-500 mt-2">View and download student enquiries.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {view === "add-careers" && <ManageCareers onBack={() => setView("home")} />}
            {view === "check-enquiries" && <CheckEnquiries onBack={() => setView("home")} />}
        </div>
    );
};

// --- SUB-COMPONENT: Manage Careers ---
const ManageCareers = ({ onBack }: { onBack: () => void }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedTech, setSelectedTech] = useState<Technology | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Initial Form State
    const initialFormState: Omit<Technology, "_id" | "order"> = {
        name: "", tagline: "", intro: "", overview: "",
        roleOpportunities: [], expertGuidance: "", benefits: [],
        careerPath: [], toolsCovered: [], faqs: [], ctaText: "",
        sectionVisibility: {
            overview: true, roles: true, curriculum: true, benefits: true, expertGuidance: true, faqs: true
        },
        isVisible: false // Default hidden
    };

    const [formData, setFormData] = useState(initialFormState);

    // Fetch Technologies
    const { data: technologies, isLoading } = useQuery({
        queryKey: ["admin-technologies"],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/api/career/technologies?includeHidden=true`);
            return (await res.json()).data as Technology[];
        }
    });

    // Load Data into Form
    const handleSelectTech = (tech: Technology) => {
        setSelectedTech(tech);
        setIsEditing(true);
        setFormData({
            name: tech.name, tagline: tech.tagline, intro: tech.intro, overview: tech.overview || "",
            roleOpportunities: tech.roleOpportunities || [], expertGuidance: tech.expertGuidance || "",
            benefits: tech.benefits || [], careerPath: tech.careerPath || [],
            toolsCovered: tech.toolsCovered || [], faqs: tech.faqs || [], ctaText: tech.ctaText || "",
            sectionVisibility: {
                overview: true, roles: true, curriculum: true, benefits: true, expertGuidance: true, faqs: true,
                ...tech.sectionVisibility
            },
            isVisible: tech.isVisible !== undefined ? tech.isVisible : false
        });
    };

    const handleCreateNew = () => {
        setSelectedTech(null);
        setIsEditing(false);
        setFormData(initialFormState);
    };

    // Save Mutation
    const saveTechMutation = useMutation({
        mutationFn: async () => {
            const url = isEditing
                ? `${API_BASE_URL}/api/career/technologies/${selectedTech?._id}`
                : `${API_BASE_URL}/api/career/technologies`;
            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-technologies"] });
            toast({ title: "Success", description: "Career page saved successfully." });
            if (!isEditing) handleCreateNew();
        }
    });

    // Delete Mutation
    const deleteTechMutation = useMutation({
        mutationFn: async (id: string) => {
            await fetch(`${API_BASE_URL}/api/career/technologies/${id}`, { method: "DELETE" });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-technologies"] });
            toast({ title: "Deleted", description: "Career page deleted." });
            handleCreateNew();
        }
    });

    // Helper functions
    const addArrayItem = (field: keyof typeof formData, item: any) => {
        setFormData(prev => ({ ...prev, [field]: [...(prev[field] as any[]), item] }));
    };
    const removeArrayItem = (field: keyof typeof formData, index: number) => {
        setFormData(prev => ({ ...prev, [field]: (prev[field] as any[]).filter((_, i) => i !== index) }));
    };
    const updateArrayItem = (field: keyof typeof formData, index: number, value: any) => {
        setFormData(prev => {
            const newArray = [...(prev[field] as any[])];
            newArray[index] = value;
            return { ...prev, [field]: newArray };
        });
    };
    const toggleVisibility = (section: keyof SectionVisibility) => {
        setFormData(prev => ({
            ...prev,
            sectionVisibility: {
                ...prev.sectionVisibility,
                [section]: !prev.sectionVisibility?.[section]
            }
        }));
    };

    const VisibilityToggle = ({ section, label }: { section: keyof SectionVisibility, label: string }) => (
        <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">{label}</span>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleVisibility(section)}
                className={formData.sectionVisibility?.[section] !== false ? "text-green-600 hover:text-green-700" : "text-neutral-400 hover:text-neutral-500"}
                title={formData.sectionVisibility?.[section] !== false ? "Visible" : "Hidden"}
            >
                {formData.sectionVisibility?.[section] !== false ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </Button>
        </div>
    );

    return (
        <div className="flex h-full gap-6">
            {/* Sidebar - Resize to approx 50% of previous (was ~250px, now ~150px) */}
            <div className="w-[160px] border-r border-neutral-200 pr-2 flex flex-col shrink-0">
                <Button variant="ghost" onClick={onBack} className="mb-4 self-start pl-0 text-neutral-500">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="font-bold text-sm">Pages</h3>
                    <Button size="icon" className="h-6 w-6" onClick={handleCreateNew}><Plus className="w-3 h-3" /></Button>
                </div>
                <div className="space-y-1 overflow-y-auto flex-1">
                    {technologies?.map(tech => (
                        <div key={tech._id}
                            className={`p-2 rounded-md border cursor-pointer hover:bg-neutral-50 flex justify-between items-center text-xs ${selectedTech?._id === tech._id ? 'bg-blue-50 border-blue-500' : 'border-neutral-200'}`}
                            onClick={() => handleSelectTech(tech)}
                        >
                            <span className="font-medium truncate">{tech.name}</span>
                            {selectedTech?._id === tech._id && <ChevronRight className="w-3 h-3 text-blue-500" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Form Area */}
            <div className="flex-1 overflow-y-auto pr-2 pb-20">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{isEditing ? `Edit: ${formData.name}` : "Create New Page"}</h2>
                    <div className="flex gap-2 items-center">
                        {/* Toggle Visibility - Only show when Editing */}
                        {isEditing && (
                            <Button
                                variant="outline"
                                size="sm" /* Changed to sm for text fit */
                                onClick={() => setFormData({ ...formData, isVisible: !formData.isVisible })}
                                className={formData.isVisible ? "text-green-600 border-green-200 bg-green-50 flex gap-2 items-center" : "text-neutral-400 flex gap-2 items-center"}
                                title={formData.isVisible ? "Visible to Public" : "Hidden (Draft)"}
                            >
                                {formData.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                <span className="text-sm font-medium">{formData.isVisible ? "Visible" : "Hidden"}</span>
                            </Button>
                        )}

                        {isEditing && (
                            <Button variant="destructive" size="icon" onClick={() => deleteTechMutation.mutate(selectedTech!._id)} title="Delete Page">
                                <Trash2 className="w-5 h-5" />
                            </Button>
                        )}

                        <Button onClick={() => saveTechMutation.mutate()} disabled={saveTechMutation.isPending} className="bg-green-600 hover:bg-green-700 ml-2">
                            {saveTechMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            <Save className="w-4 h-4 mr-2" />
                            {isEditing ? "Update Page" : "Create Page"}
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="w-full justify-start mb-6 bg-neutral-100 p-1 flex-wrap">
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="overview">Overview {formData.sectionVisibility?.overview === false && "(Off)"}</TabsTrigger>
                        <TabsTrigger value="roles">Roles {formData.sectionVisibility?.roles === false && "(Off)"}</TabsTrigger>
                        <TabsTrigger value="curriculum">Curriculum {formData.sectionVisibility?.curriculum === false && "(Off)"}</TabsTrigger>
                        <TabsTrigger value="benefits">Benefits {formData.sectionVisibility?.benefits === false && "(Off)"}</TabsTrigger>
                        <TabsTrigger value="faqs">FAQs {formData.sectionVisibility?.faqs === false && "(Off)"}</TabsTrigger>
                    </TabsList>

                    {/* TAB: Basic Info */}
                    <TabsContent value="basic" className="space-y-4">
                        <Card>
                            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div><Label>Technology Name</Label><Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
                                <div><Label>Tagline</Label><Input value={formData.tagline} onChange={e => setFormData({ ...formData, tagline: e.target.value })} /></div>
                                <div><Label>Intro</Label><Textarea value={formData.intro} onChange={e => setFormData({ ...formData, intro: e.target.value })} /></div>
                                <div><Label>Custom CTA Text</Label><Input value={formData.ctaText} onChange={e => setFormData({ ...formData, ctaText: e.target.value })} /></div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TAB: Overview */}
                    <TabsContent value="overview" className="space-y-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <VisibilityToggle section="overview" label="Detailed Overview" />
                            </CardHeader>
                            <CardContent>
                                <Label className="mb-2 block">Content</Label>
                                <Textarea className="min-h-[300px]" value={formData.overview} onChange={e => setFormData({ ...formData, overview: e.target.value })} />
                                <div className="mt-8">
                                    <div className="flex items-center justify-between mb-2">
                                        <VisibilityToggle section="expertGuidance" label="Expert Guidance Section" />
                                    </div>
                                    <Textarea className="min-h-[150px]" value={formData.expertGuidance} onChange={e => setFormData({ ...formData, expertGuidance: e.target.value })} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TAB: Roles */}
                    <TabsContent value="roles" className="space-y-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <VisibilityToggle section="roles" label="Job Role Opportunities" />
                                <Button size="sm" onClick={() => addArrayItem("roleOpportunities", { role: "", description: "" })}><Plus className="w-4 h-4 mr-2" /> Add Role</Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {formData.roleOpportunities.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-start border p-4 rounded-md bg-neutral-50">
                                        <div className="flex-1 space-y-2">
                                            <Input placeholder="Role Title" value={item.role} onChange={e => updateArrayItem('roleOpportunities', idx, { ...item, role: e.target.value })} />
                                            <Textarea placeholder="Description" value={item.description} onChange={e => updateArrayItem('roleOpportunities', idx, { ...item, description: e.target.value })} />
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => removeArrayItem('roleOpportunities', idx)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TAB: Curriculum */}
                    <TabsContent value="curriculum" className="space-y-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <VisibilityToggle section="curriculum" label="Career Path Timeline" />
                                <Button size="sm" onClick={() => addArrayItem("careerPath", { title: "", description: "" })}><Plus className="w-4 h-4 mr-2" /> Add Step</Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {formData.careerPath.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-start border p-4 rounded-md bg-neutral-50 relative">
                                        <div className="bg-neutral-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-neutral-600 absolute -left-4 top-4 border-4 border-white">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 space-y-2 ml-4">
                                            <Input placeholder="Step Title" value={item.title} onChange={e => updateArrayItem('careerPath', idx, { ...item, title: e.target.value })} />
                                            <Textarea placeholder="Description" value={item.description} onChange={e => updateArrayItem('careerPath', idx, { ...item, description: e.target.value })} />
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => removeArrayItem('careerPath', idx)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TAB: Benefits */}
                    <TabsContent value="benefits" className="space-y-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <VisibilityToggle section="benefits" label="Benefits & Tools" />
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <Label>Key Benefits</Label>
                                            <Button size="sm" variant="outline" onClick={() => addArrayItem("benefits", "")}><Plus className="w-3 h-3" /></Button>
                                        </div>
                                        <div className="space-y-2">
                                            {formData.benefits.map((item, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <Input value={item} onChange={e => updateArrayItem('benefits', idx, e.target.value)} />
                                                    <Button variant="ghost" size="icon" onClick={() => removeArrayItem('benefits', idx)}><Trash2 className="w-4 h-4" /></Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <Label>Tools Covered</Label>
                                            <Button size="sm" variant="outline" onClick={() => addArrayItem("toolsCovered", "")}><Plus className="w-3 h-3" /></Button>
                                        </div>
                                        <div className="space-y-2">
                                            {formData.toolsCovered.map((item, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <Input value={item} onChange={e => updateArrayItem('toolsCovered', idx, e.target.value)} />
                                                    <Button variant="ghost" size="icon" onClick={() => removeArrayItem('toolsCovered', idx)}><Trash2 className="w-4 h-4" /></Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TAB: FAQs */}
                    <TabsContent value="faqs" className="space-y-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <VisibilityToggle section="faqs" label="Frequently Asked Questions" />
                                <Button size="sm" onClick={() => addArrayItem("faqs", { question: "", answer: "" })}><Plus className="w-4 h-4 mr-2" /> Add FAQ</Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {formData.faqs.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-start border-b pb-4 last:border-0">
                                        <div className="flex-1 space-y-2">
                                            <Input placeholder="Question" value={item.question} onChange={e => updateArrayItem('faqs', idx, { ...item, question: e.target.value })} className="font-medium" />
                                            <Textarea placeholder="Answer" value={item.answer} onChange={e => updateArrayItem('faqs', idx, { ...item, answer: e.target.value })} />
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => removeArrayItem('faqs', idx)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    );
};

// CheckEnquiries component remains exact same
const CheckEnquiries = ({ onBack }: { onBack: () => void }) => {
    const { data: enquiries, isLoading } = useQuery({
        queryKey: ["career-enquiries"],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/api/career/enquiries`);
            return (await res.json()).data as Enquiry[];
        }
    });

    const downloadExcel = () => {
        if (!enquiries) return;
        const ws = XLSX.utils.json_to_sheet(enquiries);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Enquiries");
        XLSX.writeFile(wb, "Career_Enquiries.xlsx");
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <Button variant="ghost" onClick={onBack} className="pl-0"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                <h2 className="text-2xl font-bold">Career Enquiries</h2>
                <Button variant="outline" onClick={downloadExcel} disabled={!enquiries?.length}>Download Excel</Button>
            </div>
            <div className="flex-1 overflow-auto border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Technology</TableHead><TableHead>Status</TableHead><TableHead>Role</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? <TableRow><TableCell colSpan={7} className="text-center p-8">Loading...</TableCell></TableRow>
                            : enquiries?.map((e) => (
                                <TableRow key={e._id}>
                                    <TableCell>{new Date(e.submittedAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{e.name}</span>
                                            {e.profileLink && (
                                                <a href={e.profileLink} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">
                                                    View Profile
                                                </a>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{e.email}</TableCell>
                                    <TableCell>{e.phone}</TableCell>
                                    <TableCell>{e.technology}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{e.status}</span>
                                            {e.timeSlot && <span className="text-xs text-slate-500 font-medium">{new Date(e.timeSlot).toLocaleString()}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>{e.role}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default CareerGuidanceAdmin;
