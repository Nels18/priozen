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
  // Except schedule, the primary color: light value here (folder palette
  // test); icons take it per theme from useIconColors.
  quadrant: {
    critical: '#EF4444',
    schedule: '#4F46E5',
    delegate: '#F59E0B',
    secondary: '#94A3B8',
  },
  // Dimmed backdrop behind a modal (mockup), same in both themes.
  scrim: 'rgba(10, 9, 24, 0.5)',
  // Success green (global.css --color-success), same in both themes.
  success: '#10B981',
  // Check mark on success (global.css --color-on-success), same in both themes.
  onSuccess: '#1E1B4B',
  // Toasts stay dark in both themes (mockup): background, action link and
  // countdown bar.
  toast: {
    DEFAULT: '#1E293B',
    action: '#A5B4FC',
  },
  // The sidebar stays dark in both themes, so its foreground colors are fixed.
  sidebar: {
    accent: '#818CF8',
    text: 'rgba(255, 255, 255, 0.65)',
    active: 'rgba(129, 140, 248, 0.2)',
    divider: 'rgba(255, 255, 255, 0.08)',
  },
};
