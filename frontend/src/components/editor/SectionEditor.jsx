import React from 'react';
import { useEditorStore } from '@/store/editorStore';
import SectionToolbar from './SectionToolbar';
import RegenerateImageButton from './RegenerateImageButton';

const SectionEditor = () => {
  const project = useEditorStore((state) => state.project);
  const section = useEditorStore((state) => state.selectedSection);
  const updateSection = useEditorStore((state) => state.updateSection);
  const isSaving = useEditorStore((state) => state.isSaving);
  const saveProject = useEditorStore((state) => state.saveProject);
  const selectSection = useEditorStore((state) => state.selectSection);

  if (!section) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/10 p-12 text-center bg-[#0D0D0D]">
        <div className="w-16 h-16 rounded-sm bg-white/5 flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3">Studio Editor</h3>
        <p className="text-xs text-white/20 leading-relaxed max-w-[200px] mx-auto">Select a section to customize.</p>
      </div>
    );
  }

  const { type } = section;
  const props = section.props || section; 

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateSection(section.id, { [name]: value });
  };

  const handleArrayChange = (index, field, value, arrayName) => {
    const currentArray = props[arrayName] || [];
    const newItems = [...currentArray];
    newItems[index] = { ...newItems[index], [field]: value };
    updateSection(section.id, { [arrayName]: newItems });
  };

  const renderField = (label, name, value, isTextArea = false) => (
    <div className="mb-8 last:mb-0">
      <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">
        {label}
      </label>
      {isTextArea ? (
        <textarea
          name={name}
          value={value || ''}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 bg-[#141414] border border-[#222] rounded-sm focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm transition-all resize-none no-scrollbar"
          placeholder={`Enter ${label}...`}
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value || ''}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#141414] border border-[#222] rounded-sm focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm transition-all"
          placeholder={`Enter ${label}...`}
        />
      )}
    </div>
  );

  const listKey = props.faqItems ? 'faqItems' : props.questions ? 'questions' : props.serviceItems ? 'serviceItems' : props.items ? 'items' : props.reviews ? 'reviews' : props.testimonials ? 'testimonials' : null;
  const itemFields = type === 'faq' || type === 'questions' ? [{name:'question', label:'Question'}, {name:'answer', label:'Answer', isTextArea:true}] :
                     type === 'testimonials' || type === 'reviews' ? [{name:'name', label:'Author Name'}, {name:'quote', label:'Testimonial Quote', isTextArea:true}] :
                     [{name:'title', label:'Item Title'}, {name:'description', label:'Description Content', isTextArea:true}];

  return (
    <div data-section-editor="true" className="flex flex-col h-full bg-[#0D0D0D] text-white">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/5 bg-[#0D0D0D] flex items-center justify-between sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Editing</span>
          </div>
          <h2 className="text-sm font-black text-white tracking-tight uppercase leading-none">{type}</h2>
        </div>
        <button 
          onClick={() => selectSection(null)}
          className="p-1.5 hover:bg-white/5 rounded-sm transition-colors text-white/20 hover:text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 no-scrollbar space-y-10">
        <section>
          {renderField('Headline', 'headline', props.headline || props.title)}
          {renderField('Description', 'subheadline', props.subheadline || props.description || props.subtitle || props.content, true)}
          {(props.ctaText || props.buttonText) && renderField('Call to Action', props.ctaText ? 'ctaText' : 'buttonText', props.ctaText || props.buttonText)}
        </section>

        {listKey && (
          <section className="space-y-4">
            <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Content Items</h4>
            {props[listKey].map((item, index) => (
              <div key={index} className="p-5 bg-[#141414] rounded-sm border border-white/5 group/item hover:border-blue-500/30 transition-all">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] font-black text-white/20 uppercase">Item {index + 1}</span>
                </div>
                {itemFields.map(f => (
                  <div key={f.name} className="mb-4 last:mb-0">
                    <label className="block text-[8px] font-black text-white/10 uppercase tracking-widest mb-2">{f.label}</label>
                    {f.isTextArea ? (
                      <textarea
                        value={item[f.name] || ''}
                        onChange={(e) => handleArrayChange(index, f.name, e.target.value, listKey)}
                        className="w-full p-3 bg-[#0D0D0D] border border-white/5 rounded-sm text-xs text-white/80 focus:border-blue-500/30 outline-none resize-none transition-all"
                        rows={3}
                      />
                    ) : (
                      <input
                        type="text"
                        value={item[f.name] || ''}
                        onChange={(e) => handleArrayChange(index, f.name, e.target.value, listKey)}
                        className="w-full p-3 bg-[#0D0D0D] border border-white/5 rounded-sm text-xs text-white/80 focus:border-blue-500/30 outline-none transition-all"
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </section>
        )}

        <section className="pt-8 border-t border-white/5">
          <RegenerateImageButton imageType={type === 'features' ? 'service' : type} label={`Regenerate Visuals`} />
        </section>
      </div>

      {/* Footer */}
      <div className="p-6 bg-[#0D0D0D] border-t border-white/5 z-20">
        <button 
          onClick={saveProject}
          disabled={isSaving}
          className="w-full relative group overflow-hidden bg-blue-600 px-6 py-4 rounded-sm transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] text-white group-hover:text-black transition-colors flex items-center justify-center gap-2">
            {isSaving ? 'Syncing...' : 'Save All Changes'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default SectionEditor;
