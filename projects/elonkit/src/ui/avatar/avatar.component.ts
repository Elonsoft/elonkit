import {
  Component,
  Input,
  ChangeDetectionStrategy,
  InjectionToken,
  Optional,
  Inject,
  ViewEncapsulation
} from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';

import { ESAvatarDefaultOptions, ESAvatarVariant } from './avatar.types';

export const ES_AVATAR_DEFAULT_OPTIONS = new InjectionToken<ESAvatarDefaultOptions>(
  'ES_AVATAR_DEFAULT_OPTIONS'
);

@Component({
  selector: 'es-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ESAvatarComponent {
  /**
   * @internal
   * @ignore
   */
  public avatarVariant = ESAvatarVariant;

  /**
   * Size of the avatar in pixels.
   */
  @Input()
  public get size(): any {
    return this._size;
  }
  public set size(value: any) {
    this._size = coerceNumberProperty(value, 40);
  }
  private _size: any;

  /**
   * Class applied to text.
   */
  @Input()
  public get typography(): string {
    return this._typography || 'es-subtitle-2';
  }
  public set typography(value: string) {
    this._typography = value;
  }
  private _typography: string;

  /**
   * The alt attribute for avatar image.
   */
  @Input() public alt?: string;

  /**
   * The src attribute for avatar image.
   */
  @Input() public src?: string;

  /**
   * The shape of the avatar.
   */
  @Input()
  public get variant(): ESAvatarVariant {
    return this._variant;
  }
  public set variant(value: ESAvatarVariant) {
    this._variant = value || this.avatarVariant.Round;
  }
  private _variant: ESAvatarVariant;

  /**
   * @ignore
   */
  constructor(
    @Optional()
    @Inject(ES_AVATAR_DEFAULT_OPTIONS)
    private defaultOptions: ESAvatarDefaultOptions
  ) {
    this.size = this.defaultOptions?.size;
    this.typography = this.defaultOptions?.typography;
    this.variant = this.defaultOptions?.variant;
  }
}
