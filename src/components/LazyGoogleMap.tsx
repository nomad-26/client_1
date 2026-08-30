import React, { useState, useEffect, useRef } from "react";
import { MapPin, ArrowRight, Compass } from "lucide-react";
import { GoogleIcon } from "./GoogleIcon";

const FANTASY_KING_MAPS_URL =
  "https://www.google.com/maps/place/FANTASY+KING+(Designer)+alteration+%26+tailoring/@11.6762356,78.137468,17z/data=!3m1!4b1!4m6!3m5!1s0x3babf1a42dce11fb:0xcfe95d8a18e2f334!8m2!3d11.6762356!4d78.137468!16s%2Fg%2F11xf_c9fbr";

export function LazyGoogleMap() {
  const [loadMap, setLoadMap] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loadMap) return;

    // Use IntersectionObserver to lazy-load map when approaching viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" } // Start loading 300px before scrolling into view
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMap]);

  return (
    <div
      ref={containerRef}
      className="relative rounded-xl overflow-hidden border border-zinc-200 aspect-[16/9] shadow-inner bg-zinc-900 group"
    >
      {loadMap ? (
        <iframe
          title="FANTASY KING Google Maps Location"
          src="https://maps.google.com/maps?q=11.6762356,78.137468&z=17&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full grayscale contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
        />
      ) : (
        /* Lightweight Styled Map Preview Placeholder */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white">
          {/* Subtle Grid Map Lines */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 space-y-3">
            <div className="w-12 h-12 rounded-full bg-tertiary-container/20 border border-tertiary-container/40 text-tertiary-container flex items-center justify-center mx-auto shadow-md">
              <MapPin size={22} className="animate-bounce" />
            </div>

            <div>
              <h4 className="font-display-lg text-sm font-bold text-white flex items-center justify-center gap-1.5">
                <GoogleIcon className="w-4 h-4" />
                <span>FANTASY KING Atelier Map</span>
              </h4>
              <p className="text-[11px] text-zinc-400 font-caption mt-0.5">
                Swarnapuri, Salem • 5.0 ★★★★★ (213 Reviews)
              </p>
            </div>

            <button
              type="button"
              onClick={() => setLoadMap(true)}
              className="px-4 py-2 rounded-full bg-tertiary-container text-black font-label-caps text-[11px] font-semibold uppercase tracking-wider hover:bg-yellow-500 transition-all shadow-md inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Compass size={13} />
              <span>Load Interactive Map</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Get Directions Link */}
      <a
        href={FANTASY_KING_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2.5 right-2.5 bg-black/85 hover:bg-black text-white text-[11px] font-label-caps uppercase tracking-wider px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition-all shadow-md group active:scale-95 z-20"
      >
        <span>Get Directions</span>
        <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
  );
}

export default LazyGoogleMap;
