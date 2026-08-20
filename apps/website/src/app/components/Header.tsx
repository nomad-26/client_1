"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  id: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#home", id: "home" },
  { label: "About Us", href: "#about", id: "about" },
  { label: "Services", href: "#services", id: "services" },
  { label: "Our Work", href: "#work", id: "work" },
  { label: "Reviews", href: "#reviews", id: "reviews" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export function Header() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Monitor scroll position to update active nav link
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (const item of NAV_ITEMS) {
        const element = document.getElementById(item.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.hash = href;
    }
  };

  const handleBookClick = () => {
    setMobileMenuOpen(false);
    const target = document.getElementById("contact") || document.getElementById("appointment");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/95 dark:bg-surface/95 backdrop-blur-md border-b border-secondary-container dark:border-on-secondary-fixed-variant">
      {/* Desktop Header */}
      <div className="flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto hidden md:flex">
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "#home")}
          className="font-display-lg text-[24px] tracking-tighter text-primary dark:text-on-primary-fixed uppercase cursor-pointer"
        >
          FANTACY KING
        </a>

        <nav className="flex gap-8 items-center" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`font-label-caps text-[12px] tracking-[0.15em] uppercase transition-all duration-200 pb-1 cursor-pointer ${isActive
                    ? "text-primary dark:text-tertiary-fixed border-b border-tertiary-fixed font-semibold"
                    : "text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-on-primary-fixed font-medium border-b border-transparent hover:border-tertiary-container/40"
                  }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-6">
          <button
            onClick={handleBookClick}
            className="bg-primary text-on-primary font-label-caps text-[12px] tracking-[0.15em] font-semibold uppercase px-6 py-3 hover:bg-tertiary-container hover:text-primary transition-colors cursor-pointer"
          >
            Book Appointment
          </button>
          <button
            onClick={handleBookClick}
            aria-label="Chat with stylist"
            className="text-primary hover:text-tertiary-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">chat</span>
          </button>
        </div>
      </div>

      {/* Mobile Header Bar */}
      <div className="flex justify-between items-center px-margin-mobile py-4 md:hidden">
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "#home")}
          className="font-display-lg text-[20px] tracking-tighter text-primary uppercase"
        >
          FANTACY KING
        </a>
        <button
          aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-primary p-1 focus:outline-none cursor-pointer"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown / Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface dark:bg-surface-container-lowest border-b border-outline-variant px-margin-mobile py-6 shadow-xl">
          <nav className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`font-label-caps text-[14px] tracking-[0.15em] uppercase py-2 transition-colors cursor-pointer ${isActive
                      ? "text-primary dark:text-tertiary-fixed font-bold border-l-2 border-tertiary-fixed pl-3"
                      : "text-secondary hover:text-primary pl-3"
                    }`}
                >
                  {item.label}
                </a>
              );
            })}
            <div className="pt-4 border-t border-outline-variant flex flex-col gap-3">
              <button
                onClick={handleBookClick}
                className="w-full bg-primary text-on-primary font-label-caps text-[12px] tracking-[0.15em] font-semibold uppercase py-3 text-center hover:bg-tertiary-container hover:text-primary transition-colors cursor-pointer"
              >
                Book Appointment
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
