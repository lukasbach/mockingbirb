import * as React from 'react';
import { useApp } from '../data/AppProvider';
import { LeftIconButton } from './ui/LeftIconButton';
import { useTheme } from './ui/layout/ThemeProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from './ui/Box';

export const LeftList: React.FC<{}> = props => {
  const { serverList, state, selectServer, createServer } = useApp();
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      paddingTop="24px"
    >
      {serverList.map(server => (
        <LeftIconButton
          color={server.color}
          active={server.id === state.id}
          onClick={() => selectServer(server.id)}
        >
          {server.initials}
        </LeftIconButton>
      ))}
      <LeftIconButton
        color={theme.colors.background}
        active={false}
        onClick={() => createServer()}
      >
        <FontAwesomeIcon icon="plus" />
      </LeftIconButton>
    </Box>
  );
};
