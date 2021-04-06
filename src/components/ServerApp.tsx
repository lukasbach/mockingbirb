import * as React from 'react';
import { AppContainer } from './ui/layout/AppContainer';
import { RouteEditor } from './editors/RouteEditor';
import { DocumentList } from './lists/DocumentList';
import { ServerList } from './serverlist/ServerList';
import { HashRouter, Link, Switch, Route } from 'react-router-dom';
import { MenuBar } from './MenuBar';
import { ServerAppHeader } from './header/ServerAppHeader';
import { ServerSettings } from './editors/ServerSettings';
import { RightBarContent } from './rightBar/RightBarContent';
import { EventDetails } from './editors/EventDetails';
import { DocumentEditor } from './editors/DocumentEditor';

export const ServerApp: React.FC<{}> = props => {
  return (
    <HashRouter>
      <Switch>
        <AppContainer
          title={<ServerAppHeader />}
          left={<ServerList />}
          right={<RightBarContent />}
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
          <Route
            path="/documents/:documentId"
            exact={true}
            render={({match}) => <DocumentEditor documentId={match.params.documentId} />}
          />
          <Route
            path="/server-settings"
            exact={true}
            render={() => <ServerSettings />}
          />
          <Route
            path="/events/:eventId"
            exact={true}
            render={({ match }) => <EventDetails eventId={parseInt(match.params.eventId)} />}
          />
        </AppContainer>
      </Switch>
    </HashRouter>
  );
};
