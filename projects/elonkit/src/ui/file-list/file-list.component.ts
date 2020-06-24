import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';

import { ESFileListLocale } from './file-list.component.locale';
import { ESFileListFile, ESFileListRemoveAction } from './file-list.types';

@Component({
  selector: 'es-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ESFileListComponent {
  /**
   * Array of file types to be considered an image.
   */
  @Input()
  public imageTypes: string[] = ['image/png', 'image/jpg', 'image/jpeg', 'image'];

  /**
   * Hide image files from the list.
   */
  @Input()
  public hideImages: boolean;

  /**
   * Can remove files from the list.
   */
  @Input()
  public canRemove: boolean;

  /**
   * Can download files from the list.
   */
  @Input()
  public canDownload: boolean;

  /**
   * Array of files to display.
   */
  @Input()
  public files: ESFileListFile[];

  /**
   * Object with removed file and its index is emitted.
   */
  @Output()
  public remove: EventEmitter<ESFileListRemoveAction> = new EventEmitter();

  constructor(private locale: ESFileListLocale) {}

  /**
   * @internal
   * @ignore
   */
  public getFileSize(file: ESFileListFile): string {
    const { labelKB, labelMB } = this.locale;
    const sizeKB = file.size / 1024;
    const sizeMB = file.size / 1024 / 1024;
    return sizeKB < 1024 ? `${sizeKB.toFixed(1)} ${labelKB}` : `${sizeMB.toFixed(1)} ${labelMB}`;
  }

  /**
   * @internal
   * @ignore
   */
  public removeFile(file: ESFileListRemoveAction): void {
    this.remove.emit(file);
  }

  /**
   * @internal
   * @ignore
   */
  public downloadFile(file: ESFileListFile): void {
    this.save(file.file, file.name);
  }

  private save(file: Blob | string, name?: string): void {
    const url = typeof file === 'string' ? file : URL.createObjectURL(file);
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', url);
    downloadLink.setAttribute('target', '_self');
    downloadLink.setAttribute('download', name ? name : '');
    downloadLink.click();
  }
}
