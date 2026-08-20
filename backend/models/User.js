import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: '' },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin', 'tailor'], default: 'customer' },
    membership: { type: String, default: 'Standard Member' },
    avatar: { type: String, default: '' },
    measurements: {
      chest: { type: String, default: '40.5"' },
      waist: { type: String, default: '34.0"' },
      shoulder: { type: String, default: '18.5"' },
      sleeveLength: { type: String, default: '25.0"' },
      jacketLength: { type: String, default: '30.0"' },
      trouserWaist: { type: String, default: '34.0"' },
      inseam: { type: String, default: '32.0"' },
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
