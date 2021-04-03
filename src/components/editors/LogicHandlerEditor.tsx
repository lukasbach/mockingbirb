import * as React from 'react';
import { MockedHandlerDocumentRepeater, MockedHandlerLogic } from '../../mock/types';
import { CodeEditor } from '../ui/CodeEditor';
import { useApp } from '../../mock/AppProvider';

export const LogicHandlerEditor: React.FC<{
  handlerId: string
}> = ({ handlerId }) => {
  const { server, state } = useApp();
  const handler = state.handlers[handlerId] as MockedHandlerLogic;

  return (
    <CodeEditor
      value={handler.code}
      onChange={code => server.updateHandler(handler.id, { code } as MockedHandlerLogic)}
      title="Handler Implementation"
    />
  );
};