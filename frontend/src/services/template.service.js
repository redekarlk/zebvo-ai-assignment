import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

const templateService = {
  getAllTemplates: async () => {
    return api.get(API_ENDPOINTS.TEMPLATES.LIST);
  },

  getTemplateById: async (id) => {
    return api.get(API_ENDPOINTS.TEMPLATES.GET(id));
  },

  getTemplateBySlug: async (slug) => {
    return api.get(API_ENDPOINTS.TEMPLATES.GET_BY_SLUG(slug));
  },
};

export default templateService;
