import * as React from 'react';
import { HandlerCard } from './HandlerCard';
import { Heading } from '../ui/Heading';
import { useApp } from '../AppRoot';
import { Box } from '../ui/Box';
import { BottomBorderItem } from '../BottomBorderItem';
import { Link, Redirect } from 'react-router-dom';
import { Button } from '../ui/Button';
import { MethodTag } from '../ui/MethodTag';
import { Card } from '../ui/Card';
import { useScreenView } from '../../analytics';

export const HandlerEditor: React.FC<{
  handlerId: string;
}> = props => {
  useScreenView('handler_editor');
  const {state} = useApp();
  const handler = state.handlers[props.handlerId];

  if (!handler) {
    return (
      <Redirect to="/handlers" />
    )
  }

  const routes = state.routes.filter(route => route.handlers.includes(handler.id));

  return (
    <>
      <Heading level={1}>{handler.name}</Heading>
      <HandlerCard
        handlerId={props.handlerId}
        showEditLink={false}
      />

      <Heading level={2}>Routes</Heading>
      <Box as="p">
        {routes.length === 0 ? 'This handler is not used by any routes.' : `This handler is used by ${routes.length} routes:`}
      </Box>
      <Card>
        {routes.map((route, routeIdx) => (
          <Link to={`/route/${route.id}`}>
            <BottomBorderItem hasBorder={routeIdx !== routes.length - 1}>
              <Button
                fill={true} minimal={true} embedded={true}
                borderRadius={routes.length === 1 ? 'tl tr bl br' : routeIdx === 0 ? 'tl tr' : routeIdx == routes.length - 1 ? 'bl br' : undefined}
              >
                <MethodTag method={route.method} /> {route.route}
              </Button>
            </BottomBorderItem>
          </Link>
        ))}
      </Card>
    </>
  );
};
