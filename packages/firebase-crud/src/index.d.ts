import { LitElement, TemplateResult } from 'lit';
import { Database } from 'firebase/database';

/**
 * Data loaded event detail
 */
export interface DataLoadedEventDetail {
  data: unknown;
  path: string;
}

/**
 * Data error event detail
 */
export interface DataErrorEventDetail {
  message: string;
  path: string;
}

/**
 * Data updated event detail
 */
export interface DataUpdatedEventDetail {
  operation: 'create' | 'update' | 'delete';
  key: string;
  data: unknown;
  path: string;
}

/**
 * Firebase CRUD Web Component
 *
 * @element firebase-crud
 *
 * @fires data-loaded - Fired when data is loaded from the database
 * @fires data-error - Fired when an error occurs during database operations
 * @fires data-updated - Fired when data is successfully updated/created/deleted
 *
 * @slot - Default slot for custom data rendering
 * @slot loading - Custom loading indicator
 * @slot error - Custom error display
 * @slot empty - Custom empty state
 */
export declare class FirebaseCrud extends LitElement {
  /**
   * Database path to operate on
   */
  path: string;

  /**
   * Enable real-time sync with database
   */
  autoSync: boolean;

  /**
   * Field to order results by
   */
  orderBy: string;

  /**
   * Order direction (asc/desc)
   */
  orderDirection: 'asc' | 'desc';

  /**
   * Limit number of results
   */
  limitTo: number;

  /**
   * Show loading indicator
   */
  showLoading: boolean;

  /**
   * Custom empty message
   */
  emptyMessage: string;

  /**
   * Get the current data
   */
  get data(): unknown;

  /**
   * Check if data is loading
   */
  get loading(): boolean;

  /**
   * Check if sync is active
   */
  get isSyncing(): boolean;

  /**
   * Create data at the current path
   * @param data - Data to create
   * @param key - Optional specific key
   * @returns The key of the created data
   */
  create(data: Record<string, unknown>, key?: string): Promise<string>;

  /**
   * Read data from a specific key
   * @param key - Key to read
   */
  read(key: string): Promise<Record<string, unknown> | null>;

  /**
   * Update data at a specific key
   * @param key - Key to update
   * @param data - Data to update (partial update)
   */
  update(key: string, data: Record<string, unknown>): Promise<void>;

  /**
   * Delete data at a specific key
   * @param key - Key to delete
   */
  delete(key: string): Promise<void>;

  /**
   * Refresh data
   */
  refresh(): Promise<void>;

  render(): TemplateResult;
}

declare global {
  interface HTMLElementTagNameMap {
    'firebase-crud': FirebaseCrud;
  }

  interface HTMLElementEventMap {
    'data-loaded': CustomEvent<DataLoadedEventDetail>;
    'data-error': CustomEvent<DataErrorEventDetail>;
    'data-updated': CustomEvent<DataUpdatedEventDetail>;
  }
}
