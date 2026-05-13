import { create } from 'zustand';
import projectService from '@/services/project.service';

export const useProjectStore = create((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectService.getProjects();
      const projectsData = response.data?.data || response.data || [];
      set({ projects: Array.isArray(projectsData) ? projectsData : [], isLoading: false });
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      set({ error: 'Failed to load projects', isLoading: false });
    }
  },

  createProject: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectService.createProject(data);
      const newProject = response.data?.data || response.data;
      
      set((state) => ({
        projects: [newProject, ...state.projects],
        isLoading: false
      }));
      
      return newProject;
    } catch (err) {
      console.error('Failed to create project:', err);
      set({ error: 'Failed to create project', isLoading: false });
      throw err;
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await projectService.deleteProject(id);
      
      set((state) => ({
        projects: state.projects.filter(p => (p._id || p.id) !== id),
        isLoading: false
      }));
    } catch (err) {
      console.error('Failed to delete project:', err);
      set({ error: 'Failed to delete project', isLoading: false });
      throw err;
    }
  }
}));
