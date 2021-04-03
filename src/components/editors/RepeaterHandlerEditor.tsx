import * as React from 'react';
import { MockedHandlerDocumentRepeater, MockedHandlerLogic } from '../../mock/types';
import { useApp } from '../../mock/AppProvider';
import { SearchSelect } from '../ui/form/SearchSelect';
import { CodeEditor } from '../ui/CodeEditor';

export const RepeaterHandlerEditor: React.FC<{
  handlerId: string
}> = ({ handlerId }) => {
  const { server, state } = useApp();
  const handler = state.handlers[handlerId] as MockedHandlerDocumentRepeater;
  const document = state.documents[handler.documentId];
  console.log(handler)

  return (
    <>
      <SearchSelect
        fill={true}
        options={Object.values(state.documents).map(document => ({ value: document.id, title: document.name }))}
        value={handler.documentId}
        onChange={(documentId) => {
          server.updateHandler(handler.id, { documentId } as MockedHandlerDocumentRepeater);
        }}
        onCreate={(name) => {
          const documentId = server.createDocument({ name, content: '' });
          server.updateHandler(handler.id, { documentId } as MockedHandlerDocumentRepeater);
        }}
      />
      {document && (
        <CodeEditor
          value={document.content}
          title="Document Contents"
          collapsedDefaultValue={true}
        />
      )}
    </>
  );
};
