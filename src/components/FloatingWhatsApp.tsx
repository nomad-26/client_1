import React, { useState } from "react";
import { getWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGES } from "@/utils/whatsapp";

interface FloatingWhatsAppProps {
  message?: string;
  phoneNumber?: string;
}

export function FloatingWhatsApp({
  message = DEFAULT_WHATSAPP_MESSAGES.general,
  phoneNumber,
}: FloatingWhatsAppProps) {
  const [isHovered, setIsHovered] = useState(false);
  const whatsappUrl = getWhatsAppUrl(message, phoneNumber);

  return (
    <aside
      aria-label="WhatsApp Contact Concierge"
      className="fixed z-50 flex items-center gap-3 pointer-events-none select-none"
      style={{
        bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))",
        right: "calc(1.25rem + env(safe-area-inset-right, 0px))",
      }}
    >
      {/* Tooltip Label for Desktop */}
      <div
        className={`pointer-events-auto transition-all duration-300 hidden md:flex items-center gap-2 bg-black/90 dark:bg-zinc-900/95 text-white text-xs font-medium px-3.5 py-2 rounded-full border border-white/10 shadow-xl backdrop-blur-md ${
          isHovered
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-3 pointer-events-none"
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Chat with us on WhatsApp</span>
      </div>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with FANTASY KING on WhatsApp"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="pointer-events-auto relative group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] transform hover:scale-105 active:scale-90 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/60 cursor-pointer"
      >
        {/* Soft Ambient Ping Animation */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400/30 animate-ping pointer-events-none duration-1000" />

        {/* WhatsApp Icon (Official SVG) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7 sm:w-8 sm:h-8 relative z-10 drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.03C9.36 7.03 9.09 7.1 8.87 7.33C8.65 7.57 8.02 8.16 8.02 9.36C8.02 10.56 8.9 11.72 9.02 11.89C9.15 12.06 10.74 14.5 13.18 15.56C13.76 15.81 14.21 15.96 14.57 16.07C15.15 16.26 15.68 16.23 16.1 16.17C16.57 16.1 17.54 15.58 17.74 15.02C17.94 14.46 17.94 13.97 17.88 13.88C17.82 13.78 17.66 13.72 17.41 13.6C17.16 13.47 15.94 12.87 15.71 12.79C15.49 12.7 15.32 12.66 15.16 12.91C14.99 13.15 14.52 13.72 14.38 13.88C14.24 14.05 14.1 14.07 13.85 13.95C13.6 13.82 12.81 13.56 11.87 12.73C11.14 12.08 10.65 11.28 10.51 11.03C10.36 10.78 10.49 10.65 10.62 10.52C10.73 10.41 10.87 10.23 11 10.08C11.12 9.93 11.17 9.82 11.25 9.65C11.33 9.49 11.29 9.34 11.23 9.22C11.17 9.1 10.7 7.94 10.5 7.47C10.31 7.02 10.11 7.08 9.96 7.07C9.82 7.06 9.68 7.03 9.53 7.03Z" />
        </svg>

        {/* Live Notification Indicator */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-300 border-2 border-white dark:border-zinc-900 rounded-full" />
      </a>
    </aside>
  );
}
