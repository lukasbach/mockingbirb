import * as React from 'react';
import { Box } from '../Box';
import { useTheme } from '../layout/ThemeProvider';
import { useRef, useState } from 'react';
import { BorderRadiusShorthand, getBorderRadii } from '../borderRadiusShorthand';

export const InputGroup: React.FC<{
  borderRadius?: BorderRadiusShorthand;
}> = props => {
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Box
      focusWithin={{
        boxShadow: `0 0 0 3px ${theme.colors.primary}`
      }}
      backgroundColor={theme.colors.background3}
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
