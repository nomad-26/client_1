import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Scissors,
  Check,
  Sparkles,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { Header } from "../components/Header";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import {
  getLocalBusinessSchema,
  getServicesSchema,
  getBreadcrumbSchema,
  getFAQSchema,
} from "../utils/seoSchemas";
import { getWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGES } from "../utils/whatsapp";

interface ServiceItem {
  id: string;
  name: string;
  category: "Men" | "Women" | "Kids" | "Bridal" | "Alterations";
  description: string;
  details: string[];
  image?: string;
  featured?: boolean;
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: "mens-suit",
    name: "Bespoke 2-Piece & 3-Piece Suits",
    category: "Men",
    description:
      "Precision-crafted custom suits featuring floating horsehair canvas construction, hand-padded lapels, and personalized silhouettes.",
    details: [
      "Custom individual paper pattern",
      "Full canvas / half canvas construction",
      "Over 500+ premium wool fabrics",
      "2-3 precision fitting stages",
    ],
    image: "/images/service-bespoke-suits.webp",
    featured: true,
  },
  {
    id: "mens-tuxedo",
    name: "Ceremonial Tuxedos & Black Tie",
    category: "Men",
    description:
      "Handcrafted evening wear with pure silk grosgrain or satin lapels, besom pockets, and precision-tailored trousers.",
    details: [
      "Shawl or peak lapel styling",
      "Matching silk cummerbunds & bowties",
      "Midnight blue, classic black, or ivory",
    ],
  },
  {
    id: "mens-shirts",
    name: "Custom Tailored Dress Shirts",
    category: "Men",
    description:
      "Single-needle stitched bespoke dress shirts with reinforced collar stays, mother-of-pearl buttons, and split back yokes.",
    details: [
      "Egyptian & Giza cotton selections",
      "12 collar and cuff styles",
      "Hand-sewn monograms available",
    ],
  },
  {
    id: "mens-trousers",
    name: "Custom Formal Trousers & Chinos",
    category: "Men",
    description:
      "Hand-finished trousers with curtained waistbands, pick-stitched flys, and precise break customization.",
    details: [
      "Side adjusters or belt loops",
      "Cuffed or plain hems",
      "French fly construction",
    ],
  },
  {
    id: "womens-blouse",
    name: "Designer Saree Blouses & Maggam Work",
    category: "Women",
    description:
      "Exquisitely structured designer blouses, princess cuts, backless cuts, and intricate hand-embroidery tailored to your saree.",
    details: [
      "Princess cut, katori, and high-neck patterns",
      "Zardosi, aari, and maggam embroidery support",
      "Padded cups and comfort lining",
      "Custom neckline and back styling",
    ],
    image: "/images/service-bridal-formalwear.webp",
    featured: true,
  },
  {
    id: "womens-salwar",
    name: "Designer Salwars, Anarkalis & Kurtis",
    category: "Women",
    description:
      "Elegantly draped ethnic suits, floor-length anarkalis, and everyday chic kurtis cut to enhance natural posture.",
    details: [
      "Flawless body-contour drafting",
      "Churidar, palazzo, and dhoti pant pairings",
      "Premium interlining for structured drape",
    ],
  },
  {
    id: "womens-gowns",
    name: "Custom Evening Gowns & Indo-Western",
    category: "Women",
    description:
      "Show-stopping evening gowns, draped sarees, and Indo-western silhouettes tailored for red-carpet and cocktail galas.",
    details: [
      "Corset boning and support",
      "Draped pleat precision",
      "Luxurious fabrics: satin, crepe, silk",
    ],
  },
  {
    id: "bridal-lehenga",
    name: "Bridal Lehengas & Wedding Troussau",
    category: "Bridal",
    description:
      "Monumental bridal couture crafted with opulent cancan flare, heavy embroidery alignment, and blouse tailoring.",
    details: [
      "Multi-layered cancan construction",
      "Precision waist yoke tailoring",
      "Bridal dupatta draping and styling",
    ],
    image: "/images/service-bridal-formalwear.webp",
    featured: true,
  },
  {
    id: "groom-sherwani",
    name: "Groom Sherwanis & Indo-Western Suits",
    category: "Bridal",
    description:
      "Regal ceremonial sherwanis, bandhgala suits, and achkans with authentic royal cuts and matching stoles.",
    details: [
      "Structured shoulder architecture",
      "Matching churidar / breeches",
      "Intricate collar and button detailing",
    ],
  },
  {
    id: "alterations-suits",
    name: "Suit & Blazer Master Alterations",
    category: "Alterations",
    description:
      "Expert alterations for ready-made and luxury suits: collar roll fixes, sleeve shortening from the shoulder, waist taking in, and lapel slimming.",
    details: [
      "Shoulder narrowing and repadding",
      "Sleeve length adjustment with working buttonholes",
      "Chest and jacket waist tapering",
    ],
    image: "/images/service-alterations-fitting.webp",
    featured: true,
  },
  {
    id: "alterations-trousers",
    name: "Trouser & Jeans Alterations",
    category: "Alterations",
    description:
      "Original hem preservation on designer jeans, waistband taking in/letting out, and leg tapering for modern silhouettes.",
    details: [
      "Original distressed hem retention",
      "Crotch and seat re-cutting",
      "Slim taper from knee to ankle",
    ],
  },
  {
    id: "alterations-dresses",
    name: "Dress, Blouse & Saree Restyling",
    category: "Alterations",
    description:
      "Delicate bridal and formal gown resizing, blouse cup adjustments, fall/pico saree finishing, and vintage garment restyling.",
    details: [
      "Invisible seams on delicate silks",
      "Zipper replacement and hook reinforcement",
      "Fall and pico saree finishing",
    ],
  },
  {
    id: "kids-wear",
    name: "Kids Custom Suits & Ethnic Wear",
    category: "Kids",
    description:
      "Tailor-made blazers, tuxedos, pattu pavadai, and festive sherwanis for boys and girls made with soft, skin-friendly linings.",
    details: [
      "Breathable child-friendly linings",
      "Room for growth seam allowances",
      "Matching family ensemble designs",
    ],
  },
];

