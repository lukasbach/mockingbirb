import * as React from 'react';
import { useApp } from '../AppRoot';
import { ServerIconButton } from './ServerIconButton';
import { useTheme } from '../ui/layout/ThemeProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '../ui/Box';
import { Tooltip } from '../ui/overlay/Tooltip';

export const ServerList: React.FC<{}> = props => {
  const { serverList, state, selectServer, openView, view } = useApp();
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding="24px 0"
      height="100%"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        flexGrow={1}
      >
        {serverList.map(server => (
          <Tooltip content={server.name} key={server.id} positions={['right']}>
            <ServerIconButton
              color={server.color}
              active={server.id === state.id && view === undefined}
              onClick={() => selectServer(server.id)}
            >
              {server.initials}
            </ServerIconButton>
          </Tooltip>
        ))}
        <Tooltip content="Create new Mocking Server" positions={['right']}>
          <ServerIconButton
            color={theme.colors.background}
            active={view === 'createServer'}
            onClick={() => openView('createServer')}
          >
            <FontAwesomeIcon icon="plus" />
          </ServerIconButton>
        </Tooltip>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Tooltip content="About Mockingbirb" positions={['right']}>
          <ServerIconButton
            color={theme.colors.background}
            active={view === 'about'}
            onClick={() => openView('about')}
          >
            <FontAwesomeIcon icon="question-circle" />
          </ServerIconButton>
        </Tooltip>
        <Tooltip content="Settings" positions={['right']}>
          <ServerIconButton
            color={theme.colors.background}
            active={view === 'settings'}
            onClick={() => openView('settings')}
          >
            <FontAwesomeIcon icon="cog" />
          </ServerIconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
