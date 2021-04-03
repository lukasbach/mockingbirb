import * as React from 'react';
import { Box } from '../Box';
import { useTheme } from './ThemeProvider';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const MenuListItem: React.FC<{
  rightContent?: JSX.Element;
  subtitle?: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: IconProp;
}> = props => {
  const theme = useTheme();

  return (
    <Box
      padding="10px 6px"
      margin="4px"
      borderRadius={theme.radius}
      cursor={props.selected ? 'default' : 'pointer'}
      textAlign="left"
      boxSizing="border-box"
      backgroundColor={props.selected ? theme.colors.minimalBackground : undefined}
      hover={props.selected ? undefined : {
        backgroundColor: theme.colors.minimalBackground
      }}
      elProps={{ onClick: props.onClick }}
      display="flex"
    >
      {props.icon && (
        <Box marginRight="8px">
          <FontAwesomeIcon icon={props.icon} />
        </Box>
      )}
      <Box
        display="flex"
        flexDirection="column"
      >
        <Box
          display="flex"
        >
          <Box flexGrow={1}>
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
