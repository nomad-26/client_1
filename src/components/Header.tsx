import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ArrowRight, MessageCircle } from "lucide-react";
import { getWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGES } from "@/utils/whatsapp";

interface NavSection {
  id: string;
  label: string;
  routePath: string;
}

const NAV_SECTIONS: NavSection[] = [
  { id: "home", label: "Home", routePath: "/" },
  { id: "about", label: "About Us", routePath: "/about" },
  { id: "services", label: "Services", routePath: "/services" },
  { id: "our-work", label: "Our Work", routePath: "/our-work-gallery" },
  { id: "reviews", label: "Reviews", routePath: "/reviews" },
  { id: "contact", label: "Contact", routePath: "/contact" },
];

interface HeaderProps {
  activeSection?: string;
  onNavigateSection?: (id: string) => void;
}

export function Header({ activeSection: activeSectionProp, onNavigateSection }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Determine active section dynamically based on current route or scroll position
  useEffect(() => {
    if (activeSectionProp) {
      setActiveSection(activeSectionProp);
      return;
    }

    const pathname = location.pathname;

    if (pathname.startsWith("/our-work")) {
      setActiveSection("our-work");
      return;
    }
    if (pathname === "/about") {
      setActiveSection("about");
      return;
    }
    if (pathname === "/services") {
      setActiveSection("services");
      return;
    }
    if (pathname === "/reviews") {
      setActiveSection("reviews");
      return;
    }
    if (pathname === "/contact") {
      setActiveSection("contact");
      return;
    }

    // When on continuous single-page Home ("/")
    if (pathname === "/") {
      if (location.hash) {
        const hashId = location.hash.replace("#", "");
        if (hashId === "appointment") {
          setActiveSection("contact");
          return;
        }
        if (NAV_SECTIONS.some((s) => s.id === hashId)) {
          setActiveSection(hashId);
          return;
        }
      }

      const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      };

      const handleIntersect: IntersectionObserverCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      };

      const observer = new IntersectionObserver(handleIntersect, observerOptions);

      NAV_SECTIONS.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (el) observer.observe(el);
      });

      return () => observer.disconnect();
    }
  }, [activeSectionProp, location.pathname, location.hash]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent, item: NavSection) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (onNavigateSection) {
      onNavigateSection(item.id);
      return;
    }

    if (location.pathname === "/") {
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `#${item.id}`);
        setActiveSection(item.id);
      }
    } else {
      navigate(item.routePath);
    }
  };

  const handleBookClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname === "/") {
      const target = document.getElementById("appointment") || document.getElementById("contact");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveSection("contact");
      }
    } else {
      navigate("/contact");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 pt-safe transition-all duration-200 shadow-sm">
      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center px-6 lg:px-16 py-3.5 w-full max-w-7xl mx-auto">
        {/* Brand: [ Logo Mark ] FANTASY KING */}
        <Link
          to="/"
          onClick={(e) => handleNavClick(e, NAV_SECTIONS[0])}
          aria-label="Fantasy King Home"
          className="flex items-center gap-3 cursor-pointer group shrink-0 select-none"
        >
          <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-zinc-200 group-hover:border-tertiary-container/70 transition-all duration-300 shadow-sm bg-white">
            <img
              src="/images/fantasy-king-logo.webp"
              alt="Fantasy King"
              width={48}
              height={48}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-[center_10%] scale-135 transition-transform duration-300 group-hover:scale-145"
            />
          </div>
          <span className="font-display-lg text-xl lg:text-[22px] tracking-tight font-bold text-zinc-950 uppercase leading-none group-hover:text-tertiary-container transition-colors duration-200">
            FANTASY KING
          </span>
        </Link>

        {/* Section Navigation Links with Gold Underline Active & Hover Transitions */}
        <nav className="flex gap-6 lg:gap-8 items-center" aria-label="Main Navigation">
          {NAV_SECTIONS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={location.pathname === "/" ? `#${item.id}` : item.routePath}
                onClick={(e) => handleNavClick(e, item)}
                className={`group relative font-label-caps text-xs tracking-[0.15em] uppercase py-1.5 transition-colors duration-200 cursor-pointer select-none ${
                  isActive
                    ? "text-zinc-950 font-bold"
                    : "text-zinc-600 hover:text-zinc-950 font-medium"
                }`}
              >
                <span>{item.label}</span>
                {/* Thin Fantasy King gold underline */}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-tertiary-container transition-all duration-300 ease-out pointer-events-none ${
                    isActive
                      ? "w-full opacity-100"
                      : "w-0 group-hover:w-full opacity-0 group-hover:opacity-100"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-5">
          <button
            onClick={handleBookClick}
            className="bg-black text-white font-label-caps text-xs tracking-[0.15em] font-semibold uppercase px-6 py-3 rounded-none hover:bg-tertiary-container hover:text-black transition-all duration-200 cursor-pointer shadow-sm active:scale-95 inline-flex items-center justify-center"
          >
            Book Appointment
          </button>
          <a
            href={getWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGES.styleHelp)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with FANTASY KING on WhatsApp"
            className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-900 hover:text-tertiary-container hover:bg-black/5 transition-all cursor-pointer active:scale-90"
          >
            <MessageCircle size={22} />
          </a>
        </div>
      </div>

      {/* Mobile Header Bar */}
      <div className="flex md:hidden justify-between items-center px-4 sm:px-6 py-2.5 w-full">
        {/* Brand: [ Logo Mark ] FANTASY KING */}
        <Link
          to="/"
          onClick={(e) => handleNavClick(e, NAV_SECTIONS[0])}
          aria-label="Fantasy King Home"
          className="flex items-center gap-2.5 cursor-pointer group shrink-0 select-none"
        >
          <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-zinc-200 shadow-sm bg-white">
            <img
              src="/images/fantasy-king-logo.webp"
              alt="Fantasy King"
              width={36}
              height={36}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-[center_10%] scale-135"
            />
          </div>
          <span className="font-display-lg text-lg xs:text-xl tracking-tight font-bold text-zinc-950 uppercase leading-none truncate max-w-[170px] xs:max-w-[210px]">
            FANTASY KING
          </span>
        </Link>

        {/* Mobile Action Controls */}
        <div className="flex items-center gap-1">
          <a
            href={getWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGES.styleHelp)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with FANTASY KING on WhatsApp"
            className="w-11 h-11 flex items-center justify-center text-zinc-900 active:scale-90"
          >
            <MessageCircle size={22} />
          </a>
          <button
            aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-11 h-11 flex items-center justify-center text-zinc-900 focus:outline-none cursor-pointer rounded-lg active:bg-black/5"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop & Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white border-b border-zinc-200 px-5 py-6 shadow-2xl max-h-[calc(100vh-57px)] overflow-y-auto pb-safe">
            <nav className="flex flex-col gap-2">
              {NAV_SECTIONS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={location.pathname === "/" ? `#${item.id}` : item.routePath}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`font-label-caps text-sm tracking-[0.15em] uppercase min-h-[48px] px-4 rounded-xl flex items-center justify-between transition-all duration-200 active:scale-[0.98] ${
                      isActive
                        ? "bg-tertiary-container/15 text-zinc-950 font-bold border-l-4 border-tertiary-container"
                        : "text-zinc-700 hover:text-zinc-950 active:bg-zinc-100 font-medium"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-tertiary-container" />}
                  </a>
                );
              })}

              <div className="pt-4 mt-2 border-t border-zinc-200 space-y-3">
                <button
                  onClick={handleBookClick}
                  className="w-full min-h-[48px] bg-black text-white font-label-caps text-xs tracking-[0.15em] font-semibold uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-tertiary-container hover:text-black transition-all active:scale-[0.98] shadow-md"
                >
                  <span>Book Appointment</span>
                  <ArrowRight size={15} />
                </button>
                <a
                  href={getWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGES.styleHelp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full min-h-[48px] bg-[#25D366] text-white font-label-caps text-xs tracking-[0.15em] font-semibold uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all active:scale-[0.98] shadow-sm"
                >
                  <MessageCircle size={17} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
