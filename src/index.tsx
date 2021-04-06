import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from './components/ui/layout/ThemeProvider';
import { AppRoot, useApp } from './components/AppRoot';

import './initIcons';

console.log('process.env.NODE_ENV=', process.env.NODE_ENV);

ReactDOM.render(
  <ThemeProvider>
    <AppRoot />
  </ThemeProvider>,
  document.getElementById('root')
);
