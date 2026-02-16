import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { IKContext, IKImage } from "imagekitio-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Share2, MessageCircle, MessageSquare, MessageSquareOff, Send, Loader2, TrendingUp, Calendar, Sparkles, Youtube } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useSearchParams, Link } from "react-router-dom";
import { FaRobot, FaBrain, FaMicrochip, FaNetworkWired, FaCodeBranch } from "react-icons/fa";
import { SiOpenai } from "react-icons/si";

// ImageKit Config
const IK_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const IK_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

interface CategoryTheme {
    icon: any;
    gradient: string;
    tagline: string;
    textColor: string;
    accentColor: string;
}

// AI Categories Themes
const CATEGORY_THEMES: Record<string, CategoryTheme> = {
    "All": {
        icon: FaRobot,
        gradient: "from-violet-900 via-fuchsia-900 to-violet-900",
        tagline: "Exploring the frontiers of Artificial Intelligence",
        textColor: "text-fuchsia-400",
        accentColor: "bg-fuchsia-500"
    },
    "Machine Learning": {
        icon: FaBrain,
        gradient: "from-blue-900 via-indigo-900 to-blue-900",
        tagline: "Teaching machines to learn from data",
        textColor: "text-indigo-400",
        accentColor: "bg-indigo-500"
    },
    "Deep Learning": {
        icon: FaNetworkWired,
        gradient: "from-purple-900 via-pink-900 to-purple-900",
        tagline: "Neural networks powering the future",
        textColor: "text-pink-400",
        accentColor: "bg-pink-500"
    },
    "NLP": {
        icon: MessageCircle,
        gradient: "from-emerald-900 via-teal-900 to-emerald-900",
        tagline: "Understanding human language",
        textColor: "text-teal-400",
        accentColor: "bg-teal-500"
    },
    "Generative AI": {
        icon: Sparkles,
        gradient: "from-amber-900 via-orange-900 to-amber-900",
        tagline: "Creating new content with AI",
        textColor: "text-amber-400",
        accentColor: "bg-amber-500"
    },
    "Robotics": {
        icon: FaMicrochip,
        gradient: "from-slate-900 via-gray-800 to-slate-900",
        tagline: "Intelligent machines in the physical world",
        textColor: "text-slate-400",
        accentColor: "bg-slate-500"
    }
};

