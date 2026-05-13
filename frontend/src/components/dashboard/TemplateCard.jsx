'use client';

import Button from '@/components/common/Button';
import Image from 'next/image';

export default function TemplateCard({ template, onSelect, isSelected }) {
  // Get category color
  const categoryColors = {
    agency: 'bg-blue-100 text-blue-800',
    ecommerce: 'bg-pink-100 text-pink-800',
    saas: 'bg-emerald-100 text-emerald-800',
    portfolio: 'bg-amber-100 text-amber-800',
    service: 'bg-purple-100 text-purple-800',
    blog: 'bg-indigo-100 text-indigo-800',
    consulting: 'bg-cyan-100 text-cyan-800',
    nonprofit: 'bg-green-100 text-green-800',
  };

  return (
    <div
      className={`
        relative rounded-lg overflow-hidden border-2 transition-all duration-300
        ${isSelected ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200 hover:border-gray-300'}
      `}
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gray-100">
        {template.thumbnail ? (
          <Image
            src={template.thumbnail}
            alt={template.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <div className="text-center">
              <div className="text-4xl mb-2">📱</div>
              <p className="text-sm text-gray-600">{template.name}</p>
            </div>
          </div>
        )}

        {/* Popular Badge */}
        {template.isPopular && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
            ⭐ Popular
          </div>
        )}

        {/* Selected Badge */}
        {isSelected && (
          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              ✓ Selected
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-800">{template.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>

        {/* Category Tag */}
        <div className="mb-3">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[template.category]}`}>
            {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
          </span>
        </div>

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
            {template.tags.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                +{template.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Sections Preview */}
        {template.sections && template.sections.length > 0 && (
          <div className="mb-3 text-xs text-gray-500">
            <p>Includes: {template.sections.map(s => s.type).join(', ')}</p>
          </div>
        )}

        {/* Select Button */}
        <Button
          onClick={() => onSelect(template._id || template.id)}
          variant={isSelected ? 'primary' : 'secondary'}
          className="w-full text-sm"
        >
          {isSelected ? '✓ Selected' : 'Select Template'}
        </Button>
      </div>
    </div>
  );
}
