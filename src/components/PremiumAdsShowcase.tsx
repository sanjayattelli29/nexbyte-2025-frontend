
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { API_BASE_URL } from "@/config";
import { IKImage, IKContext } from "imagekitio-react";

const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

const PremiumAdsShowcase = () => {
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/news/ads?featured=true&publicView=true`);
                const data = await res.json();
                if (data.success && data.data.length > 0) {
                    // Filter only visible ads if not handled by backend (backend handles it now)
                    setAds(data.data);
                }
            } catch (error) {
                console.error("Error fetching premium ads:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAds();
    }, []);

    // Show nothing if no ads
    if (!loading && ads.length === 0) return null;

    return (
        <IKContext urlEndpoint={urlEndpoint} publicKey={publicKey}>
            <section className="relative z-10 -mt-10 pb-4 overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2"></div>
                </div>

                <div className="container mx-auto px-4 mb-8">
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-amber-200/50 shadow-sm mb-6"
                        >
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-semibold text-amber-800 tracking-wide">Premium Opportunities</span>
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        </motion.div>

                        <div className="flex justify-between items-end w-full max-w-7xl px-4 md:px-8">
                            <div className="text-left">
                                <h3 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                    Featured Partners
                                </h3>
                                <p className="text-muted-foreground mt-1">Exclusive deals and updates</p>
                            </div>
                            <Link to="/ads-listing" className="hidden md:flex group items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                View All Offers <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Marquee / Auto Scrolling Section */}
                <div className="relative w-full">
                    {/* Gradient Edges - Only show if scrolling */}
                    {ads.length > 3 && (
                        <>
                            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
                            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />
                        </>
                    )}

                    <div className={`flex w-full ${ads.length > 3 ? "overflow-hidden" : "justify-center overflow-x-auto"}`}>
                        {ads.length > 3 ? (
                            <motion.div
                                className="flex gap-6 px-4"
                                animate={{ x: ["0%", "-50%"] }}
                                transition={{
                                    x: {
                                        repeat: Infinity,
                                        repeatType: "loop",
                                        duration: Math.max(30, ads.length * 8),
                                        ease: "linear",
                                    }
                                }}
                                whileHover={{ animationPlayState: "paused" }}
                            >
                                {[...ads, ...ads].map((ad, idx) => (
                                    <Link to={`/ads-page/${ad.slug}`} key={`${ad._id}-${idx}`} className="w-[280px] md:w-[350px] flex-shrink-0 group relative">
                                        <div className="h-full rounded-lg overflow-hidden border border-zinc-200 bg-white/40 backdrop-blur-md shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                            {/* Image Area */}
                                            <div className="relative aspect-video overflow-hidden bg-black">
                                                {ad.images?.[0] ? (
                                                    <IKImage
                                                        path={ad.images[0]}
                                                        transformation={[{ height: "300", width: "500" }]}
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                <div className="absolute top-3 left-3">
                                                    <span className="bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md shadow-sm text-foreground">
                                                        {ad.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content Area */}
                                            <div className="p-4 relative">
                                                <div className="text-[10px] text-muted-foreground mb-1 font-medium">
                                                    {new Date(ad.postedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </div>
                                                <h3 className="font-bold text-lg leading-tight line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                                                    {ad.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                    {ad.shortDescription || ad.description}
                                                </p>
                                                <div className="flex items-center text-xs font-medium text-primary uppercase tracking-wider">
                                                    Details <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="flex gap-6 px-4 flex-wrap justify-center">
                                {ads.map((ad) => (
                                    <Link to={`/ads-page/${ad.slug}`} key={ad._id} className="w-[280px] md:w-[350px] flex-shrink-0 group relative">
                                        <div className="h-full rounded-lg overflow-hidden border border-zinc-200 bg-white/40 backdrop-blur-md shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                            {/* Image Area */}
                                            <div className="relative aspect-video overflow-hidden bg-black">
                                                {ad.images?.[0] ? (
                                                    <IKImage
                                                        path={ad.images[0]}
                                                        transformation={[{ height: "300", width: "500" }]}
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                <div className="absolute top-3 left-3">
                                                    <span className="bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md shadow-sm text-foreground">
                                                        {ad.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content Area */}
                                            <div className="p-4 relative">
                                                <div className="text-[10px] text-muted-foreground mb-1 font-medium">
                                                    {new Date(ad.postedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </div>
                                                <h3 className="font-bold text-lg leading-tight line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                                                    {ad.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                    {ad.shortDescription || ad.description}
                                                </p>
                                                <div className="flex items-center text-xs font-medium text-primary uppercase tracking-wider">
                                                    Details <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="container mx-auto px-4 mt-8 md:hidden text-center">
                    <Link to="/ads-listing">
                        <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary">
                            Brows All Premium Ads
                        </Button>
                    </Link>
                </div>
            </section>
        </IKContext>
    );
};

export default PremiumAdsShowcase;
