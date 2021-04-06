import * as React from 'react';
import { useState } from 'react';
import { AppContainer } from './ui/layout/AppContainer';
import { MenuListItem } from './ui/layout/MenuListItem';
import { useApp } from '../data/AppProvider';
import { RouteEditor } from './editors/RouteEditor';
import { View } from './View';
import { DocumentList } from './lists/DocumentList';
import { ServerList } from './serverlist/ServerList';
import { EventList } from './lists/EventList';
import { Heading } from './ui/Heading';
import { AppHeader } from './header/AppHeader';
import { MemoryRouter, Link, Switch, Route } from 'react-router-dom';
import { MenuBar } from './MenuBar';

export const AppRoot: React.FC<{}> = props => {
  return (
    <MemoryRouter>
      <Switch>
        <AppContainer
          title={<AppHeader />}
          left={<ServerList />}
          right={(
            <>
              <Heading level={1}>Events</Heading>
              <EventList />
            </>
          )}
          menuContent={<MenuBar />}
        >
            <Route
              path="/route/:routeId"
              exact={true}
              render={({ match }) => <RouteEditor routeId={ match.params.routeId } />}
            />
            <Route
              path="/documents"
              exact={true}
              render={() => <DocumentList />}
            />
        </AppContainer>
      </Switch>
    </MemoryRouter>
  );
};
