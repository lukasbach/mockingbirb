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
import { Box } from '../ui/Box';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/overlay/Tooltip';
import { useAlert } from '../ui/overlay/useAlert';
import { Redirect } from 'react-router-dom';
import { useScreenView } from '../../analytics';

export const DocumentEditor: React.FC<{
  documentId: string;
}> = props => {
  useScreenView('document_editor');
  const {state, server} = useApp();
  const [openAlert, alert] = useAlert();
  const document = state.documents[props.documentId];

  if (!document) {
    return (
      <Redirect to="/documents" />
    )
  }

  return (
    <>
      {alert}
      <Heading level={1}>{document.name}</Heading>
      <Card>
        <Box display="flex">
          <Box flexGrow={1}>
            <LabelText>Document Name</LabelText>
          </Box>
          <Box>
            <Tooltip content="Delete Document">
              <Button
                embedded={true}
                minimal={true}
                ariaDescription="Delete Document"
                icon="trash"
                borderRadius="tr"
                onClick={() => {
                  openAlert({
                    content: 'Are you sure you want to delete the document?',
                    okayText: 'Delete',
                    onOkay: () => {
                      server.documents.deleteDocument(document.id);
                    }
                  })
                }}
              />
            </Tooltip>
          </Box>
        </Box>
        <InputGroup>
          <TextInput
            placeholder="Document Name"
            onChangeValue={name => server.documents.updateDocument(document.id, { name })}
            value={document.name}
          />
        </InputGroup>

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
