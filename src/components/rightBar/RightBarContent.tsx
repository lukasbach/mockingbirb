import * as React from 'react';
import { EventList } from '../lists/EventList';
import { Tab, Tabs } from '../ui/Tabs';
import { EnvCard } from '../editors/EnvCard';

export const RightBarContent: React.FC<{}> = props => {

  return (
    <Tabs>
      <Tab name="Events">
        <EventList />
      </Tab>
      <Tab name="Environment">
        <EnvCard />
      </Tab>
    </Tabs>
  );
};
