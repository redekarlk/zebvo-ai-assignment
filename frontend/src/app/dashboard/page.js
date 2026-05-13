"use client";

import React, { useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import ProjectGrid from '@/components/dashboard/ProjectGrid';
import Sidebar from '@/components/dashboard/Sidebar';
import ProtectedRoute from '@/components/common/ProtectedRoute';

const DashboardPage = () => {
  const { projects, isLoading, error, fetchProjects, deleteProject } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#111111] flex w-full overflow-hidden">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar">
          <ProjectGrid 
            projects={projects} 
            isLoading={isLoading} 
            error={error} 
            onDelete={deleteProject} 
          />
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
