import { useState } from "react";
import { API_BASE_URL } from "@/config";
import { motion, AnimatePresence } from "framer-motion";
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
import { Lock, User, LogOut, MessageSquare, Trophy, Plus, Save, ChevronDown, ChevronUp, ExternalLink, Download, Eye, EyeOff, Trash2, GraduationCap, Monitor, Briefcase, TrendingUp, Megaphone, Quote, Mail, RefreshCw, PenTool, ClipboardList, StickyNote, Code, Video } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import SocialPostManager from "@/components/SocialPostManager";
import AIPostManager from '@/components/AIPostManager'; // NEW
import NewsAdminPanel from './NewsAdminPanel';
import NotesTool from '@/components/NotesTool';
import TodoTool from '@/components/TodoTool';
import TechPostManager from "@/components/TechPostManager";
import WebinarManager from "@/components/WebinarManager"; // NEW
import CareerGuidanceAdmin from "@/components/CareerGuidanceAdmin"; // NEW
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";




const AdminPanel = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState("exclusive_data"); // Default to new tab to see it immediately
    const [isToolsOpen, setIsToolsOpen] = useState(false);

    // Exclusive Data State
    const [exclusiveData, setExclusiveData] = useState<any[]>([]);
    const [isTechPostsOpen, setIsTechPostsOpen] = useState(false);
    const [techPostCategory, setTechPostCategory] = useState("Python");


    // Data States
    const [contacts, setContacts] = useState<any[]>([]);
    const [hackathons, setHackathons] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // UI States
    const [expandedHackathonId, setExpandedHackathonId] = useState<string | null>(null);
    const [editingHackathonId, setEditingHackathonId] = useState<string | null>(null);

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
        registrationDeadline: "",
        helplineNumber: "",
        organizerContact: "",
        whatsappGroupLink: "",
        prizeMoney: "",
        benefits: ""
    });

    // Programs State
    const [programs, setPrograms] = useState<any[]>([]);
    const [programApplications, setProgramApplications] = useState<any[]>([]);
    const [expandedPrograms, setExpandedPrograms] = useState<Record<string, boolean>>({});

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
    const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
    const [newProgram, setNewProgram] = useState({
        type: "Training", // Training or Internship
        title: "",
        description: "",
        mode: "Online",
        duration: "",
        startDate: "",
        endDate: "",
        registrationDeadline: "",

        helplineNumber: "",
        whatsappGroupLink: "", // NEW
        organizerEmail: "",    // NEW
        // Training specific
        fee: 0,
        skillsCovered: "",
        // Internship specific
        stipend: 0,
        requiredSkills: "",
        openings: 1,

        isPaid: true,
        certificateProvided: true,
        status: "Active",
        rounds: [] as { name: string, startDate: string, endDate: string }[]
    });

    // --- Trainings State ---
    const [trainings, setTrainings] = useState<any[]>([]);
    const [trainingApplications, setTrainingApplications] = useState<any[]>([]);
    const [editingTrainingId, setEditingTrainingId] = useState<string | null>(null);
    const [newTraining, setNewTraining] = useState({
        name: "",
        category: "Full Stack Software Development",
        topics: "", // Comma separated
        duration: "",
        mode: "Online",
        description: "",
        syllabusLink: "",
        status: "Active",
        formFields: [] as { label: string, type: string, required: boolean, options: string, isHidden?: boolean }[],
        startDate: "",
        endDate: "",
        applyBy: "",
        timing: "", // NEW
        note: "",   // NEW
        emailSubject: "", // NEW
        emailBody: "",    // NEW
        emailLinks: [] as { label: string, url: string, isButton: boolean }[], // NEW
        hiddenFields: [] as string[], // NEW: For visibility toggles
        communityLink: "" // NEW
    });

    // Helper functions for Email Links in Training
    const addTrainingEmailLink = () => {
        setNewTraining({
            ...newTraining,
            emailLinks: [...(newTraining.emailLinks || []), { label: "", url: "", isButton: false }]
        });
    };

    const removeTrainingEmailLink = (index: number) => {
        const updated = [...(newTraining.emailLinks || [])];
        updated.splice(index, 1);
        setNewTraining({ ...newTraining, emailLinks: updated });
    };

    const updateTrainingEmailLink = (index: number, field: string, value: any) => {
        const updated = [...(newTraining.emailLinks || [])];
        updated[index] = { ...updated[index], [field]: value };
        setNewTraining({ ...newTraining, emailLinks: updated });
    };

    // Helper to add a new custom field to the training form
    const addFormField = () => {
        setNewTraining({
            ...newTraining,
            formFields: [...(newTraining.formFields || []), { label: "", type: "text", required: false, options: "" }]
        });
    };

    // Helper to remove a field
    const removeFormField = (index: number) => {
        const updated = [...(newTraining.formFields || [])];
        updated.splice(index, 1);
        setNewTraining({ ...newTraining, formFields: updated });
    };

    // Helper to update a field
    const updateFormField = (index: number, field: string, value: any) => {
        const updated = [...(newTraining.formFields || [])];
        updated[index] = { ...updated[index], [field]: value };
        setNewTraining({ ...newTraining, formFields: updated });
    };

    // Training Filter State
    const [trainingTopicFilter, setTrainingTopicFilter] = useState("All");

    // --- NEW: Training Application Filters ---
    const [trainingAppCategory, setTrainingAppCategory] = useState("All");
    const [trainingAppName, setTrainingAppName] = useState("All");

    // --- NEW: Email Modal State ---
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [emailDraft, setEmailDraft] = useState({
        to: "",
        subject: "",
        body: "",
        appId: "", // Store ID to update status
        links: [] as { label: string, url: string }[]
    });

    // --- NEW: App Details Modal State ---
    const [selectedAppForDetails, setSelectedAppForDetails] = useState<any>(null);


    // Helper to open email modal
    const openEmailModal = (recipientEmail: string, contextSubject = "") => {
        if (!recipientEmail) return toast.error("No email address available for this user.");
        setEmailDraft({
            to: recipientEmail,
            subject: contextSubject || "Update from NexByte",
            body: "",
            appId: "",
            links: [{ label: "", url: "" }] // Start with one empty link slot
        });
        setIsEmailModalOpen(true);
    };

    const handleSendAdminEmail = async () => {
        if (!emailDraft.subject || !emailDraft.body) return toast.error("Subject and Body are required.");

        setSendingEmail(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/send-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...emailDraft,
                    links: emailDraft.links.filter(l => l.url) // Filter out empty links
                })
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Email sent successfully!");
                setIsEmailModalOpen(false);
            } else {
                toast.error("Failed to send email.");
            }
        } catch (error) {
            toast.error("Error sending email.");
        } finally {
            setSendingEmail(false);
        }
    };

    // --- NEW: Resend Email Handler ---
    const [resendingId, setResendingId] = useState<string | null>(null);

    const handleResendEmail = async (collectionRoute: string, id: string) => {
        if (!confirm("Are you sure you want to resend the confirmation email?")) return;
        setResendingId(id);
        try {
            const response = await fetch(`${API_BASE_URL}/api/${collectionRoute}/${id}/resend-email`, {
                method: "POST"
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Email resent successfully!");
            } else {
                toast.error(data.message || "Failed to resend email.");
            }
        } catch (error) {
            toast.error("Error resending email.");
        } finally {
            setResendingId(null);
        }
    };

    // --- NEW: Generic Delete Handler ---
    const handleDeleteRecord = async (collectionRoute: string, id: string, refreshFn: () => void) => {
        if (!confirm("Are you sure you want to delete this record? This action cannot be undone.")) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/${collectionRoute}/${id}`, {
                method: "DELETE"
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Record deleted successfully");
                refreshFn();
            } else {
                toast.error("Failed to delete record");
            }
        } catch (error) {
            toast.error("Error deleting record");
        }
    };

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
            const response = await fetch(`${API_BASE_URL}/api/contacts`);
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
            const response = await fetch(`${API_BASE_URL}/api/hackathons`);
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
            const response = await fetch(`${API_BASE_URL}/api/applications`);
            const data = await response.json();
            if (data.success) setApplications(data.data);
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    // --- Technology Applications Handlers ---
    const fetchTechApplications = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/technology-applications`);
            const data = await response.json();
            if (data.success) setTechApplications(data.data);
        } catch (error) {
            console.error("Error fetching tech applications");
        }
    };

    // --- Marketing Applications Handlers ---
    const fetchMarketingApplications = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/marketing-applications`);
            const data = await response.json();
            if (data.success) setMarketingApplications(data.data);
        } catch (error) {
            console.error("Error fetching marketing applications");
        }
    };

    // --- Testimonials & Content Handlers ---
    const fetchTestimonials = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/testimonials`);
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
                ? `${API_BASE_URL}/api/testimonials/${editingContentId}`
                : `${API_BASE_URL}/api/testimonials`;

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
            await fetch(`${API_BASE_URL}/api/testimonials/${id}`, { method: "DELETE" });
            toast.success("Deleted");
            fetchTestimonials();
        } catch (e) { toast.error("Error deleting"); }
    };

    // Helper to toggle active status
    const toggleContentStatus = async (id: string, current: boolean) => {
        try {
            await fetch(`${API_BASE_URL}/api/testimonials/${id}/status`, {
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
            const response = await fetch(`${API_BASE_URL}/api/staffing-applications`);
            const data = await response.json();
            if (data.success) setStaffingApplications(data.data);
        } catch (error) {
            console.error("Error fetching staffing applications");
        }
    };



    const handleDownloadTechCSV = () => {
        if (techApplications.length === 0) return toast.error("No data to download");

        const headers = ["Date", "Category", "Name", "Email", "Company", "Budget", "Details"];

        const rows = techApplications.map(app => {
            return [
                new Date(app.submittedAt).toLocaleDateString(),
                app.serviceCategory,
                app.commonDetails?.fullName,
                app.commonDetails?.email,
                app.commonDetails?.companyName,
                app.commonDetails?.budgetRange,
                JSON.stringify(app.serviceDetails).replace(/"/g, "'")
            ].map(f => `"${f || ''}"`).join(",");
        });

        const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csv);
        const link = document.createElement("a");
        link.href = encodedUri;
        link.download = `tech_applications_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const handleDownloadMarketingCSV = () => {
        if (marketingApplications.length === 0) return toast.error("No data to download");

        const headers = ["Date", "Name", "Email", "Company", "Service", "Budget", "Message"];
        const rows = marketingApplications.map(app => {
            return [
                new Date(app.submittedAt).toLocaleDateString(),
                app.name,
                app.email,
                app.companyName,
                app.serviceType,
                app.budget,
                app.message
            ].map(f => `"${f || ''}"`).join(",");
        });
        const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csv);
        const link = document.createElement("a");
        link.href = encodedUri;
        link.download = `marketing_leads_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };


    // --- Exclusive Data Handlers ---
    const fetchExclusiveData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/exclusive-data`);
            const data = await response.json();
            if (data.success) setExclusiveData(data.data);
        } catch (error) {
            console.error("Error fetching exclusive data");
        }
    };

    const handleDownloadExclusiveCSV = () => {
        if (exclusiveData.length === 0) return toast.error("No data to download");

        const headers = ["Date", "Full Name", "WhatsApp", "Business Name", "Location", "Start Date", "Maps Link", "Message"];
        const rows = exclusiveData.map(item => {
            return [
                new Date(item.submittedAt).toLocaleDateString(),
                item.fullName,
                item.whatsappNumber,
                item.businessName,
                item.location,
                item.startDate,
                item.mapsLink,
                item.message
            ].map(f => `"${f || ''}"`).join(",");
        });

        const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csv);
        const link = document.createElement("a");
        link.href = encodedUri;
        link.download = `exclusive_data_${new Date().toISOString().split('T')[0]}.csv`;
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

            console.log('Submitting hackathon payload:', payload);

            const isEditing = editingHackathonId !== null;
            const url = isEditing
                ? `${API_BASE_URL}/api/hackathons/${editingHackathonId}`
                : `${API_BASE_URL}/api/hackathons`;
            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await response.json();

            if (data.success) {
                toast.success(isEditing ? "Hackathon Updated Successfully!" : "Hackathon Created Successfully!");
                fetchHackathons();
                setEditingHackathonId(null);
                // Reset form
                setNewHackathon({
                    name: "", mode: "Online", description: "", teamSizeMin: 1, teamSizeMax: 4,
                    isPaid: false, techStack: "", startDate: "", endDate: "", registrationDeadline: "", helplineNumber: "", organizerContact: "", whatsappGroupLink: "", prizeMoney: "", benefits: ""
                });
            } else {
                toast.error(isEditing ? "Failed to update hackathon" : "Failed to create hackathon");
            }
        } catch (error) {
            toast.error(editingHackathonId ? "Error updating hackathon" : "Error creating hackathon");
        }
    };

    const handleEditHackathon = (hackathon: any) => {
        setEditingHackathonId(hackathon._id);
        setNewHackathon({
            name: hackathon.name,
            mode: hackathon.mode,
            description: hackathon.description,
            teamSizeMin: hackathon.teamSize?.min || 1,
            teamSizeMax: hackathon.teamSize?.max || 4,
            isPaid: hackathon.isPaid,
            techStack: hackathon.techStack || "",
            startDate: hackathon.startDate,
            endDate: hackathon.endDate,
            registrationDeadline: hackathon.registrationDeadline,
            helplineNumber: hackathon.helplineNumber || "",
            organizerContact: hackathon.organizerContact || "",
            whatsappGroupLink: hackathon.whatsappGroupLink || "",
            prizeMoney: hackathon.prizeMoney || "",
            benefits: hackathon.benefits || ""
        });
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEditHackathon = () => {
        setEditingHackathonId(null);
        setNewHackathon({
            name: "", mode: "Online", description: "", teamSizeMin: 1, teamSizeMax: 4,
            isPaid: false, techStack: "", startDate: "", endDate: "", registrationDeadline: "", helplineNumber: "", organizerContact: "", whatsappGroupLink: "", prizeMoney: "", benefits: ""
        });
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPassword("");
        setContacts([]);
    };

    const handleToggleVisibility = async (id: string, currentStatus: boolean) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/hackathons/${id}/visibility`, {
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
            const response = await fetch(`${API_BASE_URL}/api/hackathons/${id}`, {
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
            const response = await fetch(`${API_BASE_URL}/api/programs`);
            const data = await response.json();
            if (data.success) setPrograms(data.data);
        } catch (error) {
            console.error("Error fetching programs");
        }
    };

    const fetchProgramApplications = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/program-applications`);
            const data = await response.json();
            if (data.success) setProgramApplications(data.data);
        } catch (error) {
            console.error("Error fetching program applications");
        }
    };

    const handleCreateProgram = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const isEditing = editingProgramId !== null;
            const url = isEditing
                ? `${API_BASE_URL}/api/programs/${editingProgramId}`
                : `${API_BASE_URL}/api/programs`;
            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProgram)
            });
            const data = await response.json();
            if (data.success) {
                toast.success(isEditing ? `${newProgram.type} Updated!` : `${newProgram.type} Created!`);
                fetchPrograms();
                setEditingProgramId(null);
                // Reset common fields
                setNewProgram({
                    ...newProgram,
                    title: "", description: "", duration: "",
                    fee: 0, stipend: 0, skillsCovered: "", requiredSkills: "",
                    registrationDeadline: "", helplineNumber: "",
                    rounds: []
                });
            } else {
                toast.error(isEditing ? "Failed to update program" : "Failed to create program");
            }
        } catch (error) {
            toast.error(editingProgramId ? "Error updating program" : "Error creating program");
        }
    };

    const handleEditProgram = (program: any) => {
        setEditingProgramId(program._id);
        setNewProgram({
            type: program.type,
            title: program.title,
            description: program.description,
            mode: program.mode,
            duration: program.duration,
            startDate: program.startDate,
            endDate: program.endDate,
            registrationDeadline: program.registrationDeadline,

            helplineNumber: program.helplineNumber,
            whatsappGroupLink: program.whatsappGroupLink || "", // NEW
            organizerEmail: program.organizerEmail || "",       // NEW
            fee: program.fee || 0,
            skillsCovered: program.skillsCovered || "",
            stipend: program.stipend || 0,
            requiredSkills: program.requiredSkills || "",
            openings: program.openings || 1,
            isPaid: program.isPaid,
            certificateProvided: program.certificateProvided,
            status: program.status,
            rounds: program.rounds || []
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEditProgram = () => {
        setEditingProgramId(null);
        setNewProgram({
            type: "Training",
            title: "", description: "", mode: "Online", duration: "",

            startDate: "", endDate: "", registrationDeadline: "", helplineNumber: "",
            whatsappGroupLink: "", organizerEmail: "", // NEW
            fee: 0, skillsCovered: "", stipend: 0, requiredSkills: "",
            openings: 1, isPaid: true, certificateProvided: true, status: "Active", rounds: []
        });
    };

    const handleDeleteProgram = async (id: string) => {
        if (!confirm("Delete this program?")) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/programs/${id}`, { method: "DELETE" });
            if (response.ok) {
                toast.success("Program Deleted");
                fetchPrograms();
            }
        } catch (error) {
            toast.error("Error deleting program");
        }
    };

    // --- Trainings Handlers ---
    const fetchTrainings = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/trainings`);
            const data = await response.json();
            if (data.success) setTrainings(data.data);
        } catch (error) { console.error("Error fetching trainings"); }
    };

    const fetchTrainingApplications = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/training-applications`);
            const data = await response.json();
            if (data.success) setTrainingApplications(data.data);
        } catch (error) { console.error("Error fetching training applications"); }
    };

    const handleDownloadTrainingApplicationsCSV = () => {
        // Filter based on current selection
        let dataToExport = trainingApplications;

        if (trainingAppName !== "All") {
            dataToExport = dataToExport.filter(app => app.trainingName === trainingAppName);
        } else if (trainingAppCategory !== "All") {
            // Find all trainings in this category
            const trainingNamesInCategory = trainings
                .filter(t => t.category === trainingAppCategory)
                .map(t => t.name);
            dataToExport = dataToExport.filter(app => trainingNamesInCategory.includes(app.trainingName));
        }

        if (dataToExport.length === 0) return toast.error("No data to download");

        if (dataToExport.length === 0) return toast.error("No data to download");

        // Collect all dynamic keys from the dataset
        const allDynamicKeys = Array.from(new Set(dataToExport.flatMap(app => Object.keys(app.dynamicData || {}))));

        const headers = ["Date", "Name", "Training", "Email", "Phone", "LinkedIn", "Status", ...allDynamicKeys];

        const rows = dataToExport.map(app => {
            const baseValues = [
                new Date(app.submittedAt).toLocaleDateString(),
                app.name,
                app.trainingName,
                app.email,
                app.phone || (app.dynamicData && (app.dynamicData["Phone Number"] || app.dynamicData["Contact"] || "")), // Fallback to dynamic data
                app.linkedinProfile || (app.dynamicData && app.dynamicData["Linkdin Profile"]) || "",
                app.status
            ];

            // Add dynamic data values matching the headers
            const dynamicValues = allDynamicKeys.map(key => {
                // Check both direct dynamicData and flattened structure if needed
                return (app.dynamicData && app.dynamicData[key]) || "";
            });

            return [...baseValues, ...dynamicValues].map(f => `"${f || ''}"`).join(",");
        });

        const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csv);
        const link = document.createElement("a");
        link.href = encodedUri;
        link.download = `training_applications_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const handleCreateTraining = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...newTraining,
                topics: newTraining.topics.split(',').map(t => t.trim()),
                // Map formFields if select types need options parsed
                formFields: (newTraining.formFields || []).map(f => ({
                    ...f,
                    options: f.type === 'select' && typeof f.options === 'string' ? f.options.split(',').map(o => o.trim()) : f.options
                }))
            };
            const isEditing = editingTrainingId !== null;
            const url = isEditing ? `${API_BASE_URL}/api/trainings/${editingTrainingId}` : `${API_BASE_URL}/api/trainings`;
            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (data.success) {
                toast.success(isEditing ? "Training Updated" : "Training Created");
                fetchTrainings();
                setEditingTrainingId(null);
                setNewTraining({ name: "", category: "Full Stack Software Development", topics: "", duration: "", mode: "Online", description: "", syllabusLink: "", status: "Active", formFields: [], startDate: "", endDate: "", applyBy: "", timing: "", note: "", emailSubject: "", emailBody: "", emailLinks: [], hiddenFields: [], communityLink: "" });
            } else { toast.error("Operation failed"); }
        } catch (error) { toast.error("Error saving training"); }
    };

    const handleDeleteTraining = async (id: string) => {
        if (!confirm("Delete training?")) return;
        try {
            await fetch(`${API_BASE_URL}/api/trainings/${id}`, { method: "DELETE" });
            fetchTrainings();
            toast.success("Training Deleted");
        } catch (e) { toast.error("Error deleting"); }
    };

    // NEW: Handle Training CSV Download
    const handleDownloadTrainingCSV = (trainingName: string) => {
        // Filter applications for this training
        const relevantApps = trainingApplications.filter(app => app.trainingName === trainingName);

        if (relevantApps.length === 0) return toast.error("No applications found for this training.");

        const headers = ["Date", "Applicant Name", "Email", "Status", "Custom Fields"];

        const rows = relevantApps.map(app => {
            const date = new Date(app.submittedAt).toLocaleDateString();
            // Flatten dynamic data for viewing
            const dynamicDetails = app.dynamicData ? JSON.stringify(app.dynamicData).replace(/"/g, "'") : "";

            return [
                date,
                app.applicantName,
                app.email,
                app.status,
                dynamicDetails
            ].map(f => `"${f || ''}"`).join(",");
        });

        const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csv);
        const link = document.createElement("a");
        link.href = encodedUri;
        link.download = `training_${trainingName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
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
        if (value === 'trainings') {
            fetchTrainings();
            fetchTrainingApplications(); // FIX: Fetch applications to show count
        }
        if (value === 'training_apps') {
            fetchTrainings(); // FIX: Ensure trainings are loaded for the dropdown filter
            fetchTrainingApplications();
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
                    {/* TOOLS DROPDOWN */}
                    <div>
                        <Button
                            variant="ghost"
                            className="w-full justify-between"
                            onClick={() => setIsToolsOpen(!isToolsOpen)}
                        >
                            <div className="flex items-center">
                                <PenTool className="w-4 h-4 mr-2" />
                                Tools
                            </div>
                            {isToolsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>

                        <AnimatePresence>
                            {isToolsOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden ml-4 pl-2 border-l border-border/50 space-y-1 mt-1"
                                >
                                    <Button
                                        variant={activeTab === "notes" ? "secondary" : "ghost"}
                                        size="sm"
                                        className="w-full justify-start h-8"
                                        onClick={() => setActiveTab("notes")}
                                    >
                                        <StickyNote className="w-3 h-3 mr-2" />
                                        Notes
                                    </Button>
                                    <Button
                                        variant={activeTab === "todo" ? "secondary" : "ghost"}
                                        size="sm"
                                        className="w-full justify-start h-8"
                                        onClick={() => setActiveTab("todo")}
                                    >
                                        <ClipboardList className="w-3 h-3 mr-2" />
                                        Todo
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Button
                        variant={activeTab === "contacts" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => onTabChange("contacts")}
                    >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contacts
                    </Button>
                    <Button
                        variant={activeTab === "exclusive_data" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => onTabChange("exclusive_data")}
                    >
                        <Lock className="w-4 h-4 mr-2" />
                        Exclusive Data
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
                        <Megaphone className="w-4 h-4 mr-2" />
                        Marketing
                    </Button>
                    <Button variant={activeTab === "trainings" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => onTabChange("trainings")}>
                        <GraduationCap className="w-4 h-4 mr-2" /> Trainings
                    </Button>
                    <Button variant={activeTab === "training_apps" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => onTabChange("training_apps")}>
                        <User className="w-4 h-4 mr-2" /> Training Apps
                    </Button>

                    <Button
                        variant={activeTab === "content" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => onTabChange("content")}
                    >
                        <Megaphone className="w-4 h-4 mr-2" />
                        Content Manager
                    </Button>
                    <Button
                        variant={activeTab === "social-posts" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => onTabChange("social-posts")}
                    >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Social Posts
                    </Button>
                    <Button
                        variant={activeTab === "ai-posts" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => onTabChange("ai-posts")}
                    >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        AI Posts
                    </Button>
                    <Button
                        variant={activeTab === "webinars" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => onTabChange("webinars")}
                    >
                        <Video className="w-4 h-4 mr-2" />
                        Webinars
                    </Button>
                    <Button
                        variant={activeTab === "ads" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => onTabChange("ads")}
                    >
                        <Megaphone className="w-4 h-4 mr-2" />
                        Ads Manager
                    </Button>
                    <Button
                        variant={activeTab === "career-guidance" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => onTabChange("career-guidance")}
                    >
                        <Briefcase className="w-4 h-4 mr-2" />
                        Career Guidance
                    </Button>


                    {/* TECH POSTS DROPDOWN */}
                    <div>
                        <Button
                            variant="ghost"
                            className="w-full justify-between"
                            onClick={() => setIsTechPostsOpen(!isTechPostsOpen)}
                        >
                            <div className="flex items-center">
                                <Code className="w-4 h-4 mr-2" />
                                Tech Posts
                            </div>
                            {isTechPostsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>

                        <AnimatePresence>
                            {isTechPostsOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden ml-4 pl-2 border-l border-border/50 space-y-1 mt-1"
                                >
                                    {[
                                        { label: "Python", value: "Python" },
                                        { label: "Oracle DBA", value: "ORACLE DBA" },
                                        { label: "SQL Server DBA", value: "SQL SERVER DBA" },
                                        { label: "MySQL", value: "MY SQL" },
                                        { label: "PostgreSQL", value: "POSTGRESS" }
                                    ].map((cat) => (
                                        <Button
                                            key={cat.value}
                                            variant={activeTab === "tech-posts" && techPostCategory === cat.value ? "secondary" : "ghost"}
                                            size="sm"
                                            className="w-full justify-start h-8"
                                            onClick={() => {
                                                setActiveTab("tech-posts");
                                                setTechPostCategory(cat.value);
                                            }}
                                        >
                                            <Code className="w-3 h-3 mr-2" />
                                            {cat.label}
                                        </Button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
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

                        {/* NOTES TAB */}
                        <TabsContent value="notes" className="mt-0">
                            <NotesTool />
                        </TabsContent>

                        {/* TODO TAB */}
                        <TabsContent value="todo" className="mt-0">
                            <TodoTool />
                        </TabsContent>

                        {/* CONTACTS TAB */}
                        <TabsContent value="contacts" className="mt-0">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Inquiries</CardTitle>
                                    <CardDescription>
                                        Manage messages from the contact form.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {contacts.length === 0 ? (
                                        <div className="text-center py-8 text-black">No contacts yet.</div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Date</TableHead>
                                                        <TableHead>Name</TableHead>
                                                        <TableHead>Email</TableHead>
                                                        <TableHead>Subject</TableHead>
                                                        <TableHead>Message</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {contacts.map((contact) => (
                                                        <TableRow key={contact._id}>
                                                            <TableCell>{new Date(contact.submittedAt).toLocaleDateString()}</TableCell>
                                                            <TableCell className="font-medium">{contact.firstName} {contact.lastName}</TableCell>
                                                            <TableCell>{contact.email}</TableCell>
                                                            <TableCell>{contact.subject}</TableCell>
                                                            <TableCell className="max-w-xs truncate" title={contact.message}>{contact.message}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* EXCLUSIVE DATA TAB (Google Reviews Marketing) */}
                        <TabsContent value="exclusive_data" className="mt-0">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Exclusive Data (Google Reviews Leads)</CardTitle>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={handleDownloadExclusiveCSV} className="text-green-600 border-green-200">
                                            <Download className="w-4 h-4 mr-2" />
                                            Download CSV
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={fetchExclusiveData}>
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Refresh
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {exclusiveData.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">No data found.</div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Date</TableHead>
                                                        <TableHead>Full Name</TableHead>
                                                        <TableHead>WhatsApp</TableHead>
                                                        <TableHead>Business Name</TableHead>
                                                        <TableHead>Location</TableHead>
                                                        <TableHead>Start Date</TableHead>
                                                        <TableHead>Maps Link</TableHead>
                                                        <TableHead>Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {exclusiveData.map((item) => (
                                                        <TableRow key={item._id}>
                                                            <TableCell>{new Date(item.submittedAt).toLocaleDateString()}</TableCell>
                                                            <TableCell className="font-medium">{item.fullName}</TableCell>
                                                            <TableCell>{item.whatsappNumber}</TableCell>
                                                            <TableCell>{item.businessName}</TableCell>
                                                            <TableCell>{item.location}</TableCell>
                                                            <TableCell>{item.startDate}</TableCell>
                                                            <TableCell>
                                                                <a href={item.mapsLink} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                                                                    View <ExternalLink className="w-3 h-3" />
                                                                </a>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex gap-2">
                                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteRecord('exclusive-data', item._id, fetchExclusiveData)}>
                                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                                    </Button>
                                                                </div>
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

                        {/* CAREER GUIDANCE TAB */}
                        <TabsContent value="career-guidance" className="mt-0 h-full">
                            <CareerGuidanceAdmin />
                        </TabsContent>

                        {/* HACKATHONS TAB */}
                        <TabsContent value="hackathons" className="mt-0">
                            <div className="grid lg:grid-cols-2 gap-6">
                                {/* Create Hackathon Form */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{editingHackathonId ? "Edit Hackathon" : "Create New Hackathon"}</CardTitle>
                                        <CardDescription>
                                            {editingHackathonId ? "Update the hackathon details below." : "Fill in the details to publish a new event."}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleCreateHackathon} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Hackathon Name <span className="text-red-500">*</span></Label>
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
                                                <Label>Description <span className="text-red-500">*</span></Label>
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
                                                    <Label>Start Date <span className="text-red-500">*</span></Label>
                                                    <Input type="date"
                                                        value={newHackathon.startDate}
                                                        onChange={(e) => setNewHackathon({ ...newHackathon, startDate: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>End Date <span className="text-red-500">*</span></Label>
                                                    <Input type="date"
                                                        value={newHackathon.endDate}
                                                        onChange={(e) => setNewHackathon({ ...newHackathon, endDate: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Registration Deadline <span className="text-red-500">*</span></Label>
                                                    <Input type="date"
                                                        value={newHackathon.registrationDeadline}
                                                        onChange={(e) => setNewHackathon({ ...newHackathon, registrationDeadline: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Helpline Number <span className="text-red-500">*</span></Label>
                                                    <Input type="tel"
                                                        placeholder="+91 99999 99999"
                                                        value={newHackathon.helplineNumber}
                                                        onChange={(e) => setNewHackathon({ ...newHackathon, helplineNumber: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Min Team Size <span className="text-red-500">*</span></Label>
                                                    <Input type="number" min="1"
                                                        value={newHackathon.teamSizeMin}
                                                        onChange={(e) => setNewHackathon({ ...newHackathon, teamSizeMin: parseInt(e.target.value) })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Max Team Size <span className="text-red-500">*</span></Label>
                                                    <Input type="number" min="1"
                                                        value={newHackathon.teamSizeMax}
                                                        onChange={(e) => setNewHackathon({ ...newHackathon, teamSizeMax: parseInt(e.target.value) })}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Tech Stack <span className="text-red-500">*</span></Label>
                                                <Input
                                                    placeholder="e.g. Web, AI/ML, Blockchain"
                                                    value={newHackathon.techStack}
                                                    onChange={(e) => setNewHackathon({ ...newHackathon, techStack: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Organizer Contact Email <span className="text-red-500">*</span></Label>
                                                <Input type="email"
                                                    placeholder="organizer@example.com"
                                                    value={newHackathon.organizerContact}
                                                    onChange={(e) => setNewHackathon({ ...newHackathon, organizerContact: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>WhatsApp Group Link <span className="text-red-500">*</span></Label>
                                                <Input type="url"
                                                    placeholder="https://chat.whatsapp.com/..."
                                                    value={newHackathon.whatsappGroupLink}
                                                    onChange={(e) => setNewHackathon({ ...newHackathon, whatsappGroupLink: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Prize Money (e.g., ₹50,000 or $500) <span className="text-red-500">*</span></Label>
                                                <Input
                                                    placeholder="₹50,000 Cash Prize"
                                                    value={newHackathon.prizeMoney}
                                                    onChange={(e) => setNewHackathon({ ...newHackathon, prizeMoney: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Benefits (What participants will get) <span className="text-red-500">*</span></Label>
                                                <textarea
                                                    className="w-full border rounded-md p-2 min-h-[80px]"
                                                    placeholder="Certificates, mentorship, internship opportunities, swag kits, etc."
                                                    value={newHackathon.benefits}
                                                    onChange={(e) => setNewHackathon({ ...newHackathon, benefits: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="flex gap-2">
                                                <Button type="submit" className="flex-1">
                                                    <Save className="w-4 h-4 mr-2" />
                                                    {editingHackathonId ? "Update Hackathon" : "Publish Hackathon"}
                                                </Button>
                                                {editingHackathonId && (
                                                    <Button type="button" variant="outline" onClick={handleCancelEditHackathon}>
                                                        Cancel
                                                    </Button>
                                                )}
                                            </div>
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

                                                                        {/* Edit Button */}
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => handleEditHackathon(h)}
                                                                            className="h-8 gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                                                                            title="Edit Hackathon"
                                                                        >
                                                                            Edit
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
                                                                                        <TableHead className="text-xs">Actions</TableHead>
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
                                                                                            <TableCell>
                                                                                                <div className="flex gap-2">
                                                                                                    <Button variant="ghost" size="icon" title="Email Leader" onClick={() => openEmailModal(
                                                                                                        app.participantType === 'Team' ? app.leader?.email : app.email,
                                                                                                        `Hackathon Update: ${h.name}`
                                                                                                    )}>
                                                                                                        <Mail className="w-4 h-4 text-blue-500" />
                                                                                                    </Button>
                                                                                                    <Button variant="ghost" size="icon" title="Re-trigger Email" disabled={resendingId === app._id} onClick={() => handleResendEmail('applications', app._id)}>
                                                                                                        <RefreshCw className={`w-4 h-4 text-orange-500 ${resendingId === app._id ? 'animate-spin' : ''}`} />
                                                                                                    </Button>
                                                                                                    <Button variant="ghost" size="icon" title="Delete Application" onClick={() => handleDeleteRecord('applications', app._id, fetchApplications)}>
                                                                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                                                                    </Button>
                                                                                                </div>
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

                        {/* TECH POSTS TAB */}
                        <TabsContent value="tech-posts" className="mt-0">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Code className="w-5 h-5 text-primary" />
                                        <div>
                                            <CardTitle>Tech Posts - {techPostCategory}</CardTitle>
                                            <CardDescription>
                                                Manage {techPostCategory} articles and posts.
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <TechPostManager fixedCategory={techPostCategory} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* WEBINARS TAB */}
                        <TabsContent value="webinars" className="mt-0">
                            <WebinarManager />
                        </TabsContent>

                        {/* PROGRAMS TAB (Training & Internships) */}
                        <TabsContent value="programs" className="mt-0">
                            <div className="grid lg:grid-cols-2 gap-6">
                                {/* Create Program Form */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{editingProgramId ? "Edit Program" : "Create Programme (Training / Internship)"}</CardTitle>
                                        <CardDescription>
                                            {editingProgramId ? "Update the program details below." : "Create a new training or internship program."}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleCreateProgram} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Program Type <span className="text-red-500">*</span></Label>
                                                <select
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                    value={newProgram.type}
                                                    onChange={(e) => setNewProgram({ ...newProgram, type: e.target.value })}
                                                    required
                                                >
                                                    <option value="Training">Training</option>
                                                    <option value="Internship">Internship</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Title <span className="text-red-500">*</span></Label>
                                                <Input value={newProgram.title} onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })} placeholder="e.g. Web Development Bootcamp" required />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Description <span className="text-red-500">*</span></Label>
                                                <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm border-gray-200" value={newProgram.description} onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })} required />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Mode <span className="text-red-500">*</span></Label>
                                                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newProgram.mode} onChange={(e) => setNewProgram({ ...newProgram, mode: e.target.value })} required>
                                                        <option value="Online">Online</option>
                                                        <option value="Offline">Offline</option>
                                                        <option value="Hybrid">Hybrid</option>
                                                        <option value="Remote">Remote</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Duration <span className="text-red-500">*</span></Label>
                                                    <Input value={newProgram.duration} onChange={(e) => setNewProgram({ ...newProgram, duration: e.target.value })} placeholder="e.g. 6 Weeks / 3 Months" required />
                                                </div>
                                            </div>

                                            {newProgram.type === "Training" ? (
                                                <>
                                                    <div className="space-y-2">
                                                        <Label>Fee (₹) <span className="text-red-500">*</span></Label>
                                                        <Input type="number" value={newProgram.fee} onChange={(e) => setNewProgram({ ...newProgram, fee: parseInt(e.target.value) })} required />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Skills Covered <span className="text-red-500">*</span></Label>
                                                        <Input value={newProgram.skillsCovered} onChange={(e) => setNewProgram({ ...newProgram, skillsCovered: e.target.value })} placeholder="HTML, CSS, React..." required />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="space-y-2">
                                                        <Label>Stipend (₹) <span className="text-red-500">*</span></Label>
                                                        <Input type="number" value={newProgram.stipend} onChange={(e) => setNewProgram({ ...newProgram, stipend: parseInt(e.target.value) })} required />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Required Skills <span className="text-red-500">*</span></Label>
                                                        <Input value={newProgram.requiredSkills} onChange={(e) => setNewProgram({ ...newProgram, requiredSkills: e.target.value })} placeholder="Basic JavaScript Knowledge..." required />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Openings <span className="text-red-500">*</span></Label>
                                                        <Input type="number" value={newProgram.openings} onChange={(e) => setNewProgram({ ...newProgram, openings: parseInt(e.target.value) })} required />
                                                    </div>
                                                </>
                                            )}

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Start Date <span className="text-red-500">*</span></Label>
                                                    <Input type="date" value={newProgram.startDate} onChange={(e) => setNewProgram({ ...newProgram, startDate: e.target.value })} required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>End Date <span className="text-red-500">*</span></Label>
                                                    <Input type="date" value={newProgram.endDate} onChange={(e) => setNewProgram({ ...newProgram, endDate: e.target.value })} required />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Registration Deadline <span className="text-red-500">*</span></Label>
                                                    <Input type="date" value={newProgram.registrationDeadline} onChange={(e) => setNewProgram({ ...newProgram, registrationDeadline: e.target.value })} required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Helpline Number <span className="text-red-500">*</span></Label>
                                                    <Input type="tel" value={newProgram.helplineNumber} onChange={(e) => setNewProgram({ ...newProgram, helplineNumber: e.target.value })} required />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Organizer Email <span className="text-red-500">*</span></Label>
                                                    <Input type="email" placeholder="organizer@example.com" value={newProgram.organizerEmail} onChange={(e) => setNewProgram({ ...newProgram, organizerEmail: e.target.value })} required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>WhatsApp Group Link <span className="text-red-500">*</span></Label>
                                                    <Input type="url" placeholder="https://chat.whatsapp.com/..." value={newProgram.whatsappGroupLink} onChange={(e) => setNewProgram({ ...newProgram, whatsappGroupLink: e.target.value })} required />
                                                </div>
                                            </div>

                                            {/* Selection Rounds - Internship Only */}
                                            {newProgram.type === "Internship" && (
                                                <div className="space-y-4 border p-4 rounded-lg bg-secondary/10">
                                                    <div className="flex justify-between items-center">
                                                        <Label className="text-base font-semibold">Selection Rounds</Label>
                                                        <Button type="button" size="sm" variant="outline" onClick={() => setNewProgram({ ...newProgram, rounds: [...newProgram.rounds, { name: "", startDate: "", endDate: "" }] })}>
                                                            + Add Round
                                                        </Button>
                                                    </div>
                                                    {newProgram.rounds.map((round, index) => (
                                                        <div key={index} className="grid grid-cols-7 gap-2 items-end">
                                                            <div className="col-span-3 space-y-1">
                                                                <Label className="text-xs">Round Name</Label>
                                                                <Input
                                                                    placeholder="e.g. Assessment"
                                                                    value={round.name}
                                                                    onChange={(e) => {
                                                                        const updatedRounds = [...newProgram.rounds];
                                                                        updatedRounds[index].name = e.target.value;
                                                                        setNewProgram({ ...newProgram, rounds: updatedRounds });
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-span-3 space-y-1">
                                                                <Label className="text-xs">Date</Label>
                                                                <Input
                                                                    type="date"
                                                                    value={round.startDate}
                                                                    onChange={(e) => {
                                                                        const updatedRounds = [...newProgram.rounds];
                                                                        updatedRounds[index].startDate = e.target.value;
                                                                        setNewProgram({ ...newProgram, rounds: updatedRounds });
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-span-1">
                                                                <Button type="button" variant="destructive" size="icon" onClick={() => {
                                                                    const updatedRounds = newProgram.rounds.filter((_, i) => i !== index);
                                                                    setNewProgram({ ...newProgram, rounds: updatedRounds });
                                                                }}>
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex gap-2">
                                                <Button type="submit" className="flex-1">
                                                    {editingProgramId ? `Update ${newProgram.type}` : `Create ${newProgram.type}`}
                                                </Button>
                                                {editingProgramId && (
                                                    <Button type="button" variant="outline" onClick={handleCancelEditProgram}>
                                                        Cancel
                                                    </Button>
                                                )}
                                            </div>
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
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setExpandedPrograms(prev => ({ ...prev, [program._id]: !prev[program._id] }))}>
                                                                        {expandedPrograms[program._id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                                    </Button>
                                                                    {/* CSV Download for Program Applicants - Placeholder Logic */}
                                                                    <Button variant="outline" size="sm" className="h-8 gap-1 text-green-600 border-green-200 hover:bg-green-50" onClick={() => {
                                                                        if (apps.length === 0) return toast.error("No applicants");
                                                                        const headers = ["Name", "Email", "Phone", "Age", "College", "Type", "Resume Link", "Portfolio Link"];
                                                                        const rows = apps.map(a => [a.fullName, a.email, a.phone, a.age, a.collegeName, program.type, a.resumeLink, a.portfolioLink].map(f => `"${f || ''}"`).join(","));
                                                                        const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
                                                                        const link = document.createElement("a");
                                                                        link.href = encodeURI(csv);
                                                                        link.download = `${program.title}_applicants.csv`;
                                                                        link.click();
                                                                    }}>
                                                                        <Download className="w-3 h-3" />
                                                                    </Button>
                                                                    <Button variant="outline" size="sm" className="h-8 gap-1 text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => handleEditProgram(program)}>
                                                                        Edit
                                                                    </Button>
                                                                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeleteProgram(program._id)}>
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {apps.length > 0 && expandedPrograms[program._id] && (
                                                            <div className="mt-4 bg-secondary/10 p-3 rounded-md">
                                                                <h5 className="font-semibold text-sm mb-2">Applicants:</h5>
                                                                <div className="overflow-x-auto">
                                                                    <Table>
                                                                        <TableHeader>
                                                                            <TableRow>
                                                                                <TableHead className="text-xs">Name</TableHead>
                                                                                <TableHead className="text-xs">Email</TableHead>
                                                                                <TableHead className="text-xs">Phone</TableHead>
                                                                                <TableHead className="text-xs">College</TableHead>
                                                                                <TableHead className="text-xs">Resume</TableHead>
                                                                                <TableHead className="text-xs">Portfolio</TableHead>
                                                                                <TableHead className="text-xs">Actions</TableHead>
                                                                            </TableRow>
                                                                        </TableHeader>
                                                                        <TableBody>
                                                                            {apps.map((app, appIndex) => (
                                                                                <TableRow key={appIndex}>
                                                                                    <TableCell className="text-xs">{app.fullName}</TableCell>
                                                                                    <TableCell className="text-xs">{app.email}</TableCell>
                                                                                    <TableCell className="text-xs">{app.phone}</TableCell>
                                                                                    <TableCell className="text-xs">{app.collegeName}</TableCell>
                                                                                    <TableCell className="text-xs">
                                                                                        {app.resumeLink ? (
                                                                                            <a href={app.resumeLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                                                                                View <ExternalLink className="w-3 h-3" />
                                                                                            </a>
                                                                                        ) : <span className="text-muted-foreground">-</span>}
                                                                                    </TableCell>
                                                                                    <TableCell className="text-xs">
                                                                                        {app.portfolioLink ? (
                                                                                            <a href={app.portfolioLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                                                                                View <ExternalLink className="w-3 h-3" />
                                                                                            </a>
                                                                                        ) : <span className="text-muted-foreground">-</span>}
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <div className="flex gap-2">
                                                                                            <Button variant="ghost" size="icon" onClick={() => openEmailModal(app.email, `Regarding your application for ${program.title}`)}>
                                                                                                <Mail className="w-4 h-4 text-blue-500" />
                                                                                            </Button>
                                                                                            <Button variant="ghost" size="icon" title="Re-trigger Email" disabled={resendingId === app._id} onClick={() => handleResendEmail('program-applications', app._id)}>
                                                                                                <RefreshCw className={`w-4 h-4 text-orange-500 ${resendingId === app._id ? 'animate-spin' : ''}`} />
                                                                                            </Button>
                                                                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteRecord('program-applications', app._id, fetchProgramApplications)}>
                                                                                                <Trash2 className="w-4 h-4 text-red-500" />
                                                                                            </Button>
                                                                                        </div>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </div>
                                                            </div>
                                                        )}
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
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={handleDownloadTechCSV} className="text-green-600 border-green-200">
                                            <Download className="w-4 h-4 mr-2" />
                                            Download CSV
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={fetchTechApplications}>
                                            Refresh
                                        </Button>
                                    </div>
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
                                                                <div className="flex gap-2">
                                                                    <Button size="icon" variant="ghost" onClick={() => {
                                                                        alert(JSON.stringify(app.serviceDetails, null, 2));
                                                                    }}>
                                                                        <Eye className="w-4 h-4 text-gray-500" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="icon" onClick={() => openEmailModal(app.commonDetails?.email, `Re: ${app.serviceCategory} Inquiry`)}>
                                                                        <Mail className="w-4 h-4 text-blue-500" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="icon" title="Re-trigger Email" disabled={resendingId === app._id} onClick={() => handleResendEmail('technology-applications', app._id)}>
                                                                        <RefreshCw className={`w-4 h-4 text-orange-500 ${resendingId === app._id ? 'animate-spin' : ''}`} />
                                                                    </Button>
                                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteRecord('technology-applications', app._id, fetchTechApplications)}>
                                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                                    </Button>
                                                                </div>
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
                                                                <div className="flex gap-2">
                                                                    <Button size="icon" variant="ghost" onClick={() => {
                                                                        alert(JSON.stringify(app.staffingRequirements, null, 2));
                                                                    }}>
                                                                        <Eye className="w-4 h-4 text-gray-500" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="icon" onClick={() => openEmailModal(app.companyDetails?.email, `Re: ${app.serviceCategory} Request`)}>
                                                                        <Mail className="w-4 h-4 text-blue-500" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="icon" title="Re-trigger Email" disabled={resendingId === app._id} onClick={() => handleResendEmail('staffing-applications', app._id)}>
                                                                        <RefreshCw className={`w-4 h-4 text-orange-500 ${resendingId === app._id ? 'animate-spin' : ''}`} />
                                                                    </Button>
                                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteRecord('staffing-applications', app._id, fetchStaffingApplications)}>
                                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                                    </Button>
                                                                </div>
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
                                                                <div className="flex gap-2">
                                                                    <Button size="icon" variant="ghost" onClick={() => alert(JSON.stringify(app.digitalMarketingRequirements, null, 2))}>
                                                                        <Eye className="w-4 h-4 text-gray-500" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="icon" onClick={() => openEmailModal(app.clientDetails?.email, `Re: ${app.clientDetails?.selectedService} Strategy`)}>
                                                                        <Mail className="w-4 h-4 text-blue-500" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="icon" title="Re-trigger Email" disabled={resendingId === app._id} onClick={() => handleResendEmail('marketing-applications', app._id)}>
                                                                        <RefreshCw className={`w-4 h-4 text-orange-500 ${resendingId === app._id ? 'animate-spin' : ''}`} />
                                                                    </Button>
                                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteRecord('marketing-applications', app._id, fetchMarketingApplications)}>
                                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                                    </Button>
                                                                </div>
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
                                                    <Label>Type <span className="text-red-500">*</span></Label>
                                                    <select
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        value={newContent.type}
                                                        onChange={(e) => setNewContent({ ...newContent, type: e.target.value })}
                                                        required
                                                    >
                                                        <option value="testimonial">Testimonial</option>
                                                        <option value="caseStudy">Case Study</option>
                                                    </select>
                                                </div>
                                                <div className="w-1/2">
                                                    <Label>Order Priority <span className="text-red-500">*</span></Label>
                                                    <Input type="number" value={newContent.order} onChange={(e) => setNewContent({ ...newContent, order: parseInt(e.target.value) })} required />
                                                </div>
                                            </div>

                                            {newContent.type === 'testimonial' ? (
                                                <div className="space-y-4 border p-4 rounded-md bg-secondary/10">
                                                    <h4 className="font-semibold text-sm">Testimonial Details</h4>
                                                    <Label>Quote <span className="text-red-500">*</span></Label>
                                                    <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newContent.quote} onChange={(e) => setNewContent({ ...newContent, quote: e.target.value })} required={newContent.type === 'testimonial'} />

                                                    <div className="grid grid-cols-2 gap-2">
                                                        <Input placeholder="Client Name *" value={newContent.client.name} onChange={(e) => setNewContent({ ...newContent, client: { ...newContent.client, name: e.target.value } })} required={newContent.type === 'testimonial'} />
                                                        <Input placeholder="Initials (Avatar)" value={newContent.client.initials} onChange={(e) => setNewContent({ ...newContent, client: { ...newContent.client, initials: e.target.value } })} />
                                                        <Input placeholder="Designation *" value={newContent.client.designation} onChange={(e) => setNewContent({ ...newContent, client: { ...newContent.client, designation: e.target.value } })} required={newContent.type === 'testimonial'} />
                                                        <Input placeholder="Company *" value={newContent.client.company} onChange={(e) => setNewContent({ ...newContent, client: { ...newContent.client, company: e.target.value } })} required={newContent.type === 'testimonial'} />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2">
                                                        <Input placeholder="Metric Value (e.g. 340%) *" value={newContent.highlightMetric.value} onChange={(e) => setNewContent({ ...newContent, highlightMetric: { ...newContent.highlightMetric, value: e.target.value } })} required={newContent.type === 'testimonial'} />
                                                        <Input placeholder="Metric Label (e.g. Growth) *" value={newContent.highlightMetric.label} onChange={(e) => setNewContent({ ...newContent, highlightMetric: { ...newContent.highlightMetric, label: e.target.value } })} required={newContent.type === 'testimonial'} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4 border p-4 rounded-md bg-secondary/10">
                                                    <h4 className="font-semibold text-sm">Case Study Details</h4>
                                                    <Input placeholder="Title *" value={newContent.title} onChange={(e) => setNewContent({ ...newContent, title: e.target.value })} required={newContent.type === 'caseStudy'} />
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <Input placeholder="Industry *" value={newContent.industry} onChange={(e) => setNewContent({ ...newContent, industry: e.target.value })} required={newContent.type === 'caseStudy'} />
                                                        <Input placeholder="Duration *" value={newContent.duration} onChange={(e) => setNewContent({ ...newContent, duration: e.target.value })} required={newContent.type === 'caseStudy'} />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Platforms (Comma separated) <span className="text-red-500">*</span></Label>
                                                        <Input placeholder="Instagram, Facebook..." value={newContent.platforms?.join(', ')} onChange={(e) => setNewContent({ ...newContent, platforms: e.target.value.split(',').map(s => s.trim()) })} required={newContent.type === 'caseStudy'} />
                                                    </div>

                                                    <Label>Challenge <span className="text-red-500">*</span></Label>
                                                    <textarea className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newContent.challenge} onChange={(e) => setNewContent({ ...newContent, challenge: e.target.value })} required={newContent.type === 'caseStudy'} />

                                                    <Label>Solution <span className="text-red-500">*</span></Label>
                                                    <textarea className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newContent.solution} onChange={(e) => setNewContent({ ...newContent, solution: e.target.value })} required={newContent.type === 'caseStudy'} />

                                                    <div className="space-y-2">
                                                        <Label>Results (JSON Format for now) <span className="text-red-500">*</span></Label>
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

                        {/* TRAININGS TAB */}
                        <TabsContent value="trainings" className="mt-0">
                            <div className="grid lg:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{editingTrainingId ? "Edit Training" : "Add Training"}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleCreateTraining} className="space-y-4">
                                            <Input placeholder="Training Name *" value={newTraining.name} onChange={e => setNewTraining({ ...newTraining, name: e.target.value })} required />

                                            <div className="grid grid-cols-2 gap-2">
                                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newTraining.category} onChange={e => setNewTraining({ ...newTraining, category: e.target.value })}>
                                                    <option>Full Stack Software Development</option>
                                                    <option>Artificial Intelligence & Generative AI</option>
                                                    <option>Database Technologies</option>
                                                    <option>Machine Learning & Data Science</option>
                                                    <option>Cloud Computing</option>
                                                    <option>DevOps & Platform Engineering</option>
                                                    <option>Cybersecurity</option>
                                                    <option>Data Engineering & Analytics</option>
                                                    <option>AI Tools & Automation</option>
                                                    <option>Edge Computing & IoT</option>
                                                    <option>Blockchain & Web3</option>
                                                    <option>AR / VR / XR</option>
                                                    <option>Quantum Computing</option>
                                                </select>
                                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newTraining.mode} onChange={e => setNewTraining({ ...newTraining, mode: e.target.value })}>
                                                    <option>Online</option>
                                                    <option>Offline</option>
                                                    <option>Hybrid</option>
                                                </select>
                                            </div>

                                            <Input placeholder="Topics (Comma separated) *" value={newTraining.topics} onChange={e => setNewTraining({ ...newTraining, topics: e.target.value })} required />
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="relative">
                                                    <Input placeholder="Duration (e.g. 3 Months) *" value={newTraining.duration} onChange={e => setNewTraining({ ...newTraining, duration: e.target.value })} required />
                                                    <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8 text-gray-400" onClick={() => {
                                                        const isHidden = newTraining.hiddenFields?.includes('duration');
                                                        const updated = isHidden ? newTraining.hiddenFields.filter(f => f !== 'duration') : [...(newTraining.hiddenFields || []), 'duration'];
                                                        setNewTraining({ ...newTraining, hiddenFields: updated });
                                                    }}>
                                                        {newTraining.hiddenFields?.includes('duration') ? <EyeOff className="w-4 h-4 text-red-400" /> : <Eye className="w-4 h-4" />}
                                                    </Button>
                                                </div>
                                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newTraining.status} onChange={e => setNewTraining({ ...newTraining, status: e.target.value })}>
                                                    <option>Active</option>
                                                    <option>Inactive</option>
                                                </select>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="relative space-y-2">
                                                    <Label>Start Date</Label>
                                                    <Input type="date" placeholder="Start Date" value={newTraining.startDate} onChange={e => setNewTraining({ ...newTraining, startDate: e.target.value })} />
                                                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-6 h-8 w-8 text-gray-400" onClick={() => {
                                                        const isHidden = newTraining.hiddenFields?.includes('startDate');
                                                        const updated = isHidden ? newTraining.hiddenFields.filter(f => f !== 'startDate') : [...(newTraining.hiddenFields || []), 'startDate'];
                                                        setNewTraining({ ...newTraining, hiddenFields: updated });
                                                    }}>
                                                        {newTraining.hiddenFields?.includes('startDate') ? <EyeOff className="w-3 h-3 text-red-400" /> : <Eye className="w-3 h-3" />}
                                                    </Button>
                                                </div>
                                                <div className="relative space-y-2">
                                                    <Label>End Date</Label>
                                                    <Input type="date" placeholder="End Date" value={newTraining.endDate} onChange={e => setNewTraining({ ...newTraining, endDate: e.target.value })} />
                                                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-6 h-8 w-8 text-gray-400" onClick={() => {
                                                        const isHidden = newTraining.hiddenFields?.includes('endDate');
                                                        const updated = isHidden ? newTraining.hiddenFields.filter(f => f !== 'endDate') : [...(newTraining.hiddenFields || []), 'endDate'];
                                                        setNewTraining({ ...newTraining, hiddenFields: updated });
                                                    }}>
                                                        {newTraining.hiddenFields?.includes('endDate') ? <EyeOff className="w-3 h-3 text-red-400" /> : <Eye className="w-3 h-3" />}
                                                    </Button>
                                                </div>
                                                <div className="relative space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label>Apply Before</Label>
                                                    </div>
                                                    <Input type="date" value={newTraining.applyBy} onChange={e => setNewTraining({ ...newTraining, applyBy: e.target.value })} />
                                                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-6 h-8 w-8 text-gray-400" onClick={() => {
                                                        const isHidden = newTraining.hiddenFields?.includes('applyBy');
                                                        const updated = isHidden ? newTraining.hiddenFields.filter(f => f !== 'applyBy') : [...(newTraining.hiddenFields || []), 'applyBy'];
                                                        setNewTraining({ ...newTraining, hiddenFields: updated });
                                                    }}>
                                                        {newTraining.hiddenFields?.includes('applyBy') ? <EyeOff className="w-3 h-3 text-red-400" /> : <Eye className="w-3 h-3" />}
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="relative">
                                                    <Input placeholder="Timing (e.g. 10:00 AM - 12:00 PM)" value={newTraining.timing || ""} onChange={e => setNewTraining({ ...newTraining, timing: e.target.value })} />
                                                    <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8 text-gray-400" onClick={() => {
                                                        const isHidden = newTraining.hiddenFields?.includes('timing');
                                                        const updated = isHidden ? newTraining.hiddenFields.filter(f => f !== 'timing') : [...(newTraining.hiddenFields || []), 'timing'];
                                                        setNewTraining({ ...newTraining, hiddenFields: updated });
                                                    }}>
                                                        {newTraining.hiddenFields?.includes('timing') ? <EyeOff className="w-4 h-4 text-red-400" /> : <Eye className="w-4 h-4" />}
                                                    </Button>
                                                </div>
                                                <div className="relative">
                                                    <Input placeholder="Note (One line context)" value={newTraining.note || ""} onChange={e => setNewTraining({ ...newTraining, note: e.target.value })} />
                                                    <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8 text-gray-400" onClick={() => {
                                                        const isHidden = newTraining.hiddenFields?.includes('note');
                                                        const updated = isHidden ? newTraining.hiddenFields.filter(f => f !== 'note') : [...(newTraining.hiddenFields || []), 'note'];
                                                        setNewTraining({ ...newTraining, hiddenFields: updated });
                                                    }}>
                                                        {newTraining.hiddenFields?.includes('note') ? <EyeOff className="w-4 h-4 text-red-400" /> : <Eye className="w-4 h-4" />}
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input placeholder="Syllabus Link (URL)" value={newTraining.syllabusLink} onChange={e => setNewTraining({ ...newTraining, syllabusLink: e.target.value })} />
                                                <div className="relative">
                                                    <Input placeholder="Community Link (WhatsApp/Discord)" value={newTraining.communityLink} onChange={e => setNewTraining({ ...newTraining, communityLink: e.target.value })} />
                                                    <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8 text-gray-400" onClick={() => {
                                                        const isHidden = newTraining.hiddenFields?.includes('communityLink');
                                                        const updated = isHidden ? newTraining.hiddenFields.filter(f => f !== 'communityLink') : [...(newTraining.hiddenFields || []), 'communityLink'];
                                                        setNewTraining({ ...newTraining, hiddenFields: updated });
                                                    }}>
                                                        {newTraining.hiddenFields?.includes('communityLink') ? <EyeOff className="w-4 h-4 text-red-400" /> : <Eye className="w-4 h-4" />}
                                                    </Button>
                                                </div>
                                            </div>
                                            <Textarea placeholder="Short Description *" value={newTraining.description} onChange={e => setNewTraining({ ...newTraining, description: e.target.value })} required />

                                            {/* Dynamic Form Builder */}
                                            <div className="space-y-4 border p-4 rounded-md bg-secondary/10">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="font-semibold text-sm">Application Form Fields</h4>
                                                    <Button type="button" size="sm" variant="outline" onClick={addFormField}>+ Add Field</Button>
                                                </div>

                                                {(newTraining.formFields || []).map((field, idx) => (
                                                    <div key={idx} className="flex flex-col gap-2 p-3 border rounded bg-background">
                                                        <div className="flex gap-2 items-center">
                                                            <Input
                                                                placeholder="Field Label (e.g. LinkedIn Profile)"
                                                                value={field.label}
                                                                onChange={e => updateFormField(idx, 'label', e.target.value)}
                                                                className="flex-1"
                                                            />
                                                            <select
                                                                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-32"
                                                                value={field.type}
                                                                onChange={e => updateFormField(idx, 'type', e.target.value)}
                                                            >
                                                                <option value="text">Text</option>
                                                                <option value="email">Email</option>
                                                                <option value="number">Number</option>
                                                                <option value="textarea">Text Area</option>
                                                                <option value="select">Select</option>
                                                            </select>
                                                            {/* Custom Field Visibility Toggle */}
                                                            <Button type="button" variant="ghost" size="icon" className="text-gray-400" onClick={() => updateFormField(idx, 'isHidden', !field.isHidden)}>
                                                                {field.isHidden ? <EyeOff className="w-4 h-4 text-red-400" /> : <Eye className="w-4 h-4" />}
                                                            </Button>
                                                            <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => removeFormField(idx)}>
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center space-x-2">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`req-${idx}`}
                                                                    checked={field.required}
                                                                    onChange={e => updateFormField(idx, 'required', e.target.checked)}
                                                                    className="h-4 w-4 rounded border-gray-300"
                                                                />
                                                                <label htmlFor={`req-${idx}`} className="text-xs">Required</label>
                                                            </div>
                                                            {field.type === 'select' && (
                                                                <Input
                                                                    placeholder="Options (comma separated)"
                                                                    value={field.options}
                                                                    onChange={e => updateFormField(idx, 'options', e.target.value)}
                                                                    className="flex-1 h-8 text-xs"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                                {(newTraining.formFields || []).length === 0 && <p className="text-xs text-muted-foreground text-center">No custom fields. Default fields: Name, Email.</p>}
                                            </div>

                                            {/* Email Customization Section */}
                                            <div className="space-y-4 border p-4 rounded-md bg-indigo-50/30">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-indigo-600" />
                                                    <h4 className="font-semibold text-sm">Email Customization</h4>
                                                </div>
                                                <p className="text-xs text-muted-foreground">Customize the confirmation email sent to applicants.</p>

                                                <Input
                                                    placeholder="Email Subject (Default: Registration Confirmed...)"
                                                    value={newTraining.emailSubject || ""}
                                                    onChange={(e) => setNewTraining({ ...newTraining, emailSubject: e.target.value })}
                                                />

                                                <Textarea
                                                    placeholder="Email Body (HTML supported). Use {{name}} for applicant name."
                                                    value={newTraining.emailBody || ""}
                                                    onChange={(e) => setNewTraining({ ...newTraining, emailBody: e.target.value })}
                                                    className="min-h-[100px] font-mono text-sm"
                                                />

                                                <div className="space-y-2">
                                                    <Label className="text-xs">Important Links / Buttons</Label>
                                                    {(newTraining.emailLinks || []).map((link, idx) => (
                                                        <div key={idx} className="flex gap-2 items-center bg-background p-2 rounded border">
                                                            <Input
                                                                placeholder="Label"
                                                                value={link.label}
                                                                onChange={(e) => updateTrainingEmailLink(idx, 'label', e.target.value)}
                                                                className="flex-1 h-8"
                                                            />
                                                            <Input
                                                                placeholder="URL"
                                                                value={link.url}
                                                                onChange={(e) => updateTrainingEmailLink(idx, 'url', e.target.value)}
                                                                className="flex-1 h-8"
                                                            />
                                                            <div className="flex items-center gap-1">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={link.isButton}
                                                                    onChange={(e) => updateTrainingEmailLink(idx, 'isButton', e.target.checked)}
                                                                    className="h-3 w-3"
                                                                />
                                                                <span className="text-[10px]">Btn</span>
                                                            </div>
                                                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => removeTrainingEmailLink(idx)}>
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button type="button" variant="outline" size="sm" onClick={addTrainingEmailLink} className="w-full h-8 text-xs border-dashed text-indigo-600 border-indigo-200">+ Add Link</Button>
                                                </div>
                                            </div>

                                            <Button type="submit" className="w-full">{editingTrainingId ? "Update Training" : "Create Training"}</Button>
                                            {editingTrainingId && <Button type="button" variant="outline" className="w-full mt-2" onClick={() => { setNewTraining({ name: "", category: "Full Stack Software Development", topics: "", duration: "", mode: "Online", description: "", syllabusLink: "", status: "Active", formFields: [], startDate: "", endDate: "", applyBy: "", timing: "", note: "", emailSubject: "", emailBody: "", emailLinks: [], hiddenFields: [], communityLink: "" }); setEditingTrainingId(null); }}>Cancel Edit</Button>}
                                        </form>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-center">
                                            <CardTitle>Existing Trainings</CardTitle>
                                            <select
                                                className="h-9 w-40 rounded-md border border-input bg-background px-3 py-1 text-sm"
                                                value={trainingTopicFilter}
                                                onChange={(e) => setTrainingTopicFilter(e.target.value)}
                                            >
                                                <option value="All">All Topics</option>
                                                <option>Full Stack Software Development</option>
                                                <option>Artificial Intelligence & Generative AI</option>
                                                <option>Database Technologies</option>
                                                <option>Machine Learning & Data Science</option>
                                                <option>Cloud Computing</option>
                                                <option>DevOps & Platform Engineering</option>
                                                <option>Cybersecurity</option>
                                                <option>Data Engineering & Analytics</option>
                                                <option>AI Tools & Automation</option>
                                                <option>Edge Computing & IoT</option>
                                                <option>Blockchain & Web3</option>
                                                <option>AR / VR / XR</option>
                                                <option>Quantum Computing</option>
                                            </select>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                            {trainings
                                                .filter(t => trainingTopicFilter === "All" || t.category === trainingTopicFilter)
                                                .map(t => (
                                                    <div key={t._id} className="p-4 border rounded-lg bg-card flex flex-col gap-2">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="font-bold">{t.name}</h4>
                                                                <span className="text-xs text-muted-foreground">{t.category} • {t.mode}</span>

                                                                {/* Date Verification Display */}
                                                                <div className="flex flex-wrap gap-2 mt-2 text-xs">
                                                                    <div className={`px-2 py-1 rounded border ${t.hiddenFields?.includes('startDate') ? "bg-red-50 border-red-200 text-red-600" : "bg-green-50 border-green-200 text-green-700"}`}>
                                                                        <span className="font-semibold">Start:</span> {t.startDate ? new Date(t.startDate).toLocaleDateString() : "N/A"} {t.hiddenFields?.includes('startDate') && "(Hidden)"}
                                                                    </div>
                                                                    <div className={`px-2 py-1 rounded border ${t.hiddenFields?.includes('endDate') ? "bg-red-50 border-red-200 text-red-600" : "bg-green-50 border-green-200 text-green-700"}`}>
                                                                        <span className="font-semibold">End:</span> {t.endDate ? new Date(t.endDate).toLocaleDateString() : "N/A"} {t.hiddenFields?.includes('endDate') && "(Hidden)"}
                                                                    </div>
                                                                    <div className={`px-2 py-1 rounded border ${t.hiddenFields?.includes('applyBy') ? "bg-red-50 border-red-200 text-red-600" : "bg-green-50 border-green-200 text-green-700"}`}>
                                                                        <span className="font-semibold">Apply:</span> {t.applyBy ? new Date(t.applyBy).toLocaleDateString() : "N/A"} {t.hiddenFields?.includes('applyBy') && "(Hidden)"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-1 items-center">
                                                                {/* Registration Count Badge */}
                                                                <div className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-md mr-1" title="Total Registrations">
                                                                    {trainingApplications.filter(app => app.trainingName === t.name).length} Regs
                                                                </div>

                                                                {/* Download CSV Button */}
                                                                <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleDownloadTrainingCSV(t.name)} title="Download Applicant Data">
                                                                    <Download className="w-4 h-4" />
                                                                </Button>

                                                                <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => {
                                                                    setEditingTrainingId(t._id);
                                                                    setNewTraining({
                                                                        ...t,
                                                                        topics: Array.isArray(t.topics) ? t.topics.join(', ') : t.topics,
                                                                        formFields: t.formFields || [],
                                                                        startDate: t.startDate || "",
                                                                        endDate: t.endDate || "",
                                                                        applyBy: t.applyBy || "",
                                                                        timing: t.timing || "",
                                                                        note: t.note || "",
                                                                        emailSubject: t.emailSubject || "",
                                                                        emailBody: t.emailBody || "",
                                                                        emailLinks: t.emailLinks || [],
                                                                        communityLink: t.communityLink || "" // Populating for edit
                                                                    });
                                                                }}><Monitor className="w-4 h-4" /></Button>
                                                                <Button size="sm" variant="ghost" className="text-red-500 h-8 w-8 p-0" onClick={() => handleDeleteTraining(t._id)}><Trash2 className="w-4 h-4" /></Button>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground line-clamp-2">{t.description}</p>
                                                        {t.syllabusLink && <a href={t.syllabusLink} target="_blank" rel="noreferrer" className="text-xs text-blue-500 flex items-center gap-1"><ExternalLink className="w-3 h-3" /> Syllabus</a>}
                                                    </div>
                                                ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* TRAINING APPLICATIONS TAB */}
                        <TabsContent value="training_apps" className="mt-0">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div className="flex flex-col gap-2">
                                        <CardTitle>Training Applications</CardTitle>
                                        <CardDescription>Select Category and Training to view applications</CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleDownloadTrainingApplicationsCSV} className="text-green-600 border-green-200">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download CSV
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-4 mb-6">
                                        <div className="w-1/2">
                                            <Label>Select Category</Label>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                value={trainingAppCategory}
                                                onChange={(e) => {
                                                    setTrainingAppCategory(e.target.value);
                                                    setTrainingAppName("All"); // Reset training selection
                                                }}
                                            >
                                                <option value="All">All Categories</option>
                                                <option>Full Stack Software Development</option>
                                                <option>Artificial Intelligence & Generative AI</option>
                                                <option>Database Technologies</option>
                                                <option>Machine Learning & Data Science</option>
                                                <option>Cloud Computing</option>
                                                <option>DevOps & Platform Engineering</option>
                                                <option>Cybersecurity</option>
                                                <option>Data Engineering & Analytics</option>
                                                <option>AI Tools & Automation</option>
                                                <option>Edge Computing & IoT</option>
                                                <option>Blockchain & Web3</option>
                                                <option>AR / VR / XR</option>
                                                <option>Quantum Computing</option>
                                            </select>
                                        </div>
                                        <div className="w-1/2">
                                            <Label>Select Training</Label>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                value={trainingAppName}
                                                onChange={(e) => setTrainingAppName(e.target.value)}
                                                disabled={trainingAppCategory === "All"}
                                            >
                                                <option value="All">All Trainings</option>
                                                {trainings
                                                    .filter(t => t.category === trainingAppCategory)
                                                    .map(t => (
                                                        <option key={t._id} value={t.name}>{t.name}</option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Show Table Only if filtered or just show all but filtered */}
                                    <div className="rounded-md border border-border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Training</TableHead>
                                                    <TableHead>Contact</TableHead>
                                                    {/* Changed: Removed Transaction Column */}
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {trainingApplications
                                                    .filter(app => {
                                                        const matchCategory = trainingAppCategory === "All" || trainings.find(t => t.name === app.trainingName)?.category === trainingAppCategory;
                                                        const matchName = trainingAppName === "All" || app.trainingName === trainingAppName;
                                                        return matchCategory && matchName;
                                                    })
                                                    .map(app => (
                                                        <TableRow key={app._id}>
                                                            <TableCell className="text-xs">{new Date(app.submittedAt).toLocaleDateString()}</TableCell>
                                                            <TableCell>{app.name}</TableCell>
                                                            <TableCell>{app.trainingName}</TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col text-xs">
                                                                    <span>{app.email}</span>
                                                                    <span>{app.phone || (app.dynamicData?.["Phone Number"]) || (app.dynamicData?.["Contact"])}</span>
                                                                    {(app.linkedinProfile || app.dynamicData?.["Linkdin Profile"]) &&
                                                                        <a href={app.linkedinProfile || app.dynamicData?.["Linkdin Profile"]} target="_blank" className="text-blue-500 hover:underline">LinkedIn</a>
                                                                    }
                                                                </div>
                                                            </TableCell>
                                                            {/* Changed: Removed Transaction Column */}
                                                            <TableCell>
                                                                <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold">{app.status}</span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button variant="ghost" size="sm" onClick={() => setSelectedAppForDetails(app)}>
                                                                    View Details
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                {trainingApplications.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center h-24">No applications found.</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>



                        {/* SOCIAL POSTS TAB */}
                        <TabsContent value="social-posts" className="mt-0">
                            <SocialPostManager />
                        </TabsContent>

                        {/* AI POSTS TAB */}
                        <TabsContent value="ai-posts" className="mt-0">
                            <AIPostManager />
                        </TabsContent>

                        {/* ADS TAB */}
                        <TabsContent value="ads" className="mt-0">
                            <NewsAdminPanel />
                        </TabsContent>

                        {/* WEBINARS TAB */}
                        <TabsContent value="webinars" className="mt-0">
                            <WebinarManager />
                        </TabsContent>

                    </Tabs>
                </main>

                {/* EMAIL COMPOSITION MODAL */}
                <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Send Email</DialogTitle>
                            <DialogDescription>Compose an email to {emailDraft.to}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <Input
                                    value={emailDraft.subject}
                                    onChange={(e) => setEmailDraft({ ...emailDraft, subject: e.target.value })}
                                    placeholder="Email Subject"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Message Body</Label>
                                <Textarea
                                    value={emailDraft.body}
                                    onChange={(e) => setEmailDraft({ ...emailDraft, body: e.target.value })}
                                    placeholder="Type your message here..."
                                    className="min-h-[150px]"
                                />
                            </div>

                            {/* Dynamic Links Section */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Attachments / Links (Optional)</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEmailDraft({ ...emailDraft, links: [...emailDraft.links, { label: "", url: "" }] })}
                                    >
                                        <Plus className="w-3 h-3 mr-1" /> Add Link
                                    </Button>
                                </div>
                                {emailDraft.links.map((link, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            placeholder="Label (e.g. Meeting Link)"
                                            value={link.label}
                                            onChange={(e) => {
                                                const newLinks = [...emailDraft.links];
                                                newLinks[index].label = e.target.value;
                                                setEmailDraft({ ...emailDraft, links: newLinks });
                                            }}
                                            className="w-1/3"
                                        />
                                        <Input
                                            placeholder="URL (https://...)"
                                            value={link.url}
                                            onChange={(e) => {
                                                const newLinks = [...emailDraft.links];
                                                newLinks[index].url = e.target.value;
                                                setEmailDraft({ ...emailDraft, links: newLinks });
                                            }}
                                            className="w-2/3"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                const newLinks = emailDraft.links.filter((_, i) => i !== index);
                                                setEmailDraft({ ...emailDraft, links: newLinks });
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEmailModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleSendAdminEmail} disabled={sendingEmail}>
                                {sendingEmail ? "Sending..." : "Send Email"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* DETAILS MODAL */}
                <Dialog open={!!selectedAppForDetails} onOpenChange={(open) => !open && setSelectedAppForDetails(null)}>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Application Details</DialogTitle>
                            <DialogDescription>Full application data for {selectedAppForDetails?.name}</DialogDescription>
                        </DialogHeader>
                        {selectedAppForDetails && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 border-b pb-2 mb-2 font-bold">Standard Details</div>
                                <div><span className="text-muted-foreground text-sm">Name:</span> {selectedAppForDetails.name}</div>
                                <div><span className="text-muted-foreground text-sm">Email:</span> {selectedAppForDetails.email}</div>
                                <div><span className="text-muted-foreground text-sm">Training:</span> {selectedAppForDetails.trainingName}</div>
                                <div><span className="text-muted-foreground text-sm">Date:</span> {new Date(selectedAppForDetails.submittedAt).toLocaleString()}</div>

                                <div className="col-span-2 border-b pb-2 mb-2 mt-4 font-bold">Dynamic Data</div>
                                {selectedAppForDetails.dynamicData && Object.entries(selectedAppForDetails.dynamicData).map(([key, value]) => (
                                    <div key={key} className="col-span-2 sm:col-span-1">
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider">{key}</div>
                                        <div className="text-sm break-words">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <DialogFooter>
                            <Button onClick={() => setSelectedAppForDetails(null)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div >
    );
};

export default AdminPanel;