import React, { useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { useToast } from '@/components/common/ToastProvider';

const RegenerateSectionButton = ({ sectionId }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const regenerateSection = useEditorStore((state) => state.regenerateSection);
  const toast = useToast();

  const handleRegenerate = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    const toastId = toast.loading('Regenerating section content using AI...');
    
    try {
      await regenerateSection(sectionId);
      toast.dismiss(toastId);
      toast.success('Section regenerated successfully!');
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Failed to regenerate section. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleRegenerate}
      disabled={isGenerating}
      className="px-2 py-1 text-[9px] font-bold bg-accent text-white hover:bg-[#0088EE] rounded-sm transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
      title="Regenerate this section using AI"
    >
      {isGenerating ? (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )}
      Regenerate
    </button>
  );
};

export default RegenerateSectionButton;
