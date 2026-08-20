import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db.js';
import { memoryStore } from './controllers/memoryStore.js';
import { Consultation } from './models/Consultation.js';
import { TailoringRequest } from './models/TailoringRequest.js';
import { Lead } from './models/Lead.js';

import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS — allow local dev origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploaded files
const uploadDir = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/tailoring-requests', requestRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/upload', uploadRoutes);

// Dashboard stats endpoint — aggregates real counts from DB or memoryStore
app.get('/api/stats', async (req, res) => {
  try {
    let totalLeads, newLeads, consultationsScheduled, activeRequests, completedOrders;

    try {
      // Try to get real counts from MongoDB
      totalLeads = await Lead.countDocuments({});
      newLeads = await Lead.countDocuments({ status: 'New' });
      consultationsScheduled = await Consultation.countDocuments({
        status: { $in: ['Confirmed', 'Pending'] }
      });
      activeRequests = await TailoringRequest.countDocuments({
        status: { $in: ['New', 'Pending', 'In Progress', 'Ready'] }
      });
      completedOrders = await TailoringRequest.countDocuments({ status: 'Completed' });
    } catch {
      // Fallback to in-memory counts
      totalLeads = memoryStore.leads.length;
      newLeads = memoryStore.leads.filter(l => l.status === 'New').length;
      consultationsScheduled = memoryStore.consultations.filter(
        c => c.status === 'Confirmed' || c.status === 'Pending'
      ).length;
      activeRequests = memoryStore.tailoringRequests.filter(
        r => ['New', 'Pending', 'In Progress', 'Ready'].includes(r.status)
      ).length;
      completedOrders = memoryStore.tailoringRequests.filter(r => r.status === 'Completed').length;
    }

    // Service demand breakdown from leads
    const serviceBreakdown = {};
    try {
      const allLeads = await Lead.find({}, 'service');
      allLeads.forEach(l => {
        const key = l.service?.split(' ')[0] || 'Other';
        serviceBreakdown[key] = (serviceBreakdown[key] || 0) + 1;
      });
    } catch {
      memoryStore.leads.forEach(l => {
        const key = l.service?.split(' ')[0] || 'Other';
        serviceBreakdown[key] = (serviceBreakdown[key] || 0) + 1;
      });
    }

    res.json({
      totalLeads,
      newLeads,
      consultationsScheduled,
      activeRequests,
      completedOrders,
      serviceBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'FANTACY KING API', timestamp: new Date() });
});

// Start Server
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`FANTACY KING Backend Server running on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const FALLBACK_PORT = 5005;
      app.listen(FALLBACK_PORT, () => {
        console.log(`Port ${PORT} in use. Backend running on http://localhost:${FALLBACK_PORT}`);
      });
    } else {
      console.error(err);
    }
  });
});
