import { LitElement, TemplateResult } from 'lit';
import { User } from 'firebase/auth';

/**
 * Available authentication providers
 */
export type AuthProvider =
  | 'google'
  | 'github'
  | 'email'
  | 'anonymous'
  | 'microsoft'
  | 'twitter'
  | 'facebook';

/**
 * User information returned on successful login
 */
export interface UserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  providerId: string | null;
}

/**
 * Login success event detail
 */
export interface LoginSuccessEventDetail {
  user: UserInfo;
}

/**
 * Login error event detail
 */
export interface LoginErrorEventDetail {
  message: string;
}

/**
 * Firebase Login Button Web Component
 *
 * @element firebase-loginbutton
 *
 * @fires login-success - Fired when login is successful
 * @fires login-error - Fired when login fails
 * @fires logout - Fired when user logs out
 */
export declare class FirebaseLoginbutton extends LitElement {
  /**
   * Authentication provider
   */
  provider: AuthProvider;

  /**
   * Button label text
   */
  label: string;

  /**
   * Disable the button
   */
  disabled: boolean;

  /**
   * Show as logout button when authenticated
   */
  showLogout: boolean;

  /**
   * Use popup mode instead of redirect
   */
  popup: boolean;

  /**
   * Custom OAuth scopes (comma-separated)
   */
  scopes: string;

  /**
   * Get the current authenticated user
   */
  get user(): User | null;

  /**
   * Check if user is authenticated
   */
  get isAuthenticated(): boolean;

  render(): TemplateResult;
}

declare global {
  interface HTMLElementTagNameMap {
    'firebase-loginbutton': FirebaseLoginbutton;
  }

  interface HTMLElementEventMap {
    'login-success': CustomEvent<LoginSuccessEventDetail>;
    'login-error': CustomEvent<LoginErrorEventDetail>;
    'logout': CustomEvent<Record<string, never>>;
  }
}
