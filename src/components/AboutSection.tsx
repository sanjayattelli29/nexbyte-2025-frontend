import { motion } from "framer-motion";
import { Target, Users, Award, Rocket, CheckCircle2 } from "lucide-react";

const values = [
  { icon: Target, text: "Results-Driven Approach" },
  { icon: Users, text: "Dedicated Support Team" },
  { icon: Award, text: "Industry Best Practices" },
  { icon: Rocket, text: "Innovative Solutions" },
];

const AboutSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - About content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              <span>About Our Company</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Your Partner in{" "}
              <span className="text-gradient-primary">Digital Excellence</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              NexByte Digital & Technology Services is a multi-domain organization delivering <strong>technology solutions, digital growth services, staffing support, internships, training programs, hackathons, and certifications</strong>. We help businesses scale and individuals build real-world skills.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Our team combines creativity with technical expertise to manage your complete digital and technological needs—from custom software development to advanced training programs. We believe in quality without compromise.
            </p>

            {/* Values */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <value.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">{value.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Feature card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-card rounded-3xl border border-border shadow-2xl p-8 overflow-hidden">
              <h3 className="text-2xl font-bold mb-6">Why Choose Us?</h3>

              <div className="space-y-4">
                {[
                  "End-to-end social media management across all platforms",
                  "Custom website development from simple to enterprise-scale",
                  "Data-driven strategies with comprehensive analytics",
                  "Affordable pricing without compromising quality",
                  "Dedicated team focused on your success",
                  "Proven track record with 500+ happy clients",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            </div>

            {/* Floating stat */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -top-4 -right-4 bg-gradient-primary text-primary-foreground rounded-2xl p-6 shadow-xl"
            >
              <p className="text-4xl font-bold">2+</p>
              <p className="text-sm opacity-90">Years of Excellence</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
