import * as React from 'react';
import { Box } from '../Box';
import { ChangeEvent, HTMLProps } from 'react';
import { useTheme } from '../layout/ThemeProvider';

export const TextInput = React.forwardRef<
  HTMLInputElement,
  HTMLProps<HTMLInputElement> & { onChangeValue?: (value: string, e: ChangeEvent<HTMLInputElement>) => void }
>((props, ref) => {
  const theme = useTheme();
  const {onChangeValue, onChange, ...elProps} = props;

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
        ...elProps,
        onChange: (e: any) => {
          onChangeValue?.(e.target.value, e);
          onChange?.(e);
        }
      } as any}
    />
  );
});
