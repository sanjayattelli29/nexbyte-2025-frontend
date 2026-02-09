import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Loader2, Eye, EyeOff, Plus, X, Pencil, ExternalLink, Video } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const WebinarManager = () => {
    const [webinars, setWebinars] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [newCategory, setNewCategory] = useState("");

    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        youtubeLink: "",
        resourceLink: "", // Google Drive Link
        category: "",
        description: ""
    });

    useEffect(() => {
        fetchCategories();
        fetchWebinars();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/webinars/categories?includeHidden=true`);
            const data = await response.json();
            if (data.success) setCategories(data.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchWebinars = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/webinars?sortBy=latest&includeHidden=true`);
            const data = await response.json();
            if (data.success) setWebinars(data.data);
        } catch (error) {
            console.error("Error fetching webinars:", error);
            toast.error("Failed to load webinars");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleVisibility = async (id: string, currentStatus: boolean, title: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/webinars/${id}/visibility`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isHidden: !currentStatus })
            });
            const data = await response.json();
            if (data.success) {
                toast.success(currentStatus ? `${title} Now Visible` : `${title} Hidden`);
                fetchWebinars();
            } else {
                toast.error("Failed to update visibility");
            }
        } catch (error) {
            toast.error("Error updating visibility");
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategory.trim()) return;
        setIsCreatingCategory(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/webinars/categories`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newCategory })
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Category created");
                setNewCategory("");
                fetchCategories();
            } else {
                toast.error(data.message || "Failed to create category");
            }
        } catch (error) {
            toast.error("Error creating category");
        } finally {
            setIsCreatingCategory(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Delete this category?")) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/webinars/categories/${id}`, { method: "DELETE" });
            if (response.ok) {
                toast.success("Category deleted");
                fetchCategories();
            } else {
                toast.error("Failed to delete category");
            }
        } catch (error) {
            toast.error("Error deleting category");
        }
    };

    const toggleCategoryVisibility = async (id: string, currentStatus: boolean) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/webinars/categories/${id}/visibility`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isHidden: !currentStatus })
            });
            if (response.ok) {
                toast.success(currentStatus ? "Category Unhidden" : "Category Hidden");
                fetchCategories();
            }
        } catch (error) {
            toast.error("Error updating visibility");
        }
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.date || !formData.youtubeLink) {
            return toast.error("Title, Date, and YouTube Link are required");
        }

        try {
            const url = editingId
                ? `${API_BASE_URL}/api/webinars/${editingId}`
                : `${API_BASE_URL}/api/webinars`;
            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (data.success) {
                toast.success(editingId ? "Webinar Updated" : "Webinar Created");
                setFormData({ title: "", date: "", youtubeLink: "", resourceLink: "", category: "", description: "" });
                setEditingId(null);
                fetchWebinars();
            } else {
                toast.error(data.message || "Operation failed");
            }
        } catch (error) {
            toast.error("Error saving webinar");
        }
    };

    const handleEdit = (webinar: any) => {
        setEditingId(webinar._id);
        setFormData({
            title: webinar.title,
            date: webinar.date ? new Date(webinar.date).toISOString().split('T')[0] : "",
            youtubeLink: webinar.youtubeLink,
            resourceLink: webinar.resourceLink || "",
            category: webinar.category || "",
            description: webinar.description || ""
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this webinar?")) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/webinars/${id}`, { method: "DELETE" });
            if (response.ok) {
                toast.success("Webinar deleted");
                fetchWebinars();
            }
        } catch (error) {
            toast.error("Error deleting webinar");
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Section */}
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>{editingId ? "Edit Webinar" : "Add New Webinar"}</CardTitle>
                        <CardDescription>Manage your training sessions and webinars</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Category Management */}
                        <div className="bg-gray-50 p-3 rounded-md border border-gray-100 mb-2">
                            <Label className="text-xs text-gray-500 mb-1.5 block">Manage Categories</Label>
                            <div className="flex gap-2 mb-2">
                                <Input
                                    placeholder="New Category"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="h-8 text-xs bg-white"
                                />
                                <Button size="sm" onClick={handleCreateCategory} disabled={isCreatingCategory || !newCategory.trim()} className="h-8">
                                    {isCreatingCategory ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                                {categories.map(cat => (
                                    <div key={cat._id} className={`text-xs bg-white border px-2 py-1 rounded flex items-center gap-2 group ${cat.isHidden ? 'opacity-60 border-dashed' : ''}`}>
                                        {cat.name}
                                        <div className="flex gap-1 items-center ml-2 border-l pl-2">
                                            <button onClick={() => toggleCategoryVisibility(cat._id, cat.isHidden)} className="text-gray-400 hover:text-blue-600">
                                                {cat.isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                            </button>
                                            <button onClick={() => handleDeleteCategory(cat._id)} className="text-red-400 hover:text-red-600">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Webinar Fields */}
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Webinar Title" />
                        </div>

                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        </div>

                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={formData.category} onValueChange={val => setFormData({ ...formData, category: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat._id} value={cat.name}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>YouTube Link</Label>
                            <div className="relative">
                                <Video className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-8" value={formData.youtubeLink} onChange={e => setFormData({ ...formData, youtubeLink: e.target.value })} placeholder="https://youtube.com/..." />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Resource Link (Optional)</Label>
                            <div className="relative">
                                <ExternalLink className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-8" value={formData.resourceLink} onChange={e => setFormData({ ...formData, resourceLink: e.target.value })} placeholder="Google Drive / Docs Link" />
                            </div>
                            <p className="text-[10px] text-muted-foreground">If valid, a "Download/View" button will appear. If empty, "Coming Soon" will be shown.</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description..." />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button className="flex-1" onClick={handleSubmit}>
                                {editingId ? "Update Webinar (Hidden by Default)" : "Create Webinar (Hidden by Default)"}
                            </Button>
                            {editingId && (
                                <Button variant="outline" onClick={() => { setEditingId(null); setFormData({ title: "", date: "", youtubeLink: "", resourceLink: "", category: "", description: "" }); }}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* List Section */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Existing Webinars ({webinars.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                        ) : webinars.length === 0 ? (
                            <div className="text-center p-8 text-muted-foreground">No webinars found. Create one to get started.</div>
                        ) : (
                            <div className="space-y-4">
                                {webinars.map(webinar => (
                                    <div key={webinar._id} className={`flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:border-blue-200 transition-colors bg-white ${webinar.isHidden ? 'opacity-70 border-dashed border-gray-300' : ''}`}>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className="text-xs font-normal">{webinar.category || "Uncategorized"}</Badge>
                                                <span className="text-xs text-muted-foreground">{new Date(webinar.date).toLocaleDateString()}</span>
                                                {webinar.isHidden && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded border border-yellow-200">Hidden</span>}
                                            </div>
                                            <h3 className="font-semibold text-lg">{webinar.title}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{webinar.description}</p>

                                            <div className="flex gap-4 mt-3 text-xs text-blue-600">
                                                <a href={webinar.youtubeLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                                                    <Video className="w-3 h-3" /> Watch Video
                                                </a>
                                                {webinar.resourceLink && (
                                                    <a href={webinar.resourceLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                                                        <ExternalLink className="w-3 h-3" /> View Resource
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex sm:flex-col gap-2 justify-center border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-3 mt-3 sm:mt-0">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className={`h-8 w-full justify-start ${webinar.isHidden ? "text-gray-500" : "text-green-600"}`}
                                                onClick={() => handleToggleVisibility(webinar._id, webinar.isHidden, webinar.title)}
                                            >
                                                {webinar.isHidden ? <EyeOff className="w-3 h-3 mr-2" /> : <Eye className="w-3 h-3 mr-2" />}
                                                {webinar.isHidden ? "Hidden" : "Visible"}
                                            </Button>
                                            <Button size="sm" variant="ghost" className="h-8 w-full justify-start" onClick={() => handleEdit(webinar)}>
                                                <Pencil className="w-3 h-3 mr-2" /> Edit
                                            </Button>
                                            <Button size="sm" variant="ghost" className="h-8 w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(webinar._id)}>
                                                <Trash2 className="w-3 h-3 mr-2" /> Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default WebinarManager;
