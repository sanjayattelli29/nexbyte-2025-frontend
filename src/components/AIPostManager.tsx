import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { IKContext, IKImage, IKUpload } from "imagekitio-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Image as ImageIcon, Loader2, Eye, EyeOff, MessageSquare, MessageSquareOff, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Tag, Pencil } from "lucide-react";

// ImageKit Config
const IK_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const IK_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

const AIPostManager = () => {
    const authenticator = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/imagekit-auth`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }
            const data = await response.json();
            const { signature, expire, token } = data;
            return { signature, expire, token };
        } catch (error) {
            throw new Error(`Authentication request failed: ${error.message}`);
        }
    };

    const [posts, setPosts] = useState<any[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState("latest");

    // Filter State
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [adminSelectedCategory, setAdminSelectedCategory] = useState("All");

    // Form State
    const [newPost, setNewPost] = useState({
        content: "",
        image: null as string | null,
        category: "",
    });
    const [uploading, setUploading] = useState(false);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);

    // Category State
    const [categories, setCategories] = useState<any[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);

    useEffect(() => {
        fetchPosts();
        fetchCategories();
    }, [sortBy, adminSelectedCategory]);

    useEffect(() => {
        if (!date) {
            setFilteredPosts(posts);
        } else {
            const selectedDateStr = date.toDateString();
            setFilteredPosts(posts.filter(p => new Date(p.createdAt).toDateString() === selectedDateStr));
        }
    }, [date, posts]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            // Use Admin endpoint to get ALL posts (including hidden)
            let url = `${API_BASE_URL}/api/admin/ai-posts?sort=${sortBy}`;
            if (adminSelectedCategory && adminSelectedCategory !== "All") {
                url += `&category=${encodeURIComponent(adminSelectedCategory)}`;
            }
            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setPosts(data.data);
                setFilteredPosts(data.data);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            toast.error("Failed to load posts");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            // Admin needs to see ALL categories, including hidden ones
            const response = await fetch(`${API_BASE_URL}/api/ai-categories?includeHidden=true`);
            const data = await response.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategory.trim()) return;
        setIsCreatingCategory(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai-categories`, {
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
            const response = await fetch(`${API_BASE_URL}/api/ai-categories/${id}`, {
                method: "DELETE"
            });
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
            const response = await fetch(`${API_BASE_URL}/api/ai-categories/${id}/visibility`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isHidden: !currentStatus })
            });
            if (response.ok) {
                toast.success(currentStatus ? "Category Unhidden" : "Category Hidden");
                fetchCategories();
                fetchPosts(); // Refresh posts as their visibility might depend on category
            } else {
                toast.error("Failed to update category visibility");
            }
        } catch (error) {
            toast.error("Error updating category visibility");
        }
    };

    const handleUploadError = (err: any) => {
        setUploading(false);
        toast.error("Image upload failed");
    };

    const handleUploadSuccess = (res: any) => {
        setUploading(false);
        setNewPost({ ...newPost, image: res.filePath });
        toast.success("Image uploaded successfully");
    };

    const handleCreatePost = async () => {
        if (!newPost.content && !newPost.image) {
            return toast.error("Please add text or an image");
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/ai-posts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPost)
            });
            const data = await response.json();

            if (data.success) {
                toast.success("Post created successfully!");
                setNewPost({ content: "", image: null, category: "" });
                fetchPosts();
            } else {
                toast.error("Failed to create post");
            }
        } catch (error) {
            toast.error("Error creating post");
        }
    };

    const handleEditClick = (post: any) => {
        setNewPost({
            content: post.content || "",
            image: post.image || null,
            category: post.category || ""
        });
        setEditingPostId(post._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setNewPost({ content: "", image: null, category: "" });
        setEditingPostId(null);
    };

    const handleUpdatePost = async () => {
        if (!editingPostId) return;
        if (!newPost.content && !newPost.image) {
            return toast.error("Please add text or an image");
        }

        setUploading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai-posts/${editingPostId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: 'edit',
                    payload: newPost
                })
            });
            const data = await response.json();

            if (data.success) {
                toast.success("Post updated successfully!");
                handleCancelEdit();
                fetchPosts();
            } else {
                toast.error("Failed to update post");
            }
        } catch (error) {
            toast.error("Error updating post");
        } finally {
            setUploading(false);
        }
    };

    const handleDeletePost = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai-posts/${id}`, {
                method: "DELETE"
            });
            if (response.ok) {
                toast.success("Post deleted");
                fetchPosts();
            } else {
                toast.error("Failed to delete post");
            }
        } catch (error) {
            toast.error("Error deleting post");
        }
    };

    const toggleVisibility = async (id: string, currentStatus: boolean) => {
        try {
            await fetch(`${API_BASE_URL}/api/ai-posts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "visibility", payload: { isHidden: !currentStatus } })
            });
            toast.success(currentStatus ? "Post is now visible" : "Post hidden");
            fetchPosts(); // Refresh to update UI state properly
        } catch (error) {
            toast.error("Error updating visibility");
        }
    };

    const toggleComments = async (id: string, currentStatus: boolean) => {
        try {
            await fetch(`${API_BASE_URL}/api/ai-posts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "comments-toggle", payload: { commentsHidden: !currentStatus } })
            });
            toast.success(currentStatus ? "Comments enabled" : "Comments disabled");
            fetchPosts();
        } catch (error) {
            toast.error("Error updating comment settings");
        }
    };

    return (
        <IKContext
            publicKey={IK_PUBLIC_KEY}
            urlEndpoint={IK_URL_ENDPOINT}
            authenticator={authenticator}
        >
            <div className="space-y-6">
                {/* Create Post Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1 h-fit">
                        <CardHeader>
                            <CardTitle>{editingPostId ? "Edit Post" : "Create New AI Post"}</CardTitle>
                            <CardDescription>{editingPostId ? "Modify your existing post" : "Share AI updates with the community"}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            {/* Category Creation (Embedded) */}
                            <div className="bg-gray-50 p-3 rounded-md border border-gray-100 mb-2">
                                <Label className="text-xs text-gray-500 mb-1.5 block">Add New Category</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="New Category Name"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        className="h-8 text-xs bg-white"
                                    />
                                    <Button size="sm" onClick={handleCreateCategory} disabled={isCreatingCategory || !newCategory.trim()} className="h-8">
                                        {isCreatingCategory ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                                    </Button>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {categories.map(cat => (
                                        <div key={cat._id} className={`text-xs bg-white border px-2 py-1 rounded flex items-center gap-2 group ${cat.isHidden ? 'opacity-60 border-dashed border-gray-400' : ''}`}>
                                            {cat.name}
                                            <div className="flex gap-1 items-center ml-2 border-l pl-2 border-gray-200">
                                                <button onClick={() => toggleCategoryVisibility(cat._id, cat.isHidden)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded" title={cat.isHidden ? "Unhide Category" : "Hide Category"}>
                                                    {cat.isHidden ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                                <button onClick={() => handleDeleteCategory(cat._id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded" title="Delete Category">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Category Selection */}
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select
                                    value={newPost.category}
                                    onValueChange={(val) => setNewPost({ ...newPost, category: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat._id} value={cat.name}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Post Content</Label>
                                <Textarea
                                    placeholder="What's new in AI?"
                                    value={newPost.content}
                                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Image (Optional)</Label>
                                <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
                                    <IKUpload
                                        fileName="custom-ai-post-image.jpg"
                                        tags={["ai-post"]}
                                        useUniqueFileName={true}
                                        responseFields={["tags"]}
                                        onError={handleUploadError}
                                        onSuccess={handleUploadSuccess}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onUploadStart={() => setUploading(true)}
                                    />
                                    <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">
                                        {newPost.image ? "Image Selected" : "Click to upload image"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button onClick={editingPostId ? handleUpdatePost : handleCreatePost} className="flex-1" disabled={uploading}>
                                    {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingPostId ? "Update Post" : "Post Update")}
                                </Button>
                                {editingPostId && (
                                    <Button variant="outline" onClick={handleCancelEdit} disabled={uploading}>
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Posts List Section */}
                    <div className="lg:col-span-2">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                            <h2 className="text-xl font-bold">Recent AI Posts ({filteredPosts.length})</h2>
                            <div className="flex items-center gap-2">
                                {/* Category Filter */}
                                <Select
                                    value={adminSelectedCategory}
                                    onValueChange={setAdminSelectedCategory}
                                >
                                    <SelectTrigger className="w-[180px] h-9 text-xs">
                                        <SelectValue placeholder="Filter Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Categories</SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat._id} value={cat.name}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Sorting Toggle */}
                                <div className="flex items-center bg-gray-100/50 p-1 rounded-md border border-gray-200">
                                    <button
                                        onClick={() => setSortBy("latest")}
                                        className={`px-3 py-1 text-xs font-medium rounded transition-all ${sortBy === "latest" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-900"
                                            }`}
                                    >
                                        Latest
                                    </button>
                                    <button
                                        onClick={() => setSortBy("popular")}
                                        className={`px-3 py-1 text-xs font-medium rounded transition-all ${sortBy === "popular" ? "bg-white shadow-sm text-orange-600" : "text-gray-500 hover:text-gray-900"
                                            }`}
                                    >
                                        Trending
                                    </button>
                                </div>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={`w-[180px] h-9 justify-start text-left font-normal text-xs ${!date && "text-muted-foreground"}`}>
                                            <Calendar className="mr-2 h-3.5 w-3.5" />
                                            {date ? date.toDateString() : <span>Filter by Date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <CalendarComponent
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {date && (
                                    <Button variant="ghost" size="sm" onClick={() => setDate(undefined)} className="h-9 w-9 p-0"><X className="h-4 w-4" /></Button>
                                )}
                            </div>
                        </div>

                        {/* COMPACT GRID: 3 columns on lg+ */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPosts.map((post) => (
                                <Card key={post._id} className={`overflow-hidden flex flex-col ${post.isHidden ? 'opacity-60 bg-gray-50 border-dashed' : ''}`}>
                                    {/* Compact Image */}
                                    {post.image && (
                                        <div className="w-full h-32 bg-gray-100 overflow-hidden relative group">
                                            <IKImage
                                                path={post.image}
                                                transformation={[{ height: "300", width: "300" }]}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                            {post.isHidden && (
                                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                                    <EyeOff className="text-white/80 h-8 w-8" />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <CardContent className="p-3 flex-1 flex flex-col">
                                        {/* Date */}
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-[10px] text-gray-500 font-mono">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </p>
                                            {post.isHidden && <span className="text-[10px] uppercase font-bold text-gray-500 border border-gray-300 px-1 rounded">Hidden</span>}
                                            {post.category && (
                                                <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium border border-blue-100">
                                                    {post.category}
                                                </span>
                                            )}
                                        </div>

                                        {/* Content Truncated */}
                                        <p className="text-xs text-gray-800 line-clamp-3 mb-3 flex-1">
                                            {post.content || "No text content"}
                                        </p>

                                        {/* Stats Row */}
                                        <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-3 border-t pt-2">
                                            <span>👍 {post.likes || 0}</span>
                                            <span>💬 {post.comments?.length || 0}</span>
                                            <span>🔁 {post.shares || 0}</span>
                                        </div>

                                        {/* Action Buttons Row */}
                                        <div className="grid grid-cols-4 gap-1">
                                            {/* Toggle HIDE */}
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-7 w-full"
                                                title={post.isHidden ? "Show Post" : "Hide Post"}
                                                onClick={() => toggleVisibility(post._id, post.isHidden)}
                                            >
                                                {post.isHidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                            </Button>

                                            {/* Toggle Comments */}
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className={`h-7 w-full ${post.commentsHidden ? "text-red-500 border-red-200 bg-red-50" : ""}`}
                                                title={post.commentsHidden ? "Enable Comments" : "Disable Comments"}
                                                onClick={() => toggleComments(post._id, post.commentsHidden)}
                                            >
                                                {post.commentsHidden ? <MessageSquareOff className="h-3 w-3" /> : <MessageSquare className="h-3 w-3" />}
                                            </Button>

                                            <div className="col-span-1">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-7 w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    title="Edit Post"
                                                    onClick={() => handleEditClick(post)}
                                                >
                                                    <Pencil className="h-3 w-3" />
                                                </Button>
                                            </div>

                                            {/* Delete */}
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="h-7 w-full"
                                                onClick={() => handleDeletePost(post._id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </IKContext >
    );
};

export default AIPostManager;
