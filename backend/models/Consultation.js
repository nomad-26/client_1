import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, default: 'London Flagship Atelier' },
    requirements: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
    referenceId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const Consultation = mongoose.models.Consultation || mongoose.model('Consultation', consultationSchema);
