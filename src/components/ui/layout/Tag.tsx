import * as React from 'react';
import { Box } from '../Box';
import { ColorName, useTheme } from './ThemeProvider';

export const Tag: React.FC<{
  background: ColorName;
}> = props => {
  const theme = useTheme();

  return (
    <Box
      backgroundColor={theme.colors[props.background]}
      borderRadius={theme.radius}
      display="inline-block"
      padding="2px 6px"
      margin="0 2px"
    >
      { props.children }
    </Box>
  );
};
