import * as React from 'react';
import { Box } from './Box';
import { useTheme } from './layout/ThemeProvider';

export const ResponseStatus: React.FC<{ status: number }> = ({status}) => {
  const theme = useTheme();
  return (
    <Box
      as="span"
      color={status < 300 ? theme.colors.green : status < 400 ? theme.colors.text : status < 500 ? theme.colors.orange : theme.colors.red}
    >
      { status }
    </Box>
  );
};
