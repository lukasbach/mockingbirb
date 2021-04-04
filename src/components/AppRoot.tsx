import * as React from 'react';
import { useState } from 'react';
import { AppContainer } from './ui/layout/AppContainer';
import { MenuListItem } from './ui/layout/MenuListItem';
import { Tag } from './ui/layout/Tag';
import { useApp } from '../data/AppProvider';
import { RouteEditor } from './editors/RouteEditor';
import { View } from './View';
import { DocumentList } from './lists/DocumentList';
import { LeftList } from './LeftList';
import { EventList } from './lists/EventList';
import { MethodTag } from './ui/MethodTag';
import { Heading } from './ui/Heading';
import ago from 's-ago';
import { RouteButton } from './RouteButton';

export const AppRoot: React.FC<{}> = props => {
  const { state, server } = useApp();
  const [view, setView] = useState<View>();
  const [selectedRoute, setSelectedRoute] = useState<string>("route1");

  return (
    <AppContainer
      title={(
        <>
          <h1>{state.name}</h1>
          <p>{state.location}</p>
        </>
      )}
      left={<LeftList />}
      right={(
        <>
          <Heading level={1}>Events</Heading>
          <EventList />
        </>
      )}
      menuContent={(
        <>
          {state.routes.map(route => (
            <RouteButton
              route={route}
              view={view}
              selectedRoute={selectedRoute}
              onClick={() => {
                setView(View.RouteConfig);
                setSelectedRoute(route.id);
              }}
            />
          ))}

          <MenuListItem
            onClick={() => {
              const id = server.routes.createRoute({ route: '/*', method: 'ALL', handlers: [] });
              setView(View.RouteConfig);
              setSelectedRoute(id);
            }}
            icon="plus"
          >
            Create new Route
          </MenuListItem>

          <MenuListItem
            selected={view === View.DocumentList}
            onClick={() => {
              setView(View.DocumentList);
            }}
            icon="file-alt"
          >
            Documents
          </MenuListItem>
        </>
      )}
    >
      {view === View.RouteConfig && selectedRoute && <RouteEditor routeId={ selectedRoute } />}
      {view === View.DocumentList && <DocumentList />}
    </AppContainer>
  );
};
