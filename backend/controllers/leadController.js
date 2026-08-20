import { Lead } from '../models/Lead.js';
import { memoryStore } from './memoryStore.js';

export const getLeads = async (req, res) => {
  try {
    const { search, status, service } = req.query;
    let leads = [];
    try {
      let query = {};
      if (status && status !== 'All') query.status = status;
      if (service && service !== 'All') query.service = service;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { leadId: { $regex: search, $options: 'i' } },
        ];
      }
      leads = await Lead.find(query).sort({ createdAt: -1 });
    } catch {
      leads = memoryStore.leads;
    }

    if (!leads || leads.length === 0) {
      leads = memoryStore.leads;
    }

    // Apply memory filtering if using fallback
    if (status && status !== 'All') {
      leads = leads.filter((l) => l.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      leads = leads.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.leadId.toLowerCase().includes(q)
      );
    }

    res.json(leads);
  } catch (error) {
    res.json(memoryStore.leads);
  }
};

export const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    let lead = null;
    try {
      lead = await Lead.findById(id);
    } catch {
      lead = memoryStore.leads.find((l) => l.id === id || l.leadId === id || l._id === id);
    }

    if (!lead) {
      lead = memoryStore.leads.find((l) => l.id === id || l.leadId === id || l._id === id);
    }

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, followUpDate } = req.body;

    let lead = memoryStore.leads.find((l) => l.id === id || l.leadId === id);
    try {
      const dbLead = await Lead.findById(id);
      if (dbLead) {
        if (status) dbLead.status = status;
        if (assignedTo) dbLead.assignedTo = assignedTo;
        if (followUpDate !== undefined) dbLead.followUpDate = followUpDate;
        await dbLead.save();
        return res.json(dbLead);
      }
    } catch {
      // fallback
    }

    if (lead) {
      if (status) lead.status = status;
      if (assignedTo) lead.assignedTo = assignedTo;
      if (followUpDate !== undefined) lead.followUpDate = followUpDate;
      return res.json(lead);
    }

    res.status(404).json({ message: 'Lead not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addLeadNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Note text is required' });
    }

    const author = req.user ? req.user.name : 'S. Taylor';
    const newNote = { text, author, createdAt: new Date().toISOString() };

    let lead = memoryStore.leads.find((l) => l.id === id || l.leadId === id);
    try {
      const dbLead = await Lead.findById(id);
      if (dbLead) {
        dbLead.notes.push(newNote);
        await dbLead.save();
        return res.json(dbLead);
      }
    } catch {
      // fallback
    }

    if (lead) {
      lead.notes.unshift(newNote);
      return res.json(lead);
    }

    res.status(404).json({ message: 'Lead not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
