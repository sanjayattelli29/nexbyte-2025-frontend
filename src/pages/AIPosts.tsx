import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { IKContext, IKImage } from "imagekitio-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Share2, MessageCircle, MessageSquare, MessageSquareOff, Send, Loader2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar"; // Assuming this exists or using standard day picker
import { Calendar } from "lucide-react";


// ImageKit Config (Public Key Only for displaying)
const IK_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const IK_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

const AIPosts = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("latest"); // 'latest' | 'general' | 'popular'
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
    const [commentInput, setCommentInput] = useState<Record<string, string>>({}); // { postId: "open" | "" }
    const [commentValues, setCommentValues] = useState<Record<string, string>>({}); // { postId: text }
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai-categories`);
            const data = await response.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            let url = `${API_BASE_URL}/api/ai-posts?sort=${sortBy}`;
            if (selectedCategory && selectedCategory !== "All") {
                url += `&category=${encodeURIComponent(selectedCategory)}`;
            }
            if (date) {
                url += `&date=${date.toISOString()}`;
            }
            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setPosts(data.data);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [sortBy, selectedCategory, date]);

    const handleLike = async (id: string) => {
        // Optimistic UI
        setPosts(posts.map(p => p._id === id ? { ...p, likes: (p.likes || 0) + 1 } : p));

        try {
            await fetch(`${API_BASE_URL}/api/ai-posts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "like" })
            });
        } catch (error) {
            // Revert on error? For now just ignore
        }
    };

    const handleShare = async (id: string) => {
        // Optimistic UI
        setPosts(posts.map(p => p._id === id ? { ...p, shares: (p.shares || 0) + 1 } : p));

        const shareUrl = `${window.location.origin}/ai-posts/${id}`;
        navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");

        try {
            await fetch(`${API_BASE_URL}/api/ai-posts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "share" })
            });
        } catch (error) { }
    };

    const handleComment = async (id: string, text: string) => {
        if (!text || !text.trim()) return;

        const newComment = {
            user: "Guest User", // As requested, generic user but displayed simply
            text: text,
            date: new Date()
        };

        // Optimistic UI
        setPosts(posts.map(p => p._id === id ? { ...p, comments: [...(p.comments || []), newComment] } : p));
        setCommentInput({ ...commentInput, [id]: "" });
        setCommentValues(prev => ({ ...prev, [id]: "" }));

        try {
            await fetch(`${API_BASE_URL}/api/ai-posts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "comment", payload: newComment })
            });
        } catch (error) {
            toast.error("Failed to post comment");
        }
    };

    const toggleReadMore = (id: string) => {
        setExpandedPosts(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <IKContext publicKey={IK_PUBLIC_KEY} urlEndpoint={IK_URL_ENDPOINT}>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />

                <main className="flex-1 container mx-auto px-2 py-6 mt-20 max-w-[1600px]">
                    <div className="text-center mb-6">
                        {/* Cleaner Header */}
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">AI Feed</h1>
                        <p className="text-xs text-gray-500 mb-4">Latest AI research and updates</p>

                        {/* Category Filters & Sorting */}
                        <div className="flex flex-col items-center gap-3">
                            {/* Categories */}
                            <div className="flex flex-wrap justify-center gap-2 mb-2">
                                <button
                                    onClick={() => setSelectedCategory("All")}
                                    className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wide rounded-full transition-all ${selectedCategory === "All"
                                        ? "bg-black text-white shadow-md"
                                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    All
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => setSelectedCategory(cat.name)}
                                        className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wide rounded-full transition-all ${selectedCategory === cat.name
                                            ? "bg-black text-white shadow-md"
                                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-center gap-2 bg-gray-100 p-1 rounded-lg inline-flex items-center">
                                {/* Date Filter for Latest */}
                                {sortBy === 'latest' && (
                                    <div className="flex items-center mr-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className={`p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-white transition-all ${date ? "text-blue-600 bg-blue-50" : ""}`}>
                                                    <Calendar className="w-4 h-4" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <CalendarComponent
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {date && (
                                            <button
                                                onClick={() => setDate(undefined)}
                                                className="text-[10px] text-red-500 ml-1 hover:underline"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={() => setSortBy("latest")}
                                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${sortBy === "latest"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    General
                                </button>
                                <button
                                    onClick={() => setSortBy("general")}
                                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${sortBy === "general"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    Latest
                                </button>
                                <button
                                    onClick={() => setSortBy("popular")}
                                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${sortBy === "popular"
                                        ? "bg-white text-orange-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <TrendingUp className="w-3 h-3" /> Trending
                                </button>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground bg-white rounded-lg border border-dashed p-8">
                            No AI posts available yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                            {posts.map((post) => (
                                <Card key={post._id} className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col bg-white h-full group">
                                    {/* Image Section First (Better for Grid) */}
                                    {post.image && (
                                        <div className="w-full h-56 bg-gray-50 relative overflow-hidden">
                                            <IKImage
                                                path={post.image}
                                                transformation={[{ height: "400", width: "600" }]}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        </div>
                                    )}

                                    <div className="flex flex-col flex-1 p-5">
                                        {/* Content Text */}
                                        <div className="mb-4 flex-1">
                                            <div className={`text-sm text-gray-800 whitespace-pre-wrap leading-relaxed ${!expandedPosts[post._id] && "line-clamp-3"}`}>
                                                {post.content}
                                            </div>
                                            {post.content && post.content.length > 150 && (
                                                <button
                                                    onClick={() => toggleReadMore(post._id)}
                                                    className="text-blue-600 hover:text-blue-700 text-xs font-semibold mt-1 focus:outline-none"
                                                >
                                                    {expandedPosts[post._id] ? "Show less" : "...see more"}
                                                </button>
                                            )}
                                        </div>

                                        {/* Date & Stats Footer */}
                                        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3 mt-auto">
                                            <div className="flex items-center gap-1">
                                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span className="bg-gray-50 px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-500">Public</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {post.likes || 0}</span>
                                                <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {post.comments?.length || 0}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons (Compact) */}
                                        <div className="flex gap-2 pt-3 mt-2 border-t border-gray-50">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`flex-1 h-8 text-xs ${post.likes > 0 ? "text-blue-600 bg-blue-50" : "text-gray-600"}`}
                                                onClick={() => handleLike(post._id)}
                                            >
                                                <ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
                                                Like
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`flex-1 h-8 text-xs ${post.commentsHidden ? 'opacity-50 cursor-not-allowed' : 'text-gray-600'}`}
                                                onClick={() => !post.commentsHidden && setCommentInput(prev => ({ ...prev, [post._id]: prev[post._id] ? "" : "open" }))}
                                                disabled={post.commentsHidden}
                                            >
                                                {post.commentsHidden ? <MessageSquareOff className="h-3.5 w-3.5 mr-1.5" /> : <MessageSquare className="h-3.5 w-3.5 mr-1.5" />}
                                                {post.commentsHidden ? 'Off' : 'Comment'}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 h-8 text-xs text-gray-600"
                                                onClick={() => handleShare(post._id)}
                                            >
                                                <Share2 className="h-3.5 w-3.5 mr-1.5" />
                                                Share
                                            </Button>
                                        </div>

                                        {/* Inline Comment Input */}
                                        {!post.commentsHidden && commentInput[post._id] === "open" && (
                                            <div className="mt-3 pt-3 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Write a comment..."
                                                        className="w-full pl-3 pr-9 py-2 text-xs bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        value={commentValues[post._id] || ""}
                                                        onChange={(e) => setCommentValues(prev => ({ ...prev, [post._id]: e.target.value }))}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleComment(post._id, commentValues[post._id] || "");
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => handleComment(post._id, commentValues[post._id] || "")}
                                                        className="absolute right-1 top-1 p-1 text-blue-600 hover:bg-blue-50 rounded-full"
                                                    >
                                                        <Send className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </main>
                <Footer />
            </div>
        </IKContext>
    );
};

export default AIPosts;
