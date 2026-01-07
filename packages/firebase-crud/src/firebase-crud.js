import { LitElement, html, nothing } from 'lit';
import { styles } from './firebase-crud.styles.js';

/**
 * @typedef {Object} CrudOptions
 * @property {string} [orderBy] - Field to order by
 * @property {'asc' | 'desc'} [orderDirection] - Order direction
 * @property {number} [limitTo] - Limit number of results
 * @property {string} [startAt] - Start at value for pagination
 * @property {string} [endAt] - End at value for pagination
 */

/**
 * Firebase CRUD Web Component
 * Provides CRUD operations for Firebase Realtime Database
 *
 * @element firebase-crud
 *
 * @fires data-loaded - Fired when data is loaded from the database
 * @fires data-error - Fired when an error occurs during database operations
 * @fires data-updated - Fired when data is successfully updated/created/deleted
 *
 * @cssprop --firebase-crud-font-family - Font family for the component
 * @cssprop --firebase-crud-loading-color - Loading spinner color
 * @cssprop --firebase-crud-error-color - Error text color
 * @cssprop --firebase-crud-success-color - Success text color
 *
 * @slot - Default slot for custom data rendering
 * @slot loading - Custom loading indicator
 * @slot error - Custom error display
 * @slot empty - Custom empty state
 *
 * @example
 * ```html
 * <firebase-crud
 *   path="/users"
 *   auto-sync
 *   order-by="createdAt"
 *   limit-to="10"
 *   @data-loaded=${handleData}>
 * </firebase-crud>
 * ```
 */
export class FirebaseCrud extends LitElement {
  static styles = styles;

  static properties = {
    /**
     * Database path to operate on
     * @type {string}
     */
    path: { type: String },

    /**
     * Enable real-time sync with database
     * @type {boolean}
     */
    autoSync: { type: Boolean, attribute: 'auto-sync' },

    /**
     * Field to order results by
     * @type {string}
     */
    orderBy: { type: String, attribute: 'order-by' },

    /**
     * Order direction (asc/desc)
     * @type {'asc' | 'desc'}
     */
    orderDirection: { type: String, attribute: 'order-direction' },

    /**
     * Limit number of results
     * @type {number}
     */
    limitTo: { type: Number, attribute: 'limit-to' },

    /**
     * Show loading indicator
     * @type {boolean}
     */
    showLoading: { type: Boolean, attribute: 'show-loading' },

    /**
     * Custom empty message
     * @type {string}
     */
    emptyMessage: { type: String, attribute: 'empty-message' },

    /**
     * Internal state: loaded data
     * @type {Object | Array | null}
     * @private
     */
    _data: { type: Object, state: true },

    /**
     * Internal state: loading status
     * @type {boolean}
     * @private
     */
    _loading: { type: Boolean, state: true },

    /**
     * Internal state: error message
     * @type {string}
     * @private
     */
    _error: { type: String, state: true },

    /**
     * Internal state: sync active
     * @type {boolean}
     * @private
     */
    _syncActive: { type: Boolean, state: true },
  };

  /** @type {import('firebase/database').Database | null} */
  _database = null;

  /** @type {import('firebase/database').Unsubscribe | null} */
  _unsubscribe = null;

  constructor() {
    super();
    this.path = '';
    this.autoSync = false;
    this.orderBy = '';
    this.orderDirection = 'asc';
    this.limitTo = 0;
    this.showLoading = false;
    this.emptyMessage = 'No data available';
    this._data = null;
    this._loading = false;
    this._error = '';
    this._syncActive = false;
  }

  /**
   * Get the current data
   * @returns {Object | Array | null}
   */
  get data() {
    return this._data;
  }

  /**
   * Check if data is loading
   * @returns {boolean}
   */
  get loading() {
    return this._loading;
  }

  /**
   * Check if sync is active
   * @returns {boolean}
   */
  get isSyncing() {
    return this._syncActive;
  }

  connectedCallback() {
    super.connectedCallback();
    this._findDatabase();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanup();
  }

