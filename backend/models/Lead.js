import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    leadId: { type: String, required: true, unique: true },
    customerId: { type: String, default: '' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    service: { type: String, required: true },
    requirements: { type: String, default: '' },
    source: { type: String, default: 'Direct Website Inquiry' },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Consultation Scheduled', 'Quote Sent', 'Confirmed', 'In Progress', 'Completed', 'Archived'],
      default: 'New',
    },
    assignedTo: { type: String, default: 'Unassigned' },
    followUpDate: { type: String, default: '' },
    inspirationPhotos: [{ type: String }],
    notes: [
      {
        text: String,
        author: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
