import { Service } from '../models/Service.js';
import { memoryStore } from './memoryStore.js';

export const getServices = async (req, res) => {
  try {
    let services = [];
    try {
      services = await Service.find({ active: true });
    } catch {
      services = memoryStore.services;
    }
    if (!services || services.length === 0) {
      services = memoryStore.services;
    }
    res.json(services);
  } catch (error) {
    res.json(memoryStore.services);
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    let service = null;
    try {
      service = await Service.findById(id);
    } catch {
      service = memoryStore.services.find((s) => s.id === id);
    }
    if (!service) {
      service = memoryStore.services.find((s) => s.id === id) || memoryStore.services[0];
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
