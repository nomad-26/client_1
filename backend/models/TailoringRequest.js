import mongoose from 'mongoose';

const tailoringRequestSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    category: { type: String, required: true }, // Bespoke, Alteration, Custom, Bridal
    gender: { type: String, enum: ['Men', 'Women', 'Unisex'], default: 'Men' },
    garmentType: { type: String, required: true }, // Suit, Blazer, Dress, Trousers, etc.
    requirements: { type: String, required: true },
    measurements: { type: Object, default: {} },
    referenceImages: [{ type: String }],
    status: {
      type: String,
      enum: ['New', 'Pending', 'Confirmed', 'In Progress', 'Ready', 'Completed', 'Cancelled'],
      default: 'New',
    },
    assignedTailor: { type: String, default: 'Unassigned' },
    quotation: { type: String, default: 'Pending Review' },
    expectedCompletionDate: { type: String, default: '' },
    notes: [
      {
        text: String,
        author: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    referenceId: { type: String, required: true },
  },
  { timestamps: true }
);

export const TailoringRequest = mongoose.models.TailoringRequest || mongoose.model('TailoringRequest', tailoringRequestSchema);
