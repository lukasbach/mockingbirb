import { defaultMockServerState, MockServer } from './MockServer';
import React, { useContext, useRef, useState } from 'react';
import { MockedRouteConfiguration, MockedServerConfiguration } from './types';
import { defaultTheme } from '../components/ui/layout/ThemeProvider';


export interface AppState {
  state: MockedServerConfiguration;
  server: MockServer;
  serverList: Array<{ id: string, name: string, color: string, initials: string, }>;
  getRoute: (routeId: string) => MockedRouteConfiguration;
}

export const AppStateContext = React.createContext<AppState>({
  server: MockServer.createEmpty(() => {}),
  serverList: [],
  state: defaultMockServerState,
  getRoute: () => null as any,
});
export const useApp = () => useContext(AppStateContext);

export const AppProvider: React.FC = ({children}) => {
  const [state, setState] = useState<MockedServerConfiguration>(defaultMockServerState);
  const servers = useRef({
    default: MockServer.createEmpty(setState),
  });
  const server = servers.current.default;

  return (
    <AppStateContext.Provider value={{
      state, server, serverList: [
        { id: 'default', name: 'Mocked Server', initials: 'MS', color: defaultTheme.colors.red },
        { id: 'ms2', name: 'Mocked Server', initials: 'MS', color: defaultTheme.colors.blue },
        { id: 'ms3', name: 'Mocked Server', initials: 'MS', color: defaultTheme.colors.green },
      ],
      getRoute: routeId => {
        console.log("Found ", routeId)
        return state.routes.find(r => r.id === routeId)!;
      }
    }}>
      {children}
    </AppStateContext.Provider>
  )
}