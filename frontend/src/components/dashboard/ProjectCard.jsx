import React from 'react';
import Link from 'next/link';

const ProjectCard = ({ project, onDelete }) => {
  const projectId = project._id || project.id;
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  const hasSections = project.sections && project.sections.length > 0;
  
  return (
    <div className="bg-[#1A1A1A] rounded-sm overflow-hidden hover:bg-[#222] transition-colors flex flex-col group border border-transparent hover:border-[#333] cursor-pointer shadow-lg relative">
      {/* Thumbnail Area */}
      <Link href={`/project/${projectId}`} className="block h-48 bg-[#1A1A1A] relative overflow-hidden p-4">
        {/* Fake UI preview */}
        <div className="w-full h-full bg-[#0A0A0A] rounded-sm border border-[#333] shadow-2xl overflow-hidden relative opacity-80 group-hover:opacity-100 transition-opacity">
           {hasSections ? (
             <div className="w-full h-full flex flex-col">
               <div className="h-4 bg-[#222] border-b border-[#333] flex items-center px-2">
                 <div className="flex gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                   <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                 </div>
               </div>
               <div className="flex-1 bg-[#111111] flex flex-col items-center justify-center p-2">
                 <div className="w-3/4 h-2 bg-white/20 rounded-full mb-1" />
                 <div className="w-1/2 h-1.5 bg-white/10 rounded-full" />
               </div>
             </div>
           ) : (
             <div className="w-full h-full flex items-center justify-center">
               <div className="w-6 h-6 border-2 border-[#333] border-t-accent rounded-full animate-spin" />
             </div>
           )}
        </div>
      </Link>
      
      {/* Footer Area */}
      <div className="p-3 flex items-start justify-between">
        <div className="flex flex-col overflow-hidden">
          <Link href={`/project/${projectId}`} className="text-[13px] font-semibold text-white truncate hover:text-accent transition-colors">
            {project.name || 'Untitled Project'}
          </Link>
          <span className="text-[11px] text-[#888] mt-0.5">
            Viewed {formatDate(project.updatedAt || project.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-[#2A2A2A] text-[#888] border border-[#333]">
            FREE
          </span>
          <button 
            onClick={(e) => {
              e.preventDefault();
              if (window.confirm('Delete project?')) onDelete(projectId);
            }}
            className="text-[#666] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete Project"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
