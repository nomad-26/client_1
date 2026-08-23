import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Scissors } from "lucide-react";
import { Header } from "../components/Header";
import { ScrollProgress } from "../components/ScrollProgress";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp";
import { Footer } from "../components/Footer";
import { DriveCategory, FALLBACK_CATEGORIES, PortfolioApiResponse } from "../types/gallery";

export function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<DriveCategory[]>(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
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

    fetchCategories();
  }, []);

  const currentCategory = categories.find(
    (cat) => cat.slug === categorySlug || cat.id === categorySlug
  );

  const handleBackToOurWork = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/", { state: { targetSection: "our-work" } });
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-surface text-on-surface overflow-x-hidden">
      <ScrollProgress />
      <Header />

      <main className="flex-grow pt-[57px] md:pt-[73px] w-full overflow-x-hidden">
        {/* Loading State */}
        {loading && !currentCategory && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-12 md:py-20 animate-pulse">
            <div className="w-36 h-4 bg-outline-variant/60 rounded mb-8" />
            <div className="w-64 h-10 bg-outline-variant/80 rounded mb-12" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-2xl bg-surface-container-low dark:bg-zinc-900 border border-outline-variant"
                />
              ))}
            </div>
          </div>
        )}

        {/* Category Not Found State */}
        {!loading && !currentCategory && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-tertiary-container/15 text-tertiary-container flex items-center justify-center mx-auto mb-4 border border-tertiary-container/30">
              <Scissors size={28} />
            </div>
            <h1 className="font-display-lg text-2xl sm:text-4xl font-bold text-primary dark:text-white mb-3">
              Category Not Found
            </h1>
            <p className="font-body-md text-secondary text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
              This gallery category is currently unavailable or has been updated.
            </p>
            <Link
              to="/"
              onClick={handleBackToOurWork}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-on-primary font-label-caps text-xs uppercase font-semibold hover:bg-tertiary-container hover:text-primary transition-all cursor-pointer shadow-md"
            >
              <ArrowLeft size={16} /> Back to Our Work
            </Link>
          </div>
        )}

        {/* Category Image Gallery */}
        {currentCategory && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-8 sm:py-12 md:py-16 w-full">
            {/* Top Navigation Link */}
            <div className="mb-6 sm:mb-8">
              <Link
                to="/"
                onClick={handleBackToOurWork}
                className="inline-flex items-center gap-2 text-xs font-label-caps uppercase tracking-widest text-secondary hover:text-primary dark:hover:text-tertiary-container font-semibold transition-colors group cursor-pointer"
              >
                <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
                <span>Back to Our Work</span>
              </Link>
            </div>

            {/* Clean Category Heading — Strictly the folder name */}
            <div className="mb-10 sm:mb-14">
              <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl font-bold text-primary dark:text-white uppercase tracking-tight">
                {currentCategory.name}
              </h1>
            </div>

            {/* Grid of Clean Image-Only Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {currentCategory.images.map((image, idx) => (
                <Link
                  key={image.id || idx}
                  to={`/our-work/${currentCategory.slug}/${image.slug}`}
                  aria-label={image.title}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-outline-variant shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-tertiary-container/60 active:scale-[0.98] bg-zinc-950 block"
                >
                  <img
                    src={image.imageUrl || image.thumbnailUrl}
                    alt={image.title}
                    loading={idx < 4 ? "eager" : "lazy"}
                    decoding="async"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== image.thumbnailUrl) {
                        target.src = image.thumbnailUrl;
                      }
                    }}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}

export default CategoryPage;
