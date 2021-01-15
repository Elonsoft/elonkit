export interface ESFileListFile {
  id?: number;
  deleted?: boolean;
  type?: string;
  base64?: string;
  file?: string;
  updatedAt?: string;
  name: string;
  size: number;
  content: File | string;
}

export interface ESFileListRemoveAction {
  file: ESFileListFile;
  index: number;
}

export interface ESFileListDefaultOptions {
  imageTypes?: string;
  hideImages?: boolean;
  canRemove?: boolean;
  canDownload?: boolean;
  fileNameTypography?: string;
  fileSizeTypography?: string;
}
