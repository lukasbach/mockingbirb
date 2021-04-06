import * as React from 'react';
import { Card } from '../ui/Card';
import { Heading } from '../ui/Heading';
import { LabelText } from '../ui/form/LabelText';
import { InputGroup } from '../ui/form/InputGroup';
import { TextInput } from '../ui/form/TextInput';
import { useApp } from '../AppRoot';
import { Box } from '../ui/Box';
import { Button } from '../ui/Button';
import { remote } from 'electron';
import { useAlert } from '../ui/overlay/useAlert';
import { BottomBorderItem } from '../BottomBorderItem';

export const ServerSettings: React.FC<{}> = props => {
  const { state, server, deleteServer, removeServer } = useApp();
  const [openAlert, alert] = useAlert();

  return (
    <>
      {alert}
      <Heading level={1}>Server Settings</Heading>

      <Card>
        <Box display="flex">
          <Box flexGrow={1}>
            <label>
              <LabelText>
                Server Name
              </LabelText>
              <InputGroup>
                <TextInput
                  value={state.name}
                  onChangeValue={name => {
                    const pieces = name.split(/(?=[A-Z])/).map(p => p[0]?.toUpperCase());
                    if (pieces.length === 2) {
                      server.updateState({ name, initials: pieces.join('') });
                    } else {
                      server.updateState({ name });
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
                  value={state.initials}
                  onChangeValue={initials => {
                    if (initials.length <= 2) {
                      server.updateState({ initials })
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
              value={state.port}
              onChangeValue={port => server.updateState({ port: parseInt(port) })}
            />
          </InputGroup>
        </label>

        <Box display="flex">
          <Box flexGrow={1}>
            <LabelText>
              Location on disk
            </LabelText>
          </Box>
          <Box>
            <Button
              embedded={true}
              minimal={true}
              onClick={() => remote.shell.openPath(state.location)}
            >
              Reveal in file explorer
            </Button>
          </Box>
        </Box>
        <InputGroup>
          <TextInput readOnly={true} value={state.location} />
        </InputGroup>
      </Card>

      <Heading level={1}>Actions</Heading>

      <Card>
        <BottomBorderItem hasBorder={true}>
          <Box display="flex">
            <Box flexGrow={1}>
              <LabelText>
                Delete server data from disk
              </LabelText>
            </Box>
            <Box>
              <Button
                embedded={true}
                minimal={true}
                borderRadius="tr"
                onClick={() => {
                  openAlert({
                    content: 'Are you sure you want to delete this Server Mock? The files will be removed from disk and cannot be recovered!',
                    onOkay: () => deleteServer(state.id)
                  })
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </BottomBorderItem>

        <Box display="flex">
          <Box flexGrow={1}>
            <LabelText>
              Remove Mock from Mockingbirb
            </LabelText>
          </Box>
          <Box>
            <Button
              embedded={true}
              minimal={true}
              borderRadius="br"
              onClick={() => {
                openAlert({
                  content: `Are you sure you want to remove the Mock from Mockingbirb? The mock files will remain at ${state.location}`,
                  onOkay: () => removeServer(state.id)
                })
              }}
            >
              Remove
            </Button>
          </Box>
        </Box>
      </Card>
    </>
  );
};
