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
import { HandlerList } from './lists/HandlerList';
import { HandlerEditor } from './editors/HandlerEditor';
import { CenteredNotification } from './ui/CenteredNotification';
import { Box } from './ui/Box';
import { remote } from 'electron';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from './ui/layout/ThemeProvider';

export const ServerApp: React.FC<{}> = props => {
  const theme = useTheme();
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
          <Route
            path="/handlers"
            exact={true}
            render={() => <HandlerList />}
          />
          <Route
            path="/handlers/:handlerId"
            exact={true}
            render={({ match }) => <HandlerEditor handlerId={match.params.handlerId} />}
          />
          <Route
            path="/"
            exact={true}
            render={() => (
              <CenteredNotification
                title="Welcome to Mockingbirb!"
                icon="hand-peace"
                content="It looks like you don't have a route open. Choose a route from the left or create a new one!"
                actions={(
                  <Box
                    as="a"
                    cursor="pointer"
                    color={theme.colors.text}
                    marginTop="10px"
                    hover={{
                      color: theme.colors.primary,
                      borderBottom: `1px solid ${theme.colors.primary}`
                    }}
                    elProps={{
                      onClick: () => remote.shell.openExternal('https://lukasbach.com')
                    }}
                  >
                    Developed with <FontAwesomeIcon icon="heart" color={theme.colors.primary} />{' '}
                    & Typescript by Lukas Bach
                  </Box>
                )}
              />
            )}
          />
        </AppContainer>
      </Switch>
    </HashRouter>
  );
};
