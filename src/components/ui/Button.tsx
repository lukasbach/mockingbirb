import * as React from 'react';
import { HTMLProps, useRef } from 'react';
import { Box } from './Box';
import { useTheme } from './layout/ThemeProvider';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BorderRadiusShorthand, getBorderRadii } from './borderRadiusShorthand';

export type ButtonProps = {
  primary?: boolean;
  minimal?: boolean;
  icon?: IconProp;
  ariaDescription?: string;
  embedded?: boolean;
  fill?: boolean;
  borderRadius?: BorderRadiusShorthand;
  disabled?: boolean;
  alignCenter?: boolean;
} & HTMLProps<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = props => {
  const theme = useTheme();

  const {ariaDescription, minimal, embedded, fill, borderRadius, primary, ...elProps} = props;

  return (
    <Box
      as="button"
      backgroundColor={props.primary ? theme.colors.primary : props.minimal ? undefined : theme.colors.minimalBackground}
      borderRadius={props.embedded ? undefined : theme.radius} // TODO
      padding="12px 12px"
      margin={props.embedded ? undefined : '0 3px'}
      width={props.fill ? '100%' : undefined}
      height={props.embedded ? '100%' : undefined}
      cursor={props.disabled ? 'not-allowed' : 'pointer'}
      display={props.fill ? 'flex' : 'inline-flex'}
      justifyContent={props.alignCenter ? 'center' : 'left'}
      alignItems="center"
      flexDirection="row"
      position="relative"
      zIndex={100}
      color={props.disabled ? theme.colors.muted : theme.colors.text}
      elProps={{
        'aria-label': props.ariaDescription,
        'aria-disabled': props.disabled,
        disabled: props.disabled,
        ...elProps,
      }}
      hover={props.disabled ? undefined : {
        boxShadow: `0 0 0 3px ${props.primary ? theme.colors.text : theme.colors.primary}`,
        zIndex: 200,
      }}
      active={props.disabled ? undefined : {
        // backgroundColor: props.primary ? theme.colors.text : theme.colors.primary,
        boxShadow: `0 0 0 3px ${props.primary ? theme.colors.primary : theme.colors.text}`,
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
