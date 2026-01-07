import { LitElement, html, nothing } from 'lit';
import { styles } from './firebase-autolist.styles.js';

/**
 * Firebase Auto List Web Component
 * Auto-generates lists from Firebase Realtime Database with real-time updates
 *
 * @element firebase-autolist
 *
 * @fires list-loaded - Fired when list data is loaded
 * @fires list-error - Fired when an error occurs
 * @fires item-click - Fired when an item is clicked
 * @fires item-select - Fired when an item is selected
 *
 * @cssprop --firebase-autolist-font-family - Font family
 * @cssprop --firebase-autolist-gap - Gap between items
 * @cssprop --firebase-autolist-item-bg - Item background color
 * @cssprop --firebase-autolist-item-hover-bg - Item hover background
 *
 * @slot item - Custom item template
 * @slot loading - Custom loading indicator
 * @slot empty - Custom empty state
 *
 * @example
 * ```html
 * <firebase-autolist
 *   path="/users"
 *   auto-sync
 *   order-by="name"
 *   limit-to="20"
 *   @list-loaded=${handleList}
 *   @item-click=${handleClick}>
 * </firebase-autolist>
 * ```
 */
export class FirebaseAutolist extends LitElement {
  static styles = styles;

  static properties = {
    /** Database path */
    path: { type: String },

    /** Enable real-time sync */
    autoSync: { type: Boolean, attribute: 'auto-sync' },

    /** Order by field */
    orderBy: { type: String, attribute: 'order-by' },

    /** Order direction */
    orderDirection: { type: String, attribute: 'order-direction' },

    /** Limit results */
    limitTo: { type: Number, attribute: 'limit-to' },

    /** Filter field */
    filterField: { type: String, attribute: 'filter-field' },

    /** Filter value */
    filterValue: { type: String, attribute: 'filter-value' },

    /** Show loading */
    showLoading: { type: Boolean, attribute: 'show-loading' },

    /** Empty message */
    emptyMessage: { type: String, attribute: 'empty-message' },

    /** Show header with count */
    showHeader: { type: Boolean, attribute: 'show-header' },

    /** Show refresh button */
    showRefresh: { type: Boolean, attribute: 'show-refresh' },

    /** Item key field for display */
    keyField: { type: String, attribute: 'key-field' },

    /** Layout type (list, grid, table) */
    layout: { type: String, reflect: true },

    // Internal state
    _items: { type: Array, state: true },
    _loading: { type: Boolean, state: true },
    _error: { type: String, state: true },
    _selectedKey: { type: String, state: true },
  };

  /** @type {import('firebase/database').Database | null} */
  _database = null;

  /** @type {import('firebase/database').Unsubscribe | null} */
  _unsubscribe = null;

  /** @type {((item: object, index: number) => import('lit').TemplateResult) | null} */
  _customRenderer = null;

  constructor() {
    super();
    this.path = '';
    this.autoSync = false;
    this.orderBy = '';
    this.orderDirection = 'asc';
    this.limitTo = 0;
    this.filterField = '';
    this.filterValue = '';
    this.showLoading = true;
    this.emptyMessage = 'No items found';
    this.showHeader = false;
    this.showRefresh = false;
    this.keyField = '';
    this.layout = 'list';
    this._items = [];
    this._loading = false;
    this._error = '';
    this._selectedKey = '';
  }

  get items() {
    return this._items;
  }

  get loading() {
    return this._loading;
  }

  get count() {
    return this._items.length;
  }

  connectedCallback() {
    super.connectedCallback();
    this._findDatabase();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanup();
  }

  updated(changedProperties) {
    const watchedProps = ['path', 'autoSync', 'orderBy', 'limitTo', 'filterField', 'filterValue'];
    if (watchedProps.some(prop => changedProperties.has(prop))) {
      if (this._database && this.path) {
        this._fetchData();
      }
    }
  }

  /**
   * Find database reference
   * @private
   */
  _findDatabase() {
    const wrapper = this.closest('firebase-wrapper');
    if (wrapper && wrapper.database) {
      this._database = wrapper.database;
      if (this.path) {
        this._fetchData();
      }
    } else {
      this._initFromGlobal();
    }

    document.addEventListener('firebase-ready', (e) => {
      if (e.detail.database) {
        this._database = e.detail.database;
        if (this.path) {
          this._fetchData();
        }
      }
    });
  }

  /**
   * Initialize from global Firebase
   * @private
   */
  async _initFromGlobal() {
    try {
      const { getDatabase } = await import('firebase/database');
      this._database = getDatabase();
      if (this.path) {
        this._fetchData();
      }
    } catch (error) {
      // Wait for firebase-ready event
    }
  }

