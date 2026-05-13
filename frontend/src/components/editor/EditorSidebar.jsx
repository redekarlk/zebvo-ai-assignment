import React from 'react';
import { useEditorStore } from '@/store/editorStore';

const EditorSidebar = () => {
  const project = useEditorStore((state) => state.project);
  const selectedSection = useEditorStore((state) => state.selectedSection);
  const selectSection = useEditorStore((state) => state.selectSection);

  if (!project) return null;

  return (
    <div className="flex flex-col h-full bg-[#111111] text-white">
      {/* Tabs */}
      <div className="flex items-center p-2 gap-1 border-b border-[#222]">
        <button className="flex-1 bg-[#2A2A2A] text-white text-[11px] font-medium py-1.5 rounded text-center">
          Pages
        </button>
        <button className="flex-1 text-[#888] hover:text-white text-[11px] font-medium py-1.5 rounded text-center transition-colors">
          Layers
        </button>
        <button className="flex-1 text-[#888] hover:text-white text-[11px] font-medium py-1.5 rounded text-center transition-colors">
          Assets
        </button>
      </div>

      <div className="p-3">
        <div className="relative">
          <svg className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-[#1A1A1A] text-white placeholder-[#666] text-[11px] rounded pl-8 pr-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent border border-transparent focus:border-accent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-2">
        {/* Design Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-white hover:bg-[#1A1A1A] rounded cursor-pointer">
            Design
            <svg className="w-3 h-3 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>

        {/* Pages Section */}
        <div>
          <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-white hover:bg-[#1A1A1A] rounded cursor-pointer mb-1">
            Pages
            <svg className="w-3 h-3 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          
          <div className="space-y-0.5">
            <button 
              onClick={() => selectSection('page')}
              className={`w-full flex items-center gap-2 px-2 py-1 rounded-sm text-[11px] font-medium transition-colors ${
                selectedSection?.id === 'page' ? 'bg-[#2A2A2A] text-white' : 'text-[#888] hover:bg-[#1A1A1A] hover:text-white'
              }`}
            >
              <svg className={`w-3.5 h-3.5 ${selectedSection?.id === 'page' ? 'text-white' : 'text-current'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Home
            </button>
            
            {project.sections?.map((section) => (
              <button
                key={section.id}
                onClick={() => selectSection(section.id)}
                className={`w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  selectedSection?.id === section.id ? 'bg-[#2A2A2A] text-white' : 'text-[#888] hover:bg-[#1A1A1A] hover:text-white'
                }`}
              >
                <span className="text-[#666]">/</span>
                <span className="capitalize">{section.type}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorSidebar;
