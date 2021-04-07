import * as React from 'react';
import { HandlerCard } from './HandlerCard';
import { Heading } from '../ui/Heading';
import { useApp } from '../AppRoot';

export const HandlerEditor: React.FC<{
  handlerId: string;
}> = props => {
  const {state} = useApp();
  const handler = state.handlers[props.handlerId];

  return (
    <>
      <Heading level={1}>{handler.name}</Heading>
      <HandlerCard
        handlerId={props.handlerId}
        showEditLink={false}
      />
    </>
  );
};
