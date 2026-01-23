import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { IKContext, IKUpload, IKImage } from "imagekitio-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

// ImageKit Config (Ideally move to env, but using provided values for now)
const IK_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const IK_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
const IK_AUTH_ENDPOINT = `${API_BASE_URL}/api/imagekit-auth`;

const SocialPostManager = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [newPost, setNewPost] = useState({
        content: "",
        image: null as string | null,
        video: null // Placeholder if we ever add video, but user said no video for now
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/social-posts`);
            const data = await response.json();
            if (data.success) {
                setPosts(data.data);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            toast.error("Failed to load posts");
        } finally {
            setLoading(false);
        }
    };

    const handleUploadError = (err: any) => {
        console.error("Upload Error:", err);
        setUploading(false);
        toast.error("Image upload failed");
    };

    const handleUploadSuccess = (res: any) => {
        console.log("Upload Success:", res);
        setUploading(false);
        // Save the file path or URL
        setNewPost({ ...newPost, image: res.filePath }); // Using filePath for IKImage
        toast.success("Image uploaded successfully");
    };

    const handleCreatePost = async () => {
        if (!newPost.content && !newPost.image) {
            return toast.error("Please add text or an image");
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/social-posts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPost)
            });
            const data = await response.json();

            if (data.success) {
                toast.success("Post created successfully!");
                setNewPost({ content: "", image: null, video: null });
                fetchPosts();
            } else {
                toast.error("Failed to create post");
            }
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Error creating post");
        }
    };

    const handleDeletePost = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/social-posts/${id}`, {
                method: "DELETE"
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Post deleted");
                fetchPosts();
            } else {
                toast.error("Failed to delete post");
            }
        } catch (error) {
            toast.error("Error deleting post");
        }
    };

    return (
        <IKContext
            publicKey={IK_PUBLIC_KEY}
            urlEndpoint={IK_URL_ENDPOINT}
            authenticator={async () => {
                try {
                    const response = await fetch(IK_AUTH_ENDPOINT);

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
                    }

                    const data = await response.json();
                    const { signature, expire, token } = data;
                    return { signature, expire, token };
                } catch (error) {
                    throw new Error(`Authentication request failed: ${error}`);
                }
            }}
        >
            <div className="space-y-8">
                {/* Create Post Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Social Post</CardTitle>
                        <CardDescription>Share updates, goals, or images to the social feed.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Post Content</Label>
                            <Textarea
                                placeholder="What's on your mind?"
                                value={newPost.content}
                                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                rows={4}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Image Upload</Label>
                            {newPost.image ? (
                                <div className="relative w-fit">
                                    <IKImage
                                        path={newPost.image}
                                        transformation={[{ height: "200", width: "300" }]}
                                        className="rounded-md border border-gray-200"
                                    />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                        onClick={() => setNewPost({ ...newPost, image: null })}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-200 rounded-md p-4 bg-gray-50 flex flex-col items-center justify-center text-center">
                                    <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500 mb-2">Click below to upload an image</p>

                                    {uploading ? (
                                        <div className="flex items-center text-sm text-primary">
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...
                                        </div>
                                    ) : (
                                        <IKUpload
                                            fileName="social-post-image"
                                            useUniqueFileName={true}
                                            folder="/social-posts"
                                            onError={handleUploadError}
                                            onSuccess={handleUploadSuccess}
                                            onUploadStart={() => setUploading(true)}
                                            className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-primary file:text-white
                                                hover:file:bg-primary/90
                                            "
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        <Button onClick={handleCreatePost} disabled={uploading}>
                            {uploading ? "Uploading Image..." : "Publish Post"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Posts List */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Recent Posts</h3>
                    {loading ? (
                        <p>Loading posts...</p>
                    ) : posts.length === 0 ? (
                        <p className="text-muted-foreground">No posts yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {posts.map((post) => (
                                <Card key={post._id} className="overflow-hidden">
                                    <div className="flex flex-col h-full">
                                        {post.image && (
                                            <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                                                <IKImage
                                                    path={post.image}
                                                    transformation={[{ height: "300", width: "500" }]}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                        <CardContent className="p-4 flex-1 flex flex-col">
                                            <p className="text-sm text-gray-500 mb-2">
                                                {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString()}
                                            </p>
                                            <p className="whitespace-pre-wrap mb-4 flex-1">{post.content}</p>

                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                                <div className="flex gap-4 text-sm text-gray-500">
                                                    <span>👍 {post.likes || 0}</span>
                                                    <span>💬 {post.comments?.length || 0}</span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDeletePost(post._id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </IKContext>
    );
};

export default SocialPostManager;
