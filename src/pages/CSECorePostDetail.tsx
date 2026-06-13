import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "@/config";
import { IKContext, IKImage } from "imagekitio-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Share2, MessageCircle, Send, ArrowLeft, Loader2, MessageSquareOff, Calendar, Sparkles, Youtube } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaCodeBranch, FaLaptopCode, FaDatabase, FaServer, FaCode } from "react-icons/fa";
import { SiPython, SiOracle, SiMysql, SiPostgresql, SiMongodb } from "react-icons/si";

const IK_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const IK_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

interface CategoryTheme {
    icon: any;
    gradient: string;
    tagline: string;
    textColor: string;
    accentColor: string;
}

// CSE Categories Themes
const CATEGORY_THEMES: Record<string, CategoryTheme> = {
    "All": {
        icon: FaLaptopCode,
        gradient: "from-blue-900 via-sky-900 to-blue-900",
        tagline: "Exploring Computer Science and Engineering",
        textColor: "text-sky-400",
        accentColor: "bg-sky-500"
    },
    "Python": {
        icon: SiPython,
        gradient: "from-yellow-900 via-blue-900 to-yellow-900",
        tagline: "The language for everything",
        textColor: "text-yellow-400",
        accentColor: "bg-yellow-500"
    },
    "ORACLE DBA": {
        icon: SiOracle,
        gradient: "from-red-900 via-orange-900 to-red-900",
        tagline: "Enterprise database management",
        textColor: "text-red-400",
        accentColor: "bg-red-500"
    },
    "SQL SERVER DBA": {
        icon: FaDatabase,
        gradient: "from-red-800 via-gray-900 to-red-800",
        tagline: "Microsoft database administration",
        textColor: "text-red-400",
        accentColor: "bg-red-500"
    },
    "MY SQL": {
        icon: SiMysql,
        gradient: "from-blue-800 via-orange-800 to-blue-800",
        tagline: "The world's most popular open source database",
        textColor: "text-blue-400",
        accentColor: "bg-blue-500"
    },
    "POSTGRESS": {
        icon: SiPostgresql,
        gradient: "from-indigo-900 via-blue-900 to-indigo-900",
        tagline: "The world's most advanced open source database",
        textColor: "text-indigo-400",
        accentColor: "bg-indigo-500"
    },
    "MongoDB": {
        icon: SiMongodb,
        gradient: "from-green-900 via-emerald-900 to-green-900",
        tagline: "The leading NoSQL database",
        textColor: "text-green-400",
        accentColor: "bg-green-500"
    }
};

const CSECorePostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");

    useEffect(() => {
        if (id) fetchPost(id);
    }, [id]);

    const fetchPost = async (postId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/cse-core-posts/${postId}`);
            const data = await response.json();
            if (data.success) {
                setPost(data.data);
            } else {
                toast.error("Post not found");
            }
        } catch (error) {
            console.error("Error fetching ai post:", error);
            toast.error("Error loading post");
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!post) return;
        setPost({ ...post, likes: (post.likes || 0) + 1 });
        try {
            await fetch(`${API_BASE_URL}/api/cse-core-posts/${post._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "like" })
            });
        } catch (error) { }
    };

    const handleShare = async () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
        if (!post) return;
        setPost({ ...post, shares: (post.shares || 0) + 1 });
        try {
            await fetch(`${API_BASE_URL}/api/cse-core-posts/${post._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "share" })
            });
        } catch (error) { }
    };

    const handleComment = async () => {
        if (!commentText.trim() || !post) return;
        const newComment = {
            user: "Guest User",
            text: commentText,
            date: new Date()
        };
        setPost({ ...post, comments: [...(post.comments || []), newComment] });
        setCommentText("");
        try {
            await fetch(`${API_BASE_URL}/api/cse-core-posts/${post._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "comment", payload: newComment })
            });
        } catch (error) {
            toast.error("Failed to post comment");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <p className="text-xl text-gray-500">Post not found</p>
                    <Link to="/cse-core-posts">
                        <Button variant="outline">Back to Feed</Button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const currentTheme = CATEGORY_THEMES[post.category] || CATEGORY_THEMES["All"];
    const CurrentIcon = currentTheme.icon;

    return (
        <IKContext publicKey={IK_PUBLIC_KEY} urlEndpoint={IK_URL_ENDPOINT}>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />

                {/* Dynamic Banner Section */}
                <div className={`pt-24 pb-12 relative overflow-hidden bg-gradient-to-r ${currentTheme.gradient} text-white`}>
                    <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
                        {[...Array(10)].map((_, i) => (
                            <CurrentIcon
                                key={i}
                                className="absolute animate-float"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    fontSize: `${Math.random() * 30 + 15}px`,
                                    animationDuration: `${Math.random() * 10 + 10}s`,
                                    animationDelay: `${Math.random() * 5}s`
                                }}
                            />
                        ))}
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <Link to="/cse-core-posts" className="inline-flex items-center text-sm font-medium hover:text-blue-200 transition-colors mb-6 backdrop-blur-sm bg-white/10 px-3 py-1.5 rounded-full">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to CSE Posts
                        </Link>

                        <div className={`p-2.5 rounded-full bg-white/10 backdrop-blur-md mb-3 shadow-lg ${currentTheme.textColor}`}>
                            <CurrentIcon className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                            {post.category || "CSE-Core Post"}
                        </h1>
                        <p className="text-sm md:text-base font-light opacity-80 max-w-xl">
                            {currentTheme.tagline}
                        </p>
                    </div>
                </div>

                <main className="flex-1 container mx-auto px-4 py-8 -mt-6 relative z-20 max-w-3xl">
                    <Card className="overflow-hidden border border-gray-100 shadow-xl bg-white rounded-xl">
                        <CardContent className="p-0">
                            {post.image && (
                                <div className="w-full bg-gray-50 overflow-hidden mb-4 relative">
                                    <IKImage
                                        path={post.image}
                                        transformation={[{ width: "1200" }]}
                                        className="w-full h-auto object-contain max-h-[500px] mx-auto"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-4 right-4 z-20">
                                        <span className="bg-white/90 backdrop-blur text-sm font-bold px-3 py-1.5 rounded-md shadow-sm flex items-center gap-2 text-gray-800">
                                            <FaLaptopCode className="w-4 h-4 text-blue-600" />
                                            {post.category || "CSE"}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="px-6 md:px-8 pb-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-gray-900 shadow-sm uppercase tracking-wide`}>
                                        <FaCodeBranch className={`w-3.5 h-3.5 ${currentTheme.textColor}`} />
                                        {post.category || "CSE"}
                                    </span>
                                    <span className="text-gray-300">•</span>
                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>

                                {post.content && (
                                    <div className="prose prose-sm md:prose-base max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap mb-8 font-light">
                                        {post.content}
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Button variant="ghost" size="sm" className={`flex-1 h-10 rounded-lg transition-colors ${post.likes > 0 ? "text-blue-600 bg-blue-50 font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`} onClick={handleLike}>
                                        <ThumbsUp className={`h-4 w-4 mr-2 ${post.likes > 0 ? "fill-current" : ""}`} /> 
                                        <span className="font-medium">{post.likes || 0} Likes</span>
                                    </Button>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <MessageCircle className="w-4 h-4" />
                                        <span>{post.comments?.length || 0} Comments</span>
                                    </div>
                                    {post.actionLink && (
                                        <Button
                                            className="w-full sm:w-auto font-medium shadow-md hover:shadow-lg transition-all h-11 px-8 border-blue-200 text-blue-700 hover:bg-blue-50"
                                            variant="outline"
                                            onClick={() => window.open(post.actionLink, '_blank', 'noopener,noreferrer')}
                                        >
                                            {post.buttonText || "More Info"} <span className="text-[10px] ml-1">{post.buttonText === "Youtube" ? <Youtube className="w-4 h-4 ml-1" /> : "↗"}</span>
                                        </Button>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                    <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> {post.shares || 0} Shares</span>
                                </div>
                            </div>

                            {!post.commentsHidden && (
                                <div className="bg-white p-6 border-t border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Discussion</h3>

                                    <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 shadow-inner">
                                        <div className="flex gap-3">
                                            <Avatar className="h-8 w-8 mt-1">
                                                <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">G</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 relative">
                                                <Input
                                                    id="comment-input"
                                                    placeholder="Add a thought..."
                                                    className="min-h-[44px] py-2.5 pr-10 bg-white border-gray-200 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:border-blue-300 transition-all font-light"
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                                                />
                                                <Button size="icon" variant="ghost" className="absolute right-1.5 top-1.5 h-8 w-8 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={handleComment} disabled={!commentText.trim()}>
                                                    <Send className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {post.comments?.length === 0 ? (
                                            <div className="text-center py-6 text-gray-400 text-sm italic">
                                                No comments yet. Be the first to share your thoughts!
                                            </div>
                                        ) : (
                                            post.comments?.map((comment: any, idx: number) => (
                                                <div key={idx} className="flex gap-3 group">
                                                    <Avatar className="h-8 w-8 border border-gray-100">
                                                        <AvatarFallback className="bg-gray-100 text-xs font-medium text-gray-600">
                                                            {comment.user ? comment.user[0].toUpperCase() : 'G'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-none border border-gray-100">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-xs font-bold text-gray-900">{comment.user}</span>
                                                                <span className="text-[10px] text-gray-400">{new Date(comment.date).toLocaleDateString()}</span>
                                                            </div>
                                                            <p className="text-sm text-gray-700 leading-relaxed font-light">{comment.text}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </main>
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

export default CSECorePostDetail;
