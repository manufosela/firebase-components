# @manufosela/firebase-loginheader

A Lit 3 web component for displaying Firebase authentication state with avatar, user info, and dropdown menu.

## Installation

```bash
npm install @manufosela/firebase-loginheader firebase
```

## Usage

### Basic Usage

```html
<script type="module">
  import '@manufosela/firebase-loginheader';
</script>

<firebase-loginheader
  show-name
  show-email
  show-menu
  @login-click=${handleLogin}
  @logout=${handleLogout}
>
</firebase-loginheader>
```

### With Firebase Wrapper

```html
<firebase-wrapper .config=${firebaseConfig}>
  <header>
    <h1>My App</h1>
    <firebase-loginheader
      show-name
      show-menu
      .menuItems=${[
        { label: 'Profile', action: 'profile', icon: '👤' },
        { label: 'Settings', action: 'settings', icon: '⚙️' }
      ]}
      @menu-item-click=${handleMenuItem}
    >
    </firebase-loginheader>
  </header>
</firebase-wrapper>
```

### Handling Login

```javascript
const header = document.querySelector('firebase-loginheader');

header.addEventListener('login-click', () => {
  // Show your login modal or redirect
  showLoginModal();
});

header.addEventListener('auth-state-changed', (e) => {
  const { user, isAuthenticated } = e.detail;
  if (isAuthenticated) {
    console.log('Logged in as:', user.email);
  }
});
```

## Properties

| Property        | Type       | Default      | Description                      |
| --------------- | ---------- | ------------ | -------------------------------- |
| `showName`      | `Boolean`  | `true`       | Show user display name           |
| `showEmail`     | `Boolean`  | `false`      | Show user email                  |
| `showMenu`      | `Boolean`  | `true`       | Show dropdown menu               |
| `defaultAvatar` | `String`   | `''`         | Default avatar URL               |
| `loginText`     | `String`   | `'Sign In'`  | Login button text                |
| `logoutText`    | `String`   | `'Sign Out'` | Logout menu item text            |
| `menuItems`     | `Array`    | `[]`         | Custom menu items                |

### Menu Items Format

```javascript
const menuItems = [
  { label: 'Profile', action: 'profile', icon: '👤' },
  { label: 'Settings', action: 'settings', icon: '⚙️' },
  { label: 'Help', action: 'help', icon: '❓' }
];
```

## Events

| Event               | Detail                          | Description                      |
| ------------------- | ------------------------------- | -------------------------------- |
| `auth-state-changed`| `{ user, isAuthenticated }`     | Fired on auth state change       |
| `login-click`       | -                               | Fired when login button clicked  |
| `logout`            | -                               | Fired when user logs out         |
| `menu-item-click`   | `{ action, user }`              | Fired when menu item clicked     |

## CSS Custom Properties

| Property                               | Default     | Description              |
| -------------------------------------- | ----------- | ------------------------ |
| `--firebase-loginheader-font-family`   | `system-ui` | Font family              |
| `--firebase-loginheader-avatar-size`   | `36px`      | Avatar size              |
| `--firebase-loginheader-btn-bg`        | `#007bff`   | Login button background  |
| `--firebase-loginheader-btn-color`     | `white`     | Login button text color  |
| `--firebase-loginheader-menu-bg`       | `white`     | Menu background          |
| `--firebase-loginheader-hover-bg`      | `rgba(0,0,0,0.05)` | Hover background  |
| `--firebase-loginheader-name-color`    | `#212529`   | User name color          |
| `--firebase-loginheader-email-color`   | `#6c757d`   | User email color         |

## Slots

| Slot     | Description            |
| -------- | ---------------------- |
| `login`  | Custom login button    |
| `avatar` | Custom avatar          |
| `menu`   | Custom menu content    |

### Custom Slots Example

```html
<firebase-loginheader>
  <button slot="login" class="custom-login-btn">
    Login with Google
  </button>
  <img slot="avatar" src="custom-avatar.png" class="my-avatar" />
</firebase-loginheader>
```

## Methods

```javascript
const header = document.querySelector('firebase-loginheader');

// Sign out programmatically
await header.signOut();

// Control menu
header.openMenu();
header.closeMenu();

// Access user info
const user = header.user;
const isLoggedIn = header.isAuthenticated;
```

## TypeScript

TypeScript definitions are included:

```typescript
import { FirebaseLoginheader, AuthStateChangeEventDetail } from '@manufosela/firebase-loginheader';

const header = document.querySelector('firebase-loginheader') as FirebaseLoginheader;

header.addEventListener('auth-state-changed', (e: CustomEvent<AuthStateChangeEventDetail>) => {
  if (e.detail.isAuthenticated) {
    console.log('User:', e.detail.user?.email);
  }
});
```

## License

MIT
