import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  ShieldCheck,
  MessageCircle,
  Sparkles,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Crown,
  X,
} from "lucide-react";
import { Header } from "../components/Header";
import { ScrollProgress } from "../components/ScrollProgress";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { GoogleIcon } from "../components/GoogleIcon";
import { LazyGoogleMap } from "../components/LazyGoogleMap";
import {
  getWebSiteSchema,
  getOrganizationSchema,
  getLocalBusinessSchema,
  getServicesSchema,
} from "../utils/seoSchemas";
import {
  getWhatsAppUrl,
  getAppointmentWhatsAppUrl,
  DEFAULT_WHATSAPP_MESSAGES,
  AppointmentDetails,
} from "../utils/whatsapp";
import {
  DriveCategory,
  FALLBACK_CATEGORIES,
  PortfolioApiResponse,
} from "../types/gallery";
import { ReviewsApiResponse, GooglePlaceReviewItem } from "../types/reviews";

// Full Categorized Fantasy King Services List
interface ServiceCatalogItem {
  id: string;
  name: string;
  category: "Men's Tailoring" | "Alterations & Customization" | "Women's Tailoring" | "Bridal" | "Specialty";
  description: string;
  image?: string;
  featured?: boolean;
}

const ALL_SERVICES_CATALOG: ServiceCatalogItem[] = [
  // Men's Tailoring
  {
    id: "mens-suit-stitching",
    name: "Men's Suit Stitching",
    category: "Men's Tailoring",
    description: "Classic two-piece bespoke suits cut to your exact posture, shoulder profile, and silhouette.",
    featured: true,
    image: "/images/service-bespoke-suits.webp",
  },
  {
    id: "3-piece-suit-stitching",
    name: "3-Piece Suit Stitching",
    category: "Men's Tailoring",
    description: "Executive 3-piece ensembles featuring hand-padded lapels and tailored waistcoats.",
    featured: true,
    image: "/images/work-super150s-suit.webp",
  },
  {
    id: "tuxedo-stitching",
    name: "Tuxedo Stitching",
    category: "Men's Tailoring",
    description: "Black-tie ceremonial tuxedos with satin peak or shawl lapels tailored for gala events.",
    featured: true,
    image: "/images/work-midnight-tuxedo.webp",
  },
  {
    id: "wedding-suit-stitching",
    name: "Wedding Suit Stitching",
    category: "Men's Tailoring",
    description: "Celebratory bespoke groom wear, royal navy suits, and customized wedding attire.",
    featured: true,
    image: "/images/work-royal-navy-suit.webp",
  },
  {
    id: "coat-stitching",
    name: "Coat Stitching",
    category: "Men's Tailoring",
    description: "Structured blazers, sport coats, and overcoats tailored with floating canvas.",
  },
  {
    id: "pant-stitching",
    name: "Pant Stitching",
    category: "Men's Tailoring",
    description: "Precision dress trousers, Gurkha pants, and tailored chinos with custom waistband detailing.",
  },
  {
    id: "shirt-stitching",
    name: "Shirt Stitching",
    category: "Men's Tailoring",
    description: "Made-to-measure dress shirts with custom collar styles, mother-of-pearl buttons, and French cuffs.",
  },
  {
    id: "custom-suit-stitching",
    name: "Custom Suit Stitching",
    category: "Men's Tailoring",
    description: "Personalized pattern drafting from scratch with your choice of premium Italian and British textiles.",
  },

  // Alterations & Customization
  {
    id: "luxury-alterations-fitting",
    name: "Luxury Alterations & Fitting",
    category: "Alterations & Customization",
    description: "Precision adjustments and restyling of luxury garments, couture evening wear, and designer suits.",
    featured: true,
    image: "/images/service-alterations-fitting.webp",
  },
  {
    id: "custom-alterations",
    name: "Custom Alterations",
    category: "Alterations & Customization",
    description: "Tapering, hemming, sleeve adjustments, and neckline reshaping for an immaculate fit.",
  },
  {
    id: "suit-alterations",
    name: "Suit Alterations",
    category: "Alterations & Customization",
    description: "Complete jacket waist suppression, shoulder narrowing, and chest re-balancing.",
  },
  {
    id: "coat-alterations",
    name: "Coat Alterations",
    category: "Alterations & Customization",
    description: "Restyling vintage overcoats, shortening lengths, and replacing damaged linings.",
  },
  {
    id: "pant-alterations",
    name: "Pant Alterations",
    category: "Alterations & Customization",
    description: "Waist adjustment, seat easing, cuff alterations, and taper contouring.",
  },
  {
    id: "shirt-alterations",
    name: "Shirt Alterations",
    category: "Alterations & Customization",
    description: "Darting, sleeve shortening with placket recreation, and collar adjustments.",
  },
  {
    id: "garment-resizing",
    name: "Garment Resizing",
    category: "Alterations & Customization",
    description: "Full size alterations up or down while preserving the original design proportions.",
  },
  {
    id: "custom-measurements",
    name: "Custom Measurements",
    category: "Alterations & Customization",
    description: "Comprehensive 32-point body measurement recording for future wardrobe commissions.",
  },

  // Women's Tailoring
  {
    id: "womens-lehenga-stitching",
    name: "Women's Lehenga Stitching",
    category: "Women's Tailoring",
    description: "Exquisite bridal & festive lehengas tailored with custom flares, cancan layers, and designer latkans.",
  },
  {
    id: "blouse-stitching",
    name: "Blouse Stitching",
    category: "Women's Tailoring",
    description: "Designer blouse stitching with intricate neck patterns, padded cuts, and piping finishes.",
  },
  {
    id: "gown-stitching",
    name: "Gown Stitching",
    category: "Women's Tailoring",
    description: "Custom evening gowns, reception dresses, and structured party silhouettes.",
  },
  {
    id: "saree-blouse-alterations",
    name: "Saree Blouse Alterations",
    category: "Women's Tailoring",
    description: "Refitting, back depth adjustment, armhole easing, and cup alignment for saree blouses.",
  },
  {
    id: "womens-dress-stitching",
    name: "Women's Dress Stitching",
    category: "Women's Tailoring",
    description: "Made-to-measure bespoke dresses, jumpsuits, and formal skirts.",
  },
  {
    id: "custom-womens-wear",
    name: "Custom Women's Wear",
    category: "Women's Tailoring",
    description: "End-to-end custom tailoring for ethnic, Indo-western, and contemporary ensembles.",
  },

  // Bridal
  {
    id: "bridal-stitching",
    name: "Bridal Stitching",
    category: "Bridal",
    description: "Complete bridal party couture suites, wedding gowns, and ceremonial attire of the highest order.",
    featured: true,
    image: "/images/service-bridal-formalwear.webp",
  },
  {
    id: "bridal-blouse-stitching",
    name: "Bridal Blouse Stitching",
    category: "Bridal",
    description: "Heavily embellished bridal blouses with maggam work styling, custom padding, and precise fitting.",
  },
  {
    id: "bridal-lehenga-stitching",
    name: "Bridal Lehenga Stitching",
    category: "Bridal",
    description: "Regal bridal lehenga construction with multiple cancan layers, belt styling, and custom dupattas.",
  },
  {
    id: "bridal-gown-stitching",
    name: "Bridal Gown Stitching",
    category: "Bridal",
    description: "Couture wedding gowns with cascading trains, structured corsetry, and delicate lace finishes.",
  },
  {
    id: "wedding-wear-customization",
    name: "Wedding Wear Customization",
    category: "Bridal",
    description: "Theme matching, color coordination, and custom embroidery for the entire wedding entourage.",
  },
  {
    id: "bridal-alterations-fitting",
    name: "Bridal Alterations & Fitting",
    category: "Bridal",
    description: "Emergency bridal refitting, bustier contouring, and multi-layered gown hem alterations.",
  },

  // Specialty / Other
  {
    id: "doorstep-measurement-fitting",
    name: "Doorstep Measurement / Fitting",
    category: "Specialty",
    description: "Our master tailor visits your home or salon with fabric swatches and measurement tools for private fitting.",
    featured: true,
    image: "/images/about-heritage-atelier.webp",
  },
  {
    id: "kids-wear-stitching",
    name: "Kids Wear Stitching",
    category: "Specialty",
    description: "Miniature bespoke suits, ethnic sherwanis, and festive attire tailored with skin-friendly linings.",
  },
  {
    id: "designer-wear-customization",
    name: "Designer Wear Customization",
    category: "Specialty",
    description: "Collaborative pattern drafting to turn sketches, photos, or runway references into finished garments.",
  },
  {
    id: "occasion-wear-stitching",
    name: "Occasion Wear Stitching",
    category: "Specialty",
    description: "Handcrafted celebratory wear for anniversaries, galas, red carpet events, and corporate milestones.",
  },
];

