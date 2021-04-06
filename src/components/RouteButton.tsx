import * as React from 'react';
import { MenuListItem } from './ui/layout/MenuListItem';
import { Tag } from './ui/layout/Tag';
import { View } from './View';
import { MethodTag } from './ui/MethodTag';
import { MockedRouteConfiguration } from '../data/types';
import { useApp } from '../data/AppProvider';
import { useMemo } from 'react';
import ago from 's-ago';

export const RouteButton: React.FC<{
  route: MockedRouteConfiguration,
  onClick?: () => void,
  selected?: boolean
}> = ({ route, selected, onClick }) => {
  const { state, server } = useApp();

  const [subtitle, counter] = useMemo(() => {
    const events = state.events.filter(e => e.route === route.route);
    const lastEvent = events[events.length - 1];

    return [lastEvent ? ago(new Date(lastEvent.date)) : 'No events', events.length];
  }, [state.events, route]);

  return (
    <MenuListItem
      rightContent={<Tag background="background3">{counter}</Tag>}
      subtitle={subtitle}
      key={route.id}
      selected={selected}
      onClick={onClick}
    >
      <MethodTag method={route.method} /> {route.route}
    </MenuListItem>
  );
};
