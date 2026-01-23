import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { IKContext, IKImage } from "imagekitio-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Share2, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";

// ImageKit Config (Public Key Only for displaying)
const IK_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const IK_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

const SocialPosts = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
    const [commentInput, setCommentInput] = useState<Record<string, string>>({}); // { postId: commentText }

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/social-posts`);
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

    const handleLike = async (id: string) => {
        // Optimistic UI
        setPosts(posts.map(p => p._id === id ? { ...p, likes: (p.likes || 0) + 1 } : p));

        try {
            await fetch(`${API_BASE_URL}/api/social-posts/${id}`, {
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

        navigator.clipboard.writeText(window.location.href); // Simple share: copy URL
        toast.success("Link copied to clipboard!");

        try {
            await fetch(`${API_BASE_URL}/api/social-posts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "share" })
            });
        } catch (error) { }
    };

    const handleComment = async (id: string) => {
        const text = commentInput[id];
        if (!text) return;

        const newComment = {
            user: "Guest User", // You might want to get this from auth if available, or ask for name
            text: text,
            date: new Date()
        };

        // Optimistic UI
        setPosts(posts.map(p => p._id === id ? { ...p, comments: [...(p.comments || []), newComment] } : p));
        setCommentInput({ ...commentInput, [id]: "" });

        try {
            await fetch(`${API_BASE_URL}/api/social-posts/${id}`, {
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

                <main className="flex-1 container mx-auto px-4 py-8 mt-20">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            Social & Community Updates
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Stay updated with our latest goals, achievements, and community highlights.
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">Loading posts...</div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">No posts available yet.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <Card key={post._id} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full bg-white">
                                    {/* Image Section */}
                                    {post.image && (
                                        <div className="h-56 bg-gray-100 overflow-hidden relative group">
                                            <IKImage
                                                path={post.image}
                                                transformation={[{ height: "400", width: "600" }]}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        </div>
                                    )}

                                    <CardContent className="p-5 flex-1 flex flex-col">
                                        {/* Date */}
                                        <div className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">
                                            {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>

                                        {/* Content */}
                                        <div className="mb-4">
                                            <p className={`text-gray-700 leading-relaxed ${!expandedPosts[post._id] && "line-clamp-3"}`}>
                                                {post.content}
                                            </p>
                                            {post.content && post.content.length > 150 && (
                                                <button
                                                    onClick={() => toggleReadMore(post._id)}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold mt-1 focus:outline-none"
                                                >
                                                    {expandedPosts[post._id] ? "Read Less" : "Read More"}
                                                </button>
                                            )}
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-gray-100">
                                            {/* Interactions */}
                                            <div className="flex items-center justify-between mb-4">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-gray-600 hover:text-blue-600 gap-1.5"
                                                    onClick={() => handleLike(post._id)}
                                                >
                                                    <ThumbsUp className={`h-4 w-4 ${post.likes > 0 ? "fill-blue-100 text-blue-600" : ""}`} />
                                                    <span>{post.likes || 0}</span>
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-gray-600 hover:text-blue-600 gap-1.5"
                                                    onClick={() => document.getElementById(`comment-${post._id}`)?.focus()}
                                                >
                                                    <MessageCircle className="h-4 w-4" />
                                                    <span>{post.comments?.length || 0}</span>
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-gray-600 hover:text-blue-600 gap-1.5"
                                                    onClick={() => handleShare(post._id)}
                                                >
                                                    <Share2 className="h-4 w-4" />
                                                    <span>{post.shares || 0}</span>
                                                </Button>
                                            </div>

                                            {/* Comment Input */}
                                            <div className="flex gap-2">
                                                <Input
                                                    id={`comment-${post._id}`}
                                                    placeholder="Add a comment..."
                                                    className="h-9 text-sm bg-gray-50 border-gray-200"
                                                    value={commentInput[post._id] || ""}
                                                    onChange={(e) => setCommentInput({ ...commentInput, [post._id]: e.target.value })}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleComment(post._id);
                                                    }}
                                                />
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-9 w-9 text-blue-600 hover:bg-blue-50"
                                                    onClick={() => handleComment(post._id)}
                                                >
                                                    <Send className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* Recent Comment Preview (Optional) */}
                                            {post.comments && post.comments.length > 0 && (
                                                <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                                    <span className="font-semibold text-gray-700">{post.comments[post.comments.length - 1].user}:</span> {post.comments[post.comments.length - 1].text}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
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

export default SocialPosts;
