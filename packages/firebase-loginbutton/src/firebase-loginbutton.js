import { LitElement, html, nothing } from 'lit';
import { styles } from './firebase-loginbutton.styles.js';

/**
 * @typedef {'google' | 'github' | 'email' | 'anonymous' | 'microsoft' | 'twitter' | 'facebook'} AuthProvider
 */

/**
 * @typedef {Object} UserInfo
 * @property {string} uid - User unique identifier
 * @property {string | null} email - User email
 * @property {string | null} displayName - User display name
 * @property {string | null} photoURL - User photo URL
 * @property {boolean} emailVerified - Whether email is verified
 * @property {string | null} providerId - Auth provider ID
 */

/**
 * Firebase Login Button Web Component
 * Provides authentication with multiple Firebase auth providers
 *
 * @element firebase-loginbutton
 *
 * @fires login-success - Fired when login is successful
 * @fires login-error - Fired when login fails
 * @fires logout - Fired when user logs out
 *
 * @cssprop --firebase-login-font-family - Font family for the component
 * @cssprop --firebase-login-button-padding - Button padding
 * @cssprop --firebase-login-button-border-radius - Button border radius
 * @cssprop --firebase-login-google-bg - Google button background
 * @cssprop --firebase-login-github-bg - GitHub button background
 *
 * @example
 * ```html
 * <firebase-loginbutton
 *   provider="google"
 *   label="Sign in with Google"
 *   @login-success=${handleSuccess}
 *   @login-error=${handleError}>
 * </firebase-loginbutton>
 * ```
 */
export class FirebaseLoginbutton extends LitElement {
  static styles = styles;

  static properties = {
    /**
     * Authentication provider
     * @type {AuthProvider}
     */
    provider: { type: String },

    /**
     * Button label text
     * @type {string}
     */
    label: { type: String },

    /**
     * Disable the button
     * @type {boolean}
     */
    disabled: { type: Boolean, reflect: true },

    /**
     * Show as logout button (when user is authenticated)
     * @type {boolean}
     */
    showLogout: { type: Boolean, attribute: 'show-logout' },

    /**
     * Use popup mode instead of redirect
     * @type {boolean}
     */
    popup: { type: Boolean },

    /**
     * Custom OAuth scopes (comma-separated)
     * @type {string}
     */
    scopes: { type: String },

    /**
     * Internal state: loading
     * @type {boolean}
     * @private
     */
    _loading: { type: Boolean, state: true },

    /**
     * Internal state: current user
     * @type {import('firebase/auth').User | null}
     * @private
     */
    _user: { type: Object, state: true },

    /**
     * Internal state: error message
     * @type {string}
     * @private
     */
    _error: { type: String, state: true },

    /**
     * Internal state: show email form
     * @type {boolean}
     * @private
     */
    _showEmailForm: { type: Boolean, state: true },
  };

  /** @type {import('firebase/auth').Auth | null} */
  _auth = null;

  /** @type {import('firebase/auth').Unsubscribe | null} */
  _unsubscribe = null;

  constructor() {
    super();
    this.provider = 'google';
    this.label = '';
    this.disabled = false;
    this.showLogout = false;
    this.popup = true;
    this.scopes = '';
    this._loading = false;
    this._user = null;
    this._error = '';
    this._showEmailForm = false;
  }

