/** Maps a CSS variable from global.css to a color that supports opacity modifiers. */
const token = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;
const fixedColors = require('./src/theme/fixedColors');

module.exports = {
  // 'class', not the default 'media': on web, NativeWind 4.2.7 throws
  // "Cannot manually set color scheme, as dark mode is type 'media'" when its
  // CSS loads after its runtime (the case since Expo SDK 58). The theme still
  // follows the OS: colors come from the @media (prefers-color-scheme) blocks
  // of global.css, and no component uses dark: variants. 'class' is also what
  // the manual light/dark toggle (UX-03) will need.
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: token('primary'),
          hover: token('primary-hover'),
          light: token('primary-light'),
        },
        success: token('success'),
        page: token('page'),
        card: token('card'),
        // Background follows the theme; foreground colors are fixed.
        sidebar: { DEFAULT: token('sidebar'), ...fixedColors.sidebar },
        input: token('input'),
        text: token('text'),
        muted: token('muted'),
        border: token('border'),
        critical: { DEFAULT: token('critical'), bg: token('critical-bg') },
        schedule: { DEFAULT: token('schedule'), bg: token('schedule-bg') },
        delegate: { DEFAULT: token('delegate'), bg: token('delegate-bg') },
        secondary: { DEFAULT: token('secondary'), bg: token('secondary-bg') },
      },
      // Native platforms can't synthesize weights for custom fonts, so each
      // weight is its own family (names match the useFonts keys in
      // app/_layout.tsx).
      fontFamily: {
        serif: ['dmSerifDisplay'],
        sans: ['interRegular'],
        'sans-medium': ['interMedium'],
        'sans-semibold': ['interSemiBold'],
        'sans-bold': ['interBold'],
      },
      // 13px: secondary text of the mockup (labels, links, captions).
      // 11px: task metadata (folder, due date, badges, group hints).
      fontSize: {
        caption: '13px',
        tiny: '11px',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
      },
    },
  },
  plugins: [],
};
