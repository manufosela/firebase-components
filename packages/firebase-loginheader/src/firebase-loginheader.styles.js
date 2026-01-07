import { css } from 'lit';

/**
 * Styles for FirebaseLoginheader component
 */
export const styles = css`
  :host {
    display: inline-flex;
    align-items: center;
    font-family: var(--firebase-loginheader-font-family, system-ui, -apple-system, sans-serif);
    position: relative;
  }

  :host([hidden]) {
    display: none;
  }

  .header-container {
    display: flex;
    align-items: center;
    gap: var(--firebase-loginheader-gap, 0.75rem);
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: var(--firebase-loginheader-radius, 9999px);
    transition: background-color 0.2s;
  }

  .user-info:hover {
    background-color: var(--firebase-loginheader-hover-bg, rgba(0, 0, 0, 0.05));
  }

  .avatar {
    width: var(--firebase-loginheader-avatar-size, 36px);
    height: var(--firebase-loginheader-avatar-size, 36px);
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--firebase-loginheader-avatar-border, #e9ecef);
  }

  .avatar-placeholder {
    width: var(--firebase-loginheader-avatar-size, 36px);
    height: var(--firebase-loginheader-avatar-size, 36px);
    border-radius: 50%;
    background-color: var(--firebase-loginheader-placeholder-bg, #6c757d);
    color: var(--firebase-loginheader-placeholder-color, white);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: calc(var(--firebase-loginheader-avatar-size, 36px) * 0.4);
  }

  .user-details {
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .user-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--firebase-loginheader-name-color, #212529);
    line-height: 1.2;
  }

  .user-email {
    font-size: 0.75rem;
    color: var(--firebase-loginheader-email-color, #6c757d);
    line-height: 1.2;
  }

  .dropdown-icon {
    font-size: 0.75rem;
    color: var(--firebase-loginheader-dropdown-color, #6c757d);
    transition: transform 0.2s;
  }

  .dropdown-icon.open {
    transform: rotate(180deg);
  }

  .login-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: var(--firebase-loginheader-btn-bg, #007bff);
    color: var(--firebase-loginheader-btn-color, white);
    border: none;
    border-radius: var(--firebase-loginheader-btn-radius, 4px);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .login-btn:hover {
    background-color: var(--firebase-loginheader-btn-hover-bg, #0056b3);
  }

  .menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    min-width: 200px;
    background-color: var(--firebase-loginheader-menu-bg, white);
    border: 1px solid var(--firebase-loginheader-menu-border, #e9ecef);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    overflow: hidden;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
  }

  .menu.open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .menu-header {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--firebase-loginheader-menu-border, #e9ecef);
    background-color: var(--firebase-loginheader-menu-header-bg, #f8f9fa);
  }

  .menu-header-name {
    font-weight: 600;
    color: var(--firebase-loginheader-name-color, #212529);
  }

  .menu-header-email {
    font-size: 0.75rem;
    color: var(--firebase-loginheader-email-color, #6c757d);
    word-break: break-all;
  }

  .menu-items {
    padding: 0.5rem 0;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--firebase-loginheader-item-color, #495057);
    text-align: left;
    transition: background-color 0.2s;
  }

  .menu-item:hover {
    background-color: var(--firebase-loginheader-item-hover-bg, #f8f9fa);
  }

  .menu-item-icon {
    width: 1rem;
    text-align: center;
  }

  .menu-divider {
    height: 1px;
    background-color: var(--firebase-loginheader-menu-border, #e9ecef);
    margin: 0.5rem 0;
  }

  .menu-item--danger {
    color: var(--firebase-loginheader-danger-color, #dc3545);
  }

  .menu-item--danger:hover {
    background-color: var(--firebase-loginheader-danger-hover-bg, #fff5f5);
  }

  /* Loading state */
  .loading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--firebase-loginheader-loading-color, #6c757d);
  }

  .loading-spinner {
    width: 16px;
    height: 16px;
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
`;
