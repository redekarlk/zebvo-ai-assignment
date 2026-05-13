"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import WebsiteRenderer from '@/components/preview/WebsiteRenderer';
import projectService from '@/services/project.service';

import ProtectedRoute from '@/components/common/ProtectedRoute';

const PreviewPage = () => {
  const params = useParams();
  const { id } = params || {};
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        // Ensure you have getProject implemented in project.service.js
        const response = await projectService.getProject(id);
        
        // Handle axios response structure or direct object
        const projectData = response.data?.data || response.data || response;
        
        setProject(projectData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch project preview:", err);
        setError("Failed to load the website preview. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Generating your live preview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Preview Error</h2>
        <p className="text-gray-600 max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 text-xl">Project not found.</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <main className="w-full min-h-screen">
        <WebsiteRenderer project={project} />
      </main>
    </ProtectedRoute>
  );
};

export default PreviewPage;
