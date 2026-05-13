import api from '@/lib/api';

const exportService = {
  /**
   * Triggers a download of the specified export format
   */
  downloadExport: async (projectId, format) => {
    try {
      console.log(`[Export Service] Starting ${format} export for project: ${projectId}`);
      
      // Use the existing api instance which already has interceptors for auth
      const response = await api.get(`/exports/${projectId}/${format}`, {
        responseType: 'blob'
      });

      // The response from our axios interceptor is already response.data if successful,
      // but since we added responseType: 'blob', axios returns the blob directly.
      const blob = response instanceof Blob ? response : new Blob([response]);
      
      // Create a temporary link element to trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project-${projectId}.${format}`;
      
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
      return true;
    } catch (error) {
      console.error(`[Export Service] ${format} export failed:`, error);
      throw error;
    }
  },

  publishProject: async (projectId) => {
    return api.post(`/projects/${projectId}/publish`);
  },

  getPreviewHTML: async (project) => {
    if (!project) {
      throw new Error('Project is required to generate preview HTML');
    }

    return api.post('/exports/preview/html', { project });
  }
};

export default exportService;
