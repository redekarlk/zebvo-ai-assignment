import React, { useState, useEffect } from 'react';
import TemplateGallery from './TemplateGallery';

const CreateProjectForm = ({ onSubmit, isSubmitting }) => {
  const [showTemplates, setShowTemplates] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    category: '',
    services: '',
    targetAudience: '',
    projectPrompt: '',
    tone: 'professional',
    stylePreference: 'modern',
    fontFamily: 'Inter',
    headingFontFamily: 'Inter',
    phone: '',
    email: '',
    address: ''
  });
  
  const [errors, setErrors] = useState({});

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
  };

  const handleProceedToForm = () => {
    setShowTemplates(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Project Name is required';
    if (!formData.businessName.trim()) newErrors.businessName = 'Business Name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Convert comma-separated services into an array
      const formattedData = {
        name: formData.name,
        businessInfo: {
          businessName: formData.businessName,
          category: formData.category,
          services: formData.services.split(',').map(s => s.trim()).filter(Boolean),
          targetAudience: formData.targetAudience,
          tone: formData.tone,
          stylePreference: formData.stylePreference,
          typography: {
            fontFamily: formData.fontFamily,
            headingFontFamily: formData.headingFontFamily,
          },
          contactInfo: {
            phone: formData.phone,
            email: formData.email,
            address: formData.address
          }
        },
        userInstructions: formData.projectPrompt,
        templateId: selectedTemplateId // Include selected template
      };
      
      onSubmit(formattedData);
    }
  };

  if (showTemplates) {
    return (
      <div className="relative overflow-hidden rounded-sm border border-white/10 bg-[#111111] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-8">

        <div className="relative mb-8 border-b border-white/10 pb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9fd3ff]">
            Template Gallery
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">Choose Your Template</h2>
          <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[#9a9a9a] md:text-sm">
            Start with a pre-designed template and customize it with your business information.
          </p>
        </div>

        <div className="relative">
          <TemplateGallery
            onSelectTemplate={handleSelectTemplate}
            selectedTemplateId={selectedTemplateId}
          />
        </div>

        <div className="relative mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setShowTemplates(false)}
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-semibold text-[#cfe8ff] transition-all hover:border-[#0099FF]/40 hover:bg-[#0099FF]/10 hover:text-white"
          >
            Skip & Start with Blank
          </button>
          <button
            type="button"
            disabled={!selectedTemplateId}
            onClick={handleProceedToForm}
            className="inline-flex items-center justify-center rounded-sm bg-[#0099FF] px-5 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-[#0099FF]/25 transition-all hover:-translate-y-px hover:bg-[#0088ee] hover:shadow-[#0099FF]/35 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue with Selected Template
          </button>
        </div>
      </div>
    );
  }

  const inputClasses = "w-full px-3 py-2 bg-[#222] border border-transparent rounded-sm focus:ring-1 focus:ring-accent focus:border-accent focus:bg-[#222] text-white text-[13px] transition-colors placeholder-[#666]";
  const labelClasses = "block text-[11px] font-bold text-[#888] mb-1.5 uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="bg-[#111111] rounded-sm border border-[#222] p-8">
      <div className="mb-8 border-b border-[#222] pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white">Your Business Details</h2>
          <button
            type="button"
            onClick={() => setShowTemplates(true)}
            className="text-[#0099FF] hover:text-[#0088EE] text-[13px] font-medium transition-colors"
          >
            ← Change Template
          </button>
        </div>
        <p className="text-[#888] text-[13px]">Give your project a name and define the core business details.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>Project Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Acme Corp Redesign"
              className={`${inputClasses} ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>
          <div>
            <label className={labelClasses}>Business Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="e.g. Acme Corporation"
              className={`${inputClasses} ${errors.businessName ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.businessName && <p className="mt-1 text-sm text-red-500">{errors.businessName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>Category / Industry <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Tech Startup"
              className={`${inputClasses} ${errors.category ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
          </div>
          <div>
            <label className={labelClasses}>Target Audience</label>
            <input
              type="text"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              placeholder="e.g. Small businesses"
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label className={labelClasses}>Services / Products (comma separated)</label>
          <input
            type="text"
            name="services"
            value={formData.services}
            onChange={handleChange}
            placeholder="e.g. Consulting, Design, Development"
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Project Prompt</label>
          <textarea
            name="projectPrompt"
            value={formData.projectPrompt}
            onChange={handleChange}
            placeholder="Tell us what you want the site to emphasize, the style you want, and any sections or content to include."
            rows={4}
            className={`${inputClasses} resize-none`}
          />
        </div>

        <div>
          <label className={labelClasses}>Brand Tone</label>
          <div className="relative">
            <select
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              className={`${inputClasses} cursor-pointer appearance-none pr-8`}
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly & Approachable</option>
              <option value="modern">Modern & Innovative</option>
              <option value="luxurious">Luxurious & Premium</option>
              <option value="playful">Playful & Fun</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#666]">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClasses}>Visual Style</label>
            <div className="relative">
              <select
                name="stylePreference"
                value={formData.stylePreference}
                onChange={handleChange}
                className={`${inputClasses} cursor-pointer appearance-none pr-8`}
              >
                <option value="modern">Modern</option>
                <option value="minimal">Minimal</option>
                <option value="luxury">Luxury</option>
                <option value="bold">Bold</option>
                <option value="creative">Creative</option>
                <option value="corporate">Corporate</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#666]">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          <div>
            <label className={labelClasses}>Body Font</label>
            <div className="relative">
              <select
                name="fontFamily"
                value={formData.fontFamily}
                onChange={handleChange}
                className={`${inputClasses} cursor-pointer appearance-none pr-8`}
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
                <option value="Poppins">Poppins</option>
                <option value="Source Sans 3">Source Sans 3</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#666]">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          <div>
            <label className={labelClasses}>Heading Font</label>
            <div className="relative">
              <select
                name="headingFontFamily"
                value={formData.headingFontFamily}
                onChange={handleChange}
                className={`${inputClasses} cursor-pointer appearance-none pr-8`}
              >
                <option value="Inter">Inter</option>
                <option value="Roboto Slab">Roboto Slab</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Merriweather">Merriweather</option>
                <option value="Poppins">Poppins</option>
                <option value="Montserrat">Montserrat</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#666]">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-8 pt-6 border-t border-[#222] flex items-center justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#0099FF] hover:bg-[#0088EE] text-white font-bold rounded-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center text-[13px]"
        >
          {isSubmitting ? 'Creating & Generating...' : 'Generate Website'}
        </button>
      </div>
    </form>
  );
};

export default CreateProjectForm;
