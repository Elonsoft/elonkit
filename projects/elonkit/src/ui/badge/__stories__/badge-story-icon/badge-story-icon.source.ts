export const BADGE_STORY_ICON_SOURCE = {
  html: `
    <es-badge
      [size]="size"
      [borderSize]="borderSize"
      [position]="position"
    >
      <mat-icon es-role="icon">favorite</mat-icon>
      <es-avatar es-role="child"></es-avatar>
    </es-badge>
    <es-badge
      [size]="size"
      [borderSize]="borderSize"
      [position]="position"
    >
      <mat-icon es-role="icon">favorite</mat-icon>
      <button es-role="child" type="button" color="primary" mat-icon-button>
        <mat-icon>favorite</mat-icon>
      </button>
    </es-badge>
  `
};
