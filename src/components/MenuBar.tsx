import * as React from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { RouteButton } from './RouteButton';
import { MenuListItem } from './ui/layout/MenuListItem';
import { useApp } from './AppRoot';

export const MenuBar: React.FC<{}> = props => {
  const { state, server } = useApp();
  const location = useLocation();

  const routeMatch = matchPath(location?.pathname, {
    path: '/route/:routeId',
    exact: true
  });

  return (
    <>
      {state.routes.map(route => (
        <Link to={`/route/${route.id}`} key={route.id}>
          <RouteButton
            route={route}
            selected={(routeMatch?.params as any)?.routeId === route.id}
          />
        </Link>
      ))}

      <MenuListItem
        onClick={() => {
          const id = server.routes.createRoute({ route: '/*', method: 'ALL', handlers: [] });
        }}
        icon="plus"
      >
        Create new Route
      </MenuListItem>

      <Link to="/documents">
        <MenuListItem
          icon="file-alt"
          selected={!!matchPath(location?.pathname, { path: '/documents', exact: true })}
        >
          Documents
        </MenuListItem>
      </Link>

      <Link to="/handlers">
        <MenuListItem
          icon="code"
          selected={!!matchPath(location?.pathname, { path: '/handlers', exact: true })}
        >
          Handlers
        </MenuListItem>
      </Link>
    </>
  );
};
