"use client";

import React, { createContext, useState, useCallback } from 'react';
import { useEditorStore } from '@/store/editorStore';

/**
 * EditModeContext
 * Manages click-to-edit UI state and behavior
 */
export const EditModeContext = createContext({
  editMode: false,
  selectedSectionId: null,
  selectedFieldPath: null,
  setEditMode: () => {},
  setSelectedSection: () => {},
  setSelectedField: () => {},
});

/**
 * EditModeProvider
 * Wraps application to provide edit mode context
 */
export const EditModeProvider = ({ children }) => {
  const [editMode, setEditMode] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedFieldPath, setSelectedFieldPath] = useState(null);

  const handleSetEditMode = useCallback((mode) => {
    setEditMode(mode);
    if (!mode) {
      setSelectedSectionId(null);
      setSelectedFieldPath(null);
    }
  }, []);

  const handleSetSelectedSection = useCallback((sectionId) => {
    setSelectedSectionId(sectionId);
    setSelectedFieldPath(null);

    const editorStore = useEditorStore.getState();
    const projectSections = editorStore.project?.sections || [];
    const isKnownSection = sectionId === null
      || sectionId === 'page'
      || projectSections.some((section) => section.id === sectionId);

    if (isKnownSection) {
      editorStore.selectSection(sectionId);
      if (sectionId) {
        setEditMode(true);
      }
    }
  }, []);

  const handleSetSelectedField = useCallback((fieldPath) => {
    setSelectedFieldPath(fieldPath);
  }, []);

  const value = {
    editMode,
    selectedSectionId,
    selectedFieldPath,
    setEditMode: handleSetEditMode,
    setSelectedSection: handleSetSelectedSection,
    setSelectedField: handleSetSelectedField,
  };

  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  );
};

export default EditModeContext;
