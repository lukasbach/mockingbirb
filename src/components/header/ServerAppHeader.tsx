import * as React from 'react';
import { useApp } from '../AppRoot';
import { Box } from '../ui/Box';
import { Tag } from '../ui/layout/Tag';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { LabelText } from '../ui/form/LabelText';
import { useTheme } from '../ui/layout/ThemeProvider';
import { AppHeader } from './AppHeader';


export const ServerAppHeader: React.FC<{}> = props => {
  const { state, server } = useApp();
  const theme = useTheme();

  const undraggable = {
    ['-webkit-app-region']: 'no-drag',
    ['-webkit-user-select']: 'auto',
  };

  return (
    <AppHeader>
      <Box display="flex" alignItems="baseline">
        <Box>
          <Box
            as="h1"
            margin="18px 0 8px 0"
          >
            {state.name}
          </Box>
        </Box>
        <Box
          color={theme.colors.muted}
          fontSize="14px"
          flex="1"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          marginLeft="20px"
        >
          {state.location}
        </Box>
      </Box>

      <Box display="flex">
        <Box display="inline-block" marginRight="10px" {...undraggable}>
          <Card noMarginBottom={true}>
            <Box display="inline-flex">
              <Box>
                <LabelText>Server</LabelText>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                padding="0 8px"
              >
                <Tag background={state.isRunning ? 'primary' : 'background3'}>{state.isRunning ? `Running on Port ${state.port}` : 'Not running'}</Tag>
              </Box>
              <Box borderLeft={`1px solid ${theme.colors.background}`}>
                <Button
                  embedded={true}
                  onClick={() => {
                    if (state.isRunning) {
                      server.stop();
                    } else {
                      server.start();
                    }
                  }}
                  borderRadius="tr br"
                >
                  {state.isRunning ? 'Stop' : 'Start'}
                </Button>
              </Box>
            </Box>
          </Card>
        </Box>

        <Box {...undraggable}>
          <Button icon="pencil-alt">Edit Server</Button>
        </Box>
      </Box>
    </AppHeader>
  );
};
