import * as React from 'react';
import { useApp } from '../AppRoot';
import { useState } from 'react';
import { Card } from '../ui/Card';
import { InputGroup } from '../ui/form/InputGroup';
import { TextInput } from '../ui/form/TextInput';
import { BottomBorderItem } from '../BottomBorderItem';
import { Button } from '../ui/Button';
import { Box } from '../ui/Box';
import { useTheme } from '../ui/layout/ThemeProvider';
import { LabelText } from '../ui/form/LabelText';
import { handlerNames } from '../../texts';
import { Tag } from '../ui/layout/Tag';
import { Link } from 'react-router-dom';
import { MethodTag } from '../ui/MethodTag';
import { Tooltip } from '../ui/overlay/Tooltip';

export const HandlerList: React.FC<{}> = props => {
  const theme = useTheme();
  const {state} = useApp();
  const [search, setSearch] = useState('');
  const [expandedHandler, setExpandedHandler] = useState<string>();

  const handlers = Object.values(state.handlers)
    .filter(handler => search.length === 0 || handler.name.toLowerCase().includes(search.toLowerCase()));

  const expandedHandlerRoutes = expandedHandler ? state.routes.filter(route => route.handlers.includes(expandedHandler)) : [];

  return (
    <Card>
      <InputGroup>
        <TextInput
          placeholder="Search..."
          value={search}
          onChangeValue={setSearch}
        />
      </InputGroup>

      {handlers.map((handler, id) => (
        <BottomBorderItem hasBorder={id !== Object.keys(handlers).length - 1} key={handler.id}>
          <Box display="flex">
            <Box flexGrow={1}>
              <LabelText>{handler.name}</LabelText>
            </Box>
            <Box>
              <Tooltip content="Edit Handler">
                <Link to={`/handlers/${handler.id}`}>
                  <Button
                    icon={'pencil-alt'}
                    ariaDescription={'Edit'}
                    minimal={true}
                    embedded={true}
                  />
                </Link>
              </Tooltip>
              <Button
                icon={expandedHandler === handler.id ? 'chevron-up' : 'chevron-down'}
                ariaDescription={expandedHandler === handler.id ? 'Collapse' : 'Expand'}
                minimal={true}
                embedded={true}
                borderRadius={id === Object.keys(handlers).length - 1 && expandedHandler !== handler.id ? 'br' : undefined}
                onClick={() => {
                  if (expandedHandler === handler.id) {
                    setExpandedHandler(undefined);
                  } else {
                    setExpandedHandler(handler.id);
                  }
                }}
              />
            </Box>
          </Box>
          {expandedHandler === handler.id && (
            <Box background={theme.colors.background3}>
              <BottomBorderItem hasBorder={true}>
                <LabelText highlighted={true}>
                  {handlerNames[handler.type] ?? 'Unknown Handler type'}{' '}
                  {handler.if && <Tag background="primary">Condition</Tag>}
                  {handler.public && <Tag background="primary">Public</Tag>}
                  {handler.always && <Tag background="primary">Always</Tag>}
                </LabelText>
              </BottomBorderItem>
              <BottomBorderItem hasBorder={false}>
                <BottomBorderItem hasBorder={true}>
                  <LabelText highlighted={true}>
                    {expandedHandlerRoutes.length === 0 ? (
                      <>Used by no routes.</>
                    ) : (
                      <>Used by {expandedHandlerRoutes.length} routes:</>
                    )}
                  </LabelText>
                </BottomBorderItem>
                {expandedHandlerRoutes.map((route, routeIdx) => (
                  <Link to={`/route/${route.id}`}>
                    <BottomBorderItem hasBorder={routeIdx !== expandedHandlerRoutes.length - 1}>
                      <Button
                        fill={true} minimal={true} embedded={true}
                        borderRadius={routeIdx === expandedHandlerRoutes.length - 1 && id === handlers.length - 1 ? 'bl br' : undefined}
                      >
                        <MethodTag method={route.method} /> {route.route}
                      </Button>
                    </BottomBorderItem>
                  </Link>
                ))}
              </BottomBorderItem>
            </Box>
          )}
        </BottomBorderItem>
      ))}
    </Card>
  );
};
