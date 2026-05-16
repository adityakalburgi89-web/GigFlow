export const LeadStatus = {
  New: 'New',
  Contacted: 'Contacted',
  Qualified: 'Qualified',
  Lost: 'Lost',
} as const;

export type LeadStatus = (typeof LeadStatus)[keyof typeof LeadStatus];

export const LeadSource = {
  Website: 'Website',
  Instagram: 'Instagram',
  Referral: 'Referral',
} as const;

export type LeadSource = (typeof LeadSource)[keyof typeof LeadSource];

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales_user';
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  createdBy: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: PaginationMeta;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LeadFilters {
  status?: string;
  source?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'latest' | 'oldest';
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  source: LeadSource;
  status?: LeadStatus;
}

export interface UpdateLeadPayload {
  name?: string;
  email?: string;
  source?: LeadSource;
  status?: LeadStatus;
}
