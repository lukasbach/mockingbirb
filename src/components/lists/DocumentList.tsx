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

export const DocumentList: React.FC<{}> = props => {
  const {state} = useApp();
  const [search, setSearch] = useState('');

  const documents = Object.values(state.documents)
    .filter(document => search.length === 0 || (document.name + document.content).toLowerCase().includes(search.toLowerCase()));

  return (
    <Card>
      <InputGroup>
        <TextInput
          placeholder="Search..."
          value={search}
          onChangeValue={setSearch}
        />
      </InputGroup>

      {documents.map((document, id) => (
        <BottomBorderItem hasBorder={id !== Object.keys(documents).length - 1} key={document.id}>
          <CodeEditor
            value={document.content}
            title={document.name}
            collapsedDefaultValue={true}
            controls={(
              <>
                <Link to={`/documents/${document.id}`}>
                  <Button
                    minimal={true}
                    embedded={true}
                    ariaDescription={'Edit'}
                    icon={'pencil-alt'}
                    onClick={() => {}}
                  />
                </Link>
              </>
            )}
          />
        </BottomBorderItem>
      ))}
    </Card>
  );
};
