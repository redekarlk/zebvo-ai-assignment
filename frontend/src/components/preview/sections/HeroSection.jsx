import React, { useContext } from 'react';
import { EditModeContext } from '@/context/EditModeContext';

const HeroSection = ({ 
  headline,
  title,
  subheadline, 
  subtitle,
  ctaText,
  buttonText,
  imageUrl, 
  variant = 'centered', 
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

  const radius = theme?.layout?.radius || '12px';
  const primaryColor = theme?.colors?.primary || '#3b82f6';

  const isFullWidth = variant.includes('full-width') || variant === 'centered';

  return (
    <section 
      className={`relative flex items-center justify-center px-6 py-24 min-h-[90vh] overflow-hidden bg-[#0A0A0A]`}
      onClick={handleFieldClick}
    >
      {/* Background Layer */}
      {imageUrl && (
        <>
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <div className="absolute inset-0 z-1 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
        </>
      )}

      <div className={`container relative z-10 mx-auto text-center ${isFullWidth ? 'max-w-5xl' : 'max-w-4xl'}`}>
        <div className="space-y-8">
          {displayHeadline && (
            <h1 
              className={`text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] text-white ${
                editable ? 'cursor-pointer' : ''
              }`}
              style={{ fontFamily: theme?.typography?.headingFontFamily }}
            >
              {displayHeadline}
            </h1>
          )}
          
          {displaySubheadline && (
            <p 
              className={`text-lg md:text-2xl font-medium text-white/80 mx-auto max-w-3xl leading-relaxed ${
                editable ? 'cursor-pointer' : ''
              }`}
            >
              {displaySubheadline}
            </p>
          )}

          {displayCta && (
            <div className="pt-8">
              <button 
                className={`inline-flex items-center justify-center px-10 py-5 text-sm font-black uppercase tracking-[0.2em] transition-all hover:-translate-y-1 hover:shadow-2xl shadow-primary/20`}
                style={{ 
                  backgroundColor: primaryColor,
                  color: '#ffffff',
                  borderRadius: radius,
                  boxShadow: `0 10px 30px -10px ${primaryColor}44`
                }}
              >
                {displayCta}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
};

export default HeroSection;
