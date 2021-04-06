import * as React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import { Box } from './Box';
import { useTheme } from './layout/ThemeProvider';
import * as uuid from 'uuid';
import ReactDOM from 'react-dom';

interface TabContextValue {
  registerTab: (id: string, name: string) => void;
  deRegisterTab: (id: string) => void;
  clickTab: (id: string) => void;
  currentTab?: string;
  targetId: string;
}

const TabContext = React.createContext<TabContextValue>({
  deRegisterTab: () => {},
  registerTab: () => {},
  clickTab: () => {},
  currentTab: '',
  targetId: '',
});

export const Tabs: React.FC<{}> = props => {
  const targetId = useRef(uuid.v4());
  const [tabs, setTabs] = useState<Array<{ id: string, name: string }>>([]);
  const [currentTab, setCurrentTab] = useState<string>();
  const currentTabContent = (currentTab ? tabs.find(t => t.id === currentTab) : undefined) ?? tabs[0];

  return (
    <TabContext.Provider value={{
      registerTab: (id, name) => setTabs(t => [...t, { id, name }]),
      deRegisterTab: id => setTabs(t => t.filter(tab => tab.id !== id)),
      clickTab: id => setCurrentTab(id),
      currentTab: currentTab ?? tabs[0]?.id,
      targetId: targetId.current
    }}>
      <Box display="flex" marginBottom="10px">
        {props.children}
      </Box>
      <div id={targetId.current} />
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
    ctx.registerTab(id, props.name);
    return () => ctx.deRegisterTab(id);
  }, []);

  return (
    <>
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
      {selected && (
        <RenderTabContents>
          {props.children}
        </RenderTabContents>
      )}
    </>
  );
};

const RenderTabContents: React.FC = props => {
  const { targetId } = useContext(TabContext);
  return ReactDOM.createPortal(props.children, document.getElementById(targetId)!);
}
