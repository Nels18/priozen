// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const tseslint = require('typescript-eslint');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');
const i18next = require('eslint-plugin-i18next');

// Project conventions enforced through no-restricted-syntax. ESLint doesn't
// merge this rule across config objects (the last one wins), so each group is
// a list, and every files block below combines the groups it needs.
const CLASS_NAME_ATTRIBUTE = 'JSXAttribute[name.name=/(^c|C)lassName$/]';

/** Colors come from the theme tokens (global.css), never from className. */
const THEME_COLOR_RESTRICTIONS = [
  {
    selector: `${CLASS_NAME_ATTRIBUTE} Literal[value=/#[0-9a-fA-F]{3,8}/]`,
    message:
      'No hex color in className: use a theme class (bg-card, text-muted…). Raw colors live in src/theme/.',
  },
  {
    selector: `${CLASS_NAME_ATTRIBUTE} TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}/]`,
    message:
      'No hex color in className: use a theme class (bg-card, text-muted…). Raw colors live in src/theme/.',
  },
  {
    selector: `${CLASS_NAME_ATTRIBUTE} Literal[value=/(^|\\s)dark:/]`,
    message:
      'No dark: variant: theme tokens already switch with the color scheme (global.css).',
  },
  {
    selector: `${CLASS_NAME_ATTRIBUTE} TemplateElement[value.raw=/(^|\\s)dark:/]`,
    message:
      'No dark: variant: theme tokens already switch with the color scheme (global.css).',
  },
];

/** URLs come from env variables (EXPO_PUBLIC_API_URL) or route constants. */
const HARDCODED_URL_RESTRICTIONS = [
  {
    selector: 'Literal[value=/https?:\\/\\//]',
    message:
      'No hardcoded URL: use EXPO_PUBLIC_API_URL / apiRequest for the API, ROUTES for app paths.',
  },
  {
    selector: 'TemplateElement[value.raw=/https?:\\/\\//]',
    message:
      'No hardcoded URL: use EXPO_PUBLIC_API_URL / apiRequest for the API, ROUTES for app paths.',
  },
];

const TEST_AND_MOCK_FILES = [
  '**/*.test.ts',
  '**/*.test.tsx',
  'src/test/**',
  'src/mocks/**',
];

module.exports = defineConfig([
  expoConfig,
  ...tseslint.configs.recommendedTypeChecked,
  {
    ignores: [
      'dist/*',
      'eslint.config.js',
      '.validate-branch-namerc.js',
      'public/mockServiceWorker.js',
      // Copy of the claude.ai mockup, kept as is (see CLAUDE.md).
      'design/maquettes/*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': [
        'error',
        {
          allowComparingNullableBooleansToFalse: true,
          allowComparingNullableBooleansToTrue: true,
        },
      ],
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-array-delete': 'error',
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-implied-eval': 'off',
      '@typescript-eslint/no-implied-eval': 'error',
      '@typescript-eslint/no-unnecessary-template-expression': 'error',
      '@typescript-eslint/prefer-regexp-exec': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/require-array-sort-compare': 'error',
      '@typescript-eslint/typedef': 'error',
      'default-param-last': 'off',
      '@typescript-eslint/default-param-last': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          // Keys that need quotes are not identifiers ('aria-hidden').
          selector: ['objectLiteralProperty', 'typeProperty'],
          modifiers: ['requiresQuotes'],
          format: null,
        },
        {
          selector: 'import',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: { regex: '^I[A-Z]', match: false },
        },
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'has', 'can'],
        },
      ],
      semi: ['error', 'always'],
      'no-console': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        ...THEME_COLOR_RESTRICTIONS,
        ...HARDCODED_URL_RESTRICTIONS,
      ],
    },
  },
  {
    // Every pictogram goes through Icon (theme colors, accessibility).
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['src/components/ui/Icon.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@expo/vector-icons', '@expo/vector-icons/*'],
              message:
                'Use the Icon component (src/components/ui/Icon.tsx): theme colors and accessibility built in.',
            },
          ],
        },
      ],
    },
  },
  {
    // Raw colors are allowed where the theme is defined.
    files: ['src/theme/**'],
    rules: {
      'no-restricted-syntax': ['error', ...HARDCODED_URL_RESTRICTIONS],
    },
  },
  {
    // Tests and mocks need fake URLs (test host, mocked API).
    files: TEST_AND_MOCK_FILES,
    rules: {
      'no-restricted-syntax': ['error', ...THEME_COLOR_RESTRICTIONS],
    },
  },
  {
    // Displayed text goes through i18next (mode jsx-text-only: JSX text only).
    files: ['**/*.tsx'],
    ...i18next.configs['flat/recommended'],
  },
  {
    files: TEST_AND_MOCK_FILES,
    rules: { 'i18next/no-literal-string': 'off' },
  },
  {
    // Type-aware rules need a TS program, which only .ts/.tsx files get
    // (see parserOptions above): turn them off for plain JS config files.
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    // Expo/Metro/Babel/Tailwind configs are CommonJS and must use require().
    files: ['**/*.js', '**/*.cjs'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  prettierConfig,
]);
