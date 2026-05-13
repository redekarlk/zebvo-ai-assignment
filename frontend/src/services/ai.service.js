import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

const aiService = {
  generateSection: async (prompt) => {
    return api.post(API_ENDPOINTS.AI.GENERATE, { prompt });
  },

  improveContent: async (content, instruction) => {
    return api.post(API_ENDPOINTS.AI.IMPROVE, { content, instruction });
  },

  generateWebsite: async (projectId, userInstructions = '') => {
    return api.post('/ai/generate-website', { projectId, userInstructions });
  },

  chat: async (messages, businessInfo) => {
    return api.post('/ai/chat', { messages, businessInfo });
  },
};

export default aiService;
