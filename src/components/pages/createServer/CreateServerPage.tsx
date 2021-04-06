import * as React from 'react';
import { AppContainer } from '../../ui/layout/AppContainer';
import { AppHeader } from '../../header/AppHeader';
import { ServerList } from '../../serverlist/ServerList';
import { Tab, Tabs } from '../../ui/Tabs';
import { NewServerConfigCard } from './NewServerConfigCard';
import { useState } from 'react';
import { NewServerConfig } from './NewServerConfig';
import path from 'path';
import { remote } from 'electron';
import { Button } from '../../ui/Button';
import * as fs from 'fs';
import { useAlert } from '../../ui/overlay/useAlert';
import { useApp } from '../../AppRoot';
import { LocalPathInput } from '../../ui/form/LocalPathInput';
import { Card } from '../../ui/Card';

const defaultLocation = path.join(remote.app.getPath('desktop'), 'New Birb');

const isFolderEmpty = (location: string) => {
  return !fs.existsSync(location) || fs.readdirSync(location).length === 0;
}

export const CreateServerPage: React.FC<{}> = props => {
  const { createServer, addServer } = useApp();
  const [openAlert, alert] = useAlert();
  const [addServerLocation, setAddServerLocation] = useState(defaultLocation);
  const [newServerConfig, setNewServerConfig] = useState<NewServerConfig>({
    name: 'New Mockingbirb',
    port: 3000,
    initials: 'MB',
    location: defaultLocation
  });

  console.log(newServerConfig)

  return (
    <AppContainer
      title={(
        <AppHeader headerText="Create a new Server" />
      )}
      left={<ServerList />}
    >
      {alert}
      <Tabs>
        <Tab name="Create new Server">
          <NewServerConfigCard
            config={newServerConfig}
            onChange={c => setNewServerConfig(old => ({...old, ...c}))}
          />
          <Button onClick={async () => {
            if (!isFolderEmpty(newServerConfig.location)) {
              await openAlert({
                canCancel: false,
                content: 'The target folder exists and is not empty! Please make sure to choose a directory that does not exist yet or is empty.'
              });
              return;
            }

            try {
              await createServer(newServerConfig);
            } catch(e) {
              await openAlert({
                canCancel: false,
                content: 'The server could not be added: ' + e.message
              });
            }
          }}>
            Create
          </Button>
        </Tab>

        <Tab name="Add Server from Local Disk">
          <Card>
            <LocalPathInput
              value={addServerLocation}
              onChange={setAddServerLocation}
              label="Location on disk"
              dialog={{
                properties: ['createDirectory', 'openDirectory']
              }}
              isBottomOfCard={true}
              isTopOfCard={true}
            />
          </Card>
          <Button onClick={async () => {
            try {
              await addServer(addServerLocation);
            } catch(e) {
              await openAlert({
                canCancel: false,
                content: 'The server could not be added: ' + e.message
              });
            }
          }}>
            Add Server
          </Button>
        </Tab>
      </Tabs>
    </AppContainer>
  );
};
