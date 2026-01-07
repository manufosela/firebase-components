# @manufosela/firebase-uploadfile

A Lit 3 web component for Firebase Storage file uploads with drag-and-drop support and progress tracking.

## Installation

```bash
npm install @manufosela/firebase-uploadfile firebase
```

## Usage

### Basic Usage

```html
<script type="module">
  import '@manufosela/firebase-uploadfile';
</script>

<firebase-uploadfile
  path="/uploads/images"
  accept="image/*"
  @upload-complete=${handleComplete}
  @upload-error=${handleError}
>
</firebase-uploadfile>
```

### With Firebase Wrapper

```html
<firebase-wrapper .config=${firebaseConfig}>
  <firebase-uploadfile
    path="/uploads"
    accept="image/*,.pdf"
    max-size="5242880"
    auto-upload
    @upload-complete=${handleComplete}
  >
  </firebase-uploadfile>
</firebase-wrapper>
```

### Programmatic Upload

```javascript
const uploader = document.querySelector('firebase-uploadfile');

// Upload a file
const file = inputElement.files[0];
const downloadURL = await uploader.upload(file);

// Cancel upload
uploader.cancel();

// Clear selected files
uploader.clear();
```

## Properties

| Property       | Type      | Default      | Description                           |
| -------------- | --------- | ------------ | ------------------------------------- |
| `path`         | `String`  | `'/uploads'` | Storage path for uploads              |
| `accept`       | `String`  | `'*/*'`      | Accepted file types                   |
| `maxSize`      | `Number`  | `10485760`   | Maximum file size in bytes (10MB)     |
| `multiple`     | `Boolean` | `false`      | Allow multiple file selection         |
| `buttonText`   | `String`  | `'Select File'` | Custom button text                 |
| `autoUpload`   | `Boolean` | `false`      | Auto-upload on file selection         |
| `showProgress` | `Boolean` | `true`       | Show upload progress bar              |
| `disabled`     | `Boolean` | `false`      | Disable the component                 |

## Events

| Event             | Detail                                              | Description                    |
| ----------------- | --------------------------------------------------- | ------------------------------ |
| `upload-progress` | `{ progress, bytesTransferred, totalBytes }`        | Fired during upload            |
| `upload-complete` | `{ downloadURL, fullPath, name, size, contentType }`| Fired when upload completes    |
| `upload-error`    | `{ message, code }`                                 | Fired when an error occurs     |

## CSS Custom Properties

| Property                              | Default     | Description              |
| ------------------------------------- | ----------- | ------------------------ |
| `--firebase-uploadfile-font-family`   | `system-ui` | Font family              |
| `--firebase-uploadfile-border-color`  | `#dee2e6`   | Border color             |
| `--firebase-uploadfile-active-color`  | `#007bff`   | Active/hover color       |
| `--firebase-uploadfile-progress-color`| `#007bff`   | Progress bar color       |
| `--firebase-uploadfile-btn-bg`        | `#007bff`   | Button background        |
| `--firebase-uploadfile-btn-color`     | `white`     | Button text color        |
| `--firebase-uploadfile-error-color`   | `#dc3545`   | Error text color         |
| `--firebase-uploadfile-success-color` | `#28a745`   | Success text color       |

## Slots

| Slot     | Description           |
| -------- | --------------------- |
| `icon`   | Custom upload icon    |
| `button` | Custom upload button  |

### Custom Slots Example

```html
<firebase-uploadfile path="/uploads">
  <span slot="icon">📁</span>
  <button slot="button" class="my-button">
    Choose files
  </button>
</firebase-uploadfile>
```

## Drag and Drop

The component supports drag-and-drop file uploads. Simply drag files over the upload area and drop them.

## File Validation

- Files exceeding `maxSize` are rejected
- Use `accept` attribute to filter file types

## TypeScript

TypeScript definitions are included:

```typescript
import { FirebaseUploadfile, UploadCompleteEventDetail } from '@manufosela/firebase-uploadfile';

const uploader = document.querySelector('firebase-uploadfile') as FirebaseUploadfile;

uploader.addEventListener('upload-complete', (e: CustomEvent<UploadCompleteEventDetail>) => {
  console.log('URL:', e.detail.downloadURL);
});
```

## License

MIT
