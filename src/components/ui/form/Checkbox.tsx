import * as React from 'react';
import { Button, ButtonProps } from '../Button';
import { Box } from '../Box';

export const Checkbox: React.FC<{
  onChangeValue?: (value: boolean) => void;
  value: boolean;
} & Omit<ButtonProps, 'value'>> = props => {
  return (
    <Box width="42px" height="42px">
      <Button
        onClick={() => props.onChangeValue?.(!props.value)}
        icon={props.value ? 'check' : 'times'}
        ariaDescription={props.value ? 'Click to uncheck' : 'Click to check'}
        embedded={true}
        fill={true}
        {...props}
        value={undefined}
      />
    </Box>
  );
};
