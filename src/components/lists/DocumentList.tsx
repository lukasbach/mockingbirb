import * as React from 'react';
import { Card } from '../ui/Card';
import { InputGroup } from '../ui/form/InputGroup';
import { TextInput } from '../ui/form/TextInput';
import { useApp } from '../../mock/AppProvider';
import { Box } from '../ui/Box';
import { Button } from '../ui/Button';
import { useState } from 'react';
import { useTheme } from '../ui/layout/ThemeProvider';
import { CodeEditor } from '../ui/CodeEditor';
import { Padded } from '../ui/Padded';

export const DocumentList: React.FC<{}> = props => {
  const theme = useTheme();
  const {state} = useApp();
  const [expandedDocument, setExpandedDocument] = useState<string>();

  return (
    <Card>
      <InputGroup>
        <TextInput
          defaultValue="Search..."
        />
      </InputGroup>

      {Object.values(state.documents).map((document, id) => (
        <Box borderBottom={id !== Object.keys(state.documents).length - 1 ? `1px solid ${theme.colors.backgroundMenu}` : undefined}>
          <Box
            key={document.id}
            display="flex"
            alignItems="center"
          >
            <Box flexGrow={1} fontWeight="bold">
              <Padded>
                {document.name}
              </Padded>
            </Box>
            <Box>
              <Button
                minimal={true}
                embedded={true}
                ariaDescription={'Edit'}
                icon={'pencil-alt'}
                onClick={() => {}}
              />
              <Button
                minimal={true}
                embedded={true}
                ariaDescription={expandedDocument === document.id ? 'Collapse' : 'Peek'}
                icon={expandedDocument === document.id ? 'chevron-up' : 'chevron-down'}
                onClick={() => setExpandedDocument(expandedDocument === document.id ? undefined : document.id)}
              />
            </Box>
          </Box>

          {expandedDocument === document.id && (
            <CodeEditor
              value={document.content}
              onChange={() => {}}
              title="Document Contents"
              collapsedDefaultValue={false}
            />
          )}
        </Box>
      ))}
    </Card>
  );
};
