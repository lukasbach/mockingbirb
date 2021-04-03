import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Box } from './Box';
import { useTheme } from './layout/ThemeProvider';

interface TabContextValue {
  registerTab: (id: string, name: string, content: React.ReactNode) => void;
  deRegisterTab: (id: string) => void;
  clickTab: (id: string) => void;
  currentTab?: string;
}

const TabContext = React.createContext<TabContextValue>({
  deRegisterTab: () => {},
  registerTab: () => {},
  clickTab: () => {},
  currentTab: '',
});

export const Tabs: React.FC<{}> = props => {
  const [tabs, setTabs] = useState<Array<{ id: string, name: string, content: React.ReactNode }>>([]);
  const [currentTab, setCurrentTab] = useState<string>();
  const currentTabContent = (currentTab ? tabs.find(t => t.id === currentTab) : undefined) ?? tabs[0];

  return (
    <TabContext.Provider value={{
      registerTab: (id, name, content) => setTabs(t => [...t, { id, name, content }]),
      deRegisterTab: id => setTabs(t => t.filter(tab => tab.id !== id)),
      clickTab: id => setCurrentTab(id),
      currentTab: currentTab ?? tabs[0]?.id,
    }}>
      <Box display="flex">
        {props.children}
      </Box>
      {currentTabContent?.content}
    </TabContext.Provider>
  );
};

export const Tab: React.FC<{
  id?: string;
  name: string;
}> = props => {
  const theme = useTheme();
  const ctx = useContext(TabContext);
  const id = props.id ?? props.name
  const selected = id === ctx.currentTab;

  useEffect(() => {
    ctx.registerTab(id, props.name, props.children);
    return () => ctx.deRegisterTab(id);
  }, []);

  return (
    <Box
      as="button"
      elProps={{
        onClick: () => ctx.clickTab(id),
        'aria-disabled': selected
      }}
      cursor={!selected ? 'pointer' : undefined}
      padding="8px 12px"
      margin="0 6px 4px 6px"
      borderRadius={theme.radius}
      backgroundColor={selected ? theme.colors.minimalBackground : undefined}
      color={selected ? theme.colors.text : theme.colors.muted}
      fontWeight={600}
      hover={!selected ? {
        color: theme.colors.text,
        // backgroundColor: theme.colors.minimalBackground,
      } : undefined}
    >
      { props.name }
    </Box>
  );
};
