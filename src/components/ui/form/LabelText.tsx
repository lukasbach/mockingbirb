import * as React from 'react';
import { Box } from '../Box';
import { useTheme } from '../layout/ThemeProvider';

export const LabelText: React.FC<{
  highlighted?: boolean;
}> = props => {
  const theme = useTheme();

  return (
    <Box
      margin="0"
      fontWeight="bold"
      color={props.highlighted ? theme.colors.text : theme.colors.muted}
      padding={theme.contentPadding}
    >
      { props.children }
    </Box>
  );
};