const SERVICE_CATEGORIES = ["All", "Men", "Women", "Bridal", "Alterations", "Kids"] as const;

const SERVICES_FAQS = [
  {
    question: "Where is FANTASY KING located in Salem?",
    answer:
      "FANTASY KING is conveniently located at First Floor, opposite Puma Showroom, near Khadhims, Thangavel Nagar, Alagapuram, Swarnapuri, Salem, Tamil Nadu 636016.",
  },
  {
    question: "What types of garments do you alter in Salem?",
    answer:
      "We provide precision alterations for men's suits, tuxedos, blazers, dress shirts, formal trousers, designer jeans, bridal lehengas, designer saree blouses, evening gowns, and kids' ceremonial wear.",
  },
  {
    question: "Do you provide bespoke suit stitching in Salem?",
    answer:
      "Yes, we specialize in 100% handcrafted bespoke 2-piece and 3-piece suits, safari suits, blazers, and sherwanis with individualized pattern drafting, floating canvas construction, and over 500+ premium fabric options.",
  },
  {
    question: "Do you provide bridal tailoring and designer blouse stitching in Salem?",
    answer:
      "Yes, our master couturiers create custom bridal lehengas, reception gowns, and designer saree blouses with intricate aari/maggam embroidery and guaranteed flawless fitting.",
  },
  {
    question: "Can I book a tailoring or alteration appointment in advance?",
    answer:
      "Yes! You can book an appointment directly through our online appointment form or message our master tailors on WhatsApp at +91 88380 66960.",
  },
  {
    question: "Do you provide express 24 to 48-hour alteration services in Salem?",
    answer:
      "Yes, for urgent events, weddings, and emergency alteration needs, we offer priority express tailoring and alteration turnaround in Salem.",
  },
];