const SERVICE_CATEGORIES = [
  "All Services",
  "Men's Tailoring",
  "Alterations & Customization",
  "Women's Tailoring",
  "Bridal",
  "Specialty",
] as const;

interface MainCategoryItem {
  id: string;
  name: string;
  categoryKey: "Men's Tailoring" | "Women's Tailoring" | "Alterations & Customization" | "Bridal";
  description: string;
  iconName: "scissors" | "sparkles" | "shield" | "crown";
  popularHighlight: string;
}

const MAIN_SERVICE_CATEGORIES: MainCategoryItem[] = [
  {
    id: "mens-tailoring",
    name: "MEN'S TAILORING",
    categoryKey: "Men's Tailoring",
    description: "Bespoke suits, shirts, pants, coats, wedding wear and formal tailoring.",
    iconName: "scissors",
    popularHighlight: "Bespoke Suits • Shirts • Pants • Tuxedos",
  },
  {
    id: "womens-tailoring",
    name: "WOMEN'S TAILORING",
    categoryKey: "Women's Tailoring",
    description: "Blouses, sarees, lehengas, gowns, dresses and custom women's wear.",
    iconName: "sparkles",
    popularHighlight: "Blouses • Sarees • Lehengas • Gowns • Dresses",
  },
  {
    id: "alterations-fitting",
    name: "ALTERATIONS & FITTING",
    categoryKey: "Alterations & Customization",
    description: "Professional garment alterations, resizing, fitting adjustments and restyling.",
    iconName: "shield",
    popularHighlight: "Fitting Adjustments • Resizing • Restyling",
  },
  {
    id: "bridal-wedding",
    name: "BRIDAL & WEDDING",
    categoryKey: "Bridal",
    description: "Bridal wear, wedding outfits and specialized ceremonial tailoring.",
    iconName: "crown",
    popularHighlight: "Bridal Wear • Wedding Outfits • Ceremonial Tailoring",
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>("All Services");
  const [activeCategoryModal, setActiveCategoryModal] = useState<string | null>(null);

  // Google Drive Folder Categories State
  const [categories, setCategories] = useState<DriveCategory[]>(FALLBACK_CATEGORIES);
  const [galleryLoading, setGalleryLoading] = useState<boolean>(true);

  // Appointment Form State
  const [formData, setFormData] = useState<AppointmentDetails>({
    name: "",
    email: "",
    phone: "",
    date: "",
    service: (location.state as any)?.selectedService || "Men's Suit Stitching",
    notes: "",
  });

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    date?: string;
    service?: string;
  }>({});

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submittedWhatsAppUrl, setSubmittedWhatsAppUrl] = useState<string>("");

  // Handle incoming scroll targets from detail page
  useEffect(() => {
    const state = location.state as any;
    if (state?.targetSection) {
      setTimeout(() => {
        const el = document.getElementById(state.targetSection);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [location.state]);

  const [reviewsData, setReviewsData] = useState<ReviewsApiResponse | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // Fetch Google Drive Categories from /api/portfolio
  const fetchGallery = async () => {
    setGalleryLoading(true);
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
      setGalleryLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      setReviewsError(null);
      const res = await fetch("/api/reviews");
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch reviews`);
      }
      const json: ReviewsApiResponse = await res.json();
      setReviewsData(json);
      if (json.error && (!json.reviews || json.reviews.length === 0)) {
        setReviewsError(json.error);
      }
    } catch (err: any) {
      console.error("Error fetching reviews:", err);
      setReviewsError("Google reviews are temporarily unavailable. Please check back shortly.");
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    // Defer non-critical API calls to ensure initial render is fast and uninterrupted
    const deferTimer = setTimeout(() => {
      fetchGallery();
      fetchReviews();
    }, 600);

    return () => clearTimeout(deferTimer);
  }, []);

  const filteredServices =
    selectedServiceCategory === "All Services"
      ? ALL_SERVICES_CATALOG
      : ALL_SERVICES_CATALOG.filter((item) => item.category === selectedServiceCategory);

  const smoothScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSelectServiceForBooking = (serviceName: string) => {
    setFormData((prev) => ({ ...prev, service: serviceName }));
    setFormErrors((prev) => ({ ...prev, service: undefined }));
    smoothScrollTo("appointment");
  };

  const validateForm = (): boolean => {
    const errors: {
      name?: string;
      email?: string;
      phone?: string;
      date?: string;
      service?: string;
    } = {};

    if (!formData.name.trim()) {
      errors.name = "Full Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone Number is required";
    } else if (formData.phone.replace(/\D/g, "").length < 7) {
      errors.phone = "Please enter a valid phone number with country/area code";
    }

    if (!formData.date.trim()) {
      errors.date = "Preferred consultation date is required";
    }

    if (!formData.service.trim() || formData.service === "Select a service") {
      errors.service = "Please select a desired service";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // 1. Post to Server-Side Backend to Save in Google Sheets
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(
          data.error || "Unable to submit your appointment. Please try again."
        );
      }

      // 2. Format WhatsApp URL with prefilled appointment details and submission ID
      const whatsappUrl = getAppointmentWhatsAppUrl({
        ...formData,
        submissionId: data.submissionId,
      });
      setSubmittedWhatsAppUrl(whatsappUrl);
      setIsSubmitted(true);

      // 3. Open WhatsApp after successful save
      try {
        const win = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        if (!win || win.closed || typeof win.closed === "undefined") {
          window.location.href = whatsappUrl;
        }
      } catch {
        window.location.href = whatsappUrl;
      }
    } catch (err: any) {
      setSubmissionError(
        err?.message || "Unable to submit your appointment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 25 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-surface text-on-surface overflow-x-hidden">
      <SEO
        title="FANTASY KING | Best Designer & Tailor Alterations"
        description="FANTASY KING is Salem's premier bespoke tailor in Swarnapuri. Expert custom suit tailoring, designer blouses, bridal wear & precision garment alterations."
        canonicalPath="/"
        schema={[
          getWebSiteSchema(),
          getOrganizationSchema(),
          getLocalBusinessSchema(),
          getServicesSchema(),
        ]}
      />
      <ScrollProgress />
      <Header />

      <main className="flex-grow pt-[57px] md:pt-[73px] w-full overflow-x-hidden">
        {/* ========================================================================= */}
        {/* 1. 4-CATEGORY VISUAL TAILORING HERO SELECTION (#home)                     */}
        {/* ========================================================================= */}
        <section
          id="home"
          className="relative w-full overflow-hidden scroll-mt-20 md:scroll-mt-24 bg-black"
        >
          {/* Top Brand Banner Tagline & Primary SEO H1 */}
          <div className="bg-zinc-950 py-3 sm:py-3.5 px-4 text-center border-b border-zinc-800">
            <h1 className="text-[12px] sm:text-xs md:text-sm font-label-caps uppercase tracking-[0.16em] sm:tracking-[0.24em] text-tertiary-fixed font-semibold flex items-center justify-center gap-2">
              <Sparkles size={13} className="text-tertiary-container shrink-0" />
              <span>Bespoke Tailoring &amp; Designer Alterations in Salem</span>
              <Sparkles size={13} className="text-tertiary-container shrink-0" />
            </h1>
            <p className="text-[10px] sm:text-[11px] text-zinc-400 tracking-wider uppercase mt-0.5">
              Custom Stitching For Men • Women • Kids • Bridal • Swarnapuri &amp; Alagapuram
            </p>
          </div>

          {/* 2x2 Grid of Tailoring Experience Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[640px] lg:min-h-[82vh]">
            {/* Panel 1: Men's Tailoring */}
            <div
              onClick={() => setActiveCategoryModal("Men's Tailoring")}
              className="group relative min-h-[260px] xs:min-h-[290px] sm:min-h-[340px] md:min-h-[360px] overflow-hidden cursor-pointer border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-end p-5 xs:p-6 sm:p-8 lg:p-12 transition-all duration-300"
            >
              <img
                src="/images/shop-mens-tailoring.webp"
                srcSet="/images/shop-mens-tailoring-mobile.webp 640w, /images/shop-mens-tailoring.webp 1200w"
                sizes="(max-width: 640px) 100vw, 50vw"
                alt="Master tailor measuring male customer for bespoke suits and shirts in tailoring shop"
                width={1200}
                height={800}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 group-hover:via-black/45 transition-colors duration-300 z-10" />

              <div className="relative z-20 space-y-1.5 xs:space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] sm:text-[11px] font-label-caps uppercase tracking-widest text-tertiary-fixed font-semibold border border-white/15 mb-0.5">
                  Atelier 01
                </span>
                <h2 className="font-display-lg text-xl xs:text-2xl sm:text-3xl lg:text-4xl text-white font-bold tracking-tight uppercase group-hover:text-tertiary-fixed transition-colors duration-300">
                  Men's Tailoring
                </h2>
                <p className="text-gray-200 text-xs sm:text-sm font-light tracking-wide max-w-md">
                  Bespoke Suits • Shirts • Pants • Coats
                </p>
                <div className="pt-1.5 xs:pt-2">
                  <span className="inline-flex items-center gap-2 font-label-caps text-xs tracking-wider uppercase font-semibold text-tertiary-container group-hover:text-yellow-300 transition-colors">
                    <span className="border-b border-tertiary-container/60 group-hover:border-yellow-300 pb-0.5">
                      Explore Men's Tailoring
                    </span>
                    <ArrowRight size={14} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
                  </span>
                </div>
              </div>
            </div>

            {/* Panel 2: Women's Tailoring */}
            <div
              onClick={() => setActiveCategoryModal("Women's Tailoring")}
              className="group relative min-h-[260px] xs:min-h-[290px] sm:min-h-[340px] md:min-h-[360px] overflow-hidden cursor-pointer border-b border-white/10 flex flex-col justify-end p-5 xs:p-6 sm:p-8 lg:p-12 transition-all duration-300"
            >
              <img
                src="/images/shop-womens-tailoring.webp"
                srcSet="/images/shop-womens-tailoring-mobile.webp 640w, /images/shop-womens-tailoring.webp 1200w"
                sizes="(max-width: 640px) 100vw, 50vw"
                alt="Professional female tailor measuring female customer for custom dresses, blouses and sarees"
                width={1200}
                height={800}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 group-hover:via-black/45 transition-colors duration-300 z-10" />

              <div className="relative z-20 space-y-1.5 xs:space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] sm:text-[11px] font-label-caps uppercase tracking-widest text-tertiary-fixed font-semibold border border-white/15 mb-0.5">
                  Atelier 02
                </span>
                <h2 className="font-display-lg text-xl xs:text-2xl sm:text-3xl lg:text-4xl text-white font-bold tracking-tight uppercase group-hover:text-tertiary-fixed transition-colors duration-300">
                  Women's Tailoring
                </h2>
                <p className="text-gray-200 text-xs sm:text-sm font-light tracking-wide max-w-md">
                  Blouses • Dresses • Sarees • Lehengas
                </p>
                <div className="pt-1.5 xs:pt-2">
                  <span className="inline-flex items-center gap-2 font-label-caps text-xs tracking-wider uppercase font-semibold text-tertiary-container group-hover:text-yellow-300 transition-colors">
                    <span className="border-b border-tertiary-container/60 group-hover:border-yellow-300 pb-0.5">
                      Explore Women's Tailoring
                    </span>
                    <ArrowRight size={14} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
                  </span>
                </div>
              </div>
            </div>

            {/* Panel 3: Kids' Tailoring */}
            <div
              onClick={() => setActiveCategoryModal("Specialty")}
              className="group relative min-h-[260px] xs:min-h-[290px] sm:min-h-[340px] md:min-h-[360px] overflow-hidden cursor-pointer border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-end p-5 xs:p-6 sm:p-8 lg:p-12 transition-all duration-300"
            >
              <img
                src="/images/shop-kids-tailoring.webp"
                srcSet="/images/shop-kids-tailoring-mobile.webp 640w, /images/shop-kids-tailoring.webp 1200w"
                sizes="(max-width: 640px) 100vw, 50vw"
                alt="Friendly master tailor taking measurements of a smiling child for custom outfits in tailoring shop"
                width={1200}
                height={800}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 group-hover:via-black/45 transition-colors duration-300 z-10" />

              <div className="relative z-20 space-y-1.5 xs:space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] sm:text-[11px] font-label-caps uppercase tracking-widest text-tertiary-fixed font-semibold border border-white/15 mb-0.5">
                  Atelier 03
                </span>
                <h2 className="font-display-lg text-xl xs:text-2xl sm:text-3xl lg:text-4xl text-white font-bold tracking-tight uppercase group-hover:text-tertiary-fixed transition-colors duration-300">
                  Kids' Tailoring
                </h2>
                <p className="text-gray-200 text-xs sm:text-sm font-light tracking-wide max-w-md">
                  Kids Wear • School Wear • Custom Outfits
                </p>
                <div className="pt-1.5 xs:pt-2">
                  <span className="inline-flex items-center gap-2 font-label-caps text-xs tracking-wider uppercase font-semibold text-tertiary-container group-hover:text-yellow-300 transition-colors">
                    <span className="border-b border-tertiary-container/60 group-hover:border-yellow-300 pb-0.5">
                      Explore Kids' Tailoring
                    </span>
                    <ArrowRight size={14} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
                  </span>
                </div>
              </div>
            </div>

            {/* Panel 4: Bridal & Wedding */}
            <div
              onClick={() => setActiveCategoryModal("Bridal")}
              className="group relative min-h-[260px] xs:min-h-[290px] sm:min-h-[340px] md:min-h-[360px] overflow-hidden cursor-pointer flex flex-col justify-end p-5 xs:p-6 sm:p-8 lg:p-12 transition-all duration-300"
            >
              <img
                src="/images/shop-bridal-tailoring.webp"
                srcSet="/images/shop-bridal-tailoring-mobile.webp 640w, /images/shop-bridal-tailoring.webp 1200w"
                sizes="(max-width: 640px) 100vw, 50vw"
                alt="Master bridal couturier delicately fitting exquisite custom bridal lehenga and wedding gown in atelier"
                width={1200}
                height={800}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 group-hover:via-black/45 transition-colors duration-300 z-10" />

              <div className="relative z-20 space-y-1.5 xs:space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] sm:text-[11px] font-label-caps uppercase tracking-widest text-tertiary-fixed font-semibold border border-white/15 mb-0.5">
                  Atelier 04
                </span>
                <h2 className="font-display-lg text-xl xs:text-2xl sm:text-3xl lg:text-4xl text-white font-bold tracking-tight uppercase group-hover:text-tertiary-fixed transition-colors duration-300">
                  Bridal &amp; Wedding
                </h2>
                <p className="text-gray-200 text-xs sm:text-sm font-light tracking-wide max-w-md">
                  Bridal Wear • Wedding Outfits • Custom Stitching
                </p>
                <div className="pt-1.5 xs:pt-2">
                  <span className="inline-flex items-center gap-2 font-label-caps text-xs tracking-wider uppercase font-semibold text-tertiary-container group-hover:text-yellow-300 transition-colors">
                    <span className="border-b border-tertiary-container/60 group-hover:border-yellow-300 pb-0.5">
                      Explore Bridal
                    </span>
                    <ArrowRight size={14} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Metrics Bar */}
        <section className="relative z-30 mt-6 sm:mt-8 md:-mt-12 max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-950/95 backdrop-blur-md shadow-2xl rounded-2xl p-5 sm:p-8 border border-zinc-800"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800 text-center">
              <div className="flex flex-col items-center p-2 sm:p-4">
                <Scissors className="text-tertiary-container mb-3 sm:mb-4" size={28} />
                <h3 className="text-2xl sm:text-3xl font-display-lg text-white font-bold">1 lakh+</h3>
                <p className="text-zinc-300 font-label-caps text-xs sm:text-sm tracking-widest uppercase mt-1 sm:mt-2 font-medium">Bespoke Garments Crafted</p>
              </div>
              <div className="flex flex-col items-center pt-5 sm:pt-4 sm:p-4">
                <Star className="text-tertiary-container mb-3 sm:mb-4" size={28} />
                <h3 className="text-2xl sm:text-3xl font-display-lg text-white font-bold">25 Years</h3>
                <p className="text-zinc-300 font-label-caps text-xs sm:text-sm tracking-widest uppercase mt-1 sm:mt-2 font-medium">Master Tailoring</p>
              </div>
              <div className="flex flex-col items-center pt-5 sm:pt-4 sm:p-4">
                <Clock className="text-tertiary-container mb-3 sm:mb-4" size={28} />
                <h3 className="text-2xl sm:text-3xl font-display-lg text-white font-bold">5 Days</h3>
                <p className="text-zinc-300 font-label-caps text-xs sm:text-sm tracking-widest uppercase mt-1 sm:mt-2 font-medium">Precision Delivery</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ========================================================================= */}
        {/* 2. ABOUT US SECTION (#about) (Fix 2: High contrast dark typography on light) */}
        {/* ========================================================================= */}
        <section
          id="about"
          className="py-16 sm:py-24 md:py-32 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-16 scroll-mt-20 md:scroll-mt-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16 sm:mb-24">
            <motion.div {...fadeInUp} className="lg:col-span-6 space-y-4 sm:space-y-6">
              <p className="font-label-caps text-xs tracking-[0.2em] text-tertiary-container uppercase font-semibold">
                Heritage &amp; Atelier Tradition
              </p>
              <h2 className="font-display-lg text-2xl xs:text-3xl sm:text-4xl md:text-5xl text-zinc-950 leading-tight font-bold">
                25+ Years of Experience.<br />A Lifetime of Precision.
              </h2>
              <p className="font-body-md text-zinc-700 text-sm sm:text-base leading-relaxed">
                Our atelier is founded on the principles of traditional bespoke tailoring, master pattern drafting, and precise luxury alterations. Every stitch is deliberate, every cut calculated to enhance your silhouette and comfort.
              </p>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-zinc-200">
                <div>
                  <h4 className="font-display-lg text-xl sm:text-2xl font-bold text-zinc-950">100% Custom</h4>
                  <p className="text-zinc-600 font-label-caps text-[11px] sm:text-xs uppercase tracking-wider mt-1 font-medium">Individual Paper Patterns</p>
                </div>
                <div>
                  <h4 className="font-display-lg text-xl sm:text-2xl font-bold text-zinc-950">Floating Canvas</h4>
                  <p className="text-zinc-600 font-label-caps text-[11px] sm:text-xs uppercase tracking-wider mt-1 font-medium">Natural Lifetime Drape</p>
                </div>
              </div>
              <div className="pt-2 sm:pt-4">
                <button
                  onClick={() => smoothScrollTo("appointment")}
                  className="font-label-caps text-xs uppercase font-semibold text-zinc-950 pb-1 border-b-2 border-tertiary-container hover:text-tertiary-container transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  Schedule Private Atelier Visit <ArrowRight size={14} className="text-tertiary-container" />
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-zinc-200"
            >
              <img
                src="/images/about-heritage-atelier.webp"
                alt="Bespoke menswear suits and handcrafted jackets displayed in atelier workshop"
                width={800}
                height={600}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          </div>

          {/* 3 Pillars of Craftsmanship (Fix 4: Dark cards with gold number, white title, light grey text) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8 pt-8 sm:pt-12 border-t border-zinc-200">
            <div className="p-5 sm:p-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-md">
              <span className="font-display-lg text-2xl sm:text-3xl text-tertiary-container font-bold block mb-2 sm:mb-3">01</span>
              <h3 className="font-headline-md text-lg sm:text-xl text-white mb-2 font-semibold">Individual Pattern Drafting</h3>
              <p className="font-body-md text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Every client receives a 100% bespoke paper pattern drafted manually by our master cutters according to your posture.
              </p>
            </div>
            <div className="p-5 sm:p-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-md">
              <span className="font-display-lg text-2xl sm:text-3xl text-tertiary-container font-bold block mb-2 sm:mb-3">02</span>
              <h3 className="font-headline-md text-lg sm:text-xl text-white mb-2 font-semibold">Full Floating Horsehair Canvas</h3>
              <p className="font-body-md text-xs sm:text-sm text-zinc-300 leading-relaxed">
                We utilize floating natural canvas interlinings that mold comfortably to your chest over time for unmatched longevity.
              </p>
            </div>
            <div className="p-5 sm:p-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-md sm:col-span-2 md:col-span-1">
              <span className="font-display-lg text-2xl sm:text-3xl text-tertiary-container font-bold block mb-2 sm:mb-3">03</span>
              <h3 className="font-headline-md text-lg sm:text-xl text-white mb-2 font-semibold">Sartorial Hand-Stitching</h3>
              <p className="font-body-md text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Hand-padded lapels, Milanese silk buttonholes, and surgeon cuffs — over 50 hours of hand labor goes into each garment.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. PRIMARY SERVICES CATEGORIES SECTION (#services) (Fix 5: Dark cards)    */}
        {/* ========================================================================= */}
        <section
          id="services"
          className="py-16 sm:py-24 md:py-28 bg-zinc-950 w-full scroll-mt-20 md:scroll-mt-24 border-y border-zinc-800"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tertiary-container/15 text-tertiary-fixed text-xs font-label-caps uppercase tracking-widest font-semibold mb-3.5 border border-tertiary-container/30">
                <Sparkles size={13} className="text-tertiary-container" />
                <span>Master Atelier Offerings</span>
              </div>
              <h2 className="font-display-lg text-2xl xs:text-3xl sm:text-4xl md:text-5xl text-white mb-3 font-bold">
                Our Tailoring &amp; Stitching Services
              </h2>
              <p className="font-body-md text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed">
                Precision bespoke craftsmanship tailored to your exact measurements, posture, and personal style.
              </p>
              <div className="w-20 sm:w-24 h-1 bg-tertiary-container mx-auto rounded-full mt-4" />
            </div>

            {/* 4 Primary Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {MAIN_SERVICE_CATEGORIES.map((cat, idx) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  className="flex flex-col justify-between group p-6 sm:p-7 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-tertiary-container/70 transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  <div>
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-tertiary-container/15 text-tertiary-container flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-tertiary-container group-hover:text-black transition-all duration-300">
                      {cat.iconName === "scissors" && <Scissors size={22} />}
                      {cat.iconName === "sparkles" && <Sparkles size={22} />}
                      {cat.iconName === "shield" && <ShieldCheck size={22} />}
                      {cat.iconName === "crown" && <Crown size={22} />}
                    </div>

                    {/* Category Title */}
                    <h3 className="font-display-lg text-lg sm:text-xl text-white font-bold tracking-wide uppercase mb-2.5 group-hover:text-tertiary-fixed transition-colors">
                      {cat.name}
                    </h3>

                    {/* Description */}
                    <p className="font-body-md text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
                      {cat.description}
                    </p>

                    {/* Highlighted Services */}
                    <p className="text-[11px] font-label-caps uppercase tracking-wider text-tertiary-fixed font-semibold mb-6">
                      {cat.popularHighlight}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-800">
                    <button
                      onClick={() => setActiveCategoryModal(cat.categoryKey)}
                      className="font-label-caps text-xs font-semibold uppercase tracking-wider text-tertiary-container group-hover:text-yellow-300 inline-flex items-center gap-2 transition-colors cursor-pointer py-1"
                    >
                      <span className="border-b border-transparent group-hover:border-yellow-300 pb-0.5">
                        EXPLORE SERVICES
                      </span>
                      <ArrowRight size={14} className="transform group-hover:translate-x-1.5 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Explore Services Modal */}
        {activeCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
            <div
              className="bg-zinc-900 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-zinc-700 shadow-2xl"
              role="dialog"
              aria-modal="true"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
                <div>
                  <span className="text-[11px] font-label-caps uppercase tracking-widest text-tertiary-fixed font-semibold block mb-1">
                    Bespoke Atelier Catalog
                  </span>
                  <h3 className="font-display-lg text-xl sm:text-2xl text-white font-bold uppercase">
                    {activeCategoryModal}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveCategoryModal(null)}
                  className="w-9 h-9 rounded-full bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-zinc-700"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Services List */}
              <div className="p-5 sm:p-6 overflow-y-auto divide-y divide-zinc-800 space-y-4">
                {ALL_SERVICES_CATALOG.filter((s) => s.category === activeCategoryModal).map((service) => (
                  <div key={service.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="max-w-md">
                      <h4 className="font-display-lg text-base sm:text-lg text-white font-semibold mb-1">
                        {service.name}
                      </h4>
                      <p className="font-body-md text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveCategoryModal(null);
                        handleSelectServiceForBooking(service.name);
                      }}
                      className="shrink-0 min-h-[38px] px-4 py-2 rounded-xl bg-tertiary-container text-black text-xs font-label-caps uppercase font-semibold hover:bg-yellow-500 active:scale-95 transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Book Service</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <p className="text-xs text-zinc-400">
                  Looking for custom fabric consultation or private doorstep measurements?
                </p>
                <button
                  onClick={() => {
                    setActiveCategoryModal(null);
                    smoothScrollTo("appointment");
                  }}
                  className="text-xs font-label-caps uppercase font-semibold text-tertiary-fixed hover:underline cursor-pointer shrink-0"
                >
                  Book Consultation →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. REAL-WORLD TAILORING SERVICES SHOWCASE (#our-work)                     */}
        {/* ========================================================================= */}
        <section
          id="our-work"
          className="py-16 sm:py-24 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 md:px-16 scroll-mt-20 md:scroll-mt-24"
        >
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tertiary-container/15 text-tertiary-container text-xs font-label-caps uppercase tracking-widest font-semibold mb-3.5 border border-tertiary-container/30">
              <Scissors size={13} />
              <span>Authentic Craftsmanship • Physical Tailoring Atelier</span>
            </div>
            <h2 className="font-display-lg text-2xl xs:text-3xl sm:text-4xl md:text-5xl text-zinc-950 font-bold mb-3">
              Our Tailoring Services
            </h2>
            <p className="font-headline-md text-base sm:text-xl text-tertiary-container font-semibold mb-3">
              Expert Stitching &amp; Alterations for Men and Women
            </p>
            <p className="font-body-md text-zinc-700 text-xs sm:text-sm md:text-base leading-relaxed">
              From precise measurements to the final stitch, we create and alter garments to fit you perfectly.
            </p>
            <div className="w-20 sm:w-24 h-1 bg-tertiary-container mx-auto rounded-full mt-5" />
          </div>

          {/* Explore Our Work Gallery Highlight Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 sm:mb-14 p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:border-tertiary-container/70 transition-all flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-tertiary-container text-[11px] font-label-caps uppercase tracking-widest font-semibold mb-2 border border-amber-200/60">
                <Sparkles size={12} />
                <span>Dedicated Digital Folders</span>
              </div>
              <h3 className="font-display-lg text-xl sm:text-2xl font-bold text-zinc-950">
                Explore Our Work Gallery
              </h3>
              <p className="font-body-md text-xs sm:text-sm text-zinc-600 mt-1 max-w-xl">
                Browse our work by category to see our latest stitching, alterations, suits, blouse designs and custom creations.
              </p>
            </div>

            <Link
              to="/our-work-gallery"
              className="shrink-0 min-h-[46px] px-7 py-3 rounded-xl bg-black hover:bg-tertiary-container text-white hover:text-black font-label-caps text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-md active:scale-95 group"
            >
              <span>VIEW GALLERY</span>
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* 4 Core Real-World Tailoring Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 mb-12 sm:mb-16">
            {/* Card 1: Men's Tailoring */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-tertiary-container/60 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src="/images/shop-mens-tailoring.webp"
                    alt="Professional master tailor measuring male customer with measuring tape in tailoring shop"
                    width={600}
                    height={450}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-label-caps uppercase tracking-wider text-tertiary-fixed font-semibold border border-white/10">
                      Men's Atelier
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-display-lg text-lg sm:text-xl text-white font-bold tracking-wide uppercase">
                      Men's Tailoring
                    </h3>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <p className="font-body-md text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
                    Custom shirts, pants, suits, blazers and traditional wear.
                  </p>

                  <ul className="space-y-2 mb-5 text-xs text-zinc-300">
                    <li className="flex items-center gap-2">
                      <Check size={13} className="text-tertiary-container shrink-0" />
                      <span>Shoulder &amp; chest posture drafting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={13} className="text-tertiary-container shrink-0" />
                      <span>Executive 2-piece &amp; 3-piece suits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={13} className="text-tertiary-container shrink-0" />
                      <span>Custom shirts, trousers &amp; ethnic wear</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                <button
                  onClick={() => handleSelectServiceForBooking("Men's Suit Stitching")}
                  className="w-full min-h-[40px] px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 group-hover:bg-tertiary-container group-hover:text-black group-hover:border-tertiary-container text-white font-label-caps text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Book Men's Tailoring</span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Card 2: Women's Tailoring */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-tertiary-container/60 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src="/images/shop-womens-tailoring.webp"
                    alt="Professional female tailor measuring female customer for custom outfit with measuring tape"
                    width={600}
                    height={450}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-label-caps uppercase tracking-wider text-tertiary-fixed font-semibold border border-white/10">
                      Women's Atelier
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-display-lg text-lg sm:text-xl text-white font-bold tracking-wide uppercase">
                      Women's Tailoring
                    </h3>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <p className="font-body-md text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
                    Custom dresses, blouses, sarees, salwar suits and other outfits.
                  </p>

                  <ul className="space-y-2 mb-5 text-xs text-zinc-300">
                    <li className="flex items-center gap-2">
                      <Check size={13} className="text-tertiary-container shrink-0" />
                      <span>Designer blouses &amp; padded cuts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={13} className="text-tertiary-container shrink-0" />
                      <span>Custom gowns, lehengas &amp; dresses</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={13} className="text-tertiary-container shrink-0" />
                      <span>Saree blouse fitting &amp; alterations</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                <button
                  onClick={() => handleSelectServiceForBooking("Blouse Stitching")}
                  className="w-full min-h-[40px] px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 group-hover:bg-tertiary-container group-hover:text-black group-hover:border-tertiary-container text-white font-label-caps text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Book Women's Tailoring</span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Card 3: Alterations */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.19 }}
              className="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-tertiary-container/60 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src="/images/shop-alterations.webp"
                    alt="Master tailor pinning and marking garment for precision alterations on cutting table"
                    width={600}
                    height={450}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-label-caps uppercase tracking-wider text-tertiary-fixed font-semibold border border-white/10">
                      Fitting &amp; Restyling
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-display-lg text-lg sm:text-xl text-white font-bold tracking-wide uppercase">
                      Alterations
                    </h3>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <p className="font-body-md text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
                    Professional fitting adjustments and garment modifications.
                  </p>

                  <ul className="space-y-2 mb-5 text-xs text-zinc-300">
                    <li className="flex items-center gap-2">
                      <Check size={13} className="text-tertiary-container shrink-0" />
                      <span>Waist, shoulder &amp; sleeve tapering</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={13} className="text-tertiary-container shrink-0" />
                      <span>Suit, coat &amp; pant resizing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={13} className="text-tertiary-container shrink-0" />
                      <span>Couture &amp; bridal garment refitting</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                <button
                  onClick={() => handleSelectServiceForBooking("Luxury Alterations & Fitting")}
                  className="w-full min-h-[40px] px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 group-hover:bg-tertiary-container group-hover:text-black group-hover:border-tertiary-container text-white font-label-caps text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Request Alterations</span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Card 4: Custom Stitching */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.26 }}
              className="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-tertiary-container/60 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src="/images/shop-custom-stitching.webp"
                    alt="Master tailor operating industrial sewing machine with precision stitches in workshop"
                    width={600}
                    height={450}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-label-caps uppercase tracking-wider text-tertiary-fixed font-semibold border border-white/10">
                      Bespoke Craft
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-display-lg text-lg sm:text-xl text-white font-bold tracking-wide uppercase">
                      Custom Stitching
                    </h3>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <p className="font-body-md text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
                    Personalized designs created according to your measurements and requirements.
                  </p>

                  <ul className="space-y-2 mb-5 text-xs text-zinc-300">
                    <li className="flex items-center gap-2">
                      <Check size={13} className="text-tertiary-container shrink-0" />
                      <span>Custom pattern drafting from scratch</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={13} className="text-tertiary-container shrink-0" />
                      <span>Floating canvas &amp; fine hand stitches</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={13} className="text-tertiary-container shrink-0" />
                      <span>Your choice of cuts, collars &amp; linings</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                <button
                  onClick={() => handleSelectServiceForBooking("Custom Suit Stitching")}
                  className="w-full min-h-[40px] px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 group-hover:bg-tertiary-container group-hover:text-black group-hover:border-tertiary-container text-white font-label-caps text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Order Custom Stitching</span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* 5. In-Shop Experience & Fabric Selection Highlight Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-lg"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-6 p-6 sm:p-8 md:p-10 space-y-4 sm:space-y-6">
                <span className="text-xs font-label-caps uppercase tracking-[0.2em] text-tertiary-fixed font-semibold block">
                  In-Store Tailoring Experience
                </span>
                <h3 className="font-display-lg text-xl sm:text-2xl md:text-3xl text-white font-semibold leading-tight">
                  Fabric &amp; Design Selection With Our Master Tailors
                </h3>
                <p className="font-body-md text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  Visit our workshop to explore premium fabric rolls, silk swatches, and bespoke design catalogs. Work directly with our tailors to customize collar styles, cuff details, flares, and pocket structures.
                </p>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2">
                  <div className="p-3 sm:p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-tertiary-container font-display-lg text-lg font-bold block mb-1">01. Measure</span>
                    <p className="text-[11px] sm:text-xs text-zinc-300">32-point precise body measurements taken in person.</p>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-tertiary-container font-display-lg text-lg font-bold block mb-1">02. Craft</span>
                    <p className="text-[11px] sm:text-xs text-zinc-300">Master cutting, machine stitching &amp; trial fitting.</p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => smoothScrollTo("appointment")}
                    className="min-h-[44px] px-6 py-3 rounded-full bg-tertiary-container text-black font-label-caps text-xs font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-2 hover:bg-yellow-500 active:scale-95 transition-all cursor-pointer shadow-sm"
                  >
                    <span>Schedule In-Shop Consultation</span>
                    <ArrowRight size={14} />
                  </button>
                  <a
                    href={getWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGES.consultation)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-6 py-3 rounded-full border border-zinc-700 hover:border-tertiary-container text-white font-label-caps text-xs font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all cursor-pointer"
                  >
                    <MessageCircle size={14} className="text-[#25D366]" />
                    <span>WhatsApp Master Tailor</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6 relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[300px]">
                <img
                  src="/images/shop-fabric-selection.webp"
                  alt="Tailor and customer reviewing fabric swatch books and luxury fabric rolls at tailoring shop counter"
                  width={800}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/70 via-transparent to-transparent" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* ========================================================================= */}
        {/* 5. REVIEWS & ACCOLADES SECTION (#reviews)                                  */}
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* 5. REVIEWS & ACCOLADES SECTION (#reviews)                                  */}
        {/* ========================================================================= */}
        <section
          id="reviews"
          className="py-16 sm:py-24 md:py-32 bg-surface-container-low w-full scroll-mt-20 md:scroll-mt-24"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
            <div className="text-center mb-10 sm:mb-14">
              <p className="font-label-caps text-xs tracking-[0.2em] text-tertiary-container uppercase font-semibold mb-2 sm:mb-3">
                Client Endorsements
              </p>
              <h2 className="font-display-lg text-2xl xs:text-3xl sm:text-4xl md:text-5xl text-zinc-950 mb-4 sm:mb-6 font-bold">
                Reviews &amp; Accolades
              </h2>

              {/* Dynamic Google Live Rating Summary Pill */}
              <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-5 px-6 py-3 rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-bold font-display-lg text-zinc-950">
                    {(reviewsData?.business?.rating ?? reviewsData?.rating ?? 5.0).toFixed(1)}
                  </span>
                  <div className="flex text-tertiary-container">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={17}
                        className="text-tertiary-container fill-tertiary-container"
                      />
                    ))}
                  </div>
                </div>

                <div className="h-4 w-px bg-zinc-200 hidden sm:block"></div>

                <span className="text-xs sm:text-sm font-medium text-zinc-700">
                  Based on{" "}
                  <strong className="text-zinc-950 font-semibold">
                    {reviewsData?.business?.userRatingCount ?? reviewsData?.totalReviews ?? 213} Google reviews
                  </strong>
                </span>

                <div className="h-4 w-px bg-zinc-200 hidden sm:block"></div>

                <a
                  href={reviewsData?.business?.googleMapsUri || reviewsData?.googleMapsUri || "https://www.google.com/maps/place/FANTASY+KING+(Designer)+alteration+%26+tailoring/@11.6762356,78.137468,17z/data=!3m1!4b1!4m6!3m5!1s0x3babf1a42dce11fb:0xcfe95d8a18e2f334!8m2!3d11.6762356!4d78.137468!16s%2Fg%2F11xf_c9fbr"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-tertiary-container hover:underline inline-flex items-center gap-1"
                >
                  <GoogleIcon className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              <div className="w-20 sm:w-24 h-1 bg-tertiary-container mx-auto rounded-full mt-6" />
            </div>

            {/* Loading Skeleton */}
            {reviewsLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm animate-pulse flex flex-col justify-between h-64"
                  >
                    <div className="space-y-3">
                      <div className="flex gap-1 text-tertiary-container">
                        {[...Array(5)].map((_, s) => (
                          <div key={s} className="w-4 h-4 bg-zinc-200 rounded"></div>
                        ))}
                      </div>
                      <div className="h-3 bg-zinc-200 rounded w-full"></div>
                      <div className="h-3 bg-zinc-200 rounded w-4/5"></div>
                      <div className="h-3 bg-zinc-200 rounded w-2/3"></div>
                    </div>
                    <div className="pt-4 border-t border-zinc-200 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-200"></div>
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3 bg-zinc-200 rounded w-1/2"></div>
                        <div className="h-2.5 bg-zinc-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Real Google Reviews Grid (Desktop: 3 per row, Tablet: 2 per row, Mobile: 1 per row) */}
            {!reviewsLoading && reviewsData?.reviews && reviewsData.reviews.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {reviewsData.reviews.slice(0, 3).map((rev, idx) => (
                  <motion.div
                    key={rev.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-1 text-tertiary-container">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className="text-tertiary-container fill-tertiary-container"
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-medium">
                          <GoogleIcon className="w-3.5 h-3.5" />
                          <span>Google Maps</span>
                        </div>
                      </div>
                      {rev.comment ? (
                        <p className="font-body-md text-zinc-700 text-xs sm:text-sm leading-relaxed mb-6 italic">
                          "{rev.comment}"
                        </p>
                      ) : (
                        <p className="font-body-md text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6 italic">
                          [5-star rating on Google Maps]
                        </p>
                      )}
                    </div>
                    <div className="pt-4 border-t border-zinc-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {rev.authorPhotoUrl ? (
                          <img
                            src={rev.authorPhotoUrl}
                            alt={rev.authorName}
                            className="w-9 h-9 rounded-full object-cover border border-zinc-200 shrink-0"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-tertiary-container/20 text-tertiary-container font-display-lg font-bold text-xs flex items-center justify-center shrink-0 border border-tertiary-container/30">
                            {rev.authorName ? rev.authorName.charAt(0).toUpperCase() : "G"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-display-lg text-xs sm:text-sm font-bold text-zinc-950 truncate">
                            {rev.authorName}
                          </h4>
                          <p className="font-caption text-[11px] text-zinc-500">
                            {rev.relativePublishTimeDescription || "Google Maps Review"}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 font-label-caps text-[10px] text-tertiary-container uppercase tracking-wider bg-zinc-100 px-2 py-1 rounded font-semibold shrink-0">
                        <ShieldCheck size={11} /> Verified
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Dynamic Empty / Error State */}
            {!reviewsLoading && (!reviewsData?.reviews || reviewsData.reviews.length === 0) && (
              <div className="p-8 sm:p-12 rounded-2xl bg-white border border-zinc-200 text-center max-w-xl mx-auto shadow-sm">
                <div className="w-12 h-12 rounded-full bg-tertiary-container/15 text-tertiary-container flex items-center justify-center mx-auto mb-4">
                  <GoogleIcon className="w-6 h-6" />
                </div>
                <h3 className="font-display-lg text-lg font-bold text-zinc-950 mb-2">
                  5.0 ★★★★★ ({reviewsData?.business?.userRatingCount ?? reviewsData?.totalReviews ?? 213} Google Reviews)
                </h3>
                <p className="text-zinc-600 text-xs sm:text-sm mb-6 leading-relaxed">
                  Authentic 5.0-star customer testimonials from our distinguished clients are verified live on our official Google Business Profile.
                </p>
                <a
                  href={reviewsData?.business?.googleMapsUri || reviewsData?.googleMapsUri || "https://www.google.com/maps/place/FANTASY+KING+(Designer)+alteration+%26+tailoring/@11.6762356,78.137468,17z/data=!3m1!4b1!4m6!3m5!1s0x3babf1a42dce11fb:0xcfe95d8a18e2f334!8m2!3d11.6762356!4d78.137468!16s%2Fg%2F11xf_c9fbr"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-black hover:bg-tertiary-container hover:text-black text-white font-label-caps text-xs font-semibold uppercase tracking-wider rounded-full transition-all shadow-md group cursor-pointer"
                >
                  <span>View All Reviews on Google</span>
                  <ExternalLink size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            )}

            {/* Google Reviews Toolbar */}
            <div className="mt-10 sm:mt-14 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={reviewsData?.business?.googleMapsUri || reviewsData?.googleMapsUri || "https://www.google.com/maps/place/FANTASY+KING+(Designer)+alteration+%26+tailoring/@11.6762356,78.137468,17z/data=!3m1!4b1!4m6!3m5!1s0x3babf1a42dce11fb:0xcfe95d8a18e2f334!8m2!3d11.6762356!4d78.137468!16s%2Fg%2F11xf_c9fbr"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-black text-white hover:bg-tertiary-container hover:text-black border border-black hover:border-tertiary-container text-xs font-semibold shadow-md inline-flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer group"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>View All Reviews on Google</span>
                <ExternalLink size={13} className="transform group-hover:translate-x-0.5 transition-transform" />
              </a>

              <div className="inline-flex items-center gap-2.5 sm:gap-3 px-6 py-3.5 rounded-full bg-white border border-zinc-200 text-xs text-zinc-700 shadow-sm">
                <ShieldCheck size={18} className="text-tertiary-container" />
                <span className="font-medium">100% Perfect Fit Guarantee on All Bespoke Commissions</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. CONTACT & APPOINTMENT BOOKING SECTION (#contact / #appointment)        */}
        {/* ========================================================================= */}
        <section
          id="contact"
          className="py-16 sm:py-24 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 md:px-16 scroll-mt-20 md:scroll-mt-24"
        >
          <div id="appointment" className="scroll-mt-20 md:scroll-mt-24">
            <div className="mb-10 sm:mb-16 max-w-3xl">
              <p className="font-label-caps text-xs tracking-[0.2em] text-tertiary-container uppercase font-semibold mb-2">
                Atelier Concierge
              </p>
              <h2 className="font-display-lg text-2xl xs:text-3xl sm:text-4xl md:text-5xl text-zinc-950 mb-3 sm:mb-4 font-bold">
                Book a Tailoring Appointment.
              </h2>
              <p className="font-body-md text-zinc-700 text-xs sm:text-base leading-relaxed">
                Fill in your appointment details to instantly prepare and connect with our master tailor via WhatsApp for instant confirmation.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left Column: Interactive Booking Form with Direct WhatsApp Integration */}
              <div className="lg:col-span-7 p-5 sm:p-8 md:p-10 border border-zinc-200 bg-white rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-headline-md text-xl sm:text-2xl text-zinc-950 uppercase font-bold">
                    Schedule Appointment
                  </h3>
                  <span className="text-[11px] font-label-caps uppercase text-tertiary-container font-semibold flex items-center gap-1">
                    <Sparkles size={14} /> WhatsApp Direct
                  </span>
                </div>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 sm:p-8 text-center bg-zinc-50 rounded-xl space-y-4 border border-tertiary-container/30"
                  >
                    <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mx-auto">
                      <Check size={28} />
                    </div>
                    <h4 className="font-display-lg text-lg sm:text-xl font-bold text-zinc-950">
                      Appointment Ready on WhatsApp
                    </h4>
                    <p className="font-body-md text-zinc-700 text-xs sm:text-sm max-w-md mx-auto">
                      Your tailoring consultation for <strong className="text-zinc-950 font-bold">{formData.service}</strong> on <strong className="text-zinc-950 font-bold">{formData.date}</strong> has been structured.
                    </p>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
                      <a
                        href={submittedWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto min-h-[44px] px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-label-caps text-xs uppercase font-semibold rounded-xl inline-flex items-center justify-center gap-2 shadow-md"
                      >
                        <MessageCircle size={16} /> Open WhatsApp Again <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({
                            name: "",
                            email: "",
                            phone: "",
                            date: "",
                            service: "Men's Suit Stitching",
                            notes: "",
                          });
                          setFormErrors({});
                        }}
                        className="w-full sm:w-auto min-h-[44px] px-5 py-3 border border-zinc-200 font-label-caps text-xs text-zinc-950 uppercase font-semibold rounded-xl hover:bg-zinc-100 cursor-pointer"
                      >
                        Book Another Service
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                      <div>
                        <label className="block font-label-caps text-xs text-zinc-700 uppercase mb-1.5 font-semibold">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                          }}
                          placeholder="Alexander Sterling"
                          className={`w-full min-h-[44px] bg-transparent border-0 border-b py-2 text-sm text-zinc-950 outline-none transition-colors ${formErrors.name
                            ? "border-red-500 focus:border-red-500"
                            : "border-zinc-300 focus:border-zinc-950"
                            }`}
                        />
                        {formErrors.name && (
                          <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1">
                            <AlertCircle size={12} /> {formErrors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block font-label-caps text-xs text-zinc-700 uppercase mb-1.5 font-semibold">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                          }}
                          placeholder="sterling@example.com"
                          className={`w-full min-h-[44px] bg-transparent border-0 border-b py-2 text-sm text-zinc-950 outline-none transition-colors ${formErrors.email
                            ? "border-red-500 focus:border-red-500"
                            : "border-zinc-300 focus:border-zinc-950"
                            }`}
                        />
                        {formErrors.email && (
                          <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1">
                            <AlertCircle size={12} /> {formErrors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                      <div>
                        <label className="block font-label-caps text-xs text-zinc-700 uppercase mb-1.5 font-semibold">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
                          }}
                          placeholder="+91 88380 66960"
                          className={`w-full min-h-[44px] bg-transparent border-0 border-b py-2 text-sm text-zinc-950 outline-none transition-colors ${formErrors.phone
                            ? "border-red-500 focus:border-red-500"
                            : "border-zinc-300 focus:border-zinc-950"
                            }`}
                        />
                        {formErrors.phone && (
                          <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1">
                            <AlertCircle size={12} /> {formErrors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block font-label-caps text-xs text-zinc-700 uppercase mb-1.5 font-semibold">
                          Desired Service *
                        </label>
                        <select
                          value={formData.service}
                          onChange={(e) => {
                            setFormData({ ...formData, service: e.target.value });
                            if (formErrors.service) setFormErrors({ ...formErrors, service: undefined });
                          }}
                          className={`w-full min-h-[44px] bg-transparent border-0 border-b py-2 text-sm text-zinc-950 outline-none cursor-pointer ${formErrors.service
                            ? "border-red-500 focus:border-red-500"
                            : "border-zinc-300 focus:border-zinc-950"
                            }`}
                        >
                          <option value="Select a service" disabled>
                            Select a service
                          </option>

                          <optgroup label="Men's Tailoring" className="font-semibold text-zinc-950">
                            <option value="Men's Suit Stitching">Men's Suit Stitching</option>
                            <option value="Coat Stitching">Coat Stitching</option>
                            <option value="Pant Stitching">Pant Stitching</option>
                            <option value="Shirt Stitching">Shirt Stitching</option>
                            <option value="3-Piece Suit Stitching">3-Piece Suit Stitching</option>
                            <option value="Custom Suit Stitching">Custom Suit Stitching</option>
                            <option value="Wedding Suit Stitching">Wedding Suit Stitching</option>
                            <option value="Tuxedo Stitching">Tuxedo Stitching</option>
                          </optgroup>

                          <optgroup label="Alterations &amp; Customization" className="font-semibold text-zinc-950">
                            <option value="Custom Alterations">Custom Alterations</option>
                            <option value="Suit Alterations">Suit Alterations</option>
                            <option value="Coat Alterations">Coat Alterations</option>
                            <option value="Pant Alterations">Pant Alterations</option>
                            <option value="Shirt Alterations">Shirt Alterations</option>
                            <option value="Luxury Alterations &amp; Fitting">Luxury Alterations &amp; Fitting</option>
                            <option value="Custom Measurements">Custom Measurements</option>
                            <option value="Garment Resizing">Garment Resizing</option>
                          </optgroup>

                          <optgroup label="Women's Tailoring" className="font-semibold text-zinc-950">
                            <option value="Women's Lehenga Stitching">Women's Lehenga Stitching</option>
                            <option value="Blouse Stitching">Blouse Stitching</option>
                            <option value="Gown Stitching">Gown Stitching</option>
                            <option value="Saree Blouse Alterations">Saree Blouse Alterations</option>
                            <option value="Women's Dress Stitching">Women's Dress Stitching</option>
                            <option value="Custom Women's Wear">Custom Women's Wear</option>
                          </optgroup>

                          <optgroup label="Bridal" className="font-semibold text-zinc-950">
                            <option value="Bridal Stitching">Bridal Stitching</option>
                            <option value="Bridal Blouse Stitching">Bridal Blouse Stitching</option>
                            <option value="Bridal Lehenga Stitching">Bridal Lehenga Stitching</option>
                            <option value="Bridal Gown Stitching">Bridal Gown Stitching</option>
                            <option value="Wedding Wear Customization">Wedding Wear Customization</option>
                            <option value="Bridal Alterations &amp; Fitting">Bridal Alterations &amp; Fitting</option>
                          </optgroup>

                          <optgroup label="Specialty &amp; Bespoke" className="font-semibold text-zinc-950">
                            <option value="Doorstep Measurement / Fitting">Doorstep Measurement / Fitting</option>
                            <option value="Kids Wear Stitching">Kids Wear Stitching</option>
                            <option value="Designer Wear Customization">Designer Wear Customization</option>
                            <option value="Occasion Wear Stitching">Occasion Wear Stitching</option>
                          </optgroup>
                        </select>
                        {formErrors.service && (
                          <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1">
                            <AlertCircle size={12} /> {formErrors.service}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block font-label-caps text-xs text-zinc-700 uppercase mb-1.5 font-semibold">
                        Preferred Consultation Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => {
                          setFormData({ ...formData, date: e.target.value });
                          if (formErrors.date) setFormErrors({ ...formErrors, date: undefined });
                        }}
                        className={`w-full min-h-[44px] bg-transparent border-0 border-b py-2 text-sm text-zinc-950 outline-none cursor-pointer ${formErrors.date
                          ? "border-red-500 focus:border-red-500"
                          : "border-zinc-300 focus:border-zinc-950"
                          }`}
                      />
                      {formErrors.date && (
                        <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} /> {formErrors.date}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-label-caps text-xs text-zinc-700 uppercase mb-1.5 font-semibold">
                        Garment Notes or Specifications (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="E.g., Need a navy blue 3-piece suit for a wedding reception..."
                        className="w-full bg-transparent border-0 border-b border-zinc-300 focus:border-zinc-950 py-2 text-sm text-zinc-950 outline-none resize-none"
                      />
                    </div>

                    {/* Submission Error Banner */}
                    {submissionError && (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
                        <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
                        <div className="flex-1">
                          <p className="font-semibold">Unable to submit your appointment. Please try again.</p>
                          <p className="text-[11px] opacity-90 mt-0.5">{submissionError}</p>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full min-h-[48px] bg-black text-white font-label-caps text-xs font-semibold tracking-wider uppercase py-4 rounded-xl hover:bg-tertiary-container hover:text-black active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <MessageCircle size={17} /> Confirm Appointment Request
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-zinc-500 text-center">
                      Clicking will save your appointment securely and open WhatsApp with your pre-filled details.
                    </p>
                  </form>
                )}
              </div>

              {/* Right Column: Atelier Location, Google Maps & Contact */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-5 sm:p-8 border border-zinc-200 bg-zinc-50 rounded-2xl space-y-5 sm:space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-label-caps text-xs tracking-widest text-tertiary-container uppercase font-semibold flex items-center gap-2">
                        <MapPin size={15} /> Physical Store &amp; Atelier
                      </h4>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Open for Visits
                      </span>
                    </div>

                    <h3 className="font-headline-md text-xl sm:text-2xl text-zinc-950 font-bold">
                      FANTASY KING
                    </h3>
                    <p className="text-xs text-zinc-600 tracking-wider uppercase mb-4 font-medium">
                      (Designer) Alteration &amp; Tailoring
                    </p>

                    <div className="bg-white p-4 rounded-xl border border-zinc-200 space-y-1.5 text-xs sm:text-sm text-zinc-700">
                      <p className="font-semibold text-zinc-950 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                        First Floor, Puma Showroom (opp)
                      </p>
                      <p className="pl-3.5 text-xs text-zinc-600">Near Khadhims</p>
                      <p className="pl-3.5 text-xs text-zinc-600">Thangavel Nagar, Alagapuram</p>
                      <p className="pl-3.5 text-xs font-semibold text-zinc-900">
                        Swarnapuri, Salem, Tamil Nadu 636016, India
                      </p>
                    </div>

                    <div className="mt-4">
                      <a
                        href="https://www.google.com/maps/place/FANTASY+KING+(Designer)+alteration+%26+tailoring/@11.6762356,78.137468,17z/data=!3m1!4b1!4m6!3m5!1s0x3babf1a42dce11fb:0xcfe95d8a18e2f334!8m2!3d11.6762356!4d78.137468!16s%2Fg%2F11xf_c9fbr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group w-full min-h-[48px] bg-black text-white hover:bg-tertiary-container hover:text-black font-label-caps text-xs font-semibold tracking-wider uppercase py-3.5 px-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98]"
                      >
                        <MapPin size={16} className="text-tertiary-container group-hover:text-black transition-colors" />
                        <span>View on Google Maps</span>
                        <ArrowRight size={15} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
                      </a>
                    </div>
                  </div>

                  <LazyGoogleMap />

                  <div className="pt-4 border-t border-zinc-200 space-y-3">
                    <h4 className="font-label-caps text-xs text-zinc-600 uppercase mb-2 font-semibold">Direct Inquiries</h4>
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-950 font-medium">
                      <Phone size={16} className="text-tertiary-container shrink-0" />
                      <a href="tel:+918838066960" className="hover:text-tertiary-container transition-colors py-1">
                        +91 88380 66960
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-950 font-medium">
                      <Mail size={16} className="text-tertiary-container shrink-0" />
                      <a href="mailto:fantasyking1786@gmail.com" className="hover:text-tertiary-container transition-colors py-1">
                        fantasyking1786@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-label-caps text-xs text-zinc-600 uppercase font-semibold">Instant Concierge</h4>
                      <span className="text-[11px] text-tertiary-container font-semibold">Direct WhatsApp</span>
                    </div>
                    <a
                      href={getWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGES.consultation)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Chat with FANTASY KING on WhatsApp"
                      className="w-full min-h-[48px] bg-[#25D366] hover:bg-[#20bd5a] text-white font-label-caps text-xs tracking-wider uppercase py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg group cursor-pointer active:scale-[0.98]"
                    >
                      <MessageCircle size={18} className="group-hover:scale-110 transition-transform shrink-0" />
                      <span>Chat via WhatsApp Concierge</span>
                      <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform shrink-0" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}

export default HomePage;
