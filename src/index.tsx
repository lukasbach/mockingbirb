import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from './components/ui/layout/AppContainer';
import { ThemeProvider } from './components/ui/layout/ThemeProvider';
import { AppProvider } from './data/AppProvider';
import { AppRoot } from './components/AppRoot';

import './initIcons';

console.log('process.env.NODE_ENV=', process.env.NODE_ENV);


ReactDOM.render(
  <ThemeProvider>
    <AppProvider>
      <AppRoot />
    </AppProvider>
  </ThemeProvider>,
  document.getElementById('root')
);
