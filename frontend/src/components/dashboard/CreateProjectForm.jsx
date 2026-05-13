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
        templateId: selectedTemplateId // Include selected template
      };
      
      onSubmit(formattedData);
    }
  };

  if (showTemplates) {
    return (
      <div className="bg-[#111111] rounded-sm border border-[#222] p-8">
        <div className="mb-8 border-b border-[#222] pb-6">
          <h2 className="text-lg font-bold text-white mb-2">Choose Your Template</h2>
          <p className="text-[#888] text-[13px]">Start with a pre-designed template and customize it with your business information.</p>
        </div>

        <TemplateGallery
          onSelectTemplate={handleSelectTemplate}
          selectedTemplateId={selectedTemplateId}
        />

        <div className="mt-8 pt-6 border-t border-[#222] flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowTemplates(false)}
            className="text-[#0099FF] hover:text-[#0088EE] font-bold text-[13px] transition-colors"
          >
            Skip & Start with Blank
          </button>
          <button
            type="button"
            disabled={!selectedTemplateId}
            onClick={handleProceedToForm}
            className="px-6 py-2.5 bg-[#0099FF] hover:bg-[#0088EE] text-white font-bold rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[13px]"
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

        <div className="pt-6 mt-6 border-t border-[#222]">
          <h3 className="text-sm font-bold text-white mb-4">Contact Information (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="(555) 123-4567" className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="hello@example.com" className={inputClasses} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>Physical Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St, City, State" className={inputClasses} />
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
