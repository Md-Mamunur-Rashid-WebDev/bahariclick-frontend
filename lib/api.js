// This creates a configured Axios instance.
// Every API call in our app uses this instead of raw fetch/axios.
// It automatically:
// 1. Sets the base URL (so we write /products instead of http://localhost:5000/api/products)
// 2. Attaches the JWT token to every request automatically

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Request interceptor: runs before every API call
// It reads the token from localStorage and adds it to the header
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: runs after every API response
// If we get a 401 (unauthorized), clear auth and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;