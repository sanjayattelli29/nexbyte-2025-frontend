import { motion } from "framer-motion";
import { Instagram, Facebook, Linkedin, Youtube, Twitter } from "lucide-react";

const platforms = [
  {
    icon: Instagram,
    name: "Instagram",
    description: "Reels, Stories, Posts & Growth",
    color: "from-pink-500 to-purple-600",
  },
  {
    icon: Facebook,
    name: "Facebook",
    description: "Pages, Groups & Ads",
    color: "from-blue-600 to-blue-700",
  },
  {
    icon: Linkedin,
    name: "LinkedIn",
    description: "B2B Marketing & Networking",
    color: "from-blue-700 to-blue-800",
  },
  {
    icon: Youtube,
    name: "YouTube",
    description: "Videos, Shorts & SEO",
    color: "from-red-500 to-red-600",
  }
];

const PlatformsSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            We Cover <span className="text-gradient-accent">All Major Platforms</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive management and marketing across every platform that matters for your business growth.
          </p>
        </motion.div>

        {/* Platforms showcase */}
        <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
          {platforms.map((platform, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative flex flex-col items-center p-8 rounded-2xl bg-card border border-border hover:shadow-xl transition-all duration-300 min-w-[180px]"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                <platform.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-1">{platform.name}</h3>
              <p className="text-sm text-muted-foreground text-center">{platform.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Additional platforms mention */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-muted-foreground mt-10"
        >
          Plus Pinterest, TikTok, Snapchat, and emerging platforms tailored to your audience.
        </motion.p>
      </div>
    </section>
  );
};

export default PlatformsSection;
