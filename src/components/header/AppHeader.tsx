import * as React from 'react';
import { useApp } from '../../data/AppProvider';
import { Box } from '../ui/Box';
import { Heading } from '../ui/Heading';
import { Tag } from '../ui/layout/Tag';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { LabelText } from '../ui/form/LabelText';
import { useTheme } from '../ui/layout/ThemeProvider';
import { remote } from 'electron';
import { useEffect, useState } from 'react';

const initialMaximizedState = remote.getCurrentWindow().isMaximized();

export const AppHeader: React.FC<{}> = props => {
  const { state, server } = useApp();
  const [isMaximized, setIsMaximized] = useState(initialMaximizedState);
  const theme = useTheme();

  useEffect(() => {
    const onMaximize = () => setIsMaximized(true);
    const onUnmaximize = () => setIsMaximized(false);
    remote.getCurrentWindow().on('maximize', onMaximize);
    remote.getCurrentWindow().on('unmaximize', onUnmaximize);
    return () => {
      remote.getCurrentWindow().removeListener('maximize', onMaximize);
      remote.getCurrentWindow().removeListener('unmaximize', onUnmaximize)
    }
  }, []);

  const undraggable = {
    ['-webkit-app-region']: 'no-drag',
    ['-webkit-user-select']: 'auto',
  };

  return (
    <Box
      display="flex"
      marginBottom="8px"
    >
      <Box flexGrow={1}>
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
      </Box>

      <Box padding="10px 10px 0 0">
        <Card>
          <Box display="inline-flex" {...undraggable}>
            <Button
              icon="window-minimize"
              embedded={true}
              onClick={() => remote.getCurrentWindow().minimize()}
              borderRadius="tl bl"
            />
            {isMaximized ? (
              <Button
                icon="window-restore"
                embedded={true}
                onClick={() => remote.getCurrentWindow().unmaximize()}
              />
            ) : (
              <Button
                icon="window-maximize"
                embedded={true}
                onClick={() => remote.getCurrentWindow().maximize()}
              />
            )}
            <Button
              icon="times"
              embedded={true}
              onClick={() => remote.getCurrentWindow().close()}
              borderRadius="tr br"
            />
          </Box>
        </Card>
      </Box>
    </Box>
  );
};
