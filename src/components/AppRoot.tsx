import { defaultMockServerState, MockServer } from '../data/MockServer';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { MockedRouteConfiguration, MockedServerConfiguration, ServerListItem } from '../data/types';
import { defaultTheme, ThemeProvider } from './ui/layout/ThemeProvider';
import { remote, app } from 'electron';
import path from 'path';
import { useMockServers } from './useMockServers';
import { ServerApp } from './ServerApp';
import { CreateServerPage } from './pages/createServer/CreateServerPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { NewServerConfig } from './pages/createServer/NewServerConfig';
import { defaultSettings, Settings, useSettingsProvider } from './useSettingsProvider';

export interface AppState {
  state: MockedServerConfiguration;
  server: MockServer;
  serverList: ServerListItem[];
  getRoute: (routeId: string) => MockedRouteConfiguration;
  selectServer: (id: string) => void;
  createServer: (config: NewServerConfig) => Promise<void>;
  addServer: (location: string) => Promise<void>;
  openView: (page: View) => void;
  view?: View;
  removeServer: (id: string) => Promise<void>;
  deleteServer: (id: string) => Promise<void>;
  settings: Settings,
  writeSettings: (settings: Partial<Settings>) => void;
}

export type View = 'settings' | 'createServer';

export const AppStateContext = React.createContext<AppState>({
  server: null as any,
  serverList: [],
  state: defaultMockServerState,
  getRoute: () => null as any,
  selectServer: () => null,
  createServer: async () => {},
  addServer: async () => {},
  openView: () => {},
  removeServer: async () => {},
  deleteServer: async () => {},
  settings: defaultSettings,
  writeSettings: () => {},
});
export const useApp = () => useContext(AppStateContext);

export const AppRoot: React.FC = ({children}) => {
  const [view, setView] = useState<View>();
  const { settings, writeSettings } = useSettingsProvider();
  const {
    serverList, setState, state, createServer, server, selectServer, addServer, removeServer, deleteServer
  } = useMockServers(setView);

  const ThemeProviderComponent: React.FC = ({ children: themeChildren }) => (
    <ThemeProvider color={settings.primaryColor} dark={settings.dark}>
      {themeChildren}
    </ThemeProvider>
  );

  if (!state || !server) {
    return (
      <ThemeProviderComponent>
        <AppStateContext.Provider value={{
          state: defaultMockServerState,
          server: null as any,
          selectServer: (server) => {
            selectServer(server);
            setView(undefined);
          },
          view,
          createServer,
          addServer,
          deleteServer,
          removeServer,
          serverList,
          settings,
          writeSettings,
          openView: setView,
          getRoute: () => null as any,
        }}>
          <CreateServerPage />
        </AppStateContext.Provider>
      </ThemeProviderComponent>
    );
  }

  return (
    <ThemeProviderComponent>
      <AppStateContext.Provider value={{
        state,
        server,
        selectServer: (server) => {
          selectServer(server);
          setView(undefined);
        },
        view,
        createServer,
        addServer,
        deleteServer,
        removeServer,
        serverList,
        openView: setView,
        settings,
        writeSettings,
        getRoute: routeId => {
          console.log("Found ", routeId)
          return state.routes.find(r => r.id === routeId)!;
        }
      }}>
        {view === undefined && <ServerApp key={state.id} />}
        {view === 'createServer' && <CreateServerPage />}
        {view === 'settings' && <SettingsPage />}
      </AppStateContext.Provider>
    </ThemeProviderComponent>
  );
}