import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from './components/ui/layout/AppContainer';
import { ThemeProvider } from './components/ui/layout/ThemeProvider';
import { AppProvider, useApp } from './data/AppProvider';
import { AppRoot } from './components/AppRoot';

import './initIcons';

console.log('process.env.NODE_ENV=', process.env.NODE_ENV);

const AppRootWrapper: React.FC = () => {
  const { state } = useApp();
  return <AppRoot key={state.id} />;
}

ReactDOM.render(
  <ThemeProvider>
    <AppProvider>
      <AppRootWrapper />
    </AppProvider>
  </ThemeProvider>,
  document.getElementById('root')
);
