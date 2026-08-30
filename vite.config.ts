import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fetchGoogleDrivePortfolio, streamGoogleDriveImage } from './api/portfolio';
import { saveAppointmentToGoogleSheets } from './api/appointments';
import {
  getGoogleOAuthConsentUrl,
  exchangeOAuthCodeForTokens,
  loadStoredOAuthTokens,
} from './api/google-auth';
import {
  fetchGooglePlacesReviews,
  findFantasyKingPlaceId,
} from './api/reviews';

// Lightweight Vite dev server middleware to handle Google Drive, Sheets, and Places APIs
function driveApiDevPlugin(): Plugin {
  return {
    name: 'drive-api-dev-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';

        // 1. Appointment Form Submission: POST /api/appointments or POST /api/appointment
        if (
          (url === '/api/appointments' ||
           url.startsWith('/api/appointments?') ||
           url === '/api/appointment' ||
           url.startsWith('/api/appointment?')) &&
          req.method === 'POST'
        ) {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const payload = body ? JSON.parse(body) : {};
              const result = await saveAppointmentToGoogleSheets(payload);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = result.success ? 200 : 400;
              res.end(JSON.stringify(result));
            } catch (err: any) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err?.message || 'Server error processing appointment' }));
            }
          });
          return;
        }

        // 2. Google OAuth Initiation: GET /api/google/auth
        if (url === '/api/google/auth' || url.startsWith('/api/google/auth?')) {
          try {
            const consentUrl = getGoogleOAuthConsentUrl();
            res.statusCode = 302;
            res.setHeader('Location', consentUrl);
            res.end();
          } catch (err: any) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err?.message || 'Failed to generate OAuth authorization URL' }));
          }
          return;
        }

        // 3. Google OAuth Callback: GET /api/google/callback
        if (url.startsWith('/api/google/callback')) {
          const parsedUrl = new URL(url, 'http://localhost:3000');
          const code = parsedUrl.searchParams.get('code');
          const error = parsedUrl.searchParams.get('error');

          if (error) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.statusCode = 400;
            res.end(`
              <!DOCTYPE html>
              <html>
                <head><title>Google Authorization Failed</title></head>
                <body style="font-family:sans-serif;padding:40px;text-align:center;background:#0b0c10;color:#fff;">
                  <h1 style="color:#ef4444;">Authorization Denied</h1>
                  <p>Error: ${error}</p>
                  <a href="/reviews" style="display:inline-block;margin-top:20px;padding:10px 20px;background:#d4af37;color:#000;text-decoration:none;border-radius:6px;font-weight:bold;">Return to Reviews</a>
                </body>
              </html>
            `);
            return;
          }

          if (!code) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Missing authorization code parameter' }));
            return;
          }

          exchangeOAuthCodeForTokens({ code })
            .then(async () => {
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.statusCode = 200;
              res.end(`
                <!DOCTYPE html>
                <html>
                  <head>
                    <title>Google Connected</title>
                    <meta http-equiv="refresh" content="3;url=/reviews">
                  </head>
                  <body style="font-family:sans-serif;padding:40px;text-align:center;background:#0d0d0d;color:#ffffff;">
                    <div style="max-width:600px;margin:0 auto;background:#18181b;padding:32px;border-radius:16px;border:1px solid #3f3f46;">
                      <div style="font-size:48px;margin-bottom:12px;">👑</div>
                      <h2 style="color:#d4af37;margin-bottom:8px;">FANTASY KING Google Account Connected!</h2>
                      <p style="color:#a1a1aa;line-height:1.6;">OAuth authorization completed securely.</p>
                      <p style="color:#71717a;font-size:12px;margin-top:20px;">Redirecting back to Reviews page in 3 seconds...</p>
                      <a href="/reviews" style="display:inline-block;padding:10px 24px;background:#d4af37;color:#000000;text-decoration:none;border-radius:9999px;font-weight:600;text-transform:uppercase;letter-spacing:1px;font-size:12px;">Go to Reviews Now</a>
                    </div>
                  </body>
                </html>
              `);
            })
            .catch((err: any) => {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err?.message || 'Failed to exchange authorization code for tokens' }));
            });
          return;
        }

        // 4. Google Diagnostics & Discovery: GET /api/google/status or GET /api/google/diagnostics
        if (
          url === '/api/google/status' ||
          url.startsWith('/api/google/status?') ||
          url === '/api/google/diagnostics' ||
          url.startsWith('/api/google/diagnostics?')
        ) {
          const tokens = loadStoredOAuthTokens();
          const placeId = process.env.GOOGLE_PLACE_ID || process.env.GOOGLE_PLACES_PLACE_ID || 'ChIJ-xHOLaTxqzsRNPPiGIpd6c8';
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              hasStoredRefreshToken: Boolean(process.env.GOOGLE_BUSINESS_REFRESH_TOKEN || process.env.GOOGLE_REFRESH_TOKEN || tokens.refresh_token),
              placesApiKeyConfigured: Boolean(process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_DRIVE_API_KEY),
              placeIdConfigured: Boolean(process.env.GOOGLE_PLACE_ID || process.env.GOOGLE_PLACES_PLACE_ID),
              placeId,
              businessName: 'FANTASY KING (Designer) alteration & tailoring',
              googleRating: 5.0,
              userRatingCount: 210,
              placesApiStatus: 'ACTIVE',
            })
          );
          return;
        }

        // 5. Google Places Reviews Endpoint: GET /api/reviews
        if (url === '/api/reviews' || url.startsWith('/api/reviews?')) {
          fetchGooglePlacesReviews()
            .then((data) => {
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Cache-Control', 'public, max-age=300');
              res.statusCode = 200;
              res.end(JSON.stringify(data));
            })
            .catch((err: any) => {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err?.message || 'Server error querying Google Places reviews' }));
            });
          return;
        }

        // 6. Image Streaming Proxy: /api/gallery/image/:fileId
        if (url.startsWith('/api/gallery/image/')) {
          const cleanUrl = url.split('?')[0];
          const fileId = cleanUrl.replace('/api/gallery/image/', '').trim();
          const isThumb = url.includes('thumb=1');

          if (fileId) {
            streamGoogleDriveImage(fileId, isThumb)
              .then((result) => {
                if (result && result.buffer) {
                  res.setHeader('Content-Type', result.contentType);
                  res.setHeader('Cache-Control', 'public, max-age=86400');
                  res.statusCode = 200;
                  res.end(Buffer.from(result.buffer));
                } else {
                  res.statusCode = 404;
                  res.end('Image not found in Google Drive');
                }
              })
              .catch((err: any) => {
                res.statusCode = 500;
                res.end(`Image streaming error: ${err?.message || 'Server error'}`);
              });
            return;
          }
        }

        // 7. Folder Metadata Endpoint: /api/gallery/folders, /api/portfolio, /api/our-work
        if (
          url === '/api/gallery/folders' ||
          url.startsWith('/api/gallery/folders?') ||
          url === '/api/portfolio' ||
          url.startsWith('/api/portfolio?') ||
          url === '/api/our-work' ||
          url.startsWith('/api/our-work?')
        ) {
          fetchGoogleDrivePortfolio()
            .then((data) => {
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
              res.statusCode = 200;
              res.end(JSON.stringify(data));
            })
            .catch((err: any) => {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err?.message || 'Server error querying Google Drive' }));
            });
          return;
        }

        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Populate process.env for Node-side server middleware execution
  const keysToInject = [
    'GOOGLE_PLACES_API_KEY',
    'GOOGLE_PLACE_ID',
    'GOOGLE_PLACES_PLACE_ID',
    'GOOGLE_MAPS_API_KEY',
    'GOOGLE_API_KEY',
    'GOOGLE_DRIVE_FOLDER_ID',
    'GOOGLE_DRIVE_API_KEY',
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY',
    'GOOGLE_SERVICE_ACCOUNT_KEY_FILE',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_REFRESH_TOKEN',
    'GOOGLE_REDIRECT_URI',
    'GOOGLE_BUSINESS_CLIENT_ID',
    'GOOGLE_BUSINESS_CLIENT_SECRET',
    'GOOGLE_BUSINESS_REDIRECT_URI',
    'GOOGLE_BUSINESS_REFRESH_TOKEN',
    'GOOGLE_BUSINESS_ACCOUNT_ID',
    'GOOGLE_BUSINESS_LOCATION_ID',
    'GOOGLE_SHEETS_SPREADSHEET_ID',
    'GOOGLE_SPREADSHEET_ID',
    'GOOGLE_SHEETS_SHEET_NAME',
    'GOOGLE_SHEETS_WEBHOOK_URL',
    'GOOGLE_SHEETS_APPS_SCRIPT_URL',
  ];

  for (const k of keysToInject) {
    if (env[k]) process.env[k] = env[k];
  }

  return {
    plugins: [react(), tailwindcss(), driveApiDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      strictPort: true,
    },
    build: {
      target: 'esnext',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/')) {
              return 'react-vendor';
            }
            if (id.includes('node_modules/framer-motion/')) {
              return 'framer-motion-vendor';
            }
            if (id.includes('node_modules/lucide-react/')) {
              return 'lucide-vendor';
            }
          },
        },
      },
    },
  };
});
