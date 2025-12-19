import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Lock, User, LogOut, MessageSquare, Trophy, Plus, Save, ChevronDown, ChevronUp, ExternalLink, Download, Eye, EyeOff, Trash2, GraduationCap, Monitor, Briefcase, TrendingUp, Megaphone, Quote } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

const AdminPanel = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState("contacts");

    // Data States
    const [contacts, setContacts] = useState<any[]>([]);
    const [hackathons, setHackathons] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // UI States
    const [expandedHackathonId, setExpandedHackathonId] = useState<string | null>(null);

    // New Hackathon Form State
    const [newHackathon, setNewHackathon] = useState({
        name: "",
        mode: "Online",
        description: "",
        teamSizeMin: 1,
        teamSizeMax: 4,
        isPaid: false,
        techStack: "",
        startDate: "",
        endDate: "",
        organizerContact: ""
    });

    // Programs State
    const [programs, setPrograms] = useState<any[]>([]);
    const [programApplications, setProgramApplications] = useState<any[]>([]);

    // Tech Applications State
    const [techApplications, setTechApplications] = useState<any[]>([]);

    // Staffing Applications State
    const [staffingApplications, setStaffingApplications] = useState<any[]>([]);

    // Marketing Applications State
    const [marketingApplications, setMarketingApplications] = useState<any[]>([]);

    // Testimonials & Case Studies State
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [newContent, setNewContent] = useState<any>({
        type: "testimonial",
        isActive: true,
        order: 1,
        // Testimonial Defaults
        quote: "",
        client: { initials: "", name: "", designation: "", company: "" },
        highlightMetric: { label: "", value: "" },
        // Case Study Defaults
        industry: "", duration: "", platforms: [], title: "", challenge: "", solution: "", results: []
    });
    // For modifying arrays in form
    const [tempPlatform, setTempPlatform] = useState("");
    const [tempResults, setTempResults] = useState<{ label: string, value: string }[]>([]);
    // We can just use newContent.results directly but need helper for inputs
    const [editingContentId, setEditingContentId] = useState<string | null>(null);



    // New Program Form State
    const [newProgram, setNewProgram] = useState({
        type: "Training", // Training or Internship
        title: "",
        description: "",
        mode: "Online",
        duration: "",
        startDate: "",
        endDate: "",
        // Training specific
        fee: 0,
        skillsCovered: "",
        // Internship specific
        stipend: 0,
        requiredSkills: "",
        openings: 1,

        isPaid: true,
        certificateProvided: true,
        status: "Active"
    });

    const ADMIN_PASSWORD = "652487";

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            toast.success("Login successful");
            fetchContacts();
        } else {
            toast.error("Invalid password");
        }
    };

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/contacts");
            const data = await response.json();
            if (data.success) setContacts(data.data);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHackathons = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/hackathons");
            const data = await response.json();
            if (data.success) setHackathons(data.data);
        } catch (error) {
            console.error("Error fetching hackathons:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/applications");
            const data = await response.json();
            if (data.success) setApplications(data.data);
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    // --- Technology Applications Handlers ---
    const fetchTechApplications = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/technology-applications");
            const data = await response.json();
            if (data.success) setTechApplications(data.data);
        } catch (error) {
            console.error("Error fetching tech applications");
        }
    };

    // --- Marketing Applications Handlers ---
    const fetchMarketingApplications = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/marketing-applications");
            const data = await response.json();
            if (data.success) setMarketingApplications(data.data);
        } catch (error) {
            console.error("Error fetching marketing applications");
        }
    };

    // --- Testimonials & Content Handlers ---
    const fetchTestimonials = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/testimonials");
            const data = await response.json();
            if (data.success) setTestimonials(data.data);
        } catch (error) {
            console.error("Error fetching content");
        }
    };

    const handleSaveContent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { ...newContent };
            // Ensure array fields are set properly for Case Study if needed

            const method = editingContentId ? "PUT" : "POST";
            const url = editingContentId
                ? `http://localhost:5000/api/testimonials/${editingContentId}`
                : "http://localhost:5000/api/testimonials";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (data.success) {
                toast.success(editingContentId ? "Content Updated" : "Content Created");
                fetchTestimonials();
                setEditingContentId(null);
                // Reset Default
                setNewContent({
                    type: "testimonial",
                    isActive: true,
                    order: 1,
                    quote: "",
                    client: { initials: "", name: "", designation: "", company: "" },
                    highlightMetric: { label: "", value: "" },
                    industry: "", duration: "", platforms: [], title: "", challenge: "", solution: "", results: []
                });
            } else {
                toast.error("Operation failed");
            }
        } catch (error) {
            toast.error("Error saving content");
        }
    };

    const handleDeleteContent = async (id: string) => {
        if (!confirm("Delete this content?")) return;
        try {
            await fetch(`http://localhost:5000/api/testimonials/${id}`, { method: "DELETE" });
            toast.success("Deleted");
            fetchTestimonials();
        } catch (e) { toast.error("Error deleting"); }
    };

    // Helper to toggle active status
    const toggleContentStatus = async (id: string, current: boolean) => {
        try {
            await fetch(`http://localhost:5000/api/testimonials/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !current })
            });
            fetchTestimonials();
            toast.success("Status Updated");
        } catch (e) { toast.error("Error updating status"); }
    };

    // --- Staffing Applications Handlers ---
    const fetchStaffingApplications = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/staffing-applications");
            const data = await response.json();
            if (data.success) setStaffingApplications(data.data);
        } catch (error) {
            console.error("Error fetching staffing applications");
        }
    };



    const handleDownloadMarketingCSV = () => {
        if (marketingApplications.length === 0) return toast.error("No data to download");

        const headers = ["Date", "Business", "Contact", "Email", "Phone", "Service", "Details"];

        const rows = marketingApplications.map(app => {
            return [
                new Date(app.submittedAt).toLocaleDateString(),
                app.clientDetails?.businessName,
                app.clientDetails?.fullName,
                app.clientDetails?.email,
                app.clientDetails?.phone,
                app.clientDetails?.selectedService,
                JSON.stringify(app.digitalMarketingRequirements).replace(/"/g, "'")
            ].map(f => `"${f || ''}"`).join(",");
        });

        const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csv);
        const link = document.createElement("a");
        link.href = encodedUri;
        link.download = `marketing_leads_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const handleDownloadStaffingCSV = () => {
        if (staffingApplications.length === 0) return toast.error("No data to download");

        const headers = [
            "Date", "Service Category", "Company Name", "Contact Person", "Email", "Phone",
            "Industry", "Size", "Timeline", "Budget", "Specific Requirements"
        ];

        const rows = staffingApplications.map(app => {
            const date = new Date(app.submittedAt).toLocaleDateString();
            const specific = JSON.stringify(app.staffingRequirements).replace(/"/g, "'"); // Escape quotes

            return [
                date,
                app.serviceCategory,
                app.companyDetails?.companyName,
                app.companyDetails?.contactPerson,
                app.companyDetails?.email,
                app.companyDetails?.phone,
                app.companyDetails?.industry,
                app.companyDetails?.companySize,
                app.companyDetails?.hiringTimeline,
                app.companyDetails?.budgetRange,
                specific
            ].map(f => `"${f || ''}"`).join(",");
        });

        const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csv);
        const link = document.createElement("a");
        link.href = encodedUri;
        link.download = `staffing_applications_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const handleCreateHackathon = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...newHackathon,
                teamSize: { min: newHackathon.teamSizeMin, max: newHackathon.teamSizeMax }
            };

            const response = await fetch("http://localhost:5000/api/hackathons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await response.json();

            if (data.success) {
                toast.success("Hackathon Created Successfully!");
                fetchHackathons();
                // Reset form
                setNewHackathon({
                    name: "", mode: "Online", description: "", teamSizeMin: 1, teamSizeMax: 4,
                    isPaid: false, techStack: "", startDate: "", endDate: "", organizerContact: ""
                });
            } else {
                toast.error("Failed to create hackathon");
            }
        } catch (error) {
            toast.error("Error creating hackathon");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPassword("");
        setContacts([]);
    };

    const handleToggleVisibility = async (id: string, currentStatus: boolean) => {
        try {
            const response = await fetch(`http://localhost:5000/api/hackathons/${id}/visibility`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isHidden: !currentStatus }) // Toggle
            });
            const data = await response.json();
            if (data.success) {
                toast.success(currentStatus ? "Hackathon is now visible" : "Hackathon is now hidden");
                fetchHackathons();
            } else {
                toast.error("Failed to update visibility");
            }
        } catch (error) {
            toast.error("Error updating visibility");
        }
    };

    const handleDeleteHackathon = async (id: string) => {
        if (!confirm("Are you sure you want to delete this hackathon? This cannot be undone.")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/hackathons/${id}`, {
                method: "DELETE"
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Hackathon deleted successfully");
                fetchHackathons();
            } else {
                toast.error("Failed to delete hackathon");
            }
        } catch (error) {
            toast.error("Error deleting hackathon");
        }
    };

    // --- Programs Handlers ---

    const fetchPrograms = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/programs");
            const data = await response.json();
            if (data.success) setPrograms(data.data);
        } catch (error) {
            console.error("Error fetching programs");
        }
    };

    const fetchProgramApplications = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/program-applications");
            const data = await response.json();
            if (data.success) setProgramApplications(data.data);
        } catch (error) {
            console.error("Error fetching program applications");
        }
    };

    const handleCreateProgram = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/programs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProgram)
            });
            const data = await response.json();
            if (data.success) {
                toast.success(`${newProgram.type} Created!`);
                fetchPrograms();
                // Reset common fields
                setNewProgram({
                    ...newProgram,
                    title: "", description: "", duration: "",
                    fee: 0, stipend: 0, skillsCovered: "", requiredSkills: ""
                });
            } else {
                toast.error("Failed to create program");
            }
        } catch (error) {
            toast.error("Error creating program");
        }
    };

    const handleDeleteProgram = async (id: string) => {
        if (!confirm("Delete this program?")) return;
        try {
            const response = await fetch(`http://localhost:5000/api/programs/${id}`, { method: "DELETE" });
            if (response.ok) {
                toast.success("Program Deleted");
                fetchPrograms();
            }
        } catch (error) {
            toast.error("Error deleting program");
        }
    };

    // Trigger data fetch on tab change
    const onTabChange = (value: string) => {
        setActiveTab(value);
        if (value === 'contacts') fetchContacts();
        if (value === 'hackathons') {
            fetchHackathons();
            fetchApplications();
        }
        if (value === 'programs') {
            fetchPrograms();
            fetchProgramApplications();
        }
        if (value === 'tech_apps') {
            fetchTechApplications();
        }
        if (value === 'staffing') {
            fetchStaffingApplications();
        }
        if (value === 'marketing') {
            fetchMarketingApplications();
        }
        if (value === 'content') {
            fetchTestimonials();
        }
    };

    // Login Screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <Card className="border-border">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Lock className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">Admin Login</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        type="password"
                                        placeholder="Enter Admin Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-background"
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Access Dashboard
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    // Dashboard Interface
    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-border bg-card p-6 hidden md:flex flex-col">
                <div className="mb-8 flex items-center gap-2 px-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                        A
                    </div>
                    <span className="font-bold text-lg">Admin Panel</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <Button
                        variant={activeTab === "contacts" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => onTabChange("contacts")}
                    >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contacts
                    </Button>
                    <Button
                        variant={activeTab === "hackathons" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => onTabChange("hackathons")}
                    >
                        <Trophy className="w-4 h-4 mr-2" />
                        Hackathons
                    </Button>
                    <Button
                        variant={activeTab === "programs" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => onTabChange("programs")}
                    >
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Programs
                    </Button>
                    <Button
                        variant={activeTab === "tech_apps" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => onTabChange("tech_apps")}
                    >
                        <Monitor className="w-4 h-4 mr-2" />
                        Tech Apps
                    </Button>
                    <Button
                        variant={activeTab === "staffing" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => onTabChange("staffing")}
                    >
                        <Briefcase className="w-4 h-4 mr-2" />
                        Staffing
                    </Button>
                    <Button
                        variant={activeTab === "marketing" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => onTabChange("marketing")}
                    >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Marketing
                    </Button>
                    <Button
                        variant={activeTab === "content" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => onTabChange("content")}
                    >
                        <Megaphone className="w-4 h-4 mr-2" />
                        Content Manager
                    </Button>
                </nav>

                <div className="mt-auto pt-6 border-t border-border">
                    <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="border-b border-border h-16 flex items-center justify-between px-6 bg-card/50 backdrop-blur">
                    <h1 className="font-semibold text-lg capitalize">{activeTab}</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">Admin User</span>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-6">
                    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">

                        {/* CONTACTS TAB */}
                        <TabsContent value="contacts" className="mt-0">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Received Messages</CardTitle>
                                    <Button variant="outline" size="sm" onClick={fetchContacts} disabled={loading}>
                                        Refresh
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {loading && contacts.length === 0 ? (
                                        <div className="text-center py-8">Loading...</div>
                                    ) : (
                                        <div className="rounded-md border border-border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Date</TableHead>
                                                        <TableHead>Name</TableHead>
                                                        <TableHead>Email</TableHead>
                                                        <TableHead>Service</TableHead>
                                                        <TableHead>Message</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {contacts.map((contact, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell className="text-xs text-muted-foreground">
                                                                {new Date(contact.submittedAt).toLocaleDateString()}
                                                            </TableCell>
                                                            <TableCell>{contact.name}</TableCell>
                                                            <TableCell>{contact.email}</TableCell>
                                                            <TableCell>{contact.service}</TableCell>
                                                            <TableCell className="max-w-xs truncate">{contact.message}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* HACKATHONS TAB */}
                        <TabsContent value="hackathons" className="mt-0">
                            <div className="grid lg:grid-cols-2 gap-6">
                                {/* Create Hackathon Form */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Create New Hackathon</CardTitle>
                                        <CardDescription>Fill in the details to publish a new event.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleCreateHackathon} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Hackathon Name</Label>
                                                    <Input
                                                        placeholder="e.g. CodeSprint 2025"
                                                        value={newHackathon.name}
                                                        onChange={(e) => setNewHackathon({ ...newHackathon, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Mode</Label>
                                                    <select
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        value={newHackathon.mode}
                                                        onChange={(e) => setNewHackathon({ ...newHackathon, mode: e.target.value })}
                                                    >
                                                        <option value="Online">Online</option>
                                                        <option value="Offline">Offline</option>
                                                        <option value="Hybrid">Hybrid</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Description</Label>
                                                <textarea
                                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    placeholder="Describe the hackathon goal, themes, and details..."
                                                    value={newHackathon.description}
                                                    onChange={(e) => setNewHackathon({ ...newHackathon, description: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Start Date</Label>
                                                    <Input type="date"
                                                        value={newHackathon.startDate}
                                                        onChange={(e) => setNewHackathon({ ...newHackathon, startDate: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>End Date</Label>
                                                    <Input type="date"
                                                        value={newHackathon.endDate}
                                                        onChange={(e) => setNewHackathon({ ...newHackathon, endDate: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Min Team Size</Label>
                                                    <Input type="number" min="1"
                                                        value={newHackathon.teamSizeMin}
                                                        onChange={(e) => setNewHackathon({ ...newHackathon, teamSizeMin: parseInt(e.target.value) })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Max Team Size</Label>
                                                    <Input type="number" min="1"
                                                        value={newHackathon.teamSizeMax}
                                                        onChange={(e) => setNewHackathon({ ...newHackathon, teamSizeMax: parseInt(e.target.value) })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Tech Stack</Label>
                                                <Input
                                                    placeholder="e.g. Web, AI/ML, Blockchain"
                                                    value={newHackathon.techStack}
                                                    onChange={(e) => setNewHackathon({ ...newHackathon, techStack: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Organizer Contact Email</Label>
                                                <Input type="email"
                                                    placeholder="organizer@example.com"
                                                    value={newHackathon.organizerContact}
                                                    onChange={(e) => setNewHackathon({ ...newHackathon, organizerContact: e.target.value })}
                                                />
                                            </div>

                                            <Button type="submit" className="w-full">
                                                <Save className="w-4 h-4 mr-2" />
                                                Publish Hackathon
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>

                                {/* Existing Hackathons List */}
                                <Card className="lg:col-span-1 h-fit">
                                    <CardHeader>
                                        <CardTitle>Existing Hackathons</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {hackathons.length === 0 ? (
                                                <p className="text-muted-foreground text-sm">No hackathons created yet.</p>
                                            ) : (
                                                hackathons.map((h, i) => {
                                                    // Calculate applications for this hackathon
                                                    const hackathonApps = applications.filter(app => app.hackathonId === h._id);
                                                    const isExpanded = expandedHackathonId === h._id;

                                                    const handleDownloadCSV = () => {
                                                        if (hackathonApps.length === 0) {
                                                            toast.error("No data to download");
                                                            return;
                                                        }

                                                        const headers = ["Type", "Name/Team Name", "Email/Leader Email", "Phone", "Organization", "GitHub", "Team Members"];
                                                        const rows = hackathonApps.map(app => {
                                                            const type = app.participantType;
                                                            const name = type === 'Team' ? app.teamName : app.fullName;
                                                            const email = type === 'Team' ? app.leader?.email : app.email;
                                                            const phone = type === 'Team' ? app.leader?.phone : app.phone;
                                                            const org = type === 'Team' ? app.leader?.organization : app.organization;
                                                            const github = type === 'Team' ? app.leader?.github : app.github;
                                                            const members = type === 'Team'
                                                                ? app.teamMembers?.map((m: any) => `${m.fullName} (${m.email})`).join("; ")
                                                                : "N/A";

                                                            return [type, name, email, phone, org, github, members].map(field => `"${field || ''}"`).join(",");
                                                        });

                                                        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
                                                        const encodedUri = encodeURI(csvContent);
                                                        const link = document.createElement("a");
                                                        link.setAttribute("href", encodedUri);
                                                        link.setAttribute("download", `${h.name.replace(/\s+/g, '_')}_applicants.csv`);
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                    };

                                                    return (
                                                        <div key={i} className="rounded-lg border border-border bg-card overflow-hidden">
                                                            <div className="p-4 flex flex-col gap-2">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <h4 className="font-semibold">{h.name}</h4>
                                                                        <p className="text-xs text-muted-foreground">{h.mode} • {h.startDate}</p>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                                                            {h.status}
                                                                        </div>
                                                                        {h.isHidden && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Hidden</span>}
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                                                                    <span className="text-sm font-medium text-muted-foreground">
                                                                        {hackathonApps.length} Applicants
                                                                    </span>
                                                                    <div className="flex items-center gap-2">
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="h-8 gap-1 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                                                                            onClick={handleDownloadCSV}
                                                                        >
                                                                            <Download className="w-3 h-3" />
                                                                            CSV
                                                                        </Button>

                                                                        {/* Toggle Visibility */}
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => handleToggleVisibility(h._id, h.isHidden)}
                                                                            className={`h-8 w-8 p-0 ${h.isHidden ? "text-gray-500" : "text-blue-600"}`}
                                                                            title={h.isHidden ? "Show Hackathon" : "Hide Hackathon"}
                                                                        >
                                                                            {h.isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                        </Button>

                                                                        {/* Delete Hackathon */}
                                                                        <Button
                                                                            variant="destructive"
                                                                            size="sm"
                                                                            onClick={() => handleDeleteHackathon(h._id)}
                                                                            className="h-8 w-8 p-0"
                                                                            title="Delete Hackathon"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>

                                                                        <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => setExpandedHackathonId(isExpanded ? null : h._id)}>
                                                                            {isExpanded ? (
                                                                                <>Hide <ChevronUp className="w-3 h-3" /></>
                                                                            ) : (
                                                                                <>View <ChevronDown className="w-3 h-3" /></>
                                                                            )}
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {isExpanded && (
                                                                <div className="bg-secondary/10 p-4 border-t border-border">
                                                                    {hackathonApps.length === 0 ? (
                                                                        <p className="text-xs text-muted-foreground text-center">No applications yet.</p>
                                                                    ) : (
                                                                        <div className="overflow-x-auto">
                                                                            <Table>
                                                                                <TableHeader>
                                                                                    <TableRow>
                                                                                        <TableHead className="text-xs">Type</TableHead>
                                                                                        <TableHead className="text-xs">Name / Team</TableHead>
                                                                                        <TableHead className="text-xs">Contact</TableHead>
                                                                                        <TableHead className="text-xs">GitHub</TableHead>
                                                                                    </TableRow>
                                                                                </TableHeader>
                                                                                <TableBody>
                                                                                    {hackathonApps.map((app, j) => (
                                                                                        <TableRow key={j}>
                                                                                            <TableCell className="text-xs font-medium">
                                                                                                {app.participantType}
                                                                                            </TableCell>
                                                                                            <TableCell className="text-xs">
                                                                                                {app.participantType === 'Team' ? (
                                                                                                    <div>
                                                                                                        <span className="font-bold">{app.teamName}</span>
                                                                                                        <div className="text-[10px] text-muted-foreground">Lead: {app.leader?.fullName}</div>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                    app.fullName
                                                                                                )}
                                                                                            </TableCell>
                                                                                            <TableCell className="text-xs">
                                                                                                <div className="truncate max-w-[100px]">
                                                                                                    {app.participantType === 'Team' ? app.leader?.email : app.email}
                                                                                                </div>
                                                                                            </TableCell>
                                                                                            <TableCell className="text-xs">
                                                                                                {(app.participantType === 'Team' ? app.leader.github : app.github) && (
                                                                                                    <a
                                                                                                        href={app.participantType === 'Team' ? app.leader.github : app.github}
                                                                                                        target="_blank"
                                                                                                        rel="noreferrer"
                                                                                                        className="text-primary hover:underline flex items-center gap-1"
                                                                                                    >
                                                                                                        Link <ExternalLink className="w-2 h-2" />
                                                                                                    </a>
                                                                                                )}
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    ))}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* PROGRAMS TAB (Training & Internships) */}
                        <TabsContent value="programs" className="mt-0">
                            <div className="grid lg:grid-cols-2 gap-6">
                                {/* Create Program Form */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Create Programme (Training / Internship)</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleCreateProgram} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Program Type</Label>
                                                <select
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                    value={newProgram.type}
                                                    onChange={(e) => setNewProgram({ ...newProgram, type: e.target.value })}
                                                >
                                                    <option value="Training">Training</option>
                                                    <option value="Internship">Internship</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Title</Label>
                                                <Input value={newProgram.title} onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })} placeholder="e.g. Web Development Bootcamp" required />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Description</Label>
                                                <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm border-gray-200" value={newProgram.description} onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })} required />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Mode</Label>
                                                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newProgram.mode} onChange={(e) => setNewProgram({ ...newProgram, mode: e.target.value })}>
                                                        <option value="Online">Online</option>
                                                        <option value="Offline">Offline</option>
                                                        <option value="Hybrid">Hybrid</option>
                                                        <option value="Remote">Remote</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Duration</Label>
                                                    <Input value={newProgram.duration} onChange={(e) => setNewProgram({ ...newProgram, duration: e.target.value })} placeholder="e.g. 6 Weeks / 3 Months" required />
                                                </div>
                                            </div>

                                            {newProgram.type === "Training" ? (
                                                <>
                                                    <div className="space-y-2">
                                                        <Label>Fee (₹)</Label>
                                                        <Input type="number" value={newProgram.fee} onChange={(e) => setNewProgram({ ...newProgram, fee: parseInt(e.target.value) })} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Skills Covered</Label>
                                                        <Input value={newProgram.skillsCovered} onChange={(e) => setNewProgram({ ...newProgram, skillsCovered: e.target.value })} placeholder="HTML, CSS, React..." />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="space-y-2">
                                                        <Label>Stipend (₹)</Label>
                                                        <Input type="number" value={newProgram.stipend} onChange={(e) => setNewProgram({ ...newProgram, stipend: parseInt(e.target.value) })} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Required Skills</Label>
                                                        <Input value={newProgram.requiredSkills} onChange={(e) => setNewProgram({ ...newProgram, requiredSkills: e.target.value })} placeholder="Basic JavaScript Knowledge..." />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Openings</Label>
                                                        <Input type="number" value={newProgram.openings} onChange={(e) => setNewProgram({ ...newProgram, openings: parseInt(e.target.value) })} />
                                                    </div>
                                                </>
                                            )}

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Start Date</Label>
                                                    <Input type="date" value={newProgram.startDate} onChange={(e) => setNewProgram({ ...newProgram, startDate: e.target.value })} required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>End Date</Label>
                                                    <Input type="date" value={newProgram.endDate} onChange={(e) => setNewProgram({ ...newProgram, endDate: e.target.value })} required />
                                                </div>
                                            </div>

                                            <Button type="submit" className="w-full">Create {newProgram.type}</Button>
                                        </form>
                                    </CardContent>
                                </Card>

                                {/* List Programs */}
                                <Card className="lg:col-span-1 h-fit">
                                    <CardHeader>
                                        <CardTitle>Active Programs</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {programs.length === 0 ? <p className="text-muted-foreground text-sm">No programs yet.</p> : programs.map((program) => {
                                                const apps = programApplications.filter(a => (program.type === "Training" ? a.trainingId : a.internshipId) === program._id);
                                                return (
                                                    <div key={program._id} className="border p-4 rounded-lg bg-card">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${program.type === 'Training' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                                                        {program.type}
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground">{program.mode}</span>
                                                                </div>
                                                                <h4 className="font-bold">{program.title}</h4>
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {program.duration} • {program.startDate} to {program.endDate}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-muted-foreground">{apps.length} Applications</span>
                                                                <div className="flex gap-2">
                                                                    {/* CSV Download for Program Applicants - Placeholder Logic */}
                                                                    <Button variant="outline" size="sm" className="h-8 gap-1 text-green-600 border-green-200 hover:bg-green-50" onClick={() => {
                                                                        if (apps.length === 0) return toast.error("No applicants");
                                                                        const headers = ["Name", "Email", "Phone", "Age", "College", "Type"];
                                                                        const rows = apps.map(a => [a.fullName, a.email, a.phone, a.age, a.collegeName, program.type].map(f => `"${f || ''}"`).join(","));
                                                                        const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
                                                                        const link = document.createElement("a");
                                                                        link.href = encodeURI(csv);
                                                                        link.download = `${program.title}_applicants.csv`;
                                                                        link.click();
                                                                    }}>
                                                                        <Download className="w-3 h-3" />
                                                                    </Button>
                                                                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeleteProgram(program._id)}>
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* TECH APPLICATIONS TAB */}
                        <TabsContent value="tech_apps" className="mt-0">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Technology Inquiries</CardTitle>
                                    <Button variant="outline" size="sm" onClick={fetchTechApplications}>
                                        Refresh
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {techApplications.length === 0 ? (
                                        <div className="text-center py-8 text-black">No inquiries yet.</div>
                                    ) : (
                                        <div className="rounded-md border border-border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Date</TableHead>
                                                        <TableHead>Category</TableHead>
                                                        <TableHead>Client</TableHead>
                                                        <TableHead>Company</TableHead>
                                                        <TableHead>Budget</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {techApplications.map((app, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell className="text-xs text-muted-foreground">
                                                                {new Date(app.submittedAt).toLocaleDateString()}
                                                            </TableCell>
                                                            <TableCell><span className="font-semibold text-primary">{app.serviceCategory}</span></TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{app.commonDetails?.fullName}</span>
                                                                    <span className="text-xs text-muted-foreground">{app.commonDetails?.email}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{app.commonDetails?.companyName || "-"}</TableCell>
                                                            <TableCell>{app.commonDetails?.budgetRange || "-"}</TableCell>
                                                            <TableCell>
                                                                <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold">New</span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button size="sm" variant="outline" onClick={() => {
                                                                    alert(JSON.stringify(app.serviceDetails, null, 2));
                                                                }}>
                                                                    View Details
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* STAFFING APPLICATIONS TAB */}
                        <TabsContent value="staffing" className="mt-0">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Staffing Requests</CardTitle>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={handleDownloadStaffingCSV} className="text-green-600 border-green-200">
                                            <Download className="w-4 h-4 mr-2" />
                                            Download CSV
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={fetchStaffingApplications}>
                                            Refresh
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {staffingApplications.length === 0 ? (
                                        <div className="text-center py-8 text-black">No staffing requests yet.</div>
                                    ) : (
                                        <div className="rounded-md border border-border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Date</TableHead>
                                                        <TableHead>Category</TableHead>
                                                        <TableHead>Company</TableHead>
                                                        <TableHead>Contact</TableHead>
                                                        <TableHead>Phone</TableHead>
                                                        <TableHead>Action</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {staffingApplications.map((app, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell className="text-xs text-muted-foreground">
                                                                {new Date(app.submittedAt).toLocaleDateString()}
                                                            </TableCell>
                                                            <TableCell><span className="font-semibold text-primary">{app.serviceCategory}</span></TableCell>
                                                            <TableCell>{app.companyDetails?.companyName}</TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{app.companyDetails?.contactPerson}</span>
                                                                    <span className="text-xs text-muted-foreground">{app.companyDetails?.email}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{app.companyDetails?.phone}</TableCell>
                                                            <TableCell>
                                                                <Button size="sm" variant="outline" onClick={() => {
                                                                    alert(JSON.stringify(app.staffingRequirements, null, 2));
                                                                }}>
                                                                    View Req
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* MARKETING TAB */}
                        <TabsContent value="marketing" className="mt-0">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Marketing Leads</CardTitle>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={handleDownloadMarketingCSV} className="text-green-600 border-green-200">
                                            <Download className="w-4 h-4 mr-2" />
                                            CSV
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={fetchMarketingApplications}>
                                            Refresh
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {marketingApplications.length === 0 ? <p className="text-center py-8">No marketing leads found.</p> : (
                                        <div className="rounded-md border border-border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Date</TableHead>
                                                        <TableHead>Business</TableHead>
                                                        <TableHead>Contact</TableHead>
                                                        <TableHead>Service</TableHead>
                                                        <TableHead>Budget</TableHead>
                                                        <TableHead>Action</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {marketingApplications.map((app, i) => (
                                                        <TableRow key={i}>
                                                            <TableCell className="text-xs text-muted-foreground">{new Date(app.submittedAt).toLocaleDateString()}</TableCell>
                                                            <TableCell>{app.clientDetails.businessName}</TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col">
                                                                    <span>{app.clientDetails.fullName}</span>
                                                                    <span className="text-xs text-muted-foreground">{app.clientDetails.email}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell><span className="text-primary font-medium">{app.clientDetails.selectedService}</span></TableCell>
                                                            <TableCell>{app.clientDetails.monthlyBudgetRange}</TableCell>
                                                            <TableCell>
                                                                <Button size="sm" variant="outline" onClick={() => alert(JSON.stringify(app.digitalMarketingRequirements, null, 2))}>
                                                                    Reqs
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* CONTENT MANAGER TAB */}
                        <TabsContent value="content" className="mt-0">
                            <div className="grid lg:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{editingContentId ? "Edit Content" : "Add New Content"}</CardTitle>
                                        <CardDescription>Create Testimonials or Case Studies</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSaveContent} className="space-y-4">
                                            <div className="flex gap-4">
                                                <div className="w-1/2">
                                                    <Label>Type</Label>
                                                    <select
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        value={newContent.type}
                                                        onChange={(e) => setNewContent({ ...newContent, type: e.target.value })}
                                                    >
                                                        <option value="testimonial">Testimonial</option>
                                                        <option value="caseStudy">Case Study</option>
                                                    </select>
                                                </div>
                                                <div className="w-1/2">
                                                    <Label>Order Priority</Label>
                                                    <Input type="number" value={newContent.order} onChange={(e) => setNewContent({ ...newContent, order: parseInt(e.target.value) })} />
                                                </div>
                                            </div>

                                            {newContent.type === 'testimonial' ? (
                                                <div className="space-y-4 border p-4 rounded-md bg-secondary/10">
                                                    <h4 className="font-semibold text-sm">Testimonial Details</h4>
                                                    <Label>Quote</Label>
                                                    <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newContent.quote} onChange={(e) => setNewContent({ ...newContent, quote: e.target.value })} required={newContent.type === 'testimonial'} />

                                                    <div className="grid grid-cols-2 gap-2">
                                                        <Input placeholder="Client Name" value={newContent.client.name} onChange={(e) => setNewContent({ ...newContent, client: { ...newContent.client, name: e.target.value } })} required={newContent.type === 'testimonial'} />
                                                        <Input placeholder="Initials (Avatar)" value={newContent.client.initials} onChange={(e) => setNewContent({ ...newContent, client: { ...newContent.client, initials: e.target.value } })} />
                                                        <Input placeholder="Designation" value={newContent.client.designation} onChange={(e) => setNewContent({ ...newContent, client: { ...newContent.client, designation: e.target.value } })} />
                                                        <Input placeholder="Company" value={newContent.client.company} onChange={(e) => setNewContent({ ...newContent, client: { ...newContent.client, company: e.target.value } })} />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2">
                                                        <Input placeholder="Metric Value (e.g. 340%)" value={newContent.highlightMetric.value} onChange={(e) => setNewContent({ ...newContent, highlightMetric: { ...newContent.highlightMetric, value: e.target.value } })} />
                                                        <Input placeholder="Metric Label (e.g. Growth)" value={newContent.highlightMetric.label} onChange={(e) => setNewContent({ ...newContent, highlightMetric: { ...newContent.highlightMetric, label: e.target.value } })} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4 border p-4 rounded-md bg-secondary/10">
                                                    <h4 className="font-semibold text-sm">Case Study Details</h4>
                                                    <Input placeholder="Title" value={newContent.title} onChange={(e) => setNewContent({ ...newContent, title: e.target.value })} required={newContent.type === 'caseStudy'} />
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <Input placeholder="Industry" value={newContent.industry} onChange={(e) => setNewContent({ ...newContent, industry: e.target.value })} />
                                                        <Input placeholder="Duration" value={newContent.duration} onChange={(e) => setNewContent({ ...newContent, duration: e.target.value })} />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Platforms (Comma separated)</Label>
                                                        <Input placeholder="Instagram, Facebook..." value={newContent.platforms?.join(', ')} onChange={(e) => setNewContent({ ...newContent, platforms: e.target.value.split(',').map(s => s.trim()) })} />
                                                    </div>

                                                    <Label>Challenge</Label>
                                                    <textarea className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newContent.challenge} onChange={(e) => setNewContent({ ...newContent, challenge: e.target.value })} />

                                                    <Label>Solution</Label>
                                                    <textarea className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newContent.solution} onChange={(e) => setNewContent({ ...newContent, solution: e.target.value })} />

                                                    <div className="space-y-2">
                                                        <Label>Results (JSON Format for now)</Label>
                                                        <p className="text-xs text-muted-foreground">{'Example: [{"label": "Growth", "value": "200%"}]'}</p>
                                                        <textarea
                                                            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                                                            value={JSON.stringify(newContent.results)}
                                                            onChange={(e) => {
                                                                try { setNewContent({ ...newContent, results: JSON.parse(e.target.value) }) } catch (err) { }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <Button type="submit" className="w-full">
                                                <Save className="w-4 h-4 mr-2" />
                                                {editingContentId ? "Update Content" : "Save Content"}
                                            </Button>
                                            {editingContentId && (
                                                <Button type="button" variant="outline" className="w-full mt-2" onClick={() => {
                                                    setEditingContentId(null);
                                                    setNewContent({
                                                        type: "testimonial",
                                                        isActive: true,
                                                        order: 1,
                                                        quote: "",
                                                        client: { initials: "", name: "", designation: "", company: "" },
                                                        highlightMetric: { label: "", value: "" },
                                                        industry: "", duration: "", platforms: [], title: "", challenge: "", solution: "", results: []
                                                    });
                                                }}>
                                                    Cancel Edit
                                                </Button>
                                            )}
                                        </form>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader><CardTitle>Existing Content</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {testimonials.length === 0 ? <p className="text-muted-foreground">No content found.</p> : (
                                                testimonials.map((item, i) => (
                                                    <div key={i} className="flex flex-col p-4 border rounded-lg bg-card gap-2">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex gap-2 items-center">
                                                                <span className={`px-2 py-1 rounded text-xs text-white ${item.type === 'testimonial' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                                                                    {item.type === 'testimonial' ? 'Testimonial' : 'Case Study'}
                                                                </span>
                                                                {item.isActive ? <span className="text-green-600 text-xs font-bold">Active</span> : <span className="text-red-500 text-xs">Inactive</span>}
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => {
                                                                    setNewContent(item);
                                                                    setEditingContentId(item._id);
                                                                }}>
                                                                    <Monitor className="w-4 h-4" />
                                                                </Button>
                                                                <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-500" onClick={() => handleDeleteContent(item._id)}>
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                                <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => toggleContentStatus(item._id, item.isActive)}>
                                                                    {item.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {item.type === 'testimonial' ? (
                                                                <>
                                                                    <p className="font-semibold">{item.client?.name}</p>
                                                                    <p className="text-xs text-muted-foreground line-clamp-2">"{item.quote}"</p>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <p className="font-semibold">{item.title}</p>
                                                                    <p className="text-xs text-muted-foreground">{item.industry} • {item.duration}</p>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                    </Tabs>
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;
