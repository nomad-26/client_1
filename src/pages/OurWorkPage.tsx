import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, Sparkles, Folder } from "lucide-react";
import { Header } from "../components/Header";
import { ScrollProgress } from "../components/ScrollProgress";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp";
import { Footer } from "../components/Footer";
import { DriveCategory, FALLBACK_CATEGORIES, PortfolioApiResponse } from "../types/gallery";

export function OurWorkPage() {
  const [categories, setCategories] = useState<DriveCategory[]>(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: PortfolioApiResponse = await res.json();
      if (data && Array.isArray(data.categories) && data.categories.length > 0) {
        setCategories(data.categories);
      } else {
        setCategories(FALLBACK_CATEGORIES);
      }
    } catch {
      setCategories(FALLBACK_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-surface text-on-surface overflow-x-hidden">
      <ScrollProgress />
      <Header />

      <main className="flex-grow pt-[57px] md:pt-[73px] w-full overflow-x-hidden">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-8 sm:py-12 md:py-16 w-full">
          {/* Top Navigation Link */}
          <div className="mb-6 sm:mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-label-caps uppercase tracking-widest text-secondary hover:text-primary dark:hover:text-tertiary-container font-semibold transition-colors group cursor-pointer"
            >
              <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-14 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tertiary-container/15 text-tertiary-container text-xs font-label-caps uppercase tracking-widest font-semibold mb-3 border border-tertiary-container/30">
                <Sparkles size={13} />
                <span>Our Work</span>
              </div>
              <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl text-primary dark:text-white font-semibold">
                Our Sartorial Work
              </h1>
            </div>
            <button
              onClick={fetchCategories}
              title="Re-sync with Google Drive"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-outline-variant hover:border-tertiary-container hover:text-primary transition-all active:scale-95 cursor-pointer text-xs text-secondary font-label-caps uppercase shrink-0"
            >
              <RefreshCw size={13} className={loading ? "animate-spin text-tertiary-container" : ""} />
              <span>Refresh Portfolio</span>
            </button>
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-2xl bg-surface-container-low dark:bg-zinc-900 border border-outline-variant animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Dynamic Google Drive Category Folder Cards */}
          {!loading && categories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {categories.map((cat, idx) => (
                <Link
                  key={cat.id || idx}
                  to={`/our-work/${cat.slug}`}
                  aria-label={cat.name}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-outline-variant shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-tertiary-container/60 active:scale-[0.98] bg-zinc-950 block"
                >
                  <img
                    src={cat.coverImage || cat.images[0]?.imageUrl || "/images/work-royal-navy-suit.webp"}
                    alt={cat.name}
                    width={600}
                    height={800}
                    loading={idx < 4 ? "eager" : "lazy"}
                    decoding="async"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-6 z-10">
                    <div className="flex items-center gap-2 mb-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Folder size={15} className="text-tertiary-fixed" />
                      <span className="text-[10px] font-label-caps uppercase tracking-widest text-tertiary-fixed font-semibold">
                        Folder
                      </span>
                    </div>
                    <h2 className="font-display-lg text-lg sm:text-xl text-white font-bold uppercase tracking-wider group-hover:text-tertiary-fixed transition-colors">
                      {cat.name}
                    </h2>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && categories.length === 0 && (
            <div className="py-16 text-center bg-surface-container-low dark:bg-zinc-900/60 rounded-2xl border border-outline-variant p-8">
              <Sparkles className="text-tertiary-container mx-auto mb-3" size={32} />
              <h3 className="font-display-lg text-lg sm:text-xl font-bold text-primary dark:text-white mb-2">
                Our portfolio folders are being prepared.
              </h3>
              <p className="font-body-md text-secondary text-xs sm:text-sm max-w-md mx-auto">
                Check back shortly or visit our atelier in Salem to view our bespoke tailoring archives.
              </p>
            </div>
          )}
        </section>
      </main>

      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}

export default OurWorkPage;
