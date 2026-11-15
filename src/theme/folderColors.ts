// Folder colors (FOLD-07). A folder's color is user data saved as a hex value,
// so one palette has to work in both themes: each color keeps a 3:1 contrast
// (WCAG AA for a non-text mark such as the folder dot) on the light and dark
// page and card backgrounds. No red, amber, indigo or gray: a folder dot must
// never read as a quadrant. The folder name is always shown next to the dot.
// Ordered so that neighboring colors are far apart: the first folders created
// get clearly different colors. Checked by folderColors.test.ts.
export const FOLDER_COLOR = {
  teal: '#0D9488',
  sky: '#0284C7',
  pink: '#DB2777',
  lime: '#4D7C0F',
  purple: '#9333EA',
  green: '#15803D',
  fuchsia: '#C026D3',
  cyan: '#0E7490',
} as const;

export type FolderColor = (typeof FOLDER_COLOR)[keyof typeof FOLDER_COLOR];

export const FOLDER_COLORS: readonly FolderColor[] =
  Object.values(FOLDER_COLOR);

export const DEFAULT_FOLDER_COLOR: FolderColor = FOLDER_COLOR.teal;
