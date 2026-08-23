/**
 * Server-Side Google Authentication Service (Admin Only)
 * 
 * Supports:
 * 1. Google Service Account (Headless CMS & Google Sheets):
 *    - GOOGLE_SERVICE_ACCOUNT_EMAIL
 *    - GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY (or GOOGLE_SERVICE_ACCOUNT_KEY_FILE)
 *    Scopes:
 *    - https://www.googleapis.com/auth/drive.readonly
 *    - https://www.googleapis.com/auth/spreadsheets
 * 
 * 2. OAuth2 Refresh Token (Drive / Sheets / Google Business Profile):
 *    - GOOGLE_CLIENT_ID / GOOGLE_BUSINESS_CLIENT_ID
 *    - GOOGLE_CLIENT_SECRET / GOOGLE_BUSINESS_CLIENT_SECRET
 *    - GOOGLE_REFRESH_TOKEN / GOOGLE_BUSINESS_REFRESH_TOKEN
 * 
 * 3. API Key (Fallback if folder is shared with link):
 *    - GOOGLE_DRIVE_API_KEY
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";

export const DEFAULT_SCOPES = [
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/spreadsheets",
];

export const BUSINESS_PROFILE_SCOPES = [
  "https://www.googleapis.com/auth/business.manage",
];

const tokenCache: Record<string, { token: string; expiresAt: number }> = {};
const TOKEN_FILE_PATH = path.resolve(process.cwd(), ".google-business-tokens.json");

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Reads local token storage file if available
 */
export function loadStoredOAuthTokens(): {
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  scope?: string;
  account_id?: string;
  location_id?: string;
  location_name?: string;
} {
  try {
    if (fs.existsSync(TOKEN_FILE_PATH)) {
      const data = fs.readFileSync(TOKEN_FILE_PATH, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn("Could not load stored OAuth tokens:", err);
  }
  return {};
}

/**
 * Saves OAuth tokens securely to local token file for server persistence
 */
export function saveOAuthTokens(tokens: {
  refresh_token?: string;
  access_token?: string;
  expires_in?: number;
  scope?: string;
  account_id?: string;
  location_id?: string;
  location_name?: string;
}): void {
  try {
    const existing = loadStoredOAuthTokens();
    const merged = {
      ...existing,
      ...tokens,
      ...(tokens.expires_in ? { expires_at: Date.now() + tokens.expires_in * 1000 } : {}),
      updated_at: new Date().toISOString(),
    };
    fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify(merged, null, 2), "utf8");
    if (tokens.refresh_token) {
      process.env.GOOGLE_BUSINESS_REFRESH_TOKEN = tokens.refresh_token;
      if (!process.env.GOOGLE_REFRESH_TOKEN) {
        process.env.GOOGLE_REFRESH_TOKEN = tokens.refresh_token;
      }
    }
  } catch (err) {
    console.error("Failed to save OAuth tokens:", err);
  }
}

/**
 * Builds the Google OAuth2 consent URL for Business Profile authorization
 */
export function getGoogleOAuthConsentUrl(options?: {
  clientId?: string;
  redirectUri?: string;
  scopes?: string[];
  state?: string;
}): string {
  const clientId =
    options?.clientId ||
    process.env.GOOGLE_BUSINESS_CLIENT_ID ||
    process.env.GOOGLE_CLIENT_ID ||
    "";
  const redirectUri =
    options?.redirectUri ||
    process.env.GOOGLE_BUSINESS_REDIRECT_URI ||
    process.env.GOOGLE_REDIRECT_URI ||
    "http://localhost:3000/api/google/callback";
  const scopes = options?.scopes || BUSINESS_PROFILE_SCOPES;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes.join(" "),
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
  });

  if (options?.state) {
    params.set("state", options.state);
  }

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchanges authorization code for access and refresh tokens
 */
