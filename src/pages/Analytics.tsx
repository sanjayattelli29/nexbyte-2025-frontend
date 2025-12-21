import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Target,
  PieChart,
  LineChart,
  ArrowRight,
  ArrowUpRight,
  Zap,
  Brain,
  FileText,
  CheckCircle2,
  Video,
  Laptop,
  Smartphone,
  Cloud
} from "lucide-react";

const analyticsFeatures = [
  {
    icon: Heart,
    title: "Complete Digital Marketing",
    description: "End-to-end management including content planning, creative posts, reels optimization, and audience engagement strategies.",
    color: "accent"
  },
  {
    icon: Zap,
    title: "Social Media Growth",
    description: "Strategic content delivery to boost followers, enhance visibility, and drive meaningful community interactions.",
    color: "primary"
  },
  {
    icon: Video,
    title: "Reels & Content Creation",
    description: "High-quality video production and aesthetic designs tailored to capture attention and go viral.",
    color: "success"
  },
  {
    icon: Laptop,
    title: "Technology Services",
    description: "Custom Software Development, Web & App Development, Cloud & IT Solutions tailored to your business needs.",
    color: "primary"
  },
  {
    icon: Smartphone,
    title: "Web & App Development",
    description: "Scalable, high-performance websites and mobile applications built with modern tech stacks.",
    color: "accent"
  },
  {
    icon: Cloud,
    title: "Cloud & IT Solutions",
    description: "Secure cloud infrastructure, system integration, and IT consultancy for digital transformation.",
    color: "success"
  }
];

const sampleMetrics = [
  { label: "Total Impressions", value: "2.4M", change: "+24%", icon: Eye },
  { label: "Projects Delivered", value: "150+", change: "+18%", icon: CheckCircle2 },
  { label: "Engagement Rate", value: "6.8%", change: "+32%", icon: Heart },
  { label: "Client Satisfaction", value: "100%", change: "5.0", icon: Target }
];

const Analytics = () => {
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
              Growth & Development
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Boost Your Business with <br />
              <span className="text-gradient-primary">Digital & Tech Solutions</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              From viral social media strategies to robust custom software, we provide the complete ecosystem for your brand's digital dominance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Live Dashboard Preview */}
      <section className="py-20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-xl max-w-5xl mx-auto"
          >
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-xl font-bold">Impact Overview</h3>
                <p className="text-sm text-muted-foreground">Digital & Tech Performance</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-3 py-1 bg-success/10 text-success rounded-full font-medium">
                  Systems Operational
                </span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {sampleMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-secondary/50 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className="w-5 h-5 text-primary" />
                    <span className="text-xs font-medium text-success flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" />
                      {metric.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Chart Visualization Placeholder */}
            <div className="bg-secondary/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Growth Trend</h4>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">7D</span>
                  <span className="text-xs px-2 py-1 bg-secondary rounded text-muted-foreground">30D</span>
                  <span className="text-xs px-2 py-1 bg-secondary rounded text-muted-foreground">90D</span>
                </div>
              </div>

              {/* Simulated Chart */}
              <div className="h-48 flex items-end justify-between gap-2">
                {[35, 52, 48, 65, 58, 72, 68, 85, 78, 92, 88, 95].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t-sm"
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-secondary/50">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
              Our Expertise
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Marketing & Technology Combined
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We separate our focus to deliver excellence in both creative digital marketing and robust technological development.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyticsFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color === "primary" ? "bg-primary/10 text-primary" :
                  feature.color === "accent" ? "bg-accent/10 text-accent" :
                    "bg-success/10 text-success"
                  }`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Insights to Strategy Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-success/10 text-success rounded-full text-sm font-medium mb-4">
                Data-Driven Strategy
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                From Insights to Action
              </h2>
              <p className="text-muted-foreground mb-8">
                We don't just show you numbers – we translate data into actionable strategies
                that drive real business outcomes. Our AI-powered analysis identifies opportunities
                and provides specific recommendations for improvement.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Brain, text: "AI-powered pattern recognition and trend prediction" },
                  { icon: Zap, text: "Automated alerts for significant changes or opportunities" },
                  { icon: FileText, text: "Monthly strategy reports with clear action items" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Sample Monthly Report Preview
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Total Impressions</span>
                  <span className="font-bold">2,450,892</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Profile Reach</span>
                  <span className="font-bold">1,823,456</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Engagement Rate</span>
                  <span className="font-bold text-success">6.8%</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Link Clicks</span>
                  <span className="font-bold">12,456</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-muted-foreground">Conversions</span>
                  <span className="font-bold text-primary">4,521</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-success/10 rounded-xl">
                <p className="text-sm font-medium text-success">
                  ↑ 32% improvement vs. previous month
                </p>
              </div>
            </motion.div>
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
              Get Your Free Analytics Audit
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Let us analyze your current digital performance and show you exactly
              where the opportunities for growth are hiding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" variant="secondary" className="text-foreground">
                  Request Free Audit <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Analytics;
