import React, { useContext } from 'react';
import { EditModeContext } from '@/context/EditModeContext';

const TestimonialsSection = ({ 
  headline,
  title,
  testimonials = [],
  reviews = [],
  items = [],
  variant = 'grid', 
  theme,
  // Edit mode props
  editable = false,
  sectionId = null,
  isSelected = false,
}) => {
  const { setSelectedSection } = useContext(EditModeContext);
  const displayHeadline = headline || title;
  const displayItems = reviews.length > 0 ? reviews : testimonials.length > 0 ? testimonials : items;
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

  return (
    <section className="py-24 px-6 bg-[#F8F9FA]" onClick={handleFieldClick}>
      <div className="max-w-7xl mx-auto">
        {displayHeadline && (
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900">
              {displayHeadline}
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayItems.map((item, index) => {
            const quote = item.quote || item.text || item.content;
            const author = item.author || item.name || 'Anonymous';
            const role = item.role || item.title || 'Verified Customer';

            return (
              <div 
                key={index} 
                className="relative p-12 bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group"
                style={{ borderRadius: radius }}
              >
                <div className="absolute top-8 right-12 text-8xl font-serif text-blue-600/5 select-none pointer-events-none group-hover:text-blue-600/10 transition-colors">
                  &rdquo;
                </div>
                
                <div className="relative z-10">
                  <p className="text-xl italic leading-relaxed text-gray-700 mb-10">
                    &ldquo;{quote}&rdquo;
                  </p>
                  
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black text-white shadow-lg" style={{ backgroundColor: primaryColor }}>
                      {author[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg leading-none mb-1">
                        {author}
                      </h4>
                      <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">
                        {role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
