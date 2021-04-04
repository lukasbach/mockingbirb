import * as React from 'react';
import { Box } from './Box';
import { useTheme } from './layout/ThemeProvider';

export const Card: React.FC<{
  noMarginBottom?: boolean;
}> = props => {
  const theme = useTheme();
  return (
    <Box
      backgroundColor={theme.colors.background2}
      borderRadius={theme.radius}
      marginBottom={props.noMarginBottom ? undefined : '10px'}
      css={{
        '> :last-child': {
          borderBottomLeftRadius: theme.radius,
          borderBottomRightRadius: theme.radius,
        },
        '> :first-child': {
          borderTopLeftRadius: theme.radius,
          borderTopRightRadius: theme.radius,
        },
      }}
    >
      { props.children }
    </Box>
  );
};
