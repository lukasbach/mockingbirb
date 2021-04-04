import * as React from 'react';
import { Box } from '../Box';
import { ColorName, useTheme } from './ThemeProvider';

export const Tag: React.FC<{
  background: ColorName | string;
}> = props => {
  const theme = useTheme();

  return (
    <Box
      backgroundColor={props.background in theme.colors ? (theme.colors as any)[props.background] : props.background}
      borderRadius={theme.radius}
      display="inline-block"
      padding="2px 6px"
      margin="0 2px"
    >
      { props.children }
    </Box>
  );
};
