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
import { Lock, User, LogOut, MessageSquare, Trophy, Plus, Save, ChevronDown, ChevronUp, ExternalLink, Download, Eye, EyeOff, Trash2, GraduationCap, Monitor, Briefcase, TrendingUp, Megaphone, Quote, Mail, RefreshCw, PenTool, ClipboardList, StickyNote, Code, Video, Map, Compass, Sparkles, Key, Copy } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import SocialPostManager from "@/pages/Admin-Panel/managers/SocialPostManager";
import AIPostManager from "@/pages/Admin-Panel/managers/AIPostManager";
import NewsAdminPanel from "@/pages/Admin-Panel/managers/NewsAdminPanel";
import NotesTool from "@/pages/Admin-Panel/managers/NotesTool";
import TodoTool from "@/pages/Admin-Panel/managers/TodoTool";
import TechPostManager from "@/pages/Admin-Panel/managers/TechPostManager";
import WebinarManager from "@/pages/Admin-Panel/managers/WebinarManager";
import CareerGuidanceAdmin from "@/pages/Admin-Panel/managers/CareerGuidanceAdmin";
import ContactsSection from "./Admin-Panel/components/ContactsSection";
import HackathonsSection from "./Admin-Panel/components/HackathonsSection";
import ProgramsSection from "./Admin-Panel/components/ProgramsSection";
import TechApplicationsSection from "./Admin-Panel/components/TechApplicationsSection";
import MarketingApplicationsSection from "./Admin-Panel/components/MarketingApplicationsSection";
import StaffingApplicationsSection from "./Admin-Panel/components/StaffingApplicationsSection";
import ExclusiveDataSection from "./Admin-Panel/components/ExclusiveDataSection";
import TestimonialsSection from "./Admin-Panel/components/TestimonialsSection";
import RewardManager from "./Admin-Panel/managers/RewardManager";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";




import { useLocation } from "react-router-dom";
import { SECTION_PASSWORDS } from "./Admin-Panel/passwords";

