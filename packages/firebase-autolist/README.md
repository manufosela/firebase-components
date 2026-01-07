# @manufosela/firebase-autolist

A Lit 3 web component for auto-generated lists from Firebase Realtime Database with real-time updates, filtering, and sorting.

## Installation

```bash
npm install @manufosela/firebase-autolist firebase
```

## Usage

### Basic Usage

```html
<script type="module">
  import '@manufosela/firebase-autolist';
</script>

<firebase-autolist
  path="/users"
  @list-loaded=${handleList}
  @item-click=${handleClick}
>
</firebase-autolist>
```

### With Firebase Wrapper

```html
<firebase-wrapper .config=${firebaseConfig}>
  <firebase-autolist
    path="/users"
    auto-sync
    order-by="createdAt"
    order-direction="desc"
    limit-to="20"
    show-header
    show-refresh
    @item-click=${handleClick}
  >
  </firebase-autolist>
</firebase-wrapper>
```

### Custom Item Renderer

```javascript
const list = document.querySelector('firebase-autolist');

list.setItemRenderer((item, index) => html`
  <div class="user-card">
    <img src="${item.avatar}" alt="${item.name}">
    <h3>${item.name}</h3>
    <p>${item.email}</p>
  </div>
`);
```

## Properties

| Property         | Type      | Default          | Description                           |
| ---------------- | --------- | ---------------- | ------------------------------------- |
| `path`           | `String`  | `''`             | Database path to list from            |
| `autoSync`       | `Boolean` | `false`          | Enable real-time sync                 |
| `orderBy`        | `String`  | `''`             | Field to order by                     |
| `orderDirection` | `String`  | `'asc'`          | Order direction (`'asc'` or `'desc'`) |
| `limitTo`        | `Number`  | `0`              | Limit number of results               |
| `filterField`    | `String`  | `''`             | Field to filter by                    |
| `filterValue`    | `String`  | `''`             | Value to filter                       |
| `showLoading`    | `Boolean` | `true`           | Show loading indicator                |
| `emptyMessage`   | `String`  | `'No items found'`| Message when list is empty           |
| `showHeader`     | `Boolean` | `false`          | Show header with item count           |
| `showRefresh`    | `Boolean` | `false`          | Show refresh button                   |
| `keyField`       | `String`  | `''`             | Field to display in default renderer  |
| `layout`         | `String`  | `'list'`         | Layout type (list, grid, table)       |

## Events

| Event         | Detail                             | Description                    |
| ------------- | ---------------------------------- | ------------------------------ |
| `list-loaded` | `{ items, count, path }`           | Fired when list is loaded      |
| `list-error`  | `{ message, path }`                | Fired when an error occurs     |
| `item-click`  | `{ item, key, index }`             | Fired when an item is clicked  |
| `item-select` | `{ item, key, index }`             | Fired when item is selected    |

## CSS Custom Properties

| Property                             | Default     | Description              |
| ------------------------------------ | ----------- | ------------------------ |
| `--firebase-autolist-font-family`    | `system-ui` | Font family              |
| `--firebase-autolist-gap`            | `0.5rem`    | Gap between items        |
| `--firebase-autolist-item-bg`        | `#ffffff`   | Item background          |
| `--firebase-autolist-item-hover-bg`  | `#f8f9fa`   | Item hover background    |
| `--firebase-autolist-item-padding`   | `1rem`      | Item padding             |
| `--firebase-autolist-item-radius`    | `4px`       | Item border radius       |
| `--firebase-autolist-selected-bg`    | `#e7f1ff`   | Selected item background |
| `--firebase-autolist-grid-min`       | `250px`     | Min width for grid items |

## Slots

| Slot      | Description               |
| --------- | ------------------------- |
| `item`    | Custom item template      |
| `loading` | Custom loading indicator  |
| `empty`   | Custom empty state        |

## Layout Options

```html
<!-- List layout (default) -->
<firebase-autolist path="/users" layout="list"></firebase-autolist>

<!-- Grid layout -->
<firebase-autolist path="/users" layout="grid"></firebase-autolist>

<!-- Table layout -->
<firebase-autolist path="/users" layout="table"></firebase-autolist>
```

## Filtering

```html
<!-- Filter by field (works best with orderBy on same field) -->
<firebase-autolist
  path="/users"
  order-by="status"
  filter-field="status"
  filter-value="active"
></firebase-autolist>
```

## TypeScript

TypeScript definitions are included:

```typescript
import { FirebaseAutolist, ItemClickEventDetail } from '@manufosela/firebase-autolist';

const list = document.querySelector('firebase-autolist') as FirebaseAutolist;

list.addEventListener('item-click', (e: CustomEvent<ItemClickEventDetail>) => {
  console.log('Clicked:', e.detail.item);
});
```

## License

MIT
