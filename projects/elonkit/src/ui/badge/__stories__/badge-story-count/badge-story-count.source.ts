export const BADGE_STORY_COUNT_SOURCE = {
  html: `
  <es-badge
    [size]="size"
    [color]="color"
    [borderColor]="borderColor"
    [borderSize]="borderSize"
    [position]="position"
  >
    <span es-role="count"></span>
    <es-avatar es-role="child"></es-avatar>
  </es-badge>
  <es-badge
    [size]="size"
    [color]="color"
    [borderColor]="borderColor"
    [borderSize]="borderSize"
    [position]="position"
  >
    <span es-role="count"></span>
    <button es-role="child" type="button" color="primary" mat-icon-button>
      <mat-icon>favorite</mat-icon>
    </button>
  </es-badge>
  `
};
