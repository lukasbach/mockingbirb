import * as React from 'react';
import { useApp } from '../../data/AppProvider';
import { Card } from '../ui/Card';
import { Heading } from '../ui/Heading';
import { Padded } from '../ui/Padded';
import { LogicHandlerEditor } from './LogicHandlerEditor';
import { RepeaterHandlerEditor } from './RepeaterHandlerEditor';
import { LabelText } from '../ui/form/LabelText';
import { InputGroup } from '../ui/form/InputGroup';
import { Box } from '../ui/Box';
import { Button } from '../ui/Button';
import { handlerNames } from '../../texts';
import { BottomBorderItem } from '../BottomBorderItem';
import { useMemo } from 'react';


function moveItem<T>(array: T[], from: number, to: number) {
  const arrayClone = [...array];
  const f = arrayClone.splice(from, 1)[0];
  arrayClone.splice(to, 0, f);
  return arrayClone;
}

export const HandlerCard: React.FC<{
  handlerId: string,
  routeId?: string
}> = props => {
  const { server, state } = useApp();
  const route = useMemo(() => props.routeId ? state.routes.find(r => r.id === props.routeId) : undefined, [props.routeId, state]);
  const handler = state.handlers[props.handlerId];
  let indexInRoute = route ? route.handlers.indexOf(props.handlerId) : undefined;

  return (
    <>
      <Heading level={3}>{handler.name}</Heading>
      <Card>
        <BottomBorderItem hasBorder={true}>
          <Box display="flex">
            <Box flexGrow={1}>
              <LabelText highlighted={true}>
                {handlerNames[handler.type] ?? 'Unknown Handler type'}
              </LabelText>
            </Box>
            {!handler.if && (
              <Box>
                {route && (
                  <>
                    <Button
                      icon="chevron-up"
                      embedded={true}
                      minimal={true}
                      disabled={indexInRoute === 0}
                      onClick={() => {
                        if (indexInRoute !== undefined) {
                          server.routes.updateRoute(route.id, {
                            handlers: moveItem(route.handlers, indexInRoute, indexInRoute - 1)
                          });
                        }
                      }}
                    />
                    <Button
                      icon="chevron-down"
                      embedded={true}
                      minimal={true}
                      disabled={indexInRoute === route?.handlers.length - 1}
                      onClick={() => {
                        if (indexInRoute !== undefined) {
                          server.routes.updateRoute(route.id, {
                            handlers: moveItem(route.handlers, indexInRoute, indexInRoute + 1)
                          });
                        }
                      }}
                    />
                  </>
                )}
                <Button
                  icon="pencil-alt"
                  embedded={true}
                  minimal={true}
                />
                <Button
                  icon="trash-alt"
                  embedded={true}
                  minimal={true}
                />
                <Button
                  icon="code"
                  embedded={true}
                  minimal={true}
                  borderRadius="tr"
                >
                  Add Condition
                </Button>
              </Box>
            )}
          </Box>
        </BottomBorderItem>

        {handler.type === 'repeater' && (
          <RepeaterHandlerEditor handlerId={props.handlerId} />
        )}

        {handler.type === 'logic' && (
          <LogicHandlerEditor handlerId={props.handlerId} />
        )}
      </Card>
    </>
  );
};
