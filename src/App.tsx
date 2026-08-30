import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { HomePage } from "./pages/HomePage";

// Lazy-loaded routes for code splitting
const AboutPage = lazy(() => import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })));
const ServicesPage = lazy(() => import("./pages/ServicesPage").then((m) => ({ default: m.ServicesPage })));
const OurWorkPage = lazy(() => import("./pages/OurWorkPage").then((m) => ({ default: m.OurWorkPage })));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage").then((m) => ({ default: m.ReviewsPage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then((m) => ({ default: m.ContactPage })));
const CategoryPage = lazy(() => import("./pages/CategoryPage").then((m) => ({ default: m.CategoryPage })));
const PortfolioDetailPage = lazy(() => import("./pages/PortfolioDetailPage").then((m) => ({ default: m.PortfolioDetailPage })));
const OurWorkGalleryPage = lazy(() => import("./pages/OurWorkGalleryPage").then((m) => ({ default: m.OurWorkGalleryPage })));
const CategoryGalleryPage = lazy(() => import("./pages/CategoryGalleryPage").then((m) => ({ default: m.CategoryGalleryPage })));

function PageFallback() {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-tertiary-container border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      {/* Scroll restoration to (0, 0) on every route navigation */}
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Main Continuous Single-Page Website */}
          <Route path="/" element={<HomePage />} />

          {/* Dedicated Pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Dedicated Digital Folder Gallery Routes */}
          <Route path="/our-work-gallery" element={<OurWorkGalleryPage />} />
          <Route path="/our-work-gallery/:categorySlug" element={<CategoryGalleryPage />} />

          {/* Legacy / Dedicated Our Work Pages */}
          <Route path="/our-work" element={<OurWorkPage />} />
          <Route path="/our-work/:categorySlug" element={<CategoryPage />} />
          <Route path="/our-work/:categorySlug/:imageSlug" element={<PortfolioDetailPage />} />
          <Route path="/our-work/:slug" element={<PortfolioDetailPage />} />

          {/* Catch-all Fallback to Home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
