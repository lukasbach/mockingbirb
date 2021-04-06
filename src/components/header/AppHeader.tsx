import * as React from 'react';
import { useApp } from '../AppRoot';
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

export const AppHeader: React.FC<{
  headerText?: string;
}> = props => {
  const [isMaximized, setIsMaximized] = useState(initialMaximizedState);

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
        {props.headerText && (
          <Box
            as="h1"
            margin="18px 0 8px 0"
          >
            {props.headerText}
          </Box>
        )}
        {props.children}
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
