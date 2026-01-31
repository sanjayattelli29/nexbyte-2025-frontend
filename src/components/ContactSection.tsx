import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-0 bg-background">
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
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Let's Start Your Growth Journey
          </h2>
          <p className="text-muted-foreground text-lg">
            Ready to transform your digital presence? Contact us for a free consultation and discover how we can help your business thrive.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-secondary/30 rounded-2xl p-8"
          >
            <h3 className="text-xl font-semibold mb-6">Send us a message</h3>

            <form className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input placeholder="John Doe" className="bg-background" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input type="email" placeholder="john@example.com" className="bg-background" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone</label>
                  <Input type="tel" placeholder="+1 (555) 000-0000" className="bg-background" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Company</label>
                  <Input placeholder="Your Company" className="bg-background" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Service Interested In</label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                  <option value="">Select a service</option>
                  <option value="it-services">IT Services</option>
                  <option value="digital-marketing">Digital Marketing</option>
                  <option value="staffing">Staffing</option>
                  <option value="internship">Internship</option>
                  <option value="training">Training Program</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="certification">Certification</option>
                  <option value="general">General Enquiry</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea
                  placeholder="Tell us about your project and goals..."
                  className="bg-background min-h-[120px]"
                />
              </div>

              <Button variant="success" size="lg" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
              <p className="text-muted-foreground mb-8">
                We're here to help and answer any questions you might have. We look forward to hearing from you!
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email Us</h4>
                  <p className="text-muted-foreground">lokesh@nexbyte.com</p>
                  <p className="text-muted-foreground">nexbyteind@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Call Us</h4>
                  <p className="text-muted-foreground">+91 8247872473</p>
                </div>
              </div>



              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Business Hours</h4>
                  <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-muted-foreground">Saturday: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>

            {/* Quick Response Promise */}
            <div className="bg-success/10 rounded-xl p-6 border border-success/20">
              <h4 className="font-semibold text-success mb-2">Quick Response Guarantee</h4>
              <p className="text-sm text-muted-foreground">
                We respond to all inquiries within 6 hours. For urgent matters, call us directly for immediate assistance.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
