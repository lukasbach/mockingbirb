import * as React from 'react';
import { Box } from '../Box';
import { useTheme } from './ThemeProvider';

export const AppContainer: React.FC<{
  menuContent?: JSX.Element;
  title?: JSX.Element;
  left?: JSX.Element;
}> = props => {
  const theme = useTheme();

  const draggable = {
    ['-webkit-app-region']: 'drag',
    ['-webkit-user-select']: 'none',
  };

  return (
    <Box display="flex" backgroundColor={theme.colors.background3} height="100%">
      <Box width="80px">
        { props.left }
      </Box>
      <Box display="flex" flexDirection="column" flexGrow={1}>
        <Box {...draggable}>
          {props.title}
        </Box>
        <Box
          flexGrow={1}
          backgroundColor={theme.colors.background}
          borderTopLeftRadius={theme.radius}
          display="flex"
        >
          <Box
            backgroundColor={theme.colors.background2}
            borderTopLeftRadius={theme.radius}
            width="280px"
            overflowX="auto"
            overflowY="auto"
          >
            {props.menuContent}
          </Box>
          <Box
            flexGrow={1}
            overflowX="auto"
            overflowY="auto"
            padding="20px"
          >
            {props.children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
