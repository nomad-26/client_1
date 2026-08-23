export interface DriveImage {
  id: string;
  fileId: string;
  name: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  categoryId: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl: string;
  modifiedTime?: string;
  mimeType?: string;
  size?: string;
}

export type GalleryItem = DriveImage;

export interface DriveCategory {
  id: string;
  folderId?: string;
  name: string;
  folderName?: string;
  slug: string;
  subtitle?: string;
  description?: string;
  coverImage?: string;
  imageCount: number;
  images: DriveImage[];
}

export interface PortfolioApiResponse {
  rootFolder?: {
    id: string;
    name: string;
  };
  folders?: DriveCategory[];
  categories: DriveCategory[];
  isFallback: boolean;
  error?: string;
}

export function slugify(text: string): string {
  return (text || "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatImageTitle(fileName: string): string {
  const base = (fileName || "").replace(/\.[^/.]+$/, "").trim();
  return base
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const CATEGORY_SUBTITLES: Record<string, string> = {
  alterations: "Precision fitting and thoughtful alterations crafted to perfection.",
  stitching: "Masterful stitching and custom tailoring created to your exact measurements.",
  "mens-wear": "Handcrafted suits, formal shirts, executive trousers, and traditional attire.",
  "womens-wear": "Exquisite blouses, bridal lehengas, bespoke gowns, and couture dresses.",
  "custom-designs": "One-of-a-kind bespoke creations patterned from scratch for your unique style.",
  "bespoke-suits": "Italian & British wool suits, handcrafted lapels, and timeless silhouettes.",
  "blouse-designs": "Intricate designer blouses, handcrafted embroidery, and ceremonial cuts.",
  "kids-wear": "Miniature bespoke suits, ethnic sherwanis, and festive party outfits.",
};

// No hardcoded categories: live data comes dynamically from Google Drive API
export const FALLBACK_CATEGORIES: DriveCategory[] = [];
export const FALLBACK_GALLERY_ITEMS: GalleryItem[] = [];
