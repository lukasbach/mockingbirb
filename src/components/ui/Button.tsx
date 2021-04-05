import * as React from 'react';
import { HTMLProps, useRef } from 'react';
import { Box } from './Box';
import { useTheme } from './layout/ThemeProvider';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BorderRadiusShorthand, getBorderRadii } from './borderRadiusShorthand';

export const Button: React.FC<{
  primary?: boolean;
  minimal?: boolean;
  icon?: IconProp;
  ariaDescription?: string;
  embedded?: boolean;
  fill?: boolean;
  borderRadius?: BorderRadiusShorthand;
} & HTMLProps<HTMLButtonElement>> = props => {
  const theme = useTheme();

  return (
    <Box
      as="button"
      backgroundColor={props.primary ? theme.colors.primary : props.minimal ? undefined : theme.colors.minimalBackground}
      borderRadius={props.embedded ? undefined : theme.radius} // TODO
      padding="12px 12px"
      margin={props.embedded ? undefined : '0 3px'}
      width={props.fill ? '100%' : undefined}
      height={props.embedded ? '100%' : undefined}
      cursor="pointer"
      display={props.fill ? 'flex' : 'inline-flex'}
      alignItems="center"
      flexDirection="row"
      position="relative"
      zIndex={100}
      elProps={{
        'aria-label': props.ariaDescription,
        ariaDescription: undefined,
        minimal: undefined,
        embedded: undefined,
        ...props,
      }}
      hover={{
        boxShadow: `0 0 0 3px ${props.primary ? theme.colors.text : theme.colors.primary}`,
        zIndex: 200,
      }}
      active={{
        // backgroundColor: props.primary ? theme.colors.text : theme.colors.primary,
        boxShadow: `0 0 0 3px ${props.primary ? theme.colors.primary : theme.colors.text}`,
        color: props.primary ? theme.colors.background3 : undefined,
      }}
      {...getBorderRadii(props.borderRadius, theme)}
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
