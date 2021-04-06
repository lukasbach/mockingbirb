import * as React from 'react';
import { Box } from '../Box';
import { useTheme } from './ThemeProvider';

export const AppContainer: React.FC<{
  menuContent?: JSX.Element;
  title?: JSX.Element;
  left?: JSX.Element;
  right?: JSX.Element;
}> = props => {
  const theme = useTheme();

  const draggable = {
    ['-webkit-app-region']: 'drag',
    ['-webkit-user-select']: 'none',
  };

  return (
    <Box
      display="flex"
      backgroundColor={theme.colors.background3}
      height="100%"
      css={{
        ' ::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        ' ::-webkit-scrollbar-track': {
          backgroundColor: 'transparent'
        },
        ' ::-webkit-scrollbar-thumb': {
          borderRadius: '4px',
          backgroundColor: theme.colors.scroll
        },
        ' ::-webkit-scrollbar-thumb:hover': {
          backgroundColor: theme.colors.scrollHover
        },
      }}
    >
      <Box width="80px" minWidth="80px">
        { props.left }
      </Box>
      <Box display="flex" flexDirection="column" flexGrow={1} maxWidth="100%" minWidth="0">
        <Box {...draggable}>
          {props.title}
        </Box>
        <Box
          flexGrow={1}
          backgroundColor={theme.colors.background}
          borderTopLeftRadius={theme.radius}
          display="flex"
          overflow="auto"
          flex="1"
        >
          {props.menuContent && (
            <Box
              backgroundColor={theme.colors.background2}
              borderTopLeftRadius={theme.radius}
              width="280px"
              overflowX="auto"
              overflowY="auto"
            >
              {props.menuContent}
            </Box>
          )}
          <Box
            flexGrow={1}
            overflowX="auto"
            overflowY="auto"
            flex="1"
            padding="20px 10px 20px 20px"
            minWidth="0"
          >
            {props.children}
          </Box>
          {props.right && (
            <Box
              overflowX="auto"
              overflowY="auto"
              padding="20px 20px 20px 10px"
              width="400px"
              minWidth="400px"
            >
              {props.right}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