  /**
   * @param {Map<string, unknown>} changedProperties
   */
  updated(changedProperties) {
    if (
      changedProperties.has('path') ||
      changedProperties.has('autoSync') ||
      changedProperties.has('orderBy') ||
      changedProperties.has('limitTo')
    ) {
      if (this._database && this.path) {
        this._setupDataListener();
      }
    }
  }

  /**
   * Find and set up the database reference from parent firebase-wrapper
   * @private
   */
  _findDatabase() {
    // Look for parent firebase-wrapper or use global Firebase
    const wrapper = this.closest('firebase-wrapper');
    if (wrapper && wrapper.database) {
      this._database = wrapper.database;
      if (this.path) {
        this._setupDataListener();
      }
    } else {
      // Try to get from global Firebase
      this._initFromGlobal();
    }

    // Listen for firebase-ready event
    document.addEventListener('firebase-ready', (e) => {
      if (e.detail.database) {
        this._database = e.detail.database;
        if (this.path) {
          this._setupDataListener();
        }
      }
    });
  }

  /**
   * Initialize from global Firebase instance
   * @private
   */
  async _initFromGlobal() {
    try {
      const { getDatabase } = await import('firebase/database');
      this._database = getDatabase();
      if (this.path) {
        this._setupDataListener();
      }
    } catch (error) {
      // Firebase not initialized globally, will wait for firebase-ready event
    }
  }

