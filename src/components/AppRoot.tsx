import { defaultMockServerState, MockServer } from '../data/MockServer';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { MockedRouteConfiguration, MockedServerConfiguration, ServerListItem } from '../data/types';
import { defaultTheme } from './ui/layout/ThemeProvider';
import { remote, app } from 'electron';
import path from 'path';
import { useMockServers } from './useMockServers';
import { ServerApp } from './ServerApp';
import { CreateServerPage } from './pages/createServer/CreateServerPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { NewServerConfig } from './pages/createServer/NewServerConfig';

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
});
export const useApp = () => useContext(AppStateContext);

export const AppRoot: React.FC = ({children}) => {
  const [view, setView] = useState<View>();
  const {
    serverList, setState, state, createServer, server, selectServer, addServer, removeServer, deleteServer
  } = useMockServers(setView);

  if (!state || !server) {
    return <CreateServerPage />;
  }

  return (
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
      getRoute: routeId => {
        console.log("Found ", routeId)
        return state.routes.find(r => r.id === routeId)!;
      }
    }}>
      {view === undefined && <ServerApp key={state.id} />}
      {view === 'createServer' && <CreateServerPage />}
      {view === 'settings' && <SettingsPage />}
    </AppStateContext.Provider>
  )
}