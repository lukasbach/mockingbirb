import * as React from 'react';
import { Box } from '../Box';
import { useTheme } from './ThemeProvider';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const MenuListItem: React.FC<{
  rightContent?: JSX.Element;
  subtitle?: string | JSX.Element;
  selected?: boolean;
  onClick?: () => void;
  icon?: IconProp;
}> = props => {
  const theme = useTheme();

  return (
    <Box
      padding="10px 6px"
      margin="6px 10px"
      borderRadius={theme.radius}
      cursor={props.selected ? 'default' : 'pointer'}
      textAlign="left"
      boxSizing="border-box"
      backgroundColor={props.selected ? theme.colors.background3 : undefined}
      outline="none"
      hover={props.selected ? undefined : {
        backgroundColor: theme.colors.background3
      }}
      elProps={{ onClick: props.onClick, tabIndex: 1 }}
      display="flex"
      color={theme.colors.text}
    >
      {props.icon && (
        <Box margin="0 8px">
          <FontAwesomeIcon icon={props.icon} />
        </Box>
      )}
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={1}
        maxWidth="100%"
      >
        <Box
          display="flex"
          flexGrow={1}
        >
          <Box
            flexGrow={1}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {props.children}
          </Box>
          {props.rightContent && (
            <Box>
              {props.rightContent}
            </Box>
          )}
        </Box>
        {props.subtitle && (
          <Box
            fontSize=".9em"
            color={theme.colors.muted}
            margin="2px 4px 0 4px"
          >
            {props.subtitle}
          </Box>
        )}
      </Box>
    </Box>
  );
};
