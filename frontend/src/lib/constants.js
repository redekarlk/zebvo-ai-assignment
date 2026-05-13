export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  PROJECTS: {
    LIST: '/projects',
    CREATE: '/projects',
    GET: (id) => `/projects/${id}`,
    UPDATE: (id) => `/projects/${id}`,
    DELETE: (id) => `/projects/${id}`,
  },
  TEMPLATES: {
    LIST: '/templates',
    GET: (id) => `/templates/${id}`,
    GET_BY_SLUG: (slug) => `/templates/slug/${slug}`,
  },
  AI: {
    GENERATE: '/ai/generate',
    IMPROVE: '/ai/improve',
  },
};

export const SECTION_TYPES = [
  'hero',
  'about',
  'services',
  'testimonials',
  'faq',
  'cta',
  'contact',
  'footer',
];

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};
