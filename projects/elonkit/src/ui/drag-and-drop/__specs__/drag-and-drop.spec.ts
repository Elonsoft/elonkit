import { render, fireEvent } from '@testing-library/angular';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';

import { ESDragAndDropModule } from '../drag-and-drop.module';

const TEXT_TITLE = 'CHOOSE FILES';
const TEXT_HINT = 'This is an example of a hint';
const TEXT_ERROR = 'This is an example of an error';

@Component({
  template: `
    <form #f="ngForm" [formGroup]="form" (ngSubmit)="onSubmit(f.value)">
      <es-drag-and-drop
        title="${TEXT_TITLE}"
        description="description"
        formControlName="docs"
        [options]="{
          accept: 'image/jpg,image/jpeg,image/png',
          type: 'binary'
        }"
      >
        <mat-hint>${TEXT_HINT}</mat-hint>
        <mat-error>${TEXT_ERROR}</mat-error>
      </es-drag-and-drop>
      <button id="submit-btn" type="submit">Submit</button>
    </form>
  `
})
class DragAndDropWrapperComponent {
  public form = new FormGroup({
    docs: new FormControl([], Validators.required)
  });
  public onSubmit(form: any) {}
}

describe('Drag And Drop', () => {
  it('Should render component', async () => {
    const component = await render(DragAndDropWrapperComponent, {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        ESDragAndDropModule,
        MatIconTestingModule
      ]
    });
    expect(component.getByText(TEXT_TITLE)).toBeInTheDocument();
  });

  it('Should show hint', async () => {
    const component = await render(DragAndDropWrapperComponent, {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        ESDragAndDropModule,
        MatIconTestingModule
      ]
    });
    expect(component.getByText(TEXT_HINT)).toBeInTheDocument();
  });

  it('Should show error', async () => {
    const component = await render(DragAndDropWrapperComponent, {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        ESDragAndDropModule,
        MatIconTestingModule
      ]
    });
    const submitButton = component.container.querySelector('#submit-btn');
    component.click(submitButton);
    expect(component.getByText(TEXT_ERROR)).toBeInTheDocument();
  });

  it('Should add class on dragover and remove on drop', async () => {
    const component = await render(DragAndDropWrapperComponent, {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        ESDragAndDropModule,
        MatIconTestingModule
      ]
    });

    fireEvent.dragOver(component.getByText(TEXT_TITLE));
    expect(component.container.querySelector('.es-drag-and-drop_dragover')).toBeInTheDocument();

    fireEvent.drop(component.getByText(TEXT_TITLE), {
      dataTransfer: {
        files: {}
      }
    });
    expect(component.container.querySelector('.es-drag-and-drop_dragover')).toBeNull();
  });

  it('Should add files to FormControl on drop', async done => {
    const component = await render(DragAndDropWrapperComponent, {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        ESDragAndDropModule,
        MatIconTestingModule
      ]
    });

    const fileFixture = {
      name: 'filename.png',
      type: 'image/png'
    };
    const file = new File([''], fileFixture.name, { type: fileFixture.type });

    fireEvent.drop(component.getByText(TEXT_TITLE), {
      dataTransfer: {
        files: {
          0: file,
          length: 1,
          item(i: number) {
            return this[i];
          }
        }
      }
    });

    const componentInstance = component.fixture.componentInstance;
    componentInstance.form.valueChanges.subscribe(res => {
      expect(res).toEqual({
        docs: [
          {
            base64: 'data:image/png;base64,',
            content: file,
            name: fileFixture.name,
            size: 0,
            type: fileFixture.type
          }
        ]
      });
      done();
    });
  });

  it('Should add files to FormControl on change', async done => {
    const component = await render(DragAndDropWrapperComponent, {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        ESDragAndDropModule,
        MatIconTestingModule
      ]
    });

    const fileFixture = {
      name: 'filename.png',
      type: 'image/png'
    };
    const file = new File([''], fileFixture.name, { type: fileFixture.type });

    fireEvent.change(component.container.querySelector('.es-drag-and-drop__input'), {
      target: {
        files: {
          0: file,
          length: 1,
          item(i: number) {
            return this[i];
          }
        }
      }
    });

    const componentInstance = component.fixture.componentInstance;
    componentInstance.form.valueChanges.subscribe(res => {
      expect(res).toEqual({
        docs: [
          {
            base64: 'data:image/png;base64,',
            content: file,
            name: fileFixture.name,
            size: 0,
            type: fileFixture.type
          }
        ]
      });
      done();
    });
  });
});
