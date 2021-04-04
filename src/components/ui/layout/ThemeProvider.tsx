import React, { useEffect, useState } from 'react';


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

    httpMethod: {
      get: '#3498db',
      post: '#27ae60',
      put: '#d35400',
      head: '#f1c40f',
      patch: '#e67e22',
      delete: '#e74c3c',
      default: '#9b59b6',
    },

    text: '#ffffff',
    muted: '#bebebe',

    minimalBackground: 'rgba(255, 255, 255, .07)',

    scroll: 'rgba(255, 255, 255, .1)',
    scrollHover: 'rgba(255, 255, 255, .2)'
  },
  radius: '8px',
  contentPadding: '14px 18px',
  keyboardMode: false,
};

export type Theme = typeof defaultTheme;
export type ColorName = keyof Theme['colors'];

const ThemeContext = React.createContext<Theme>(defaultTheme);

export const useTheme = () => React.useContext(ThemeContext);

export const ThemeProvider: React.FC = ({ children }) => {
  const [keyboardMode, setKeyboardMode] = useState(false);

  useEffect(() => {
    const keydownListener = () => setKeyboardMode(true);
    const mousedownListener = () => setKeyboardMode(false);
    document.addEventListener('keydown', keydownListener);
    document.addEventListener('mousedown', mousedownListener);

    return () => {
      document.removeEventListener('keydown', keydownListener);
      document.removeEventListener('mousedown', mousedownListener);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{...defaultTheme, keyboardMode}}>
      { children }
    </ThemeContext.Provider>
  );
};

/*
    background: '#202124',
    background2: '#1a1a1d',
    background3: '#121213',
    backgroundMenu: '#404045',
 */

