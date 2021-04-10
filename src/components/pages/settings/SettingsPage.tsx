import * as React from 'react';
import { AppContainer } from '../../ui/layout/AppContainer';
import { AppHeader } from '../../header/AppHeader';
import { ServerList } from '../../serverlist/ServerList';
import { Card } from '../../ui/Card';
import { Box } from '../../ui/Box';
import { Checkbox } from '../../ui/form/Checkbox';
import { useApp } from '../../AppRoot';
import { useTheme } from '../../ui/layout/ThemeProvider';
import { LabelText } from '../../ui/form/LabelText';
import { useEffect } from 'react';
import { setUseTelemetry, trackEvent, useScreenView } from '../../../analytics';

const colors = [
  '#DB8137',
  '#3498db',
  '#9b59b6',
  '#e74c3c',
  '#34495e',
  '#2ecc71',
];

export const SettingsPage: React.FC<{}> = props => {
  const { settings, writeSettings } = useApp();
  useScreenView('settings');
  const theme = useTheme();

  useEffect(() => {
    setUseTelemetry(settings.telemetry);
  }, [settings.telemetry]);

  return (
    <AppContainer
      title={(
        <AppHeader headerText="Settings" />
      )}
      left={<ServerList />}
    >
      <Card>
        <LabelText>Primary Color</LabelText>
        <Box display="flex" backgroundColor={theme.colors.background3} padding={theme.contentPadding}>
          {colors.map(color => (
            <Box
              as="button"
              key={color}
              cursor="pointer"
              width="30px"
              height="30px"
              borderRadius="9999px"
              backgroundColor={color}
              position="relative"
              boxShadow={settings.primaryColor !== color ? undefined : `0 0 0 3px ${theme.colors.text}`}
              hover={settings.primaryColor === color ? undefined : {
                boxShadow: `0 0 0 3px ${theme.colors.text}`,
              }}
              active={settings.primaryColor === color ? undefined : {
                boxShadow: `0 0 0 6px ${theme.colors.text}`,
              }}
              marginRight="10px"
              elProps={{
                onClick: () => {
                  trackEvent('settings_update_color');
                  writeSettings({ primaryColor: color });
                }
              }}
            >
            </Box>
          ))}
        </Box>
      </Card>

      <Card>
        <label>
          <Box display="flex" alignItems="center">
            <Checkbox
              value={settings.dark}
              borderRadius="tl"
              onChangeValue={(dark) => {
                trackEvent('settings_update_dark');
                writeSettings({ dark })
              }}
            />
            <Box flexGrow={1} marginLeft="10px">Dark UI</Box>
          </Box>
        </label>

        <label>
          <Box display="flex" alignItems="center">
            <Checkbox
              value={settings.telemetry}
              borderRadius="bl"
              onChangeValue={(telemetry) => writeSettings({ telemetry })}
            />
            <Box flexGrow={1} marginLeft="10px">Help Mockingbirb by reporting anonymized usage data</Box>
          </Box>
        </label>
      </Card>
    </AppContainer>
  );
};
