import { LitElement } from 'lit';

export interface UploadProgressEventDetail {
  progress: number;
  bytesTransferred: number;
  totalBytes: number;
}

export interface UploadCompleteEventDetail {
  downloadURL: string;
  fullPath: string;
  name: string;
  size: number;
  contentType: string;
}

export interface UploadErrorEventDetail {
  message: string;
  code: string;
}

export declare class FirebaseUploadfile extends LitElement {
  /** Storage path for uploads */
  path: string;

  /** Accepted file types (e.g., "image/*,.pdf") */
  accept: string;

  /** Maximum file size in bytes */
  maxSize: number;

  /** Allow multiple file selection */
  multiple: boolean;

  /** Custom button text */
  buttonText: string;

  /** Auto-upload on file selection */
  autoUpload: boolean;

  /** Show upload progress */
  showProgress: boolean;

  /** Current upload progress (0-100) */
  readonly progress: number;

  /** Whether upload is in progress */
  readonly uploading: boolean;

  /**
   * Upload a file programmatically
   * @param file - File to upload
   * @returns Download URL
   */
  upload(file: File): Promise<string>;

  /**
   * Cancel the current upload
   */
  cancel(): void;

  /**
   * Clear selected files
   */
  clear(): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'firebase-uploadfile': FirebaseUploadfile;
  }
}
