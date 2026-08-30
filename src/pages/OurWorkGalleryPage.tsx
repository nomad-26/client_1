import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Folder,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Scissors,
  MessageCircle,
} from "lucide-react";
import { Header } from "../components/Header";
import { ScrollProgress } from "../components/ScrollProgress";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import {
  getLocalBusinessSchema,
  getBreadcrumbSchema,
} from "../utils/seoSchemas";
import { DriveCategory, PortfolioApiResponse } from "../types/gallery";
import { getWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGES } from "../utils/whatsapp";

const BACKGROUND_REFRESH_INTERVAL_MS = 60 * 1000; // 60 seconds

export function OurWorkGalleryPage() {
  const [categories, setCategories] = useState<DriveCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async (isBackground = false) => {
    if (!isBackground) {
      setLoading(true);
      setError(null);
    }

    try {
      const res = await fetch(`/api/our-work?t=${Date.now()}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data: PortfolioApiResponse = await res.json();
      if (data.error && (!data.categories || data.categories.length === 0)) {
        setError("Gallery temporarily unavailable. Please check back shortly.");
      } else {
        const catList = data.folders || data.categories || [];
        setCategories(catList);
        setError(null);
      }
    } catch (err: any) {
      if (!isBackground) {
        setError("Gallery temporarily unavailable. Please check back shortly.");
      }
    } finally {
      if (!isBackground) {
        setLoading(false);
      }
    }
  }, []);

  // 1. Initial automatic load
  useEffect(() => {
    fetchCategories(false);
  }, [fetchCategories]);

  // 2. Invisible background refresh on focus/visibility change & periodic interval
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchCategories(true);
      }
    };

    const handleFocus = () => {
      fetchCategories(true);
    };

    const intervalId = setInterval(() => {
      fetchCategories(true);
    }, BACKGROUND_REFRESH_INTERVAL_MS);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchCategories]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-surface text-on-surface overflow-x-hidden selection:bg-tertiary-container/30">
      <SEO
        title="Bespoke Tailoring & Alteration Portfolio in Salem | FANTASY KING"
        description="View FANTASY KING's bespoke tailoring and garment alteration portfolio in Salem. Real photographs of custom suits, designer blouses, bridal wear & restyling."
        canonicalPath="/our-work-gallery"
        schema={[
          getLocalBusinessSchema(),
          getBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Our Work Gallery", url: "/our-work-gallery" },
          ]),
        ]}
      />
      <ScrollProgress />
      <Header />

      <main className="flex-grow pt-[64px] md:pt-[80px] w-full overflow-x-hidden">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-8 sm:py-12 md:py-16 w-full">
          {/* Top Breadcrumb */}
          <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs font-label-caps uppercase tracking-wider text-secondary"
            >
              <Link
                to="/"
                className="hover:text-primary transition-colors cursor-pointer"
              >
                Home
              </Link>
              <ChevronRight size={13} className="text-zinc-400" />
              <span className="text-primary font-bold">Our Work Gallery</span>
            </nav>
          </div>

          {/* Customer-Facing Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tertiary-container/15 text-tertiary-container text-xs font-label-caps uppercase tracking-widest font-semibold mb-4 border border-tertiary-container/30">
              <Sparkles size={13} />
              <span>Bespoke Tailoring Portfolio</span>
            </div>
            <h1 className="font-display-lg text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-zinc-950 font-bold mb-3 tracking-tight">
              Bespoke Tailoring &amp; Garment Alteration Portfolio in Salem
            </h1>
            <p className="font-headline-md text-base sm:text-xl md:text-2xl text-tertiary-container font-semibold mb-3">
              Crafted with Precision in Salem. Designed for You.
            </p>
            <p className="font-body-md text-zinc-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Browse our bespoke creations by category to explore our latest bespoke suits, bridal wear, designer blouses, and precision garment alterations in Swarnapuri, Salem.
            </p>
            <div className="w-20 sm:w-24 h-1 bg-tertiary-container mx-auto rounded-full mt-6" />
          </div>

          {/* Clean Customer-Friendly Error State */}
          {error && (
            <div className="mb-10 p-8 rounded-2xl bg-white border border-zinc-200 text-center max-w-xl mx-auto shadow-sm">
              <Scissors size={36} className="text-tertiary-container mx-auto mb-3" />
              <h3 className="font-display-lg text-lg sm:text-xl font-bold text-zinc-950 mb-2">
                Gallery temporarily unavailable
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 mb-6 leading-relaxed">
                We are currently updating our bespoke collection. Please check back shortly or connect directly with our master tailor.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => fetchCategories(false)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-label-caps text-xs uppercase font-semibold transition-all cursor-pointer shadow-sm active:scale-95 inline-flex items-center justify-center gap-2"
                >
                  <RefreshCw size={12} />
                  <span>Try again</span>
                </button>
                <a
                  href={getWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGES.consultation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-label-caps text-xs uppercase font-semibold transition-all cursor-pointer shadow-sm inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp Atelier</span>
                </a>
              </div>
            </div>
          )}

          {/* Clean Skeleton Loading State */}
          {loading && categories.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-56 rounded-2xl bg-white border border-zinc-200/80 p-7 animate-pulse flex flex-col justify-between shadow-sm"
                >
                  <div className="w-16 h-16 rounded-2xl bg-amber-50/70 border border-amber-100" />
                  <div className="space-y-2">
                    <div className="w-32 h-5 bg-zinc-200 rounded" />
                    <div className="w-20 h-4 bg-zinc-100 rounded" />
                  </div>
                  <div className="pt-3 border-t border-zinc-100 flex justify-between">
                    <div className="w-16 h-3 bg-zinc-100 rounded" />
                    <div className="w-12 h-3 bg-zinc-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Dynamic Category Cards Grid */}
          {!loading && categories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
              {categories.map((cat, idx) => (
                <motion.div
                  key={cat.folderId || cat.id || cat.slug || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                >
                  <Link
                    to={`/our-work-gallery/${cat.slug || cat.folderId || cat.id}`}
                    state={{ category: cat }}
                    aria-label={`View ${cat.name || cat.folderName} gallery`}
                    className="group block relative bg-white rounded-2xl p-7 sm:p-8 border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-tertiary-container/80 transition-all duration-300 transform hover:-translate-y-1.5 active:scale-[0.98] cursor-pointer"
                  >
                    {/* Subtle top gold accent bar on hover */}
                    <div className="absolute top-0 left-6 right-6 h-[3px] bg-tertiary-container scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b" />

                    {/* Folder Icon with Gold Styling */}
                    <div className="mb-5 inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-amber-50/70 border border-amber-200/60 group-hover:bg-tertiary-container/20 group-hover:border-tertiary-container/80 transition-all duration-300">
                      <Folder
                        size={36}
                        className="text-tertiary-container fill-tertiary-container/30 group-hover:fill-tertiary-container/50 group-hover:scale-110 transition-all duration-300"
                      />
                    </div>

                    {/* Category Name */}
                    <h2 className="font-display-lg text-lg sm:text-xl font-bold text-zinc-950 group-hover:text-tertiary-container transition-colors mb-2 tracking-tight">
                      {cat.name || cat.folderName}
                    </h2>

                    {/* Dynamic Image Count & Explore Action */}
                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                      <span className="text-xs font-label-caps uppercase tracking-wider text-zinc-500 font-semibold">
                        {cat.imageCount} {cat.imageCount === 1 ? "Creation" : "Creations"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-label-caps uppercase tracking-wider text-tertiary-container font-bold opacity-80 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all">
                        <span>Explore</span>
                        <ArrowRight size={13} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Clean Customer-Facing Empty State (Zero Technical CMS Text) */}
          {!loading && categories.length === 0 && !error && (
            <div className="py-16 text-center bg-white rounded-2xl border border-zinc-200 p-8 sm:p-12 shadow-sm max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-center mx-auto mb-4 text-tertiary-container">
                <Sparkles size={32} />
              </div>
              <h3 className="font-display-lg text-xl sm:text-2xl font-bold text-zinc-950 mb-2">
                Our latest work is being prepared
              </h3>
              <p className="font-body-md text-zinc-600 text-xs sm:text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Our master tailors are currently updating our bespoke collection with our newest alterations and custom suits. Please check back shortly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/contact"
                  className="w-full sm:w-auto px-7 py-3 rounded-full bg-tertiary-container hover:bg-yellow-500 text-black font-label-caps text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-md inline-flex items-center justify-center gap-2"
                >
                  <span>Book Atelier Consultation</span>
                  <ArrowRight size={14} />
                </Link>
                <a
                  href={getWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGES.consultation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-label-caps text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-sm inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp Master Tailor</span>
                </a>
              </div>
            </div>
          )}

          {/* Atelier Consultation Callout Box */}
          <div className="mt-14 sm:mt-18 rounded-2xl bg-zinc-950 text-white p-7 sm:p-10 border border-zinc-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-label-caps uppercase tracking-[0.2em] text-tertiary-fixed font-semibold block mb-2">
                Have A Unique Design In Mind?
              </span>
              <h3 className="font-display-lg text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                Custom Tailoring &amp; Private Atelier Appointments
              </h3>
              <p className="font-body-md text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
                Bring your fabric swatches or design references. Our master tailors will take precise measurements and draft a bespoke pattern exclusively for you.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                to="/services"
                className="min-h-[46px] px-6 py-3 rounded-full border border-zinc-700 hover:border-tertiary-container text-white font-label-caps text-xs font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-2 hover:bg-zinc-900 transition-all cursor-pointer"
              >
                <span>Explore Services</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                to="/contact"
                className="min-h-[46px] px-7 py-3 rounded-full bg-tertiary-container hover:bg-yellow-500 text-black font-label-caps text-xs font-bold uppercase tracking-widest inline-flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>Book Appointment</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}

export default OurWorkGalleryPage;
