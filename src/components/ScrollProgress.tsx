import React, { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
      const winHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      const scrollable = docHeight - winHeight;

      if (scrollable <= 0) {
        setProgress(0);
      } else {
        const currentProgress = Math.min(Math.max((scrollTop / scrollable) * 100, 0), 100);
        setProgress(currentProgress);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    // Calculate initial progress on mount
    updateScrollProgress();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 w-full h-[2.5px] z-[60] pointer-events-none bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-accent via-accent-light to-accent-dim shadow-[0_0_8px_var(--app-accent)] transition-transform duration-100 ease-out origin-left will-change-transform"
        style={{
          transform: `scaleX(${progress / 100})`,
        }}
      />
    </div>
  );
}

export default ScrollProgress;
