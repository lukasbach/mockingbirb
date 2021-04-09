import * as React from 'react';
import { Campaign } from '@lukasbach/campaigns-react';
import { Box } from '../ui/Box';
import { Heading } from '../ui/Heading';
import { Tag } from '../ui/layout/Tag';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useTheme } from '../ui/layout/ThemeProvider';
import { remote } from 'electron';
import { useEffect, useState } from 'react';
import { AdButton } from './AdButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const initialMaximizedState = remote.getCurrentWindow().isMaximized();

export const AppHeader: React.FC<{
  headerText?: string;
  campaign?: boolean;
}> = props => {
  const theme = useTheme();
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

      <Box padding="10px 10px 0 0" display="flex" flexDirection="column" alignItems="flex-end">
        <Box display="flex" alignItems="baseline">
          <Box marginRight="10px" {...undraggable}>
            <AdButton
              icon={'bug'}
              title="Report an issue"
              url="https://github.com/lukasbach/mockingbirb/issues"
            />
            <AdButton
              icon={['fab', 'twitter']}
              title="Tweet about Mockingbirb"
              url="https://twitter.com/intent/tweet?text=Checkout%20Mockingbirb,%20a%20easy-to-use%20HTTP%20mocking%20client&url=https://github.com/lukasbach/mockingbirb&hashtags=mock,app,server,http"
            />
            <AdButton
              icon={'globe'}
              title="lukasbach.com"
              url="https://lukasbach.com"
            />
            <AdButton
              icon={['fab', 'github']}
              title="GitHub Repository"
              url="https://github.com/lukasbach/mockingbirb"
            />
          </Box>
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

        {props.campaign && (
          <Campaign ignore={['mockingbirb']} changeInterval={60} dontRenderIfLoading={true} weighted={true} render={campaign => (
            <Box
              {...undraggable}
              padding="8px 12px"
              fontSize="12px"
              color={theme.colors.muted}
              borderRadius={theme.radius}
              backgroundColor={theme.colors.background}
              cursor="pointer"
              position="relative"
              zIndex={100}
              hover={{
                color: theme.colors.primary,
                boxShadow: `0 0 0 3px ${theme.colors.primary}`,
                zIndex: 200,
              }}
              elProps={{
                onClick: () => {
                  if (campaign) {
                    remote.shell.openExternal(campaign.url);
                  }
                }
              }}
            >
              {campaign ? (
                <>
                  <FontAwesomeIcon icon="link" style={{ marginRight: '4px' }} />
                  {campaign.product}: {campaign.short}
                </>
              ) : 'Loading...'}
            </Box>
          )} />
        )}
      </Box>
    </Box>
  );
};
