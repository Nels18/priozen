// Colors that are the same in light and dark themes. Single source shared by
// tailwind.config.js (classes such as text-sidebar-text) and components that
// need a raw color value (icon `color` props). CommonJS so the Tailwind config
// can require() it.
module.exports = {
  white: '#FFFFFF',
  // The sidebar stays dark in both themes, so its foreground colors are fixed.
  sidebar: {
    accent: '#818CF8',
    text: 'rgba(255, 255, 255, 0.65)',
    active: 'rgba(129, 140, 248, 0.2)',
    divider: 'rgba(255, 255, 255, 0.08)',
  },
};
