import React from 'react';


export const defaultTheme = {
  colors: {
    background: '#27282b',
    background2: '#232326',
    background3: '#121213',
    backgroundMenu: '#404045',

    primary: 'rgb(219, 129, 55)',
    blue: '#137CBD',
    green: '#0F9960',
    orange: 'rgb(219, 129, 55)',
    red: '#DB3737',

    text: '#ffffff',
    muted: '#bebebe',

    minimalBackground: 'rgba(255, 255, 255, .07)',
  },
  radius: '8px',
  contentPadding: '14px 18px',
};

export type Theme = typeof defaultTheme;
export type ColorName = keyof Theme['colors'];

const ThemeContext = React.createContext<Theme>(defaultTheme);

export const useTheme = () => React.useContext(ThemeContext);

export const ThemeProvider: React.FC = ({ children }) => (
  <ThemeContext.Provider value={defaultTheme}>
    { children }
  </ThemeContext.Provider>
);

/*
    background: '#202124',
    background2: '#1a1a1d',
    background3: '#121213',
    backgroundMenu: '#404045',
 */

