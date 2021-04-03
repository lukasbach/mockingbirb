import * as React from 'react';
import { Box } from '../Box';
import { useTheme } from '../layout/ThemeProvider';
import { useRef, useState } from 'react';

export const InputGroup: React.FC<{}> = props => {
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
