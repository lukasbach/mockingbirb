import * as React from 'react';
import { Box } from '../Box';
import { Padded } from '../Padded';
import { useTheme } from '../layout/ThemeProvider';
import { FormEvent } from 'react';

export const SelectInput: React.FC<{
  value: string;
  onChange?: (e: FormEvent<HTMLSelectElement>) => void;
  onChangeValue?: (value: string) => void;
}> = props => {
  const theme = useTheme();

  return (
    <Box>
      <Box
        as="select"
        padding={theme.contentPadding}
        width="100%"
        fontSize="inherit"
        backgroundColor="inherit"
        color="inherit"
        display="block"
        border="none"
        outline="none"
        elProps={{
          value: props.value,
          onChange: (e: FormEvent<HTMLSelectElement>) => {
            props.onChange?.(e);
            props.onChangeValue?.((e.target as any).value);
          }
        } as any}
        css={{
          '> option': {
            backgroundColor: theme.colors.background,
          }
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
};
