import * as React from 'react';
import { MockedHandlerDocumentRepeater, MockedHandlerLogic } from '../../data/types';
import { useApp } from '../../data/AppProvider';
import { SearchSelect } from '../ui/form/SearchSelect';
import { CodeEditor } from '../ui/CodeEditor';
import { Padded } from '../ui/Padded';
import { LabelText } from '../ui/form/LabelText';
import { Card } from '../ui/Card';

export const RepeaterHandlerEditor: React.FC<{
  handlerId: string
}> = ({ handlerId }) => {
  const { server, state } = useApp();
  const handler = state.handlers[handlerId] as MockedHandlerDocumentRepeater;
  const document = state.documents[handler.documentId];
  console.log(handler)

  return (
    <>
      <label>
        <LabelText>Document to return</LabelText>
        <SearchSelect
          fill={true}
          options={Object.values(state.documents).map(document => ({ value: document.id, title: document.name }))}
          value={handler.documentId}
          onChange={(documentId) => {
            server.updateHandler(handler.id, { documentId } as MockedHandlerDocumentRepeater);
          }}
          onCreate={(name) => {
            const documentId = server.documents.createDocument({ name, content: '{}', contentType: 'application/json' });
            server.updateHandler(handler.id, { documentId } as MockedHandlerDocumentRepeater);
          }}
        />
      </label>
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
