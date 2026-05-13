import React, { useState, useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';

const PreviewToolbar = () => {
  const previewMode = useEditorStore((state) => state.previewMode || 'desktop');
  const setPreviewMode = useEditorStore((state) => state.setPreviewMode);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const modes = [
    {
      id: 'mobile',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Mobile'
    },
    {
      id: 'tablet',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Tablet'
    },
    {
      id: 'desktop',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Desktop'
    }
  ];

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-white shadow-md rounded-lg p-1 border border-gray-200 flex items-center">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => setPreviewMode(mode.id)}
          title={mode.label}
          className={`p-2 rounded-md mx-0.5 transition-colors ${
            previewMode === mode.id 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          {mode.icon}
        </button>
      ))}
      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        className="p-2 rounded-md mx-0.5 transition-colors text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      >
        {isDarkMode ? (
          <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default PreviewToolbar;
