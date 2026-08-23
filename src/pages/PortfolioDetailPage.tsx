import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Scissors,
  Calendar,
} from "lucide-react";
import { Header } from "../components/Header";
import { ScrollProgress } from "../components/ScrollProgress";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp";
import { Footer } from "../components/Footer";
import {
  DriveCategory,
  DriveImage,
  FALLBACK_CATEGORIES,
  PortfolioApiResponse,
} from "../types/gallery";
import { getWhatsAppUrl } from "../utils/whatsapp";

export function PortfolioDetailPage() {
  const { categorySlug, imageSlug, slug } = useParams<{
    categorySlug?: string;
    imageSlug?: string;
    slug?: string;
  }>();

  const navigate = useNavigate();
  const targetImageSlug = imageSlug || slug;

  const [categories, setCategories] = useState<DriveCategory[]>(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
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

    fetchPortfolio();
  }, []);

  // Find all images across all categories
  const allImages: DriveImage[] = categories.flatMap((cat) => cat.images);

  // Find active image
  let currentImage: DriveImage | undefined;
  if (categorySlug && targetImageSlug) {
    const cat = categories.find((c) => c.slug === categorySlug || c.id === categorySlug);
    currentImage = cat?.images.find((img) => img.slug === targetImageSlug || img.id === targetImageSlug);
  }

  if (!currentImage && targetImageSlug) {
    currentImage = allImages.find((img) => img.slug === targetImageSlug || img.id === targetImageSlug);
  }

  const currentCategory = categories.find(
    (cat) => cat.name.toLowerCase() === currentImage?.category.toLowerCase()
  );

  const handleBookStyle = () => {
    navigate("/", {
      state: {
        selectedService: currentImage?.category || "Men's Suit Stitching",
        targetSection: "appointment",
      },
    });
  };

  const handleBackToCategory = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentCategory) {
      navigate(`/our-work/${currentCategory.slug}`);
    } else {
      navigate("/", { state: { targetSection: "our-work" } });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-surface text-on-surface overflow-x-hidden">
      <ScrollProgress />
      <Header />

      <main className="flex-grow pt-[57px] md:pt-[73px] w-full overflow-x-hidden">
        {/* Loading State */}
        {loading && !currentImage && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-16 py-12 md:py-20 animate-pulse">
            <div className="w-36 h-4 bg-outline-variant/60 rounded mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-8 aspect-[4/3] bg-surface-container-low dark:bg-zinc-900 rounded-2xl" />
              <div className="lg:col-span-4 space-y-4">
                <div className="w-32 h-6 bg-outline-variant/80 rounded" />
                <div className="w-full h-12 bg-outline-variant/60 rounded mt-6" />
              </div>
            </div>
          </div>
        )}

        {/* Not Found State */}
        {!loading && !currentImage && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-tertiary-container/15 text-tertiary-container flex items-center justify-center mx-auto mb-4 border border-tertiary-container/30">
              <Scissors size={28} />
            </div>
            <h1 className="font-display-lg text-2xl sm:text-4xl font-bold text-primary dark:text-white mb-3">
              Image Not Found
            </h1>
            <p className="font-body-md text-secondary text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
              This image may have been moved or updated in Google Drive.
            </p>
            <Link
              to="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/", { state: { targetSection: "our-work" } });
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-on-primary font-label-caps text-xs uppercase font-semibold hover:bg-tertiary-container hover:text-primary transition-all cursor-pointer shadow-md"
            >
              <ArrowLeft size={16} /> Back to Our Work
            </Link>
          </div>
        )}

        {/* Detail Image Layout */}
        {currentImage && (
          <article className="max-w-6xl mx-auto px-4 sm:px-6 md:px-16 py-8 sm:py-12 md:py-16 w-full">
            {/* Top Navigation Link */}
            <div className="mb-8">
              <Link
                to={currentCategory ? `/our-work/${currentCategory.slug}` : "/"}
                onClick={handleBackToCategory}
                className="inline-flex items-center gap-2 text-xs font-label-caps uppercase tracking-widest text-secondary hover:text-primary dark:hover:text-tertiary-container font-semibold transition-colors group cursor-pointer"
              >
                <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
                <span>Back to {currentCategory ? currentCategory.name : "Our Work"}</span>
              </Link>
            </div>

            {/* Main Visual & Action CTAs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Large Image Frame */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-8"
              >
                <div className="relative aspect-[3/4] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-950 border border-outline-variant shadow-2xl">
                  <img
                    src={currentImage.imageUrl || currentImage.thumbnailUrl}
                    alt={currentImage.title}
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== currentImage?.thumbnailUrl) {
                        target.src = currentImage?.thumbnailUrl || "";
                      }
                    }}
                    className="w-full h-full object-cover sm:object-contain object-center"
                  />
                </div>
              </motion.div>

              {/* Action Sidebar */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-4 space-y-6"
              >
                <div>
                  <span className="font-label-caps text-xs tracking-widest text-tertiary-container uppercase font-semibold block mb-2">
                    Fantasy King Atelier
                  </span>
                  <h1 className="font-display-lg text-2xl sm:text-3xl md:text-4xl text-primary dark:text-white font-bold leading-tight uppercase mb-4">
                    {currentImage.category}
                  </h1>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleBookStyle}
                    className="w-full min-h-[48px] bg-primary text-on-primary hover:bg-tertiary-container hover:text-primary font-label-caps text-xs font-semibold tracking-wider uppercase py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98]"
                  >
                    <Calendar size={16} />
                    <span>Book This Style</span>
                    <ArrowRight size={15} />
                  </button>

                  <a
                    href={getWhatsAppUrl(
                      `Hi Fantasy King, I am interested in your ${currentImage.category} work. I would like to consult with the master tailor.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[48px] bg-[#25D366] hover:bg-[#20bd5a] text-white font-label-caps text-xs font-semibold tracking-wider uppercase py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98]"
                  >
                    <MessageCircle size={17} />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </article>
        )}
      </main>

      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}

export default PortfolioDetailPage;
