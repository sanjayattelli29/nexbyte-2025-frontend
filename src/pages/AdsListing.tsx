
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/config";
import { IKImage, IKContext } from "imagekitio-react";
import { ArrowLeft, ExternalLink, Calendar } from "lucide-react";

const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

const AdsListing = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Categories (Ordered)
                const catRes = await fetch(`${API_BASE_URL}/api/news/categories`);
                const catData = await catRes.json();

                // Fetch Ads (Public View)
                const adsRes = await fetch(`${API_BASE_URL}/api/news/ads?publicView=true`);
                const adsData = await adsRes.json();

                if (catData.success) setCategories(catData.data);
                if (adsData.success) setAds(adsData.data);

            } catch (error) {
                console.error("Error loading ads data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <IKContext urlEndpoint={urlEndpoint} publicKey={publicKey}>
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <main className="flex-grow pt-24 pb-16">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-4 mb-8">
                            <Link to="/">
                                <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold">Premium Services & Offers</h1>
                                <p className="text-muted-foreground mt-2">Explore opportunities from our partners</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="py-20 text-center">Loading...</div>
                        ) : (
                            <div className="space-y-16">
                                {categories.map(category => {
                                    // Filter ads for this category
                                    const catAds = ads.filter(ad => ad.category === category.name);
                                    if (catAds.length === 0) return null;

                                    return (
                                        <section key={category._id} id={category.name.toLowerCase().replace(/\s+/g, '-')}>
                                            <div className="flex items-center gap-4 mb-6">
                                                <h2 className="text-2xl font-bold pb-2 border-b-4 border-primary/20 inline-block">
                                                    {category.name}
                                                </h2>
                                                <div className="h-px bg-border flex-1" />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                                {catAds.map(ad => (
                                                    <Link to={`/ads-page/${ad.slug}`} key={ad._id} className="group flex flex-col rounded-lg border border-zinc-200 bg-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                                                        {/* Hot News Banner - Moved Outside/Above Image */}
                                                        {ad.hotNews && (
                                                            <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 text-center">
                                                                {ad.hotNews}
                                                            </div>
                                                        )}

                                                        {/* Image */}
                                                        <div className="w-full aspect-video overflow-hidden relative bg-black">
                                                            {ad.images?.[0] ? (
                                                                <IKImage
                                                                    path={ad.images[0]}
                                                                    transformation={[{ height: "400", width: "600" }]}
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
                                                            )}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                        </div>

                                                        {/* Category & Posted Date - Below Thumbnail */}
                                                        <div className="flex items-center justify-between px-4 py-2 bg-muted/30 text-[10px] uppercase font-bold text-muted-foreground tracking-wider border-b border-border/50">
                                                            <span>{ad.category}</span>
                                                            <div className="flex items-center">
                                                                <Calendar className="w-3 h-3 mr-1" />
                                                                {new Date(ad.postedDate).toLocaleDateString()}
                                                            </div>
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 flex flex-col p-5">
                                                            <div className="mb-2">
                                                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                                                    {ad.title}
                                                                </h3>
                                                                <p className="text-muted-foreground text-sm line-clamp-3">
                                                                    {ad.shortDescription || ad.description}
                                                                </p>
                                                            </div>

                                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                                                                <span className="text-primary text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                                                                    View Details <ExternalLink className="w-3 h-3 ml-1" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </section>
                                    )
                                })}

                                {ads.length === 0 && (
                                    <div className="text-center py-20 bg-muted/20 rounded-xl">
                                        <p className="text-muted-foreground">No ads available right now.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </IKContext>
    );
};

export default AdsListing;
