import React, { useContext } from 'react';
import { normalizeDesignTheme } from '@/lib/designSystem';
import { SECTION_REGISTRY, getEditableFields } from '@/lib/componentRegistry';
import { EditModeContext } from '@/context/EditModeContext';

const resolveImageUrl = (img) => {
  if (!img) return null;
  if (typeof img === 'string') return img;
  if (img.url) return img.url;
  if (img.url_ref) return img.url_ref; 
  if (img.dataUrl) return img.dataUrl;
  return null;
};

const PLACEHOLDER_SVG = encodeURI(
  '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="100%" height="100%" fill="#0f172a"/><text x="50%" y="50%" fill="#9ca3af" font-family="Arial, Helvetica, sans-serif" font-size="22" dominant-baseline="middle" text-anchor="middle">Image not available</text></svg>'
);

const SectionRenderer = ({ section, project }) => {
  const { editMode, selectedSectionId, setSelectedSection } = useContext(EditModeContext);
  
  if (!section || !section.type) return null;

  const { type, variant: sectionVariant } = section;
  const props = section.props || section; 
  const theme = normalizeDesignTheme(project?.theme);
  const variant = sectionVariant || theme.sectionVariants?.[type] || 'default';

  const images = project?.images || {};
  const sectionImage = resolveImageUrl(images[type]) || `data:image/svg+xml;utf8,${PLACEHOLDER_SVG}`;

  const Component = SECTION_REGISTRY[type];
  if (!Component) return null;

  const isSelected = selectedSectionId === section.id;

  const componentProps = {
    ...props,
    imageUrl: sectionImage,
    variant,
    theme,
    businessName: project?.businessInfo?.businessName,
    ...(editMode && {
      sectionId: section.id,
      editableFields: getEditableFields(type),
      editable: true,
      isSelected,
    }),
  };

  return (
    <div
      className={`relative transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 ring-offset-0 z-20' : 'hover:ring-1 hover:ring-blue-300'}`}
    >
      <Component {...componentProps} />
    </div>
  );
};

export default SectionRenderer;
