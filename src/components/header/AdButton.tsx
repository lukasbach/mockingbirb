import * as React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Box } from '../ui/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from '../ui/layout/ThemeProvider';
import { Tooltip } from '../ui/overlay/Tooltip';
import { remote } from 'electron';

export const AdButton: React.FC<{
  icon: IconProp;
  title: string;
  url: string;
}> = props => {
  const theme = useTheme();

  return (
    <Tooltip content={props.title}>
      <Box
        as="button"
        borderRadius="999px"
        width="36px"
        height="36px"
        fontSize="20px"
        cursor="pointer"
        position="relative"
        zIndex={100}
        color={theme.colors.muted}
        hover={{
          backgroundColor: theme.colors.background2,
          color: theme.colors.text,
          boxShadow: `0 0 0 3px ${theme.colors.primary}`,
          zIndex: 200,
        }}
        active={{
          boxShadow: `0 0 0 3px ${theme.colors.text}`,
        }}
        elProps={{
          onClick: () => remote.shell.openExternal(props.url)
        }}
      >
        <FontAwesomeIcon icon={props.icon} />
      </Box>
    </Tooltip>
  );
};
