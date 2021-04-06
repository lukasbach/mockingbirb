import * as React from 'react';
import { Overlay, OverlayProps } from './Overlay';
import { Box } from '../Box';
import { useTheme } from '../layout/ThemeProvider';

export interface DialogProps {
  isOpen: boolean;
  title?: string | JSX.Element;
  closeButton?: boolean;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  footer?: JSX.Element;
  footerAlignRight?: boolean;
  onClose?: () => any;
  overlayProps?: Partial<OverlayProps>;
  autofocus?: boolean;
}

export const Dialog: React.FC<DialogProps> = props => {
  const theme = useTheme();
  return (
    <Overlay
      isOpen={props.isOpen}
      onClose={props.onClose}
      closeOnClickBackdrop={props.closeOnBackdrop ?? true}
      closeOnEscape={props.closeOnEscape ?? true}
      renderBackdrop={true}
      backdropColor="rgba(0, 0, 0, .4)"
      centerWithinBackdrop={true}
      autofocus={props.autofocus ?? true}
      renderContent={p => (
        <Box
          elProps={p}
          minWidth="400px"
          zIndex={350}
          backgroundColor={theme.colors.background3}
          borderRadius={theme.radius}
          display="flex"
          flexDirection="column"
        >
          {props.title && (
            <Box
              padding="20px 20px 0 20px"
            >
              <Box
                as="h1"
                margin="0"
                fontWeight={800}
                fontSize="32px"
              >
                {props.title}
              </Box>
            </Box>
          )}
          <Box flexGrow={1} padding="20px">
            {props.children}
          </Box>
          {props.footer && (
            <Box
              backgroundColor={theme.colors.background2}
              padding="20px"
              textAlign={props.footerAlignRight ? 'right' : 'left'}
              borderBottomLeftRadius={theme.radius}
              borderBottomRightRadius={theme.radius}
            >
              {props.footer}
            </Box>
          )}
        </Box>
      )}
      {...props.overlayProps}
    />
  );
};