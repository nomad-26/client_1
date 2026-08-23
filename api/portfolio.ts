/**
 * Fantasy King — Dynamic Server-Side Google Drive Headless CMS
 * 
 * Secure Architecture:
 * - Admin's Private Google Drive (Folder: OUR WORK)
 * - Server-side authentication via Google Service Account / OAuth2
 * - Supports All Drives (My Drive + Shared Drives)
 * - Automatically resolves active OUR WORK folder if folder ID changes
 * - Zero public Drive access required
 * - Server streams images securely to visitors
 */

import fs from "fs";
import path from "path";
import { getGoogleDriveAuthHeaders } from "./google-auth.js";

function ensureEnvLoaded(): void {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const filePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, "utf8");
        content.split("\n").forEach((line) => {
          const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
          if (match) {
            const key = match[1];
            let value = (match[2] || "").trim();
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.slice(1, -1);
            }
            if (value && (!process.env[key] || process.env[key] === "")) {
              process.env[key] = value;
            }
          }
        });
      } catch (err) {
        // ignore
      }
    }
  }
}

export interface DriveImage {
  id: string;
  fileId: string;
  name: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  categoryId: string;
  imageUrl: string;
  thumbnailUrl: string;
  modifiedTime?: string;
  mimeType?: string;
  size?: string;
}

export interface DriveCategory {
  id: string;
  folderId: string;
  name: string;
  folderName: string;
  slug: string;
  subtitle?: string;
  coverImage?: string;
  imageCount: number;
  images: DriveImage[];
}

