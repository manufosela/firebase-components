# @manufosela/firebase-wrapper

A Lit 3 web component that initializes Firebase and provides services to child components.

## Installation

```bash
npm install @manufosela/firebase-wrapper firebase
```

## Usage

### Basic Usage

```html
<script type="module">
  import '@manufosela/firebase-wrapper';
</script>

<firebase-wrapper
  .config=${firebaseConfig}
  @firebase-ready=${handleReady}
  @firebase-error=${handleError}
>
  <!-- Your Firebase components here -->
</firebase-wrapper>
```

### With JavaScript

```javascript
import '@manufosela/firebase-wrapper';

const wrapper = document.createElement('firebase-wrapper');
wrapper.config = {
  apiKey: 'your-api-key',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abc123',
  databaseURL: 'https://your-project.firebaseio.com',
};

wrapper.addEventListener('firebase-ready', (e) => {
  console.log('Firebase ready:', e.detail);
});

document.body.appendChild(wrapper);
```

### With Emulators

```html
<firebase-wrapper
  .config=${firebaseConfig}
  emulators
  show-status
>
  <!-- Your Firebase components here -->
</firebase-wrapper>
```

### Custom Emulator Configuration

```html
<firebase-wrapper
  .config=${firebaseConfig}
  emulators
  .emulatorConfig=${{
    auth: { host: 'localhost', port: 9099 },
    firestore: { host: 'localhost', port: 8080 },
    database: { host: 'localhost', port: 9000 },
    storage: { host: 'localhost', port: 9199 },
  }}
>
  <!-- Your Firebase components here -->
</firebase-wrapper>
```

## Properties

| Property         | Type            | Default | Description                                                |
| ---------------- | --------------- | ------- | ---------------------------------------------------------- |
| `config`         | `Object`        | `null`  | Firebase configuration object                              |
| `emulators`      | `Boolean`       | `false` | Enable connection to Firebase emulators                    |
| `emulatorConfig` | `Object`        | `null`  | Custom emulator host/port configuration                    |
| `showStatus`     | `Boolean`       | `false` | Show initialization status indicator                       |

## Events

| Event            | Detail                                           | Description                            |
| ---------------- | ------------------------------------------------ | -------------------------------------- |
| `firebase-ready` | `{ app, auth, database, firestore, storage }`    | Fired when Firebase is initialized     |
| `firebase-error` | `{ message: string }`                            | Fired when initialization fails        |

## CSS Custom Properties

| Property                           | Default       | Description                     |
| ---------------------------------- | ------------- | ------------------------------- |
| `--firebase-wrapper-font-family`   | `system-ui`   | Font family                     |
| `--firebase-wrapper-success-color` | `#28a745`     | Success state color             |
| `--firebase-wrapper-success-bg`    | `#d4edda`     | Success state background        |
| `--firebase-wrapper-pending-color` | `#856404`     | Pending state color             |
| `--firebase-wrapper-pending-bg`    | `#fff3cd`     | Pending state background        |
| `--firebase-wrapper-error-color`   | `#dc3545`     | Error state color               |
| `--firebase-wrapper-error-bg`      | `#f8d7da`     | Error state background          |
| `--firebase-wrapper-emulator-bg`   | `#6c757d`     | Emulator badge background       |
| `--firebase-wrapper-emulator-color`| `#fff`        | Emulator badge text color       |

## Slots

| Slot      | Description                                        |
| --------- | -------------------------------------------------- |
| (default) | Child components that will use Firebase services   |

## Accessing Firebase Services

After the `firebase-ready` event, you can access Firebase services:

```javascript
wrapper.addEventListener('firebase-ready', () => {
  const auth = wrapper.auth;
  const database = wrapper.database;
  const firestore = wrapper.firestore;
  const storage = wrapper.storage;
});

// Or check if ready
if (wrapper.isReady) {
  const auth = wrapper.auth;
}
```

## TypeScript

TypeScript definitions are included:

```typescript
import { FirebaseWrapper, FirebaseConfig } from '@manufosela/firebase-wrapper';

const config: FirebaseConfig = {
  apiKey: 'your-api-key',
  // ...
};
```

## License

MIT
