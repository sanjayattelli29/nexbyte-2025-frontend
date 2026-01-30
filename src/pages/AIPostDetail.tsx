import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "@/config";
import { IKContext, IKImage } from "imagekitio-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Share2, MessageCircle, Send, ArrowLeft, Loader2, MessageSquareOff } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const IK_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const IK_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

const AIPostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");

    useEffect(() => {
        if (id) fetchPost(id);
    }, [id]);

    const fetchPost = async (postId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai-posts/${postId}`);
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
            await fetch(`${API_BASE_URL}/api/ai-posts/${post._id}`, {
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
            await fetch(`${API_BASE_URL}/api/ai-posts/${post._id}`, {
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
            await fetch(`${API_BASE_URL}/api/ai-posts/${post._id}`, {
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
                    <Link to="/ai-posts">
                        <Button variant="outline">Back to Feed</Button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <IKContext publicKey={IK_PUBLIC_KEY} urlEndpoint={IK_URL_ENDPOINT}>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <main className="flex-1 container mx-auto px-4 py-8 mt-20 max-w-2xl">
                    <Link to="/ai-posts" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Feed
                    </Link>

                    <Card className="overflow-hidden border border-gray-100 shadow-md bg-white">
                        <CardContent className="p-0">
                            {/* Image Section First (Full Width) */}
                            {post.image && (
                                <div className="w-full bg-gray-50 overflow-hidden mb-4">
                                    <IKImage
                                        path={post.image}
                                        transformation={[{ width: "1200" }]}
                                        className="w-full h-auto object-contain max-h-[600px] mx-auto"
                                        loading="lazy"
                                    />
                                </div>
                            )}

                            {/* Post Content */}
                            <div className="px-6 pb-2">
                                {post.content && (
                                    <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap mb-4">
                                        {post.content}
                                    </p>
                                )}

                                {/* Date Footer */}
                                <div className="flex items-center gap-2 text-xs text-gray-400 border-t border-gray-50 pt-3">
                                    <span>{new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    <span>•</span>
                                    <span className="bg-gray-50 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide text-gray-500">Public</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500 border-b border-gray-100">
                                <div className="flex items-center gap-1">
                                    <ThumbsUp className="w-3 h-3 fill-blue-500 text-blue-500" />
                                    <span>{post.likes || 0}</span>
                                </div>
                                <div className="flex gap-3">
                                    <span>{post.comments?.length || 0} comments</span>
                                    <span>{post.shares || 0} reposts</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="px-2 py-1 flex items-center justify-between">
                                <Button
                                    variant="ghost"
                                    className="flex-1 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md py-6"
                                    onClick={handleLike}
                                >
                                    <ThumbsUp className={`h-5 w-5 mr-2 ${post.likes > 0 ? "text-blue-600" : ""}`} />
                                    <span className="font-medium text-sm">Like</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    className={`flex-1 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md py-6 ${post.commentsHidden ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => !post.commentsHidden && document.getElementById(`comment-input`)?.focus()}
                                    disabled={post.commentsHidden}
                                >
                                    {post.commentsHidden ? <MessageSquareOff className="h-5 w-5 mr-2" /> : <MessageCircle className="h-5 w-5 mr-2" />}
                                    <span className="font-medium text-sm">
                                        {post.commentsHidden ? 'Off' : 'Comment'}
                                    </span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="flex-1 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md py-6"
                                    onClick={handleShare}
                                >
                                    <Share2 className="h-5 w-5 mr-2" />
                                    <span className="font-medium text-sm">Share</span>
                                </Button>
                            </div>

                            {/* Comment Section */}
                            {!post.commentsHidden && (
                                <div className="bg-gray-50/50 p-4 border-t border-gray-100">
                                    <div className="flex gap-3 mb-6">
                                        <Avatar className="h-8 w-8 mt-1">
                                            <AvatarFallback className="bg-gray-200 text-gray-500">G</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 relative">
                                            <Input
                                                id="comment-input"
                                                placeholder="Add a comment..."
                                                className="min-h-[40px] py-2 pr-10 bg-white border-gray-200 rounded-full focus-visible:ring-1 focus-visible:ring-gray-300"
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                                            />
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="absolute right-1 top-1 h-8 w-8 text-blue-600 hover:bg-blue-50 rounded-full"
                                                onClick={handleComment}
                                                disabled={!commentText.trim()}
                                            >
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {post.comments?.map((comment: any, idx: number) => (
                                            <div key={idx} className="flex gap-3">
                                                <Avatar className="h-8 w-8 border border-gray-100">
                                                    <AvatarFallback className="bg-gray-100 text-xs text-gray-500">
                                                        {comment.user ? comment.user[0].toUpperCase() : 'G'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 bg-white p-3 rounded-tr-lg rounded-br-lg rounded-bl-lg shadow-sm border border-gray-100">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-xs font-semibold text-gray-900">
                                                            {comment.user}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400">
                                                            {new Date(comment.date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 leading-relaxed">{comment.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        </IKContext>
    );
};

export default AIPostDetail;
