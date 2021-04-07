import * as React from 'react';
import { Button } from '../ui/Button';
import { Alert } from '../ui/overlay/Alert';
import { useMemo, useState } from 'react';
import { Card } from '../ui/Card';
import { SearchSelect } from '../ui/form/SearchSelect';
import { useApp } from '../AppRoot';
import { InputGroup } from '../ui/form/InputGroup';
import { Box } from '../ui/Box';

export const ChooseHandlerButton: React.FC<{
  label: string;
  onChoose: (handlerId: string) => void;
}> = props => {
  const [open, setOpen] = useState(false);
  const {state} = useApp();
  const [handlerId, setHandlerId] = useState<string>();
  const options = useMemo(() => {
    return Object.values(state.handlers)
      .map(handler => ({ title: handler.name, value: handler.id }));
  }, [state]);

  return (
    <>
      <Alert
        isOpen={open}
        title="Choose Handler"
        okayText="Add Handler"
        onClose={() => setOpen(false)}
        onOkay={() => !!handlerId ? props.onChoose(handlerId) : undefined}
      >
        <Card>
          <SearchSelect
            options={options}
            onChange={id => {
              console.log(id)
              setHandlerId(id);
            }}
            value={handlerId}
            fill={true}
            inputGroupProps={{
              borderRadius: 'tl tr bl br',
              background: 'background'
            }}
          />
        </Card>
        <Box as="p">
          You are about to add a handler from another route or one which was not associated
          with any route. This will not clone the handler, but share its state with the original
          handler.
        </Box>
      </Alert>
      <Button onClick={() => setOpen(true)}>{props.label}</Button>
    </>
  );
};
