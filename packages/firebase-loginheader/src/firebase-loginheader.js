import { LitElement, html, nothing } from 'lit';
import { styles } from './firebase-loginheader.styles.js';

/**
 * Firebase Login Header Web Component
 * Displays authentication state with avatar and user menu
 *
 * @element firebase-loginheader
 *
 * @fires auth-state-changed - Fired when authentication state changes
 * @fires menu-item-click - Fired when a menu item is clicked
 * @fires login-click - Fired when login button is clicked
 * @fires logout - Fired when user logs out
 *
 * @cssprop --firebase-loginheader-font-family - Font family
 * @cssprop --firebase-loginheader-avatar-size - Avatar size
 * @cssprop --firebase-loginheader-btn-bg - Login button background
 * @cssprop --firebase-loginheader-menu-bg - Menu background
 *
 * @slot login - Custom login button
 * @slot avatar - Custom avatar
 * @slot menu - Custom menu content
 *
 * @example
 * ```html
 * <firebase-loginheader
 *   show-name
 *   show-email
 *   show-menu
 *   @auth-state-changed=${handleAuth}
 *   @menu-item-click=${handleMenuItem}>
 * </firebase-loginheader>
 * ```
 */
export class FirebaseLoginheader extends LitElement {
  static styles = styles;

  static properties = {
    /** Show user name */
    showName: { type: Boolean, attribute: 'show-name' },

    /** Show user email */
    showEmail: { type: Boolean, attribute: 'show-email' },

    /** Show dropdown menu */
    showMenu: { type: Boolean, attribute: 'show-menu' },

    /** Default avatar URL */
    defaultAvatar: { type: String, attribute: 'default-avatar' },

    /** Login button text */
    loginText: { type: String, attribute: 'login-text' },

    /** Logout text */
    logoutText: { type: String, attribute: 'logout-text' },

    /** Custom menu items */
    menuItems: { type: Array, attribute: 'menu-items' },

    // Internal state
    _user: { type: Object, state: true },
    _loading: { type: Boolean, state: true },
    _menuOpen: { type: Boolean, state: true },
  };

  /** @type {import('firebase/auth').Auth | null} */
  _auth = null;

  /** @type {import('firebase/auth').Unsubscribe | null} */
  _unsubscribe = null;

  constructor() {
    super();
    this.showName = true;
    this.showEmail = false;
    this.showMenu = true;
    this.defaultAvatar = '';
    this.loginText = 'Sign In';
    this.logoutText = 'Sign Out';
    this.menuItems = [];
    this._user = null;
    this._loading = true;
    this._menuOpen = false;

    this._handleClickOutside = this._handleClickOutside.bind(this);
  }

  get user() {
    return this._user;
  }

  get isAuthenticated() {
    return this._user !== null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._findAuth();
    document.addEventListener('click', this._handleClickOutside);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
    document.removeEventListener('click', this._handleClickOutside);
  }

  /**
   * Find auth reference
   * @private
   */
  _findAuth() {
    const wrapper = this.closest('firebase-wrapper');
    if (wrapper && wrapper.auth) {
      this._auth = wrapper.auth;
      this._setupAuthListener();
    } else {
      this._initFromGlobal();
    }

    document.addEventListener('firebase-ready', (e) => {
      if (e.detail.auth) {
        this._auth = e.detail.auth;
        this._setupAuthListener();
      }
    });
  }

  /**
   * Initialize from global Firebase
   * @private
   */
  async _initFromGlobal() {
    try {
      const { getAuth } = await import('firebase/auth');
      this._auth = getAuth();
      this._setupAuthListener();
    } catch (error) {
      this._loading = false;
    }
  }

  /**
   * Set up auth state listener
   * @private
   */
  async _setupAuthListener() {
    if (!this._auth) return;

    try {
      const { onAuthStateChanged } = await import('firebase/auth');

      this._unsubscribe = onAuthStateChanged(this._auth, (user) => {
        this._user = user;
        this._loading = false;

        this.dispatchEvent(new CustomEvent('auth-state-changed', {
          detail: { user, isAuthenticated: user !== null },
          bubbles: true,
          composed: true,
        }));
      });
    } catch (error) {
      this._loading = false;
    }
  }

  /**
   * Handle click outside menu
   * @param {MouseEvent} e
   * @private
   */
  _handleClickOutside(e) {
    if (this._menuOpen && !this.contains(e.target)) {
      this._menuOpen = false;
    }
  }

