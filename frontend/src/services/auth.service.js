import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

const authService = {
  login: async (credentials) => {
    return api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },

  signup: async (userData) => {
    return api.post(API_ENDPOINTS.AUTH.SIGNUP, userData);
  },

  logout: async () => {
    return api.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  getMe: async () => {
    return api.get(API_ENDPOINTS.AUTH.ME);
  },
};

export default authService;
