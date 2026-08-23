import React, { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DriveImage } from "../types/gallery";
import { getWhatsAppUrl } from "../utils/whatsapp";

interface GalleryLightboxProps {
  images: DriveImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function GalleryLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const currentImage = images[currentIndex];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        onNavigate((currentIndex - 1 + images.length) % images.length);
      } else if (e.key === "ArrowRight") {
        onNavigate((currentIndex + 1) % images.length);
      }
    },
    [isOpen, currentIndex, images.length, onClose, onNavigate]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !currentImage) return null;

  const whatsappMessage = `Hi Fantasy King, I am admiring your work on "${currentImage.title}" in the ${currentImage.category} gallery. I would like to consult with your master tailor about a similar bespoke commission.`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
        {/* Top bar controls */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-tertiary-container/20 text-tertiary-fixed text-[11px] font-label-caps uppercase tracking-widest font-semibold border border-tertiary-container/30">
              {currentImage.category}
            </span>
            <span className="text-zinc-400 text-xs font-label-caps">
              {currentIndex + 1} / {images.length}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close preview"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 hover:scale-105 active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
            aria-label="Previous image"
            className="absolute left-3 sm:left-6 z-50 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 hover:border-tertiary-container hover:text-tertiary-fixed hover:scale-105 active:scale-95 shadow-lg"
          >
            <ChevronLeft size={26} />
          </button>
        )}

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={() => onNavigate((currentIndex + 1) % images.length)}
            aria-label="Next image"
            className="absolute right-3 sm:right-6 z-50 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 hover:border-tertiary-container hover:text-tertiary-fixed hover:scale-105 active:scale-95 shadow-lg"
          >
            <ChevronRight size={26} />
          </button>
        )}

        {/* Image Content Container */}
        <div
          className="relative max-w-5xl max-h-[80vh] w-full mx-4 sm:mx-16 flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            key={currentImage.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="relative overflow-hidden rounded-2xl border border-zinc-800 shadow-2xl bg-zinc-950 flex items-center justify-center"
          >
            <img
              src={currentImage.imageUrl || currentImage.thumbnailUrl}
              alt={currentImage.title}
              className="max-h-[68vh] sm:max-h-[72vh] w-auto max-w-full object-contain select-none"
            />
          </motion.div>

          {/* Bottom Info & Action Banner */}
          <motion.div
            key={`caption-${currentImage.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-4 w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left px-2"
          >
            <div>
              <h3 className="font-display-lg text-lg sm:text-xl font-bold text-white tracking-wide">
                {currentImage.title}
              </h3>
              <p className="text-xs text-zinc-400 font-body-md">
                Bespoke Atelier Portfolio • Fantasy King Salem
              </p>
            </div>

            <a
              href={getWhatsAppUrl(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-label-caps text-xs uppercase font-semibold transition-all shadow-md active:scale-95 shrink-0"
            >
              <MessageCircle size={15} />
              <span>Inquire About This Piece</span>
            </a>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

export default GalleryLightbox;
