export const AVATAR_STORY_TYPOGRAPHY_SOURCE = {
  ts: `
  @Component({
    encapsulation: ViewEncapsulation.None
  })
  `,
  html: `<es-avatar size="80" variant="variant" textTypography="typography">НФ</es-avatar>`,
  scss: `
  .typography {
    font-family: 'Roboto', sans-serif;
    font-size: 28px;
    letter-spacing: 0.5px;
  }
  `
};
