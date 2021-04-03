import * as React from 'react';
import { useApp } from '../../mock/AppProvider';
import { Card } from '../ui/Card';
import { Padded } from '../ui/Padded';
import { LogicHandlerEditor } from './LogicHandlerEditor';
import { RepeaterHandlerEditor } from './RepeaterHandlerEditor';

export const HandlerCard: React.FC<{
  handlerId: string
}> = props => {
  const { getRoute, server, state } = useApp();
  const handler = state.handlers[props.handlerId];

  return (
    <Card>
      <Padded>
        {handler.name}
      </Padded>

      {handler.type === 'repeater' && (
        <RepeaterHandlerEditor handlerId={props.handlerId} />
      )}

      {handler.type === 'logic' && (
        <LogicHandlerEditor handlerId={props.handlerId} />
      )}
    </Card>
  );
};
