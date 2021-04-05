import * as React from 'react';
import { Box } from './Box';
import { useTheme } from './layout/ThemeProvider';

export const Heading: React.FC<{
  level: 1 | 2 | 3 | 4 | 5 | 6;
  noTopMargin?: boolean;
}> = props => {
  const theme = useTheme();

  return (
    <Box
      as={`h${props.level}` as 'h1'}
      color={props.level < 2 ? theme.colors.muted : theme.colors.text}
      margin="0"
      marginBottom="15px"
      marginTop={!props.noTopMargin ? (props.level === 1 ? '40px' : '28px') : undefined}
      fontWeight="bolder"
      fontSize={(() => {
        switch (props.level) {
          case 1:
            return '22px';
          case 2:
            return '18px';
          case 3:
            return '14px';
          case 4:
            return '12px';
          case 5:
            return '12px';
          case 6:
            return '12px';
        }
      })()}
    >
      { props.children }
    </Box>
  );
};
