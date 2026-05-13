import React, { useContext } from 'react';
import { EditModeContext } from '@/context/EditModeContext';

const AboutSection = ({ 
  headline,
  title, 
  content,
  description, 
  ctaText,
  buttonText,
  imageUrl, 
  variant = 'split', 
  theme,
  // Edit mode props
  editable = false,
  sectionId = null,
  editableFields = [],
  isSelected = false,
}) => {
  const displayHeadline = headline || title;
  const displayCta = ctaText || buttonText;
  const rawContent = content || description;
  const displayContent = Array.isArray(rawContent) 
    ? rawContent 
    : (typeof rawContent === 'string' ? rawContent.split('\n\n') : []);

  const { setSelectedSection } = useContext(EditModeContext);
  
  const handleFieldClick = (e) => {
    if (editable && sectionId && setSelectedSection) {
      e.stopPropagation();
      setSelectedSection(sectionId);
    }
  };
  const surfaceClass = theme?.layout?.radius === 'full' ? 'rounded-3xl' : theme?.layout?.radius === 'lg' ? 'rounded-2xl' : 'rounded-xl';
  const background = theme?.colors?.surface || '#0f0f0f';
  const buttonStyle = {
    backgroundColor: 'var(--theme-primary)',
    color: '#ffffff',
  };

  const variantConfig = {
    split: {
      grid: 'grid-cols-1 lg:grid-cols-2 gap-16',
      imageOrder: 'order-1 lg:order-2',
      textOrder: 'order-2 lg:order-1',
      imageSize: 'aspect-4/3',
      textSize: 'max-w-2xl'
    },
    reversed: {
      grid: 'grid-cols-1 lg:grid-cols-2 gap-16',
      imageOrder: 'order-1 lg:order-1',
      textOrder: 'order-2 lg:order-2',
      imageSize: 'aspect-4/3',
      textSize: 'max-w-2xl'
    },
    fullwidth: {
      grid: 'grid-cols-1 gap-16',
      imageOrder: 'order-1',
      textOrder: 'order-2',
      imageSize: 'aspect-video w-full',
      textSize: 'max-w-6xl mx-auto text-center'
    },
    imagebg: {
      grid: 'grid-cols-1 gap-0',
      imageOrder: 'absolute inset-0',
      textOrder: 'relative z-10',
      imageSize: 'h-screen',
      textSize: 'max-w-4xl'
    },
    minimal: {
      grid: 'grid-cols-1 lg:grid-cols-3 gap-12',
      imageOrder: 'col-span-1 lg:col-span-1',
      textOrder: 'col-span-1 lg:col-span-2 flex flex-col justify-center',
      imageSize: 'aspect-square',
      textSize: 'space-y-6'
    }
  };

  const config = variantConfig[variant] || variantConfig.split;

  if (variant === 'imagebg') {
    return (
      <section 
        className="relative py-32 px-6 overflow-hidden flex items-center min-h-screen"
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 z-0" />
        <div className="max-w-7xl mx-auto container relative z-10">
          <div className={config.textSize}>
            {displayHeadline && (
              <h2 
                className={`text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight text-white ${
                  editable ? 'cursor-pointer transition-all hover:opacity-70' : ''
                }`}
                style={
                  editable && isSelected ? { 
                    textDecoration: 'underline',
                    textDecorationColor: '#3b82f6',
                    textDecorationThickness: '2px',
                  } : {}
                }
                onClick={handleFieldClick}
              >
                {displayHeadline}
                {editable && isSelected && <span className="text-blue-400 ml-2">✏️</span>}
              </h2>
            )}
            {displayContent.length > 0 && (
              <div 
                className={`text-lg md:text-2xl leading-relaxed font-medium text-white/90 space-y-4 ${
                  editable ? 'cursor-pointer transition-all hover:opacity-60' : ''
                }`}
                style={
                  editable && isSelected ? { 
                    textDecoration: 'underline',
                    textDecorationColor: '#3b82f6',
                    textDecorationThickness: '1px',
                  } : {}
                }
                onClick={handleFieldClick}
              >
                {displayContent.map((p, i) => <p key={i}>{p}</p>)}
                {editable && isSelected && <span className="text-blue-400 ml-2">✏️</span>}
              </div>
            )}
            {displayCta && (
              <button className={`mt-10 font-bold py-4 px-10 transition-all duration-300 uppercase tracking-widest text-sm ${surfaceClass}`} style={buttonStyle}>
                {displayCta}
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 overflow-hidden" style={{ backgroundColor: background, color: 'var(--theme-text-primary)' }}>
      <div className="max-w-7xl mx-auto container">
        <div className={`grid ${config.grid} items-center`}>
          <div className={config.textOrder}>
            {displayHeadline && (
              <h2 
                className={`text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tight ${
                  editable ? 'cursor-pointer transition-all hover:opacity-70' : ''
                }`}
                style={
                  editable && isSelected ? { 
                    textDecoration: 'underline',
                    textDecorationColor: '#3b82f6',
                    textDecorationThickness: '2px',
                  } : {}
                }
                onClick={handleFieldClick}
              >
                {displayHeadline}
                {editable && isSelected && <span className="text-blue-400 ml-2">✏️</span>}
              </h2>
            )}
            {displayContent.length > 0 && (
              <div 
                className={`text-lg md:text-xl leading-relaxed font-medium space-y-4 ${
                  editable ? 'cursor-pointer transition-all hover:opacity-60' : ''
                }`}
                style={{ 
                  color: 'var(--theme-text-secondary)',
                  ...(editable && isSelected ? { 
                    textDecoration: 'underline',
                    textDecorationColor: '#3b82f6',
                    textDecorationThickness: '1px',
                  } : {})
                }}
                onClick={handleFieldClick}
              >
                {displayContent.map((p, i) => <p key={i}>{p}</p>)}
                {editable && isSelected && <span className="text-blue-400 ml-2">✏️</span>}
              </div>
            )}
            {displayCta && (
              <button className={`mt-10 font-bold py-4 px-10 transition-all duration-300 uppercase tracking-widest text-sm ${surfaceClass}`} style={buttonStyle}>
                {displayCta}
              </button>
            )}
          </div>
          
          <div className={config.imageOrder}>
            <div className={`relative overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)] ${config.imageSize} transform hover:scale-[1.02] transition-transform duration-500 border border-white/5 ${surfaceClass}`}>
              <img 
                src={imageUrl} 
                alt={title || "About Us"} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
