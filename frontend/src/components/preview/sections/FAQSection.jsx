import React, { useState, useContext } from 'react';
import { EditModeContext } from '@/context/EditModeContext';

const FAQSection = ({ 
  headline,
  title,
  subheadline,
  faqItems = [],
  questions = [],
  items = [], 
  variant = 'accordion', 
  theme,
  // Edit mode props
  editable = false,
  sectionId = null,
  isSelected = false,
}) => {
  const displayHeadline = headline || title;
  const displayItems = questions.length > 0 ? questions : faqItems.length > 0 ? faqItems : items;
  const { setSelectedSection } = useContext(EditModeContext);
  const isInteractiveElement = (target) => !!target?.closest?.('button, a, input, textarea, select, option, [role="button"]');
  
  const [openIndex, setOpenIndex] = useState(null);

  const handleFieldClick = (e) => {
    if (isInteractiveElement(e.target)) return;
    if (editable && sectionId && setSelectedSection) {
      e.stopPropagation();
      setSelectedSection(sectionId);
    }
  };

  const primaryColor = theme?.colors?.primary || '#3b82f6';
  const radius = theme?.layout?.radius || '12px';

  return (
    <section className="py-24 px-6 bg-white border-b border-gray-100" onClick={handleFieldClick}>
      <div className="max-w-4xl mx-auto">
        {displayHeadline && (
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900">
              {displayHeadline}
            </h2>
            {subheadline && <p className="text-xl text-gray-500 max-w-2xl mx-auto">{subheadline}</p>}
          </div>
        )}
        
        <div className="space-y-4">
          {displayItems.map((item, index) => {
            const isOpen = openIndex === index;
            const q = item.question || item.title;
            const a = item.answer || item.description || item.content;

            return (
              <div 
                key={index}
                className={`group border transition-all duration-300 ${isOpen ? 'border-blue-600 shadow-xl shadow-blue-600/5' : 'border-gray-100 hover:border-gray-200'}`}
                style={{ borderRadius: radius }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenIndex(isOpen ? null : index);
                  }}
                  className="w-full p-6 text-left flex items-center justify-between gap-6"
                >
                  <span className={`text-xl font-bold tracking-tight transition-colors ${isOpen ? 'text-blue-600' : 'text-gray-900'}`}>
                    {q}
                  </span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-6 pb-8 text-lg text-gray-600 leading-relaxed border-t border-gray-50 pt-6">
                    {a}
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

export default FAQSection;
