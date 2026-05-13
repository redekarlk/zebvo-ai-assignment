'use client';

import { useEffect, useState } from 'react';
import TemplateCard from './TemplateCard';
import Loader from '@/components/common/Loader';
import templateService from '@/services/template.service';

export default function TemplateGallery({ onSelectTemplate, selectedTemplateId }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredCategory, setFilteredCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All Templates' },
    { value: 'agency', label: 'Agency' },
    { value: 'ecommerce', label: 'E-Commerce' },
    { value: 'saas', label: 'SaaS' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'service', label: 'Service' },
    { value: 'blog', label: 'Blog' },
  ];

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await templateService.getAllTemplates();
        setTemplates(response.data || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const filteredTemplates = 
    filteredCategory === 'all'
      ? templates
      : templates.filter(t => t.category === filteredCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>Error loading templates: {error}</p>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No templates available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8b8b8b]">Filter by Category</h3>
          <p className="mt-1 text-[13px] text-[#9a9a9a]">
            Browse {filteredTemplates.length} of {templates.length} templates.
          </p>
        </div>
        {selectedTemplateId && (
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Template selected
          </div>
        )}
      </div>

      <div className="rounded-sm border border-white/10 bg-white/5 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setFilteredCategory(cat.value)}
              className={`
                rounded-sm px-4 py-2 text-sm font-medium transition-all duration-200
                ${filteredCategory === cat.value
                  ? 'bg-white text-[#0d0d0d] shadow-md shadow-black/25 ring-1 ring-white/40'
                  : 'bg-white/5 text-[#c7c7c7] ring-1 ring-white/8 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredTemplates.map(template => (
          <TemplateCard
            key={template._id}
            template={template}
            onSelect={onSelectTemplate}
            isSelected={selectedTemplateId === template._id}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="rounded-sm border border-dashed border-white/10 bg-[#141415] py-10 text-center">
          <p className="text-sm text-[#9a9a9a]">No templates found in this category</p>
        </div>
      )}
    </div>
  );
}
