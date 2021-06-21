export interface ESBadgeDefaultOptions {
  size?: number;
  position?: ESBadgePosition;
  borderSize?: number;
  offsetVertical?: number;
  offsetHorizontal?: number;
}

export enum ESBadgePosition {
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
