# @manufosela/firebase-autoform

Auto-generate accessible forms from a schema definition. Works with Firebase Database when available, and still emits `form-submit` events for local usage.

## Installation

```bash
npm install @manufosela/firebase-autoform
```

## Usage

```html
<script type="module">
  import '@manufosela/firebase-autoform';
</script>

<firebase-autoform
  path="/users"
  submit-label="Create user"
  reset-label="Reset"
  .schema="${schema}"
></firebase-autoform>
```

```js
const schema = {
  name: { type: 'text', label: 'Name', required: true },
  email: { type: 'email', label: 'Email', required: true },
  role: {
    type: 'select',
    label: 'Role',
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'editor', label: 'Editor' },
      { value: 'viewer', label: 'Viewer' }
    ]
  },
  active: { type: 'checkbox', label: 'Active user' }
};
```

## Properties

- `path` (string): Firebase database path for create/update operations.
- `schema` (FormSchema): Field definitions used to render inputs.
- `submitLabel` (string): Primary button label.
- `resetLabel` (string): Secondary reset button label. Empty hides the button.
- `resetOnSubmit` (boolean): Clears form after submit.
- `showSuccess` (boolean): Shows a success banner after submit.
- `successMessage` (string): Success banner text.
- `data` (object | null): Existing data to edit.
- `dataKey` (string): Record key for update mode.
- `disabled` (boolean): Disables the entire form.

## Events

- `form-submit`: Emits `{ data, key, path }` after validation passes.
- `form-error`: Emits `{ message }` when submission fails.
- `form-reset`: Emits when the reset button is used.

## Theming

Set CSS custom properties to match your UI:

```css
firebase-autoform {
  --firebase-autoform-font-family: "Space Grotesk", sans-serif;
  --firebase-autoform-gap: 16px;
  --firebase-autoform-label-color: #ff8a3d;
  --firebase-autoform-input-border: #262f3f;
  --firebase-autoform-error-color: #ff6a00;
}
```
