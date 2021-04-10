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
import { Box } from '../../ui/Box';
import { useTheme } from '../../ui/layout/ThemeProvider';
import { useScreenView } from '../../../analytics';

const defaultLocation = path.join(remote.app.getPath('desktop'), 'New Birb');

const PrivacyNotice: React.FC = () => {
  const theme = useTheme();
  return (
    <Box margin="8px 0" color={theme.colors.muted}>
      By using Mockingbirb, you accept{' '}
      <Box
        as="a"
        cursor="pointer"
        color={theme.colors.text}
        marginTop="10px"
        borderBottom={`1px solid ${theme.colors.text}`}
        hover={{
          color: theme.colors.primary,
          borderBottom: `3px solid ${theme.colors.primary}`
        }}
        elProps={{
          onClick: () => remote.shell.openExternal('https://github.com/lukasbach/mockingbirb/blob/master/privacy.md')
        }}
      >
        Mockingbirb's privacy policy
      </Box>.
      No personally identifiable data or mock configurations will be sent to external servers.
    </Box>
  )
}

const isFolderEmpty = (location: string) => {
  return !fs.existsSync(location) || fs.readdirSync(location).length === 0;
}

export const CreateServerPage: React.FC<{}> = props => {
  useScreenView('create_server');
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
      <Box maxWidth="600px">
        <Tabs>
          <Tab name="Create new Server">
            <NewServerConfigCard
              config={newServerConfig}
              onChange={c => setNewServerConfig(old => ({...old, ...c}))}
            />
            <PrivacyNotice />
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
            <PrivacyNotice />
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
      </Box>
    </AppContainer>
  );
};
