export const BADGE_STORY_CUSTOM_SOURCE = {
  html: `
  <es-badge
    [position]="position"
    [positions]="positions"
    [offsetHorizontal]="offsetHorizontal"
    [offsetVertical]="offsetVertical"
  >
    <es-avatar es-role="child"></es-avatar>
  </es-badge>
  <es-badge
    [position]="position"
    [positions]="positions"
    [offsetHorizontal]="offsetHorizontal"
    [offsetVertical]="offsetVertical"
  >
    <button es-role="child" type="button" color="primary" mat-icon-button>
      <mat-icon>favorite</mat-icon>
    </button>
  </es-badge>
  `
};
