export const DEFAULT_DESIGN_THEME = {
  colors: {
    primary: '#2563eb',
    secondary: '#0f172a',
    background: '#ffffff',
    surface: '#f8fafc',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    border: '#e2e8f0',
  },
  typography: {
    fontFamily: 'Inter',
    headingFontFamily: 'Inter',
    baseScale: '100%',
  },
  layout: {
    sectionSpacing: 'xl',
    radius: 'lg',
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

export const themeToCssVars = (theme = {}) => {
  const normalized = normalizeDesignTheme(theme);

  return {
    '--theme-primary': normalized.colors.primary,
    '--theme-secondary': normalized.colors.secondary,
    '--theme-background': normalized.colors.background,
    '--theme-surface': normalized.colors.surface,
    '--theme-text-primary': normalized.colors.textPrimary,
    '--theme-text-secondary': normalized.colors.textSecondary,
    '--theme-border': normalized.colors.border,
    '--theme-font-family': normalized.typography.fontFamily,
    '--theme-heading-font-family': normalized.typography.headingFontFamily,
    '--theme-base-scale': normalized.typography.baseScale,
    '--theme-radius': normalized.layout.radius,
    '--theme-section-spacing': normalized.layout.sectionSpacing,
  };
};
