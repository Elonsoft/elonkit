import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewEncapsulation,
  HostListener,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterContentInit,
  InjectionToken,
  Optional,
  Inject,
  Input
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';

import { IBreadcrumb } from './breadcrumbs.types';
import { ESBreadcrumbsService } from './breadcrumbs.service';

export interface ESBreadcrumbsDefaultOptions {
  typography?: string;
  sizes?: {
    icon: number;
    iconMargin: number;
    separator: number;
    menu: number;
    collapse: number;
  };
}

const DEFAULT_TYPOGRAPHY = 'mat-body-1';

const DEFAULT_SIZES = {
  icon: 24,
  iconMargin: 4,
  separator: 44,
  menu: 20,
  collapse: 24
};

export const ES_BREADCRUMBS_DEFAULT_OPTIONS = new InjectionToken<ESBreadcrumbsDefaultOptions>(
  'ES_BREADCRUMBS_DEFAULT_OPTIONS'
);

@Component({
  selector: 'es-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ESBreadcrumbsComponent implements OnInit, OnDestroy, AfterContentInit {
  private _typography;

  /**
   * Class applied to breadcrumb labels.
   */
  @Input()
  get typography(): string {
    return this._typography;
  }
  set typography(value: string) {
    this._typography = value || this.defaultOptions?.typography || DEFAULT_TYPOGRAPHY;
  }

  /**
   * @internal
   * @ignore
   */
  @ViewChild('navigation', { static: true }) elementNavigation: ElementRef<HTMLElement>;

  /**
   * @internal
   * @ignore
   */
  @ViewChild('width', { static: true }) elementWidth: ElementRef<HTMLElement>;

  /**
   * @internal
   * @ignore
   */
  @HostListener('window:resize') onResize() {
    const element = this.elementNavigation.nativeElement;
    if (element && this.breadcrumbs.length > 2) {
      const sizes = this.defaultOptions?.sizes || DEFAULT_SIZES;

      const widths = this.breadcrumbs.map(({ data: { label, icon, breadcrumbs } }) => {
        let result = 0;
        if (label) {
          result += this.getLabelWidth(label);
        }
        if (icon) {
          result += sizes.icon;
        }
        if (label && icon) {
          result += sizes.iconMargin;
        }
        if (breadcrumbs) {
          result += sizes.menu;
        }
        return result;
      });

      let scrollWidth =
        widths.reduce((acc, w) => acc + w, 0) + sizes.separator * (widths.length - 1);
      const clientWidth = element.clientWidth;

      const collapseIndexes = [];
      const collapseBreadcrumbs = [];

      for (let i = 1; i < widths.length - 1 && scrollWidth > clientWidth; i++) {
        if (!collapseIndexes.length) {
          scrollWidth += sizes.collapse + sizes.separator;
        }

        collapseIndexes.push(i);
        collapseBreadcrumbs.push(this.breadcrumbs[i]);
        scrollWidth -= widths[i] + sizes.separator;
      }

      this.collapseIndexes = collapseIndexes;
      this.collapseBreadcrumbs = collapseBreadcrumbs;
    } else if (this.collapseIndexes.length) {
      this.collapseIndexes = [];
      this.collapseBreadcrumbs = [];
    }
  }

  /**
   * @internal
   * @ignore
   */
  public breadcrumbs: IBreadcrumb[] = [];

  /**
   * @internal
   * @ignore
   */
  public collapseIndexes: number[] = [];

  /**
   * @internal
   * @ignore
   */
  public collapseBreadcrumbs: IBreadcrumb[] = [];

  private destroyed$ = new Subject();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private breadcrumbsService: ESBreadcrumbsService,
    @Optional()
    @Inject(ES_BREADCRUMBS_DEFAULT_OPTIONS)
    private defaultOptions: ESBreadcrumbsDefaultOptions
  ) {
    this.typography = defaultOptions?.typography || DEFAULT_TYPOGRAPHY;
  }

  /**
   * @internal
   * @ignore
   */
  public ngOnInit() {
    this.breadcrumbsService.breadcrumbs$
      .pipe(takeUntil(this.destroyed$), delay(1))
      .subscribe(breadcrumbs => {
        this.breadcrumbs = breadcrumbs;
        this.onResize();
        this.changeDetector.detectChanges();
      });
  }

  /**
   * @internal
   * @ignore
   */
  public ngOnDestroy() {
    this.destroyed$.next();
  }

  /**
   * @internal
   * @ignore
   */
  ngAfterContentInit() {
    if ((document as any).fonts?.ready) {
      (document as any).fonts.ready.then(() => {
        this.onResize();
        this.changeDetector.detectChanges();
      });
    }
  }

  private getLabelWidth(text: string) {
    const container = this.elementWidth.nativeElement;
    container.textContent = text;
    const width = container.clientWidth + 1;
    container.textContent = '';
    return width;
  }
}