export interface PortfolioApiResponse {
  rootFolder?: {
    id: string;
    name: string;
  };
  folders: DriveCategory[];
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

const DEFAULT_ROOT_FOLDER_ID = "1JaC8Vuq87FNMvzfQyN3NMqx2H-7Dd-lN";

/**
 * Searches for an accessible "OUR WORK" folder shared with the Service Account
 */
async function discoverOurWorkFolderId(reqHeaders: Record<string, string>, keyParam: string): Promise<{ id: string; name: string } | null> {
  try {
    const q = encodeURIComponent("name = 'OUR WORK' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
    const url = `https://www.googleapis.com/drive/v3/files?q=${q}&supportsAllDrives=true&includeItemsFromAllDrives=true&pageSize=5&fields=files(id,name,mimeType)${keyParam}`;
    const res = await fetch(url, { headers: reqHeaders });
    if (!res.ok) return null;
    const data = await res.json();
    const files = data.files || [];
    if (files.length > 0) {
      console.log(`[Google Drive] Auto-resolved active "OUR WORK" folder: ${files[0].name} (ID: ${files[0].id})`);
      return { id: files[0].id, name: files[0].name };
    }
  } catch (err) {
    console.warn("[Google Drive] Auto-discovery error:", err);
  }
  return null;
}

export async function fetchGoogleDrivePortfolio(
  folderId?: string
): Promise<PortfolioApiResponse> {
  ensureEnvLoaded();
  let targetFolderId =
    folderId ||
    process.env.GOOGLE_DRIVE_FOLDER_ID ||
    DEFAULT_ROOT_FOLDER_ID;

  // 1. Obtain Server-Side Authentication
  const auth = await getGoogleDriveAuthHeaders();

  if (auth.error && auth.authType === "none") {
    return {
      rootFolder: { id: targetFolderId, name: "OUR WORK" },
      folders: [],
      categories: [],
      isFallback: false,
      error: auth.error,
    };
  }

  const reqHeaders: Record<string, string> = {
    Accept: "application/json",
    ...auth.headers,
  };

  const keyParam = auth.apiKey ? `&key=${auth.apiKey}` : "";

  try {
    // 2. Query Root Folder to verify name and accessibility
    let rootInfoUrl = `https://www.googleapis.com/drive/v3/files/${targetFolderId}?supportsAllDrives=true&fields=id,name,mimeType,trashed${keyParam}`;
    let rootInfoRes = await fetch(rootInfoUrl, { headers: reqHeaders });

    let rootFolderName = "OUR WORK";

    if (!rootInfoRes.ok) {
      // If the configured folder ID returned 404/error, attempt auto-discovery of shared "OUR WORK" folder
      const discovered = await discoverOurWorkFolderId(reqHeaders, keyParam);
      if (discovered) {
        targetFolderId = discovered.id;
        rootFolderName = discovered.name;
        process.env.GOOGLE_DRIVE_FOLDER_ID = targetFolderId;
      } else {
        const errData = await rootInfoRes.json().catch(() => ({}));
        const msg = errData?.error?.message || `HTTP ${rootInfoRes.status}`;
        return {
          rootFolder: { id: targetFolderId, name: rootFolderName },
          folders: [],
          categories: [],
          isFallback: false,
          error: `Server-side authentication error accessing root folder (${targetFolderId}): ${msg}. Ensure the folder is shared with your Service Account email.`,
        };
      }
    } else {
      const rootInfo = await rootInfoRes.json();
      rootFolderName = rootInfo.name || "OUR WORK";
    }

    // 3. Query direct subfolders inside root
    const rootQuery = encodeURIComponent(
      `'${targetFolderId}' in parents and trashed = false and mimeType = 'application/vnd.google-apps.folder'`
    );
    const folderFields = encodeURIComponent("files(id, name, modifiedTime)");
    const listFoldersUrl = `https://www.googleapis.com/drive/v3/files?q=${rootQuery}&supportsAllDrives=true&includeItemsFromAllDrives=true&orderBy=name%20asc&pageSize=100&fields=${folderFields}${keyParam}`;

    const listFoldersRes = await fetch(listFoldersUrl, { headers: reqHeaders });
    if (!listFoldersRes.ok) {
      const errData = await listFoldersRes.json().catch(() => ({}));
      const msg = errData?.error?.message || `HTTP ${listFoldersRes.status}`;
      return {
        rootFolder: { id: targetFolderId, name: rootFolderName },
        folders: [],
        categories: [],
        isFallback: false,
        error: `Failed to query child folders in Google Drive: ${msg}`,
      };
    }

    const folderData = await listFoldersRes.json();
    const folderFiles = folderData.files || [];

    // Also check if images were uploaded directly to the root folder
    const directImagesQuery = encodeURIComponent(
      `'${targetFolderId}' in parents and trashed = false and (mimeType = 'image/jpeg' or mimeType = 'image/png' or mimeType = 'image/webp' or mimeType = 'image/gif' or mimeType = 'image/avif')`
    );
    const directImagesUrl = `https://www.googleapis.com/drive/v3/files?q=${directImagesQuery}&supportsAllDrives=true&includeItemsFromAllDrives=true&orderBy=modifiedTime%20desc&pageSize=100&fields=${folderFields}${keyParam}`;
    const directImagesRes = await fetch(directImagesUrl, { headers: reqHeaders });
    const directImagesData = directImagesRes.ok ? await directImagesRes.json() : { files: [] };
    const directImages = directImagesData.files || [];

    // If no subfolders and no direct images, return clean empty state without error notice
    if (folderFiles.length === 0 && directImages.length === 0) {
      return {
        rootFolder: { id: targetFolderId, name: rootFolderName },
        folders: [],
        categories: [],
        isFallback: false,
      };
    }

    // 4. For each subfolder, query its image files
    const categories: DriveCategory[] = [];
    const subfolderPromises: Promise<any>[] = [];

    // If direct images exist in root, create a default "Featured Work" category
    if (directImages.length > 0) {
      const images: DriveImage[] = directImages.map((file: any) => {
        const title = formatImageTitle(file.name);
        const slug = slugify(title) || file.id;
        return {
          id: file.id,
          fileId: file.id,
          name: file.name,
          title,
          slug,
          category: rootFolderName,
          categorySlug: slugify(rootFolderName),
          categoryId: targetFolderId,
          imageUrl: `/api/gallery/image/${file.id}`,
          thumbnailUrl: `/api/gallery/image/${file.id}?thumb=1`,
          modifiedTime: file.modifiedTime,
          mimeType: file.mimeType,
          size: file.size,
        };
      });

      categories.push({
        id: targetFolderId,
        folderId: targetFolderId,
        name: "Featured Creations",
        folderName: rootFolderName,
        slug: "featured-creations",
        subtitle: `Handcrafted bespoke tailoring from ${rootFolderName}.`,
        coverImage: images[0]?.imageUrl || "",
        imageCount: images.length,
        images,
      });
    }

    for (const folder of folderFiles) {
      const folderName = folder.name.trim();
      const folderSlug = slugify(folderName) || folder.id;
      const folderId = folder.id;

      // Filter only image mime types
      const subQuery = encodeURIComponent(
        `'${folderId}' in parents and trashed = false and (mimeType = 'image/jpeg' or mimeType = 'image/png' or mimeType = 'image/webp' or mimeType = 'image/gif' or mimeType = 'image/avif')`
      );
      const subFields = encodeURIComponent("files(id, name, mimeType, modifiedTime, thumbnailLink, size)");
      const subUrl = `https://www.googleapis.com/drive/v3/files?q=${subQuery}&supportsAllDrives=true&includeItemsFromAllDrives=true&orderBy=modifiedTime%20desc&pageSize=100&fields=${subFields}${keyParam}`;

      subfolderPromises.push(
        fetch(subUrl, { headers: reqHeaders })
          .then(async (r) => {
            if (!r.ok) {
              console.warn(`Subfolder query failed for ${folderName}: status ${r.status}`);
              return { files: [] };
            }
            return r.json();
          })
          .then((data) => {
            const files = data.files || [];
            const images: DriveImage[] = files.map((file: any) => {
              const title = formatImageTitle(file.name);
              const slug = slugify(title) || file.id;

              const imgUrl = `/api/gallery/image/${file.id}`;
              const thumbUrl = `/api/gallery/image/${file.id}?thumb=1`;

              return {
                id: file.id,
                fileId: file.id,
                name: file.name,
                title,
                slug,
                category: folderName,
                categorySlug: folderSlug,
                categoryId: folderId,
                imageUrl: imgUrl,
                thumbnailUrl: thumbUrl,
                modifiedTime: file.modifiedTime,
                mimeType: file.mimeType,
                size: file.size,
              };
            });

            categories.push({
              id: folderId,
              folderId,
              name: folderName,
              folderName,
              slug: folderSlug,
              subtitle: `Handcrafted ${folderName.toLowerCase()} tailored to perfection.`,
              coverImage: images[0]?.imageUrl || "",
              imageCount: images.length,
              images,
            });
          })
          .catch((err) => {
            console.error(`Error querying folder ${folderName}:`, err);
            categories.push({
              id: folderId,
              folderId,
              name: folderName,
              folderName,
              slug: folderSlug,
              subtitle: `Handcrafted ${folderName.toLowerCase()} tailored to perfection.`,
              coverImage: "",
              imageCount: 0,
              images: [],
            });
          })
      );
    }

    if (subfolderPromises.length > 0) {
      await Promise.all(subfolderPromises);
    }

    // Sort folders alphabetically by category name
    categories.sort((a, b) => a.name.localeCompare(b.name));

    return {
      rootFolder: { id: targetFolderId, name: rootFolderName },
      folders: categories,
      categories,
      isFallback: false,
    };
  } catch (err: any) {
    return {
      rootFolder: { id: targetFolderId, name: "OUR WORK" },
      folders: [],
      categories: [],
      isFallback: false,
      error: err?.message || "Failed to query Google Drive API",
    };
  }
}

/**
 * Fetches and streams an image binary from Google Drive using server-side credentials
 */
export async function streamGoogleDriveImage(
  fileId: string,
  thumb?: boolean
): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
  ensureEnvLoaded();
  const auth = await getGoogleDriveAuthHeaders();
  const reqHeaders: Record<string, string> = {
    ...auth.headers,
  };

  const keyParam = auth.apiKey ? `&key=${auth.apiKey}` : "";

  // 1. Get file metadata for mimeType
  const metaUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?supportsAllDrives=true&fields=id,mimeType,thumbnailLink${keyParam}`;
  const metaRes = await fetch(metaUrl, { headers: reqHeaders });

  if (!metaRes.ok) {
    return null;
  }

  const meta = await metaRes.json();
  const contentType = meta.mimeType || "image/jpeg";

  // 2. Fetch binary content
  const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?supportsAllDrives=true&alt=media${keyParam}`;
  const fileRes = await fetch(downloadUrl, { headers: reqHeaders });

  if (!fileRes.ok) {
    // If alt=media fails, try thumbnail if available
    if (meta.thumbnailLink) {
      const thumbUrl = meta.thumbnailLink.replace(/=s\d+$/, "=s1600");
      const thumbRes = await fetch(thumbUrl);
      if (thumbRes.ok) {
        const buffer = await thumbRes.arrayBuffer();
        return { buffer, contentType: "image/jpeg" };
      }
    }
    return null;
  }

  const buffer = await fileRes.arrayBuffer();
  return { buffer, contentType };
}

export default async function handler(req: any, res: any) {
  try {
    const result = await fetchGoogleDrivePortfolio();
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({
      folders: [],
      categories: [],
      isFallback: false,
      error: err?.message || "Unexpected server error fetching Google Drive",
    });
  }
}
