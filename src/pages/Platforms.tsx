import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Twitter,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Building2,
  User,
  Store,
  Rocket,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const platforms = [
  {
    icon: Instagram,
    name: "Instagram",
    color: "#E4405F",
    services: ["Reels & Stories", "Feed Optimization", "Hashtag Strategy", "Influencer Collabs"],
    stats: { reach: "1M+", engagement: "8.2%", growth: "+145%" }
  },
  {
    icon: Facebook,
    name: "Facebook",
    color: "#1877F2",
    services: ["Page Management", "Facebook Ads", "Group Building", "Event Marketing"],
    stats: { reach: "1M+", engagement: "6.4%", growth: "+98%" }
  },
  {
    icon: Linkedin,
    name: "LinkedIn",
    color: "#0A66C2",
    services: ["B2B Content", "Thought Leadership", "Lead Generation", "Company Pages"],
    stats: { reach: "600k+", engagement: "4.8%", growth: "+210%" }
  },
  {
    icon: Youtube,
    name: "YouTube",
    color: "#FF0000",
    services: ["SEO Videos", "Channel Optimization", "Thumbnail Design", "Subscriber Growth"],
    stats: { reach: "500k+", engagement: "7.1%", growth: "+180%" }
  }
];

const platformGuide = [
  {
    icon: Rocket,
    type: "Startups",
    recommended: ["Instagram", "LinkedIn"],
    description: "Fast growth, brand awareness, and investor visibility"
  },
  {
    icon: User,
    type: "Creators",
    recommended: ["YouTube", "Instagram"],
    description: "Audience building, monetization, and personal branding"
  },
  {
    icon: Store,
    type: "Local Business",
    recommended: ["Facebook", "Instagram", "Google"],
    description: "Community engagement, local reach, and reviews"
  },
  {
    icon: Building2,
    type: "Enterprise",
    recommended: ["LinkedIn", "YouTube", "Twitter"],
    description: "B2B marketing, thought leadership, and industry authority"
  }
];

const Platforms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              Platform Coverage
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              We Manage & Grow Brands Across{" "}
              <span className="text-gradient-primary">Every Major Platform</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              From Instagram Reels to LinkedIn B2B campaigns, we understand the unique dynamics
              of each platform and craft strategies that resonate with your target audience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Platforms Grid */}
      <section className="py-20">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${platform.color}15`, color: platform.color }}
                  >
                    <platform.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold">{platform.name}</h3>
                </div>

                <div className="space-y-2 mb-6">
                  {platform.services.map((service) => (
                    <div key={service} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>

                {/* Analytics Preview Card */}
                <div className="bg-secondary/50 rounded-xl p-4">
                  <p className="text-xs font-medium text-muted-foreground mb-3">Average Client Results</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <Eye className="w-4 h-4 mx-auto mb-1 text-primary" />
                      <p className="text-sm font-bold">{platform.stats.reach}</p>
                      <p className="text-xs text-muted-foreground">Reach</p>
                    </div>
                    <div className="text-center">
                      <Heart className="w-4 h-4 mx-auto mb-1 text-accent" />
                      <p className="text-sm font-bold">{platform.stats.engagement}</p>
                      <p className="text-xs text-muted-foreground">Engage</p>
                    </div>
                    <div className="text-center">
                      <TrendingUp className="w-4 h-4 mx-auto mb-1 text-success" />
                      <p className="text-sm font-bold">{platform.stats.growth}</p>
                      <p className="text-xs text-muted-foreground">Growth</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Strategy Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
              Platform Strategy
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Content That Works on Each Platform
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each platform has its own algorithm, audience behavior, and content style.
              We tailor our approach to maximize impact on every channel.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Visual-First Platforms",
                platforms: "Instagram, Pinterest",
                strategy: "Short-form video, aesthetic imagery, trending audio, hashtag optimization"
              },
              {
                title: "Professional Networks",
                platforms: "LinkedIn, Twitter/X",
                strategy: "Thought leadership, industry insights, engagement threads, B2B targeting"
              },
              {
                title: "Video Platforms",
                platforms: "YouTube",
                strategy: "SEO-optimized titles, retention hooks, thumbnail A/B testing, series content"
              },
              {
                title: "Community Platforms",
                platforms: "Facebook, Discord, Reddit",
                strategy: "Group management, community building, user-generated content, events"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-primary font-medium mb-3">{item.platforms}</p>
                <p className="text-muted-foreground text-sm">{item.strategy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Selection Guide */}
      <section className="py-20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-success/10 text-success rounded-full text-sm font-medium mb-4">
              Selection Guide
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Which Platforms Suit Your Business?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Not every platform is right for every business. Here's our recommendation based on business type.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformGuide.map((guide, index) => (
              <motion.div
                key={guide.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <guide.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{guide.type}</h3>
                <p className="text-sm text-muted-foreground mb-4">{guide.description}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {guide.recommended.map((platform) => (
                    <span key={platform} className="px-2 py-1 bg-secondary text-xs font-medium rounded-full">
                      {platform}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-primary-foreground"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Your Custom Multi-Platform Growth Plan
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Let our experts analyze your business and create a tailored strategy
              that leverages the right platforms for maximum growth.
            </p>
            <Link to="/contact">
              <Button size="lg" variant="secondary" className="text-foreground">
                Request Free Platform Analysis <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Platforms;
