import { z } from "zod";

// Phone number regex helper (supports international and local formats)
const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const phoneValidation = z.string().min(10, "Phone number must be at least 10 digits").regex(phoneRegex, "Invalid phone number format");

export const LeadSourceEnum = z.enum([
  "WEBSITE",
  "WHATSAPP",
  "PHONE",
  "INSTAGRAM",
  "GOOGLE",
  "REFERRAL",
  "OTHER"
]);

export const LeadStatusEnum = z.enum([
  "NEW",
  "CONTACTED",
  "CONSULTATION_SCHEDULED",
  "QUOTE_SENT",
  "WORK_CONFIRMED",
  "WORK_IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "NOT_INTERESTED"
]);

export const AppointmentTypeEnum = z.enum([
  "CONSULTATION",
  "MEASUREMENT",
  "FITTING",
  "PICKUP",
  "DELIVERY"
]);

export const AppointmentStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED"
]);

export const OrderStatusEnum = z.enum([
  "CONFIRMED",
  "IN_PROGRESS",
  "FITTING",
  "READY",
  "DELIVERED",
  "CANCELLED"
]);

export const ReviewStatusEnum = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED"
]);

// Public Lead / Enquiry Form validation schema
export const EnquiryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobile_number: phoneValidation,
  whatsapp_number: z.string().optional().or(z.literal("")),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  service_id: z.string().uuid("Please select a valid service").optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters"),
  preferred_date: z.string().optional().or(z.literal("")),
  preferred_time: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  is_doorstep: z.boolean().default(false),
  source: LeadSourceEnum.default("WEBSITE")
});

// Admin Lead Update schema
export const LeadUpdateSchema = EnquiryFormSchema.extend({
  status: LeadStatusEnum,
  follow_up_date: z.string().optional().or(z.literal("")),
  admin_notes: z.string().optional().or(z.literal(""))
});

// Appointment creation/update validation schema
export const AppointmentFormSchema = z.object({
  customer_id: z.string().uuid("Invalid customer ID").optional().or(z.literal("")),
  lead_id: z.string().uuid("Invalid lead ID").optional().or(z.literal("")),
  type: AppointmentTypeEnum,
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  status: AppointmentStatusEnum.default("PENDING"),
  notes: z.string().optional().or(z.literal("")),
  approved_by: z.string().uuid().optional().or(z.literal(""))
});

// Public Review Submission schema
export const ReviewSubmitSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  rating: z.number().int().min(1).max(5),
  review_text: z.string().min(10, "Review must be at least 10 characters"),
  customer_photo_url: z.string().url("Invalid image URL").optional().or(z.literal("")),
  garment_photo_url: z.string().url("Invalid image URL").optional().or(z.literal("")),
  consent_to_publish: z.boolean().refine(v => v === true, {
    message: "Consent to publish is required to submit a review"
  })
});

// Admin review moderation schema
export const ReviewModerationSchema = z.object({
  status: ReviewStatusEnum
});

// Admin Order creation/update validation schema
export const OrderFormSchema = z.object({
  order_number: z.string().min(3, "Order number is required"),
  customer_id: z.string().uuid("Valid customer selection required"),
  service_id: z.string().uuid("Valid service selection required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  status: OrderStatusEnum.default("CONFIRMED"),
  estimated_amount: z.number().min(0, "Amount must be positive"),
  final_amount: z.number().min(0, "Amount must be positive").optional(),
  expected_delivery_date: z.string().min(1, "Expected delivery date is required"),
  notes: z.string().optional().or(z.literal(""))
});

// Admin Service creation/update validation schema
export const ServiceFormSchema = z.object({
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  name: z.string().min(3, "Service name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  features: z.array(z.string()).min(1, "Provide at least one feature"),
  image_url: z.string().url("Invalid image URL").optional().or(z.literal("")),
  is_active: z.boolean().default(true),
  display_order: z.number().int().default(0),
  seo_title: z.string().min(5, "SEO Title should be descriptive").optional().or(z.literal("")),
  seo_description: z.string().min(10, "SEO Description should be descriptive").optional().or(z.literal(""))
});

// Admin Portfolio item schema
export const PortfolioItemFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(2, "Category is required"),
  tags: z.array(z.string()).default([]),
  before_image_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  after_image_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  is_published: z.boolean().default(false),
  display_order: z.number().int().default(0),
  seo_title: z.string().optional().or(z.literal("")),
  seo_description: z.string().optional().or(z.literal(""))
});

// Admin Blog Post schema
export const BlogPostFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  featured_image_url: z.string().url("Invalid image URL").optional().or(z.literal("")),
  is_published: z.boolean().default(false),
  seo_title: z.string().optional().or(z.literal("")),
  seo_description: z.string().optional().or(z.literal(""))
});

// Admin FAQ schema
export const FaqFormSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  answer: z.string().min(10, "Answer must be at least 10 characters"),
  is_active: z.boolean().default(true),
  display_order: z.number().int().default(0)
});
