import * as React from 'react';
import { Padded } from './Padded';
import { ResizeSensor } from '@blueprintjs/core';
import { Box } from './Box';
import MonacoEditor from 'react-monaco-editor';
import { useRef, useState } from 'react';
import monaco from 'monaco-editor';
import { Button } from './Button';
import { useTheme } from './layout/ThemeProvider';

export const CodeEditor: React.FC<{
  value: string,
  onChange?: (value: string) => void,
  title: string,
  collapsedDefaultValue?: boolean,
}> = props => {
  const theme = useTheme();
  const [collapsed, setCollapsed] = useState(props.collapsedDefaultValue ?? false);
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor>()

  return (
    <>
      <Box display="flex">
        <Box
          flexGrow={1}
          fontWeight="bold"
          color={theme.colors.muted}
        >
          <Padded>
            {props.title}
          </Padded>
        </Box>
        <Box>
          <Button
            icon={collapsed ? 'chevron-down' : 'chevron-up'}
            onClick={() => setCollapsed(!collapsed)}
            minimal={true}
            ariaDescription={collapsed ? 'Expand' : 'Collapse'}
            embedded={true}
          />
        </Box>
      </Box>
      {!collapsed && (

        <ResizeSensor onResize={entries => {
          monacoRef.current?.layout({ width: entries[0].contentRect.width, height: 300 })
        }}>
          <Box maxWidth="100%" overflow="hidden">
            <MonacoEditor
              height="300"
              language="javascript"
              theme="vs-dark"
              value={props.value}
              onChange={(value) => {
                props.onChange?.(value);
              }}
              options={{
                //  automaticLayout: true
                contextmenu: true,
                readOnly: !props.onChange
              }}
              editorDidMount={(monaco: any) => {
                monacoRef.current = monaco;
              }}
            />
          </Box>
        </ResizeSensor>
      )}

      <span />
    </>
  );
};
