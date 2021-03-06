import * as React from 'react';
import { Popover as PopoverComponent, ArrowContainer, PopoverProps as LibPopoverProps } from 'react-tiny-popover';
import { HTMLProps, useState } from 'react';
import { Box } from '../Box';
import { useTheme } from '../layout/ThemeProvider';

export type PopoverProps = {
  trigger?: 'manual' | 'hover' | 'click';
  isOpen?: boolean;
  fill?: boolean;
} & Omit<LibPopoverProps, 'isOpen' | 'children'>;

export const Popover: React.FC<PopoverProps> = props => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const trigger = props.trigger ?? 'click';

  return (
    <div style={{ display: props.fill ? undefined : 'inline-block' }}>
      <PopoverComponent
        isOpen={props.isOpen ?? open}
        // padding={10}
        onClickOutside={e => {
          if (props.trigger !== 'manual') {
            setOpen(false);
          }
          props.onClickOutside?.(e);
        }}
        {...props}
        content={(contentProps) => (
          <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
            position={contentProps.position}
            childRect={contentProps.childRect}
            popoverRect={contentProps.popoverRect}
            arrowColor={theme.colors.backgroundMenu}
            arrowSize={10}
            arrowStyle={{ opacity: 0.7 }}
            className='popover-arrow-container'
            arrowClassName='popover-arrow'
          >
            <Box
              backgroundColor={theme.colors.backgroundMenu}
              borderRadius={theme.radius}
              padding="8px"
              color={theme.colors.text}
              elProps={{
                onClick: () => {
                  if (trigger === 'click') {
                    setOpen(false);
                  }
                }
              }}
            >
              {typeof props.content === 'function' ? props.content(contentProps) : props.content}
            </Box>
          </ArrowContainer>
        )}
      >
        <div
          {...{
            onClick: () => {
              if (trigger === 'click') {
                setOpen(true);
              }
            },
            onMouseOver: () => {
              if (trigger === 'hover') {
                setOpen(true);
              }
            },
            onMouseOut: () => {
              if (trigger === 'hover') {
                setOpen(false);
              }
            },
          }}
        >
          {props.children}
        </div>
      </PopoverComponent>
    </div>
  );
};
