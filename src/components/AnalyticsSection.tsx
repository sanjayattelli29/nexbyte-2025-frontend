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
    <section className="py-4 bg-background overflow-hidden">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium mb-6">
              <BarChart3 className="w-4 h-4" />
              <span>Comprehensive Services</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Excel in <br />
              <span className="text-gradient-primary">Marketing & Tech</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We separate our expertise to provide clarity and focus. Whether you need to boost your social media presence or build robust software, we have the specialized teams to deliver.
            </p>
          </motion.div>

          {/* Feature grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </div>
      </div>
    </section>
  );
};

export default AnalyticsSection;
