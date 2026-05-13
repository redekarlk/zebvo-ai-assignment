'use client';

import Button from '@/components/common/Button';
import Image from 'next/image';

export default function TemplateCard({ template, onSelect, isSelected }) {
  // Get category color
  const categoryColors = {
    agency: 'border-blue-400/25 bg-blue-400/10 text-blue-100',
    ecommerce: 'border-pink-400/25 bg-pink-400/10 text-pink-100',
    saas: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-100',
    portfolio: 'border-amber-400/25 bg-amber-400/10 text-amber-100',
    service: 'border-purple-400/25 bg-purple-400/10 text-purple-100',
    blog: 'border-indigo-400/25 bg-indigo-400/10 text-indigo-100',
    consulting: 'border-cyan-400/25 bg-cyan-400/10 text-cyan-100',
    nonprofit: 'border-green-400/25 bg-green-400/10 text-green-100',
  };

  const sectionCount = template.sections?.length || 0;
  const primaryTag = template.tags?.[0] || 'Template';

  return (
    <div
      className={`
        group relative overflow-hidden rounded-sm border bg-[#0f0f10] transition-all duration-300
        ${isSelected
          ? 'border-[#0099FF]/70 shadow-[0_20px_60px_rgba(0,153,255,0.18)] ring-1 ring-[#0099FF]/40'
          : 'border-white/10 shadow-[0_18px_50px_rgba(0,0,0,0.22)] hover:-translate-y-1 hover:border-white/20'
        }
      `}
    >
      <div className="relative aspect-4/3 overflow-hidden bg-[#171717]">
        {template.thumbnail ? (
          <Image
            src={template.thumbnail}
            alt={template.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#151517]">
            <div className="rounded-sm border border-white/10 bg-[#1c1c1f] px-4 py-3 text-center text-white/80 backdrop-blur-sm">
              <div className="mb-2 text-3xl">◌</div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Preview unavailable</p>
            </div>
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/75">
          <span className="rounded-sm bg-black/35 px-2.5 py-1 backdrop-blur-sm">{sectionCount} sections</span>
          <span className="rounded-sm bg-black/35 px-2.5 py-1 backdrop-blur-sm">{primaryTag}</span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-lg font-semibold tracking-tight text-white">{template.name}</h3>
          </div>
          <p className="line-clamp-2 text-sm leading-6 text-[#a4a4a4]">{template.description}</p>
        </div>

        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {template.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="rounded-sm border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-[#d7d7d7]">
                {tag}
              </span>
            ))}
            {template.tags.length > 3 && (
              <span className="rounded-sm border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-[#d7d7d7]">
                +{template.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {template.sections && template.sections.length > 0 && (
          <div className="rounded-sm border border-white/10 bg-[#161617] px-3 py-2 text-xs text-[#9d9d9d]">
            <p className="line-clamp-2">Includes: {template.sections.map(s => s.type).join(', ')}</p>
          </div>
        )}

        <Button
          onClick={() => onSelect(template._id || template.id)}
          variant={isSelected ? 'primary' : 'secondary'}
          className={`w-full rounded-sm px-4 py-3 text-sm font-semibold transition-all ${
            isSelected
              ? 'bg-[#0099FF] text-white shadow-lg shadow-[#0099FF]/25'
              : 'border border-white/10 bg-white/5 text-white hover:border-[#0099FF]/40 hover:bg-[#0099FF]/10'
          }`}
        >
          {isSelected ? '✓ Selected' : 'Select Template'}
        </Button>
      </div>
    </div>
  );
}
