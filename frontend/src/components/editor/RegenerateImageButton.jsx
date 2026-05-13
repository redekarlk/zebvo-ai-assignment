import React, { useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { useToast } from '@/components/common/ToastProvider';

const RegenerateImageButton = ({ imageType = 'hero', serviceIndex, label = 'Regenerate Image' }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const regenerateImage = useEditorStore((state) => state.regenerateImage);
  const toast = useToast();

  const handleRegenerate = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    const toastId = toast.loading(`Regenerating ${imageType} image using AI...`);
    
    try {
      await regenerateImage(imageType, serviceIndex);
      toast.dismiss(toastId);
      toast.success('Image regenerated successfully!');
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Failed to regenerate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleRegenerate}
      disabled={isGenerating}
      className="px-2 py-1 text-[10px] font-bold bg-[#2A2A2A] text-white hover:bg-[#333] rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-[#444]"
      title={label}
    >
      {isGenerating ? (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )}
      {label}
    </button>
  );
};

export default RegenerateImageButton;
