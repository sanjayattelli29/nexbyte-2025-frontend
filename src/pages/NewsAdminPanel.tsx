import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { IKContext, IKImage, IKUpload } from "imagekitio-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Pencil, Plus, Image as ImageIcon, Loader2, ArrowUp, ArrowDown, Eye, EyeOff, ExternalLink, Link as LinkIcon, MapPin, Phone, Mail, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// ImageKit Config
const IK_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const IK_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

const NewsAdminPanel = () => {
    const authenticator = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/imagekit-auth`);
            if (!response.ok) throw new Error("Authentication failed");
            return await response.json();
        } catch (error) {
            throw new Error(`Authentication request failed: ${error}`);
        }
    };

    const [activeTab, setActiveTab] = useState("ads");
    const [loading, setLoading] = useState(false);

    // --- DATA STATES ---
    const [categories, setCategories] = useState<any[]>([]);
    const [ads, setAds] = useState<any[]>([]);

    // --- CATEGORY STATE ---
    const [newCategoryName, setNewCategoryName] = useState("");

    // --- AD FORM STATE ---
    const [isEditingAd, setIsEditingAd] = useState<string | null>(null);
    const [adForm, setAdForm] = useState({
        title: "",
        description: "", // Detailed description
        shortDescription: "", // For card
        category: "",
        slug: "",
        images: [] as string[], // Array of image paths
        highlights: [] as string[], // Array of strings
        externalLinks: [] as { label: string, url: string }[],
        hotNews: "",
        homepageVisible: false,
        colorPalette: "palette-1", // palette-1, palette-2, palette-3
        themeMode: "dark", // dark, light
        socialLinks: {
            facebook: "",
            twitter: "",
            instagram: "",
            whatsapp: "",
            linkedin: "",
            youtube: ""
        },
        contactDetails: {
            phone: "",
            email: "",
            address: "",
            mapLink: ""
        }
    });
    const [uploading, setUploading] = useState(false);

    // Helpers for Arrays
    const addHighlight = () => setAdForm({ ...adForm, highlights: [...adForm.highlights, ""] });
    const updateHighlight = (idx: number, val: string) => {
        const updated = [...adForm.highlights];
        updated[idx] = val;
        setAdForm({ ...adForm, highlights: updated });
    };
    const removeHighlight = (idx: number) => {
        const updated = [...adForm.highlights];
        updated.splice(idx, 1);
        setAdForm({ ...adForm, highlights: updated });
    };

    const addLink = () => setAdForm({ ...adForm, externalLinks: [...adForm.externalLinks, { label: "", url: "" }] });
    const updateLink = (idx: number, field: 'label' | 'url', val: string) => {
        const updated = [...adForm.externalLinks];
        updated[idx] = { ...updated[idx], [field]: val };
        setAdForm({ ...adForm, externalLinks: updated });
    };
    const removeLink = (idx: number) => {
        const updated = [...adForm.externalLinks];
        updated.splice(idx, 1);
        setAdForm({ ...adForm, externalLinks: updated });
    };

    const removeImage = (idx: number) => {
        const updated = [...adForm.images];
        updated.splice(idx, 1);
        setAdForm({ ...adForm, images: updated });
    }

    // --- FETCH DATA ---
    useEffect(() => {
        fetchCategories();
        fetchAds();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/news/categories`);
            const data = await res.json();
            if (data.success) setCategories(data.data);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    const fetchAds = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/news/ads`);
            const data = await res.json();
            if (data.success) setAds(data.data);
        } catch (error) {
            console.error("Error fetching ads", error);
        }
    };

    // --- CATEGORY HANDLERS ---
    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/news/categories`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newCategoryName })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Category added");
                setNewCategoryName("");
                fetchCategories();
            }
        } catch (error) {
            toast.error("Error adding category");
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Delete category?")) return;
        try {
            await fetch(`${API_BASE_URL}/api/news/categories/${id}`, { method: "DELETE" });
            toast.success("Category deleted");
            fetchCategories();
        } catch (error) {
            toast.error("Error deleting category");
        }
    };

    const moveCategory = async (index: number, direction: 'up' | 'down') => {
        const newCategories = [...categories];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        if (swapIndex < 0 || swapIndex >= newCategories.length) return;

        // Swap order values
        const tempOrder = newCategories[index].order;
        newCategories[index].order = newCategories[swapIndex].order;
        newCategories[swapIndex].order = tempOrder;

        // Update local state temporarily for visual feedback
        // Sort by order to reflect swap
        const reordered = newCategories.sort((a, b) => a.order - b.order);
        // Actually, logic above swaps *values*. 
        // Simpler: Just swap the items in array and re-assign orders based on index.

        const items = [...categories];
        const itemToMove = items[index];
        items.splice(index, 1);
        items.splice(swapIndex, 0, itemToMove);

        // Reassign orders
        const updatedItems = items.map((cat, idx) => ({ _id: cat._id, order: idx }));

        try {
            await fetch(`${API_BASE_URL}/api/news/categories/reorder`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ categories: updatedItems })
            });
            fetchCategories(); // Refresh from server
        } catch (error) {
            toast.error("Error reordering");
        }
    };


    // --- AD HANDLERS ---
    const handleUploadSuccess = (res: any) => {
        setUploading(false);
        if (adForm.images.length >= 3) {
            toast.error("Max 3 images allowed");
            return;
        }
        setAdForm({ ...adForm, images: [...adForm.images, res.filePath] });
        toast.success("Image uploaded");
    };

    const handleUploadError = () => {
        setUploading(false);
        toast.error("Upload failed");
    };

    const handleSubmitAd = async () => {
        // Validation
        if (!adForm.title || !adForm.slug || !adForm.category) {
            return toast.error("Title, Slug, and Category are required");
        }
        if (adForm.images.length === 0) {
            return toast.error("At least one image is required");
        }

        const url = isEditingAd
            ? `${API_BASE_URL}/api/news/ads/${isEditingAd}`
            : `${API_BASE_URL}/api/news/ads`;
        const method = isEditingAd ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(adForm)
            });
            const data = await res.json();
            if (data.success) {
                toast.success(isEditingAd ? "Ad Updated" : "Ad Created");
                fetchAds();
                resetForm();
            } else {
                toast.error(data.message || "Operation failed");
            }
        } catch (error) {
            toast.error("Error submitting ad");
        }
    };

    const handleEditAd = (ad: any) => {
        setIsEditingAd(ad._id);
        setAdForm({
            title: ad.title || "",
            description: ad.description || "",
            shortDescription: ad.shortDescription || "",
            category: ad.category || "",
            slug: ad.slug || "",
            images: ad.images || [],
            highlights: ad.highlights || [],
            externalLinks: ad.externalLinks || [],
            hotNews: ad.hotNews || "",
            homepageVisible: ad.homepageVisible || false,
            colorPalette: ad.colorPalette || "palette-1",
            themeMode: ad.themeMode || "dark",
            socialLinks: {
                facebook: ad.socialLinks?.facebook || "",
                twitter: ad.socialLinks?.twitter || "",
                instagram: ad.socialLinks?.instagram || "",
                whatsapp: ad.socialLinks?.whatsapp || "",
                linkedin: ad.socialLinks?.linkedin || "",
                youtube: ad.socialLinks?.youtube || ""
            },
            contactDetails: {
                phone: ad.contactDetails?.phone || "",
                email: ad.contactDetails?.email || "",
                address: ad.contactDetails?.address || "",
                mapLink: ad.contactDetails?.mapLink || ""
            }
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteAd = async (id: string) => {
        if (!confirm("Delete this ad?")) return;
        try {
            await fetch(`${API_BASE_URL}/api/news/ads/${id}`, { method: "DELETE" });
            toast.success("Ad Deleted");
            fetchAds();
        } catch (error) {
            toast.error("Error deleting ad");
        }
    };

    const toggleAdVisibility = async (ad: any) => {
        try {
            // If isVisible is undefined, it means it's true (default). So toggle to false.
            // If isVisible is false, toggle to true.
            const newVisibility = ad.isVisible === false ? true : false;

            const res = await fetch(`${API_BASE_URL}/api/news/ads/${ad._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isVisible: newVisibility })
            });

            if (res.ok) {
                toast.success(newVisibility ? "Ad Visualized" : "Ad Hidden");
                fetchAds();
            } else {
                toast.error("Failed to toggle visibility");
            }
        } catch (error) {
            toast.error("Error updating visibility");
        }
    };

    const resetForm = () => {
        setIsEditingAd(null);
        setAdForm({
            title: "", description: "", shortDescription: "", category: "", slug: "",
            images: [], highlights: [], externalLinks: [], hotNews: "",
            homepageVisible: false, colorPalette: "palette-1", themeMode: "dark",
            socialLinks: { facebook: "", twitter: "", instagram: "", whatsapp: "", linkedin: "", youtube: "" },
            contactDetails: { phone: "", email: "", address: "", mapLink: "" }
        });
    }

    return (
        <IKContext
            publicKey={IK_PUBLIC_KEY}
            urlEndpoint={IK_URL_ENDPOINT}
            authenticator={authenticator}
        >
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Premium Ads Manager</h2>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="ads">Manage Ads</TabsTrigger>
                        <TabsTrigger value="categories">Categories</TabsTrigger>
                    </TabsList>

                    {/* --- ADS TAB --- */}
                    <TabsContent value="ads" className="space-y-6">
                        {/* AD FORM */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{isEditingAd ? "Edit Ad" : "Create New Ad"}</CardTitle>
                                <CardDescription>Design your premium ad content</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input value={adForm.title} onChange={e => setAdForm({ ...adForm, title: e.target.value })} placeholder="Ad Title" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Slug (URL)</Label>
                                        <Input value={adForm.slug} onChange={e => setAdForm({ ...adForm, slug: e.target.value })} placeholder="ex: titan-watch-offer" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Select value={adForm.category} onValueChange={val => setAdForm({ ...adForm, category: val })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map(cat => <SelectItem key={cat._id} value={cat.name}>{cat.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Color Palette</Label>
                                        <Select value={adForm.colorPalette} onValueChange={val => setAdForm({ ...adForm, colorPalette: val })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Theme" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="palette-1">Palette 1 (Gold/Dark)</SelectItem>
                                                <SelectItem value="palette-2">Palette 2 (Blue/Clean)</SelectItem>
                                                <SelectItem value="palette-3">Palette 3 (Vibrant/Modern)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Background Theme</Label>
                                        <div className="flex bg-gray-100 p-1 rounded-md border">
                                            <button
                                                type="button"
                                                onClick={() => setAdForm({ ...adForm, themeMode: "dark" })}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-sm text-sm font-medium transition-all ${adForm.themeMode === "dark" ? "bg-black text-white shadow-sm" : "text-gray-500 hover:text-black"}`}
                                            >
                                                <Moon className="w-4 h-4" /> Dark
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setAdForm({ ...adForm, themeMode: "light" })}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-sm text-sm font-medium transition-all ${adForm.themeMode === "light" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"}`}
                                            >
                                                <Sun className="w-4 h-4" /> Light
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Short Description (For Cards)</Label>
                                    <Input value={adForm.shortDescription} onChange={e => setAdForm({ ...adForm, shortDescription: e.target.value })} placeholder="Brief summary for list view" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Detailed Description</Label>
                                    <Textarea value={adForm.description} onChange={e => setAdForm({ ...adForm, description: e.target.value })} placeholder="Full details..." className="min-h-[100px]" />
                                </div>

                                {/* IMAGES */}
                                <div className="space-y-2">
                                    <Label>Images (Max 3) - First is Main Image</Label>
                                    <div className="grid grid-cols-4 gap-4">
                                        {adForm.images.map((img, idx) => (
                                            <div key={idx} className="relative group aspect-square bg-gray-100 rounded-md overflow-hidden">
                                                <IKImage path={img} transformation={[{ height: "150", width: "150" }]} className="object-cover w-full h-full" />
                                                <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                {idx === 0 && <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">Main</span>}
                                            </div>
                                        ))}
                                        {adForm.images.length < 3 && (
                                            <div className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-50 relative">
                                                <IKUpload
                                                    fileName="ad-image.jpg"
                                                    tags={["ad-image"]}
                                                    useUniqueFileName={true}
                                                    onError={handleUploadError}
                                                    onSuccess={handleUploadSuccess}
                                                    onUploadStart={() => setUploading(true)}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                {uploading ? <Loader2 className="w-6 h-6 animate-spin text-gray-400" /> : <Plus className="w-6 h-6 text-gray-400" />}
                                                <span className="text-xs text-gray-500 mt-2">Upload</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* HIGHLIGHTS */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label>Highlights / Bullet Points</Label>
                                        <Button type="button" variant="outline" size="sm" onClick={addHighlight}><Plus className="w-3 h-3 mr-1" /> Add</Button>
                                    </div>
                                    {adForm.highlights.map((hl, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <Input value={hl} onChange={e => updateHighlight(idx, e.target.value)} placeholder="• Highlight feature..." />
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeHighlight(idx)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                        </div>
                                    ))}
                                </div>

                                {/* LINKS */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label>External Links / CTAs</Label>
                                        <Button type="button" variant="outline" size="sm" onClick={addLink}><Plus className="w-3 h-3 mr-1" /> Add</Button>
                                    </div>
                                    {adForm.externalLinks.map((link, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <Input value={link.label} onChange={e => updateLink(idx, 'label', e.target.value)} placeholder="Button Label" className="w-1/3" />
                                            <Input value={link.url} onChange={e => updateLink(idx, 'url', e.target.value)} placeholder="https://..." className="flex-1" />
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeLink(idx)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                        </div>
                                    ))}
                                </div>

                                {/* SOCIAL LINKS */}
                                <div className="space-y-4 border p-4 rounded-md bg-gray-50/50">
                                    <Label className="text-base font-semibold">Social Media Links (Optional)</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Facebook</Label>
                                            <Input
                                                value={adForm.socialLinks.facebook}
                                                onChange={e => setAdForm({ ...adForm, socialLinks: { ...adForm.socialLinks, facebook: e.target.value } })}
                                                placeholder="Facebook URL"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Twitter (X)</Label>
                                            <Input
                                                value={adForm.socialLinks.twitter}
                                                onChange={e => setAdForm({ ...adForm, socialLinks: { ...adForm.socialLinks, twitter: e.target.value } })}
                                                placeholder="Twitter URL"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Instagram</Label>
                                            <Input
                                                value={adForm.socialLinks.instagram}
                                                onChange={e => setAdForm({ ...adForm, socialLinks: { ...adForm.socialLinks, instagram: e.target.value } })}
                                                placeholder="Instagram URL"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>WhatsApp</Label>
                                            <Input
                                                value={adForm.socialLinks.whatsapp}
                                                onChange={e => setAdForm({ ...adForm, socialLinks: { ...adForm.socialLinks, whatsapp: e.target.value } })}
                                                placeholder="WhatsApp Number/Link"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>LinkedIn</Label>
                                            <Input
                                                value={adForm.socialLinks.linkedin}
                                                onChange={e => setAdForm({ ...adForm, socialLinks: { ...adForm.socialLinks, linkedin: e.target.value } })}
                                                placeholder="LinkedIn URL"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>YouTube</Label>
                                            <Input
                                                value={adForm.socialLinks.youtube}
                                                onChange={e => setAdForm({ ...adForm, socialLinks: { ...adForm.socialLinks, youtube: e.target.value } })}
                                                placeholder="YouTube URL"
                                            />
                                        </div>
                                    </div>
                                </div>


                                {/* CONTACT DETAILS */}
                                <div className="space-y-4 border p-4 rounded-md bg-gray-50/50">
                                    <Label className="text-base font-semibold">Contact Details (Optional)</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    className="pl-8"
                                                    value={adForm.contactDetails.phone}
                                                    onChange={e => setAdForm({ ...adForm, contactDetails: { ...adForm.contactDetails, phone: e.target.value } })}
                                                    placeholder="+91 9876543210"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    className="pl-8"
                                                    value={adForm.contactDetails.email}
                                                    onChange={e => setAdForm({ ...adForm, contactDetails: { ...adForm.contactDetails, email: e.target.value } })}
                                                    placeholder="info@example.com"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Location / Address</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    className="pl-8"
                                                    value={adForm.contactDetails.address}
                                                    onChange={e => setAdForm({ ...adForm, contactDetails: { ...adForm.contactDetails, address: e.target.value } })}
                                                    placeholder="Store Address / City"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Google Maps Link</Label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    className="pl-8"
                                                    value={adForm.contactDetails.mapLink}
                                                    onChange={e => setAdForm({ ...adForm, contactDetails: { ...adForm.contactDetails, mapLink: e.target.value } })}
                                                    placeholder="https://maps.google.com/..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Hot News / Update Banner Text</Label>
                                    <Input value={adForm.hotNews} onChange={e => setAdForm({ ...adForm, hotNews: e.target.value })} placeholder="e.g., 'Limited Time Offer!'" />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox id="homepage" checked={adForm.homepageVisible} onCheckedChange={(checked) => setAdForm({ ...adForm, homepageVisible: checked as boolean })} />
                                    <Label htmlFor="homepage">Show in Homepage Premium Showcase</Label>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button onClick={handleSubmitAd} disabled={uploading}>
                                        {uploading ? "Uploading..." : (isEditingAd ? "Update Ad" : "Create Ad")}
                                    </Button>
                                    {isEditingAd && <Button variant="outline" onClick={resetForm}>Cancel</Button>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* ADS TABLE */}
                        <Card>
                            <CardHeader><CardTitle>Existing Ads</CardTitle></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Image</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {ads.map(ad => (
                                            <TableRow key={ad._id} className={!ad.isVisible ? "opacity-50 grayscale" : ""}>
                                                <TableCell>
                                                    {ad.images?.[0] && (
                                                        <IKImage path={ad.images[0]} transformation={[{ height: "40", width: "40" }]} className="w-10 h-10 rounded object-cover" />
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">{ad.title}</TableCell>
                                                <TableCell>{ad.category}</TableCell>
                                                <TableCell>{ad.homepageVisible ? "Featured" : "Standard"}</TableCell>
                                                <TableCell className="flex gap-2">
                                                    <Button size="sm" variant={ad.isVisible === false ? "secondary" : "ghost"} onClick={() => toggleAdVisibility(ad)}>
                                                        {ad.isVisible === false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => handleEditAd(ad)}><Pencil className="w-4 h-4" /></Button>
                                                    <Button size="sm" variant="destructive" onClick={() => handleDeleteAd(ad._id)}><Trash2 className="w-4 h-4" /></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {ads.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-4">No ads found</TableCell></TableRow>}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- CATEGORIES TAB --- */}
                    <TabsContent value="categories" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Manage Categories</CardTitle>
                                <CardDescription>Drag and drop support via Reorder buttons</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex gap-2">
                                    <Input value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="New Category Name" />
                                    <Button onClick={handleAddCategory}>Add Category</Button>
                                </div>

                                <div className="space-y-2">
                                    {categories.map((cat, index) => (
                                        <div key={cat._id} className="flex items-center justify-between p-3 bg-white border rounded shadow-sm">
                                            <span className="font-medium">{cat.name}</span>
                                            <div className="flex items-center gap-2">
                                                <Button size="icon" variant="ghost" disabled={index === 0} onClick={() => moveCategory(index, 'up')}>
                                                    <ArrowUp className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" disabled={index === categories.length - 1} onClick={() => moveCategory(index, 'down')}>
                                                    <ArrowDown className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDeleteCategory(cat._id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </IKContext >
    );
};

export default NewsAdminPanel;
