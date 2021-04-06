import * as React from 'react';
import { useApp } from '../AppRoot';
import { Card } from '../ui/Card';
import { Box } from '../ui/Box';
import { InputGroup } from '../ui/form/InputGroup';
import { TextInput } from '../ui/form/TextInput';
import { BottomBorderItem } from '../BottomBorderItem';
import { Button } from '../ui/Button';

export const EnvCard: React.FC<{}> = props => {
  const {state, server} = useApp();

  const updateEntry = (oldKey: string, key: string, value: string) => {
    const newEnv = {...state.env};

    if (oldKey !== key) {
      delete newEnv[oldKey];
    }

    newEnv[key] = value;
    server.updateState({ env: newEnv })
  };
  console.log(state.env)

  return (
    <Card>
      {Object.entries(state.env).sort((a, b) => a[0].localeCompare(b[0])).map(([ key, value ], idx) => (
        <BottomBorderItem hasBorder={true} key={idx}>{/* TODO improper reconcilement. key doesnt work either because then focus is lost */}
          <Box display="flex">
            <Box width="100px">
              <InputGroup borderRadius={idx === 0 ? 'tl' : undefined}>
                <TextInput
                  placeholder="Key"
                  value={key}
                  onChangeValue={newKey => {
                    updateEntry(key, newKey, value);
                  }}
                />
              </InputGroup>
            </Box>
            <Box flexGrow={1}>
              <InputGroup borderRadius={idx === 0 ? 'tr' : undefined}>
                <TextInput
                  placeholder="Value"
                  value={value}
                  onChangeValue={newValue => {
                    updateEntry(key, key, newValue);
                  }}
                />
              </InputGroup>
            </Box>
          </Box>
        </BottomBorderItem>
      ))}
      <Button
        minimal={true} embedded={true} fill={true} borderRadius="br bl"
        onClick={() => {
          let i = 0;
          for (; state.env[`entry${i}`] !== undefined; i++);
          server.updateState({ env: { ...state.env, [`entry${i}`]: '' } });
        }}
      >
        Add new entry
      </Button>
    </Card>
  );
};
