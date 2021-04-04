import * as React from 'react';
import { useApp } from '../../data/AppProvider';
import { Card } from '../ui/Card';
import { Heading } from '../ui/Heading';
import { Padded } from '../ui/Padded';
import { LogicHandlerEditor } from './LogicHandlerEditor';
import { RepeaterHandlerEditor } from './RepeaterHandlerEditor';
import { LabelText } from '../ui/form/LabelText';
import { InputGroup } from '../ui/form/InputGroup';
import { Box } from '../ui/Box';
import { Button } from '../ui/Button';

export const HandlerCard: React.FC<{
  handlerId: string
}> = props => {
  const { getRoute, server, state } = useApp();
  const handler = state.handlers[props.handlerId];

  return (
    <>
      <Heading level={3}>{handler.name}</Heading>
      <Card>
        <Box display="flex">
          <Box flexGrow={1}>
            <LabelText>Type of Handler</LabelText>
          </Box>
          {!handler.if && (
            <Box>
              <Button
                icon="pencil-alt"
                embedded={true}
                minimal={true}
              />
              <Button
                icon="trash-alt"
                embedded={true}
                minimal={true}
              />
              <Button
                icon="code"
                embedded={true}
                minimal={true}
                borderRadius="tr"
              >
                Add Condition
              </Button>
            </Box>
          )}
        </Box>
        <InputGroup>
          <Padded>
            {handler.type}
          </Padded>
        </InputGroup>

        {handler.type === 'repeater' && (
          <RepeaterHandlerEditor handlerId={props.handlerId} />
        )}

        {handler.type === 'logic' && (
          <LogicHandlerEditor handlerId={props.handlerId} />
        )}
      </Card>
    </>
  );
};
