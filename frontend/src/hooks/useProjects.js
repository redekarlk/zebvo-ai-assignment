import { useEffect, useState } from 'react';
import projectService from '@/services/project.service';
import projectStore from '@/store/projectStore';

export default function useProjects() {
  const { projects, setProjects, isLoading, setLoading } = projectStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getProjects();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [setProjects, setLoading]);

  return { projects, isLoading, error };
}
