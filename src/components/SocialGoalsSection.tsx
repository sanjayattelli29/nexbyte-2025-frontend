import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { IKContext, IKImage } from "imagekitio-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ThumbsUp, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

// ImageKit Config (Public Key Only for displaying)
const IK_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const IK_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

const SocialGoalsSection = ({
    title = "Social & Community Goals",
    subtitle = "Follow our journey, achievements, and updates directly from our feed.",
    buttonText = "View All Posts"
}: { title?: string, subtitle?: string, buttonText?: string }) => {
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            // Fetch only necessary amount or all and slice
            const response = await fetch(`${API_BASE_URL}/api/social-posts`);
            const data = await response.json();
            if (data.success) {
                setPosts(data.data.slice(0, 3)); // Show top 3
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    // Removed early return to show section even if empty
    // if (posts.length === 0) return null;

    return (
        <IKContext publicKey={IK_PUBLIC_KEY} urlEndpoint={IK_URL_ENDPOINT}>
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div className="text-left">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                {title}
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl">
                                {subtitle}
                            </p>
                        </div>
                        <Link to="/social-posts" className="hidden md:inline-flex">
                            <Button variant="outline" className="gap-2">
                                {buttonText} <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    {posts.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <p className="text-muted-foreground mb-4">No updates available at the moment.</p>
                            <Link to="/social-posts" className="md:hidden">
                                <Button variant="outline" className="gap-2">
                                    {buttonText} <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <Card key={post._id} className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full bg-white">



                                    {/* Content */}
                                    <CardContent className="p-3 pt-0 flex-1 flex flex-col">
                                        <p className="text-xs text-gray-700 leading-relaxed line-clamp-3 mb-3">
                                            {post.content}
                                        </p>

                                        {/* Image */}
                                        {post.image && (
                                            <div className="w-[calc(100%+1.5rem)] -ml-3 mb-3 h-40 bg-gray-50 relative group overflow-hidden">
                                                <IKImage
                                                    path={post.image}
                                                    transformation={[{ height: "300", width: "500" }]}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}

                                        {/* Stats */}
                                        <div className="flex items-center justify-between text-[10px] text-gray-500 border-t border-gray-100 pt-2 mt-auto">
                                            <span className="flex items-center gap-1">👍 {post.likes || 0}</span>
                                            <span className="flex items-center gap-1">{post.comments?.length || 0} comments</span>
                                        </div>

                                        {/* Fake Action Buttons (Visual only, scaling down the 'feed' look) */}
                                        <div className="flex justify-between items-center mt-2 pt-1">
                                            <button className="flex-1 flex items-center justify-center gap-1 py-1 text-gray-500 hover:bg-gray-50 rounded text-[10px] font-medium transition-colors">
                                                <ThumbsUp className="w-3 h-3" /> Like
                                            </button>
                                            <button className="flex-1 flex items-center justify-center gap-1 py-1 text-gray-500 hover:bg-gray-50 rounded text-[10px] font-medium transition-colors">
                                                <MessageCircle className="w-3 h-3" /> Comment
                                            </button>
                                            <Link to={`/social-posts/${post._id}`} className="flex-1">
                                                <button className="w-full flex items-center justify-center gap-1 py-1 text-gray-500 hover:bg-gray-50 rounded text-[10px] font-medium transition-colors">
                                                    <ArrowRight className="w-3 h-3" /> View
                                                </button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {posts.length > 0 && (
                        <div className="mt-8 text-center md:hidden">
                            <Link to="/social-posts">
                                <Button className="gap-2 w-full sm:w-auto">
                                    {buttonText} <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </IKContext>
    );
};

export default SocialGoalsSection;
