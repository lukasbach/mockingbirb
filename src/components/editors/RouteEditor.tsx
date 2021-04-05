import * as React from 'react';
import { Heading } from '../ui/Heading';
import { Card } from '../ui/Card';
import { LabelText } from '../ui/form/LabelText';
import { Box } from '../ui/Box';
import { InputGroup } from '../ui/form/InputGroup';
import { SelectInput } from '../ui/form/SelectInput';
import { TextInput } from '../ui/form/TextInput';
import { useApp } from '../../data/AppProvider';
import { Button } from '../ui/Button';
import { Popover } from '../ui/overlay/Popover';
import { Menu } from '../ui/menu/Menu';
import { MenuItem } from '../ui/menu/MenuItem';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { Padded } from '../ui/Padded';
import { HandlerCard } from './HandlerCard';
import { EventList } from '../lists/EventList';
import { BottomBorderItem } from '../BottomBorderItem';

export const RouteEditor: React.FC<{
  routeId: string
}> = props => {
  const { getRoute, server, state } = useApp();
  const routeConfig = getRoute(props.routeId);

  if (!routeConfig) {
    return null;
  }

  console.log("Update ", routeConfig.route)

  return (
    <>
      <Heading level={1}>Route Configuration</Heading>
      <Card>
        <LabelText>
          <Box display="flex">
            <Box width="140px">
              Method
            </Box>
            <Box flexGrow={1}>
              Routing URL
            </Box>
          </Box>
        </LabelText>
        <Box display="flex">
          <Box width="140px">
            <InputGroup>
              <SelectInput
                value={routeConfig.method.toUpperCase()}
                onChangeValue={v => server.routes.updateRoute(props.routeId, { method: v.toLowerCase() })}
              >
                <option value="ALL">ALL</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
                <option value="OPTIONS">OPTIONS</option>
                <option value="COPY">COPY</option>
                <option value="HEAD">HEAD</option>
                <option value="LINK">LINK</option>
                <option value="UNLINK">UNLINK</option>
                <option value="PURGE">PURGE</option>
                <option value="LOCK">LOCK</option>
                <option value="UNLOCK">UNLOCK</option>
                <option value="PROPFIND">PROPFIND</option>
                <option value="VIEW">VIEW</option>
              </SelectInput>
            </InputGroup>
          </Box>
          <Box flexGrow={1}>
            <InputGroup>
              <TextInput
                placeholder="Placeholder"
                value={routeConfig.route}
                onChangeValue={(v) => {
                  server.routes.updateRoute(props.routeId, { route: v })
                }}
              />
            </InputGroup>
          </Box>
        </Box>
      </Card>

      <Heading level={1}>Handlers</Heading>
      <Popover positions={['bottom']} content={(
        <Menu>
          <MenuItem text="Mock Document" onClick={() => server.initializeNewHandlerFor(props.routeId, 'repeater')} />
          <MenuItem text="Mock multiple Documents" onClick={() => server.initializeNewHandlerFor(props.routeId, 'smartrepeater')} />
          <MenuItem text="Custom Handler" onClick={() => server.initializeNewHandlerFor(props.routeId, 'logic')} />
        </Menu>
      )}>
        <Button>Add Handler</Button>
      </Popover>

      {routeConfig.handlers.map(handlerId => (
        <HandlerCard handlerId={ handlerId } key={handlerId}/>
      ))}

      <Heading level={1}>Actions</Heading>
      <Card>
        <BottomBorderItem hasBorder={false}>
          <Box display="flex">
            <Box flexGrow={1}>
              <LabelText>
                Delete this route
              </LabelText>
            </Box>
            <Button
              minimal={true}
              embedded={true}
              borderRadius="tr br"
              icon="trash-alt"
              onClick={() => server.routes.deleteRoute(props.routeId)}
            >
              Delete
            </Button>
          </Box>
        </BottomBorderItem>
      </Card>

      <Heading level={1}>Events</Heading>
      <p>The following events have been recorded which matched this route.</p>
      <EventList filter={{ route: routeConfig.route }} wide={true} />
    </>
  );
};
