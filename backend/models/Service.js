import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true }, // Bespoke, Suit, Alterations, Bridal, Doorstep, Styling
    gender: { type: String, enum: ["Men", "Women", "Unisex"], default: "Unisex" },
    description: { type: String, required: true },
    price: { type: String, default: 'Custom Quote' },
    active: { type: Boolean, default: true },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