  /**
   * Get the current authenticated user
   * @returns {import('firebase/auth').User | null}
   */
  get user() {
    return this._user;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  get isAuthenticated() {
    return this._user !== null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._initAuth();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  /**
   * Initialize Firebase Auth
   * @private
   */
  async _initAuth() {
    // Try to get auth from parent wrapper
    const wrapper = this.closest('firebase-wrapper');
    if (wrapper && wrapper.auth) {
      this._auth = wrapper.auth;
      this._setupAuthListener();
      return;
    }

    // Listen for firebase-ready event
    document.addEventListener('firebase-ready', (e) => {
      if (e.detail.auth) {
        this._auth = e.detail.auth;
        this._setupAuthListener();
      }
    });

    // Try to get from global Firebase
    try {
      const { getAuth } = await import('firebase/auth');
      this._auth = getAuth();
      this._setupAuthListener();
    } catch (error) {
      // Firebase not initialized, will wait for firebase-ready event
    }
  }

  /**
   * Set up auth state listener
   * @private
   */
  async _setupAuthListener() {
    if (!this._auth) return;

    const { onAuthStateChanged } = await import('firebase/auth');
    this._unsubscribe = onAuthStateChanged(this._auth, (user) => {
      this._user = user;
      this._loading = false;
    });
  }

  /**
   * Get the default label for a provider
   * @param {AuthProvider} provider
   * @returns {string}
   * @private
   */
  _getDefaultLabel(provider) {
    const labels = {
      google: 'Sign in with Google',
      github: 'Sign in with GitHub',
      email: 'Sign in with Email',
      anonymous: 'Continue as Guest',
      microsoft: 'Sign in with Microsoft',
      twitter: 'Sign in with Twitter',
      facebook: 'Sign in with Facebook',
    };
    return labels[provider] || 'Sign in';
  }

  /**
   * Get the button class for styling
   * @returns {string}
   * @private
   */
  _getButtonClass() {
    if (this.showLogout && this._user) {
      return 'login-button login-button--logout';
    }
    return `login-button login-button--${this.provider}`;
  }

  /**
   * Handle button click
   * @private
   */
  async _handleClick() {
    if (this.showLogout && this._user) {
      await this._logout();
      return;
    }

    if (this.provider === 'email') {
      this._showEmailForm = true;
      return;
    }

    await this._login();
  }

  /**
   * Perform login based on provider
   * @private
   */
  async _login() {
    if (!this._auth) {
      this._setError('Authentication not initialized');
      return;
    }

    this._loading = true;
    this._error = '';

    try {
      const {
        signInWithPopup,
        signInWithRedirect,
        signInAnonymously,
        GoogleAuthProvider,
        GithubAuthProvider,
        OAuthProvider,
        TwitterAuthProvider,
        FacebookAuthProvider,
      } = await import('firebase/auth');

      let provider;
      let result;

      switch (this.provider) {
        case 'google':
          provider = new GoogleAuthProvider();
          if (this.scopes) {
            this.scopes.split(',').forEach((scope) => {
              provider.addScope(scope.trim());
            });
          }
          break;

        case 'github':
          provider = new GithubAuthProvider();
          if (this.scopes) {
            this.scopes.split(',').forEach((scope) => {
              provider.addScope(scope.trim());
            });
          }
          break;

        case 'microsoft':
          provider = new OAuthProvider('microsoft.com');
          if (this.scopes) {
            this.scopes.split(',').forEach((scope) => {
              provider.addScope(scope.trim());
            });
          }
          break;

        case 'twitter':
          provider = new TwitterAuthProvider();
          break;

        case 'facebook':
          provider = new FacebookAuthProvider();
          if (this.scopes) {
            this.scopes.split(',').forEach((scope) => {
              provider.addScope(scope.trim());
            });
          }
          break;

        case 'anonymous':
          result = await signInAnonymously(this._auth);
          this._dispatchLoginSuccess(result.user);
          return;

        default:
          throw new Error(`Unsupported provider: ${this.provider}`);
      }

      if (this.popup) {
        result = await signInWithPopup(this._auth, provider);
      } else {
        await signInWithRedirect(this._auth, provider);
        return; // Redirect will handle the rest
      }

      this._dispatchLoginSuccess(result.user);
    } catch (error) {
      this._setError(error.message);
    } finally {
      this._loading = false;
    }
  }

  /**
   * Handle email/password login
   * @param {Event} e - Form submit event
   * @private
   */
  async _handleEmailLogin(e) {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    if (!this._auth) {
      this._setError('Authentication not initialized');
      return;
    }

    this._loading = true;
    this._error = '';

    try {
      const { signInWithEmailAndPassword, createUserWithEmailAndPassword } =
        await import('firebase/auth');

      let result;
      try {
        // Try to sign in first
        result = await signInWithEmailAndPassword(this._auth, email, password);
      } catch (signInError) {
        // If user doesn't exist, create account
        if (signInError.code === 'auth/user-not-found') {
          result = await createUserWithEmailAndPassword(
            this._auth,
            email,
            password
          );
        } else {
          throw signInError;
        }
      }

      this._showEmailForm = false;
      this._dispatchLoginSuccess(result.user);
    } catch (error) {
      this._setError(this._getReadableError(error.code));
    } finally {
      this._loading = false;
    }
  }

  /**
   * Get readable error message
   * @param {string} errorCode - Firebase error code
   * @returns {string}
   * @private
   */
  _getReadableError(errorCode) {
    const errors = {
      'auth/invalid-email': 'Invalid email address',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/email-already-in-use': 'Email already in use',
      'auth/weak-password': 'Password is too weak',
      'auth/popup-closed-by-user': 'Login cancelled',
      'auth/cancelled-popup-request': 'Login cancelled',
      'auth/network-request-failed': 'Network error. Please try again.',
    };
    return errors[errorCode] || errorCode;
  }

  /**
   * Cancel email form
   * @private
   */
  _cancelEmailForm() {
    this._showEmailForm = false;
    this._error = '';
  }

  /**
   * Perform logout
   * @private
   */
  async _logout() {
    if (!this._auth) return;

    this._loading = true;

    try {
      const { signOut } = await import('firebase/auth');
      await signOut(this._auth);

      this.dispatchEvent(
        new CustomEvent('logout', {
          detail: {},
          bubbles: true,
          composed: true,
        })
      );
    } catch (error) {
      this._setError(error.message);
    } finally {
      this._loading = false;
    }
  }

  /**
   * Set error state
   * @param {string} message
   * @private
   */
  _setError(message) {
    this._error = message;
    this.dispatchEvent(
      new CustomEvent('login-error', {
        detail: { message },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Dispatch login success event
   * @param {import('firebase/auth').User} user
   * @private
   */
  _dispatchLoginSuccess(user) {
    /** @type {UserInfo} */
    const userInfo = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      providerId: user.providerId,
    };

    this.dispatchEvent(
      new CustomEvent('login-success', {
        detail: { user: userInfo },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Render provider icon
   * @returns {import('lit').TemplateResult}
   * @private
   */
  _renderIcon() {
    if (this._loading) {
      return html`<div class="loading-spinner"></div>`;
    }

    if (this.showLogout && this._user) {
      return html`
        <span class="button-icon">
          <svg viewBox="0 0 24 24">
            <path
              d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
            />
          </svg>
        </span>
      `;
    }

    const icons = {
      google: html`
        <span class="button-icon">
          <svg viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        </span>
      `,
      github: html`
        <span class="button-icon">
          <svg viewBox="0 0 24 24">
            <path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            />
          </svg>
        </span>
      `,
      email: html`
        <span class="button-icon">
          <svg viewBox="0 0 24 24">
            <path
              d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
            />
          </svg>
        </span>
      `,
      anonymous: html`
        <span class="button-icon">
          <svg viewBox="0 0 24 24">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
            />
          </svg>
        </span>
      `,
      microsoft: html`
        <span class="button-icon">
          <svg viewBox="0 0 24 24">
            <path fill="#F25022" d="M1 1h10v10H1z" />
            <path fill="#00A4EF" d="M1 13h10v10H1z" />
            <path fill="#7FBA00" d="M13 1h10v10H13z" />
            <path fill="#FFB900" d="M13 13h10v10H13z" />
          </svg>
        </span>
      `,
      twitter: html`
        <span class="button-icon">
          <svg viewBox="0 0 24 24">
            <path
              d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"
            />
          </svg>
        </span>
      `,
      facebook: html`
        <span class="button-icon">
          <svg viewBox="0 0 24 24">
            <path
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
        </span>
      `,
    };

    return icons[this.provider] || nothing;
  }

  /**
   * Render email form
   * @returns {import('lit').TemplateResult}
   * @private
   */
  _renderEmailForm() {
    return html`
      <form class="email-form" @submit=${this._handleEmailLogin}>
        ${this._error
          ? html`<div class="error-message">${this._error}</div>`
          : ''}
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autocomplete="email"
            placeholder="Enter your email"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            autocomplete="current-password"
            placeholder="Enter your password"
            minlength="6"
          />
        </div>
        <div class="form-actions">
          <button
            type="button"
            class="login-button login-button--anonymous"
            @click=${this._cancelEmailForm}
            ?disabled=${this._loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            class="login-button login-button--email"
            ?disabled=${this._loading}
          >
            ${this._loading
              ? html`<div class="loading-spinner"></div>`
              : 'Sign In'}
          </button>
        </div>
      </form>
    `;
  }

  render() {
    if (this._showEmailForm) {
      return this._renderEmailForm();
    }

    const buttonLabel =
      this.showLogout && this._user
        ? 'Sign Out'
        : this.label || this._getDefaultLabel(this.provider);

    return html`
      <button
        class="${this._getButtonClass()}"
        ?disabled=${this.disabled || this._loading}
        @click=${this._handleClick}
        aria-label=${buttonLabel}
      >
        ${this._renderIcon()}
        <span>${buttonLabel}</span>
      </button>
    `;
  }
}

customElements.define('firebase-loginbutton', FirebaseLoginbutton);
