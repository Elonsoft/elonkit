export const BADGE_STORY_BASIC_SOURCE = {
  html: `
  <es-badge
    [size]="size"
    [color]="color"
    [borderColor]="borderColor"
    [borderSize]="borderSize"
    [position]="position"
  >
    <es-avatar es-role="child"></es-avatar>
  </es-badge>
  <es-badge
    [size]="size"
    [color]="color"
    [borderColor]="borderColor"
    [borderSize]="borderSize"
    [position]="position"
  >
    <button es-role="child" type="button" color="primary" mat-icon-button>
      <mat-icon>favorite</mat-icon>
    </button>
  </es-badge>
  `
};
