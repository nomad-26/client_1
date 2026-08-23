/**
 * Fantasy King — Dynamic Google Drive Portfolio Folders API Endpoint
 * Re-exports from portfolio.ts for endpoint parity: GET /api/gallery/folders
 */

import handler, { fetchGoogleDrivePortfolio } from "../portfolio.js";

export { fetchGoogleDrivePortfolio };
export default handler;
