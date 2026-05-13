import editorStore from '@/store/editorStore';

export default function useEditor() {
  const { sections, currentSection, theme, setSections, setCurrentSection, setTheme, addSection, removeSection, updateSection } = editorStore();

  return {
    sections,
    currentSection,
    theme,
    setSections,
    setCurrentSection,
    setTheme,
    addSection,
    removeSection,
    updateSection,
  };
}
