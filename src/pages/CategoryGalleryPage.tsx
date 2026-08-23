import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ArrowLeft,
  Scissors,
  Maximize2,
  Sparkles,
  RefreshCw,
  ImageOff,
  AlertCircle,
} from "lucide-react";
import { Header } from "../components/Header";
import { ScrollProgress } from "../components/ScrollProgress";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp";
import { Footer } from "../components/Footer";
import { GalleryLightbox } from "../components/GalleryLightbox";
import { SEO } from "../components/SEO";
import {
  getLocalBusinessSchema,
  getBreadcrumbSchema,
} from "../utils/seoSchemas";
import {
  DriveCategory,
  PortfolioApiResponse,
  CATEGORY_SUBTITLES,
  slugify,
} from "../types/gallery";

export function CategoryGalleryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const location = useLocation();

  // Fast initial category from router state if available
  const passedCategory = location.state?.category as DriveCategory | undefined;

  const [categories, setCategories] = useState<DriveCategory[]>(
    passedCategory ? [passedCategory] : []
  );
  const [loading, setLoading] = useState<boolean>(!passedCategory);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const fetchPortfolio = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/our-work?t=${Date.now()}`);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.error || `HTTP ${res.status}`);
      }
      const data: PortfolioApiResponse = await res.json();
      if (data.error) {
        setError(data.error);
      }
      setCategories(data.folders || data.categories || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load category from Google Drive");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const normalizedParam = categorySlug ? categorySlug.toLowerCase().trim() : "";

  // Resolve matching category by folder ID, slug, or folder name
  const currentCategory = categories.find((cat) => {
    if (!cat) return false;
    const catSlug = cat.slug ? cat.slug.toLowerCase().trim() : slugify(cat.name || cat.folderName || "");
    const catId = (cat.folderId || cat.id || "").toLowerCase().trim();
    const catName = slugify(cat.name || cat.folderName || "");
    return (
      catSlug === normalizedParam ||
      catId === normalizedParam ||
      catName === normalizedParam ||
      catName.replace(/-/g, "") === normalizedParam.replace(/-/g, "")
    );
  });

  const categoryName = currentCategory?.name || currentCategory?.folderName || "Category";
  const categorySubtitle =
    currentCategory?.subtitle ||
    (currentCategory?.slug ? CATEGORY_SUBTITLES[currentCategory.slug] : "") ||
    `Handcrafted ${categoryName.toLowerCase()} crafted to perfection.`;

  return (
    <div className="min-h-screen w-full flex flex-col bg-surface text-on-surface overflow-x-hidden selection:bg-tertiary-container/30">
      <SEO
        title={`${categoryName} | Bespoke Tailoring & Alterations in Salem | FANTASY KING`}
        description={`Explore FANTASY KING's ${categoryName} bespoke portfolio in Salem. Handcrafted custom stitching, precision fitting, and designer tailoring in Swarnapuri, Salem.`}
        canonicalPath={`/our-work-gallery/${categorySlug || ""}`}
        schema={[
          getLocalBusinessSchema(),
          getBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Our Work Gallery", url: "/our-work-gallery" },
            { name: categoryName, url: `/our-work-gallery/${categorySlug || ""}` },
          ]),
        ]}
      />
      <ScrollProgress />
      <Header />

      <main className="flex-grow pt-[64px] md:pt-[80px] w-full overflow-x-hidden">
        {/* Error / Diagnostic Notice */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 pt-8">
            <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Google Drive Connection Notice</h4>
                  <p className="text-xs text-red-800 leading-relaxed max-w-3xl font-body-md">
                    {error}
                  </p>
                </div>
              </div>
              <button
                onClick={fetchPortfolio}
                className="shrink-0 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-label-caps text-xs uppercase font-semibold transition-all cursor-pointer shadow-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && !currentCategory && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-12 md:py-20 animate-pulse">
            <div className="w-44 h-4 bg-zinc-200 rounded mb-8" />
            <div className="w-72 h-10 bg-zinc-200 rounded mb-4" />
            <div className="w-96 h-4 bg-zinc-100 rounded mb-12" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-2xl bg-zinc-100 border border-zinc-200"
                />
              ))}
            </div>
          </section>
        )}

        {/* Category Not Found State */}
        {!loading && !currentCategory && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-tertiary-container/15 text-tertiary-container flex items-center justify-center mx-auto mb-4 border border-tertiary-container/30">
              <Scissors size={28} />
            </div>
            <h1 className="font-display-lg text-2xl sm:text-4xl font-bold text-zinc-950 mb-3">
              Gallery Category Not Found
            </h1>
            <p className="font-body-md text-zinc-600 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
              We could not locate this folder in your Google Drive portfolio archives.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={fetchPortfolio}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-300 hover:border-tertiary-container font-label-caps text-xs uppercase font-semibold transition-all cursor-pointer"
              >
                <RefreshCw size={14} /> Retry Sync
              </button>
              <Link
                to="/our-work-gallery"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white font-label-caps text-xs uppercase font-semibold hover:bg-tertiary-container hover:text-black transition-all cursor-pointer shadow-md"
              >
                <ArrowLeft size={16} /> Back to Our Work Gallery
              </Link>
            </div>
          </section>
        )}

        {/* Category Gallery Content */}
        {currentCategory && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-8 sm:py-12 md:py-16 w-full">
            {/* Top Navigation & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              {/* Breadcrumb: Home > Our Work Gallery > Category Name */}
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 text-xs font-label-caps uppercase tracking-wider text-secondary flex-wrap"
              >
                <Link
                  to="/"
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Home
                </Link>
                <ChevronRight size={13} className="text-zinc-400" />
                <Link
                  to="/our-work-gallery"
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Our Work Gallery
                </Link>
                <ChevronRight size={13} className="text-zinc-400" />
                <span className="text-primary font-bold">{categoryName}</span>
              </nav>

              {/* Action Buttons: Sync + Back */}
              <div className="flex items-center gap-4">
                <button
                  onClick={fetchPortfolio}
                  disabled={loading}
                  title="Sync images with Google Drive"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 hover:border-tertiary-container text-zinc-600 hover:text-primary text-xs font-label-caps uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw size={12} className={loading ? "animate-spin text-tertiary-container" : ""} />
                  <span>{loading ? "Syncing..." : "Sync"}</span>
                </button>

                <Link
                  to="/our-work-gallery"
                  className="inline-flex items-center gap-2 text-xs font-label-caps uppercase tracking-widest text-zinc-700 hover:text-tertiary-container font-semibold transition-colors group cursor-pointer"
                >
                  <ArrowLeft
                    size={14}
                    className="transform group-hover:-translate-x-1 transition-transform"
                  />
                  <span>Back to Our Work Gallery</span>
                </Link>
              </div>
            </div>

            {/* Category Header */}
            <div className="mb-10 sm:mb-14">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tertiary-container/15 text-tertiary-container text-xs font-label-caps uppercase tracking-widest font-semibold mb-3 border border-tertiary-container/30">
                <Sparkles size={13} />
                <span>
                  {currentCategory.imageCount} {currentCategory.imageCount === 1 ? "Bespoke Showcase" : "Bespoke Showcases"}
                </span>
              </div>
              <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-950 tracking-tight mb-3">
                {categoryName}
              </h1>
              <p className="font-headline-md text-base sm:text-xl text-tertiary-container font-semibold mb-2">
                {categorySubtitle}
              </p>
              {currentCategory.description && (
                <p className="font-body-md text-xs sm:text-sm md:text-base text-zinc-600 max-w-2xl leading-relaxed">
                  {currentCategory.description}
                </p>
              )}
            </div>

            {/* Gallery Image Grid */}
            {currentCategory.images && currentCategory.images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
                {currentCategory.images.map((image, idx) => (
                  <motion.div
                    key={image.id || image.fileId || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.04 }}
                    onClick={() => setActiveImageIndex(idx)}
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-200 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-tertiary-container/80 active:scale-[0.98] bg-zinc-950 block"
                  >
                    <img
                      src={image.imageUrl || image.thumbnailUrl}
                      alt={`FANTASY KING ${categoryName} bespoke tailoring Salem - ${image.title}`}
                      loading={idx < 4 ? "eager" : "lazy"}
                      decoding="async"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (image.thumbnailUrl && target.src !== image.thumbnailUrl) {
                          target.src = image.thumbnailUrl;
                        }
                      }}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-106"
                    />

                    {/* Gradient Overlay & Hover Information */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-60 group-hover:opacity-95 transition-opacity duration-300 flex flex-col justify-between p-5 z-10">
                      <div className="flex justify-end">
                        <span className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 border border-white/20">
                          <Maximize2 size={14} />
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-label-caps uppercase tracking-widest text-tertiary-fixed font-semibold block mb-1">
                          Fantasy King Salem
                        </span>
                        <h3 className="font-display-lg text-base sm:text-lg text-white font-bold tracking-wide">
                          {image.title}
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* Empty Folder State */
              <div className="py-16 text-center bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm">
                <ImageOff className="text-tertiary-container mx-auto mb-3" size={36} />
                <h3 className="font-display-lg text-lg sm:text-xl font-bold text-zinc-950 mb-2">
                  No work uploaded yet
                </h3>
                <p className="font-body-md text-zinc-600 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
                  Photographs for the <strong className="text-zinc-900">{categoryName}</strong> collection will appear here when uploaded to Google Drive.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={fetchPortfolio}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-300 hover:border-tertiary-container text-xs font-label-caps uppercase font-semibold transition-all cursor-pointer"
                  >
                    <RefreshCw size={13} /> Refresh
                  </button>
                  <Link
                    to="/our-work-gallery"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white font-label-caps text-xs uppercase font-semibold hover:bg-tertiary-container hover:text-black transition-all shadow-sm"
                  >
                    <ArrowLeft size={14} /> Back to Our Work Gallery
                  </Link>
                </div>
              </div>
            )}

            {/* Bottom Navigation & CTA */}
            <div className="mt-12 sm:mt-16 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link
                to="/our-work-gallery"
                className="inline-flex items-center gap-2 text-xs font-label-caps uppercase tracking-widest text-zinc-700 hover:text-tertiary-container font-semibold transition-colors group cursor-pointer"
              >
                <ArrowLeft
                  size={14}
                  className="transform group-hover:-translate-x-1 transition-transform"
                />
                <span>Back to Our Work Gallery</span>
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white hover:bg-tertiary-container hover:text-black font-label-caps text-xs uppercase font-semibold transition-all shadow-sm active:scale-95"
              >
                <span>Book Fitting Appointment</span>
              </Link>
            </div>
          </section>
        )}
      </main>

      {/* Lightbox Modal */}
      {currentCategory && currentCategory.images && currentCategory.images.length > 0 && (
        <GalleryLightbox
          images={currentCategory.images}
          currentIndex={activeImageIndex ?? 0}
          isOpen={activeImageIndex !== null}
          onClose={() => setActiveImageIndex(null)}
          onNavigate={(index) => setActiveImageIndex(index)}
        />
      )}

      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}

export default CategoryGalleryPage;
