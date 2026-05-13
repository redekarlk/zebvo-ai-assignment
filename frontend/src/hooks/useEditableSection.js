/**
 * useEditableSection Hook
 * Provides click-to-edit functionality for section content
 * Directly updates JSON state by path
 */

import { useCallback } from 'react';
import { useEditorStore } from '@/store/editorStore';

/**
 * Hook for editing section content by JSON path
 * @param {string} sectionId - Section ID to edit
 * @returns {Object} Edit functions and utilities
 */
export const useEditableSection = (sectionId) => {
  const updateSectionContent = useEditorStore((state) => state.updateSectionContent);
  const project = useEditorStore((state) => state.project);
  const sections = project?.sections || [];

  /**
   * Update a field by JSON path
   * @param {string} path - JSON path (e.g., 'props.headline')
   * @param {any} value - New value
   */
  const updateField = useCallback(
    (path, value) => {
      updateSectionContent(sectionId, path, value);
    },
    [sectionId, updateSectionContent]
  );

  /**
   * Get current value by path
   * @param {string} path - JSON path
   * @returns {any} Current value
   */
  const getFieldValue = useCallback(
    (path) => {
      const section = sections.find((s) => s.id === sectionId);
      if (!section) return null;

      // Smart Path Resolution:
      // If path is 'props.headline' but section has no props, look for 'headline' at root
      const parts = path.split('.');
      let value = section;
      
      // If the first part is 'props' but the section doesn't have a props object,
      // skip 'props' and look at the root.
      const startIndex = (parts[0] === 'props' && !section.props) ? 1 : 0;

      for (let i = startIndex; i < parts.length; i++) {
        value = value?.[parts[i]];
      }
      return value;
    },
    [sectionId, sections]
  );

  /**
   * Get the entire section
   */
  const getSection = useCallback(() => {
    return sections.find((s) => s.id === sectionId);
  }, [sectionId, sections]);

  /**
   * Update array item in section
   * @param {string} arrayPath - Path to array (e.g., 'props.items')
   * @param {number} index - Item index
   * @param {string} itemPath - Path within item (e.g., 'title')
   * @param {any} value - New value
   */
  const updateArrayItem = useCallback(
    (arrayPath, index, itemPath, value) => {
      const fullPath = `${arrayPath}[${index}].${itemPath}`;
      updateField(fullPath, value);
    },
    [updateField]
  );

  /**
   * Add item to array
   * @param {string} arrayPath - Path to array
   * @param {Object} item - Item to add
   */
  const addArrayItem = useCallback(
    (arrayPath, item) => {
      const array = getFieldValue(arrayPath) || [];
      const newArray = [...array, item];
      updateField(arrayPath, newArray);
    },
    [getFieldValue, updateField]
  );

  /**
   * Remove item from array
   * @param {string} arrayPath - Path to array
   * @param {number} index - Item index to remove
   */
  const removeArrayItem = useCallback(
    (arrayPath, index) => {
      const array = getFieldValue(arrayPath) || [];
      const newArray = array.filter((_, i) => i !== index);
      updateField(arrayPath, newArray);
    },
    [getFieldValue, updateField]
  );

  return {
    updateField,
    getFieldValue,
    getSection,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
  };
};

export default useEditableSection;
