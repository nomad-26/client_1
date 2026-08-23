/**
 * FANTASY KING — Centralized Structured Data (Schema.org JSON-LD) Definitions
 */

const BASE_URL = "https://www.fantasyking.in";

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: `${BASE_URL}/`,
    name: "FANTASY KING — Bespoke Tailoring & Designer Alterations",
    description:
      "Salem's premier atelier for bespoke suits, designer blouses, bridal tailoring, and precision clothing alterations.",
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
    inLanguage: "en-IN",
  };
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "FANTASY KING (Designer) alteration & tailoring",
    alternateName: "Fantasy King Bespoke Tailoring",
    url: `${BASE_URL}/`,
    logo: `${BASE_URL}/images/fantasy-king-logo.png`,
    image: `${BASE_URL}/images/hero-bespoke-men-women.jpg`,
    telephone: "+918838066960",
    email: "fantasykingtailor@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "First Floor, Puma Showroom (opp), near Khadhims, Thangavel Nagar, Alagapuram, Swarnapuri",
      addressLocality: "Salem",
      addressRegion: "Tamil Nadu",
      postalCode: "636016",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+918838066960",
        contactType: "customer service",
        availableLanguage: ["English", "Tamil"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+919659356447",
        contactType: "reservations",
        availableLanguage: ["English", "Tamil"],
      },
    ],
  };
}

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ClothingStore", "MensClothingStore"],
    "@id": `${BASE_URL}/#localbusiness`,
    name: "FANTASY KING (Designer) alteration & tailoring",
    alternateName: "Fantasy King Atelier Salem",
    description:
      "FANTASY KING is a premier bespoke tailoring and precision garment alteration atelier located in Swarnapuri, Salem, Tamil Nadu. Specializing in bespoke men's suits, shirts, trousers, designer women's blouses, bridal lehengas, and expert garment restyling with 25+ years of master craftsmanship.",
    url: `${BASE_URL}/`,
    logo: `${BASE_URL}/images/fantasy-king-logo.png`,
    image: [
      `${BASE_URL}/images/hero-bespoke-men-women.jpg`,
      `${BASE_URL}/images/hero-bespoke-atelier.jpg`,
      `${BASE_URL}/images/about-heritage-atelier.jpg`,
    ],
    telephone: "+918838066960",
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Credit Card, Debit Card",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "First Floor, Puma Showroom (opp), near Khadhims, Thangavel Nagar, Alagapuram, Swarnapuri",
      addressLocality: "Salem",
      addressRegion: "Tamil Nadu",
      postalCode: "636016",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 11.6762356,
      longitude: 78.137468,
    },
    hasMap: "https://maps.google.com/?cid=14981608483129062196",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      bestRating: "5",
      ratingCount: "210",
      reviewCount: "210",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:30",
        closes: "21:30",
      },
    ],
    areaServed: [
      { "@type": "City", name: "Salem" },
      { "@type": "AdministrativeArea", name: "Swarnapuri" },
      { "@type": "AdministrativeArea", name: "Alagapuram" },
      { "@type": "AdministrativeArea", name: "Salem District" },
      { "@type": "State", name: "Tamil Nadu" },
      { "@type": "Country", name: "India" },
    ],
    parentOrganization: {
      "@id": `${BASE_URL}/#organization`,
    },
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

export function getServicesSchema() {
  const serviceList = [
    {
      name: "Men's Bespoke Tailoring & Custom Suits",
      description:
        "Handcrafted 2-piece and 3-piece bespoke suits, tuxedos, safari suits, blazers, and custom shirts drafted to individual measurements.",
      url: `${BASE_URL}/services#mens-tailoring`,
    },
    {
      name: "Women's Designer Tailoring & Couture",
      description:
        "Custom designer blouses, maggam work blouses, designer salwars, anarkalis, and Indo-western outfits tailored with precision.",
      url: `${BASE_URL}/services#womens-tailoring`,
    },
    {
      name: "Bridal & Wedding Wear Customization",
      description:
        "Ceremonial bridal lehengas, groom sherwanis, reception suits, and bespoke wedding attire customization.",
      url: `${BASE_URL}/services#bridal-tailoring`,
    },
    {
      name: "Precision Clothing & Garment Alterations",
      description:
        "Master alterations for suits, blazers, dress shirts, jeans, trousers, gowns, and silk sarees with original finishing preserved.",
      url: `${BASE_URL}/services#alterations`,
    },
    {
      name: "Kids Custom Outfits & Ceremonial Wear",
      description:
        "Bespoke children's suits, ethnic wear, and festive garments tailored with gentle, comfortable fabrics.",
      url: `${BASE_URL}/services#kids-tailoring`,
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: serviceList.map((srv, idx) => ({
      "@type": "Service",
      position: idx + 1,
      name: srv.name,
      description: srv.description,
      url: srv.url,
      provider: {
        "@id": `${BASE_URL}/#localbusiness`,
      },
      areaServed: {
        "@type": "City",
        name: "Salem",
      },
    })),
  };
}

export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
