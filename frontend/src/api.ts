import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://saas-task-manager.vercel.app'
  : 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include tenant and auth headers
api.interceptors.request.use((config) => {
  const tenant = localStorage.getItem('tenant');
  const token = localStorage.getItem('token');

  if (tenant) {
    config.headers['x-tenant-id'] = tenant;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tenant');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
