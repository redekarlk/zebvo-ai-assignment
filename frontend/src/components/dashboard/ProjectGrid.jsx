import React from 'react';
import ProjectCard from './ProjectCard';
import Link from 'next/link';
import { DashboardSkeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';

const ProjectGrid = ({ projects, isLoading, error, onDelete }) => {
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Projects</h3>
        <p className="text-red-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-white tracking-tight">All</h1>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-[#222] hover:bg-[#333] px-3 py-1.5 rounded-lg text-sm text-white transition-colors border border-transparent hover:border-[#444]">
            Last viewed by me
            <svg className="w-4 h-4 text-[#888]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <Link 
            href="/project/new"
            className="bg-[#0099FF] hover:bg-[#0088EE] text-white text-sm font-semibold px-4 py-1.5 rounded-lg shadow-sm transition-colors"
          >
            New Project
          </Link>
        </div>
      </div>

      {(!projects || projects.length === 0) ? (
        <EmptyState
          title="No Projects Yet"
          description="You haven't created any websites yet. Start your first project to let AI generate a complete website for you in seconds."
          actionText="Create Your First Website"
          actionLink="/project/new"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project._id || project.id} 
              project={project} 
              onDelete={onDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectGrid;
