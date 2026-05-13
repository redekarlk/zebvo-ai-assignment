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
    <div>
      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setFilteredCategory(cat.value)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${filteredCategory === cat.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="text-center py-8">
          <p className="text-gray-500">No templates found in this category</p>
        </div>
      )}
    </div>
  );
}
