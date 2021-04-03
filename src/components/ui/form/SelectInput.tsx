import * as React from 'react';
import { Box } from '../Box';
import { Padded } from '../Padded';
import { useTheme } from '../layout/ThemeProvider';

export const SelectInput: React.FC<{}> = props => {
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
