import { LitElement, html } from 'lit';
import { styles } from './firebase-wrapper.styles.js';

/**
 * @typedef {Object} FirebaseConfig
 * @property {string} apiKey - Firebase API key
 * @property {string} authDomain - Firebase auth domain
 * @property {string} projectId - Firebase project ID
 * @property {string} storageBucket - Firebase storage bucket
 * @property {string} messagingSenderId - Firebase messaging sender ID
 * @property {string} appId - Firebase app ID
 * @property {string} [databaseURL] - Firebase Realtime Database URL
 * @property {string} [measurementId] - Firebase Analytics measurement ID
 */

/**
 * @typedef {Object} EmulatorConfig
 * @property {Object} [auth] - Auth emulator config
 * @property {string} auth.host - Auth emulator host
 * @property {number} auth.port - Auth emulator port
 * @property {Object} [firestore] - Firestore emulator config
 * @property {string} firestore.host - Firestore emulator host
 * @property {number} firestore.port - Firestore emulator port
 * @property {Object} [database] - Realtime Database emulator config
 * @property {string} database.host - Database emulator host
 * @property {number} database.port - Database emulator port
 * @property {Object} [storage] - Storage emulator config
 * @property {string} storage.host - Storage emulator host
 * @property {number} storage.port - Storage emulator port
 * @property {Object} [functions] - Functions emulator config
 * @property {string} functions.host - Functions emulator host
 * @property {number} functions.port - Functions emulator port
 */

/**
 * Firebase Wrapper Web Component
 * Initializes Firebase and provides services to child components
 *
 * @element firebase-wrapper
 *
 * @fires firebase-ready - Fired when Firebase is initialized successfully
 * @fires firebase-error - Fired when Firebase initialization fails
 *
 * @cssprop --firebase-wrapper-font-family - Font family for the component
 * @cssprop --firebase-wrapper-error-color - Color for error states
 * @cssprop --firebase-wrapper-success-color - Color for success states
 * @cssprop --firebase-wrapper-pending-color - Color for pending states
 *
 * @slot - Default slot for child components that will use Firebase services
 *
 * @example
 * ```html
 * <firebase-wrapper
 *   .config=${{ apiKey: '...', projectId: '...' }}
 *   emulators>
 *   <firebase-crud path="/users"></firebase-crud>
 * </firebase-wrapper>
 * ```
 */
export class FirebaseWrapper extends LitElement {
  static styles = styles;

  static properties = {
    /**
     * Firebase configuration object
     * @type {FirebaseConfig}
     */
    config: { type: Object },

    /**
     * Enable emulator connections (uses default ports if emulatorConfig not provided)
     * @type {boolean}
     */
    emulators: { type: Boolean },

    /**
     * Custom emulator configuration
     * @type {EmulatorConfig}
     */
    emulatorConfig: { type: Object, attribute: 'emulator-config' },

    /**
     * Show status indicator
     * @type {boolean}
     */
    showStatus: { type: Boolean, attribute: 'show-status' },

    /**
     * Internal state: initialization status
     * @type {'pending' | 'ready' | 'error'}
     * @private
     */
    _status: { type: String, state: true },

    /**
     * Internal state: error message
     * @type {string}
     * @private
     */
    _errorMessage: { type: String, state: true },
  };

  /** @type {import('firebase/app').FirebaseApp | null} */
  _app = null;

  /** @type {import('firebase/auth').Auth | null} */
  _auth = null;

  /** @type {import('firebase/database').Database | null} */
  _database = null;

  /** @type {import('firebase/firestore').Firestore | null} */
  _firestore = null;

  /** @type {import('firebase/storage').FirebaseStorage | null} */
  _storage = null;

  constructor() {
    super();
    this.config = null;
    this.emulators = false;
    this.emulatorConfig = null;
    this.showStatus = false;
    this._status = 'pending';
    this._errorMessage = '';
  }

  /**
   * Get the Firebase App instance
   * @returns {import('firebase/app').FirebaseApp | null}
   */
  get app() {
    return this._app;
  }

  /**
   * Get the Firebase Auth instance
   * @returns {import('firebase/auth').Auth | null}
   */
  get auth() {
    return this._auth;
  }

  /**
   * Get the Firebase Realtime Database instance
   * @returns {import('firebase/database').Database | null}
   */
  get database() {
    return this._database;
  }

  /**
   * Get the Firebase Firestore instance
   * @returns {import('firebase/firestore').Firestore | null}
   */
  get firestore() {
    return this._firestore;
  }

  /**
   * Get the Firebase Storage instance
   * @returns {import('firebase/storage').FirebaseStorage | null}
   */
  get storage() {
    return this._storage;
  }

  /**
   * Check if Firebase is ready
   * @returns {boolean}
   */
  get isReady() {
    return this._status === 'ready';
  }

  async connectedCallback() {
    super.connectedCallback();
    if (this.config) {
      await this._initializeFirebase();
    }
  }

  /**
   * @param {Map<string, unknown>} changedProperties
   */
  async updated(changedProperties) {
    if (changedProperties.has('config') && this.config && !this._app) {
      await this._initializeFirebase();
    }
  }

