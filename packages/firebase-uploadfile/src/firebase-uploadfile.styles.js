import { css } from 'lit';

/**
 * Styles for FirebaseUploadfile component
 */
export const styles = css`
  :host {
    display: block;
    font-family: var(--firebase-uploadfile-font-family, system-ui, -apple-system, sans-serif);
  }

  :host([hidden]) {
    display: none;
  }

  .upload-container {
    border: 2px dashed var(--firebase-uploadfile-border-color, #dee2e6);
    border-radius: var(--firebase-uploadfile-border-radius, 8px);
    padding: var(--firebase-uploadfile-padding, 2rem);
    text-align: center;
    transition: border-color 0.2s, background-color 0.2s;
    cursor: pointer;
  }

  .upload-container:hover,
  .upload-container.dragover {
    border-color: var(--firebase-uploadfile-active-color, #007bff);
    background-color: var(--firebase-uploadfile-hover-bg, #f8f9fa);
  }

  .upload-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: var(--firebase-uploadfile-icon-color, #6c757d);
  }

  .upload-text {
    color: var(--firebase-uploadfile-text-color, #495057);
    margin-bottom: 0.5rem;
  }

  .upload-hint {
    font-size: 0.875rem;
    color: var(--firebase-uploadfile-hint-color, #6c757d);
  }

  input[type="file"] {
    display: none;
  }

  .upload-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: var(--firebase-uploadfile-btn-bg, #007bff);
    color: var(--firebase-uploadfile-btn-color, white);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
  }

  .upload-btn:hover:not(:disabled) {
    background-color: var(--firebase-uploadfile-btn-hover-bg, #0056b3);
  }

  .upload-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .progress-container {
    margin-top: 1rem;
  }

  .progress-bar {
    height: 8px;
    background-color: var(--firebase-uploadfile-progress-bg, #e9ecef);
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background-color: var(--firebase-uploadfile-progress-color, #007bff);
    transition: width 0.2s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: var(--firebase-uploadfile-progress-text-color, #6c757d);
    margin-top: 0.5rem;
  }

  .file-list {
    margin-top: 1rem;
    text-align: left;
  }

  .file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    background-color: var(--firebase-uploadfile-file-bg, #f8f9fa);
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }

  .file-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .file-name {
    font-size: 0.875rem;
    color: var(--firebase-uploadfile-file-color, #495057);
  }

  .file-size {
    font-size: 0.75rem;
    color: var(--firebase-uploadfile-size-color, #6c757d);
  }

  .remove-btn {
    background: none;
    border: none;
    color: var(--firebase-uploadfile-remove-color, #dc3545);
    cursor: pointer;
    padding: 0.25rem;
  }

  .error {
    color: var(--firebase-uploadfile-error-color, #dc3545);
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }

  .success {
    color: var(--firebase-uploadfile-success-color, #28a745);
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }
`;
