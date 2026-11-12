// Colors that are the same in light and dark themes. Single source shared by
// tailwind.config.js (classes such as text-sidebar-text) and components that
// need a raw color value (icon `color` props). CommonJS so the Tailwind config
// can require() it.
module.exports = {
  white: '#FFFFFF',
  // Error / overdue red: the critical quadrant token is the same in both themes.
  critical: '#EF4444',
  // Quadrant colors (global.css --color-<quadrant>), same in both themes:
  // only their -bg tint changes. For icons drawn in a quadrant's color.
  quadrant: {
    critical: '#EF4444',
    schedule: '#4F46E5',
    delegate: '#F59E0B',
    secondary: '#94A3B8',
  },
  // Dimmed backdrop behind a modal (mockup), same in both themes.
  scrim: 'rgba(10, 9, 24, 0.5)',
  // The sidebar stays dark in both themes, so its foreground colors are fixed.
  sidebar: {
    accent: '#818CF8',
    text: 'rgba(255, 255, 255, 0.65)',
    active: 'rgba(129, 140, 248, 0.2)',
    divider: 'rgba(255, 255, 255, 0.08)',
  },
};
