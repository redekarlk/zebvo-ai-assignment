import { create } from 'zustand';
import projectService from '@/services/project.service';

import api from '@/lib/api';
import { normalizeDesignTheme } from '@/lib/designSystem';

export const useEditorStore = create((set, get) => ({
  project: null,
  selectedSection: null,
  isSaving: false,
  isDeploying: false,
  error: null,
  previewMode: 'desktop',
  hasUnsavedChanges: false,

  setProject: (project) => set({ project }),
  setPreviewMode: (mode) => set({ previewMode: mode }),
  setUnsavedChanges: (value) => set({ hasUnsavedChanges: value }),

  selectSection: (sectionId) => {
    const project = get().project;
    if (!project) return;
    
    if (sectionId === 'page') {
      set({ selectedSection: { id: 'page', type: 'page' } });
      return;
    }

    const section = project.sections.find((s) => s.id === sectionId);
    set({ selectedSection: section || null });
  },

  updateTheme: (theme) => {
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          theme: normalizeDesignTheme(theme)
        },
        hasUnsavedChanges: true
      };
    });
  },

  updateSection: (sectionId, updatedProps) => {
    set((state) => {
      if (!state.project) return state;

      const updatedSections = state.project.sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            props: {
              ...section.props,
              ...updatedProps,
            },
          };
        }
        return section;
      });

      const updatedProject = {
        ...state.project,
        sections: updatedSections,
      };

      const newSelectedSection = state.selectedSection?.id === sectionId
        ? updatedSections.find(s => s.id === sectionId)
        : state.selectedSection;

      return {
        project: updatedProject,
        selectedSection: newSelectedSection,
        hasUnsavedChanges: true
      };
    });
  },

  toggleSectionVisibility: (sectionId) => {
    set((state) => {
      if (!state.project) return state;

      const updatedSections = state.project.sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            visible: section.visible === false ? true : false,
          };
        }
        return section;
      });

      const updatedProject = {
        ...state.project,
        sections: updatedSections,
      };

      const newSelectedSection = state.selectedSection?.id === sectionId
        ? updatedSections.find(s => s.id === sectionId)
        : state.selectedSection;

      return {
        project: updatedProject,
        selectedSection: newSelectedSection,
        hasUnsavedChanges: true
      };
    });
  },

  regenerateSection: async (sectionId) => {
    const { project } = get();
    if (!project || !project._id) return;
    
    try {
      const response = await api.post('/ai/regenerate-section', {
        projectId: project._id,
        sectionId
      });
      
      const newSection = response.data?.data || response.data;
      
      set((state) => {
        const updatedSections = state.project.sections.map((s) => 
          s.id === sectionId ? newSection : s
        );
        
        return {
          project: {
            ...state.project,
            sections: updatedSections
          },
          selectedSection: newSection,
          // Since it's saved in DB by backend, maybe we don't need unsaved changes, but it doesn't hurt.
          hasUnsavedChanges: true 
        };
      });
      return newSection;
    } catch (error) {
      console.error('Failed to regenerate section:', error);
      throw error;
    }
  },

  regenerateImage: async (imageType = 'hero', serviceIndex) => {
    const { project } = get();
    if (!project || !project._id) return;
    
    try {
      const response = await api.post('/ai/generate-image', {
        projectId: project._id,
        imageType,
        serviceIndex
      });
      
      const payload = response?.data ?? response;
      const newImage = payload?.data ?? payload;

      // Normalize backend response: it may return a data URL string or an object { url, ... }
      const normalizedImage = typeof newImage === 'string' ? { url: newImage } : newImage;

      set((state) => {
        const updatedImages = { ...(state.project.images || {}) };

        if (imageType === 'service') {
          updatedImages.services = Array.isArray(updatedImages.services) ? [...updatedImages.services] : [];
          updatedImages.services[serviceIndex] = normalizedImage;
        } else {
          updatedImages[imageType] = normalizedImage;
        }

        return {
          project: {
            ...state.project,
            images: updatedImages
          },
          hasUnsavedChanges: true 
        };
      });
      return newImage;
    } catch (error) {
      console.error('Failed to regenerate image:', error);
      throw error;
    }
  },

  updateProjectField: (field, value) => {
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          [field]: value
        },
        hasUnsavedChanges: true
      };
    });
  },

  updateBusinessField: (field, value) => {
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          businessInfo: {
            ...state.project.businessInfo,
            [field]: value
          }
        },
        hasUnsavedChanges: true
      };
    });
  },

  updateContactField: (field, value) => {
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          businessInfo: {
            ...state.project.businessInfo,
            contactInfo: {
              ...state.project.businessInfo.contactInfo,
              [field]: value
            }
          }
        },
        hasUnsavedChanges: true
      };
    });
  },

  // Click-to-edit methods for content-driven architecture
  updateSectionContent: (sectionId, path, value) => {
    set((state) => {
      if (!state.project) return state;

      const updatedSections = state.project.sections.map((section) => {
        if (section.id === sectionId) {
          // Navigate the path and update the value
          const keys = path.split('.');
          let obj = { ...section };
          let current = obj;

          // Navigate to the parent of the target field
          for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (current[key] && typeof current[key] === 'object') {
              current[key] = Array.isArray(current[key]) 
                ? [...current[key]] 
                : { ...current[key] };
              current = current[key];
            }
          }

          // Set the final value
          current[keys[keys.length - 1]] = value;
          return obj;
        }
        return section;
      });

      return {
        project: {
          ...state.project,
          sections: updatedSections,
        },
        hasUnsavedChanges: true
      };
    });
  },

  reorderSections: (sectionId, newIndex) => {
    set((state) => {
      if (!state.project) return state;

      const { sections } = state.project;
      const currentIndex = sections.findIndex(s => s.id === sectionId);
      
      if (currentIndex === -1 || newIndex < 0 || newIndex >= sections.length) {
        return state;
      }

      const newSections = [...sections];
      const [movedSection] = newSections.splice(currentIndex, 1);
      newSections.splice(newIndex, 0, movedSection);

      return {
        project: {
          ...state.project,
          sections: newSections,
        },
        hasUnsavedChanges: true
      };
    });
  },

  duplicateSection: (sectionId) => {
    set((state) => {
      if (!state.project) return state;

      const section = state.project.sections.find(s => s.id === sectionId);
      if (!section) return state;

      // Create a deep copy with a new ID
      const newSection = {
        ...section,
        id: `${section.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        props: { ...section.props }
      };

      // Handle nested props (like items array in services/faq)
      if (section.props?.items && Array.isArray(section.props.items)) {
        newSection.props.items = section.props.items.map(item => ({ ...item }));
      }

      const newSections = [...state.project.sections, newSection];

      return {
        project: {
          ...state.project,
          sections: newSections,
        },
        selectedSection: newSection,
        hasUnsavedChanges: true
      };
    });
  },

  deleteSection: (sectionId) => {
    set((state) => {
      if (!state.project) return state;

      const newSections = state.project.sections.filter(s => s.id !== sectionId);
      
      // Update selectedSection if we deleted the selected one
      const newSelectedSection = state.selectedSection?.id === sectionId 
        ? null 
        : state.selectedSection;

      return {
        project: {
          ...state.project,
          sections: newSections,
        },
        selectedSection: newSelectedSection,
        hasUnsavedChanges: true
      };
    });
  },

  addSection: (type, variant = 'default', props = {}) => {
    set((state) => {
      if (!state.project) return state;

      const newSection = {
        id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        variant,
        order: state.project.sections.length,
        props: props || {}
      };

      const newSections = [...state.project.sections, newSection];

      return {
        project: {
          ...state.project,
          sections: newSections,
        },
        selectedSection: newSection,
        hasUnsavedChanges: true
      };
    });
  },

  saveProject: async () => {
    const { project } = get();
    if (!project || !project._id) return;

    set({ isSaving: true, error: null });
    try {
      await projectService.updateProject(project._id, project);
      set({ hasUnsavedChanges: false });
    } catch (err) {
      console.error('Failed to save project:', err);
      set({ error: 'Failed to save project changes' });
    } finally {
      set({ isSaving: false });
    }
  },

  deployProject: async () => {
    const { project } = get();
    if (!project || !project._id) return;

    // First, save any unsaved changes
    if (get().hasUnsavedChanges) {
      await get().saveProject();
    }

    set({ isDeploying: true, error: null });
    try {
      const response = await api.post(`/projects/${project._id}/deploy`);
      const deploymentData = response.data?.data || response.data;
      
      set((state) => ({
        project: {
          ...state.project,
          deployment: deploymentData,
          status: 'published'
        }
      }));
      
      return deploymentData;
    } catch (err) {
      console.error('Deployment failed:', err);
      set({ error: err.response?.data?.message || 'Deployment failed' });
      throw err;
    } finally {
      set({ isDeploying: false });
    }
  },
}));
