import React from 'react';
import { useEditorStore } from '@/store/editorStore';
import { normalizeDesignTheme } from '@/lib/designSystem';

const ThemeEditor = () => {
  const project = useEditorStore((state) => state.project);
  const updateTheme = useEditorStore((state) => state.updateTheme);

  if (!project) return null;

  const theme = normalizeDesignTheme(project.theme);
  const colors = theme.colors;
  const typography = theme.typography;
  const layout = theme.layout;
  const buttons = theme.buttons;
  const variants = theme.sectionVariants;

  const handleColorChange = (key, value) => {
    updateTheme({
      ...theme,
      colors: {
        ...colors,
        [key]: value
      }
    });
  };

  const handleTypographyChange = (key, value) => {
    updateTheme({
      ...theme,
      typography: {
        ...typography,
        [key]: value,
      },
    });
  };

  const handleLayoutChange = (key, value) => {
    updateTheme({
      ...theme,
      layout: {
        ...layout,
        [key]: value,
      },
    });
  };

  const handleButtonChange = (key, value) => {
    updateTheme({
      ...theme,
      buttons: {
        ...buttons,
        [key]: value,
      },
    });
  };

  const handleVariantChange = (key, value) => {
    updateTheme({
      ...theme,
      sectionVariants: {
        ...variants,
        [key]: value,
      },
    });
  };

  const fonts = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Playfair Display', 'Merriweather'];
  const sectionSpacingOptions = ['sm', 'md', 'lg', 'xl', '2xl'];
  const radiusOptions = ['none', 'sm', 'md', 'lg', 'xl', 'full'];
  const buttonStyles = ['solid', 'outline', 'ghost', 'pill'];
  const sectionVariants = {
    hero: ['centered', 'split', 'minimal'],
    about: ['split', 'story', 'stats'],
    services: ['cards', 'grid', 'stacked'],
    faq: ['accordion', 'cards', 'simple'],
    cta: ['banner', 'split', 'centered'],
  };

  return (
    <div className="p-4 border-t border-gray-200 mt-4 bg-gray-50 rounded-lg mx-4 mb-4">
      <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Design Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Primary Color</label>
          <div className="flex items-center gap-2">
            <input 
              type="color" 
              value={colors.primary || '#2563eb'} 
              onChange={(e) => handleColorChange('primary', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0 p-0"
            />
            <input 
              type="text" 
              value={colors.primary || '#2563eb'}
              onChange={(e) => handleColorChange('primary', e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Secondary Color</label>
          <div className="flex items-center gap-2">
            <input 
              type="color" 
              value={colors.secondary || '#1e40af'} 
              onChange={(e) => handleColorChange('secondary', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0 p-0"
            />
            <input 
              type="text" 
              value={colors.secondary || '#1e40af'}
              onChange={(e) => handleColorChange('secondary', e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Background Color</label>
          <div className="flex items-center gap-2">
            <input 
              type="color" 
              value={colors.background || '#ffffff'} 
              onChange={(e) => handleColorChange('background', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0 p-0"
            />
            <input 
              type="text" 
              value={colors.background || '#ffffff'}
              onChange={(e) => handleColorChange('background', e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Typography</label>
          <select 
            value={typography.fontFamily || 'Inter'}
            onChange={(e) => handleTypographyChange('fontFamily', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          >
            {fonts.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Section Spacing</label>
            <select
              value={layout.sectionSpacing || 'xl'}
              onChange={(e) => handleLayoutChange('sectionSpacing', e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
            >
              {sectionSpacingOptions.map(option => (
                <option key={option} value={option}>{option.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Surface Radius</label>
            <select
              value={layout.radius || 'lg'}
              onChange={(e) => handleLayoutChange('radius', e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
            >
              {radiusOptions.map(option => (
                <option key={option} value={option}>{option.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Button Style</label>
          <select
            value={buttons.style || 'solid'}
            onChange={(e) => handleButtonChange('style', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
          >
            {buttonStyles.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {Object.entries(sectionVariants).map(([sectionName, options]) => (
            <div key={sectionName}>
              <label className="block text-xs font-semibold text-gray-600 mb-1 capitalize">{sectionName} Variant</label>
              <select
                value={variants[sectionName] || options[0]}
                onChange={(e) => handleVariantChange(sectionName, e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
              >
                {options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeEditor;
