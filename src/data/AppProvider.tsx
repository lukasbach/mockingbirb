import { defaultMockServerState, MockServer } from './MockServer';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { MockedRouteConfiguration, MockedServerConfiguration } from './types';
import { defaultTheme } from '../components/ui/layout/ThemeProvider';
import { remote, app } from 'electron';
import path from 'path';
import { useMockServers } from '../components/useMockServers';


export interface AppState {
  state: MockedServerConfiguration;
  server: MockServer;
  serverList: Array<{ id: string, name: string, color: string, initials: string, location: string, }>;
  getRoute: (routeId: string) => MockedRouteConfiguration;
  selectServer: (id: string) => void;
  createServer: () => Promise<void>;
}

export const AppStateContext = React.createContext<AppState>({
  server: null as any,
  serverList: [],
  state: defaultMockServerState,
  getRoute: () => null as any,
  selectServer: () => null,
  createServer: async () => {},
});
export const useApp = () => useContext(AppStateContext);

export const AppProvider: React.FC = ({children}) => {
  const {
    serverList, setState, state, createServer, server, selectServer
  } = useMockServers();

  // const [state, setState] = useState<MockedServerConfiguration>(defaultMockServerState);
  // const servers = useRef({
  //   default: MockServer.createEmpty(setState),
  // });
  // const server = servers.current.default;

  // useEffect(() => {
  //   server.start();
  // }, []);

  if (!state || !server) {
    return null;
  }

  return (
    <AppStateContext.Provider value={{
      state,
      server,
      selectServer,
      createServer,
      serverList,
      getRoute: routeId => {
        console.log("Found ", routeId)
        return state.routes.find(r => r.id === routeId)!;
      }
    }}>
      {children}
    </AppStateContext.Provider>
  )
}