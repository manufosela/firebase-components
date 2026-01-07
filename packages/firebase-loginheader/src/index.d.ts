import { LitElement } from 'lit';
import { User } from 'firebase/auth';

export interface AuthStateChangeEventDetail {
  user: User | null;
  isAuthenticated: boolean;
}

export interface MenuItemClickEventDetail {
  action: string;
  user: User | null;
}

export interface MenuItem {
  label: string;
  action: string;
  icon?: string;
}

export declare class FirebaseLoginheader extends LitElement {
  /** Show user display name */
  showName: boolean;

  /** Show user email */
  showEmail: boolean;

  /** Show user menu dropdown */
  showMenu: boolean;

  /** Default avatar URL when user has no photo */
  defaultAvatar: string;

  /** Login button text */
  loginText: string;

  /** Logout menu item text */
  logoutText: string;

  /** Custom menu items */
  menuItems: MenuItem[];

  /** Current authenticated user */
  readonly user: User | null;

  /** Whether user is authenticated */
  readonly isAuthenticated: boolean;

  /**
   * Sign out the current user
   */
  signOut(): Promise<void>;

  /**
   * Open the user menu
   */
  openMenu(): void;

  /**
   * Close the user menu
   */
  closeMenu(): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'firebase-loginheader': FirebaseLoginheader;
  }
}
