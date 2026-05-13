'use client';

import { createContext, useState } from 'react';
import { DEFAULT_DESIGN_THEME, normalizeDesignTheme } from '@/lib/designSystem';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState({
    mode: 'light', // light or dark
    ...DEFAULT_DESIGN_THEME,
  });

  const toggleThemeMode = () => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light',
    }));
  };

  const updateTheme = (updates) => {
    setTheme(prev => ({
      ...normalizeDesignTheme({
        ...prev,
        ...updates,
      }),
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleThemeMode, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
