import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewEncapsulation,
  Input,
  InjectionToken,
  Optional,
  Inject,
  ElementRef,
  ViewChild
} from '@angular/core';

import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ESBadgeDefaultOptions, ESBadgePosition, ESBadgePositionStyles } from './badge.types';

export const ES_BADGE_DEFAULT_OPTIONS = new InjectionToken<ESBadgeDefaultOptions>(
  'ES_BADGE_DEFAULT_OPTIONS'
);

@Component({
  selector: 'es-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ESBadgeComponent {
  /**
   * Defines badge size in pixels.
   */
  @Input()
  public get size(): number {
    return this._size;
  }
  public set size(value: number) {
    this._size = coerceNumberProperty(value, 14);
  }
  private _size: number;

  /**
   * Defines badge position.
   */
  @Input()
  public get position(): ESBadgePosition {
    return this._position;
  }
  public set position(value: ESBadgePosition) {
    this._position = value;
    if (this._position) {
      this.setPositions();
    }
  }
  private _position: ESBadgePosition;

  /**
   * Defines badge border width in pixels.
   */
  @Input()
  public get borderSize(): number {
    return this._borderSize;
  }
  public set borderSize(value: number) {
    this._borderSize = coerceNumberProperty(value, 2);
  }
  private _borderSize: number;

  /**
   * Defines badge background color.
   */
  @Input() public color: string;

  /**
   * Defines badge custom positions.
   */
  @Input()
  public get positions(): ESBadgePositionStyles {
    return this._positions;
  }
  public set positions(value: ESBadgePositionStyles) {
    this._positions = value;
    this.setPositions();
  }
  private _positions: ESBadgePositionStyles;

  private badgePosition = ESBadgePosition;

  /**
   * Defines badge vertical offset.
   */
  @Input()
  public get offsetVertical(): number {
    return this._offsetVertical;
  }
  public set offsetVertical(value: number) {
    this._offsetVertical = coerceNumberProperty(value);
    setTimeout(() => {
      this._elementRef.nativeElement.style.setProperty(
        '--offsetVertical',
        `${this._offsetVertical + `px`}`
      );
      this.setStyles();
    });
  }
  private _offsetVertical: number;

  /**
   * Defines badge horizontal offset.
   */
  @Input()
  public get offsetHorizontal(): number {
    return this._offsetHorizontal;
  }
  public set offsetHorizontal(value: number) {
    this._offsetHorizontal = coerceNumberProperty(value);
    setTimeout(() => {
      this._elementRef.nativeElement.style.setProperty(
        '--offsetHorizontal',
        `${this._offsetHorizontal + `px`}`
      );
      this.setStyles();
    });
  }
  private _offsetHorizontal: number;

  /**
   * Child element, passing to ng-content.
   */
  @ViewChild('childElement')
  public childElement: ElementRef;

  /**
   * @ignore
   */
  constructor(
    /**
     * @internal
     */
    public changeDetector: ChangeDetectorRef,
    /**
     * @internal
     */
    @Optional()
    @Inject('ES_BADGE_DEFAULT_OPTIONS')
    private defaultOptions: ESBadgeDefaultOptions,
    private _elementRef: ElementRef
  ) {
    this.size = this.defaultOptions?.size;
    this.position = this.defaultOptions?.position;
    this.offsetVertical = this.defaultOptions?.offsetVertical;
    this.offsetHorizontal = this.defaultOptions?.offsetHorizontal;
    this.borderSize = this.defaultOptions?.borderSize;
  }

  private setPositions() {
    setTimeout(() => {
      const childElement = this.childElement.nativeElement.offsetWidth;
      const transparent = this.size / 2 + this.borderSize;
      let offsetVertical = childElement - transparent;
      let offsetHorizontal = this.borderSize * 2;

      switch (this.position) {
        case this.badgePosition.AboveAfter: {
          this.positions = { 'top.px': 0, 'right.px': -1 };
          break;
        }
        case this.badgePosition.AboveBefore: {
          this.positions = { 'top.px': 0, 'left.px': 0 };
          offsetHorizontal = offsetVertical;
          break;
        }
        case this.badgePosition.BelowAfter: {
          this.positions = { 'bottom.px': -1, 'right.px': -1 };
          offsetVertical = this.borderSize * 2;
          offsetHorizontal = this.borderSize * 2;
          break;
        }
        case this.badgePosition.BelowBefore: {
          this.positions = { 'left.px': 0, 'bottom.px': -1 };
          offsetVertical = this.borderSize * 2;
          offsetHorizontal = childElement - transparent;
          break;
        }
      }
      this.setOffsets(offsetVertical, offsetHorizontal);
    });
  }

  /**
   * @internal
   * @ignore
   */
  public stylesObject() {
    return {
      'height.px': this.size,
      'width.px': this.size,
      'background-color.px': this.color,
      ...this.positions
    };
  }

  private setOffsets(offsetVertical, offsetHorizontal): void {
    this._elementRef.nativeElement.style.setProperty(
      '--offsetVertical',
      `${offsetVertical + `px`}`
    );
    this._elementRef.nativeElement.style.setProperty(
      '--offsetHorizontal',
      `${offsetHorizontal + `px`}`
    );
    this.changeDetector.markForCheck();
  }

  private setStyles() {
    const childElement = this.childElement.nativeElement.offsetWidth;
    this._elementRef.nativeElement.style.setProperty('--borderSize', `${this.borderSize + `px`}`);
    this._elementRef.nativeElement.style.setProperty(
      '--transparent',
      `${this.size / 2 + this.borderSize + 1 + `px`}`
    );
    this._elementRef.nativeElement.style.setProperty('--childElement', `${childElement + `px`}`);
    this.changeDetector.markForCheck();
  }
}
