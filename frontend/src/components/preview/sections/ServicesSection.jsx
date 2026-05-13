import React, { useContext } from 'react';
import { EditModeContext } from '@/context/EditModeContext';

const ServicesSection = ({ 
  headline,
  title, 
  serviceItems = [],
  items = [], 
  logos = [],
  cards = [],
  steps = [],
  variant = 'cards', 
  theme,
  // Edit mode props
  editable = false,
  sectionId = null,
  isSelected = false,
}) => {
  const displayHeadline = headline || title;
  
  // Robustly determine the list to display
  const displayItems = logos.length > 0 ? logos : 
                       steps.length > 0 ? steps : 
                       cards.length > 0 ? cards : 
                       serviceItems.length > 0 ? serviceItems : 
                       items;

  const { setSelectedSection } = useContext(EditModeContext);
  
  const handleFieldClick = (e) => {
    if (editable && sectionId && setSelectedSection) {
      e.stopPropagation();
      setSelectedSection(sectionId);
    }
  };

  const isLogos = variant === 'logo-strip' || (logos.length > 0);
  const isSteps = variant.includes('steps') || (steps.length > 0);

  const radius = theme?.layout?.radius || '12px';
  const primaryColor = theme?.colors?.primary || '#3b82f6';
  const isInteractiveElement = (target) => !!target?.closest?.('button, a, input, textarea, select, option, [role="button"]');

  return (
    <section className="py-24 px-6 bg-[#F8F9FA] border-b border-gray-200" onClick={(e) => {
      if (isInteractiveElement(e.target)) return;
      handleFieldClick(e);
    }}>
      <div className="max-w-7xl mx-auto">
        {displayHeadline && (
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 leading-tight">
              {displayHeadline}
            </h2>
          </div>
        )}
        
        {isLogos ? (
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            {displayItems.map((logo, index) => (
              <div key={index} className="text-2xl font-black tracking-tighter text-gray-900 uppercase">
                {typeof logo === 'string' ? logo : (logo.title || logo.name)}
              </div>
            ))}
          </div>
        ) : isSteps ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            {displayItems.map((step, index) => (
              <div key={index} className="relative group">
                <div className="text-[120px] font-black text-blue-600/5 absolute -top-16 -left-4 pointer-events-none select-none">
                  {index + 1}
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                    {step.title || step.name || 'Step'}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {step.description || step.content || step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {displayItems.map((item, index) => (
              <div 
                key={index} 
                className="group p-10 bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-600/10 hover:border-blue-600/20 transition-all duration-500 transform hover:-translate-y-2"
                style={{ borderRadius: radius }}
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-blue-600/5 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {item.title || item.name || 'Feature'}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {item.description || item.content || item.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
