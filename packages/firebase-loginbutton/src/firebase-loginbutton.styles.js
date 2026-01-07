import { css } from 'lit';

/**
 * Styles for FirebaseLoginbutton component
 * @description CSS custom properties for theming:
 * - --firebase-login-font-family: Font family (default: system-ui)
 * - --firebase-login-button-bg: Button background color
 * - --firebase-login-button-color: Button text color
 * - --firebase-login-button-border-radius: Button border radius
 * - --firebase-login-button-padding: Button padding
 */
export const styles = css`
  :host {
    display: inline-block;
    font-family: var(--firebase-login-font-family, system-ui, -apple-system, sans-serif);
  }

  :host([hidden]) {
    display: none;
  }

  .login-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: var(--firebase-login-button-padding, 0.75rem 1.5rem);
    border: var(--firebase-login-button-border, 1px solid transparent);
    border-radius: var(--firebase-login-button-border-radius, 4px);
    font-size: var(--firebase-login-button-font-size, 1rem);
    font-weight: var(--firebase-login-button-font-weight, 500);
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 200px;
  }

  .login-button:focus {
    outline: 2px solid var(--firebase-login-focus-color, #007bff);
    outline-offset: 2px;
  }

  .login-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Google styles */
  .login-button--google {
    background-color: var(--firebase-login-google-bg, #ffffff);
    color: var(--firebase-login-google-color, #757575);
    border-color: var(--firebase-login-google-border, #dadce0);
  }

  .login-button--google:hover:not(:disabled) {
    background-color: var(--firebase-login-google-hover-bg, #f8f9fa);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  /* GitHub styles */
  .login-button--github {
    background-color: var(--firebase-login-github-bg, #24292e);
    color: var(--firebase-login-github-color, #ffffff);
  }

  .login-button--github:hover:not(:disabled) {
    background-color: var(--firebase-login-github-hover-bg, #2f363d);
  }

  /* Email styles */
  .login-button--email {
    background-color: var(--firebase-login-email-bg, #007bff);
    color: var(--firebase-login-email-color, #ffffff);
  }

  .login-button--email:hover:not(:disabled) {
    background-color: var(--firebase-login-email-hover-bg, #0056b3);
  }

  /* Anonymous styles */
  .login-button--anonymous {
    background-color: var(--firebase-login-anonymous-bg, #6c757d);
    color: var(--firebase-login-anonymous-color, #ffffff);
  }

  .login-button--anonymous:hover:not(:disabled) {
    background-color: var(--firebase-login-anonymous-hover-bg, #5a6268);
  }

  /* Microsoft styles */
  .login-button--microsoft {
    background-color: var(--firebase-login-microsoft-bg, #2f2f2f);
    color: var(--firebase-login-microsoft-color, #ffffff);
  }

  .login-button--microsoft:hover:not(:disabled) {
    background-color: var(--firebase-login-microsoft-hover-bg, #1a1a1a);
  }

  /* Twitter/X styles */
  .login-button--twitter {
    background-color: var(--firebase-login-twitter-bg, #1da1f2);
    color: var(--firebase-login-twitter-color, #ffffff);
  }

  .login-button--twitter:hover:not(:disabled) {
    background-color: var(--firebase-login-twitter-hover-bg, #0c85d0);
  }

  /* Facebook styles */
  .login-button--facebook {
    background-color: var(--firebase-login-facebook-bg, #1877f2);
    color: var(--firebase-login-facebook-color, #ffffff);
  }

  .login-button--facebook:hover:not(:disabled) {
    background-color: var(--firebase-login-facebook-hover-bg, #0c5dc7);
  }

  /* Logout button */
  .login-button--logout {
    background-color: var(--firebase-login-logout-bg, #dc3545);
    color: var(--firebase-login-logout-color, #ffffff);
  }

  .login-button--logout:hover:not(:disabled) {
    background-color: var(--firebase-login-logout-hover-bg, #c82333);
  }

  /* Icon styles */
  .button-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  .button-icon svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }

  /* Loading state */
  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Email form styles */
  .email-form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    background: var(--firebase-login-form-bg, #f8f9fa);
    border-radius: var(--firebase-login-button-border-radius, 4px);
    min-width: 280px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .form-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--firebase-login-label-color, #495057);
  }

  .form-group input {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--firebase-login-input-border, #ced4da);
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  .form-group input:focus {
    outline: none;
    border-color: var(--firebase-login-focus-color, #007bff);
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  .form-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .form-actions button {
    flex: 1;
  }

  .error-message {
    padding: 0.5rem 0.75rem;
    background-color: var(--firebase-login-error-bg, #f8d7da);
    border: 1px solid var(--firebase-login-error-border, #f5c6cb);
    border-radius: 4px;
    color: var(--firebase-login-error-color, #721c24);
    font-size: 0.875rem;
  }
`;
