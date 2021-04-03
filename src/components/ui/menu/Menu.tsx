import * as React from 'react';
import { Box } from '../Box';

export const Menu: React.FC<{}> = props => {
  return (
    <Box
      as="ul"
      display="flex"
      flexDirection="column"
      margin="0"
      padding="0"
    >
      { props.children }
    </Box>
  );
};
