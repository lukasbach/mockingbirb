import * as React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Box } from './Box';
import { useTheme } from './layout/ThemeProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const CenteredNotification: React.FC<{
  icon?: IconProp;
  title?: string | JSX.Element;
  content?: string | JSX.Element;
  actions?: string | JSX.Element;
}> = props => {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      height="100%"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      {props.icon && (
        <Box fontSize="80px" marginBottom="30px" color={theme.colors.muted}>
          <FontAwesomeIcon icon={props.icon} />
        </Box>
      )}
      {props.title && (
        <Box
          as="h1"
          color={theme.colors.text}
          margin="0 0 10px 0"
        >
          {props.title}
        </Box>
      )}
      {props.content && (
        <Box maxWidth="400px" color={theme.colors.muted} textAlign="center">
          {props.content}
        </Box>
      )}
      {props.actions && (
        <Box marginTop="20px">
          {props.actions}
        </Box>
      )}
    </Box>
  );
};
