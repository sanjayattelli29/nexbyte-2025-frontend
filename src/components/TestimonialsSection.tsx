import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "CEO, TechStart Inc.",
    content: "DigitalPro transformed our online presence completely. Our engagement increased by 340% in just 3 months. Their data-driven approach and creative content strategy exceeded all expectations.",
    rating: 5,
    metric: "340% Growth",
  },
  {
    name: "David Chen",
    role: "Marketing Director, GrowthHub",
    content: "The analytics insights provided by DigitalPro helped us understand our audience like never before. We've seen a significant ROI improvement and our brand visibility has skyrocketed.",
    rating: 5,
    metric: "280% ROI",
  },
  {
    name: "Emily Rodriguez",
    role: "Founder, StyleBoutique",
    content: "From website development to social media management, DigitalPro handled everything professionally. Our e-commerce sales doubled within the first quarter of working together.",
    rating: 5,
    metric: "2x Sales",
  },
];

const caseStudies = [
  {
    title: "E-commerce Brand Revival",
    industry: "Digital Marketing",
    challenge: "Declining online sales and poor social engagement",
    result: "250% increase in online revenue",
    duration: "6 months",
  },
  {
    title: "Custom CRM Solution",
    industry: "Software Development",
    challenge: "Inefficient legacy systems slowing down operations",
    result: "40% efficiency boost",
    duration: "4 months",
  },
  {
    title: "Summer Internship Batch",
    industry: "Internship Program",
    challenge: "Bridging the gap between theory and practice",
    result: "50+ Students Certified",
    duration: "2 months",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Success Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Trusted by Businesses & Learners
          </h2>
          <p className="text-muted-foreground text-lg">
            See how we've helped businesses grow and individuals launch their careers.
          </p>
        </motion.div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-2xl p-6 shadow-sm border border-border/50 relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{index === 0 ? "Client Testimonial" : index === 1 ? "Intern Feedback" : "Training Participant"}</p>
                </div>
                <div className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-semibold">
                  {testimonial.metric}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Case Studies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl font-bold">Success Stories Across Services</h3>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">
                  {study.industry}
                </span>
                <span className="text-xs text-muted-foreground">{study.duration}</span>
              </div>

              <h4 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {study.title}
              </h4>

              <p className="text-sm text-muted-foreground mb-4">
                {study.challenge}
              </p>

              <div className="pt-4 border-t border-border/50">
                <p className="text-success font-semibold">{study.result}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
