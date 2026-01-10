import { motion } from "framer-motion";
import {
  Share2,
  TrendingUp,
  Globe,
  Users,
  Zap,
  Ticket
} from "lucide-react";

/**
 * Updated Services Section
 * Now displays 5 main categories with redirect buttons as requested.
 */
const services = [
  {
    icon: Share2,
    title: "Complete Digital Marketing",
    description: "End-to-end management including content planning, creative posts, reels optimization, and audience engagement strategies.",
    link: "/services/marketing",
    color: "primary",
    buttonText: "Explore Marketing"
  },
  {
    icon: Globe,
    title: "Technology Services",
    description: "Custom Software Development, Web & App Development, Cloud & IT Solutions.",
    link: "/services/technology",
    color: "accent",
    buttonText: "View Tech Solutions"
  },
  {
    icon: Users,
    title: "Staffing & Talent Solutions",
    description: "IT Staffing, Contract & Full-Time Hiring, Talent Screening.",
    link: "/services/staffing",
    color: "success",
    buttonText: "Find Talent"
  },
  {
    icon: Zap,
    title: "Internships & Training",
    description: "Project-Based Internships, Real-Time Work Experience, Certificates & Experience Letters.",
    link: "/services/training",
    color: "primary",
    buttonText: "Start Learning"
  },
  {
    icon: Ticket,
    title: "Hackathons & Events",
    description: "Online & Offline Hackathons, Innovation Challenges, Winner & Participation Certificates.",
    link: "/services/hackathons",
    color: "accent",
    buttonText: "Join Events"
  },
   {
    icon: TrendingUp,
    title: "Premium Training Programs",
    description: "Join our premium training programs in AI, Full Stack Development, Data Science, and more. Gain hands-on experience, build real-world projects, and get certified to fast-track your career.",
    link: "/training-discovery",
    color: "accent",
    buttonText: "Start Learning"
  },
];

const colorClasses = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "group-hover:border-primary/30",
    buttonVariants: "bg-primary text-primary-foreground hover:bg-primary/90"
  },
  accent: {
    bg: "bg-accent/10",
    text: "text-accent",
    border: "group-hover:border-accent/30",
    buttonVariants: "bg-accent text-accent-foreground hover:bg-accent/90"
  },
  success: {
    bg: "bg-success/10",
    text: "text-success",
    border: "group-hover:border-success/30",
    buttonVariants: "bg-success text-success-foreground hover:bg-success/90"
  },
};

const ServicesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>Our Services</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Complete Technology, Talent & <br />
            <span className="text-gradient-primary">Digital Solutions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From <strong>software development and IT services</strong> to <strong>digital marketing, staffing, internships, trainings, hackathons, and certifications</strong>, NexByte supports businesses and careers end-to-end.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {services.map((service, index) => {
            const colors = colorClasses[service.color as keyof typeof colorClasses];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative p-8 rounded-2xl border border-border bg-card hover:shadow-xl transition-all duration-300 ${colors.border} flex flex-col`}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${colors.bg} ${colors.text} mb-6`}>
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">{service.description}</p>

                <a
                  href={service.link}
                  className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${colors.buttonVariants}`}
                >
                  {service.buttonText}
                </a>

                {/* Hover gradient effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Need a custom solution? <span className="text-primary font-medium">We've got you covered.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
