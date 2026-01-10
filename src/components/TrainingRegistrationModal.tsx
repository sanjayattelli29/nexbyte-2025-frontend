import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config";

interface FormField {
    label: string;
    type: string;
    required: boolean;
    options?: string[] | string; // Handle both array or comma-separated string
}

interface TrainingRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    training: any; // Full training object
    onSuccess?: () => void;
}

const TrainingRegistrationModal = ({ isOpen, onClose, training, onSuccess }: TrainingRegistrationModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (isOpen) {
            setFormData({}); // Reset on open
        }
    }, [isOpen]);

    const handleInputChange = (key: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Extract core fields if present, else everything goes to dynamicData handling in backend
            // Our backend expects: applicantName, email, trainingName, ...others

            const payload = {
                trainingName: training?.name,
                applicantName: formData["Full Name"] || formData["Name"] || formData["name"], // Fallback logic or enforce specific field names
                email: formData["Email"] || formData["email"],
                ...formData
            };

            // Basic validation for Name and Email if not explicitly in formFields (though they should be)
            if (!payload.applicantName && loading) { // Just a check
                // Ideally we assume the Admin configured "Full Name" and "Email" fields.
                // If not, we might fail backend validation.
            }

            const response = await fetch(`${API_BASE_URL}/api/apply-training`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Application Successful!");
                onClose();
                setFormData({});
                if (onSuccess) onSuccess();
            } else {
                toast.error(data.message || "Application Failed");
            }
        } catch (error) {
            toast.error("Error submitting application");
        } finally {
            setLoading(false);
        }
    };

    // Default base fields that should always be present
    const baseFields: FormField[] = [
        { label: "Full Name", type: "text", required: true },
        { label: "Email", type: "email", required: true },
        { label: "Phone Number", type: "number", required: true },
    ];

    // Combine base fields with custom training fields
    const fieldsToRender: FormField[] = [
        ...baseFields,
        ...(training?.formFields || [])
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto p-0 gap-0 border-0 shadow-2xl bg-card rounded-2xl ring-1 ring-white/10">

                {/* Header Section with Gradient */}
                <div className="bg-gradient-to-r from-primary/90 to-primary p-6 text-primary-foreground relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
                    <DialogHeader className="relative z-10">
                        <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm ring-1 ring-white/30">
                            <span className="text-2xl">🎓</span>
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-white">Apply for {training?.name}</DialogTitle>
                        <DialogDescription className="text-primary-foreground/80">
                            Secure your spot in this exclusive training program.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {fieldsToRender.map((field, idx) => {
                            const fieldId = field.label;
                            return (
                                <div key={idx} className="space-y-1.5 group">
                                    <Label htmlFor={fieldId} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1 group-focus-within:text-primary transition-colors">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </Label>
                                    {field.type === 'textarea' ? (
                                        <Textarea
                                            id={fieldId}
                                            placeholder={`Enter ${field.label}`}
                                            value={formData[fieldId] || ""}
                                            onChange={(e) => handleInputChange(fieldId, e.target.value)}
                                            required={field.required}
                                            className="min-h-[100px] resize-none bg-secondary/30 border-border/50 focus:bg-background transition-all rounded-xl focus:ring-primary/20"
                                        />
                                    ) : field.type === 'select' ? (
                                        <div className="relative">
                                            <select
                                                className="flex h-11 w-full rounded-xl border border-border/50 bg-secondary/30 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:bg-secondary/50 focus:bg-background"
                                                value={formData[fieldId] || ""}
                                                onChange={(e) => handleInputChange(fieldId, e.target.value)}
                                                required={field.required}
                                            >
                                                <option value="">Select {field.label}</option>
                                                {(Array.isArray(field.options) ? field.options : (field.options || "").split(',')).map((opt: string, i: number) => (
                                                    <option key={i} value={opt.trim()}>{opt.trim()}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : (
                                        <Input
                                            id={fieldId}
                                            type={field.type}
                                            placeholder={`Enter ${field.label}`}
                                            value={formData[fieldId] || ""}
                                            onChange={(e) => handleInputChange(fieldId, e.target.value)}
                                            required={field.required}
                                            className="h-11 bg-secondary/30 border-border/50 focus:bg-background transition-all rounded-xl focus:ring-primary/20"
                                        />
                                    )}
                                </div>
                            );
                        })}

                        <DialogFooter className="pt-6 sm:justify-between gap-4">
                            <Button type="button" variant="ghost" onClick={onClose} className="rounded-full hover:bg-secondary text-muted-foreground">Cancel</Button>
                            <Button type="submit" disabled={loading} className="rounded-full w-full sm:w-auto px-8 bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/25 transition-all duration-300">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Complete Registration
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TrainingRegistrationModal;
