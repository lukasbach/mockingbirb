import * as React from 'react';
import { AppContainer } from '../../ui/layout/AppContainer';
import { AppHeader } from '../../header/AppHeader';
import { ServerList } from '../../serverlist/ServerList';

export const SettingsPage: React.FC<{}> = props => {

  return (
    <AppContainer
      title={(
        <AppHeader headerText="Settings" />
      )}
      left={<ServerList />}
    >
      Settings coming soon
    </AppContainer>
  );
};
