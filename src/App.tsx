import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ServicesPage } from "./pages/ServicesPage";
import { OurWorkPage } from "./pages/OurWorkPage";
import { ReviewsPage } from "./pages/ReviewsPage";
import { ContactPage } from "./pages/ContactPage";
import { CategoryPage } from "./pages/CategoryPage";
import { PortfolioDetailPage } from "./pages/PortfolioDetailPage";

import { OurWorkGalleryPage } from "./pages/OurWorkGalleryPage";
import { CategoryGalleryPage } from "./pages/CategoryGalleryPage";

export function App() {
  return (
    <BrowserRouter>
      {/* Scroll restoration to (0, 0) on every route navigation */}
      <ScrollToTop />
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
    </BrowserRouter>
  );
}

export default App;
