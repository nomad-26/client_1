import { TailoringRequest } from '../models/TailoringRequest.js';
import { memoryStore } from './memoryStore.js';

const generateReqId = () => {
  return `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
};

export const createRequest = async (req, res) => {
  try {
    const { category, gender, garmentType, requirements, measurements, referenceImages, email, name, phone } = req.body;
    if (!category || !garmentType || !requirements) {
      return res.status(400).json({ message: 'Category, garment type, and requirements are required' });
    }

    const customerId = req.user ? req.user.id : `guest_${Date.now()}`;
    const customerName = req.user ? req.user.name : (name || 'Guest Client');
    const userEmail = req.user ? req.user.email : (email || 'guest@example.com');
    const referenceId = generateReqId();

    let newReq = null;
    try {
      newReq = await TailoringRequest.create({
        customerId,
        customerName,
        email: userEmail,
        phone: phone || '',
        category,
        gender: gender || 'Men',
        garmentType,
        requirements,
        measurements: measurements || {},
        referenceImages: referenceImages || [],
        status: 'New',
        referenceId,
      });
    } catch {
      newReq = {
        id: `tr_${Date.now()}`,
        referenceId,
        customerId,
        customerName,
        email: userEmail,
        phone: phone || '',
        category,
        gender: gender || 'Men',
        garmentType,
        requirements,
        measurements: measurements || {},
        referenceImages: referenceImages || [],
        status: 'New',
        assignedTailor: 'Unassigned',
        quotation: 'Pending Review',
        expectedCompletionDate: '',
        notes: [],
        createdAt: new Date().toISOString(),
      };
      memoryStore.tailoringRequests.unshift(newReq);

      // Auto add to leads pool for admin review
      memoryStore.leads.unshift({
        id: `ld_${Date.now()}`,
        leadId: `${Math.floor(100 + Math.random() * 900)}`,
        customerId,
        name: customerName,
        phone: phone || '+1 (555) 019-2834',
        email: userEmail,
        service: `${category} - ${garmentType}`,
        requirements,
        source: 'Custom Request Form',
        status: 'New',
        assignedTo: 'Unassigned',
        followUpDate: '',
        inspirationPhotos: referenceImages || [],
        notes: [],
        createdAt: new Date().toISOString(),
      });
    }

    res.status(201).json({
      message: 'Tailoring request submitted successfully',
      request: newReq,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    let requests = [];
    let dbAvailable = false;
    try {
      if (req.user && req.user.role === 'customer') {
        requests = await TailoringRequest.find({ customerId: req.user.id });
      } else {
        requests = await TailoringRequest.find({});
      }
      dbAvailable = true;
    } catch {
      // DB unavailable — use memory store
    }

    if (!dbAvailable) {
      if (req.user && req.user.role === 'customer') {
        // Strictly scope to the authenticated customer only
        requests = memoryStore.tailoringRequests.filter(
          (r) => r.customerId === req.user.id || r.email === req.user.email
        );
      } else {
        // Admin/tailor gets all
        requests = memoryStore.tailoringRequests;
      }
    }

    res.json(requests);
  } catch (error) {
    res.json([]);
  }
};

export const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    let request = null;
    try {
      request = await TailoringRequest.findById(id);
    } catch {
      request = memoryStore.tailoringRequests.find((r) => r.id === id || r.referenceId === id);
    }
    if (!request) {
      request = memoryStore.tailoringRequests.find((r) => r.id === id || r.referenceId === id);
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, quotation, assignedTailor, expectedCompletionDate, note } = req.body;

    let reqItem = memoryStore.tailoringRequests.find((r) => r.id === id || r.referenceId === id);
    try {
      const dbItem = await TailoringRequest.findById(id);
      if (dbItem) {
        if (status) dbItem.status = status;
        if (quotation) dbItem.quotation = quotation;
        if (assignedTailor) dbItem.assignedTailor = assignedTailor;
        if (expectedCompletionDate) dbItem.expectedCompletionDate = expectedCompletionDate;
        if (note) dbItem.notes.push({ text: note, author: req.user.name || 'Admin' });
        await dbItem.save();
        return res.json(dbItem);
      }
    } catch {
      // fallback to memoryStore
    }

    if (reqItem) {
      if (status) reqItem.status = status;
      if (quotation) reqItem.quotation = quotation;
      if (assignedTailor) reqItem.assignedTailor = assignedTailor;
      if (expectedCompletionDate) reqItem.expectedCompletionDate = expectedCompletionDate;
      if (note) reqItem.notes.push({ text: note, author: req.user?.name || 'Admin', createdAt: new Date().toISOString() });
      return res.json(reqItem);
    }

    res.status(404).json({ message: 'Request not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