  /**
   * Toggle menu
   * @private
   */
  _toggleMenu() {
    if (this.showMenu) {
      this._menuOpen = !this._menuOpen;
    }
  }

  /**
   * Open menu
   */
  openMenu() {
    this._menuOpen = true;
  }

  /**
   * Close menu
   */
  closeMenu() {
    this._menuOpen = false;
  }

  /**
   * Handle login click
   * @private
   */
  _handleLoginClick() {
    this.dispatchEvent(new CustomEvent('login-click', {
      bubbles: true,
      composed: true,
    }));
  }

  /**
   * Handle menu item click
   * @param {string} action
   * @private
   */
  _handleMenuItemClick(action) {
    this._menuOpen = false;

    this.dispatchEvent(new CustomEvent('menu-item-click', {
      detail: { action, user: this._user },
      bubbles: true,
      composed: true,
    }));
  }

  /**
   * Sign out
   */
  async signOut() {
    if (!this._auth) return;

    try {
      const { signOut } = await import('firebase/auth');
      await signOut(this._auth);

      this._menuOpen = false;

      this.dispatchEvent(new CustomEvent('logout', {
        bubbles: true,
        composed: true,
      }));
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  /**
   * Get user initials
   * @returns {string}
   * @private
   */
  _getInitials() {
    if (!this._user) return '?';

    if (this._user.displayName) {
      return this._user.displayName
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }

    if (this._user.email) {
      return this._user.email[0].toUpperCase();
    }

    return '?';
  }

  /**
   * Render avatar
   * @private
   */
  _renderAvatar() {
    const photoURL = this._user?.photoURL || this.defaultAvatar;

    if (photoURL) {
      return html`<img class="avatar" src="${photoURL}" alt="User avatar" />`;
    }

    return html`<div class="avatar-placeholder">${this._getInitials()}</div>`;
  }

  /**
   * Render user info
   * @private
   */
  _renderUserInfo() {
    if (!this.showName && !this.showEmail) {
      return nothing;
    }

    return html`
      <div class="user-details">
        ${this.showName && this._user?.displayName ? html`
          <span class="user-name">${this._user.displayName}</span>
        ` : nothing}
        ${this.showEmail && this._user?.email ? html`
          <span class="user-email">${this._user.email}</span>
        ` : nothing}
      </div>
    `;
  }

  /**
   * Render menu
   * @private
   */
  _renderMenu() {
    if (!this.showMenu) return nothing;

    return html`
      <div class="menu ${this._menuOpen ? 'open' : ''}">
        <div class="menu-header">
          <div class="menu-header-name">${this._user?.displayName || 'User'}</div>
          <div class="menu-header-email">${this._user?.email || ''}</div>
        </div>
        <div class="menu-items">
          <slot name="menu">
            ${this.menuItems.map(item => html`
              <button
                class="menu-item"
                @click=${() => this._handleMenuItemClick(item.action)}
              >
                ${item.icon ? html`<span class="menu-item-icon">${item.icon}</span>` : nothing}
                ${item.label}
              </button>
            `)}
          </slot>
          ${this.menuItems.length > 0 ? html`<div class="menu-divider"></div>` : nothing}
          <button class="menu-item menu-item--danger" @click=${this.signOut}>
            <span class="menu-item-icon">🚪</span>
            ${this.logoutText}
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render authenticated state
   * @private
   */
  _renderAuthenticated() {
    return html`
      <div class="user-info" @click=${this._toggleMenu}>
        <slot name="avatar">
          ${this._renderAvatar()}
        </slot>
        ${this._renderUserInfo()}
        ${this.showMenu ? html`
          <span class="dropdown-icon ${this._menuOpen ? 'open' : ''}">▼</span>
        ` : nothing}
      </div>
      ${this._renderMenu()}
    `;
  }

  /**
   * Render unauthenticated state
   * @private
   */
  _renderUnauthenticated() {
    return html`
      <slot name="login">
        <button class="login-btn" @click=${this._handleLoginClick}>
          ${this.loginText}
        </button>
      </slot>
    `;
  }

  /**
   * Render loading state
   * @private
   */
  _renderLoading() {
    return html`
      <div class="loading">
        <div class="loading-spinner"></div>
      </div>
    `;
  }

  render() {
    if (this._loading) {
      return this._renderLoading();
    }

    return html`
      <div class="header-container">
        ${this._user ? this._renderAuthenticated() : this._renderUnauthenticated()}
      </div>
    `;
  }
}

customElements.define('firebase-loginheader', FirebaseLoginheader);
