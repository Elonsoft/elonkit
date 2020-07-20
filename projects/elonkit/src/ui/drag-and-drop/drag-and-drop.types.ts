export interface ESDragAndDropFile {
  id?: number;
  deleted?: boolean;
  type?: string;
  base64?: string;
  file?: string;
  name: string;
  size: number;
  content: File | string;
}

export interface ESDragAndDropOptions {
  accept?: string;
  maxSize?: number;
  type?: string;
}
