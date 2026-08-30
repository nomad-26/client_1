import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGES } from "../utils/whatsapp";

export function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLinkClick = (e: React.MouseEvent, target: string) => {
    if (target.startsWith("http") || target.startsWith("tel:") || target.startsWith("mailto:")) {
      return;
    }
    e.preventDefault();
    if (location.pathname === "/" && target.startsWith("#")) {
      const element = document.getElementById(target.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate(target);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const whatsappUrl = getWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGES.general);

  return (
    <footer className="bg-zinc-950 text-white border-t border-zinc-800/80 w-full pt-14 sm:pt-16 pb-28 sm:pb-16 pb-safe">
      {/* Main Footer Content */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 pb-12 sm:pb-14 border-b border-zinc-900">
          {/* Column 1: Brand & Atelier Mission */}
          <div className="sm:col-span-2 md:col-span-1 space-y-3.5">
            <Link
              to="/"
              onClick={(e) => handleLinkClick(e, "/")}
              className="font-display-lg text-2xl md:text-[26px] text-white block uppercase font-bold tracking-tight hover:text-tertiary-fixed transition-colors duration-300"
            >
              FANTASY KING
            </Link>
            <p className="font-label-caps text-xs text-tertiary-container uppercase tracking-wider font-semibold">
              Bespoke Tailoring &amp; Alterations
            </p>
            <p className="font-body-md text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm">
              Salem's premier destination for custom bespoke suits, shirts, designer blouses, lehengas, bridal commissions, and precision alterations.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col space-y-2.5">
            <h4 className="font-label-caps text-xs font-semibold tracking-[0.18em] text-white uppercase mb-1">
              Quick Links
            </h4>
            <Link
              to="/"
              onClick={(e) => handleLinkClick(e, "/")}
              className="font-body-md text-xs sm:text-sm text-zinc-400 hover:text-tertiary-fixed transition-colors duration-200 py-0.5"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={(e) => handleLinkClick(e, "/about")}
              className="font-body-md text-xs sm:text-sm text-zinc-400 hover:text-tertiary-fixed transition-colors duration-200 py-0.5"
            >
              About Us
            </Link>
            <Link
              to="/services"
              onClick={(e) => handleLinkClick(e, "/services")}
              className="font-body-md text-xs sm:text-sm text-zinc-400 hover:text-tertiary-fixed transition-colors duration-200 py-0.5"
            >
              Services
            </Link>
            <Link
              to="/our-work-gallery"
              onClick={(e) => handleLinkClick(e, "/our-work-gallery")}
              className="font-body-md text-xs sm:text-sm text-zinc-400 hover:text-tertiary-fixed transition-colors duration-200 py-0.5"
            >
              Our Work Gallery
            </Link>
            <Link
              to="/reviews"
              onClick={(e) => handleLinkClick(e, "/reviews")}
              className="font-body-md text-xs sm:text-sm text-zinc-400 hover:text-tertiary-fixed transition-colors duration-200 py-0.5"
            >
              Reviews
            </Link>
            <Link
              to="/contact"
              onClick={(e) => handleLinkClick(e, "/contact")}
              className="font-body-md text-xs sm:text-sm text-zinc-400 hover:text-tertiary-fixed transition-colors duration-200 py-0.5"
            >
              Contact
            </Link>
          </div>

          {/* Column 3: Atelier Services */}
          <div className="flex flex-col space-y-2.5">
            <h4 className="font-label-caps text-xs font-semibold tracking-[0.18em] text-white uppercase mb-1">
              Atelier Services
            </h4>
            <Link
              to="/services"
              onClick={(e) => handleLinkClick(e, "/services")}
              className="font-body-md text-xs sm:text-sm text-zinc-400 hover:text-tertiary-fixed transition-colors duration-200 py-0.5"
            >
              Men's Bespoke Tailoring
            </Link>
            <Link
              to="/services"
              onClick={(e) => handleLinkClick(e, "/services")}
              className="font-body-md text-xs sm:text-sm text-zinc-400 hover:text-tertiary-fixed transition-colors duration-200 py-0.5"
            >
              Women's Couture &amp; Blouses
            </Link>
            <Link
              to="/services"
              onClick={(e) => handleLinkClick(e, "/services")}
              className="font-body-md text-xs sm:text-sm text-zinc-400 hover:text-tertiary-fixed transition-colors duration-200 py-0.5"
            >
              Bridal &amp; Wedding Wear
            </Link>
            <Link
              to="/services"
              onClick={(e) => handleLinkClick(e, "/services")}
              className="font-body-md text-xs sm:text-sm text-zinc-400 hover:text-tertiary-fixed transition-colors duration-200 py-0.5"
            >
              Kids' Custom Outfits
            </Link>
            <Link
              to="/services"
              onClick={(e) => handleLinkClick(e, "/services")}
              className="font-body-md text-xs sm:text-sm text-zinc-400 hover:text-tertiary-fixed transition-colors duration-200 py-0.5"
            >
              Master Alterations &amp; Restyling
            </Link>
          </div>

          {/* Column 4: Contact & Appointments */}
          <div className="flex flex-col space-y-2.5">
            <h4 className="font-label-caps text-xs font-semibold tracking-[0.18em] text-white uppercase mb-1">
              Contact &amp; Book
            </h4>
            <a
              href="tel:+918838066960"
              className="font-body-md text-xs sm:text-sm text-zinc-300 hover:text-tertiary-fixed transition-colors duration-200 py-0.5"
            >
              +91 88380 66960
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body-md text-xs sm:text-sm text-[#25D366] hover:text-emerald-400 transition-colors duration-200 py-0.5 inline-flex items-center gap-1.5"
            >
              <span>WhatsApp Direct</span>
            </a>
            <Link
              to="/contact"
              onClick={(e) => handleLinkClick(e, "/contact")}
              className="font-body-md text-xs sm:text-sm text-tertiary-fixed hover:text-accent-light transition-colors duration-200 py-0.5 font-medium"
            >
              Book an Appointment →
            </Link>
            <p className="font-body-md text-xs text-zinc-500 pt-2 leading-relaxed">
              First Floor, Puma Showroom (opp), near Khadhims, Swarnapuri, Salem 636016
            </p>
          </div>
        </div>

        {/* Bottom Sub-Footer: Copyright & Designer Agency Credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="font-caption text-[11px] sm:text-xs text-zinc-500 uppercase tracking-wider">
            © 2026 FANTASY KING. All rights reserved.
          </p>

          <p className="font-caption text-[11px] sm:text-xs text-zinc-500 tracking-wide">
            Website by{" "}
            <a
              href="https://zogoal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-zinc-400 hover:text-tertiary-fixed transition-colors duration-300 underline decoration-zinc-700 hover:decoration-tertiary-fixed underline-offset-4"
            >
              Zogoal
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
