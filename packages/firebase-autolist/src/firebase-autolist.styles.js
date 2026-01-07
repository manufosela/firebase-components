import { css } from 'lit';

/**
 * Styles for FirebaseAutolist component
 */
export const styles = css`
  :host {
    display: block;
    font-family: var(--firebase-autolist-font-family, system-ui, -apple-system, sans-serif);
  }

  :host([hidden]) {
    display: none;
  }

  .list-container {
    display: flex;
    flex-direction: column;
    gap: var(--firebase-autolist-gap, 0.5rem);
  }

  .list-item {
    padding: var(--firebase-autolist-item-padding, 1rem);
    background-color: var(--firebase-autolist-item-bg, #ffffff);
    border: 1px solid var(--firebase-autolist-item-border, #e9ecef);
    border-radius: var(--firebase-autolist-item-radius, 4px);
    cursor: pointer;
    transition: background-color 0.2s, box-shadow 0.2s;
  }

  .list-item:hover {
    background-color: var(--firebase-autolist-item-hover-bg, #f8f9fa);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .list-item:focus {
    outline: 2px solid var(--firebase-autolist-focus-color, #007bff);
    outline-offset: 2px;
  }

  .list-item--selected {
    background-color: var(--firebase-autolist-selected-bg, #e7f1ff);
    border-color: var(--firebase-autolist-selected-border, #007bff);
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 2rem;
    color: var(--firebase-autolist-loading-color, #6c757d);
  }

  .loading-spinner {
    width: 24px;
    height: 24px;
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

  .empty {
    padding: 2rem;
    text-align: center;
    color: var(--firebase-autolist-empty-color, #6c757d);
    background-color: var(--firebase-autolist-empty-bg, #f8f9fa);
    border-radius: 4px;
  }

  .error {
    padding: 1rem;
    background-color: var(--firebase-autolist-error-bg, #f8d7da);
    border: 1px solid var(--firebase-autolist-error-color, #dc3545);
    border-radius: 4px;
    color: var(--firebase-autolist-error-color, #dc3545);
  }

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--firebase-autolist-header-border, #e9ecef);
  }

  .list-count {
    font-size: 0.875rem;
    color: var(--firebase-autolist-count-color, #6c757d);
  }

  .refresh-btn {
    background: none;
    border: 1px solid var(--firebase-autolist-refresh-border, #dee2e6);
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--firebase-autolist-refresh-color, #495057);
    transition: background-color 0.2s;
  }

  .refresh-btn:hover {
    background-color: var(--firebase-autolist-refresh-hover-bg, #f8f9fa);
  }

  /* Grid layout option */
  :host([layout="grid"]) .list-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--firebase-autolist-grid-min, 250px), 1fr));
  }

  /* Table layout option */
  :host([layout="table"]) .list-container {
    display: table;
    width: 100%;
  }

  :host([layout="table"]) .list-item {
    display: table-row;
  }
`;
