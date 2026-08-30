import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Scissors, Star, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { Header } from "../components/Header";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import {
  getOrganizationSchema,
  getLocalBusinessSchema,
  getBreadcrumbSchema,
} from "../utils/seoSchemas";
import { getWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGES } from "../utils/whatsapp";

export function AboutPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 25 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-surface text-on-surface overflow-x-hidden">
      <SEO
        title="Master Tailor & Bespoke Tailoring Craftsmanship in Salem | FANTASY KING"
        description="Discover FANTASY KING's heritage of bespoke tailoring and master craftsmanship in Swarnapuri, Salem. 25+ years of custom suits, couture and precision fitting."
        canonicalPath="/about"
        schema={[
          getOrganizationSchema(),
          getLocalBusinessSchema(),
          getBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "About Us", url: "/about" },
          ]),
        ]}
      />
      <Header />

      <main className="flex-grow pt-[57px] md:pt-[73px] w-full overflow-x-hidden">
        {/* Page Hero Banner */}
        <section className="py-16 sm:py-24 bg-surface-container-lowest dark:bg-zinc-950/60 border-b border-outline-variant/40 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 text-center">
            <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tertiary-container/15 text-tertiary-container text-xs font-label-caps uppercase tracking-widest font-semibold mb-4 border border-tertiary-container/30">
                <Sparkles size={13} />
                <span>Heritage &amp; Atelier Tradition</span>
              </div>
              <h1 className="font-display-lg text-3xl sm:text-5xl md:text-6xl text-primary dark:text-white font-bold leading-tight mb-6">
                Master Tailoring Craftsmanship in Salem
              </h1>
              <p className="font-body-md text-secondary text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                Founded on the timeless principles of bespoke tailoring, master pattern drafting, and meticulous hand-craftsmanship for over 25 years in Swarnapuri, Salem.
              </p>
              <div className="w-24 h-1 bg-tertiary-container mx-auto rounded-full mt-8" />
            </motion.div>
          </div>
        </section>

        {/* Detailed Heritage Story */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 md:px-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16 sm:mb-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6"
            >
              <p className="font-label-caps text-xs tracking-[0.2em] text-tertiary-container uppercase font-semibold">
                Sartorial Mastery
              </p>
              <h2 className="font-display-lg text-2xl xs:text-3xl sm:text-4xl text-primary dark:text-white leading-tight font-semibold">
                25+ Years of Experience.<br />A Lifetime of Precision in Salem.
              </h2>
              <p className="font-body-md text-secondary text-sm sm:text-base leading-relaxed">
                At FANTASY KING, we believe true luxury is bespoke. Every suit, tuxedo, gown, designer blouse, and custom shirt begins with a blank sheet of paper and an individual pattern drafted specifically to your posture, shoulder slope, and natural movement.
              </p>
              <p className="font-body-md text-secondary text-sm sm:text-base leading-relaxed">
                Located in Swarnapuri, Salem (near Khadhims and opposite Puma Showroom), our master tailors combine traditional bespoke architecture with artisanal hand-finishing to produce garments that fit flawlessly on the first fitting.
              </p>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-outline-variant">
                <div>
                  <h4 className="font-display-lg text-2xl font-bold text-primary dark:text-white">100% Custom</h4>
                  <p className="text-secondary text-xs uppercase tracking-wider mt-1">Individual Paper Patterns</p>
                </div>
                <div>
                  <h4 className="font-display-lg text-2xl font-bold text-primary dark:text-white">Floating Canvas</h4>
                  <p className="text-secondary text-xs uppercase tracking-wider mt-1">Natural Lifetime Drape</p>
                </div>
              </div>
              <div className="pt-3 flex flex-wrap gap-4 items-center">
                <Link
                  to="/services"
                  className="font-label-caps text-xs uppercase font-semibold text-primary dark:text-white pb-1 border-b-2 border-tertiary-container hover:text-tertiary-container transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Tailoring &amp; Alteration Services</span>
                  <ArrowRight size={13} />
                </Link>
                <Link
                  to="/our-work-gallery"
                  className="font-label-caps text-xs uppercase font-semibold text-primary dark:text-white pb-1 border-b-2 border-outline-variant hover:border-tertiary-container hover:text-tertiary-container transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View Our Work Gallery</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-outline-variant"
            >
              <img
                src="/images/about-heritage-atelier.webp"
                alt="FANTASY KING master tailoring workshop and bespoke suits crafted in Salem atelier"
                width={800}
                height={600}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          </div>

          {/* 3 Pillars of Craftsmanship */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 pt-8 sm:pt-12 border-t border-outline-variant">
            <div className="p-6 bg-surface-container-low dark:bg-zinc-900 rounded-xl border border-outline-variant">
              <span className="font-display-lg text-3xl text-tertiary-container font-bold block mb-3">01</span>
              <h3 className="font-headline-md text-xl text-primary dark:text-white mb-2 font-semibold">Individual Pattern Drafting</h3>
              <p className="font-body-md text-sm text-secondary leading-relaxed">
                Every client receives a 100% bespoke paper pattern drafted manually by our master cutters according to your posture and anatomical measurements.
              </p>
            </div>
            <div className="p-6 bg-surface-container-low dark:bg-zinc-900 rounded-xl border border-outline-variant">
              <span className="font-display-lg text-3xl text-tertiary-container font-bold block mb-3">02</span>
              <h3 className="font-headline-md text-xl text-primary dark:text-white mb-2 font-semibold">Full Floating Horsehair Canvas</h3>
              <p className="font-body-md text-sm text-secondary leading-relaxed">
                We utilize floating natural canvas interlinings that mold comfortably to your chest contours over time for unmatched drape and longevity.
              </p>
            </div>
            <div className="p-6 bg-surface-container-low dark:bg-zinc-900 rounded-xl border border-outline-variant sm:col-span-2 md:col-span-1">
              <span className="font-display-lg text-3xl text-tertiary-container font-bold block mb-3">03</span>
              <h3 className="font-headline-md text-xl text-primary dark:text-white mb-2 font-semibold">Sartorial Hand-Stitching</h3>
              <p className="font-body-md text-sm text-secondary leading-relaxed">
                Hand-padded lapels, Milanese silk buttonholes, pick stitching, and surgeon cuffs — over 50 hours of hand labor goes into each commission.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Consultation Banner */}
        <section className="py-16 sm:py-20 bg-inverse-surface dark:bg-zinc-950 text-white w-full border-t border-outline-variant/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-16 text-center space-y-6">
            <h2 className="font-display-lg text-2xl sm:text-4xl font-bold">
              Experience Bespoke Distinction
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Step into our Salem atelier in Swarnapuri or request a private consultation for your wedding and custom tailoring needs.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/contact"
                className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 bg-tertiary-container text-black font-label-caps text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-yellow-500 transition-all inline-flex items-center justify-center gap-2 shadow-lg"
              >
                Schedule Private Fitting <ArrowRight size={15} />
              </Link>
              <a
                href={getWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGES.consultation)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-label-caps text-xs font-semibold uppercase tracking-wider rounded-full transition-all inline-flex items-center justify-center gap-2 shadow-md"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}

export default AboutPage;
