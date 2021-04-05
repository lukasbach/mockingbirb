import * as React from 'react';
import { Padded } from './Padded';
import { ResizeSensor } from '@blueprintjs/core';
import { Box } from './Box';
import MonacoEditor from 'react-monaco-editor';
import { useCallback, useEffect, useRef, useState } from 'react';
import monaco, { editor } from 'monaco-editor';
import { Button } from './Button';
import { useTheme } from './layout/ThemeProvider';
import * as monacoEditor from 'monaco-editor';
import onWillDisposeModel = editor.onWillDisposeModel;

export interface CodeEditorProps {
  value: string,
  onChange?: (value: string) => void,
  title: string,
  collapsedDefaultValue?: boolean,
  onMount?: (editor: monaco.editor.IStandaloneCodeEditor, monaco: typeof monacoEditor) => void,
  onUnMount?: (editor: monaco.editor.IStandaloneCodeEditor, monaco: typeof monacoEditor) => void,
  controls?: JSX.Element;
}

export const CodeEditor: React.FC<CodeEditorProps> = props => {
  const theme = useTheme();
  const [collapsed, setCollapsed] = useState(props.collapsedDefaultValue ?? false);
  const [height, setHeight] = useState(1);
  const [width, setWidth] = useState(1);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  const monacoRef = useRef<typeof monacoEditor>();

  useEffect(() => {
    return () => props.onUnMount?.(monacoEditorRef.current!, monacoRef.current!);
  }, []);

  const updateEditorHeight = useCallback(() => {
    const editor = monacoEditorRef.current!;
    const contentHeight = editor.getContentHeight();
    setHeight(contentHeight);
    editor.layout();
  }, [width]);

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
          {props.controls}
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
          setWidth(entries[0].contentRect.width);
        }}>
          <Box maxWidth="100%" position="relative" zIndex={110}>
            <MonacoEditor
              height={height}
              width={width}
              language="javascript"
              theme="vs-dark"
              value={props.value}
              onChange={(value) => {
                props.onChange?.(value);
              }}
              options={{
                contextmenu: true,
                readOnly: !props.onChange,
                scrollBeyondLastLine: false,
                minimap: {
                  enabled: false
                },
                scrollbar: {
                  horizontal: 'hidden'
                }
              }}
              editorDidMount={(editor: monaco.editor.IStandaloneCodeEditor, monaco: typeof monacoEditor) => {
                monacoEditorRef.current = editor;
                monacoRef.current = monaco;

                editor.onDidContentSizeChange(updateEditorHeight);
                updateEditorHeight();

                props.onMount?.(editor, monaco);
              }}
            />
          </Box>
        </ResizeSensor>
      )}
    </>
  );
};
