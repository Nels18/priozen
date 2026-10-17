/** Maps a CSS variable from global.css to a color that supports opacity modifiers. */
const token = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

module.exports = {
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
        sidebar: token('sidebar'),
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
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
      },
    },
  },
  plugins: [],
};
