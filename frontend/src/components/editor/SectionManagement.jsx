'use client';

import { useContext } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { EditModeContext } from '@/context/EditModeContext';

const SECTION_TEMPLATES = {
  hero: {
    variant: 'centered',
    props: {
      headline: 'New Hero Section',
      subheadline: 'Your value proposition here',
      ctaText: 'Get Started'
    }
  },
  about: {
    variant: 'split',
    props: {
      title: 'About Us',
      description: 'Tell your brand story here'
    }
  },
  services: {
    variant: 'cards',
    props: {
      title: 'Our Services',
      items: [
        { title: 'Service 1', description: 'Description here' },
        { title: 'Service 2', description: 'Description here' }
      ]
    }
  },
  faq: {
    variant: 'accordion',
    props: {
      items: [
        { question: 'Frequently asked question?', answer: 'Answer here' }
      ]
    }
  },
  cta: {
    variant: 'banner',
    props: {
      headline: 'Ready to get started?',
      buttonText: 'Contact Us'
    }
  }
};

export default function SectionManagement() {
  const { editMode } = useContext(EditModeContext);
  const project = useEditorStore((state) => state.project);
  const addSection = useEditorStore((state) => state.addSection);
  const deleteSection = useEditorStore((state) => state.deleteSection);
  const duplicateSection = useEditorStore((state) => state.duplicateSection);
  const reorderSections = useEditorStore((state) => state.reorderSections);

  if (!editMode || !project) {
    return null;
  }

  const sections = project.sections || [];

  return (
    <div className="section-management h-full w-full bg-white border-l border-gray-200">
      <div className="h-full overflow-y-auto p-4 space-y-4">
        <h4 className="font-semibold text-sm mb-3 text-gray-700">Sections</h4>
        
        {/* Section List */}
        <div className="space-y-2 mb-4">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {section.type}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {section.props?.headline || section.props?.title || `${section.type} #${index + 1}`}
                </p>
              </div>

              <div className="flex gap-1 ml-2">
                {/* Move Up */}
                <button
                  onClick={() => index > 0 && reorderSections(section.id, index - 1)}
                  className="p-1 hover:bg-gray-200 rounded text-sm"
                  title="Move up"
                  disabled={index === 0}
                >
                  ↑
                </button>

                {/* Move Down */}
                <button
                  onClick={() => index < sections.length - 1 && reorderSections(section.id, index + 1)}
                  className="p-1 hover:bg-gray-200 rounded text-sm"
                  title="Move down"
                  disabled={index === sections.length - 1}
                >
                  ↓
                </button>

                {/* Duplicate */}
                <button
                  onClick={() => duplicateSection(section.id)}
                  className="p-1 hover:bg-blue-100 rounded text-sm text-blue-600"
                  title="Duplicate section"
                >
                  📋
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteSection(section.id)}
                  className="p-1 hover:bg-red-100 rounded text-sm text-red-600"
                  title="Delete section"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Section */}
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2">Add Section</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(SECTION_TEMPLATES).map(([type, template]) => (
              <button
                key={type}
                onClick={() => addSection(type, template.variant, template.props)}
                className="px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded border border-blue-200 transition-colors capitalize"
              >
                + {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        button:disabled:hover {
          background-color: transparent;
        }
      `}</style>
    </div>
  );
}
