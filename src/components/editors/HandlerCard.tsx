import * as React from 'react';
import { useApp } from '../AppRoot';
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
import { Tooltip } from '../ui/overlay/Tooltip';
import { defaultCodeImplementation, defaultHandlerImplementation } from '../../data/defaultCodeImplementation';
import { ScriptCodeEditor } from '../ui/ScriptCodeEditor';
import { useAlert } from '../ui/overlay/useAlert';
import { Link, useHistory } from 'react-router-dom';


function moveItem<T>(array: T[], from: number, to: number) {
  const arrayClone = [...array];
  const f = arrayClone.splice(from, 1)[0];
  arrayClone.splice(to, 0, f);
  console.log(array, arrayClone)
  return arrayClone;
}

export const HandlerCard: React.FC<{
  handlerId: string,
  routeId?: string,
  showEditLink?: boolean,
}> = props => {
  const history = useHistory();
  const { server, state } = useApp();
  const [alert, alertComponent] = useAlert();
  const route = useMemo(() => props.routeId ? state.routes.find(r => r.id === props.routeId) : undefined, [props.routeId, state]);
  const handler = state.handlers[props.handlerId];
  let indexInRoute = route ? route.handlers.indexOf(props.handlerId) : undefined;

  if (!handler) return null;

  return (
    <>
      { alertComponent }
      <Card>
        <BottomBorderItem hasBorder={true}>
          <Box display="flex">
            <Box flexGrow={1}>
              <LabelText highlighted={true}>
                {handlerNames[handler.type] ?? 'Unknown Handler type'}
              </LabelText>
            </Box>
            <Box>
              {route && (
                <>
                  <Tooltip content="Move handler up">
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
                  </Tooltip>
                  <Tooltip content="Move handler down">
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
                  </Tooltip>
                </>
              )}
              {props.showEditLink && (
                <Tooltip content="Edit Handler">
                  <Link to={`/handlers/${handler.id}`}>
                    <Button
                      icon="pencil-alt"
                      embedded={true}
                      minimal={true}
                    />
                  </Link>
                </Tooltip>
              )}
              <Tooltip content="Delete Handler">
                <Button
                  icon="trash-alt"
                  embedded={true}
                  minimal={true}
                  borderRadius={handler.if ? 'tr' : undefined}
                  onClick={() => {
                    if (route) {
                      alert({
                        okayText: 'Remove from Route',
                        cancelText: 'Delete Handler',
                        content: 'Do you just want to remove the handler from the Route or do you want to delete it completely? Deleting it will also make it unavailable for other routes.',
                        onOkay: () => {
                          if (route) {
                            server.routes.updateRoute(route.id, { handlers: route.handlers.filter(h => h !== handler.id) });
                          }
                        },
                        onCancel: () => {
                          server.handlers.deleteHandler(handler.id);
                        },
                        closeButton: false,
                        closeOnBackdrop: false,
                        closeOnEscape: false,
                      });
                    } else {
                      alert({
                        okayText: 'Delete',
                        cancelText: 'Cancel',
                        content: 'Are you sure you want to delete the Handler? Deleting it will also remove it from all routes.',
                        onOkay: () => {
                          history.push('/handlers')
                          server.handlers.deleteHandler(handler.id);
                        },
                      });
                    }
                  }}
                />
              </Tooltip>
              {!handler.if && (
                <Tooltip content="Add custom code to decide whether this handler should be executed for a HTTP request">
                  <Button
                    icon="code"
                    embedded={true}
                    minimal={true}
                    borderRadius="tr"
                    onClick={() => {
                      server.handlers.updateHandler(props.handlerId, { if: defaultHandlerImplementation })
                    }}
                  >
                    Add Condition
                  </Button>
                </Tooltip>
              )}
            </Box>
          </Box>
        </BottomBorderItem>

        {handler.if && (
          <BottomBorderItem hasBorder={true}>
            <ScriptCodeEditor
              returnType="boolean"
              title="Condition to run"
              value={handler.if}
              onChange={value => server.handlers.updateHandler(props.handlerId, { if: value })}
              collapsedDefaultValue={true}
              controls={(
                <Button
                  icon="trash-alt"
                  embedded={true}
                  minimal={true}
                  onClick={() => {
                    alert({
                      content: 'Do you want to delete the condition code from the handler?',
                      onOkay: () => {
                        server.handlers.updateHandler(props.handlerId, { if: undefined });
                      }
                    });
                  }}
                >
                  Remove Condition
                </Button>
              )}
            />
          </BottomBorderItem>
        )}

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