const AIPosts = () => {
    const [searchParams] = useSearchParams();
    const initialCategory = "All";

    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("latest");
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
    const [commentInput, setCommentInput] = useState<Record<string, string>>({});
    const [commentValues, setCommentValues] = useState<Record<string, string>>({});
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);

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
        setPosts(posts.map(p => p._id === id ? { ...p, likes: (p.likes || 0) + 1 } : p));
        try {
            await fetch(`${API_BASE_URL}/api/ai-posts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "like" })
            });
        } catch (error) { }
    };

    const handleShare = async (id: string) => {
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
            user: "Guest User",
            text: text,
            date: new Date()
        };
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

    const getTheme = (catName: string) => {
        return CATEGORY_THEMES[catName] || CATEGORY_THEMES["All"];
    };

    const currentTheme = getTheme(selectedCategory);
    const CurrentIcon = currentTheme.icon;

    return (
        <IKContext publicKey={IK_PUBLIC_KEY} urlEndpoint={IK_URL_ENDPOINT}>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />

                {/* Dynamic Banner Section */}
                <div className={`mt-16 relative overflow-hidden bg-gradient-to-r ${currentTheme.gradient} text-white transition-all duration-700`}>
                    <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
                        {[...Array(10)].map((_, i) => (
                            <CurrentIcon
                                key={i}
                                className="absolute animate-float"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    fontSize: `${Math.random() * 40 + 20}px`,
                                    animationDuration: `${Math.random() * 10 + 10}s`,
                                    animationDelay: `${Math.random() * 5}s`
                                }}
                            />
                        ))}
                    </div>

                    <div className="container mx-auto px-4 py-12 relative z-10 flex flex-col items-center text-center">
                        <div className={`p-3 rounded-full bg-white/10 backdrop-blur-md mb-4 shadow-lg ${currentTheme.textColor}`}>
                            <CurrentIcon className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
                            {selectedCategory === "All" ? "AI Goals" : selectedCategory}
                        </h1>
                        <p className="text-lg md:text-xl font-light opacity-90 max-w-2xl mx-auto">
                            {currentTheme.tagline}
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-2 py-6 max-w-[1600px] -mt-8 relative z-20">
                    <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-100">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            {/* Category Filter Pills */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                <button
                                    onClick={() => setSelectedCategory("All")}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-300
                                        ${selectedCategory === "All"
                                            ? "bg-violet-600 text-white shadow-md transform scale-105"
                                            : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                                        }
                                    `}
                                >
                                    <FaRobot className={`w-3.5 h-3.5 ${selectedCategory === "All" ? "text-white" : "text-violet-600"}`} />
                                    All AI
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => setSelectedCategory(cat.name)}
                                        className={`
                                            flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-300
                                            ${selectedCategory === cat.name
                                                ? "bg-black text-white shadow-md transform scale-105"
                                                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                                            }
                                        `}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            {/* Filters & Sorting */}
                            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                                {sortBy === 'latest' && (
                                    <div className="flex items-center border-r border-gray-200 pr-2 mr-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className={`p-2 rounded-md transition-all ${date ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:text-gray-900 hover:bg-white"}`}>
                                                    <Calendar className="w-4 h-4" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="end">
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
                                                className="text-[10px] text-red-500 ml-1 hover:underline font-medium"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={() => setSortBy("latest")}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${sortBy === "latest"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    Latest
                                </button>
                                <button
                                    onClick={() => setSortBy("popular")}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${sortBy === "popular"
                                        ? "bg-white text-orange-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <TrendingUp className="w-3 h-3" /> Trending
                                </button>
                            </div>
                        </div>
                    </div>

                    <main className="min-h-[400px]">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="h-10 w-10 animate-spin text-gray-300" />
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                                <div className="p-4 bg-gray-50 rounded-full mb-4">
                                    <CurrentIcon className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">No AI posts found</h3>
                                <p className="text-sm text-gray-500 mt-1">Check back later for updates on {selectedCategory}.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {posts.map((post) => (
                                    <Card key={post._id} className="group overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col bg-white h-full rounded-xl">
                                        <Link to={`/ai-posts/${post._id}`} className="block relative">
                                            {post.image ? (
                                                <div className="w-full h-48 bg-gray-100 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
                                                    <IKImage
                                                        path={post.image}
                                                        transformation={[{ height: "400", width: "600" }]}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute top-3 left-3 z-20">
                                                        <span className="bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-white/50 flex items-center gap-1.5 text-gray-800">
                                                            <FaBrain className="w-3 h-3 text-violet-600" />
                                                            {post.category || "AI"}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-full h-48 bg-gray-50 flex items-center justify-center relative overflow-hidden group-hover:bg-gray-100 transition-colors">
                                                    <FaRobot className="w-12 h-12 text-gray-300" />
                                                </div>
                                            )}
                                        </Link>

                                        <div className="flex flex-col flex-1 p-5">
                                            <div className="mb-4 flex-1">
                                                <div className={`text-sm text-gray-600 whitespace-pre-wrap leading-relaxed ${!expandedPosts[post._id] && "line-clamp-3"}`}>
                                                    {post.content}
                                                </div>
                                                {post.content && post.content.length > 150 && (
                                                    <Link to={`/ai-posts/${post._id}`} className="text-violet-600 hover:text-violet-700 text-xs font-bold mt-2 hover:underline inline-block">
                                                        Read more
                                                    </Link>
                                                )}
                                            </div>

                                            {post.actionLink && (
                                                <div className="mb-2">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full h-8 text-xs border-violet-200 text-violet-600 hover:bg-violet-50 hover:text-violet-700 flex items-center justify-center gap-1.5 transition-colors"
                                                        onClick={() => window.open(post.actionLink, '_blank', 'noopener,noreferrer')}
                                                    >
                                                        {post.buttonText || "More Info"} <span className="text-[10px]">{post.buttonText === "Youtube" ? <Youtube className="w-3 h-3 ml-1" /> : "↗"}</span>
                                                    </Button>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-4 mt-auto">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-3 font-medium">
                                                    <span className="flex items-center gap-1 hover:text-violet-600 transition-colors"><ThumbsUp className="w-3 h-3" /> {post.likes || 0}</span>
                                                    <span className="flex items-center gap-1 hover:text-violet-600 transition-colors"><MessageCircle className="w-3 h-3" /> {post.comments?.length || 0}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-3 mt-3 border-t border-gray-50">
                                                <Button variant="ghost" size="sm" className={`flex-1 h-8 text-xs rounded-lg transition-colors ${post.likes > 0 ? "text-violet-600 bg-violet-50 font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`} onClick={() => handleLike(post._id)}>
                                                    <ThumbsUp className={`h-3.5 w-3.5 mr-1.5 ${post.likes > 0 ? "fill-current" : ""}`} /> Like
                                                </Button>
                                                <Button variant="ghost" size="sm" className={`flex-1 h-8 text-xs rounded-lg transition-colors ${post.commentsHidden ? 'opacity-50 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`} onClick={() => !post.commentsHidden && setCommentInput(prev => ({ ...prev, [post._id]: prev[post._id] ? "" : "open" }))} disabled={post.commentsHidden}>
                                                    {post.commentsHidden ? <MessageSquareOff className="h-3.5 w-3.5 mr-1.5" /> : <MessageSquare className="h-3.5 w-3.5 mr-1.5" />} {post.commentsHidden ? 'Off' : 'Comment'}
                                                </Button>
                                                <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors" onClick={() => handleShare(post._id)}>
                                                    <Share2 className="h-3.5 w-3.5 mr-1.5" /> Share
                                                </Button>
                                            </div>

                                            {!post.commentsHidden && commentInput[post._id] === "open" && (
                                                <div className="mt-3 pt-3 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                                                    <div className="relative group">
                                                        <input
                                                            type="text"
                                                            placeholder="Write a comment..."
                                                            className="w-full pl-3 pr-9 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-violet-100 focus:border-violet-300 transition-all"
                                                            value={commentValues[post._id] || ""}
                                                            onChange={(e) => setCommentValues(prev => ({ ...prev, [post._id]: e.target.value }))}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id, commentValues[post._id] || "")}
                                                        />
                                                        <button
                                                            onClick={() => handleComment(post._id, commentValues[post._id] || "")}
                                                            className={`absolute right-1 top-1 p-1 rounded-md transition-all ${commentValues[post._id] ? "text-violet-600 hover:bg-violet-50" : "text-gray-300 cursor-not-allowed"}`}
                                                            disabled={!commentValues[post._id]}
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
                </div>
                <Footer />
                <style>{`
                    @keyframes float {
                        0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
                        10% { opacity: 0.5; }
                        90% { opacity: 0.5; }
                        100% { transform: translateY(-100px) rotate(20deg); opacity: 0; }
                    }
                    .animate-float {
                        animation-name: float;
                        animation-timing-function: linear;
                        animation-iteration-count: infinite;
                    }
                `}</style>
            </div>
        </IKContext>
    );
};

export default AIPosts;
