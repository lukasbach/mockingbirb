import * as React from 'react';
import { Box } from '../Box';
import { useTheme } from '../layout/ThemeProvider';

export const LabelText: React.FC<{}> = props => {
  const theme = useTheme();

  return (
    <Box
      margin="0"
      fontWeight="bold"
      color={theme.colors.muted}
      padding={theme.contentPadding}
    >
      { props.children }
    </Box>
  );
};
