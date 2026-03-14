import { create } from 'zustand';
import api from '@/lib/api';

const useAuthStore = create((set) => ({
  user: null,
  token: null,

  login: async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, token: data.token });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  },

  signup: async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, token: data.token });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  loadUser: () => {
    try {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (user && token) {
        set({ user: JSON.parse(user), token });
      }
    } catch {
      set({ user: null, token: null });
    }
  },
}));

export default useAuthStore;
