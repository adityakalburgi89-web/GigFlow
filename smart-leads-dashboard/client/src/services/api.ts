import axios from 'axios';
import type {
  ApiResponse,
  AuthResponse,
  Lead,
  LeadFilters,
  CreateLeadPayload,
  UpdateLeadPayload,
  PaginationMeta,
} from '../types';

const VITE_API_URL = import.meta.env.VITE_API_URL;

// Only enforce the strict check in production
if (import.meta.env.PROD && !VITE_API_URL) {
  throw new Error('VITE_API_URL environment variable is missing. Check your .env file or build arguments.');
}

const api = axios.create({
  baseURL: VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const auth = {
  register(data: { name: string; email: string; password: string }) {
    return api.post<ApiResponse<AuthResponse>>('/auth/register', data);
  },
  login(data: { email: string; password: string }) {
    return api.post<ApiResponse<AuthResponse>>('/auth/login', data);
  },
  simpleResetPassword(data: { email: string; newPassword: string }) {
    return api.post<ApiResponse<null>>('/auth/reset-password', data);
  },
};

export const leads = {
  getAll(params: LeadFilters = {}) {
    return api.get<ApiResponse<Lead[]> & { pagination: PaginationMeta }>('/leads', { params });
  },
  create(data: CreateLeadPayload) {
    return api.post<ApiResponse<Lead>>('/leads', data);
  },
  update(id: string, data: UpdateLeadPayload) {
    return api.put<ApiResponse<Lead>>(`/leads/${id}`, data);
  },
  delete(id: string) {
    return api.delete<ApiResponse<null>>(`/leads/${id}`);
  },
  exportCSV(params: Partial<LeadFilters> = {}) {
    return api.get<string>('/leads/export', { params, responseType: 'blob' }).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    });
  },
};
