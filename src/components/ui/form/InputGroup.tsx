import * as React from 'react';
import { Box } from '../Box';
import { ColorName, useTheme } from '../layout/ThemeProvider';
import { useRef, useState } from 'react';
import { BorderRadiusShorthand, getBorderRadii } from '../borderRadiusShorthand';

export interface InputGroupProps {
  borderRadius?: BorderRadiusShorthand;
  background?: ColorName;
}

export const InputGroup: React.FC<InputGroupProps> = props => {
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Box
      focusWithin={{
        boxShadow: `0 0 0 3px ${theme.colors.primary}`
      }}
      backgroundColor={(props.background ? theme.colors[props.background] : theme.colors.background3) as string}
      position="relative"
      zIndex={isFocused ? 200 : 100}
      overflow="hidden"
      elProps={{
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
      }}
      {...getBorderRadii(props.borderRadius, theme)}
      // elProps={{
      //   onClick: () => {
      //     const input = ref.current?.querySelector('input');
      //     if (input) {
      //       return input.focus();
      //     }
      //   },
      //   ref,
      // }}
    >
      {props.children}
    </Box>
  );
};
