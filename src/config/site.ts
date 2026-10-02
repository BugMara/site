/**
 * BUGMARA — site configuration.
 * Single source of truth for everything that is a fact about the organisation.
 * Values marked PLACEHOLDER must be replaced before launch.
 */

export const site = {
  name: 'BUGMARA',
  tagline: 'TECHNOLOGY / ENGINEERING / EXPERIMENTATION',
  description:
    'BugMara is a technology and engineering collective from Nepal. We build things, break them, learn, and build again.',

  /** Shown in the hero as "EXP. 001". Increment when the site itself changes materially. */
  experiment: '001',

  location: {
    country: 'Nepal',
    city: 'Kathmandu',
    lat: 27.7017,
    lng: 85.3206,
    elevationM: 1400,
    timeZone: 'Asia/Kathmandu',
    tzLabel: 'KTM',
  },

  /** PLACEHOLDER — replace with the real address. */
  email: 'hello@bugmara.com',

  links: [{ label: 'GitHub', href: 'https://github.com/BugMara' }],

  nav: [
    { index: '01', label: 'Work', href: '#work' },
    { index: '02', label: 'About', href: '#about' },
    { index: '03', label: 'Lab', href: '#lab' },
    { index: '04', label: 'Contact', href: '#contact' },
  ],

  lab: {
    categories: [
      { key: 'experiments', index: 'A', label: 'Experiments' },
      { key: 'research', index: 'B', label: 'Research' },
      { key: 'prototypes', index: 'C', label: 'Prototypes' },
      { key: 'failures', index: 'D', label: 'Failures' },
    ],
  },
} as const;

export type NavItem = (typeof site.nav)[number];
export type LabCategoryKey = (typeof site.lab.categories)[number]['key'];

export const formatCoordinate = (value: number, axis: 'lat' | 'lng') => {
  const hemisphere = axis === 'lat' ? (value >= 0 ? 'N' : 'S') : value >= 0 ? 'E' : 'W';
  return `${Math.abs(value).toFixed(4)}° ${hemisphere}`;
};