  /**
   * Set up data listener based on autoSync setting
   * @private
   */
  async _setupDataListener() {
    this._cleanup();

    if (!this._database || !this.path) {
      return;
    }

    this._loading = true;
    this._error = '';

    try {
      const { ref, query, orderByChild, limitToFirst, limitToLast, onValue, get } =
        await import('firebase/database');

      let dbRef = ref(this._database, this.path);

      // Apply query modifiers
      const queryConstraints = [];

      if (this.orderBy) {
        queryConstraints.push(orderByChild(this.orderBy));
      }

      if (this.limitTo > 0) {
        if (this.orderDirection === 'desc') {
          queryConstraints.push(limitToLast(this.limitTo));
        } else {
          queryConstraints.push(limitToFirst(this.limitTo));
        }
      }

      if (queryConstraints.length > 0) {
        dbRef = query(dbRef, ...queryConstraints);
      }

      if (this.autoSync) {
        // Set up real-time listener
        this._unsubscribe = onValue(
          dbRef,
          (snapshot) => {
            this._handleSnapshot(snapshot);
            this._syncActive = true;
          },
          (error) => {
            this._handleError(error);
            this._syncActive = false;
          }
        );
      } else {
        // One-time read
        const snapshot = await get(dbRef);
        this._handleSnapshot(snapshot);
      }
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Handle database snapshot
   * @param {import('firebase/database').DataSnapshot} snapshot
   * @private
   */
  _handleSnapshot(snapshot) {
    this._loading = false;

    if (snapshot.exists()) {
      const data = snapshot.val();

      // Convert to array if it's an object with keys
      if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        this._data = Object.entries(data).map(([key, value]) => ({
          _key: key,
          ...value,
        }));
      } else {
        this._data = data;
      }
    } else {
      this._data = null;
    }

    this._dispatchDataLoaded();
  }

  /**
   * Handle database error
   * @param {Error} error
   * @private
   */
  _handleError(error) {
    this._loading = false;
    this._error = error.message;
    this._dispatchError(error.message);
  }

  /**
   * Clean up listeners
   * @private
   */
  _cleanup() {
    if (this._unsubscribe) {
      this._unsubscribe();
      this._unsubscribe = null;
    }
    this._syncActive = false;
  }

  /**
   * Create data at the current path
   * @param {Object} data - Data to create
   * @param {string} [key] - Optional specific key (otherwise auto-generated)
   * @returns {Promise<string>} The key of the created data
   */
  async create(data, key = null) {
    if (!this._database || !this.path) {
      throw new Error('Database not initialized or path not set');
    }

    try {
      const { ref, push, set } = await import('firebase/database');

      let newRef;
      if (key) {
        newRef = ref(this._database, `${this.path}/${key}`);
        await set(newRef, data);
      } else {
        const listRef = ref(this._database, this.path);
        newRef = push(listRef);
        await set(newRef, data);
      }

      const newKey = key || newRef.key;
      this._dispatchDataUpdated('create', newKey, data);
      return newKey;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Read data from a specific key
   * @param {string} key - Key to read
   * @returns {Promise<Object | null>}
   */
  async read(key) {
    if (!this._database || !this.path) {
      throw new Error('Database not initialized or path not set');
    }

    try {
      const { ref, get } = await import('firebase/database');
      const dataRef = ref(this._database, `${this.path}/${key}`);
      const snapshot = await get(dataRef);

      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Update data at a specific key
   * @param {string} key - Key to update
   * @param {Object} data - Data to update (partial update)
   * @returns {Promise<void>}
   */
  async update(key, data) {
    if (!this._database || !this.path) {
      throw new Error('Database not initialized or path not set');
    }

    try {
      const { ref, update } = await import('firebase/database');
      const dataRef = ref(this._database, `${this.path}/${key}`);
      await update(dataRef, data);

      this._dispatchDataUpdated('update', key, data);
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Delete data at a specific key
   * @param {string} key - Key to delete
   * @returns {Promise<void>}
   */
  async delete(key) {
    if (!this._database || !this.path) {
      throw new Error('Database not initialized or path not set');
    }

    try {
      const { ref, remove } = await import('firebase/database');
      const dataRef = ref(this._database, `${this.path}/${key}`);
      await remove(dataRef);

      this._dispatchDataUpdated('delete', key, null);
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Refresh data (useful when autoSync is false)
   * @returns {Promise<void>}
   */
  async refresh() {
    await this._setupDataListener();
  }

  /**
   * Dispatch data-loaded event
   * @private
   */
  _dispatchDataLoaded() {
    this.dispatchEvent(
      new CustomEvent('data-loaded', {
        detail: { data: this._data, path: this.path },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Dispatch data-error event
   * @param {string} message - Error message
   * @private
   */
  _dispatchError(message) {
    this.dispatchEvent(
      new CustomEvent('data-error', {
        detail: { message, path: this.path },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Dispatch data-updated event
   * @param {'create' | 'update' | 'delete'} operation - Operation type
   * @param {string} key - Affected key
   * @param {Object | null} data - Updated data
   * @private
   */
  _dispatchDataUpdated(operation, key, data) {
    this.dispatchEvent(
      new CustomEvent('data-updated', {
        detail: { operation, key, data, path: this.path },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Render loading state
   * @returns {import('lit').TemplateResult}
   * @private
   */
  _renderLoading() {
    return html`
      <slot name="loading">
        <div class="loading">
          <div class="loading-spinner"></div>
          <span>Loading...</span>
        </div>
      </slot>
    `;
  }

  /**
   * Render error state
   * @returns {import('lit').TemplateResult}
   * @private
   */
  _renderError() {
    return html`
      <slot name="error">
        <div class="error">
          <div class="error-title">Error</div>
          <div>${this._error}</div>
        </div>
      </slot>
    `;
  }

  /**
   * Render empty state
   * @returns {import('lit').TemplateResult}
   * @private
   */
  _renderEmpty() {
    return html`
      <slot name="empty">
        <div class="empty-state">${this.emptyMessage}</div>
      </slot>
    `;
  }

  /**
   * Render sync indicator
   * @returns {import('lit').TemplateResult}
   * @private
   */
  _renderSyncIndicator() {
    if (!this.autoSync) return nothing;

    const syncClass = this._syncActive
      ? 'sync-indicator sync-indicator--active'
      : 'sync-indicator';

    return html`
      <div class="${syncClass}">
        <span class="sync-dot"></span>
        <span>${this._syncActive ? 'Syncing' : 'Disconnected'}</span>
      </div>
    `;
  }

  render() {
    if (this._loading && this.showLoading) {
      return this._renderLoading();
    }

    if (this._error) {
      return this._renderError();
    }

    if (
      !this._data ||
      (Array.isArray(this._data) && this._data.length === 0)
    ) {
      return html`
        ${this._renderSyncIndicator()}
        ${this._renderEmpty()}
      `;
    }

    return html`
      ${this._renderSyncIndicator()}
      <div class="data-container">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('firebase-crud', FirebaseCrud);
