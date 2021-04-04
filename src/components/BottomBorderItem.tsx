import * as React from 'react';
import { Box } from './ui/Box';
import { useTheme } from './ui/layout/ThemeProvider';

export const BottomBorderItem: React.FC<{
  hasBorder: boolean
}> = props => {
  const theme = useTheme();
  return (
    <Box
      borderBottom={props.hasBorder ? `1px solid ${theme.colors.backgroundMenu}` : undefined}
    >
      { props.children }
    </Box>
  );
};
