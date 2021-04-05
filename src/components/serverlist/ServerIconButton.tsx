import * as React from 'react';
import { Box } from '../ui/Box';
import { useTheme } from '../ui/layout/ThemeProvider';

export const ServerIconButton: React.FC<{
  color: string;
  active?: boolean;
  onClick?: () => void;
}> = props => {
  const theme = useTheme();

  return (
    <Box
      as="button"
      backgroundColor={props.active ? theme.colors.primary : theme.colors.background}
      color={theme.colors.text}
      borderRadius={props.active ? theme.radius : '9999px'}
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="50px"
      height="50px"
      marginBottom="10px"
      fontSize="16px"
      fontWeight="bold"
      cursor="pointer"
      transition=".05s all ease"
      hover={{
        boxShadow: `0 0 0 3px ${theme.colors.text}`
      }}
      elProps={{
        onClick: props.onClick
      }}
    >
      { props.children }
    </Box>
  );
};
