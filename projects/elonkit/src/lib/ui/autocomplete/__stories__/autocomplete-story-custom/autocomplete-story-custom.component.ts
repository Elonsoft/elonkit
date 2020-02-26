import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GetFilterOptionsByKey } from '../../filter-options';

const OPTIONS = [
  {
    id: 1,
    name: 'Anna',
    photo: 'https://joeschmoe.io/api/v1/jenni'
  },
  {
    id: 2,
    name: 'Mary',
    photo: 'https://joeschmoe.io/api/v1/julie'
  },
  {
    id: 3,
    name: 'Elena',
    photo: 'https://joeschmoe.io/api/v1/jolee'
  }
];

@Component({
  selector: 'es-autocomplete-story-custom',
  templateUrl: './autocomplete-story-custom.component.html',
  styleUrls: ['./autocomplete-story-custom.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AutocompleteStoryCustomComponent {
  public form: FormGroup;
  public options: any[] = OPTIONS;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      autocomplete: ''
    });
  }

  public onChangeText(text: string) {
    this.options = GetFilterOptionsByKey(text, OPTIONS, 'name');
  }

  public valueFn(option: any): any {
    return option.name;
  }
}
