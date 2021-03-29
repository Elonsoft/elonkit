export const AVATAR_STORY_GROUP_SOURCE = {
  ts: `
  @Component({
    encapsulation: ViewEncapsulation.None
  })
  export class AppComponent {
    @Input()
    public size: number;

    public avatars = [
      {
        size: 40,
        src: '/img/es-logo.png',
        alt: 'alt text'
      },
      { src: null, size: 40 },
      { src: null, size: 40, typography: 'typography' }
    ];
  }
  `,
  html: `
  <es-avatar-group
  [size]="size"
  >
    <es-avatar
      *ngFor="let avatar of avatars; index as i"
      class="es-avatar-group__avatar"
      [size]="avatar.size"
      [alt]="avatar.alt"
      [src]="avatar.src"
      [typography]="avatar.typography"
    ></es-avatar>
  </es-avatar-group>
  `
};
