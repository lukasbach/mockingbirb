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

export type BorderRadiusShorthand = Shorthand1 | Shorthand2 | Shorthand3 | Shorthand4;

export const getBorderRadii = (shorthandValue: BorderRadiusShorthand | undefined, theme: Theme): CSSObject => ({
  borderTopLeftRadius: shorthandValue?.includes('tl') ? theme.radius : undefined,
  borderTopRightRadius: shorthandValue?.includes('tr') ? theme.radius : undefined,
  borderBottomLeftRadius: shorthandValue?.includes('bl') ? theme.radius : undefined,
  borderBottomRightRadius: shorthandValue?.includes('br') ? theme.radius : undefined,
});
