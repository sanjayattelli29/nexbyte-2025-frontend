import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Events", href: "/events" },
  { label: "Platforms", href: "/platforms" },
  { label: "Analytics", href: "/analytics" },
  { label: "About", href: "/about" },
  { label: "LinkedIn Benefits", href: "/linkedin-benefits" },
  { label: "Webinars", href: "/webinars" },
  {
    label: "Social Posts",
    href: "#",
    children: [
      { label: "Social Feed", href: "/social-posts" },
      { label: "AI Goals", href: "/ai-posts" }
    ],
  },
  {
    label: "Tech Posts",
    href: "#",
    children: [
      { label: "Python", href: "/tech-posts?category=Python" },
      { label: "Oracle DBA", href: "/tech-posts?category=ORACLE%20DBA" },
      { label: "SQL Server DBA", href: "/tech-posts?category=SQL%20SERVER%20DBA" },
      { label: "MySQL", href: "/tech-posts?category=MY%20SQL" },
      { label: "PostgreSQL", href: "/tech-posts?category=POSTGRESS" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isTransparentPage = location.pathname === "/webinars" || location.pathname === "/ai-posts"; // pages with dark hero
  // If transparent page and at top, use white text. Else, default (dark in light theme).
  const isWhiteText = isTransparentPage && !isScrolled && !isMobileMenuOpen;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen
        ? "bg-background/95 backdrop-blur-md shadow-md py-3"
        : "bg-transparent py-5"
        }`}
    >
      <div className="container px-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/N logo .png" alt="NexByte Logo" className="w-10 h-10" />
            <span className={`text-xl font-bold ${isWhiteText ? "text-white" : "text-foreground"}`}>Nexbyteind</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <DropdownMenu open={openDropdown === link.label} modal={false}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`flex items-center gap-1 text-sm font-medium transition-colors ${isWhiteText
                          ? "text-white/90 hover:text-white"
                          : "text-muted-foreground hover:text-primary"
                          }`}
                      >
                        {link.label}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {link.children.map((child) => (
                        <DropdownMenuItem key={child.label} asChild>
                          <Link to={child.href}>{child.label}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-sm font-medium transition-colors ${isWhiteText
                    ? "text-white/90 hover:text-white"
                    : "text-muted-foreground hover:text-primary"
                    }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button variant="success" onClick={() => navigate("/services")}>
              Get Started
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 ${isWhiteText ? "text-white" : "text-foreground"}`}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="md:hidden mt-4 bg-background rounded-xl shadow-lg p-4"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <button
                      onClick={() =>
                        setMobileDropdown(
                          mobileDropdown === link.label ? null : link.label
                        )
                      }
                      className="flex w-full items-center justify-between py-2 text-sm font-medium text-muted-foreground"
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${mobileDropdown === link.label ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {mobileDropdown === link.label && (
                      <div className="ml-4 flex flex-col gap-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-sm text-muted-foreground hover:text-primary"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                  >
                    {link.label}
                  </Link>
                )
              )}

              <Button
                variant="success"
                className="mt-4"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate("/services");
                }}
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Navbar;
