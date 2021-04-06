import * as React from 'react';
import { Card } from '../../ui/Card';
import { Box } from '../../ui/Box';
import { LabelText } from '../../ui/form/LabelText';
import { InputGroup } from '../../ui/form/InputGroup';
import { TextInput } from '../../ui/form/TextInput';
import { Button } from '../../ui/Button';
import { remote } from 'electron';
import { NewServerConfig } from './NewServerConfig';
import { LocalPathInput } from '../../ui/form/LocalPathInput';

export const NewServerConfigCard: React.FC<{
  config: NewServerConfig,
  onChange: (config: Partial<NewServerConfig>) => void,
}> = ({config, onChange}) => {
  console.log(config)

  return (
    <Card>
      <Box display="flex">
        <Box flexGrow={1}>
          <label>
            <LabelText>
              Server Name
            </LabelText>
            <InputGroup>
              <TextInput
                value={config.name}
                onChangeValue={name => {
                  const pieces = name.split(/(?=[A-Z])/).map(p => p[0]?.toUpperCase());
                  if (pieces.length === 2) {
                    onChange({ name, initials: pieces.join('') });
                  } else {
                    onChange({ name });
                  }
                }}
              />
            </InputGroup>
          </label>
        </Box>
        <Box width="100px">
          <label>
            <LabelText>
              Initials
            </LabelText>
            <InputGroup>
              <TextInput
                value={config.initials}
                onChangeValue={initials => {
                  if (initials.length <= 2) {
                    onChange({ initials })
                  }
                }}
              />
            </InputGroup>
          </label>
        </Box>
      </Box>

      <label>
        <LabelText>
          Server Port
        </LabelText>
        <InputGroup>
          <TextInput
            type="number"
            value={config.port}
            onChangeValue={port => onChange({ port: parseInt(port) })}
          />
        </InputGroup>
      </label>

      <LocalPathInput
        value={config.location}
        onChange={(location) => onChange({ location })}
        label="Location on disk"
        dialog={{
          properties: ['createDirectory', 'openDirectory']
        }}
        isBottomOfCard={true}
      />
    </Card>
  );
};
