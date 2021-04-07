import * as React from 'react';
import { Card } from '../ui/Card';
import { InputGroup } from '../ui/form/InputGroup';
import { TextInput } from '../ui/form/TextInput';
import { useApp } from '../AppRoot';
import { Button } from '../ui/Button';
import { CodeEditor } from '../ui/CodeEditor';
import { BottomBorderItem } from '../BottomBorderItem';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from '../ui/overlay/Tooltip';
import { Box } from '../ui/Box';

export const DocumentList: React.FC<{}> = props => {
  const {state, server} = useApp();
  const [search, setSearch] = useState('');

  const documents = Object.values(state.documents)
    .filter(document => search.length === 0 || (document.name + document.content).toLowerCase().includes(search.toLowerCase()));

  return (
    <Card>
      <Box display="flex">
        <Box flexGrow={1}>
          <InputGroup borderRadius="tl">
            <TextInput
              placeholder="Search..."
              value={search}
              onChangeValue={setSearch}
            />
          </InputGroup>
        </Box>
        <Box>
          <Button
            borderRadius="tr"
            embedded={true}
            icon="plus"
            primary={true}
            onClick={() => {
              server.documents.createDocument({
                name: 'New Document',
                content: '{}',
                contentType: 'application/json'
              });
            }}
          >
            Create Document
          </Button>
        </Box>
      </Box>

      {documents.map((document, id) => (
        <BottomBorderItem hasBorder={id !== Object.keys(documents).length - 1} key={document.id}>
          <CodeEditor
            value={document.content}
            title={document.name}
            collapsedDefaultValue={true}
            controls={(
              <Tooltip content="Edit Document">
                <Link to={`/documents/${document.id}`}>
                  <Button
                    minimal={true}
                    embedded={true}
                    ariaDescription={'Edit'}
                    icon={'pencil-alt'}
                    onClick={() => {}}
                  />
                </Link>
              </Tooltip>
            )}
          />
        </BottomBorderItem>
      ))}
    </Card>
  );
};
