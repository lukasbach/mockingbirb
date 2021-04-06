import * as React from 'react';
import cxs from 'cxs';
import ReactDOM from 'react-dom';
import { useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import FocusTrap from 'focus-trap-react';
import { useHotkey } from '@react-hook/hotkey';

const OVERLAY_ELEMENT_ID = 'birb-overlay';

export interface OverlayProps {
  renderBackdrop?: boolean;
  centerWithinBackdrop?: boolean;
  backdropColor?: string;
  handleBackdropMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  closeOnClickBackdrop?: boolean;
  closeOnEscape?: boolean;
  isOpen?: boolean;
  onClose?: () => any;
  renderContent: (props: React.HTMLAttributes<HTMLDivElement>) => React.ReactNode;
  noPointerEvents?: boolean;
  autofocus?: boolean;
}

const transition = {
  enter: {
    duration: 150,
    opacity: true,
    transform: 'translateY(20px) scale(.9)',
  },
  exit: {
    duration: 150,
    opacity: true,
    transform: 'translateY(20px) scale(.9)',
  },
};

const OverlayInner: React.FC<OverlayProps> = props => {
  useHotkey(
    document, 'esc',
    () => {
      if (props.closeOnEscape ?? true) {
        props.onClose?.();
      }
    }
  );

  const onMouseDown = useCallback(
    e => {
      if (props.closeOnClickBackdrop) {
        props.onClose?.();
      }
      props.handleBackdropMouseDown?.(e);
    },
    [props.closeOnClickBackdrop, props.onClose, props.handleBackdropMouseDown]
  );

  let className = '';

  if (props.renderBackdrop) {
    className = cxs({
      position: 'fixed',
      top: '0px',
      left: '0px',
      right: '0px',
      bottom: '0px',
      overflow: 'hidden',
      pointerEvents: props.noPointerEvents ? 'none' : undefined,
    });
  }

  let content = (
    <div className={className} onMouseDown={onMouseDown}>
      {props.renderContent({
        onMouseDown: e => e.stopPropagation(),
      })}
    </div>
  );

  if (props.autofocus ?? false) {
    content = <FocusTrap>{content}</FocusTrap>;
  }

  return (
    <div
      className={cxs({
        height: '100%',
        '> div': {
          height: '100%',
          backgroundColor: props.backdropColor ?? 'rgba(0, 0, 0, 0)',
          ...(props.centerWithinBackdrop
            ? {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }
            : {}),
        },
      })}
    >
      <CSSTransition
        in={props.isOpen}
        timeout={{
          enter: transition.enter.duration,
          exit: transition.exit.duration,
        }}
        unmountOnExit={true}
        classNames={{
          enter: cxs({
            '> div': {
              opacity: transition.enter.opacity ? 0 : undefined,
              transform: transition.enter.transform ?? undefined,
            },
            backgroundColor: 'rgba(0, 0, 0, 0) !important',
          }),
          enterActive: cxs({
            '> div': {
              opacity: transition.enter.opacity ? 1 : undefined,
              transition: `${transition.enter.duration}ms all ease`,
              transform: transition.enter.transform ? 'translateY(0) scale(1) !important' : undefined,
            },
            transition: `${transition.enter.duration}ms all ease`,
            backgroundColor: (props.backdropColor ?? 'rgba(0, 0, 0, 0)') + ' !important',
          }),
          exit: cxs({
            '> div': {
              opacity: transition.exit.opacity ? 1 : undefined,
              transform: transition.exit.transform ? 'translateY(0) scale(1)' : undefined,
            },
            backgroundColor: props.backdropColor ?? 'rgba(0, 0, 0, 0)',
          }),
          exitActive: cxs({
            '> div': {
              opacity: transition.exit.opacity ? '0 !important' : undefined,
              transform: transition.exit.transform
                ? transition.exit.transform + ' !important'
                : undefined,
              transition: `${transition.exit.duration}ms all ease`,
            },
            backgroundColor: 'rgba(0, 0, 0, 0) !important',
            transition: `${transition.enter.duration}ms all ease`,
          }),
        }}
      >
        {content}
      </CSSTransition>
    </div>
  );
};

export const Overlay: React.FC<OverlayProps> = props => {
  let el = document.getElementById(OVERLAY_ELEMENT_ID);

  if (!el) {
    el = document.createElement('div');
    el.id = OVERLAY_ELEMENT_ID;
    el.style.zIndex = '500';
    el.style.position = 'relative';
    document.body.appendChild(el);
  }

  return ReactDOM.createPortal(<OverlayInner {...props} />, el);
};