import { Injectable } from '@angular/core';

import { delay } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { GetFilterOptions } from '../../filter-options';

const OPTIONS = ['One', 'Two', 'Three'];

@Injectable()
export class AutocompleteService {
  public getOptions(text?: string): Observable<any> {
    const options = GetFilterOptions(text, OPTIONS);
    return of({
      options
    }).pipe(delay(1000));
  }
}
