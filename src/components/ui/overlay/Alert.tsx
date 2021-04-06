import * as React from 'react';
import { Button } from '../Button';
import { Dialog, DialogProps } from './Dialog';
import { Box } from '../Box';

export type AlertProps = DialogProps & {
  cancelText?: string;
  okayText?: string;
  canCancel?: boolean;
  content?: JSX.Element | string;
  onCancel?: () => void;
  onOkay?: () => void;
};

export const Alert: React.FC<AlertProps> = props => {
  const canCancel = props.canCancel ?? true;

  return (
    <Dialog
      footerAlignRight={true}
      footer={(
        <>
          {canCancel && (
            <Button onClick={() => {
              props.onClose?.();
              props.onCancel?.();
            }}>
              {props.cancelText ?? 'Cancel'}
            </Button>
          )}
          <Button
            primary={true}
            ref={r => r?.focus()}
            onClick={() => {
              props.onClose?.();
              props.onOkay?.();
            }}
          >
            {props.okayText ?? 'Okay'}
          </Button>
        </>
      )}
      closeOnEscape={canCancel}
      closeButton={canCancel}
      closeOnBackdrop={canCancel}
      onClose={() => {
        props.onClose?.();
        props.onCancel?.();
      }}
      {...props}
    >
      <Box maxWidth="400px">
        {props.content}
        {props.children}
      </Box>
    </Dialog>
  );
};
