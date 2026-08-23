import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { GalleryItem } from "../types/gallery";
import { getWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGES } from "../utils/whatsapp";

interface PortfolioViewerProps {
  isOpen: boolean;
  onClose: () => void;
  items: GalleryItem[];
  currentIndex: number;
  onNavigate: (newIndex: number) => void;
  onBookStyle: (itemTitle: string) => void;
}

export function PortfolioViewer({
  isOpen,
  onClose,
  items,
  currentIndex,
  onNavigate,
  onBookStyle,
}: PortfolioViewerProps) {
  const currentItem = items[currentIndex];
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Keyboard navigation: ESC to close, ArrowLeft for previous, ArrowRight for next
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    // Lock body scroll while lightbox is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, currentIndex, items.length]);

  if (!isOpen || !currentItem) return null;

  const handlePrevious = () => {
    if (items.length <= 1) return;
    const newIdx = (currentIndex - 1 + items.length) % items.length;
    onNavigate(newIdx);
  };

  const handleNext = () => {
    if (items.length <= 1) return;
    const newIdx = (currentIndex + 1) % items.length;
    onNavigate(newIdx);
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      handleNext(); // Swiped left -> next image
    } else if (distance < -minSwipeDistance) {
      handlePrevious(); // Swiped right -> previous image
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Portfolio item: ${currentItem.title}`}
        className="fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 backdrop-blur-xl text-white select-none overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 border-b border-white/10 z-20">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse" />
            <span className="font-label-caps text-xs tracking-widest text-tertiary-fixed uppercase font-semibold">
              Fantasy King Atelier Showcase
            </span>
          </div>

          <div className="flex items-center gap-4">
            {items.length > 1 && (
              <span className="font-label-caps text-xs tracking-widest text-gray-400">
                {String(currentIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
            )}
            <button
              onClick={onClose}
              aria-label="Close portfolio viewer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main Center Image Viewport */}
        <div className="relative flex-grow flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-hidden">
          {/* Previous Arrow Button */}
          {items.length > 1 && (
            <button
              onClick={handlePrevious}
              aria-label="Previous portfolio item"
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 sm:w-14 h-11 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all z-20 cursor-pointer active:scale-90 shadow-2xl group"
            >
              <ChevronLeft size={26} className="transform group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Large Aspect-Preserved Image */}
          <motion.div
            key={currentItem.id || currentIndex}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative max-w-full max-h-[60vh] sm:max-h-[66vh] flex items-center justify-center"
          >
            <img
              src={currentItem.imageUrl}
              alt={currentItem.title}
              loading="eager"
              decoding="async"
              className="max-w-full max-h-[60vh] sm:max-h-[66vh] object-contain rounded-lg sm:rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-white/10"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== currentItem.thumbnailUrl) {
                  target.src = currentItem.thumbnailUrl;
                }
              }}
            />
          </motion.div>

          {/* Next Arrow Button */}
          {items.length > 1 && (
            <button
              onClick={handleNext}
              aria-label="Next portfolio item"
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 sm:w-14 h-11 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all z-20 cursor-pointer active:scale-90 shadow-2xl group"
            >
              <ChevronRight size={26} className="transform group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* Bottom Details Bar */}
        <div className="bg-zinc-950/90 border-t border-white/10 px-4 sm:px-8 py-4 sm:py-6 z-20">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-label-caps text-[11px] tracking-widest text-tertiary-fixed uppercase font-semibold">
                  {currentItem.category}
                </span>
                <span className="text-gray-500">•</span>
                <span className="font-label-caps text-[10px] text-gray-400 uppercase tracking-wider">
                  Handcrafted by Fantasy King
                </span>
              </div>
              <h3 className="font-display-lg text-lg sm:text-2xl font-bold text-white leading-tight">
                {currentItem.title}
              </h3>
              {currentItem.description && (
                <p className="font-body-md text-xs sm:text-sm text-gray-300 max-w-3xl leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {currentItem.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
              <button
                onClick={() => {
                  onClose();
                  onBookStyle(currentItem.title);
                }}
                className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-tertiary-container hover:bg-yellow-500 text-black font-label-caps text-xs uppercase font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
              >
                <span>Book This Style</span>
                <ArrowRight size={15} />
              </button>

              <a
                href={getWhatsAppUrl(`Hello Fantasy King, I am inquiring about the ${currentItem.title} (${currentItem.category}) from your portfolio.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-label-caps text-xs uppercase font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
              >
                <MessageCircle size={16} />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}

export default PortfolioViewer;