export async function exchangeOAuthCodeForTokens(options: {
  code: string;
  redirectUri?: string;
  clientId?: string;
  clientSecret?: string;
}): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}> {
  const clientId =
    options.clientId ||
    process.env.GOOGLE_BUSINESS_CLIENT_ID ||
    process.env.GOOGLE_CLIENT_ID;
  const clientSecret =
    options.clientSecret ||
    process.env.GOOGLE_BUSINESS_CLIENT_SECRET ||
    process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    options.redirectUri ||
    process.env.GOOGLE_BUSINESS_REDIRECT_URI ||
    process.env.GOOGLE_REDIRECT_URI ||
    "http://localhost:3000/api/google/callback";

  if (!clientId || !clientSecret) {
    throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in server environment.");
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: options.code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }).toString(),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(
      errData.error_description ||
      errData.error ||
      `Token Exchange Failed: HTTP ${res.status}`
    );
  }

  const data = await res.json();
  saveOAuthTokens({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    scope: data.scope,
  });

  return data;
}

/**
 * Generates an OAuth2 access token for a Google Service Account using Node's built-in crypto.
 */
export async function getServiceAccountAccessToken(
  clientEmail: string,
  privateKey: string,
  scopes: string[] = DEFAULT_SCOPES
): Promise<string> {
  const scopeString = scopes.join(" ");
  const cacheKey = `${clientEmail}:${scopeString}`;
  const cached = tokenCache[cacheKey];

  if (cached && Date.now() < cached.expiresAt - 300000) {
    return cached.token;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = JSON.stringify({ alg: "RS256", typ: "JWT" });
  const claimSet = JSON.stringify({
    iss: clientEmail,
    scope: scopeString,
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  });

  const encodedHeader = base64UrlEncode(header);
  const encodedClaimSet = base64UrlEncode(claimSet);
  const signatureInput = `${encodedHeader}.${encodedClaimSet}`;

  // Clean private key string (handling JSON objects, escaped \n, quotes, and carriage returns)
  let cleanKey = (privateKey || "").trim();
  let email = (clientEmail || "").trim();

  // If the user pasted the entire service-account JSON into GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  if (cleanKey.startsWith("{") && cleanKey.endsWith("}")) {
    try {
      const parsed = JSON.parse(cleanKey);
      if (parsed.private_key) cleanKey = String(parsed.private_key).trim();
      if (parsed.client_email && !email) email = String(parsed.client_email).trim();
    } catch {
      // ignore
    }
  }

  if ((cleanKey.startsWith('"') && cleanKey.endsWith('"')) || (cleanKey.startsWith("'") && cleanKey.endsWith("'"))) {
    cleanKey = cleanKey.slice(1, -1);
  }
  cleanKey = cleanKey.replace(/\\n/g, "\n").replace(/\r/g, "").trim();
  if (!cleanKey.includes("-----BEGIN")) {
    cleanKey = `-----BEGIN PRIVATE KEY-----\n${cleanKey}\n-----END PRIVATE KEY-----`;
  }

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signatureInput);
  const signature = signer.sign(cleanKey, "base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const jwtAssertion = `${signatureInput}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwtAssertion}`,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(
      errData.error_description ||
      errData.error ||
      `Google OAuth Token Error: HTTP ${res.status}`
    );
  }

  const data = await res.json();
  const token = data.access_token;
  tokenCache[cacheKey] = {
    token,
    expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
  };
  return token;
}

/**
 * Refreshes an access token using OAuth2 Client ID, Client Secret, and Refresh Token.
 */
export async function getOAuth2RefreshToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<string> {
  const cacheKey = `oauth:${clientId}`;
  const cached = tokenCache[cacheKey];

  if (cached && Date.now() < cached.expiresAt - 300000) {
    return cached.token;
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }).toString(),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(
      errData.error_description ||
      errData.error ||
      `OAuth2 Refresh Error: HTTP ${res.status}`
    );
  }

  const data = await res.json();
  const token = data.access_token;
  tokenCache[cacheKey] = {
    token,
    expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
  };
  return token;
}

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

/**
 * Obtains an authenticated Bearer token or API key for server-side Google queries (Drive / Sheets).
 */
