import { Consultation } from '../models/Consultation.js';
import { memoryStore } from './memoryStore.js';

const generateReferenceId = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `TS-${year}-${randomNum}`;
};

export const createConsultation = async (req, res) => {
  try {
    const { customerName, email, phone, service, date, time, location, requirements } = req.body;
    if (!customerName || !email || !date || !time) {
      return res.status(400).json({ message: 'Customer name, email, date, and time are required' });
    }

    const referenceId = generateReferenceId();
    const customerId = req.user ? req.user.id : `guest_${Date.now()}`;

    let newConsultation = null;
    try {
      newConsultation = await Consultation.create({
        customerId,
        customerName,
        email,
        phone: phone || '',
        service: service || 'General Consultation',
        date,
        time,
        location: location || 'London Flagship Atelier',
        requirements: requirements || '',
        status: 'Pending',
        referenceId,
      });
    } catch {
      newConsultation = {
        id: `c_${Date.now()}`,
        customerId,
        customerName,
        email,
        phone: phone || '',
        service: service || 'General Consultation',
        date,
        time,
        location: location || 'London Flagship Atelier',
        requirements: requirements || '',
        status: 'Pending',
        referenceId,
        createdAt: new Date().toISOString(),
      };
      memoryStore.consultations.unshift(newConsultation);

      // Also auto-generate a lead for admin overview!
      memoryStore.leads.unshift({
        id: `ld_${Date.now()}`,
        leadId: `${Math.floor(100 + Math.random() * 900)}`,
        customerId,
        name: customerName,
        phone: phone || '',
        email,
        service: service || 'General Consultation',
        requirements: requirements || 'Consultation request from website',
        source: 'Website Booking',
        status: 'New',
        assignedTo: 'Unassigned',
        followUpDate: date,
        inspirationPhotos: [],
        notes: [],
        createdAt: new Date().toISOString(),
      });
    }

    res.status(201).json({
      message: 'Consultation booked successfully',
      consultation: newConsultation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConsultations = async (req, res) => {
  try {
    let consultations = [];
    let dbAvailable = false;
    try {
      if (req.user && req.user.role === 'customer') {
        consultations = await Consultation.find({ customerId: req.user.id });
      } else {
        consultations = await Consultation.find({});
      }
      dbAvailable = true;
    } catch {
      // DB unavailable — use memory store
    }

    if (!dbAvailable) {
      if (req.user && req.user.role === 'customer') {
        consultations = memoryStore.consultations.filter(
          (c) => c.customerId === req.user.id || c.email === req.user.email
        );
      } else {
        consultations = memoryStore.consultations;
      }
    }

    res.json(consultations);
  } catch (error) {
    res.json([]);
  }
};

export const getConsultationById = async (req, res) => {
  try {
    const { id } = req.params;
    let consultation = null;
    try {
      consultation = await Consultation.findById(id);
    } catch {
      consultation = memoryStore.consultations.find((c) => c.id === id || c.referenceId === id);
    }

    if (!consultation) {
      consultation = memoryStore.consultations.find((c) => c.id === id || c.referenceId === id);
    }

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    res.json(consultation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateConsultationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    let consultation = memoryStore.consultations.find((c) => c.id === id || c.referenceId === id);
    try {
      const dbItem = await Consultation.findById(id);
      if (dbItem) {
        dbItem.status = status;
        await dbItem.save();
        return res.json(dbItem);
      }
    } catch {
      // fallback
    }

    if (consultation) {
      consultation.status = status;
      return res.json(consultation);
    }

    res.status(404).json({ message: 'Consultation not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
