import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Save, Download, Eye, EyeOff, Trash2, ChevronUp, ChevronDown, ExternalLink, Mail, RefreshCw, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface HackathonsSectionProps {
    hackathons: any[];
    applications: any[];
    expandedHackathonId: string | null;
    setExpandedHackathonId: (id: string | null) => void;
    newHackathon: any;
    setNewHackathon: (data: any) => void;
    editingHackathonId: string | null;
    handleCreateHackathon: (e: React.FormEvent) => void;
    handleEditHackathon: (hackathon: any) => void;
    handleCancelEditHackathon: () => void;
    handleDeleteHackathon: (id: string) => void;
    handleToggleVisibility: (id: string, currentStatus: boolean) => void;
    fetchApplications: () => void;
    resendingId: string | null;
    handleResendEmail: (collectionRoute: string, id: string) => void;
    openEmailModal: (email: string, subject: string) => void;
    handleDeleteRecord: (collectionRoute: string, id: string, refreshFn: () => void) => void;
    handleMarkCompleted: (id: string) => void;
    showControls?: boolean;
}

const HackathonsSection: React.FC<HackathonsSectionProps> = ({
    hackathons,
    applications,
    expandedHackathonId,
    setExpandedHackathonId,
    newHackathon,
    setNewHackathon,
    editingHackathonId,
    handleCreateHackathon,
    handleEditHackathon,
    handleCancelEditHackathon,
    handleDeleteHackathon,
    handleToggleVisibility,
    fetchApplications,
    resendingId,
    handleResendEmail,
    openEmailModal,
    handleDeleteRecord,
    handleMarkCompleted,
    showControls = true
}) => {

    return (
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
                                    <option>Online</option>
                                    <option>Offline</option>
                                    <option>Hybrid</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Description (Short Brief) <span className="text-red-500">*</span></Label>
                            <textarea
                                className="w-full border rounded-md p-2 min-h-[80px]"
                                placeholder="A brief description of the hackathon..."
                                value={newHackathon.description}
                                onChange={(e) => setNewHackathon({ ...newHackathon, description: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date <span className="text-red-500">*</span></Label>
                                <Input
                                    type="date"
                                    value={newHackathon.startDate}
                                    onChange={(e) => setNewHackathon({ ...newHackathon, startDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date <span className="text-red-500">*</span></Label>
                                <Input
                                    type="date"
                                    value={newHackathon.endDate}
                                    onChange={(e) => setNewHackathon({ ...newHackathon, endDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Reg. Deadline <span className="text-red-500">*</span></Label>
                                <Input
                                    type="date"
                                    value={newHackathon.registrationDeadline}
                                    onChange={(e) => setNewHackathon({ ...newHackathon, registrationDeadline: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex items-center space-x-2 mt-8">
                                <input
                                    type="checkbox"
                                    id="isPaid"
                                    className="h-4 w-4"
                                    checked={newHackathon.isPaid}
                                    onChange={(e) => setNewHackathon({ ...newHackathon, isPaid: e.target.checked })}
                                />
                                <Label htmlFor="isPaid">Is Paid?</Label>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Team Size Min</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={newHackathon.teamSizeMin}
                                    onChange={(e) => setNewHackathon({ ...newHackathon, teamSizeMin: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Team Size Max</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={newHackathon.teamSizeMax}
                                    onChange={(e) => setNewHackathon({ ...newHackathon, teamSizeMax: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Tech Stack (Comma Separated)</Label>
                            <Input
                                placeholder="React, Node.js, Python, AI/ML..."
                                value={newHackathon.techStack}
                                onChange={(e) => setNewHackathon({ ...newHackathon, techStack: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Helpline Number</Label>
                                <Input
                                    placeholder="+91 9999999999"
                                    value={newHackathon.helplineNumber}
                                    onChange={(e) => setNewHackathon({ ...newHackathon, helplineNumber: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Organizer Contact (Email)</Label>
                                <Input
                                    placeholder="organizer@example.com"
                                    value={newHackathon.organizerContact}
                                    onChange={(e) => setNewHackathon({ ...newHackathon, organizerContact: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>WhatsApp Group Link <span className="text-red-500">*</span></Label>
                            <Input
                                placeholder="https://chat.whatsapp.com/..."
                                value={newHackathon.whatsappGroupLink}
                                onChange={(e) => setNewHackathon({ ...newHackathon, whatsappGroupLink: e.target.value })}
                                required
                            />
                        </div>

                        {/* --- Custom Buttons Section --- */}
                        <div className="space-y-4 p-4 border rounded-md bg-secondary/5">
                            <h4 className="font-semibold text-sm">Action Buttons Settings</h4>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="enableApplyButton"
                                        className="h-4 w-4"
                                        checked={newHackathon.enableApplyButton !== false}
                                        onChange={(e) => setNewHackathon({ ...newHackathon, enableApplyButton: e.target.checked })}
                                    />
                                    <Label htmlFor="enableApplyButton">Enable Default "Apply Now" Button</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="enableQuizButton"
                                        className="h-4 w-4"
                                        checked={newHackathon.enableQuizButton || false}
                                        onChange={(e) => setNewHackathon({ ...newHackathon, enableQuizButton: e.target.checked })}
                                    />
                                    <Label htmlFor="enableQuizButton">Enable Custom External Link Button (e.g., Take Quiz)</Label>
                                </div>
                            </div>
                            
                            {newHackathon.enableQuizButton && (
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div className="space-y-2">
                                        <Label>Custom Button Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            placeholder="e.g. Take me the quiz"
                                            value={newHackathon.quizButtonName || ""}
                                            onChange={(e) => setNewHackathon({ ...newHackathon, quizButtonName: e.target.value })}
                                            required={newHackathon.enableQuizButton}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Custom Button Link (URL) <span className="text-red-500">*</span></Label>
                                        <Input
                                            type="url"
                                            placeholder="https://..."
                                            value={newHackathon.quizButtonLink || ""}
                                            onChange={(e) => setNewHackathon({ ...newHackathon, quizButtonLink: e.target.value })}
                                            required={newHackathon.enableQuizButton}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* ------------------------------- */}

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
                                {editingHackathonId ? "Update Hackathon (Hidden by Default)" : "Publish Hackathon (Hidden by Default)"}
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
                        {hackathons.filter(h => h.status !== 'completed').length === 0 ? (
                            <p className="text-muted-foreground text-sm">No active hackathons found.</p>
                        ) : (
                            hackathons.filter(h => h.status !== 'completed').map((h, i) => {
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

                                                    {showControls && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleToggleVisibility(h._id, h.isHidden)}
                                                            className={`h-8 w-8 p-0 ${h.isHidden ? "text-gray-500" : "text-blue-600"}`}
                                                            title={h.isHidden ? "Show Hackathon" : "Hide Hackathon"}
                                                        >
                                                            {h.isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </Button>
                                                    )}

                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteHackathon(h._id)}
                                                        className="h-8 w-8 p-0"
                                                        title="Delete Hackathon"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleMarkCompleted(h._id)}
                                                        className="h-8 w-8 p-0 text-green-600 border-green-200 hover:bg-green-50"
                                                        title="Mark as Completed"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
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

                                        {
                                            isExpanded && (
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
                                                                                {(app.participantType === 'Team' ? app.leader?.github : app.github) && (
                                                                                    <a
                                                                                        href={app.participantType === 'Team' ? app.leader?.github : app.github}
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
                                            )
                                        }
                                    </div>
                                );
                            })
                        )}
                    </div>
                </CardContent>
            </Card>
        </div >
    );
};

export default HackathonsSection;
