import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Eye, Target, Lightbulb, PieChart, Smartphone, Cloud, Laptop, Code, Video, Share2 } from "lucide-react";

const analyticsFeatures = [
  {
    icon: Share2,
    title: "Social Media Growth",
    description: "Boost followers and engagement with strategic content planning.",
  },
  {
    icon: Video,
    title: "Reels & Video",
    description: "Viral video production to capture and retain audience attention.",
  },
  {
    icon: Target,
    title: "Audience Targeting",
    description: "Reach the right people with data-backed engagement strategies.",
  },
  {
    icon: Code,
    title: "Custom Software",
    description: "Tailored software solutions to streamline your business operations.",
  },
  {
    icon: Smartphone,
    title: "App Development",
    description: "Native and cross-platform mobile apps for iOS and Android.",
  },
  {
    icon: Cloud,
    title: "Cloud Solutions",
    description: "Scalable infrastructure and digital transformation services.",
  },
];

const AnalyticsSection = () => {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium mb-6">
              <BarChart3 className="w-4 h-4" />
              <span>Comprehensive Services</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Excel in <br />
              <span className="text-gradient-primary">Marketing & Tech</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We separate our expertise to provide clarity and focus. Whether you need to boost your social media presence or build robust software, we have the specialized teams to deliver.
            </p>

            {/* Feature grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {analyticsFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Analytics visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Dashboard mockup */}
            <div className="relative bg-card rounded-3xl border border-border shadow-2xl p-6 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="font-semibold">Performance Overview</h4>
                  <p className="text-sm text-muted-foreground">Last 30 days</p>
                </div>
                <div className="flex items-center gap-2 text-success text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  +127% Growth
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Impressions", value: "2.4M", change: "+24%" },
                  { label: "Engagement", value: "186K", change: "+18%" },
                  { label: "Conversions", value: "4.2K", change: "+32%" },
                ].map((stat, index) => (
                  <div key={index} className="p-4 rounded-xl bg-secondary/50">
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-success">{stat.change}</p>
                  </div>
                ))}
              </div>

              {/* Chart placeholder */}
              <div className="h-48 rounded-xl bg-secondary/30 flex items-end justify-around px-4 pb-4">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="w-4 rounded-t-lg bg-gradient-to-t from-primary to-primary/60"
                  />
                ))}
              </div>

              {/* Decorative glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-success/20 rounded-full blur-3xl" />
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-6 -left-6 bg-card rounded-2xl border border-border shadow-xl p-4 flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-success flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Growth</p>
                <p className="text-xl font-bold">+45.2%</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsSection;
