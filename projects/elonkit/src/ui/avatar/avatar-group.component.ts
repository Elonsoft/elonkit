import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ElementRef,
  ViewEncapsulation,
  OnInit,
  ContentChildren,
  QueryList,
  AfterContentInit,
  Renderer2,
  OnDestroy
} from '@angular/core';

import { ESAvatarComponent } from './avatar.component';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'es-avatar-group',
  templateUrl: './avatar-group.component.html',
  styleUrls: ['./avatar-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ESAvatarGroupComponent implements OnInit, AfterContentInit, OnDestroy {
  @ContentChildren(ESAvatarComponent, { read: ElementRef }) private avatars: QueryList<ElementRef>;
  /**
   * Defines size of the avatar in pixels.
   */
  @Input()
  public size: number;

  private destroyed$ = new Subject();

  /**
   * @ignore
   */
  constructor(private _elementRef: ElementRef, private renderer: Renderer2) {}

  /**
   * @ignore
   */
  public ngOnInit() {
    this._elementRef.nativeElement.style.setProperty('--size', `${this.size + `px`}`);
  }

  /**
   * @ignore
   */
  public ngAfterContentInit() {
    this.setAvatarsIndex(this.avatars);
    this.avatars.changes
      .pipe(
        filter((avatars) => !!avatars),
        takeUntil(this.destroyed$)
      )
      .subscribe((avatars) => {
        this.setAvatarsIndex(avatars);
      });
  }

  private setAvatarsIndex = (avatars): void => {
    avatars.forEach((avatar, index) => {
      this.renderer.setStyle(avatar.nativeElement, 'z-index', index);
    });
  };

  /**
   * @ignore
   */
  public ngOnDestroy() {
    this.destroyed$.next();
  }
}
