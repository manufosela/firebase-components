# @manufosela/firebase-crud

A Lit 3 web component for Firebase Realtime Database CRUD operations with real-time sync support.

## Installation

```bash
npm install @manufosela/firebase-crud firebase
```

## Usage

### Basic Usage

```html
<script type="module">
  import '@manufosela/firebase-crud';
</script>

<firebase-crud
  path="/users"
  @data-loaded=${handleData}
  @data-error=${handleError}
>
  <!-- Custom content to render data -->
</firebase-crud>
```

### With Firebase Wrapper

```html
<firebase-wrapper .config=${firebaseConfig}>
  <firebase-crud
    path="/users"
    auto-sync
    order-by="createdAt"
    limit-to="10"
    @data-loaded=${handleData}
  >
  </firebase-crud>
</firebase-wrapper>
```

### Programmatic CRUD Operations

```javascript
const crud = document.querySelector('firebase-crud');

// Create with auto-generated key
const key = await crud.create({ name: 'John', email: 'john@example.com' });

// Create with specific key
await crud.create({ name: 'Jane' }, 'custom-key');

// Read
const user = await crud.read(key);

// Update (partial)
await crud.update(key, { email: 'newemail@example.com' });

// Delete
await crud.delete(key);

// Refresh data
await crud.refresh();
```

## Properties

| Property          | Type      | Default             | Description                           |
| ----------------- | --------- | ------------------- | ------------------------------------- |
| `path`            | `String`  | `''`                | Database path to operate on           |
| `autoSync`        | `Boolean` | `false`             | Enable real-time sync with database   |
| `orderBy`         | `String`  | `''`                | Field to order results by             |
| `orderDirection`  | `String`  | `'asc'`             | Order direction (`'asc'` or `'desc'`) |
| `limitTo`         | `Number`  | `0`                 | Limit number of results (0 = no limit)|
| `showLoading`     | `Boolean` | `false`             | Show loading indicator                |
| `emptyMessage`    | `String`  | `'No data available'`| Message when no data                 |

## Events

| Event          | Detail                                         | Description                            |
| -------------- | ---------------------------------------------- | -------------------------------------- |
| `data-loaded`  | `{ data: any, path: string }`                  | Fired when data is loaded              |
| `data-error`   | `{ message: string, path: string }`            | Fired when an error occurs             |
| `data-updated` | `{ operation, key, data, path }`               | Fired on create/update/delete success  |

## CSS Custom Properties

| Property                        | Default     | Description                |
| ------------------------------- | ----------- | -------------------------- |
| `--firebase-crud-font-family`   | `system-ui` | Font family                |
| `--firebase-crud-loading-color` | `#007bff`   | Loading spinner color      |
| `--firebase-crud-error-color`   | `#dc3545`   | Error text color           |
| `--firebase-crud-error-bg`      | `#f8d7da`   | Error background color     |
| `--firebase-crud-success-color` | `#28a745`   | Success text color         |
| `--firebase-crud-success-bg`    | `#d4edda`   | Success background color   |
| `--firebase-crud-empty-color`   | `#6c757d`   | Empty state text color     |
| `--firebase-crud-empty-bg`      | `#f8f9fa`   | Empty state background     |

## Slots

| Slot      | Description                    |
| --------- | ------------------------------ |
| (default) | Custom data rendering          |
| `loading` | Custom loading indicator       |
| `error`   | Custom error display           |
| `empty`   | Custom empty state             |

### Custom Slots Example

```html
<firebase-crud path="/users">
  <div slot="loading">
    <my-custom-spinner></my-custom-spinner>
  </div>
  <div slot="error">
    <my-error-display></my-error-display>
  </div>
  <div slot="empty">
    <p>No users found. Create one!</p>
  </div>
</firebase-crud>
```

## Accessing Data

```javascript
// Via getter
const data = crud.data;

// Via event
crud.addEventListener('data-loaded', (e) => {
  const { data, path } = e.detail;
  console.log('Data:', data);
});

// Check loading state
if (crud.loading) {
  console.log('Loading...');
}

// Check sync state
if (crud.isSyncing) {
  console.log('Real-time sync active');
}
```

## Data Format

When data is loaded, objects are converted to arrays with `_key` property:

```javascript
// Firebase data
{
  "user1": { "name": "John" },
  "user2": { "name": "Jane" }
}

// Converted to
[
  { "_key": "user1", "name": "John" },
  { "_key": "user2", "name": "Jane" }
]
```

## TypeScript

TypeScript definitions are included:

```typescript
import { FirebaseCrud, DataLoadedEventDetail } from '@manufosela/firebase-crud';

const crud = document.querySelector('firebase-crud') as FirebaseCrud;

crud.addEventListener('data-loaded', (e: CustomEvent<DataLoadedEventDetail>) => {
  console.log(e.detail.data);
});
```

## License

MIT
