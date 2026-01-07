import { LitElement, TemplateResult } from 'lit';

export interface ListItem {
  _key: string;
  [key: string]: unknown;
}

export interface ListLoadedEventDetail {
  items: ListItem[];
  count: number;
  path: string;
}

export interface ItemClickEventDetail {
  item: ListItem;
  key: string;
  index: number;
}

export type ItemRenderer = (item: ListItem, index: number) => TemplateResult;

export declare class FirebaseAutolist extends LitElement {
  /** Database path to list from */
  path: string;

  /** Enable real-time sync */
  autoSync: boolean;

  /** Field to order by */
  orderBy: string;

  /** Order direction */
  orderDirection: 'asc' | 'desc';

  /** Limit results */
  limitTo: number;

  /** Filter field */
  filterField: string;

  /** Filter value */
  filterValue: string;

  /** Show loading state */
  showLoading: boolean;

  /** Empty message */
  emptyMessage: string;

  /** Current list items */
  readonly items: ListItem[];

  /** Whether list is loading */
  readonly loading: boolean;

  /** Item count */
  readonly count: number;

  /**
   * Set custom item renderer
   * @param renderer - Custom render function
   */
  setItemRenderer(renderer: ItemRenderer): void;

  /**
   * Refresh the list
   */
  refresh(): Promise<void>;
}

declare global {
  interface HTMLElementTagNameMap {
    'firebase-autolist': FirebaseAutolist;
  }
}
