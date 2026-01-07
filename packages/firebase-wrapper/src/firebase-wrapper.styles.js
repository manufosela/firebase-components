import { css } from 'lit';

/**
 * Styles for FirebaseWrapper component
 * @description CSS custom properties for theming:
 * - --firebase-wrapper-font-family: Font family (default: system-ui)
 * - --firebase-wrapper-error-color: Error text color (default: #dc3545)
 * - --firebase-wrapper-success-color: Success indicator color (default: #28a745)
 * - --firebase-wrapper-pending-color: Pending indicator color (default: #ffc107)
 */
export const styles = css`
  :host {
    display: block;
    font-family: var(--firebase-wrapper-font-family, system-ui, -apple-system, sans-serif);
  }

  :host([hidden]) {
    display: none;
  }

  .status-indicator {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
  }

  .status-indicator--ready {
    background-color: var(--firebase-wrapper-success-bg, #d4edda);
    color: var(--firebase-wrapper-success-color, #28a745);
  }

  .status-indicator--pending {
    background-color: var(--firebase-wrapper-pending-bg, #fff3cd);
    color: var(--firebase-wrapper-pending-color, #856404);
  }

  .status-indicator--error {
    background-color: var(--firebase-wrapper-error-bg, #f8d7da);
    color: var(--firebase-wrapper-error-color, #dc3545);
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: currentColor;
  }

  .error-message {
    margin-top: 0.5rem;
    padding: 0.75rem;
    background-color: var(--firebase-wrapper-error-bg, #f8d7da);
    border: 1px solid var(--firebase-wrapper-error-color, #dc3545);
    border-radius: 4px;
    color: var(--firebase-wrapper-error-color, #dc3545);
    font-size: 0.875rem;
  }

  .emulator-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background-color: var(--firebase-wrapper-emulator-bg, #6c757d);
    color: var(--firebase-wrapper-emulator-color, #fff);
    border-radius: 4px;
    font-size: 0.75rem;
    margin-left: 0.5rem;
  }
`;