  /**
   * Fetch data from database
   * @private
   */
  async _fetchData() {
    this._cleanup();

    if (!this._database || !this.path) {
      return;
    }

    this._loading = true;
    this._error = '';

    try {
      const { ref, query, orderByChild, limitToFirst, limitToLast, equalTo, onValue, get } =
        await import('firebase/database');

      let dbRef = ref(this._database, this.path);
      const constraints = [];

      if (this.orderBy) {
        constraints.push(orderByChild(this.orderBy));
      }

      if (this.filterField && this.filterValue && this.orderBy === this.filterField) {
        constraints.push(equalTo(this.filterValue));
      }

      if (this.limitTo > 0) {
        if (this.orderDirection === 'desc') {
          constraints.push(limitToLast(this.limitTo));
        } else {
          constraints.push(limitToFirst(this.limitTo));
        }
      }

      if (constraints.length > 0) {
        dbRef = query(dbRef, ...constraints);
      }

      if (this.autoSync) {
        this._unsubscribe = onValue(
          dbRef,
          (snapshot) => this._handleSnapshot(snapshot),
          (error) => this._handleError(error)
        );
      } else {
        const snapshot = await get(dbRef);
        this._handleSnapshot(snapshot);
      }
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Handle snapshot
   * @param {import('firebase/database').DataSnapshot} snapshot
   * @private
   */
  _handleSnapshot(snapshot) {
    this._loading = false;

    if (snapshot.exists()) {
      const data = snapshot.val();

      if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        let items = Object.entries(data).map(([key, value]) => ({
          _key: key,
          ...(typeof value === 'object' ? value : { value }),
        }));

        // Client-side filtering if filter doesn't match orderBy
        if (this.filterField && this.filterValue && this.filterField !== this.orderBy) {
          items = items.filter(item =>
            String(item[this.filterField]).toLowerCase().includes(this.filterValue.toLowerCase())
          );
        }

        // Client-side sorting for desc
        if (this.orderDirection === 'desc' && this.orderBy) {
          items.reverse();
        }

        this._items = items;
      } else if (Array.isArray(data)) {
        this._items = data.map((item, index) => ({
          _key: String(index),
          ...(typeof item === 'object' ? item : { value: item }),
        }));
      } else {
        this._items = [];
      }
    } else {
      this._items = [];
    }

    this._dispatchLoaded();
  }

  /**
   * Handle error
   * @param {Error} error
   * @private
   */
  _handleError(error) {
    this._loading = false;
    this._error = error.message;

    this.dispatchEvent(new CustomEvent('list-error', {
      detail: { message: error.message, path: this.path },
      bubbles: true,
      composed: true,
    }));
  }

  /**
   * Cleanup listeners
   * @private
   */
  _cleanup() {
    if (this._unsubscribe) {
      this._unsubscribe();
      this._unsubscribe = null;
    }
  }

  /**
   * Dispatch list-loaded event
   * @private
   */
  _dispatchLoaded() {
    this.dispatchEvent(new CustomEvent('list-loaded', {
      detail: { items: this._items, count: this._items.length, path: this.path },
      bubbles: true,
      composed: true,
    }));
  }

  /**
   * Set custom item renderer
   * @param {(item: object, index: number) => import('lit').TemplateResult} renderer
   */
  setItemRenderer(renderer) {
    this._customRenderer = renderer;
    this.requestUpdate();
  }

  /**
   * Refresh list data
   */
  async refresh() {
    await this._fetchData();
  }

  /**
   * Handle item click
   * @param {object} item
   * @param {number} index
   * @private
   */
  _handleItemClick(item, index) {
    this._selectedKey = item._key;

    this.dispatchEvent(new CustomEvent('item-click', {
      detail: { item, key: item._key, index },
      bubbles: true,
      composed: true,
    }));

    this.dispatchEvent(new CustomEvent('item-select', {
      detail: { item, key: item._key, index },
      bubbles: true,
      composed: true,
    }));
  }

  /**
   * Default item renderer
   * @param {object} item
   * @param {number} _index
   * @returns {import('lit').TemplateResult}
   * @private
   */
  _defaultItemRenderer(item, _index) {
    const displayValue = this.keyField && item[this.keyField]
      ? item[this.keyField]
      : item._key;

    return html`<span>${displayValue}</span>`;
  }

  /**
   * Render loading state
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
   * Render empty state
   * @private
   */
  _renderEmpty() {
    return html`
      <slot name="empty">
        <div class="empty">${this.emptyMessage}</div>
      </slot>
    `;
  }

  /**
   * Render error state
   * @private
   */
  _renderError() {
    return html`<div class="error">${this._error}</div>`;
  }

  /**
   * Render header
   * @private
   */
  _renderHeader() {
    if (!this.showHeader) return nothing;

    return html`
      <div class="list-header">
        <span class="list-count">${this._items.length} items</span>
        ${this.showRefresh ? html`
          <button class="refresh-btn" @click=${this.refresh}>
            Refresh
          </button>
        ` : nothing}
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

    if (this._items.length === 0) {
      return this._renderEmpty();
    }

    const renderer = this._customRenderer || this._defaultItemRenderer.bind(this);

    return html`
      ${this._renderHeader()}
      <div class="list-container" role="list">
        ${this._items.map((item, index) => html`
          <div
            class="list-item ${item._key === this._selectedKey ? 'list-item--selected' : ''}"
            role="listitem"
            tabindex="0"
            @click=${() => this._handleItemClick(item, index)}
            @keydown=${(e) => e.key === 'Enter' && this._handleItemClick(item, index)}
          >
            <slot name="item" .item=${item} .index=${index}>
              ${renderer(item, index)}
            </slot>
          </div>
        `)}
      </div>
    `;
  }
}

customElements.define('firebase-autolist', FirebaseAutolist);
