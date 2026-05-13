import { create } from 'zustand';
import authService from '@/services/auth.service';
import api from '@/lib/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initializeAuth: async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        set({ isLoading: false, isAuthenticated: false, user: null });
        return;
      }

      set({ token, isAuthenticated: true, isLoading: true });
      await get().fetchCurrentUser();
    } catch (error) {
      console.error('Auth initialization failed:', error);
      get().logout();
    }
  },

  fetchCurrentUser: async () => {
    try {
      const response = await authService.getMe();
      const user = response.data?.data || response.data || response;
      set({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      get().logout();
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.signup(data);
      const { user, token } = response.data?.data || response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        throw new Error('Token not received from server');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      set({ 
        error: error.response?.data?.message || error.message || 'Registration failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      const { user, token } = response.data?.data || response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        throw new Error('Token not received from server');
      }
    } catch (error) {
      console.error('Login failed:', error);
      set({ 
        error: error.response?.data?.message || error.message || 'Login failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: null });
  }
}));
