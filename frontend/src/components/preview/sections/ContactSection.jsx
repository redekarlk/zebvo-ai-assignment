import React, { useContext } from 'react';
import { EditModeContext } from '@/context/EditModeContext';

const ContactSection = ({ 
  headline,
  title,
  subheadline,
  variant = 'split', 
  theme,
  // Edit mode props
  editable = false,
  sectionId = null,
  editableFields = [],
  isSelected = false,
}) => {
  const { setSelectedSection } = useContext(EditModeContext);
  const displayHeadline = headline || title || 'Get In Touch';
  
  const handleFieldClick = (e) => {
    if (editable && sectionId && setSelectedSection) {
      e.stopPropagation();
      setSelectedSection(sectionId);
    }
  };

  const radiusClass = theme?.layout?.radius === 'full' ? 'rounded-3xl' : theme?.layout?.radius === 'lg' ? 'rounded-2xl' : 'rounded-xl';

  return (
    <section className="py-24 px-6" style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-text-primary)' }}>
      <div className="max-w-7xl mx-auto container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight" style={{ color: 'var(--theme-secondary)' }}>
              {displayHeadline}
            </h2>
            <p className="text-lg md:text-xl opacity-70 mb-12 max-w-lg leading-relaxed">
              {subheadline || 'Have a question or want to work together? Send us a message and we will get back to you as soon as possible.'}
            </p>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--theme-primary)', opacity: 0.1, color: 'var(--theme-primary)' }}>📍</div>
                <div>
                  <h4 className="font-bold">Our Location</h4>
                  <p className="opacity-60">123 Business Avenue, Suite 100</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--theme-primary)', opacity: 0.1, color: 'var(--theme-primary)' }}>✉️</div>
                <div>
                  <h4 className="font-bold">Email Us</h4>
                  <p className="opacity-60">hello@business.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-10 shadow-2xl border border-white/5 ${radiusClass}`} style={{ backgroundColor: 'var(--theme-surface)' }}>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 opacity-60">First Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:border-primary outline-none transition-all" style={{ border: '1px solid var(--theme-border)' }} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 opacity-60">Last Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:border-primary outline-none transition-all" style={{ border: '1px solid var(--theme-border)' }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 opacity-60">Email Address</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:border-primary outline-none transition-all" style={{ border: '1px solid var(--theme-border)' }} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 opacity-60">Your Message</label>
                <textarea rows="4" className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:border-primary outline-none transition-all" style={{ border: '1px solid var(--theme-border)' }}></textarea>
              </div>
              <button className={`w-full py-5 font-black uppercase tracking-widest text-sm transition-all hover:scale-[1.02] active:scale-[0.98] ${radiusClass}`} style={{ backgroundColor: 'var(--theme-primary)', color: 'white' }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
