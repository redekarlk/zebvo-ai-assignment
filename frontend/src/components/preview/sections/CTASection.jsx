import React, { useContext } from 'react';
import { EditModeContext } from '@/context/EditModeContext';

const CTASection = ({ 
  headline, 
  title,
  subheadline,
  subtitle,
  ctaText,
  buttonText, 
  imageUrl, 
  variant = 'banner', 
  theme,
  // Edit mode props
  editable = false,
  sectionId = null,
  isSelected = false,
}) => {
  const displayHeadline = headline || title;
  const displaySubheadline = subheadline || subtitle;
  const displayCta = ctaText || buttonText;
  const { setSelectedSection } = useContext(EditModeContext);
  const isInteractiveElement = (target) => !!target?.closest?.('button, a, input, textarea, select, option, [role="button"]');
  
  const handleFieldClick = (e) => {
    if (isInteractiveElement(e.target)) return;
    if (editable && sectionId && setSelectedSection) {
      e.stopPropagation();
      setSelectedSection(sectionId);
    }
  };

  const primaryColor = theme?.colors?.primary || '#3b82f6';
  const radius = theme?.layout?.radius || '4px'; // Default to rounded-sm feel

  return (
    <section 
      className="relative py-24 px-6 overflow-hidden text-center min-h-[400px] flex items-center justify-center bg-[#111]"
      onClick={handleFieldClick}
    >
      {/* Background with Primary Color Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-90 transition-all duration-700"
        style={{ backgroundColor: primaryColor }}
      />
      
      {imageUrl && (
        <div className="absolute inset-0 z-1 opacity-40">
          <img src={imageUrl} alt="" className="w-full h-full object-cover grayscale" />
        </div>
      )}

      {/* Decorative Gradients */}
      <div className="absolute inset-0 z-2 bg-gradient-to-br from-black/20 via-transparent to-black/40 pointer-events-none" />

      <div className="container relative z-10 max-w-4xl mx-auto space-y-8">
        {displayHeadline && (
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-2xl">
            {displayHeadline}
          </h2>
        )}
        
        {displaySubheadline && (
          <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
            {displaySubheadline}
          </p>
        )}

        {displayCta && (
          <div className="pt-4">
            <button 
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-gray-900 font-black uppercase tracking-[0.2em] text-sm transition-all hover:-translate-y-1 hover:shadow-2xl"
              style={{ borderRadius: radius }}
            >
              {displayCta}
            </button>
          </div>
        )}
      </div>

      {/* Abstract Design Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/20 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
    </section>
  );
};

export default CTASection;
