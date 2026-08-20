"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Scissors,
  Star,
  Clock,
  Check,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  Send,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Bespoke 3-Piece Suit",
    date: "",
    notes: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setIsSubmitted(true);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, ease: "easeOut" },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const services = [
    {
      title: "Bespoke Tailoring",
      description: "From individual paper patterns to hand-padded lapels, garments crafted entirely for your silhouette.",
      image: "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?q=80&w=2680&auto=format&fit=crop",
    },
    {
      title: "Luxury Alterations",
      description: "Precision adjustments and restyling of luxury garments, couture evening gowns, and designer suits.",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2670&auto=format&fit=crop",
    },
    {
      title: "Bridal Couture",
      description: "Handcrafted wedding gowns, bridal pantsuits, and bespoke bridal party ensembles of the highest order.",
      image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=2670&auto=format&fit=crop",
    },
  ];

  const portfolioItems = [
    {
      title: "Midnight Navy 3-Piece Tuxedo",
      category: "Bespoke Eveningwear",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Italian Super 150s Wool Suit",
      category: "Executive Tailoring",
      image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Hand-Pleated Silk Bridal Gown",
      category: "Bridal Couture",
      image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Cashmere Double-Breasted Overcoat",
      category: "Outerwear & Overcoats",
      image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const reviews = [
    {
      name: "Sir James Sterling",
      role: "Private Wealth Partner, Mayfair",
      quote: "The fit of my bespoke 3-piece tuxedo was impeccable on the first fitting. The floating canvas construction makes all the difference in comfort and drape.",
      rating: 5,
      garment: "Bespoke 3-Piece Tuxedo",
    },
    {
      name: "Elena Rostova",
      role: "Couture Collector & Architect",
      quote: "FANTACY KING altered three vintage couture gowns with extraordinary care and precision. They truly understand delicate textiles and architectural silhouettes.",
      rating: 5,
      garment: "Couture Alterations",
    },
    {
      name: "Marcus Vance",
      role: "Managing Director, Knightsbridge",
      quote: "The doorstep measuring service saved me countless hours. Having a master tailor visit my residence with fabric swatches was a seamless luxury experience.",
      rating: 5,
      garment: "Doorstep Fitting Service",
    },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* 1. HERO SECTION (#home) */}
      <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden w-full scroll-mt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=2680&auto=format&fit=crop"
            alt="Bespoke Tailoring Hero"
            fill
            sizes="100vw"
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30 z-10" />
        </div>

        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-16 py-20"
        >
          <motion.div variants={fadeInUp} className="max-w-2xl">
            <h4 className="text-tertiary-fixed tracking-[0.3em] text-sm uppercase mb-6 font-semibold flex items-center gap-4">
              <span className="w-12 h-[1px] bg-tertiary-fixed block" />
              The Art of Refinement
            </h4>
            <h1 className="text-5xl md:text-7xl text-white font-display-lg leading-tight mb-8 drop-shadow-lg">
              Redefining <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-tertiary-fixed to-yellow-600">
                Sartorial
              </span>{" "}
              Excellence
            </h1>
            <p className="text-gray-200 text-lg font-light mb-10 leading-relaxed max-w-lg">
              Experience unparalleled craftsmanship. Every measurement, cut, and stitch is a testament to our dedication to absolute perfection.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <button
                onClick={() => scrollToSection("contact")}
                className="bg-tertiary-container text-black font-semibold tracking-wider text-xs uppercase px-8 py-4 rounded-full flex items-center justify-center gap-3 hover:bg-yellow-500 hover:scale-105 transition-all shadow-[0_0_20px_rgba(204,167,48,0.4)] cursor-pointer"
              >
                Book Consultation <ArrowRight size={16} />
              </button>
              <button
                onClick={() => scrollToSection("work")}
                className="border border-white/30 text-white font-semibold tracking-wider text-xs uppercase px-8 py-4 rounded-full flex items-center justify-center hover:bg-white/10 transition-all backdrop-blur-sm cursor-pointer"
              >
                Explore Portfolio
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Floating Metrics Bar */}
      <section className="relative z-30 -mt-16 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-white/20 dark:border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-zinc-700 text-center">
            <div className="flex flex-col items-center p-4">
              <Scissors className="text-tertiary-container mb-4" size={32} />
              <h3 className="text-3xl font-display-lg text-primary dark:text-white font-semibold">10,000+</h3>
              <p className="text-secondary text-sm tracking-widest uppercase mt-2">Bespoke Suits Crafted</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <Star className="text-tertiary-container mb-4" size={32} />
              <h3 className="text-3xl font-display-lg text-primary dark:text-white font-semibold">25 Years</h3>
              <p className="text-secondary text-sm tracking-widest uppercase mt-2">Master Tailoring</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <Clock className="text-tertiary-container mb-4" size={32} />
              <h3 className="text-3xl font-display-lg text-primary dark:text-white font-semibold">14 Days</h3>
              <p className="text-secondary text-sm tracking-widest uppercase mt-2">Precision Delivery</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. ABOUT US SECTION (#about) */}
      <section id="about" className="py-32 w-full max-w-7xl mx-auto px-6 md:px-16 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <motion.div {...fadeInUp} className="lg:col-span-6 space-y-6">
            <p className="font-label-caps text-xs tracking-[0.2em] text-tertiary-container uppercase font-semibold">
              Heritage & Atelier Tradition
            </p>
            <h2 className="font-display-lg text-4xl md:text-5xl text-primary dark:text-white leading-tight">
              25+ Years of Experience.<br />A Lifetime of Precision.
            </h2>
            <p className="font-body-md text-secondary text-base leading-relaxed">
              Our atelier is founded on the principles of traditional Savile Row tailoring infused with contemporary minimalism. Every stitch is deliberate, every cut calculated to enhance your natural silhouette. We don't just make clothes; we architect confidence.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-outline-variant">
              <div>
                <h4 className="font-display-lg text-2xl font-bold text-primary dark:text-white">100% Custom</h4>
                <p className="text-secondary text-xs uppercase tracking-wider mt-1">Individual Paper Patterns</p>
              </div>
              <div>
                <h4 className="font-display-lg text-2xl font-bold text-primary dark:text-white">Floating Canvas</h4>
                <p className="text-secondary text-xs uppercase tracking-wider mt-1">Natural Lifetime Drape</p>
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={() => scrollToSection("contact")}
                className="font-label-caps text-xs uppercase font-semibold text-primary dark:text-white pb-1 border-b-2 border-tertiary-container hover:text-tertiary-container transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                Schedule Private Atelier Visit <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden shadow-2xl border border-outline-variant"
          >
            <Image
              src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop"
              alt="Master Tailor in Atelier"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* 3 Craftsmanship Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-outline-variant">
          <div className="p-6 bg-surface-container-low dark:bg-zinc-900 rounded-xl border border-outline-variant">
            <span className="font-display-lg text-3xl text-tertiary-container font-bold block mb-3">01</span>
            <h3 className="font-headline-md text-xl text-primary dark:text-white mb-2">Individual Pattern Drafting</h3>
            <p className="font-body-md text-sm text-secondary leading-relaxed">
              Every client receives a 100% bespoke paper pattern drafted manually by our master cutters according to your posture.
            </p>
          </div>
          <div className="p-6 bg-surface-container-low dark:bg-zinc-900 rounded-xl border border-outline-variant">
            <span className="font-display-lg text-3xl text-tertiary-container font-bold block mb-3">02</span>
            <h3 className="font-headline-md text-xl text-primary dark:text-white mb-2">Full Floating Horsehair Canvas</h3>
            <p className="font-body-md text-sm text-secondary leading-relaxed">
              We utilize floating natural canvas interlinings that mold comfortably to your chest over time for unmatched longevity.
            </p>
          </div>
          <div className="p-6 bg-surface-container-low dark:bg-zinc-900 rounded-xl border border-outline-variant">
            <span className="font-display-lg text-3xl text-tertiary-container font-bold block mb-3">03</span>
            <h3 className="font-headline-md text-xl text-primary dark:text-white mb-2">Sartorial Hand-Stitching</h3>
            <p className="font-body-md text-sm text-secondary leading-relaxed">
              Hand-padded lapels, Milanese silk buttonholes, and surgeon cuffs — over 50 hours of hand labor goes into each garment.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE SERVICES SECTION (#services) */}
      <section id="services" className="py-32 bg-surface-container-lowest dark:bg-zinc-950/50 w-full scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="text-center mb-20">
            <p className="font-label-caps text-xs tracking-[0.2em] text-tertiary-container uppercase font-semibold mb-3">
              Curated Offerings
            </p>
            <h2 className="font-display-lg text-4xl md:text-5xl text-primary dark:text-white mb-6">Our Signature Services</h2>
            <div className="w-24 h-1 bg-tertiary-container mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
                className="group cursor-pointer rounded-2xl overflow-hidden shadow-lg relative h-[500px] flex flex-col justify-end p-8 border border-outline-variant"
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />
                <div className="relative z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-display-lg text-white font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 text-xs font-light leading-relaxed mb-4 opacity-90">
                    {service.description}
                  </p>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="text-xs uppercase font-label-caps font-semibold text-tertiary-fixed inline-flex items-center gap-2 hover:underline cursor-pointer"
                  >
                    Inquire Service <ArrowRight size={14} />
                  </button>
                  <div className="h-[2px] w-0 bg-tertiary-fixed group-hover:w-full transition-all duration-700 ease-out mt-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. OUR WORK / PORTFOLIO SECTION (#work) */}
      <section id="work" className="py-32 max-w-7xl mx-auto px-6 md:px-16 scroll-mt-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <p className="font-label-caps text-xs tracking-[0.2em] text-tertiary-container uppercase font-semibold mb-2">
              Atelier Showcase
            </p>
            <h2 className="font-display-lg text-4xl md:text-5xl text-primary dark:text-white">Our Sartorial Work</h2>
          </div>
          <p className="font-body-md text-secondary max-w-md text-sm">
            A curated portfolio of recent bespoke tailoring commissions, tuxedos, and bridal gowns crafted for distinguished clients worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {portfolioItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-outline-variant shadow-md cursor-pointer"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 z-10">
                <span className="text-[10px] font-label-caps uppercase tracking-widest text-tertiary-fixed mb-1">
                  {item.category}
                </span>
                <h4 className="font-display-lg text-lg text-white font-semibold leading-tight">
                  {item.title}
                </h4>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. REVIEWS & TESTIMONIALS SECTION (#reviews) */}
      <section id="reviews" className="py-32 bg-surface-container-low dark:bg-zinc-900/60 w-full scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="text-center mb-20">
            <p className="font-label-caps text-xs tracking-[0.2em] text-tertiary-container uppercase font-semibold mb-3">
              Client Endorsements
            </p>
            <h2 className="font-display-lg text-4xl md:text-5xl text-primary dark:text-white mb-6">Reviews & Accolades</h2>
            <div className="w-24 h-1 bg-tertiary-container mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
                className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 text-tertiary-container mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <p className="font-body-md text-secondary dark:text-gray-300 text-sm leading-relaxed mb-6 italic">
                    "{rev.quote}"
                  </p>
                </div>
                <div className="pt-4 border-t border-outline-variant">
                  <h4 className="font-display-lg text-base font-bold text-primary dark:text-white">{rev.name}</h4>
                  <p className="font-caption text-xs text-secondary">{rev.role}</p>
                  <span className="inline-block mt-2 font-label-caps text-[10px] text-tertiary-container uppercase tracking-wider bg-surface-container-low dark:bg-zinc-800 px-2 py-1 rounded">
                    {rev.garment}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white dark:bg-zinc-900 border border-outline-variant text-xs text-secondary">
              <ShieldCheck size={18} className="text-tertiary-container" />
              <span>Perfect Fit Guarantee on All Bespoke Commissions</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTACT & APPOINTMENT BOOKING SECTION (#contact / #appointment) */}
      <section id="contact" className="py-32 max-w-7xl mx-auto px-6 md:px-16 scroll-mt-20">
        <div id="appointment" className="scroll-mt-20">
          <div className="mb-16 max-w-3xl">
            <p className="font-label-caps text-xs tracking-[0.2em] text-tertiary-container uppercase font-semibold mb-2">
              Atelier Concierge
            </p>
            <h2 className="font-display-lg text-4xl md:text-5xl text-primary dark:text-white mb-4">
              Book a Private Fitting Consultation.
            </h2>
            <p className="font-body-md text-secondary text-base">
              Reserve a dedicated session with our master tailoring team in our Mayfair salon or request our doorstep fitting service.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Interactive Booking Form */}
            <div className="lg:col-span-7 p-8 md:p-10 border border-outline-variant bg-surface-container-lowest dark:bg-zinc-900/80 rounded-2xl shadow-sm">
              <h3 className="font-headline-md text-2xl text-primary dark:text-white mb-6 uppercase">
                Schedule Appointment
              </h3>

              {isSubmitted ? (
                <div className="p-8 text-center bg-surface-container-low dark:bg-zinc-800/80 rounded-xl space-y-4">
                  <div className="w-14 h-14 rounded-full bg-tertiary-container/20 text-tertiary-container flex items-center justify-center mx-auto">
                    <Check size={28} />
                  </div>
                  <h4 className="font-display-lg text-xl font-bold text-primary dark:text-white">
                    Consultation Request Confirmed
                  </h4>
                  <p className="font-body-md text-secondary text-sm">
                    Thank you, {formData.name}. Our master tailor concierge will contact you at {formData.email} within 24 hours to confirm your private fitting slot.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: "", email: "", phone: "", service: "Bespoke 3-Piece Suit", date: "", notes: "" });
                    }}
                    className="mt-4 font-label-caps text-xs text-primary dark:text-white uppercase underline"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-label-caps text-xs text-secondary uppercase mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Alexander Sterling"
                        className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary py-2 text-sm text-primary dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-label-caps text-xs text-secondary uppercase mb-2">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="sterling@example.com"
                        className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary py-2 text-sm text-primary dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-label-caps text-xs text-secondary uppercase mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+44 (0) 20 7946 0912"
                        className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary py-2 text-sm text-primary dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-label-caps text-xs text-secondary uppercase mb-2">Desired Service</label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary py-2 text-sm text-primary dark:text-white outline-none cursor-pointer"
                      >
                        <option value="Bespoke 3-Piece Suit" className="dark:bg-zinc-900">Bespoke 3-Piece Suit</option>
                        <option value="Luxury Alterations & Fitting" className="dark:bg-zinc-900">Luxury Alterations & Fitting</option>
                        <option value="Bridal Couture & Gown" className="dark:bg-zinc-900">Bridal Couture & Gown</option>
                        <option value="Doorstep Master Fitting" className="dark:bg-zinc-900">Doorstep Master Fitting</option>
                        <option value="Wardrobe Styling Consultation" className="dark:bg-zinc-900">Wardrobe Styling</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-label-caps text-xs text-secondary uppercase mb-2">Preferred Consultation Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary py-2 text-sm text-primary dark:text-white outline-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block font-label-caps text-xs text-secondary uppercase mb-2">Garment Notes or Specifications</label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Tell us about the occasion, fabric preferences, or required completion date..."
                      className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary py-2 text-sm text-primary dark:text-white outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-on-primary font-label-caps text-xs font-semibold tracking-wider uppercase py-4 rounded-lg hover:bg-tertiary-container hover:text-primary transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Send size={16} /> Confirm Appointment Request
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Atelier Details & WhatsApp */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 border border-outline-variant bg-surface-container-low dark:bg-zinc-900/60 rounded-2xl space-y-6">
                <div>
                  <h4 className="font-label-caps text-xs tracking-widest text-tertiary-container uppercase mb-2 font-semibold">
                    Flagship Atelier
                  </h4>
                  <h3 className="font-headline-md text-xl text-primary dark:text-white">Savile Row Salon</h3>
                  <p className="font-body-md text-sm text-secondary mt-2 flex items-start gap-2">
                    <MapPin size={18} className="shrink-0 text-tertiary-container mt-0.5" />
                    14 Savile Row, Mayfair, London W1S 3JN, United Kingdom
                  </p>
                  <p className="font-caption text-xs text-secondary mt-1 pl-6">Private Fitting Sessions By Appointment Only</p>
                </div>

                <div className="pt-6 border-t border-outline-variant space-y-3">
                  <h4 className="font-label-caps text-xs text-secondary uppercase mb-2">Direct Inquiries</h4>
                  <div className="flex items-center gap-3 text-sm text-primary dark:text-white font-medium">
                    <Phone size={16} className="text-tertiary-container" />
                    +44 (0) 20 7946 0912
                  </div>
                  <div className="flex items-center gap-3 text-sm text-primary dark:text-white font-medium">
                    <Mail size={16} className="text-tertiary-container" />
                    atelier@threadandstyle.com
                  </div>
                </div>

                <div className="pt-6 border-t border-outline-variant space-y-3">
                  <h4 className="font-label-caps text-xs text-secondary uppercase mb-3">Instant Messaging</h4>
                  <a
                    href="https://wa.me/442079460912"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-700 text-white font-label-caps text-xs tracking-wider uppercase py-3 px-4 rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 font-semibold shadow-sm"
                  >
                    <MessageCircle size={18} /> Chat via WhatsApp Concierge
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
