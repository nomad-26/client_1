export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin' | 'tailor';
  membership?: string;
  avatar?: string;
  measurements?: {
    chest?: string;
    waist?: string;
    shoulder?: string;
    sleeveLength?: string;
    jacketLength?: string;
    trouserWaist?: string;
    inseam?: string;
  };
}

export interface Service {
  id: string;
  name: string;
  category: string;
  gender: 'Men' | 'Women' | 'Unisex';
  description: string;
  price: string;
  active: boolean;
  image: string;
}

export interface Consultation {
  id: string;
  customerId: string;
  customerName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  location: string;
  requirements: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  referenceId: string;
  createdAt: string;
}

export interface TailoringRequest {
  id: string;
  referenceId: string;
  customerId: string;
  customerName: string;
  name?: string;
  email: string;
  phone: string;
  category: string;
  gender: 'Men' | 'Women' | 'Unisex';
  garmentType: string;
  requirements: string;
  measurements?: Record<string, string>;
  referenceImages?: string[];
  status: 'New' | 'Pending' | 'Confirmed' | 'In Progress' | 'Ready' | 'Completed' | 'Cancelled';
  assignedTailor?: string;
  quotation?: string;
  expectedCompletionDate?: string;
  notes?: Array<{
    text: string;
    author: string;
    createdAt: string;
  }>;
  createdAt: string;
}

export interface Lead {
  id: string;
  leadId: string;
  customerId?: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  requirements?: string;
  source?: string;
  status: 'New' | 'Contacted' | 'Consultation Scheduled' | 'Quote Sent' | 'Confirmed' | 'In Progress' | 'Completed' | 'Archived';
  assignedTo?: string;
  followUpDate?: string;
  inspirationPhotos?: string[];
  notes?: Array<{
    text: string;
    author: string;
    createdAt: string;
  }>;
  createdAt: string;
}