  /**
   * Initialize Firebase with the provided configuration
   * @private
   */
  async _initializeFirebase() {
    if (!this.config) {
      this._setError('Firebase configuration is required');
      return;
    }

    try {
      this._status = 'pending';

      // Dynamic import of Firebase modules
      const { initializeApp, getApps, getApp } = await import('firebase/app');

      // Check if app already exists
      if (getApps().length > 0) {
        this._app = getApp();
      } else {
        this._app = initializeApp(this.config);
      }

      // Initialize services
      await this._initializeServices();

      // Connect to emulators if enabled
      if (this.emulators) {
        await this._connectEmulators();
      }

      this._status = 'ready';
      this._dispatchReadyEvent();
    } catch (error) {
      this._setError(error.message);
    }
  }

  /**
   * Initialize Firebase services
   * @private
   */
  async _initializeServices() {
    try {
      // Initialize Auth
      const { getAuth } = await import('firebase/auth');
      this._auth = getAuth(this._app);
    } catch (error) {
      console.warn('Firebase Auth not available:', error.message);
    }

    try {
      // Initialize Realtime Database if URL is provided
      if (this.config.databaseURL) {
        const { getDatabase } = await import('firebase/database');
        this._database = getDatabase(this._app);
      }
    } catch (error) {
      console.warn('Firebase Realtime Database not available:', error.message);
    }

    try {
      // Initialize Firestore
      const { getFirestore } = await import('firebase/firestore');
      this._firestore = getFirestore(this._app);
    } catch (error) {
      console.warn('Firebase Firestore not available:', error.message);
    }

    try {
      // Initialize Storage
      const { getStorage } = await import('firebase/storage');
      this._storage = getStorage(this._app);
    } catch (error) {
      console.warn('Firebase Storage not available:', error.message);
    }
  }

  /**
   * Connect to Firebase emulators
   * @private
   */
  async _connectEmulators() {
    const defaultConfig = {
      auth: { host: 'localhost', port: 9099 },
      firestore: { host: 'localhost', port: 8080 },
      database: { host: 'localhost', port: 9000 },
      storage: { host: 'localhost', port: 9199 },
      functions: { host: 'localhost', port: 5001 },
    };

    const config = { ...defaultConfig, ...this.emulatorConfig };

    try {
      if (this._auth) {
        const { connectAuthEmulator } = await import('firebase/auth');
        connectAuthEmulator(
          this._auth,
          `http://${config.auth.host}:${config.auth.port}`,
          { disableWarnings: true }
        );
      }
    } catch (error) {
      console.warn('Could not connect to Auth emulator:', error.message);
    }

    try {
      if (this._firestore) {
        const { connectFirestoreEmulator } = await import('firebase/firestore');
        connectFirestoreEmulator(
          this._firestore,
          config.firestore.host,
          config.firestore.port
        );
      }
    } catch (error) {
      console.warn('Could not connect to Firestore emulator:', error.message);
    }

    try {
      if (this._database) {
        const { connectDatabaseEmulator } = await import('firebase/database');
        connectDatabaseEmulator(
          this._database,
          config.database.host,
          config.database.port
        );
      }
    } catch (error) {
      console.warn('Could not connect to Database emulator:', error.message);
    }

    try {
      if (this._storage) {
        const { connectStorageEmulator } = await import('firebase/storage');
        connectStorageEmulator(
          this._storage,
          config.storage.host,
          config.storage.port
        );
      }
    } catch (error) {
      console.warn('Could not connect to Storage emulator:', error.message);
    }
  }

  /**
   * Set error state
   * @param {string} message - Error message
   * @private
   */
  _setError(message) {
    this._status = 'error';
    this._errorMessage = message;
    this._dispatchErrorEvent(message);
  }

  /**
   * Dispatch firebase-ready event
   * @private
   */
  _dispatchReadyEvent() {
    this.dispatchEvent(
      new CustomEvent('firebase-ready', {
        detail: {
          app: this._app,
          auth: this._auth,
          database: this._database,
          firestore: this._firestore,
          storage: this._storage,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Dispatch firebase-error event
   * @param {string} message - Error message
   * @private
   */
  _dispatchErrorEvent(message) {
    this.dispatchEvent(
      new CustomEvent('firebase-error', {
        detail: { message },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Get status indicator class
   * @returns {string}
   * @private
   */
  _getStatusClass() {
    return `status-indicator status-indicator--${this._status}`;
  }

  /**
   * Get status text
   * @returns {string}
   * @private
   */
  _getStatusText() {
    switch (this._status) {
      case 'ready':
        return 'Firebase Ready';
      case 'pending':
        return 'Initializing...';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  }

  render() {
    return html`
      ${this.showStatus
        ? html`
            <div class="${this._getStatusClass()}">
              <span class="status-dot"></span>
              <span>${this._getStatusText()}</span>
              ${this.emulators
                ? html`<span class="emulator-badge">Emulators</span>`
                : ''}
            </div>
            ${this._status === 'error' && this._errorMessage
              ? html`<div class="error-message">${this._errorMessage}</div>`
              : ''}
          `
        : ''}
      <slot></slot>
    `;
  }
}

customElements.define('firebase-wrapper', FirebaseWrapper);
