import React, { useEffect } from "react";

export interface SchemaItem {
  "@context": string;
  "@type": string | string[];
  [key: string]: any;
}

export interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  schema?: SchemaItem | SchemaItem[];
}

const BASE_URL = "https://www.fantasyking.in";
const DEFAULT_OG_IMAGE = "https://www.fantasyking.in/images/hero-bespoke-men-women.jpg";

export function SEO({
  title,
  description,
  canonicalPath = "",
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  schema,
}: SEOProps) {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper to create or update meta tag by name or property
    const setMetaTag = (attrName: "name" | "property", attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Set Standard Meta Tags
    setMetaTag("name", "description", description);
    setMetaTag("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    setMetaTag("name", "geo.region", "IN-TN");
    setMetaTag("name", "geo.placename", "Salem, Swarnapuri, Tamil Nadu");
    setMetaTag("name", "geo.position", "11.6762356;78.137468");
    setMetaTag("name", "ICBM", "11.6762356, 78.137468");

    // 3. Set Canonical Link Tag
    const cleanPath = canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`;
    const fullCanonical = cleanPath === "/" ? `${BASE_URL}/` : `${BASE_URL}${cleanPath}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", fullCanonical);

    // 4. Set Open Graph Metadata
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", fullCanonical);
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:image", ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`);
    setMetaTag("property", "og:site_name", "FANTASY KING (Designer) Alteration & Tailoring");
    setMetaTag("property", "og:locale", "en_IN");

    // 5. Set Twitter Card Metadata
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`);

    // 6. Dynamic JSON-LD Structured Data Injection
    const existingScripts = document.querySelectorAll('script[data-dynamic-seo-schema="true"]');
    existingScripts.forEach((s) => s.remove());

    if (schema) {
      const schemas = Array.isArray(schema) ? schema : [schema];
      schemas.forEach((schemaObj, index) => {
        const script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        script.setAttribute("data-dynamic-seo-schema", "true");
        script.setAttribute("data-schema-index", String(index));
        script.textContent = JSON.stringify(schemaObj);
        document.head.appendChild(script);
      });
    }
  }, [title, description, canonicalPath, ogImage, ogType, schema]);

  return null;
}
