export const ViewerThemes = {
  default: {
    background: '#000000',
    color: '#ffffff',
  },
  dark: {
    background: '#262626',
    color: '#ffffff',
  },
  light: {
    background: '#ffffff',
    color: '#000000',
  },
  soft: {
    background: '#fef3c7',
    color: '#27272a',
  },
};

export type ThemeType = keyof typeof ViewerThemes;
