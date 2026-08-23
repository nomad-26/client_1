/**
 * Centralized WhatsApp Configuration for FANTASY KING
 * 
 * Official click-to-chat format: https://wa.me/COUNTRYCODEPHONENUMBER?text=ENCODED_MESSAGE
 */

// Default business phone number (India: 91 + 10-digit number)
export const DEFAULT_WHATSAPP_NUMBER = "+91 88380 66960";

// Default prefilled messages
export const DEFAULT_WHATSAPP_MESSAGES = {
  general: "Hello FANTASY KING, I would like to know more about your bespoke tailoring services.",
  consultation: "Hello FANTASY KING, I would like to schedule a private fitting consultation.",
  styleHelp: "Hello FANTASY KING, I need assistance choosing styles and fabrics for my custom tailoring.",
} as const;

export interface AppointmentDetails {
  name: string;
  email: string;
  phone: string;
  date: string;
  service: string;
  notes?: string;
  submissionId?: string;
}

/**
 * Sanitizes phone number by stripping all non-digits ('+', spaces, brackets, hyphens)
 */
export function sanitizeWhatsAppNumber(phone?: string): string {
  const raw = phone || (typeof import.meta !== "undefined" && import.meta.env?.VITE_WHATSAPP_NUMBER) || DEFAULT_WHATSAPP_NUMBER;
  const clean = String(raw).replace(/\D/g, "");
  return clean || DEFAULT_WHATSAPP_NUMBER;
}

/**
 * Formats structured appointment details into the exact WhatsApp message template
 */
export function formatAppointmentWhatsAppMessage(details: AppointmentDetails): string {
  const lines = [
    "Hello FANTASY KING,",
    "New Appointment Request",
    `Name: ${details.name.trim()}`,
    `Email: ${details.email.trim()}`,
    `Phone: ${details.phone.trim()}`,
    `Service: ${details.service.trim()}`,
    `Preferred Date: ${details.date.trim()}`,
    `Requirements: ${(details.notes && details.notes.trim()) ? details.notes.trim() : "None"}`,
  ];

  if (details.submissionId) {
    lines.push(`Submission ID: ${details.submissionId}`);
  }

  lines.push("Thank you.");

  return lines.join("\n");
}

/**
 * Generates an official WhatsApp click-to-chat URL with prefilled message
 */
export function getWhatsAppUrl(
  message: string = DEFAULT_WHATSAPP_MESSAGES.general,
  phoneNumber?: string
): string {
  const cleanNumber = sanitizeWhatsAppNumber(phoneNumber);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

/**
 * Generates an official WhatsApp click-to-chat URL for an appointment request
 */
export function getAppointmentWhatsAppUrl(
  details: AppointmentDetails,
  phoneNumber?: string
): string {
  const formattedMessage = formatAppointmentWhatsAppMessage(details);
  return getWhatsAppUrl(formattedMessage, phoneNumber);
}
