import { defaultMockServerState, MockServer } from '../data/MockServer';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { MockedRouteConfiguration, MockedServerConfiguration, ServerListItem } from '../data/types';
import { defaultTheme } from './ui/layout/ThemeProvider';
import { remote, app } from 'electron';
import path from 'path';
import { useMockServers } from './useMockServers';
import { ServerApp } from './ServerApp';
import { CreateServerPage } from './pages/CreateServerPage';
import { SettingsPage } from './pages/settings/SettingsPage';

export interface AppState {
  state: MockedServerConfiguration;
  server: MockServer;
  serverList: ServerListItem[];
  getRoute: (routeId: string) => MockedRouteConfiguration;
  selectServer: (id: string) => void;
  createServer: () => Promise<void>;
  openView: (page: View) => void;
  view?: View;
}

export type View = 'settings' | 'createServer';

export const AppStateContext = React.createContext<AppState>({
  server: null as any,
  serverList: [],
  state: defaultMockServerState,
  getRoute: () => null as any,
  selectServer: () => null,
  createServer: async () => {},
  openView: () => {},
});
export const useApp = () => useContext(AppStateContext);

export const AppRoot: React.FC = ({children}) => {
  const [view, setView] = useState<View>();
  const {
    serverList, setState, state, createServer, server, selectServer
  } = useMockServers();

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