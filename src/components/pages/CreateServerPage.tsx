import * as React from 'react';
import { AppContainer } from '../ui/layout/AppContainer';
import { AppHeader } from '../header/AppHeader';
import { ServerList } from '../serverlist/ServerList';

export const CreateServerPage: React.FC<{}> = props => {

  return (
    <AppContainer
      title={(
        <AppHeader headerText="Create a new Server" />
      )}
      left={<ServerList />}
    >
      asd
    </AppContainer>
  );
};
