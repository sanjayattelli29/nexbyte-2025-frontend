import { Instagram, Facebook, Linkedin, Youtube, Twitter, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    { icon: Linkedin, url: "https://www.linkedin.com/company/nexbyte-services/" },
    { icon: Instagram, url: "https://www.instagram.com/nexbyte_tech?igsh=OWJpZnZjd25hZ2p5&utm_source=qr" },
    { icon: Twitter, url: "https://x.com/nexbyteind" }, // X icon used as Twitter
    { icon: Youtube, url: "https://youtube.com/@nexbyteind?si=XET9tJAyE4lWN413" },
    { icon: Facebook, url: "https://www.facebook.com/profile.php?id=61584986327411" },
  ];

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <img src="/n text logo.png" alt="NexByte Logo" className="h-20 w-auto object-contain" />
            </div>
            <p className="text-background/70 mb-6 max-w-md">
              Your trusted partner for comprehensive digital solutions.
              From social media management to enterprise web development,
              we help businesses grow with data-driven strategies.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-3 text-background/70">
              <li><Link to="/services/marketing" className="hover:text-background transition-colors">Marketing</Link></li>
              <li><Link to="/services/technology" className="hover:text-background transition-colors">Technology</Link></li>
              <li><Link to="/services/training" className="hover:text-background transition-colors">Training</Link></li>
              <li><Link to="/services/hackathons" className="hover:text-background transition-colors">Hackathons</Link></li>
              <li><Link to="/analytics" className="hover:text-background transition-colors">Analytics & Insights</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-background/70">
              <li><Link to="/about" className="hover:text-background transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-background transition-colors">Contact</Link></li>
              <li><Link to="/official-registration" className="hover:text-background transition-colors">Official Registration</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/50 text-sm">
            © 2026 Nexbyteind. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-background/50">
            <Link to="/privacy-policy" className="hover:text-background transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-background transition-colors">Terms of Service</Link>
          </div>
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
