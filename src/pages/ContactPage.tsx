import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Check,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { Header } from "../components/Header";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import {
  getLocalBusinessSchema,
  getBreadcrumbSchema,
  getFAQSchema,
} from "../utils/seoSchemas";
import {
  getWhatsAppUrl,
  getAppointmentWhatsAppUrl,
  DEFAULT_WHATSAPP_MESSAGES,
  AppointmentDetails,
} from "../utils/whatsapp";
import { ChevronDown, HelpCircle } from "lucide-react";

export function ContactPage() {
  const location = useLocation();
  const initialService = (location.state as any)?.selectedService || "Men's Suit Stitching";

  // Appointment Form State
  const [formData, setFormData] = useState<AppointmentDetails>({
    name: "",
    email: "",
    phone: "",
    date: "",
    service: initialService,
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

  // Form Validation & WhatsApp Submission Flow
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

  return (
    <div className="min-h-screen w-full flex flex-col bg-surface text-on-surface overflow-x-hidden">
      <SEO
        title="FANTASY KING Tailor in Swarnapuri, Salem | Contact & Location | FANTASY KING"
        description="Visit FANTASY KING atelier in Swarnapuri, Salem (opposite Puma Showroom, near Khadhims). Call +91 88380 66960 to book bespoke tailoring & alteration fittings."
        canonicalPath="/contact"
        schema={[
          getLocalBusinessSchema(),
          getBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Contact Us", url: "/contact" },
          ]),
          getFAQSchema([
            {
              question: "Where is FANTASY KING located in Salem?",
              answer:
                "Our atelier is situated on the First Floor, opposite Puma Showroom, near Khadhims, Thangavel Nagar, Alagapuram, Swarnapuri, Salem, Tamil Nadu 636016.",
            },
            {
              question: "How can I contact FANTASY KING for tailoring or alterations?",
              answer:
                "You can call our master tailors at +91 88380 66960 or +91 96593 56447, message us on WhatsApp, or submit an appointment request through our online booking form.",
            },
            {
              question: "Can customers from outside Salem or NRI clients book a consultation?",
              answer:
                "Yes! We offer virtual tailoring consultations via WhatsApp video call for wedding parties, NRI clients, and customers across Tamil Nadu and India.",
            },
            {
              question: "What are your operating hours in Salem?",
              answer:
                "FANTASY KING is open Monday through Sunday from 9:30 AM to 9:30 PM for in-store fittings, fabric consultations, and alteration drop-offs.",
            },
          ]),
        ]}
      />
      <Header />

      <main className="flex-grow pt-[57px] md:pt-[73px] w-full overflow-x-hidden">
        {/* Page Hero Banner */}
        <section className="py-16 sm:py-24 bg-surface-container-lowest dark:bg-zinc-950/60 border-b border-outline-variant/40 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tertiary-container/15 text-tertiary-container text-xs font-label-caps uppercase tracking-widest font-semibold mb-4 border border-tertiary-container/30">
                <Sparkles size={13} />
                <span>Atelier Concierge</span>
              </div>
              <h1 className="font-display-lg text-3xl sm:text-5xl md:text-6xl text-primary dark:text-white font-bold leading-tight mb-6">
                FANTASY KING Tailor in Swarnapuri, Salem | Contact &amp; Location
              </h1>
              <p className="font-body-md text-secondary text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                Schedule a private tailoring consultation, bespoke wedding fitting, or visit our atelier in Swarnapuri, Salem.
              </p>
              <div className="w-24 h-1 bg-tertiary-container mx-auto rounded-full mt-8" />
            </motion.div>
          </div>
        </section>

        {/* Booking Form & Atelier Details */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 md:px-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Interactive Booking Form with Direct WhatsApp Integration */}
            <div className="lg:col-span-7 p-5 sm:p-8 md:p-10 border border-outline-variant bg-surface-container-lowest dark:bg-zinc-900/80 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline-md text-xl sm:text-2xl text-primary dark:text-white uppercase font-semibold">
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
                  className="p-6 sm:p-8 text-center bg-surface-container-low dark:bg-zinc-800/80 rounded-xl space-y-4 border border-tertiary-container/30"
                >
                  <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mx-auto">
                    <Check size={28} />
                  </div>
                  <h4 className="font-display-lg text-lg sm:text-xl font-bold text-primary dark:text-white">
                    Appointment Ready on WhatsApp
                  </h4>
                  <p className="font-body-md text-secondary text-xs sm:text-sm max-w-md mx-auto">
                    Your tailoring consultation for <strong className="text-primary dark:text-white">{formData.service}</strong> on <strong className="text-primary dark:text-white">{formData.date}</strong> has been structured.
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
                      className="w-full sm:w-auto min-h-[44px] px-5 py-3 border border-outline-variant font-label-caps text-xs text-primary dark:text-white uppercase font-semibold rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                    >
                      Book Another Service
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5 sm:space-y-6">
                  {/* Full Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label className="block font-label-caps text-xs text-secondary uppercase mb-1.5 font-medium">
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
                        className={`w-full min-h-[44px] bg-transparent border-0 border-b py-2 text-sm text-primary dark:text-white outline-none transition-colors ${formErrors.name
                          ? "border-red-500 focus:border-red-500"
                          : "border-outline-variant focus:border-primary dark:focus:border-white"
                          }`}
                      />
                      {formErrors.name && (
                        <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} /> {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-label-caps text-xs text-secondary uppercase mb-1.5 font-medium">
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
                        className={`w-full min-h-[44px] bg-transparent border-0 border-b py-2 text-sm text-primary dark:text-white outline-none transition-colors ${formErrors.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-outline-variant focus:border-primary dark:focus:border-white"
                          }`}
                      />
                      {formErrors.email && (
                        <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} /> {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone Number & Desired Service */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label className="block font-label-caps text-xs text-secondary uppercase mb-1.5 font-medium">
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
                        placeholder="+91 +91 88380 66960"
                        className={`w-full min-h-[44px] bg-transparent border-0 border-b py-2 text-sm text-primary dark:text-white outline-none transition-colors ${formErrors.phone
                          ? "border-red-500 focus:border-red-500"
                          : "border-outline-variant focus:border-primary dark:focus:border-white"
                          }`}
                      />
                      {formErrors.phone && (
                        <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} /> {formErrors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-label-caps text-xs text-secondary uppercase mb-1.5 font-medium">
                        Desired Service *
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => {
                          setFormData({ ...formData, service: e.target.value });
                          if (formErrors.service) setFormErrors({ ...formErrors, service: undefined });
                        }}
                        className={`w-full min-h-[44px] bg-transparent border-0 border-b py-2 text-sm text-primary dark:text-white outline-none cursor-pointer ${formErrors.service
                          ? "border-red-500 focus:border-red-500"
                          : "border-outline-variant focus:border-primary dark:focus:border-white"
                          }`}
                      >
                        <option value="Select a service" disabled className="dark:bg-zinc-900">
                          Select a service
                        </option>

                        <optgroup label="Men's Tailoring" className="dark:bg-zinc-900 font-semibold">
                          <option value="Men's Suit Stitching">Men's Suit Stitching</option>
                          <option value="Coat Stitching">Coat Stitching</option>
                          <option value="Pant Stitching">Pant Stitching</option>
                          <option value="Shirt Stitching">Shirt Stitching</option>
                          <option value="3-Piece Suit Stitching">3-Piece Suit Stitching</option>
                          <option value="Custom Suit Stitching">Custom Suit Stitching</option>
                          <option value="Wedding Suit Stitching">Wedding Suit Stitching</option>
                          <option value="Tuxedo Stitching">Tuxedo Stitching</option>
                        </optgroup>

                        <optgroup label="Alterations & Customization" className="dark:bg-zinc-900 font-semibold">
                          <option value="Custom Alterations">Custom Alterations</option>
                          <option value="Suit Alterations">Suit Alterations</option>
                          <option value="Coat Alterations">Coat Alterations</option>
                          <option value="Pant Alterations">Pant Alterations</option>
                          <option value="Shirt Alterations">Shirt Alterations</option>
                          <option value="Luxury Alterations & Fitting">Luxury Alterations & Fitting</option>
                          <option value="Custom Measurements">Custom Measurements</option>
                          <option value="Garment Resizing">Garment Resizing</option>
                        </optgroup>

                        <optgroup label="Women's Tailoring" className="dark:bg-zinc-900 font-semibold">
                          <option value="Women's Lehenga Stitching">Women's Lehenga Stitching</option>
                          <option value="Blouse Stitching">Blouse Stitching</option>
                          <option value="Gown Stitching">Gown Stitching</option>
                          <option value="Saree Blouse Alterations">Saree Blouse Alterations</option>
                          <option value="Women's Dress Stitching">Women's Dress Stitching</option>
                          <option value="Custom Women's Wear">Custom Women's Wear</option>
                        </optgroup>

                        <optgroup label="Bridal" className="dark:bg-zinc-900 font-semibold">
                          <option value="Bridal Stitching">Bridal Stitching</option>
                          <option value="Bridal Blouse Stitching">Bridal Blouse Stitching</option>
                          <option value="Bridal Lehenga Stitching">Bridal Lehenga Stitching</option>
                          <option value="Bridal Gown Stitching">Bridal Gown Stitching</option>
                          <option value="Wedding Wear Customization">Wedding Wear Customization</option>
                          <option value="Bridal Alterations & Fitting">Bridal Alterations & Fitting</option>
                        </optgroup>

                        <optgroup label="Specialty & Bespoke" className="dark:bg-zinc-900 font-semibold">
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

                  {/* Preferred Date */}
                  <div>
                    <label className="block font-label-caps text-xs text-secondary uppercase mb-1.5 font-medium">
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
                      className={`w-full min-h-[44px] bg-transparent border-0 border-b py-2 text-sm text-primary dark:text-white outline-none cursor-pointer ${formErrors.date
                        ? "border-red-500 focus:border-red-500"
                        : "border-outline-variant focus:border-primary dark:focus:border-white"
                        }`}
                    />
                    {formErrors.date && (
                      <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {formErrors.date}
                      </p>
                    )}
                  </div>

                  {/* Garment Notes (Optional) */}
                  <div>
                    <label className="block font-label-caps text-xs text-secondary uppercase mb-1.5 font-medium">
                      Garment Notes or Specifications (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="E.g., Need a navy blue 3-piece suit for a wedding reception..."
                      className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary dark:focus:border-white py-2 text-sm text-primary dark:text-white outline-none resize-none"
                    />
                  </div>

                  {/* Submission Error Banner */}
                  {submissionError && (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-800 dark:text-red-200 text-xs flex items-start gap-2.5">
                      <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
                      <div className="flex-1">
                        <p className="font-semibold">Unable to submit your appointment. Please try again.</p>
                        <p className="text-[11px] opacity-90 mt-0.5">{submissionError}</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[48px] bg-primary text-on-primary font-label-caps text-xs font-semibold tracking-wider uppercase py-4 rounded-xl hover:bg-tertiary-container hover:text-primary active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
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
                  <p className="text-[11px] text-secondary text-center">
                    Clicking will save your appointment securely and open WhatsApp with your pre-filled details.
                  </p>
                </form>
              )}
            </div>

            {/* Right Column: Atelier Location, Google Maps & Contact */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-5 sm:p-8 border border-outline-variant bg-surface-container-low dark:bg-zinc-900/60 rounded-2xl space-y-5 sm:space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-label-caps text-xs tracking-widest text-tertiary-container uppercase font-semibold flex items-center gap-2">
                      <MapPin size={15} /> Physical Store & Atelier
                    </h4>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Open for Visits
                    </span>
                  </div>

                  <h3 className="font-headline-md text-xl sm:text-2xl text-primary dark:text-white font-semibold">
                    FANTASY KING
                  </h3>
                  <p className="text-xs text-secondary tracking-wider uppercase mb-4">
                    (Designer) Alteration & Tailoring
                  </p>

                  {/* Address Card */}
                  <div className="bg-white dark:bg-zinc-800/60 p-4 rounded-xl border border-outline-variant space-y-1.5 text-xs sm:text-sm text-secondary dark:text-gray-300">
                    <p className="font-semibold text-primary dark:text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                      First Floor, Puma Showroom
                    </p>
                    <p className="pl-3.5 text-xs text-secondary">Near Khadhims</p>
                    <p className="pl-3.5 text-xs text-secondary">Thangavel Nagar, Alagapuram</p>
                    <p className="pl-3.5 text-xs font-medium text-primary dark:text-gray-200">
                      Swarnapuri, Salem, Tamil Nadu 636016, India
                    </p>
                  </div>

                  {/* View on Google Maps Button CTA */}
                  <div className="mt-4">
                    <a
                      href="https://www.google.com/maps/place/FANTASY+KING+(Designer)+alteration+%26+tailoring/@11.6762356,78.137468,17z/data=!3m1!4b1!4m6!3m5!1s0x3babf1a42dce11fb:0xcfe95d8a18e2f334!8m2!3d11.6762356!4d78.137468!16s%2Fg%2F11xf_c9fbr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group w-full min-h-[48px] bg-primary text-on-primary hover:bg-tertiary-container hover:text-primary dark:bg-white dark:text-black dark:hover:bg-tertiary-fixed font-label-caps text-xs font-semibold tracking-wider uppercase py-3.5 px-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98]"
                    >
                      <MapPin size={16} className="text-tertiary-container group-hover:text-primary dark:group-hover:text-black transition-colors" />
                      <span>View on Google Maps</span>
                      <ArrowRight size={15} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
                    </a>
                  </div>
                </div>

                {/* Interactive Map Preview Card */}
                <div className="relative rounded-xl overflow-hidden border border-outline-variant aspect-[16/9] shadow-inner bg-surface-container-highest">
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
                  <a
                    href="https://www.google.com/maps/place/FANTASY+KING+(Designer)+alteration+%26+tailoring/@11.6762356,78.137468,17z/data=!3m1!4b1!4m6!3m5!1s0x3babf1a42dce11fb:0xcfe95d8a18e2f334!8m2!3d11.6762356!4d78.137468!16s%2Fg%2F11xf_c9fbr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2.5 right-2.5 bg-black/85 hover:bg-black text-white text-[11px] font-label-caps uppercase tracking-wider px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition-all shadow-md group active:scale-95"
                  >
                    <span>Get Directions</span>
                    <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                <div className="pt-4 border-t border-outline-variant space-y-3">
                  <h4 className="font-label-caps text-xs text-secondary uppercase mb-2">Direct Phone &amp; Inquiries</h4>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-primary dark:text-white font-medium">
                    <Phone size={16} className="text-tertiary-container shrink-0" />
                    <a href="tel:+918838066960" className="hover:text-tertiary-container transition-colors py-1">
                      +91 88380 66960 (Primary)
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-primary dark:text-white font-medium">
                    <Phone size={16} className="text-tertiary-container shrink-0" />
                    <a href="tel:+919659356447" className="hover:text-tertiary-container transition-colors py-1">
                      +91 96593 56447 (Secondary)
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-primary dark:text-white font-medium">
                    <Mail size={16} className="text-tertiary-container shrink-0" />
                    <a href="mailto:fantasykingtailor@gmail.com" className="hover:text-tertiary-container transition-colors py-1">
                      fantasykingtailor@gmail.com
                    </a>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-label-caps text-xs text-secondary uppercase">Instant Concierge</h4>
                    <span className="text-[11px] text-tertiary-container font-medium">Direct WhatsApp</span>
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
                  <p className="text-[11px] text-secondary text-center">
                    Need quick answers on fabrics or tailoring? Connect with us directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visible Contact & Location FAQs Section */}
        <section className="py-16 sm:py-20 bg-surface-container-low dark:bg-zinc-900/50 border-t border-outline-variant/40 w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-10 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-container/15 text-tertiary-container text-xs font-label-caps uppercase tracking-widest font-semibold border border-tertiary-container/30">
                <HelpCircle size={13} />
                <span>Atelier Location &amp; Visit Guidance</span>
              </div>
              <h2 className="font-display-lg text-2xl sm:text-3xl text-primary dark:text-white font-bold">
                Visiting FANTASY KING in Salem
              </h2>
            </div>

            <div className="space-y-4">
              <div className="border border-outline-variant rounded-xl bg-surface dark:bg-zinc-900 p-5 sm:p-6">
                <h3 className="font-display-lg text-base sm:text-lg font-semibold text-primary dark:text-white mb-2">
                  Where is FANTASY KING located in Salem?
                </h3>
                <p className="font-body-md text-secondary text-xs sm:text-sm leading-relaxed">
                  Our atelier is located at First Floor, opposite Puma Showroom, near Khadhims, Thangavel Nagar, Alagapuram, Swarnapuri, Salem, Tamil Nadu 636016.
                </p>
              </div>

              <div className="border border-outline-variant rounded-xl bg-surface dark:bg-zinc-900 p-5 sm:p-6">
                <h3 className="font-display-lg text-base sm:text-lg font-semibold text-primary dark:text-white mb-2">
                  How can I contact FANTASY KING for tailoring or alterations?
                </h3>
                <p className="font-body-md text-secondary text-xs sm:text-sm leading-relaxed">
                  You can call our master tailors directly at +91 88380 66960 or +91 96593 56447, message us on WhatsApp, or submit an appointment request through our online booking form.
                </p>
              </div>

              <div className="border border-outline-variant rounded-xl bg-surface dark:bg-zinc-900 p-5 sm:p-6">
                <h3 className="font-display-lg text-base sm:text-lg font-semibold text-primary dark:text-white mb-2">
                  Can customers from outside Salem or NRI clients book a consultation?
                </h3>
                <p className="font-body-md text-secondary text-xs sm:text-sm leading-relaxed">
                  Yes! We offer virtual tailoring consultations via WhatsApp video call for wedding parties, NRI clients, and customers across Tamil Nadu and India.
                </p>
              </div>

              <div className="border border-outline-variant rounded-xl bg-surface dark:bg-zinc-900 p-5 sm:p-6">
                <h3 className="font-display-lg text-base sm:text-lg font-semibold text-primary dark:text-white mb-2">
                  What are your operating hours in Salem?
                </h3>
                <p className="font-body-md text-secondary text-xs sm:text-sm leading-relaxed">
                  FANTASY KING is open Monday through Sunday from 9:30 AM to 9:30 PM for in-store fittings, fabric consultations, and alteration drop-offs.
                </p>
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

export default ContactPage;
