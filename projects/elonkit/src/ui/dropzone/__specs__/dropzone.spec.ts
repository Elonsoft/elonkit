import { render, waitFor } from '@testing-library/angular';
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

import { ESDropzoneModule } from '../dropzone.module';
import { ESDropzoneValidationError } from '../dropzones.types';

const TEXT_HEADING = 'CHOOSE FILES';
const TEXT_SUBHEADING = 'This is an example of a description';
const TEXT_HINT = 'This is an example of a hint';
const TEXT_ERROR = 'This is an example of an error';
const TEXT_SUBMIT = 'Submit';

const CLASS_HEADING = 'app-body-1';
const CLASS_SUBHEADING = 'app-caption';

@Component({
  template: `
    <form #f="ngForm" [formGroup]="form" (ngSubmit)="onSubmit(f.value)">
      <es-dropzone
        heading="${TEXT_HEADING}"
        subheading="${TEXT_SUBHEADING}"
        headingTypography="${CLASS_HEADING}"
        subheadingTypography="${CLASS_SUBHEADING}"
        formControlName="docs"
        accept="image/jpg,image/jpeg,image/png"
        maxSize="0.000001"
        (validate)="onValidate($event)"
      >
        <mat-hint>${TEXT_HINT}</mat-hint>
        <mat-error>${TEXT_ERROR}</mat-error>
      </es-dropzone>
      <button id="submit-btn" type="submit">${TEXT_SUBMIT}</button>
    </form>
  `
})
class DropzoneWrapperComponent {
  public form = new FormGroup({
    docs: new FormControl([], Validators.required)
  });
  public onSubmit(form: any) {}
  public onValidate(res: ESDropzoneValidationError[]) {}
}

describe('Drag And Drop', () => {
  it('Should render component', async () => {
    const component = await render(DropzoneWrapperComponent, {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        ESDropzoneModule,
        MatIconTestingModule
      ]
    });
    expect(component.getByText(TEXT_HEADING)).toBeInTheDocument();
    expect(component.getByText(TEXT_SUBHEADING)).toBeInTheDocument();
  });

  it('Should show hint', async () => {
    const component = await render(DropzoneWrapperComponent, {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        ESDropzoneModule,
        MatIconTestingModule
      ]
    });
    expect(component.getByText(TEXT_HINT)).toBeInTheDocument();
  });

  it('Should show error', async () => {
    const component = await render(DropzoneWrapperComponent, {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        ESDropzoneModule,
        MatIconTestingModule
      ]
    });
    const submitButton = component.getByText(TEXT_SUBMIT);
    component.click(submitButton);
    expect(component.getByText(TEXT_ERROR)).toBeInTheDocument();
  });

  it('Should accept typography classes', async () => {
    const component = await render(DropzoneWrapperComponent, {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        ESDropzoneModule,
        MatIconTestingModule
      ]
    });
    expect(component.getByText(TEXT_HEADING)).toHaveClass(CLASS_HEADING);
    expect(component.getByText(TEXT_SUBHEADING)).toHaveClass(CLASS_SUBHEADING);
  });

  it('Should add class on dragover and remove on drop', async () => {
    const component = await render(DropzoneWrapperComponent, {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        ESDropzoneModule,
        MatIconTestingModule
      ]
    });

    component.dragOver(component.getByText(TEXT_HEADING));
    expect(component.getByTestId('root')).toHaveClass('es-dropzone_dragover');

    component.drop(component.getByText(TEXT_HEADING), {
      dataTransfer: {
        files: {}
      }
    });
    expect(component.getByTestId('root')).not.toHaveClass('es-dropzone_dragover');
  });

  it('Should add files to FormControl on drop', async (done) => {
    const component = await render(DropzoneWrapperComponent, {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        ESDropzoneModule,
        MatIconTestingModule
      ]
    });

    const fileFixture = {
      name: 'filename.png',
      type: 'image/png'
    };
    const file = new File([''], fileFixture.name, { type: fileFixture.type });

    component.drop(component.getByText(TEXT_HEADING), {
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
    componentInstance.form.valueChanges.subscribe((res) => {
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

  it('Should add files to FormControl on change', async (done) => {
    const component = await render(DropzoneWrapperComponent, {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        ESDropzoneModule,
        MatIconTestingModule
      ]
    });

    const fileFixture = {
      name: 'filename.png',
      type: 'image/png'
    };
    const file = new File([''], fileFixture.name, { type: fileFixture.type });

    component.change(component.getByTestId('input'), {
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
    componentInstance.form.valueChanges.subscribe((res) => {
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

  it('Should emit validation errors', async (done) => {
    const component = await render(DropzoneWrapperComponent, {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        ESDropzoneModule,
        MatIconTestingModule
      ]
    });

    const fileFixture1 = {
      name: 'filename1.pdf',
      type: 'application/pdf'
    };
    const fileFixture2 = {
      name: 'filename2.png',
      type: 'image/png'
    };
    const file1 = new File([''], fileFixture1.name, { type: fileFixture1.type });
    const file2 = new File(['0123456789'], fileFixture2.name, { type: fileFixture2.type });
    const spy = jest.spyOn(component.fixture.componentInstance, 'onValidate');

    component.change(component.getByTestId('input'), {
      target: {
        files: {
          0: file1,
          1: file2,
          length: 2,
          item(i: number) {
            return this[i];
          }
        }
      }
    });

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith([
        { error: 'FILE_TYPE', fileName: file1.name },
        { error: 'FILE_SIZE', fileName: file2.name }
      ]);
      done();
    });
  });
});
