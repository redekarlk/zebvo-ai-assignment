export const DEFAULT_DESIGN_THEME = {
  visualStyle: 'minimal',
  spacingVibe: 'breathable',
  colors: {
    primary: '#2563eb',
    secondary: '#0f172a',
    background: '#ffffff',
    surface: '#f8fafc',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    border: '#e2e8f0',
    accent: '#2563eb',
  },
  typography: {
    fontFamily: 'Inter',
    headingFontFamily: 'Inter',
    baseScale: '100%',
  },
  layout: {
    sectionSpacing: 'xl',
    radius: '8px',
    containerWidth: 'xl',
  },
  buttons: {
    style: 'solid',
    radius: 'lg',
  },
  sectionVariants: {
    hero: 'centered',
    about: 'split',
    services: 'cards',
    faq: 'accordion',
    cta: 'banner',
  },
};

export const normalizeDesignTheme = (theme = {}) => ({
  ...DEFAULT_DESIGN_THEME,
  ...theme,
  visualStyle: theme.visualStyle || DEFAULT_DESIGN_THEME.visualStyle,
  spacingVibe: theme.spacingVibe || DEFAULT_DESIGN_THEME.spacingVibe,
  colors: {
    ...DEFAULT_DESIGN_THEME.colors,
    ...(theme.colors || {}),
  },
  typography: {
    ...DEFAULT_DESIGN_THEME.typography,
    ...(theme.typography || {}),
  },
  layout: {
    ...DEFAULT_DESIGN_THEME.layout,
    ...(theme.layout || {}),
  },
  buttons: {
    ...DEFAULT_DESIGN_THEME.buttons,
    ...(theme.buttons || {}),
  },
  sectionVariants: {
    ...DEFAULT_DESIGN_THEME.sectionVariants,
    ...(theme.sectionVariants || {}),
  },
});
