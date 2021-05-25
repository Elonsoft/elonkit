import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  HostBinding,
  Optional,
  Self,
  Host,
  ElementRef,
  AfterViewInit,
  Renderer2
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgControl
} from '@angular/forms';

import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';

import { MatButton } from '@angular/material/button';
import { MatChipList } from '@angular/material/chips';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';

import { Observable, Subject, combineLatest, of, BehaviorSubject } from 'rxjs';
import {
  catchError,
  debounceTime,
  filter,
  map,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';

import { resizeObserver } from '../../utils/resize-observer';
import { ESLocale, ESLocaleService } from '../locale';

import { ES_AUTOCOMPLETE_ANIMATIONS } from './autocomplete-multiple.animations';
import { ESAutocompleteMultipleSearchScope } from '.';

const CHIP_LEFT_MARGIN = 4;
const COUNT_WIDTH = 40;

@Component({
  selector: 'es-autocomplete-multiple',
  templateUrl: './autocomplete-multiple.component.html',
  styleUrls: ['./autocomplete-multiple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: MatFormFieldControl, useExisting: ESAutocompleteMultipleComponent }],
  animations: ES_AUTOCOMPLETE_ANIMATIONS
})
export class ESAutocompleteMultipleComponent
  implements MatFormFieldControl<any[]>, ControlValueAccessor, OnInit, OnDestroy, AfterViewInit {
  private static nextId = 0;
  @HostBinding() public id = `es-autocomplete-multiple-${ESAutocompleteMultipleComponent.nextId++}`;
  @HostBinding('style.display') public styleDisplay = 'block';
  @HostBinding('style.width') public styleWidth = '100%';

  @ViewChild('input', { static: false }) private input?: ElementRef<HTMLInputElement>;
  @ViewChild('arrow', { static: true }) private arrow?: MatButton;
  @ViewChild('selectionList', { static: false }) private selectionList?: MatSelectionList;
  @ViewChild('chipList', { static: false }) private chipList?: MatChipList;

  @Input() public service!: (search: string, options?: any[]) => Observable<any[]>;

  @Input() public displayWith!: (option: any) => string;

  @Input()
  public get placeholder() {
    return this._placeholder;
  }
  public set placeholder(placeholder) {
    this._placeholder = placeholder;
    this.stateChanges.next();
  }
  private _placeholder = '';

  @Input()
  public get required() {
    return this._required;
  }
  public set required(required) {
    this._required = coerceBooleanProperty(required);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  public get disabled() {
    return this._disabled;
  }
  public set disabled(disabled) {
    this._disabled = coerceBooleanProperty(disabled);
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input() public showedOptionsCount = 50;

  /**
   * @internal
   * @ignore
   */
  public locale$: Observable<ESLocale>;

  public origin!: CdkOverlayOrigin;

  public describedBy = '';

  private destoryed$ = new Subject<void>();

  public stateChanges = new Subject<void>();

  public value: any[] = [];

  public isOpen = false;

  public width = 0;

  public selectionChanged$ = new BehaviorSubject(null);

  public options$: Observable<any[]>;

  public filteredOptions$: Observable<any[]>;

  public focused = false;

  public searchScope = ESAutocompleteMultipleSearchScope;

  public form = new FormGroup({
    scope: new FormControl(this.searchScope.ALL),
    text: new FormControl('')
  });

  public hiddenChipCount = 0;

  private count = 0;

  @HostBinding('class.floating')
  public get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  public get errorState(): boolean {
    const control = this.ngControl;
    const form = this.ngForm;

    if (control) {
      return !!(control.invalid && (control.touched || form?.submitted));
    }

    return false;
  }

  public get empty() {
    return !this.value.length;
  }

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    @Optional() public ngForm: FormGroupDirective,
    @Optional() @Host() private matFormField: MatFormField,
    private changeDetectorRef: ChangeDetectorRef,
    private focusMonitor: FocusMonitor,
    private rendered2: Renderer2,
    private elementRef: ElementRef,
    /**
     * @internal
     */
    public localeService: ESLocaleService
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this as any;
    }
    this.locale$ = this.localeService.locale();

    this.options$ = this.form.valueChanges.pipe(
      startWith({ scope: this.searchScope.ALL, text: '' }),
      debounceTime(400),
      switchMap(({ scope, text }) => {
        if (scope === this.searchScope.SELECTED) {
          return this.service(text, this.value).pipe(catchError(() => of([])));
        }

        return this.service(text).pipe(catchError(() => of([])));
      }),
      shareReplay(1)
    );

    this.filteredOptions$ = combineLatest([
      this.options$,
      this.selectionChanged$.pipe(filter(() => this.isOpen))
    ]).pipe(
      debounceTime(100),
      map(([options]) => {
        const { scope } = this.form.value;

        if (scope === this.searchScope.SELECTED) {
          return options.filter((option) => this.value.some((o) => o.id === option.id));
        } else if (scope === this.searchScope.NOT_SELECTED) {
          return options.filter((option) => !this.value.some((o) => o.id === option.id));
        } else {
          return options;
        }
      }),
      tap((options) => {
        this.count = options.length;
      })
    );
  }

  public ngOnInit() {
    if (this.matFormField) {
      this.origin = {
        elementRef: this.matFormField.getConnectedOverlayOrigin()
      };
    }

    this.stateChanges.subscribe(() => {
      this.changeDetectorRef.detectChanges();
    });
  }

  public ngAfterViewInit() {
    combineLatest([
      // tslint:disable-next-line:deprecation
      resizeObserver(this.elementRef.nativeElement).pipe(startWith(null), debounceTime(10)),
      this.selectionChanged$
    ])
      .pipe(takeUntil(this.destoryed$))
      .subscribe(() => {
        this.updateDisplayedChips();
      });
  }

  public ngOnDestroy() {
    this.destoryed$.next();
    this.destoryed$.complete();
    this.stateChanges.complete();
  }

  public setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  public onContainerClick() {
    this.isOpen = true;
    if (this.matFormField) {
      this.width = this.matFormField._elementRef.nativeElement.clientWidth;
    }
    this.stateChanges.next();

    setTimeout(() => {
      if (this.input) {
        this.input.nativeElement.focus();
      }
    });
  }

  public writeValue(value: any[]) {
    if (value !== undefined) {
      this.value = value;
      this.stateChanges.next();
    }
  }

  public registerOnChange(onChange: (value: any) => void) {
    this.onChange = onChange;
  }

  public onChange = (_: any[]) => {};

  public registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  public onTouched = () => {};

  public onClose(shouldFocusArrow?: boolean) {
    this.onTouched();
    this.isOpen = false;

    this.form.patchValue({ text: '', scope: this.searchScope.ALL });

    if (shouldFocusArrow && this.arrow) {
      this.focusMonitor.focusVia(this.arrow._elementRef.nativeElement, 'keyboard');
    }

    this.stateChanges.next();
  }

  public onClear() {
    this.form.patchValue({ text: '' });
  }

  public onSelectionChange(event: MatSelectionListChange) {
    const newValue = this.value.slice();
    const option = event.option.value;

    const index = newValue.findIndex((o) => o.id === option.id);
    if (index !== -1) {
      newValue.splice(index, 1);
    } else {
      newValue.push(option);
    }

    this.value = newValue;

    this.changeState(this.value);
  }

  public onSelectAll() {
    this.value = this.selectionList.options.map((option) => option.value);

    this.changeState(this.value);
  }

  public onRemoveAll(event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    this.value = [];

    this.changeState(this.value);
  }

  public onRemove(index: number) {
    this.value.splice(index, 1);

    this.changeState(this.value);
  }

  public isSelected(option: any) {
    return !!this.value.find((o) => o.id === option.id);
  }

  public getShownCountInfo(labelShown: string, labelOf: string) {
    const count = this.count - this.showedOptionsCount > 0 ? this.showedOptionsCount : this.count;

    return `${labelShown}: ${count} ${labelOf} ${this.count}`;
  }

  public updateDisplayedChips() {
    if (this.chipList) {
      let count = 0;

      const chips = this.chipList.chips;

      let isOverflow = false;
      let offset = 0;

      chips.forEach((chip) => {
        this.rendered2.setStyle(chip._elementRef.nativeElement, 'display', 'inline-flex');

        const { width } = chip._elementRef.nativeElement.getBoundingClientRect();

        offset += width;

        if (isOverflow) {
          count += 1;

          this.rendered2.setStyle(chip._elementRef.nativeElement, 'display', 'none');
        } else {
          // tslint:disable-next-line: no-shadowed-variable
          const { width } = chip._elementRef.nativeElement.parentElement.getBoundingClientRect();

          if (offset > width - COUNT_WIDTH) {
            count += 1;

            isOverflow = true;

            this.rendered2.setStyle(chip._elementRef.nativeElement, 'display', 'none');
          }
        }

        offset += CHIP_LEFT_MARGIN;
      });

      if (this.hiddenChipCount !== count) {
        this.hiddenChipCount = count;
        this.stateChanges.next();
      }
    }
  }

  private changeState(value: any[]) {
    this.onChange(value);
    this.stateChanges.next();

    this.selectionChanged$.next(true);
  }
}
