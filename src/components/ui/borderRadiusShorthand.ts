import { CSSObject } from 'cxs';
import { Theme } from './layout/ThemeProvider';

type TL = 'tl';
type TR = 'tr';
type BL = 'bl';
type BR = 'br';

type Shorthand1 = TL | TR | BL | BR;
type Shorthand2 = `${Shorthand1} ${Shorthand1}`;
type Shorthand3 = `${Shorthand2} ${Shorthand1}`;
type Shorthand4 = `${Shorthand3} ${Shorthand1}`;

export type BorderRadiusShorthand = Shorthand1 | Shorthand2 | Shorthand3 | Shorthand4 | '';

export const getBorderRadii = (shorthandValue: BorderRadiusShorthand | undefined, theme: Theme): CSSObject => ({
  borderTopLeftRadius: shorthandValue?.includes('tl') ? theme.radius : undefined,
  borderTopRightRadius: shorthandValue?.includes('tr') ? theme.radius : undefined,
  borderBottomLeftRadius: shorthandValue?.includes('bl') ? theme.radius : undefined,
  borderBottomRightRadius: shorthandValue?.includes('br') ? theme.radius : undefined,
});

export const getBorderRadiiList = (listLength: number, index: number, left: boolean, right: boolean): BorderRadiusShorthand => {
  let shorthand: BorderRadiusShorthand = '';
  let top = false;
  let bottom = false;

  if (listLength === 1) {
    top = true;
    bottom = true;
  } else if (index === 0) {
    top = true;
  } else if (index === listLength - 1) {
    bottom = true;
  }

  if (top && left) {
    shorthand += 'tl';
  }
  if (top && right) {
    shorthand += 'tr';
  }
  if (bottom && left) {
    shorthand += 'bl';
  }
  if (bottom && right) {
    shorthand += 'br';
  }

  return shorthand as BorderRadiusShorthand;
}