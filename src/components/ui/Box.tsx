import * as React from 'react';
import cxs, { CSSObject, CSSProperties } from 'cxs';
import { PropsWithChildren } from 'react';
import { useTheme } from './layout/ThemeProvider';

export interface BoxProps extends CSSProperties {
  elProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> | false;
  as?: keyof JSX.IntrinsicElements;
  hover?: CSSObject;
  active?: CSSObject;
  focus?: CSSObject;
  focusWithin?: CSSObject;
  css?: cxs.CSSObject;
}

export const Box = React.forwardRef<HTMLElement, PropsWithChildren<BoxProps>>((props, ref) => {
  const theme = useTheme();
  const Element = props.as ?? ('div' as any);
  return (
    <Element
      {...props.elProps}
      className={[
        cxs({
          ...props,
          elProps: undefined,
          children: undefined,
          hover: undefined,
          active: undefined,
          focus: undefined,
          css: undefined,
          ...props.css,
          ...(props.hover ? { ':hover': props.hover } : {}),
          ...(props.active ? { ':active': props.active } : {}),
          ...(props.focus ? { ':focus': props.focus } : {}),
          ...((!props.focus && props.hover && theme.keyboardMode) ? { ':focus': props.hover } : {}),
          ...(props.focusWithin ? { ':focus-within': props.focusWithin } : {}),
        }),
        props.elProps ? props.elProps.className || '' : '',
      ].join(' ')}
      ref={ref}
    >
      {props.children}
    </Element>
  );
});