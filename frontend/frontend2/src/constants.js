export const THEMES = {
  light: {
    Ivory: { bg: '#FAFAF8', accent: '#4A4A9C' },
    Sky: { bg: '#EFF6FF', accent: '#2563EB' },
    Sage: { bg: '#F0FDF4', accent: '#16A34A' },
    Rose: { bg: '#FFF1F2', accent: '#E11D48' },
    Stone: { bg: '#FAFAF9', accent: '#78716C' },
  },
  dark: {
    Midnight: { bg: '#0D1117', accent: '#58A6FF' },
    Ocean: { bg: '#0A1628', accent: '#38BDF8' },
    Forest: { bg: '#0A1A0E', accent: '#4ADE80' },
    Crimson: { bg: '#1A0A0A', accent: '#F87171' },
    Slate: { bg: '#1A1A2E', accent: '#A78BFA' },
  }
};

export const SECTIONS = ['hero', 'about', 'skills', 'projects', 'certifications', 'contact'];

export const DEFAULT_CUSTOMIZATION = {
  theme: 'Midnight',
  sections_order: [...SECTIONS],
  excluded_sections: [],
  section_layouts: {
    navbar: 1,
    hero: 1,
    about: 1,
    skills: 1,
    projects: 1,
    certifications: 1,
    contact: 1
  }
};

export const DEFAULT_USER = {
  name: '',
  title: '',
  bio: '',
  github: '',
  linkedin: '',
  contact_email: '',
  profile_image: '',
  skills: [],
  projects: [{ name: '', description: '', link: '', tech_stack: [] }],
  certifications: [{ name: '', issuer: '', year: '', link: '' }]
};

export const FORM_STEPS = ['Basic Info', 'Links & Photo', 'Skills', 'Projects', 'Certifications'];

export const LOADING_STEPS = [
  'Loading your customization',
  'Fetching section templates',
  'Injecting your content',
  'Applying theme styles',
  'Assembling final HTML',
];
