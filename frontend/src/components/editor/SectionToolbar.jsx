import React from 'react';
import { useEditorStore } from '@/store/editorStore';
import RegenerateSectionButton from './RegenerateSectionButton';

const SectionToolbar = ({ section }) => {
  const toggleSectionVisibility = useEditorStore((state) => state.toggleSectionVisibility);

  if (!section) return null;

  const isVisible = section.visible !== false;

  return (
    <div className="flex items-center gap-1.5">
      <span className="px-2 py-1 bg-[#1A1A1A] text-[#888] text-[9px] font-bold rounded-sm uppercase tracking-wider border border-[#222]">
        {section.type}
      </span>
      
      <button
        onClick={() => toggleSectionVisibility(section.id)}
        className={`px-2 py-1 text-[9px] font-bold rounded-sm transition-colors border ${
          isVisible 
            ? 'bg-[#1A1A1A] text-white border-[#222] hover:bg-[#222]' 
            : 'bg-[#1A1A1A] text-accent border-accent/30 hover:bg-[#222]'
        }`}
      >
        {isVisible ? 'Visible' : 'Hidden'}
      </button>
      
      <RegenerateSectionButton sectionId={section.id} />
    </div>
  );
};

export default SectionToolbar;
