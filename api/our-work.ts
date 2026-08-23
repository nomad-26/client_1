/**
 * Fantasy King — Dynamic Google Drive Portfolio API Endpoint
 * Re-exports from portfolio.ts for endpoint parity: GET /api/our-work
 */

import handler, { fetchGoogleDrivePortfolio } from "./portfolio.js";

export { fetchGoogleDrivePortfolio };
export default handler;
