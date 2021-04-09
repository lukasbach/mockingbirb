import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from './components/ui/layout/ThemeProvider';
import { AppRoot, useApp } from './components/AppRoot';
import { remote } from 'electron';
import './initIcons';

console.log('process.env.NODE_ENV=', process.env.NODE_ENV);
(window as any).zoom = (factor: number) => remote.getCurrentWebContents().setZoomFactor(factor);

ReactDOM.render(
  <ThemeProvider>
    <AppRoot />
  </ThemeProvider>,
  document.getElementById('root')
);