const AdminPanel = () => {
    const location = useLocation();
    const isSharedAdminMode = location.pathname === '/shared-admin';
    const [isAuthenticated, setIsAuthenticated] = useState(isSharedAdminMode ? true : false);
    const [isSharedAdminAuthenticated, setIsSharedAdminAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState(isSharedAdminMode ? "" : "exclusive_data"); // Empty in shared mode to force password
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isAllRequestsOpen, setIsAllRequestsOpen] = useState(false);

    // Shared Admin Password Protection
    const [unlockedSections, setUnlockedSections] = useState<Set<string>>(new Set());
    const [pendingSection, setPendingSection] = useState<string | null>(null);
    const [passwordInput, setPasswordInput] = useState("");

    const handleTabChange = (newTab: string) => {
        if (isSharedAdminMode && !unlockedSections.has(newTab)) {
            setPendingSection(newTab);
            return;
        }
        setActiveTab(newTab);
    };

    const handlePasswordSubmit = () => {
        if (pendingSection && passwordInput === SECTION_PASSWORDS[pendingSection as keyof typeof SECTION_PASSWORDS]) {
            setUnlockedSections(prev => new Set([...prev, pendingSection]));

            // Handle tech subcategories - set the category and open tech-posts
            if (pendingSection.startsWith('tech_')) {
                const techCategoryMap: Record<string, string> = {
                    'tech_python': 'Python',
                    'tech_oracle': 'ORACLE DBA',
                    'tech_mssql': 'SQL SERVER DBA',
                    'tech_mysql': 'MY SQL',
                    'tech_postgresql': 'POSTGRESS',
                    'tech_mongodb': 'MongoDB'
                };
                const category = techCategoryMap[pendingSection];
                if (category) {
                    setTechPostCategory(category);
                    setActiveTab('tech-posts');
                    setIsTechPostsOpen(true); // Ensure dropdown is open
                }
            } else {
                setActiveTab(pendingSection);
            }

            // Fetch data immediately after unlocking
            fetchDataForSection(pendingSection);

            setPendingSection(null);
            setPasswordInput("");
            toast.success("Section unlocked");
        } else {
            toast.error("Incorrect password");
            setPasswordInput("");
        }
    };

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

    const VALID_PASSWORDS = ["652487", "1112473"];

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (VALID_PASSWORDS.includes(password)) {
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

    const handleToggleProgramVisibility = async (id: string, currentStatus: boolean, type: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/programs/${id}/visibility`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isHidden: !currentStatus })
            });
            const data = await response.json();
            if (data.success) {
                toast.success(currentStatus ? `${type} Now Visible` : `${type} Hidden`);
                fetchPrograms();
            } else {
                toast.error("Failed to update visibility");
            }
        } catch (error) {
            toast.error("Error updating visibility");
        }
    };

    // --- Trainings Handlers ---


    // Trigger data fetch on tab change
    // Centralized data fetching function for all sections
    const fetchDataForSection = (section: string) => {
        if (section === 'contacts') fetchContacts();
        if (section === 'hackathons') {
            fetchHackathons();
            fetchApplications();
        }
        if (section === 'programs') {
            fetchPrograms();
            fetchProgramApplications();
        }
        if (section === 'tech_apps') {
            fetchTechApplications();
        }
        if (section === 'staffing') {
            fetchStaffingApplications();
        }
        if (section === 'marketing') {
            fetchMarketingApplications();
        }
        if (section === 'content') {
            fetchTestimonials();
        }
    };

    const onTabChange = (value: string) => {
        // First check password protection
        handleTabChange(value);

        // Only fetch data if password check passed (not in shared mode or section is unlocked)
        if (!isSharedAdminMode || unlockedSections.has(value)) {
            fetchDataForSection(value);
        }
    };

    // Login Screen
    // Shared Admin Welcome Screen
    if (isSharedAdminMode && !isSharedAdminAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full">
                    <Card className="border shadow-sm">
                        <CardHeader className="text-center space-y-2 pb-4">
                            <div className="mx-auto w-16 h-16 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                            <CardTitle className="text-3xl font-bold">
                                Welcome to <span className="text-blue-600">NexbyteInd</span>
                            </CardTitle>
                            <CardDescription className="text-base">
                                Come create and develop something cool
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (VALID_PASSWORDS.includes(password)) {
                                        setIsSharedAdminAuthenticated(true);
                                        toast.success("Welcome! 🎉");
                                    } else {
                                        toast.error("Invalid password");
                                        setPassword("");
                                    }
                                }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-11"
                                        autoFocus
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 h-11"
                                >
                                    Login
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

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
                                        onClick={() => handleTabChange("notes")}
                                    >
                                        <StickyNote className="w-3 h-3 mr-2" />
                                        Notes
                                    </Button>
                                    <Button
                                        variant={activeTab === "todo" ? "secondary" : "ghost"}
                                        size="sm"
                                        className="w-full justify-start h-8"
                                        onClick={() => handleTabChange("todo")}
                                    >
                                        <ClipboardList className="w-3 h-3 mr-2" />
                                        Todo
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    {/* PASSWORDS SECTION - Only in main admin */}
                    {!isSharedAdminMode && (
                        <Button
                            variant={activeTab === "passwords" ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveTab("passwords")}
                        >
                            <Key className="w-4 h-4 mr-2" />
                            Passwords
                        </Button>
                    )}
                    {/* ALL REQUESTS DROPDOWN */}
                    <div>
                        <Button
                            variant="ghost"
                            className="w-full justify-between"
                            onClick={() => setIsAllRequestsOpen(!isAllRequestsOpen)}
                        >
                            <div className="flex items-center">
                                <ClipboardList className="w-4 h-4 mr-2" />
                                All Requests
                            </div>
                            {isAllRequestsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>

                        <AnimatePresence>
                            {isAllRequestsOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden ml-4 pl-2 border-l border-border/50 space-y-1 mt-1"
                                >
                                    <Button
                                        variant={activeTab === "exclusive_data" ? "secondary" : "ghost"}
                                        size="sm"
                                        className="w-full justify-start h-8"
                                        onClick={() => onTabChange("exclusive_data")}
                                    >
                                        <Lock className="w-3 h-3 mr-2" />
                                        Exclusive Data
                                    </Button>
                                    <Button
                                        variant={activeTab === "tech_apps" ? "secondary" : "ghost"}
                                        size="sm"
                                        className="w-full justify-start h-8"
                                        onClick={() => onTabChange("tech_apps")}
                                    >
                                        <Monitor className="w-3 h-3 mr-2" />
                                        Tech Apps
                                    </Button>
                                    <Button
                                        variant={activeTab === "staffing" ? "secondary" : "ghost"}
                                        size="sm"
                                        className="w-full justify-start h-8"
                                        onClick={() => onTabChange("staffing")}
                                    >
                                        <Briefcase className="w-3 h-3 mr-2" />
                                        Staffing
                                    </Button>
                                    <Button
                                        variant={activeTab === "marketing" ? "secondary" : "ghost"}
                                        size="sm"
                                        className="w-full justify-start h-8"
                                        onClick={() => onTabChange("marketing")}
                                    >
                                        <Megaphone className="w-3 h-3 mr-2" />
                                        Marketing
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
                        variant={activeTab === "rewards" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => onTabChange("rewards")}
                    >
                        <Trophy className="w-4 h-4 mr-2" />
                        Rewards
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
                        variant={activeTab === "career_guidance" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => onTabChange("career_guidance")}
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
                                        { label: "PostgreSQL", value: "POSTGRESS" },
                                        { label: "MongoDB", value: "MongoDB" }
                                    ].map((cat) => {
                                        // Map category values to section names for password protection
                                        const sectionMap: Record<string, string> = {
                                            "Python": "tech_python",
                                            "ORACLE DBA": "tech_oracle",
                                            "SQL SERVER DBA": "tech_mssql",
                                            "MY SQL": "tech_mysql",
                                            "POSTGRESS": "tech_postgresql",
                                            "MongoDB": "tech_mongodb"
                                        };
                                        const sectionName = sectionMap[cat.value];

                                        return (
                                            <Button
                                                key={cat.value}
                                                variant={activeTab === "tech-posts" && techPostCategory === cat.value ? "secondary" : "ghost"}
                                                size="sm"
                                                className="w-full justify-start h-8"
                                                onClick={() => {
                                                    if (isSharedAdminMode && sectionName) {
                                                        // Check if section is unlocked
                                                        if (!unlockedSections.has(sectionName)) {
                                                            setPendingSection(sectionName);
                                                            return;
                                                        }
                                                    }
                                                    setActiveTab("tech-posts");
                                                    setTechPostCategory(cat.value);
                                                }}
                                            >
                                                <Code className="w-3 h-3 mr-2" />
                                                {cat.label}
                                            </Button>
                                        );
                                    })}
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
            <div className="flex-1 flex flex-col">
                <header className="p-6 border-b flex items-center justify-between bg-card/50 backdrop-blur">
                    <div>
                        <h1 className="font-semibold text-lg capitalize">
                            {activeTab ? activeTab.replace(/_/g, ' ') : (isSharedAdminMode ? 'Select a Section' : 'Dashboard')}
                        </h1>
                        {isSharedAdminMode && (
                            <div className="mt-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full inline-block font-medium">
                                Intern View
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">Admin User</span>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-6">
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">

                        {/* WELCOME SCREEN FOR SHARED ADMIN */}
                        {isSharedAdminMode && activeTab === "" && (
                            <div className="flex items-center justify-center h-full">
                                <Card className="max-w-md">
                                    <CardHeader>
                                        <CardTitle className="text-center">Welcome to Intern View</CardTitle>
                                        <CardDescription className="text-center">
                                            Select a section from the sidebar to get started. You'll need to enter a password to access each section.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm text-muted-foreground text-center">
                                            Click on any section in the left sidebar to begin.
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

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
                            <ContactsSection contacts={contacts} showControls={!isSharedAdminMode} />
                        </TabsContent>

                        {/* EXCLUSIVE DATA TAB (Google Reviews Marketing) */}
                        <TabsContent value="exclusive_data" className="mt-0">
                            <ExclusiveDataSection
                                exclusiveData={exclusiveData}
                                fetchExclusiveData={fetchExclusiveData}
                                handleDeleteRecord={handleDeleteRecord}
                                showControls={!isSharedAdminMode}
                            />
                        </TabsContent>

                        {/* CAREER GUIDANCE TAB */}
                        <TabsContent value="career_guidance" className="mt-0 h-full">
                            <CareerGuidanceAdmin showControls={!isSharedAdminMode} />
                        </TabsContent>

                        {/* HACKATHONS TAB */}
                        <TabsContent value="hackathons" className="mt-0">
                            <HackathonsSection
                                hackathons={hackathons}
                                applications={applications}
                                expandedHackathonId={expandedHackathonId}
                                setExpandedHackathonId={setExpandedHackathonId}
                                newHackathon={newHackathon}
                                setNewHackathon={setNewHackathon}
                                editingHackathonId={editingHackathonId}
                                handleCreateHackathon={handleCreateHackathon}
                                handleEditHackathon={handleEditHackathon}
                                handleCancelEditHackathon={handleCancelEditHackathon}
                                handleDeleteHackathon={handleDeleteHackathon}
                                handleToggleVisibility={handleToggleVisibility}
                                fetchApplications={fetchApplications}
                                resendingId={resendingId}
                                handleResendEmail={handleResendEmail}
                                openEmailModal={openEmailModal}
                                handleDeleteRecord={handleDeleteRecord}
                                showControls={!isSharedAdminMode}
                            />
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
                                    <TechPostManager fixedCategory={techPostCategory} showControls={!isSharedAdminMode} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* WEBINARS TAB */}
                        <TabsContent value="webinars" className="mt-0">
                            <WebinarManager />
                        </TabsContent>



                        {/* PROGRAMS TAB */}
                        <TabsContent value="programs" className="mt-0">
                            <ProgramsSection
                                programs={programs}
                                programApplications={programApplications}
                                expandedPrograms={expandedPrograms}
                                setExpandedPrograms={setExpandedPrograms}
                                newProgram={newProgram}
                                setNewProgram={setNewProgram}
                                editingProgramId={editingProgramId}
                                handleCreateProgram={handleCreateProgram}
                                handleEditProgram={handleEditProgram}
                                handleCancelEditProgram={handleCancelEditProgram}
                                handleDeleteProgram={handleDeleteProgram}
                                handleToggleProgramVisibility={handleToggleProgramVisibility}
                                fetchProgramApplications={fetchProgramApplications}
                                resendingId={resendingId}
                                handleResendEmail={handleResendEmail}
                                openEmailModal={openEmailModal}
                                handleDeleteRecord={handleDeleteRecord}
                                showControls={!isSharedAdminMode}
                            />
                        </TabsContent>

                        {/* TECH APPLICATIONS TAB */}
                        <TabsContent value="tech_apps" className="mt-0">
                            <TechApplicationsSection
                                techApplications={techApplications}
                                fetchTechApplications={fetchTechApplications}
                                resendingId={resendingId}
                                handleResendEmail={handleResendEmail}
                                openEmailModal={openEmailModal}
                                handleDeleteRecord={handleDeleteRecord}
                                showControls={!isSharedAdminMode}
                            />
                        </TabsContent>

                        {/* STAFFING APPLICATIONS TAB */}
                        <TabsContent value="staffing" className="mt-0">
                            <StaffingApplicationsSection
                                staffingApplications={staffingApplications}
                                fetchStaffingApplications={fetchStaffingApplications}
                                resendingId={resendingId}
                                handleResendEmail={handleResendEmail}
                                openEmailModal={openEmailModal}
                                handleDeleteRecord={handleDeleteRecord}
                                showControls={!isSharedAdminMode}
                            />
                        </TabsContent>

                        {/* MARKETING TAB */}
                        <TabsContent value="marketing" className="mt-0">
                            <MarketingApplicationsSection
                                marketingApplications={marketingApplications}
                                fetchMarketingApplications={fetchMarketingApplications}
                                resendingId={resendingId}
                                handleResendEmail={handleResendEmail}
                                openEmailModal={openEmailModal}
                                handleDeleteRecord={handleDeleteRecord}
                                showControls={!isSharedAdminMode}
                            />
                        </TabsContent>

                        {/* CONTENT MANAGER TAB */}
                        <TabsContent value="content" className="mt-0">
                            <TestimonialsSection
                                testimonials={testimonials}
                                newContent={newContent}
                                setNewContent={setNewContent}
                                editingContentId={editingContentId}
                                setEditingContentId={setEditingContentId}
                                handleSaveContent={handleSaveContent}
                                handleDeleteContent={handleDeleteContent}
                                toggleContentStatus={toggleContentStatus}
                                showControls={!isSharedAdminMode}
                            />
                        </TabsContent>

                        {/* SOCIAL POSTS TAB */}
                        <TabsContent value="social-posts" className="mt-0">
                            <SocialPostManager showControls={!isSharedAdminMode} />
                        </TabsContent>

                        {/* AI POSTS TAB */}
                        <TabsContent value="ai-posts" className="mt-0">
                            <AIPostManager showControls={!isSharedAdminMode} />
                        </TabsContent>

                        {/* ADS TAB */}
                        <TabsContent value="ads" className="mt-0">
                            <NewsAdminPanel showControls={!isSharedAdminMode} />
                        </TabsContent>

                        {/* WEBINARS TAB */}

                        <TabsContent value="webinars" className="mt-0">
                            <WebinarManager showControls={!isSharedAdminMode} />
                        </TabsContent>

                        <TabsContent value="rewards" className="mt-0">
                            <RewardManager />
                        </TabsContent>



                        {/* PASSWORDS SECTION - Only in main admin */}
                        <TabsContent value="passwords" className="mt-0">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Section Passwords</CardTitle>
                                    <CardDescription>
                                        All passwords for shared-admin sections. Click to copy.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {Object.entries(SECTION_PASSWORDS).map(([section, password]) => {
                                            // Format section name for display
                                            const displayName = section
                                                .replace(/_/g, ' ')
                                                .replace(/-/g, ' ')
                                                .split(' ')
                                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                .join(' ');

                                            return (
                                                <div
                                                    key={section}
                                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(password);
                                                        toast.success(`Copied password for ${displayName}`);
                                                    }}
                                                >
                                                    <div className="flex-1">
                                                        <div className="font-medium text-sm">{displayName}</div>
                                                        <div className="text-xs text-gray-500 font-mono mt-1">{password}</div>
                                                    </div>
                                                    <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
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

                {/* SHARED ADMIN PASSWORD MODAL */}
                <Dialog open={!!pendingSection} onOpenChange={() => setPendingSection(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Section Locked</DialogTitle>
                            <DialogDescription>
                                Enter password to access {pendingSection?.replace(/-/g, ' ').replace(/_/g, ' ')}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="Enter section password"
                                onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                                autoFocus
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setPendingSection(null)}>Cancel</Button>
                            <Button onClick={handlePasswordSubmit}>Unlock</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div >
    );
};

export default AdminPanel;