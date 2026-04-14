// ── Actual backend theme names (must match themes.json keys exactly) ─────────
export const THEMES = {
  dark: {
    Midnight:       { bg: '#07070f', accent: '#6366f1', accent2: '#a78bfa', desc: 'Deep dark with purple-indigo glow' },
    'Neon Cyber':   { bg: '#020208', accent: '#00ffc8', accent2: '#ff2d78', desc: 'Electric neon on near-black' },
    Aurora:         { bg: '#04080f', accent: '#38bdf8', accent2: '#f472b6', desc: 'Sky-blue & pink northern lights' },
  },
  light: {
    Light:            { bg: '#fafaf8', accent: '#1a1a1a', accent2: '#3b82f6', desc: 'Clean ivory with ink accents' },
    'Warm Editorial': { bg: '#fffbf5', accent: '#2c1810', accent2: '#d97706', desc: 'Paper warmth with amber tones' },
    '3D Depth':       { bg: '#eceef5', accent: '#7c3aed', accent2: '#a78bfa', desc: 'Soft grey with violet depth' },
  },
};

// All configurable sections (navbar is always shown but configurable)
export const ALL_SECTIONS = ['navbar', 'hero', 'about', 'skills', 'projects', 'certifications', 'contact'];

// Sections the user can remove from their portfolio
export const OPTIONAL_SECTIONS = ['about', 'skills', 'projects', 'certifications', 'contact'];

// Sections that cannot be removed
export const REQUIRED_SECTIONS = ['navbar', 'hero'];

// Number of available layouts per section (1-3; 4-6 are aliases)
export const LAYOUT_COUNT = 3;

export const SECTION_LABELS = {
  navbar:         'Navigation Bar',
  hero:           'Hero / Intro',
  about:          'About Me',
  skills:         'Skills',
  projects:       'Projects',
  certifications: 'Certifications',
  contact:        'Contact',
};

export const SECTION_ICONS = {
  navbar:         '☰',
  hero:           '✦',
  about:          '👤',
  skills:         '⚡',
  projects:       '🚀',
  certifications: '🏆',
  contact:        '✉️',
};

export const DEFAULT_CUSTOMIZATION = {
  theme: 'Midnight',
  sections_order: ['hero', 'about', 'skills', 'projects', 'certifications', 'contact'],
  excluded_sections: [],
  section_layouts: {
    navbar: 1, hero: 1, about: 1, skills: 1,
    projects: 1, certifications: 1, contact: 1,
  },
};

export const DEFAULT_USER = {
  name: '',
  title: '',
  bio: '',
  github: '',
  linkedin: '',
  contact_email: '',
  skills: [],
  projects:       [{ name: '', description: '', link: '', tech_stack: [] }],
  certifications: [{ name: '', issuer: '', year: '', link: '' }],
};

// Sample data used for layout previews (shown before user fills forms)
export const SAMPLE_USER = {
  name: 'Alex Rivera',
  title: 'Full Stack Developer',
  bio: 'I build scalable web applications with 5+ years of experience across React, Node.js, and Python. Passionate about clean code and great user experiences.',
  github: 'https://github.com/alexrivera',
  linkedin: 'https://linkedin.com/in/alexrivera',
  contact_email: 'alex@alexrivera.dev',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Docker', 'AWS', 'PostgreSQL', 'GraphQL'],
  projects: [
    { name: 'TechDebt Tracker', description: 'Real-time monitoring platform that surfaces and prioritises technical debt across distributed microservices.', link: 'https://github.com/alexrivera/tracker', tech_stack: ['React', 'Node.js', 'PostgreSQL'] },
    { name: 'Code Smell Detector', description: 'ML-powered static analysis engine identifying 40+ debt patterns with 94% precision.', link: '', tech_stack: ['Python', 'FastAPI'] },
  ],
  certifications: [
    { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2024', link: 'https://aws.amazon.com/certification/' },
    { name: 'Google Cloud Professional Engineer', issuer: 'Google Cloud', year: '2023', link: '' },
  ],
};

export const FORM_STEPS = ['Basic Info', 'Contact & Links', 'Skills', 'Projects', 'Certifications'];

export const LOADING_STEPS = [
  'Loading your customization',
  'Fetching section templates',
  'Injecting your content',
  'Applying theme styles',
  'Assembling final HTML',
];
