import * as React from 'react';
import { HTMLProps } from 'react';
import { Box } from './Box';
import { useTheme } from './layout/ThemeProvider';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Button: React.FC<{
  primary?: boolean;
  minimal?: boolean;
  icon?: IconProp;
  ariaDescription?: string;
  embedded?: boolean;
} & HTMLProps<HTMLButtonElement>> = props => {
  const theme = useTheme();

  return (
    <Box
      as="button"
      backgroundColor={props.primary ? theme.colors.primary : props.minimal ? undefined : theme.colors.minimalBackground}
      borderRadius={props.embedded ? undefined : theme.radius} // TODO
      padding="12px 12px"
      margin={props.embedded ? undefined : '0 3px'}
      cursor="pointer"
      display="inline-flex"
      flexDirection="row"
      height={props.embedded ? '100%' : undefined}
      elProps={{
        'aria-label': props.ariaDescription,
        ariaDescription: undefined,
        minimal: undefined,
        embedded: undefined,
        ...props,
      }}
      hover={{
        boxShadow: `inset 0 0 0 3px ${props.primary ? theme.colors.text : theme.colors.primary}`,
      }}
      active={{
        backgroundColor: props.primary ? theme.colors.text : theme.colors.primary,
        color: props.primary ? theme.colors.background3 : undefined,
      }}
    >
      {props.icon && (
        <Box marginRight={props.children ? '6px' : undefined}>
          <FontAwesomeIcon icon={props.icon} />
        </Box>
      )}
      { props.children }
    </Box>
  );
};
