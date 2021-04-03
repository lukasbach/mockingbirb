import * as React from 'react';
import { Box } from './Box';
import { useTheme } from './layout/ThemeProvider';

export const Padded: React.FC<{}> = props => {
  const theme = useTheme();

  return (
    <Box padding={theme.contentPadding}>
      { props.children }
    </Box>
  );
};
