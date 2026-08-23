import { streamGoogleDriveImage } from "../../portfolio.js";

export default async function handler(req: any, res: any) {
  const { fileId } = req.query;

  if (!fileId || typeof fileId !== "string") {
    return res.status(400).json({ error: "Missing fileId parameter" });
  }

  try {
    const isThumb = req.query.thumb === "true" || req.query.thumbnail === "true";
    const image = await streamGoogleDriveImage(fileId, isThumb);

    if (!image) {
      return res.status(404).json({ error: "Image not found or inaccessible in Google Drive" });
    }

    res.setHeader("Content-Type", image.contentType);
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400");
    return res.status(200).send(Buffer.from(image.buffer));
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Failed to stream image" });
  }
}