export async function getGoogleAuthHeaders(scopes: string[] = DEFAULT_SCOPES): Promise<{
  headers: Record<string, string>;
  apiKey?: string;
  authType: "service_account" | "oauth2" | "api_key" | "none";
  error?: string;
}> {
  ensureEnvLoaded();

  // 1. Check Service Account Key File (configured path or ./service-account.json)
  const candidatePaths = [
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    "service-account.json",
    "./service-account.json",
  ].filter(Boolean) as string[];

  for (const candidate of candidatePaths) {
    const resolvedPath = path.isAbsolute(candidate) ? candidate : path.resolve(process.cwd(), candidate);
    if (fs.existsSync(resolvedPath)) {
      try {
        const fileContent = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
        if (fileContent.client_email && fileContent.private_key) {
          const token = await getServiceAccountAccessToken(
            fileContent.client_email,
            fileContent.private_key,
            scopes
          );
          return {
            headers: { Authorization: `Bearer ${token}` },
            authType: "service_account",
          };
        }
      } catch (err: any) {
        // continue to check environment variables
      }
    }
  }

  // 2. Check Service Account Environment Variables
  const saEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const saKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (saEmail && saKey) {
    try {
      const token = await getServiceAccountAccessToken(saEmail, saKey, scopes);
      return {
        headers: { Authorization: `Bearer ${token}` },
        authType: "service_account",
      };
    } catch (err: any) {
      return {
        headers: {},
        authType: "service_account",
        error: `Service account authentication failed: ${err.message}`,
      };
    }
  }

  // 3. Check OAuth2 Refresh Token (Only if OAuth token contains required scopes or for general OAuth)
  const isDriveOrSheets = scopes.some((s) => s.includes("drive") || s.includes("spreadsheets"));
  const storedTokens = loadStoredOAuthTokens();
  const oauthScope = storedTokens.scope || "";

  // If Drive or Sheets is requested, only use OAuth if the OAuth token explicitly granted Drive/Sheets
  const oauthHasRequiredScope = !isDriveOrSheets || oauthScope.includes("drive") || oauthScope.includes("spreadsheets");

  if (oauthHasRequiredScope) {
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_BUSINESS_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_BUSINESS_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN || process.env.GOOGLE_BUSINESS_REFRESH_TOKEN || storedTokens.refresh_token;

    if (clientId && clientSecret && refreshToken) {
      try {
        const token = await getOAuth2RefreshToken(clientId, clientSecret, refreshToken);
        return {
          headers: { Authorization: `Bearer ${token}` },
          authType: "oauth2",
        };
      } catch (err: any) {
        return {
          headers: {},
          authType: "oauth2",
          error: `OAuth2 token refresh failed: ${err.message}`,
        };
      }
    }
  }

  // 4. Check API Key (Drive only)
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (apiKey && apiKey !== "your_google_drive_api_key_optional") {
    return {
      headers: {},
      apiKey,
      authType: "api_key",
    };
  }

  return {
    headers: {},
    authType: "none",
    error: isDriveOrSheets
      ? "Google Service Account credentials not found in server environment. Please configure GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY in Vercel Project Settings."
      : "No server-side Google credentials found in environment.",
  };
}

/**
 * Obtains authenticated headers specifically for Google Business Profile API calls
 */
export async function getGoogleBusinessAuthHeaders(): Promise<{
  headers: Record<string, string>;
  accessToken?: string;
  error?: string;
}> {
  const clientId = process.env.GOOGLE_BUSINESS_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_BUSINESS_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
  const storedTokens = loadStoredOAuthTokens();
  const refreshToken = process.env.GOOGLE_BUSINESS_REFRESH_TOKEN || process.env.GOOGLE_REFRESH_TOKEN || storedTokens.refresh_token;

  if (!clientId || !clientSecret) {
    return {
      headers: {},
      error: "Google OAuth credentials not configured (Set GOOGLE_BUSINESS_CLIENT_ID & GOOGLE_BUSINESS_CLIENT_SECRET or GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET).",
    };
  }

  if (!refreshToken) {
    return {
      headers: {},
      error: "Google Business Profile not authorized yet. Visit http://localhost:3000/api/google/auth to sign in and grant access.",
    };
  }

  try {
    const accessToken = await getOAuth2RefreshToken(clientId, clientSecret, refreshToken);
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      accessToken,
    };
  } catch (err: any) {
    return {
      headers: {},
      error: `Failed to refresh Google Business Profile OAuth token: ${err.message}`,
    };
  }
}

// Backward compatibility alias for Google Drive
export const getGoogleDriveAuthHeaders = () => getGoogleAuthHeaders(["https://www.googleapis.com/auth/drive.readonly"]);
