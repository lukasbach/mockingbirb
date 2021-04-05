import * as React from 'react';
import { Popover, PopoverProps } from './Popover';

export const Tooltip: React.FC<Omit<PopoverProps, 'content'> & { content: string | JSX.Element}> = props => {
  return (
    <Popover
      trigger="hover"
      positions={['top', 'bottom']}
      {...props}
      content={<>{props.content}</>}
    >
      { props.children }
    </Popover>
  );
};
