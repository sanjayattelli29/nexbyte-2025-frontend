import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import ReadMore from "@/components/ReadMore";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [caseStudies, setCaseStudies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/testimonials`);
        const resData = await response.json();
        if (resData.success) {
          const allData = resData.data || [];
          // Filter and limit to recent 3 for display
          setTestimonials(allData.filter((i: any) => i.type === 'testimonial' && i.isActive).slice(0, 3));
          setCaseStudies(allData.filter((i: any) => i.type === 'caseStudy' && i.isActive).slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching testimonials", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return null; // Or a skeleton loader
  if (testimonials.length === 0 && caseStudies.length === 0) return null;

  return (
    <section className="py-8 bg-secondary/30">
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
        {testimonials.length > 0 && (
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
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>

                {/* Content */}
                {/* Content */}
                <ReadMore
                  text={`"${testimonial.quote}"`}
                  className="text-muted-foreground mb-6 leading-relaxed"
                  maxLength={150}
                />

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{testimonial.client?.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.client?.company}</p>
                  </div>
                  {testimonial.highlightMetric?.value && (
                    <div className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-semibold">
                      {testimonial.highlightMetric.value}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Case Studies */}
        {caseStudies.length > 0 && (
          <>
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

                  <ReadMore
                    text={study.challenge}
                    className="text-sm text-muted-foreground mb-4"
                    maxLength={100}
                  />

                  <div className="pt-4 border-t border-border/50">
                    {study.results && study.results[0] && (
                      <p className="text-success font-semibold">{study.results[0].value} {study.results[0].label}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
