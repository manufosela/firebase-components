import { css } from 'lit';

/**
 * Styles for FirebaseAutoform component
 * @description CSS custom properties for theming:
 * - --firebase-autoform-font-family: Font family (default: system-ui)
 * - --firebase-autoform-label-color: Label text color
 * - --firebase-autoform-input-border: Input border color
 * - --firebase-autoform-error-color: Error text color
 */
export const styles = css`
  :host {
    display: block;
    font-family: var(--firebase-autoform-font-family, system-ui, -apple-system, sans-serif);
  }

  :host([hidden]) {
    display: none;
  }

  .autoform {
    display: flex;
    flex-direction: column;
    gap: var(--firebase-autoform-gap, 1rem);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .form-group--horizontal {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }

  .form-label {
    font-size: var(--firebase-autoform-label-size, 0.875rem);
    font-weight: var(--firebase-autoform-label-weight, 500);
    color: var(--firebase-autoform-label-color, #495057);
  }

  .form-label--required::after {
    content: ' *';
    color: var(--firebase-autoform-required-color, #dc3545);
  }

  .form-input {
    padding: var(--firebase-autoform-input-padding, 0.5rem 0.75rem);
    border: 1px solid var(--firebase-autoform-input-border, #ced4da);
    border-radius: var(--firebase-autoform-input-radius, 4px);
    font-size: var(--firebase-autoform-input-size, 1rem);
    font-family: inherit;
    transition: border-color 0.2s, box-shadow 0.2s;
    background-color: var(--firebase-autoform-input-bg, #ffffff);
    color: var(--firebase-autoform-input-color, #212529);
  }

  .form-input:focus {
    outline: none;
    border-color: var(--firebase-autoform-focus-color, #007bff);
    box-shadow: 0 0 0 3px var(--firebase-autoform-focus-shadow, rgba(0, 123, 255, 0.1));
  }

  .form-input:disabled {
    background-color: var(--firebase-autoform-disabled-bg, #e9ecef);
    cursor: not-allowed;
  }

  .form-input--error {
    border-color: var(--firebase-autoform-error-color, #dc3545);
  }

  .form-input--error:focus {
    box-shadow: 0 0 0 3px var(--firebase-autoform-error-shadow, rgba(220, 53, 69, 0.1));
  }

  textarea.form-input {
    min-height: 100px;
    resize: vertical;
  }

  select.form-input {
    cursor: pointer;
  }

  input[type="checkbox"].form-input,
  input[type="radio"].form-input {
    width: auto;
    margin-right: 0.5rem;
  }

  input[type="color"].form-input {
    padding: 0.25rem;
    height: 40px;
    cursor: pointer;
  }

  input[type="range"].form-input {
    padding: 0;
  }

  .field-error {
    font-size: 0.75rem;
    color: var(--firebase-autoform-error-color, #dc3545);
    margin-top: 0.25rem;
  }

  .field-help {
    font-size: 0.75rem;
    color: var(--firebase-autoform-help-color, #6c757d);
    margin-top: 0.25rem;
  }

  .form-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: var(--firebase-autoform-actions-margin, 1rem);
    justify-content: var(--firebase-autoform-actions-align, flex-start);
  }

  .form-button {
    padding: var(--firebase-autoform-button-padding, 0.75rem 1.5rem);
    border: none;
    border-radius: var(--firebase-autoform-button-radius, 4px);
    font-size: var(--firebase-autoform-button-size, 1rem);
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s, opacity 0.2s;
  }

  .form-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .form-button--primary {
    background-color: var(--firebase-autoform-primary-bg, #007bff);
    color: var(--firebase-autoform-primary-color, #ffffff);
  }

  .form-button--primary:hover:not(:disabled) {
    background-color: var(--firebase-autoform-primary-hover, #0056b3);
  }

  .form-button--secondary {
    background-color: var(--firebase-autoform-secondary-bg, #6c757d);
    color: var(--firebase-autoform-secondary-color, #ffffff);
  }

  .form-button--secondary:hover:not(:disabled) {
    background-color: var(--firebase-autoform-secondary-hover, #5a6268);
  }

  .form-message {
    padding: 0.75rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .form-message--success {
    background-color: var(--firebase-autoform-success-bg, #d4edda);
    border: 1px solid var(--firebase-autoform-success-border, #c3e6cb);
    color: var(--firebase-autoform-success-color, #155724);
  }

  .form-message--error {
    background-color: var(--firebase-autoform-error-bg, #f8d7da);
    border: 1px solid var(--firebase-autoform-error-border, #f5c6cb);
    color: var(--firebase-autoform-error-color, #721c24);
  }

  .loading-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
    margin-right: 0.5rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Fieldset styling */
  .form-fieldset {
    border: 1px solid var(--firebase-autoform-fieldset-border, #dee2e6);
    border-radius: 4px;
    padding: 1rem;
    margin: 0;
  }

  .form-fieldset legend {
    padding: 0 0.5rem;
    font-weight: 600;
    color: var(--firebase-autoform-legend-color, #495057);
  }
`;
