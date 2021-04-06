import * as React from 'react';
import { Heading } from '../ui/Heading';
import { useApp } from '../AppRoot';
import { Card } from '../ui/Card';
import { LabelText } from '../ui/form/LabelText';
import { InputGroup } from '../ui/form/InputGroup';
import { TextInput } from '../ui/form/TextInput';
import { MimeSelect } from './MimeSelect';
import { CodeEditor } from '../ui/CodeEditor';
import { DocumentContentTypeMapper } from '../../data/DocumentContentTypeMapper';

export const DocumentEditor: React.FC<{
  documentId: string;
}> = props => {
  const {state, server} = useApp();
  const document = state.documents[props.documentId];

  return (
    <>
      <Heading level={1}>{document.name}</Heading>
      <Card>
        <label>
          <LabelText>Document Name</LabelText>
          <InputGroup>
            <TextInput
              placeholder="Document Name"
              onChangeValue={name => server.documents.updateDocument(document.id, { name })}
              value={document.name}
            />
          </InputGroup>
        </label>

        <label>
          <LabelText>Document Name</LabelText>
          <InputGroup>
            <MimeSelect
              value={document.contentType}
              onChange={contentType => server.documents.updateDocument(document.id, { contentType })}
            />
          </InputGroup>
        </label>

        <CodeEditor
          value={document.content}
          onChange={content => server.documents.updateDocument(document.id, { content })}
          title="Document Contents"
          collapsedDefaultValue={false}
          language={document.contentType === 'application/json' ? 'json' : 'text'}
        />
      </Card>
    </>
  );
};
