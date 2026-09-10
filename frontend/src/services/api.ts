import axios from 'axios';
import {
  AuthResponse,
  Course,
  Teacher,
  ClassItem,
  Student,
  Registration,
  ScheduleItem,
  PaymentItem,
  ResultItem,
  DashboardSummary,
} from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: (data: { usernameOrEmail: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
  getProfile: () => api.get<AuthResponse>('/auth/me'),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/auth/change-password', data),
};

// Courses API
export const coursesApi = {
  getAll: (params?: { search?: string; language?: string; level?: string; status?: string; sort?: string }) =>
    api.get<Course[]>('/courses', { params }),
  getById: (id: number) => api.get<Course>(`/courses/${id}`),
  create: (data: Partial<Course>) => api.post<Course>('/courses', data),
  update: (id: number, data: Partial<Course>) => api.put(`/courses/${id}`, data),
  delete: (id: number) => api.delete(`/courses/${id}`),
};

// Teachers API
export const teachersApi = {
  getAll: (params?: { search?: string; language?: string; status?: string }) =>
    api.get<Teacher[]>('/teachers', { params }),
  getById: (id: number) => api.get<Teacher>(`/teachers/${id}`),
  create: (data: Partial<Teacher>) => api.post<Teacher>('/teachers', data),
  update: (id: number, data: Partial<Teacher>) => api.put(`/teachers/${id}`, data),
  delete: (id: number) => api.delete(`/teachers/${id}`),
};

// Classes API
export const classesApi = {
  getAll: (params?: { search?: string; courseId?: number; teacherId?: number; status?: string }) =>
    api.get<ClassItem[]>('/classes', { params }),
  getById: (id: number) => api.get<ClassItem>(`/classes/${id}`),
  getClassStudents: (id: number) => api.get<Student[]>(`/classes/${id}/students`),
  create: (data: Partial<ClassItem>) => api.post<ClassItem>('/classes', data),
  update: (id: number, data: Partial<ClassItem>) => api.put(`/classes/${id}`, data),
  delete: (id: number) => api.delete(`/classes/${id}`),
};

// Students API
export const studentsApi = {
  getAll: (params?: { search?: string; classId?: number; courseId?: number; status?: string; page?: number; pageSize?: number }) =>
    api.get<{ items: Student[]; totalItems: number; totalPages: number; currentPage: number; pageSize: number }>('/students', { params }),
  getById: (id: number) => api.get<Student>(`/students/${id}`),
  create: (data: Partial<Student>) => api.post<Student>('/students', data),
  update: (id: number, data: Partial<Student>) => api.put(`/students/${id}`, data),
  delete: (id: number) => api.delete(`/students/${id}`),
};

// Registrations API
export const registrationsApi = {
  submitPublic: (data: { fullName: string; phone: string; email: string; courseId: number; notes?: string }) =>
    api.post('/registrations', data),
  getAllAdmin: (params?: { search?: string; courseId?: number; status?: string }) =>
    api.get<Registration[]>('/registrations', { params }),
  updateStatus: (id: number, status: string) =>
    api.put(`/registrations/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/registrations/${id}`),
};

// Schedules API
export const schedulesApi = {
  getAll: (params?: { classId?: number; startDate?: string; endDate?: string }) =>
    api.get<ScheduleItem[]>('/schedules', { params }),
  create: (data: Partial<ScheduleItem>) => api.post<ScheduleItem>('/schedules', data),
  update: (id: number, data: Partial<ScheduleItem>) => api.put(`/schedules/${id}`, data),
  delete: (id: number) => api.delete(`/schedules/${id}`),
};

// Payments API
export const paymentsApi = {
  getAll: (params?: { search?: string; studentId?: number; courseId?: number }) =>
    api.get<PaymentItem[]>('/payments', { params }),
  create: (data: Partial<PaymentItem>) => api.post('/payments', data),
  delete: (id: number) => api.delete(`/payments/${id}`),
};

// Results API
export const resultsApi = {
  getAll: (params?: { search?: string; classId?: number; studentId?: number }) =>
    api.get<ResultItem[]>('/results', { params }),
  saveResult: (data: { studentId: number; classId: number; quizScore: number; midtermScore: number; finalScore: number; comments?: string }) =>
    api.post('/results', data),
};

// Dashboard API
export const dashboardApi = {
  getSummary: () => api.get<DashboardSummary>('/dashboard'),
};

// Export API
export const exportApi = {
  exportStudents: () => api.get('/export/students', { responseType: 'blob' }),
  exportPayments: () => api.get('/export/payments', { responseType: 'blob' }),
};

export default api;
