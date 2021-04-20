export interface ESBadgeDefaultOptions {
  size?: number;
  position?: ESBadgePositionVariant;
  borderSize?: number;
  offsetVertical?: number;
  offsetHorizontal?: number;
}

export type ESBadgePositionVariant =
  | 'above before'
  | 'above after'
  | 'below before'
  | 'below after';

export enum ESBadgePositions {
  AboveBefore = 'above before',
  AboveAfter = 'above after',
  BelowBefore = 'below before',
  BelowAfter = 'below after'
}

export interface ESBadgePositionStyles {
  'top.px'?: number;
  'right.px'?: number;
  'bottom.px'?: number;
  'left.px'?: number;
}
