import * as React from 'react';
import { Box } from '../Box';
import { ChangeEvent, HTMLProps } from 'react';
import { useTheme } from '../layout/ThemeProvider';

export const TextInput = React.forwardRef<
  HTMLInputElement,
  HTMLProps<HTMLInputElement> & { onChangeValue?: (value: string, e: ChangeEvent<HTMLInputElement>) => void }
>((props, ref) => {
  const theme = useTheme();
  return (
    <Box
      as="input"
      fontSize="inherit"
      backgroundColor="inherit"
      color="inherit"
      display="block"
      border="none"
      width="100%"
      outline="none"
      padding={theme.contentPadding}
      ref={ref}
      elProps={{
        ...props,
        onChangeValue: undefined,
        onChange: (e: any) => {
          props.onChangeValue?.(e.target.value, e);
          props.onChange?.(e);
        }
      } as any}
    />
  );
});
