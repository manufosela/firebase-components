import { css } from 'lit';

/**
 * Styles for FirebaseCrud component
 * @description CSS custom properties for theming:
 * - --firebase-crud-font-family: Font family (default: system-ui)
 * - --firebase-crud-loading-color: Loading spinner color (default: #007bff)
 * - --firebase-crud-error-color: Error text color (default: #dc3545)
 * - --firebase-crud-success-color: Success text color (default: #28a745)
 */
export const styles = css`
  :host {
    display: block;
    font-family: var(--firebase-crud-font-family, system-ui, -apple-system, sans-serif);
  }

  :host([hidden]) {
    display: none;
  }

  .loading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    color: var(--firebase-crud-loading-color, #007bff);
  }

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

  .error {
    padding: 1rem;
    background-color: var(--firebase-crud-error-bg, #f8d7da);
    border: 1px solid var(--firebase-crud-error-color, #dc3545);
    border-radius: 4px;
    color: var(--firebase-crud-error-color, #dc3545);
  }

  .error-title {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .success-message {
    padding: 0.75rem 1rem;
    background-color: var(--firebase-crud-success-bg, #d4edda);
    border: 1px solid var(--firebase-crud-success-color, #28a745);
    border-radius: 4px;
    color: var(--firebase-crud-success-color, #28a745);
    margin-bottom: 1rem;
  }

  .data-container {
    padding: var(--firebase-crud-padding, 0);
  }

  .empty-state {
    padding: 2rem;
    text-align: center;
    color: var(--firebase-crud-empty-color, #6c757d);
    background-color: var(--firebase-crud-empty-bg, #f8f9fa);
    border-radius: 4px;
  }

  .sync-indicator {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    color: var(--firebase-crud-sync-color, #6c757d);
  }

  .sync-indicator--active {
    color: var(--firebase-crud-sync-active-color, #28a745);
  }

  .sync-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: currentColor;
  }

  .sync-indicator--active .sync-dot {
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
`;
