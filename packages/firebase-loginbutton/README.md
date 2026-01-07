# @manufosela/firebase-loginbutton

A Lit 3 web component for Firebase authentication with multiple providers support.

## Installation

```bash
npm install @manufosela/firebase-loginbutton firebase
```

## Usage

### Basic Usage

```html
<script type="module">
  import '@manufosela/firebase-loginbutton';
</script>

<firebase-loginbutton
  provider="google"
  @login-success=${handleSuccess}
  @login-error=${handleError}
>
</firebase-loginbutton>
```

### Available Providers

```html
<!-- Google -->
<firebase-loginbutton provider="google"></firebase-loginbutton>

<!-- GitHub -->
<firebase-loginbutton provider="github"></firebase-loginbutton>

<!-- Email/Password -->
<firebase-loginbutton provider="email"></firebase-loginbutton>

<!-- Anonymous -->
<firebase-loginbutton provider="anonymous"></firebase-loginbutton>

<!-- Microsoft -->
<firebase-loginbutton provider="microsoft"></firebase-loginbutton>

<!-- Twitter -->
<firebase-loginbutton provider="twitter"></firebase-loginbutton>

<!-- Facebook -->
<firebase-loginbutton provider="facebook"></firebase-loginbutton>
```

### With Custom Label

```html
<firebase-loginbutton
  provider="google"
  label="Continue with Google"
>
</firebase-loginbutton>
```

### With OAuth Scopes

```html
<firebase-loginbutton
  provider="github"
  scopes="user:email,read:org"
>
</firebase-loginbutton>
```

### With Logout Functionality

```html
<firebase-loginbutton
  provider="google"
  show-logout
  @logout=${handleLogout}
>
</firebase-loginbutton>
```

### Using Redirect Instead of Popup

```html
<firebase-loginbutton
  provider="google"
  .popup=${false}
>
</firebase-loginbutton>
```

## Properties

| Property     | Type      | Default   | Description                              |
| ------------ | --------- | --------- | ---------------------------------------- |
| `provider`   | `String`  | `'google'`| Auth provider (google, github, email, etc.) |
| `label`      | `String`  | `''`      | Custom button label                      |
| `disabled`   | `Boolean` | `false`   | Disable the button                       |
| `showLogout` | `Boolean` | `false`   | Show logout button when authenticated    |
| `popup`      | `Boolean` | `true`    | Use popup (true) or redirect (false)     |
| `scopes`     | `String`  | `''`      | OAuth scopes (comma-separated)           |

## Events

| Event          | Detail                    | Description                    |
| -------------- | ------------------------- | ------------------------------ |
| `login-success`| `{ user: UserInfo }`      | Fired on successful login      |
| `login-error`  | `{ message: string }`     | Fired on login failure         |
| `logout`       | `{}`                      | Fired when user logs out       |

### UserInfo Object

```typescript
interface UserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  providerId: string | null;
}
```

## CSS Custom Properties

| Property                              | Default     | Description                |
| ------------------------------------- | ----------- | -------------------------- |
| `--firebase-login-font-family`        | `system-ui` | Font family                |
| `--firebase-login-button-padding`     | `0.75rem 1.5rem` | Button padding        |
| `--firebase-login-button-border-radius` | `4px`     | Button border radius       |
| `--firebase-login-button-font-size`   | `1rem`      | Button font size           |
| `--firebase-login-google-bg`          | `#ffffff`   | Google button background   |
| `--firebase-login-google-color`       | `#757575`   | Google button text color   |
| `--firebase-login-github-bg`          | `#24292e`   | GitHub button background   |
| `--firebase-login-github-color`       | `#ffffff`   | GitHub button text color   |
| `--firebase-login-email-bg`           | `#007bff`   | Email button background    |
| `--firebase-login-email-color`        | `#ffffff`   | Email button text color    |
| `--firebase-login-logout-bg`          | `#dc3545`   | Logout button background   |
| `--firebase-login-logout-color`       | `#ffffff`   | Logout button text color   |

## Accessing User

```javascript
const loginBtn = document.querySelector('firebase-loginbutton');

// Check if authenticated
if (loginBtn.isAuthenticated) {
  console.log('User:', loginBtn.user);
}

// Listen for auth changes
loginBtn.addEventListener('login-success', (e) => {
  const user = e.detail.user;
  console.log(`Welcome, ${user.displayName}!`);
});
```

## Email/Password Flow

When using `provider="email"`, clicking the button shows a form:

1. User enters email and password
2. Component attempts sign-in
3. If user doesn't exist, creates new account
4. Fires `login-success` or `login-error`

## TypeScript

TypeScript definitions are included:

```typescript
import {
  FirebaseLoginbutton,
  AuthProvider,
  UserInfo,
} from '@manufosela/firebase-loginbutton';

const btn = document.querySelector('firebase-loginbutton') as FirebaseLoginbutton;

btn.addEventListener('login-success', (e: CustomEvent<{ user: UserInfo }>) => {
  console.log(e.detail.user.displayName);
});
```

## License

MIT
