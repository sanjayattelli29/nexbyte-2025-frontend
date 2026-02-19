import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { API_BASE_URL } from "@/config";
import { IKImage, IKContext } from "imagekitio-react";

const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

const PremiumAdsShowcase = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (ads.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 2) % ads.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [ads.length]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/news/ads?featured=true&publicView=true`
        );
        const data = await res.json();
        if (data.success) setAds(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  if (!loading && ads.length === 0) return null;

  const tickerText = ads.map((ad) => ad.title).join(" | ");

  return (
    <IKContext urlEndpoint={urlEndpoint} publicKey={publicKey}>
      <section className="relative -mt-10 pb-6 overflow-hidden">
        {/* Header */}
        <div className="container mx-auto px-4 mb-6">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur border border-amber-200 shadow-sm mb-6"
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-semibold text-amber-800">
                Premium Opportunities
              </span>
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </motion.div>

            <div className="flex justify-between items-end w-full max-w-7xl">
              <div className="text-left">
                <h3 className="text-3xl font-bold">Advertisements</h3>
                <p className="text-muted-foreground">
                  Exclusive deals and updates
                </p>
              </div>
              <Link to="/ads-listing" className="hidden md:block">
                <Button
                  variant="outline"
                  className="rounded-full border-primary text-primary hover:bg-primary hover:text-white"
                >
                  View All Advertisements <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scrolling Ticker */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-2 mb-8 overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: ["-50%", "0%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: Math.max(16, ads.length * 4),
            }}
          >
            {[...Array(4)].map((_, i) => (
              <span key={i} className="mx-6 font-semibold text-lg">
                {tickerText}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Ads Carousel */}
        <div className="relative w-full overflow-hidden min-h-[320px]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={currentIndex}
              className="flex justify-center gap-6 w-full px-4"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              {[
                ads[currentIndex % ads.length],
                ads[(currentIndex + 1) % ads.length],
              ]
                .filter(Boolean)
                .map((ad, idx) => (
                  <Link
                    to={`/ads-page/${ad.slug}`}
                    key={`${ad._id}-${idx}`}
                    className="w-full md:w-[48%] max-w-[600px] flex-shrink-0"
                  >
                    <div className="h-[280px] md:h-[300px] flex rounded-xl overflow-hidden border bg-white/50 backdrop-blur shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                      {/* IMAGE SECTION */}
                      <div className="relative w-[40%] md:w-[50%] bg-black">
                        {ad.images?.[0] ? (
                          <IKImage
                            path={ad.images[0]}
                            transformation={[{ width: "600", height: "400" }]}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}

                        <div className="absolute top-3 left-3">
                          <span className="bg-white/90 px-2 py-1 text-xs font-bold rounded">
                            {ad.category}
                          </span>
                        </div>
                      </div>

                      {/* CONTENT SECTION */}
                      <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
                        <div>
                          <span className="text-xs uppercase text-muted-foreground">
                            {new Date(ad.postedDate).toLocaleDateString()}
                          </span>

                          <h3 className="text-lg md:text-xl font-bold mt-2 line-clamp-2">
                            {ad.title}
                          </h3>

                          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                            {ad.shortDescription || ad.description}
                          </p>
                        </div>

                        <div className="flex items-center text-sm font-bold text-primary uppercase">
                          Details
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Button */}
        <div className="container mx-auto px-4 mt-6 md:hidden">
          <Link to="/ads-listing">
            <Button
              variant="outline"
              className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-white"
            >
              View All Advertisements
            </Button>
          </Link>
        </div>
      </section>
    </IKContext>
  );
};

export default PremiumAdsShowcase;
