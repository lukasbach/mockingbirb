import * as React from 'react';
import { OpenDialogOptions, remote } from 'electron';
import { Box } from '../Box';
import { InputGroup } from './InputGroup';
import { TextInput } from './TextInput';
import { LabelText } from './LabelText';
import { Button } from '../Button';

export const LocalPathInput: React.FC<{
  value: string;
  onChange?: (value: string) => void;
  dialog: OpenDialogOptions;
  label: string;
  isTopOfCard?: boolean;
  isBottomOfCard?: boolean;
}> = props => {
  return (
    <Box>
      <Box display="flex">
        <Box flexGrow={1}>
          <LabelText>
            {props.label}
          </LabelText>
        </Box>
        <Box>
          <Button
            minimal={true}
            embedded={true}
            borderRadius={props.isTopOfCard ? 'tr' : undefined}
            onClick={async () => {
              const result = await remote.dialog.showOpenDialog({
                buttonLabel: 'Choose',
                title: props.label,
                ...props.dialog
              });
              if (result.canceled || !result.filePaths[0]) return;
              props.onChange?.(result.filePaths[0]);
            }}
          >
            Choose...
          </Button>
        </Box>
      </Box>
      <Box>
        <InputGroup borderRadius={props.isBottomOfCard ? 'bl br' : undefined}>
          <TextInput
            onChangeValue={props.onChange}
            value={props.value}
          />
        </InputGroup>
      </Box>
    </Box>
  );
};


