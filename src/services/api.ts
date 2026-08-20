import { User, Service, Consultation, TailoringRequest, Lead } from '../types';

const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('ts_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  consultationsScheduled: number;
  activeRequests: number;
  completedOrders: number;
  serviceBreakdown: Record<string, number>;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
    return res.json();
  },

  async register(data: { name: string; email: string; password: string; phone?: string; role?: string }): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Registration failed');
    }
    return res.json();
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/stats`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // Services
  async getServices(): Promise<Service[]> {
    const res = await fetch(`${API_BASE}/services`);
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  },

  // Consultations
  async createConsultation(data: Partial<Consultation>): Promise<{ message: string; consultation: Consultation }> {
    const res = await fetch(`${API_BASE}/consultations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Consultation booking failed');
    }
    return res.json();
  },

  async getConsultations(): Promise<Consultation[]> {
    const res = await fetch(`${API_BASE}/consultations`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch consultations');
    return res.json();
  },

  async updateConsultationStatus(id: string, status: string): Promise<Consultation> {
    const res = await fetch(`${API_BASE}/consultations/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update consultation status');
    return res.json();
  },

  // Tailoring Requests
  async createRequest(data: Partial<TailoringRequest>): Promise<{ message: string; request: TailoringRequest }> {
    const res = await fetch(`${API_BASE}/tailoring-requests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Request creation failed');
    }
    return res.json();
  },

  async getRequests(): Promise<TailoringRequest[]> {
    const res = await fetch(`${API_BASE}/tailoring-requests`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch requests');
    return res.json();
  },

  async getRequestById(id: string): Promise<TailoringRequest> {
    const res = await fetch(`${API_BASE}/tailoring-requests/${id}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch request details');
    return res.json();
  },

  async updateRequestStatus(id: string, updates: Partial<TailoringRequest> & { note?: string }): Promise<TailoringRequest> {
    const res = await fetch(`${API_BASE}/tailoring-requests/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update request');
    return res.json();
  },

  // Leads
  async getLeads(params?: { search?: string; status?: string; service?: string }): Promise<Lead[]> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/leads?${query}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch leads');
    return res.json();
  },

  async getLeadById(id: string): Promise<Lead> {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch lead');
    return res.json();
  },

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update lead');
    return res.json();
  },

  async addLeadNote(id: string, text: string): Promise<Lead> {
    const res = await fetch(`${API_BASE}/leads/${id}/notes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error('Failed to add note');
    return res.json();
  },

  // Image Upload
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('ts_token');

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload image');
    return res.json();
  },
};