export function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const navigate = useNavigate();

  const filteredServices =
    selectedCategory === "All"
      ? SERVICES_DATA
      : SERVICES_DATA.filter((s) => s.category === selectedCategory);

  const handleBookService = (serviceName: string) => {
    navigate("/contact", { state: { preferredService: serviceName } });
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-surface text-on-surface overflow-x-hidden">
      <SEO
        title="Bespoke Tailoring & Garment Alteration Services in Salem | FANTASY KING"
        description="Explore bespoke tailoring services at FANTASY KING Salem: custom men's suits, designer blouse stitching, bridal lehengas, kids wear & master clothing alterations."
        canonicalPath="/services"
        schema={[
          getLocalBusinessSchema(),
          getServicesSchema(),
          getBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Services", url: "/services" },
          ]),
          getFAQSchema(SERVICES_FAQS),
        ]}
      />
      <Header />

      <main className="flex-grow pt-[57px] md:pt-[73px] w-full overflow-x-hidden">
        {/* Page Hero Banner */}
        <section className="py-16 sm:py-24 bg-surface-container-lowest dark:bg-zinc-950/60 border-b border-outline-variant/40 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tertiary-container/15 text-tertiary-container text-xs font-label-caps uppercase tracking-widest font-semibold mb-4 border border-tertiary-container/30">
                <Sparkles size={13} />
                <span>Master Atelier Offerings</span>
              </div>
              <h1 className="font-display-lg text-3xl sm:text-5xl md:text-6xl text-primary dark:text-white font-bold leading-tight mb-6">
                Bespoke Tailoring &amp; Alteration Services in Salem
              </h1>
              <p className="font-body-md text-secondary text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                From handcrafted bespoke suits and black-tie tuxedos to ceremonial bridal wear and luxury alterations in Swarnapuri, Salem, explore our full catalog of sartorial services.
              </p>
              <div className="w-24 h-1 bg-tertiary-container mx-auto rounded-full mt-8" />
            </motion.div>
          </div>
        </section>

        {/* Services Catalog */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 md:px-16 w-full">
          {/* Category Filter Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 sm:mb-12 hide-scrollbar">
            {SERVICE_CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-label-caps uppercase tracking-wider transition-all duration-200 cursor-pointer min-h-[40px] ${
                    isActive
                      ? "bg-primary text-on-primary dark:bg-white dark:text-black font-semibold shadow-md"
                      : "bg-surface-container-low dark:bg-zinc-900 text-secondary hover:text-primary dark:hover:text-white border border-outline-variant"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Visual Featured Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {filteredServices
              .filter((s) => s.featured && s.image)
              .slice(0, 3)
              .map((service, idx) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="group rounded-2xl overflow-hidden shadow-lg relative h-[400px] sm:h-[460px] flex flex-col justify-end p-6 sm:p-8 border border-outline-variant transition-all"
                >
                  <img
                    src={service.image}
                    alt={`${service.name} tailored by FANTASY KING Salem atelier`}
                    width={600}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10" />

                  <div className="relative z-20 space-y-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-label-caps uppercase tracking-widest text-tertiary-fixed font-semibold border border-white/20">
                      {service.category} Atelier
                    </span>
                    <h3 className="font-display-lg text-xl sm:text-2xl text-white font-bold tracking-tight">
                      {service.name}
                    </h3>
                    <p className="text-gray-200 text-xs sm:text-sm font-light leading-relaxed line-clamp-2">
                      {service.description}
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => handleBookService(service.name)}
                        className="w-full py-2.5 bg-tertiary-container text-black font-label-caps text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <span>Book Service</span> <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* Full Detailed Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredServices.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % 6) * 0.05, duration: 0.4 }}
                className="p-5 sm:p-6 bg-surface-container-low dark:bg-zinc-900/80 rounded-xl border border-outline-variant hover:border-tertiary-container/60 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-label-caps uppercase tracking-wider text-tertiary-container font-semibold">
                      {service.category}
                    </span>
                    <Scissors size={14} className="text-tertiary-container/60 group-hover:text-tertiary-container transition-colors" />
                  </div>
                  <h4 className="font-display-lg text-lg text-primary dark:text-white font-semibold mb-2 group-hover:text-tertiary-container transition-colors">
                    {service.name}
                  </h4>
                  <p className="font-body-md text-xs text-secondary leading-relaxed mb-4">
                    {service.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-between">
                  <button
                    onClick={() => handleBookService(service.name)}
                    className="font-label-caps text-xs text-primary dark:text-white font-semibold uppercase inline-flex items-center gap-1.5 hover:text-tertiary-container transition-colors py-1 cursor-pointer"
                  >
                    <span>Book Service</span>
                    <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Visible FAQ Section with Structured Content */}
        <section className="py-16 sm:py-24 bg-surface-container-low dark:bg-zinc-900/50 border-t border-outline-variant/40 w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-container/15 text-tertiary-container text-xs font-label-caps uppercase tracking-widest font-semibold border border-tertiary-container/30">
                <HelpCircle size={13} />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="font-display-lg text-2xl sm:text-4xl text-primary dark:text-white font-bold">
                Tailoring &amp; Alteration FAQs in Salem
              </h2>
              <p className="font-body-md text-secondary text-xs sm:text-sm max-w-xl mx-auto">
                Got questions about our bespoke tailoring, alteration turnaround, or fitting process? Here are answers to common inquiries.
              </p>
            </div>

            <div className="space-y-4">
              {SERVICES_FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="border border-outline-variant rounded-xl bg-surface dark:bg-zinc-900 overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-primary dark:text-white hover:text-tertiary-container transition-colors cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="font-display-lg text-sm sm:text-base">{faq.question}</span>
                      <ChevronDown
                        size={18}
                        className={`text-tertiary-container shrink-0 transform transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="px-5 sm:px-6 pb-5 text-secondary text-xs sm:text-sm leading-relaxed border-t border-outline-variant/40 pt-4"
                        >
                          <p>{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom Consultation Banner */}
        <section className="py-16 sm:py-20 bg-inverse-surface dark:bg-zinc-950 text-white w-full border-t border-outline-variant/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-16 text-center space-y-6">
            <h2 className="font-display-lg text-2xl sm:text-4xl font-bold">
              Tailored Specifically For You in Salem
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Book a bespoke consultation to discuss fabric selections, style details, and precision measurements at our Swarnapuri atelier.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/contact"
                className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 bg-tertiary-container text-black font-label-caps text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-yellow-500 transition-all inline-flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Book Appointment in Salem</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/our-work-gallery"
                className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 border border-zinc-700 hover:border-tertiary-container text-white font-label-caps text-xs font-semibold uppercase tracking-wider rounded-full transition-all inline-flex items-center justify-center gap-2 hover:bg-zinc-900"
              >
                <span>See Our Work Gallery</span>
                <ArrowRight size={14} />
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

export default ServicesPage;
