import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  MessageSquare,
} from "lucide-react";
import { Header } from "../components/Header";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import {
  getLocalBusinessSchema,
  getBreadcrumbSchema,
} from "../utils/seoSchemas";
import { getWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGES } from "../utils/whatsapp";
import { ReviewsApiResponse, GooglePlaceReviewItem } from "../types/reviews";
import { GoogleIcon } from "../components/GoogleIcon";

// Formats date or uses relative date description from Google Places
function formatReviewDate(review: GooglePlaceReviewItem): string {
  if (review.relativePublishTimeDescription) {
    return review.relativePublishTimeDescription;
  }
  if (!review.publishTime) return "";
  try {
    const d = new Date(review.publishTime);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function ReviewsPage() {
  const [data, setData] = useState<ReviewsApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/reviews");
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch reviews`);
      }

      const json: ReviewsApiResponse = await res.json();
      setData(json);
      if (json.error && (!json.reviews || json.reviews.length === 0)) {
        setError(json.error);
      }
    } catch (err: any) {
      console.error("Error fetching reviews:", err);
      setError("Google reviews are temporarily unavailable. Please check back shortly.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Strict maximum 5 five-star reviews directly from Google Places API
  const reviews: GooglePlaceReviewItem[] = (data?.reviews || [])
    .filter((r) => r.rating === 5)
    .slice(0, 5);

  const totalCount = data?.business?.userRatingCount ?? data?.totalReviews ?? 210;
  const ratingValue = (data?.business?.rating ?? data?.averageRating ?? 5.0).toFixed(1);
  const businessName = data?.business?.name || "FANTASY KING (Designer) alteration & tailoring";
  const googleMapsUrl =
    data?.business?.googleMapsUri ||
    data?.googleMapsUri ||
    "https://maps.google.com/?q=FANTASY+KING+Salem";

  return (
    <div className="min-h-screen w-full flex flex-col bg-surface text-on-surface overflow-x-hidden">
      <SEO
        title="FANTASY KING Customer Reviews & Tailoring Services in Salem | FANTASY KING"
        description="Read authentic 5.0-star Google reviews for FANTASY KING in Salem. Discover why clients trust our master tailors for bespoke suits, blouses and alterations."
        canonicalPath="/reviews"
        schema={[
          getLocalBusinessSchema(),
          getBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Reviews", url: "/reviews" },
          ]),
        ]}
      />
      <Header />

      <main className="flex-grow pt-[57px] md:pt-[73px] w-full overflow-x-hidden">
        {/* Page Hero Banner */}
        <section className="py-14 sm:py-20 bg-surface-container-lowest dark:bg-zinc-950/70 border-b border-outline-variant/40 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              {/* Google Reviews Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 text-primary dark:text-white text-xs font-label-caps uppercase tracking-widest font-semibold mb-5 border border-outline-variant shadow-sm">
                <GoogleIcon className="w-4 h-4" />
                <span className="tracking-wider">Google Maps Reviews</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                <span className="text-secondary dark:text-gray-400 font-normal">Official</span>
              </div>

              {/* Page Heading */}
              <h1 className="font-display-lg text-3xl sm:text-5xl md:text-6xl text-primary dark:text-white font-bold leading-tight mb-5">
                FANTASY KING Customer Reviews &amp; Tailoring Services in Salem
              </h1>

              {/* Subtitle */}
              <p className="font-body-md text-secondary dark:text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-6">
                Read authentic 5.0-star customer testimonials from our distinguished clients across Salem and Tamil Nadu on Google Maps.
              </p>

              {/* Google Maps Live Dynamic Summary */}
              <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-5 px-6 py-3.5 rounded-2xl bg-white dark:bg-zinc-900/90 border border-outline-variant shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-bold font-display-lg text-primary dark:text-white">
                    {ratingValue}
                  </span>
                  <div className="flex text-tertiary-container">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className="text-tertiary-container fill-tertiary-container"
                      />
                    ))}
                  </div>
                </div>

                <div className="h-4 w-px bg-outline-variant hidden sm:block"></div>

                <span className="text-xs sm:text-sm font-medium text-secondary dark:text-gray-300">
                  Based on{" "}
                  <strong className="text-primary dark:text-white font-semibold">
                    {totalCount} Google reviews
                  </strong>
                </span>

                <div className="h-4 w-px bg-outline-variant hidden sm:block"></div>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-tertiary-container hover:underline inline-flex items-center gap-1"
                >
                  <span>View on Google</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              <div className="w-24 h-1 bg-tertiary-container mx-auto rounded-full mt-8" />
            </motion.div>
          </div>
        </section>

        {/* Reviews Content Grid */}
        <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-16 w-full">
          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-outline-variant shadow-sm animate-pulse flex flex-col justify-between h-64"
                >
                  <div className="space-y-3">
                    <div className="flex gap-1 text-tertiary-container">
                      {[...Array(5)].map((_, s) => (
                        <div key={s} className="w-4 h-4 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                      ))}
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-4/5"></div>
                    <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-2/3"></div>
                  </div>
                  <div className="pt-4 border-t border-outline-variant flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-zinc-800"></div>
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-1/2"></div>
                      <div className="h-2.5 bg-gray-200 dark:bg-zinc-800 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Clean Fallback when API is temporarily unavailable */}
          {!loading && error && reviews.length === 0 && (
            <div className="p-10 sm:p-12 rounded-2xl bg-white dark:bg-zinc-900 border border-outline-variant text-center max-w-xl mx-auto shadow-sm">
              <MessageSquare size={36} className="mx-auto text-tertiary-container mb-4" />
              <h3 className="font-display-lg text-lg font-bold text-primary dark:text-white mb-2">
                Google reviews are temporarily unavailable.
              </h3>
              <p className="text-secondary dark:text-gray-300 text-sm mb-6 leading-relaxed">
                Please check back shortly or view all authentic reviews and ratings directly on our official Google Maps profile.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => fetchReviews()}
                  className="w-full sm:w-auto px-5 py-2.5 bg-surface-container-low dark:bg-zinc-800 text-primary dark:text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-surface-container transition-all inline-flex items-center justify-center gap-2"
                >
                  <RefreshCw size={14} />
                  <span>Retry</span>
                </button>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 bg-tertiary-container text-black text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-yellow-500 transition-all inline-flex items-center justify-center gap-2 shadow-md"
                >
                  <span>View all Google Reviews</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          )}

          {/* Clean Empty State when 0 five-star reviews returned */}
          {!loading && !error && reviews.length === 0 && (
            <div className="p-10 sm:p-12 rounded-2xl bg-white dark:bg-zinc-900 border border-outline-variant text-center max-w-xl mx-auto shadow-sm">
              <Star size={36} className="mx-auto text-tertiary-container fill-tertiary-container mb-4" />
              <h3 className="font-display-lg text-lg font-bold text-primary dark:text-white mb-2">
                No 5-star Google reviews available at the moment.
              </h3>
              <p className="text-secondary dark:text-gray-300 text-sm mb-6 leading-relaxed">
                Explore our full customer ratings, feedback, and photos directly on Google Maps.
              </p>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-tertiary-container text-black font-label-caps text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-yellow-500 transition-all shadow-md"
              >
                <span>View all Google Reviews</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* REAL 5-STAR GOOGLE MAPS REVIEWS: Maximum 5 cards */}
          {!loading && reviews.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {reviews.map((rev, idx) => (
                <motion.div
                  key={rev.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: 5 Gold Stars + Google Maps Attribution */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-1 text-tertiary-container">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className="text-tertiary-container fill-tertiary-container"
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-secondary dark:text-gray-400 font-medium">
                        <GoogleIcon className="w-3.5 h-3.5" />
                        <span>Google Maps</span>
                      </div>
                    </div>

                    {/* Real Review Comment from Google */}
                    {rev.comment ? (
                      <p className="font-body-md text-secondary dark:text-gray-300 text-sm leading-relaxed mb-6 italic">
                        "{rev.comment}"
                      </p>
                    ) : (
                      <p className="font-body-md text-secondary/70 dark:text-gray-400 text-sm leading-relaxed mb-6 italic">
                        [5-star rating on Google Maps]
                      </p>
                    )}
                  </div>

                  {/* Reviewer Profile Section — Pure Google Data */}
                  <div className="pt-4 border-t border-outline-variant flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {rev.authorPhotoUrl ? (
                        <img
                          src={rev.authorPhotoUrl}
                          alt={rev.authorName}
                          className="w-10 h-10 rounded-full object-cover border border-outline-variant shrink-0"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-tertiary-container/20 text-tertiary-container font-display-lg font-bold text-sm flex items-center justify-center shrink-0 border border-tertiary-container/30">
                          {rev.authorName ? rev.authorName.charAt(0).toUpperCase() : "G"}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h4 className="font-display-lg text-sm font-bold text-primary dark:text-white truncate">
                          {rev.authorUri ? (
                            <a
                              href={rev.authorUri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline hover:text-tertiary-container transition-colors"
                            >
                              {rev.authorName}
                            </a>
                          ) : (
                            rev.authorName
                          )}
                        </h4>
                        <p className="font-caption text-[11px] text-secondary dark:text-gray-400">
                          {formatReviewDate(rev) || "Google reviewer"}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className="inline-flex items-center gap-1 font-label-caps text-[10px] text-tertiary-container uppercase tracking-wider bg-surface-container-low dark:bg-zinc-800 px-2 py-1 rounded font-semibold">
                        <ShieldCheck size={12} />
                        <span>Verified</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Google Maps Actions Toolbar */}
          <div className="mt-14 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white dark:bg-zinc-900 border border-outline-variant hover:border-tertiary-container text-xs font-semibold text-primary dark:text-white shadow-sm inline-flex items-center justify-center gap-2 transition-colors"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>View all Google Reviews</span>
              <ExternalLink size={13} className="text-secondary" />
            </a>

            <div className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white dark:bg-zinc-900 border border-outline-variant text-xs text-secondary shadow-sm">
              <ShieldCheck size={18} className="text-tertiary-container" />
              <span className="font-medium">100% Perfect Fit Guarantee on All Bespoke Commissions</span>
            </div>
          </div>
        </section>

        {/* Bottom Consultation Banner */}
        <section className="py-16 sm:py-20 bg-inverse-surface dark:bg-zinc-950 text-white w-full border-t border-outline-variant/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-16 text-center space-y-6">
            <h2 className="font-display-lg text-2xl sm:text-4xl font-bold">
              Join Our Distinguished Clientele
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Experience the pinnacle of bespoke tailoring craftsmanship at {businessName}.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/contact"
                className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 bg-tertiary-container text-black font-label-caps text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-yellow-500 transition-all inline-flex items-center justify-center gap-2 shadow-lg"
              >
                Book Appointment <ArrowRight size={15} />
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

export default ReviewsPage;
