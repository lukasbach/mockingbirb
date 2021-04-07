import * as React from 'react';
import { useTheme } from '../layout/ThemeProvider';
import { Box } from '../Box';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export const MenuItem: React.FC<{
  text: string | JSX.Element;
  icon?: IconProp;
  onClick?: () => void;
}> = props => {
  const theme = useTheme();

  return (
    <Box
      as="button"
      textAlign="left"
      color={theme.colors.muted}
      hover={{
        color: theme.colors.text,
        backgroundColor: theme.colors.primary
      }}
      cursor="pointer"
      borderRadius={theme.radius}
      padding="8px 12px"
      elProps={{
        onMouseUp: () => {
          // TODO fixes weird issue with SearchSelect in Alert. Fix maybe?
          props.onClick?.();
        },
      }}
    >
      <Box
        as="li"
        display="flex"
        padding="0"
      >
        {props.icon && (
          <Box marginRight="4px">
            <FontAwesomeIcon icon={props.icon} />
          </Box>
        )}
        <Box
          flexGrow={1}
          fontWeight="bold"
        >
          { props.children }
          { props.text }
        </Box>
      </Box>
    </Box>
  );
};
