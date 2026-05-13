import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

const projectService = {
  getProjects: async () => {
    return api.get(API_ENDPOINTS.PROJECTS.LIST);
  },

  getProject: async (id) => {
    return api.get(API_ENDPOINTS.PROJECTS.GET(id));
  },

  createProject: async (projectData) => {
    return api.post(API_ENDPOINTS.PROJECTS.CREATE, projectData);
  },

  updateProject: async (id, projectData) => {
    return api.put(API_ENDPOINTS.PROJECTS.UPDATE(id), projectData);
  },

  deleteProject: async (id) => {
    return api.delete(API_ENDPOINTS.PROJECTS.DELETE(id));
  },
};

export default projectService;
