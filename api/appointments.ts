/**
 * Fantasy King — Appointment Request Submission Backend Endpoint
 * 
 * Google Sheet Schema (Appointments!A:H):
 * Column A = Date (e.g. 23-08-2026)
 * Column B = Time (e.g. 21:30)
 * Column C = Full Name
 * Column D = Email
 * Column E = Phone Number (stored as plain text with +91)
 * Column F = Desired Service
 * Column G = Garment Notes / Specifications
 * Column H = Status (e.g. Pending)
 */

import fs from "fs";
import path from "path";
import { getGoogleAuthHeaders } from "./google-auth.js";

export interface AppointmentPayload {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  notes?: string;
}

export interface AppointmentResponse {
  success: boolean;
  submissionId?: string;
  message?: string;
  error?: string;
  rowData?: string[];
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

function getCurrentDate(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
}

function getCurrentTime(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  return `${hours}:${minutes}`;
}

function generateSubmissionId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FK-SUB-${ts}-${rand}`;
}

export async function saveAppointmentToGoogleSheets(
  payload: AppointmentPayload
): Promise<AppointmentResponse> {
  ensureEnvLoaded();

  // 1. Strict Server-Side Validation
  const fullName = (payload.name || "").trim();
  const email = (payload.email || "").trim();
  const rawPhone = (payload.phone || "").trim();
  const desiredService = (payload.service || "").trim();
  const preferredDate = (payload.date || "").trim();
  const garmentNotes = (payload.notes || "").trim() || "None";

  if (!fullName) {
    return { success: false, error: "Full Name is required." };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "A valid Email Address is required." };
  }
  if (!rawPhone || rawPhone.replace(/\D/g, "").length < 7) {
    return { success: false, error: "A valid Phone Number is required." };
  }
  if (!desiredService || desiredService === "Select a service") {
    return { success: false, error: "Please select a desired tailoring service." };
  }
  if (!preferredDate) {
    return { success: false, error: "Preferred consultation date is required." };
  }

  // Format Date and Time into distinct separate columns
  const dateStr = getCurrentDate(); // e.g. "23-08-2026"
  const timeStr = getCurrentTime(); // e.g. "21:30"
  const status = "Pending";

  // Prevent Google Sheets from treating "+91..." as a mathematical formula which causes #ERROR!
  // Prefixing with single quote tells Google Sheets to treat the value as literal text.
  const phoneNumber = rawPhone.startsWith("+") ? `'${rawPhone}` : rawPhone;

  // Exact 8-Column Array mapping directly to Columns A through H:
  // Column A = Date
  // Column B = Time
  // Column C = Full Name
  // Column D = Email
  // Column E = Phone Number
  // Column F = Desired Service
  // Column G = Garment Notes / Specifications
  // Column H = Status
  const rowData: string[] = [
    dateStr,
    timeStr,
    fullName,
    email,
    phoneNumber,
    desiredService,
    garmentNotes,
    status,
  ];

  const submissionId = generateSubmissionId();

  // 2. Check for Google Apps Script Webhook URL (Alternative simple integration)
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.GOOGLE_SHEETS_APPS_SCRIPT_URL;
  if (webhookUrl && webhookUrl.startsWith("http")) {
    try {
      const webRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dateStr,
          time: timeStr,
          fullName,
          email,
          phoneNumber: rawPhone,
          desiredService,
          garmentNotes,
          status,
          preferredDate,
          submissionId,
          rowData,
        }),
      });

      if (webRes.ok) {
        return {
          success: true,
          submissionId,
          rowData,
          message: "Appointment saved successfully to Google Sheets via Webhook.",
        };
      }
    } catch (err: any) {
      console.warn("Webhook submission attempt failed:", err);
    }
  }

  // 3. Google Sheets API v4 via Service Account
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || process.env.GOOGLE_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "Appointments";

  if (!spreadsheetId) {
    console.error("[Google Sheets Diagnostic] GOOGLE_SHEETS_SPREADSHEET_ID is missing from server environment.");
    return {
      success: false,
      error: "Google Sheets Spreadsheet ID is not configured in GOOGLE_SHEETS_SPREADSHEET_ID in .env. Please configure your admin Google Sheet ID.",
    };
  }

  // Obtain authenticated headers with Sheets scope
  const auth = await getGoogleAuthHeaders([
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.readonly",
  ]);

  if (auth.error && auth.authType === "none") {
    console.error("[Google Sheets Diagnostic] Authentication error:", auth.error);
    return {
      success: false,
      error: `Server-side authentication error: ${auth.error}. Make sure your Service Account key file exists.`,
    };
  }

  try {
    const range = `${sheetName}!A:H`;
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

    const res = await fetch(appendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...auth.headers,
      },
      body: JSON.stringify({
        range,
        majorDimension: "ROWS",
        values: [rowData],
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const msg = errData?.error?.message || `HTTP ${res.status}`;
      console.error(`[Google Sheets Diagnostic] Append error (${res.status}):`, msg);

      return {
        success: false,
        error: `Google Sheets API error: ${msg}. Make sure your spreadsheet is shared with your Service Account email as Editor.`,
      };
    }

    return {
      success: true,
      submissionId,
      rowData,
      message: "Appointment saved successfully to Google Sheets.",
    };
  } catch (err: any) {
    console.error("[Google Sheets Diagnostic] Network or runtime error:", err);
    return {
      success: false,
      error: err?.message || "Failed to save appointment to Google Sheets.",
    };
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method not allowed. Use POST." });
  }

  try {
    let payload: AppointmentPayload;
    if (typeof req.body === "string") {
      payload = JSON.parse(req.body);
    } else {
      payload = req.body || {};
    }

    const result = await saveAppointmentToGoogleSheets(payload);
    res.setHeader("Content-Type", "application/json");

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || "Internal server error submitting appointment.",
    });
  }
}
