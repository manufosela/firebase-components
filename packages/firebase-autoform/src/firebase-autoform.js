import { LitElement, html, nothing } from 'lit';
import { styles } from './firebase-autoform.styles.js';

/**
 * @typedef {Object} FieldSchema
 * @property {string} type - Field type (text, number, email, select, checkbox, textarea, etc.)
 * @property {string} [label] - Field label
 * @property {boolean} [required] - Is field required
 * @property {*} [default] - Default value
 * @property {string} [placeholder] - Placeholder text
 * @property {string} [help] - Help text
 * @property {Array<{value: string, label: string}>} [options] - Options for select/radio
 * @property {number} [min] - Minimum value for number/range
 * @property {number} [max] - Maximum value for number/range
 * @property {number} [step] - Step value for number/range
 * @property {number} [minLength] - Minimum length for text
 * @property {number} [maxLength] - Maximum length for text
 * @property {string} [pattern] - Regex pattern for validation
 * @property {boolean} [disabled] - Is field disabled
 * @property {boolean} [readonly] - Is field readonly
 * @property {string} [group] - Fieldset group name
 */

/**
 * @typedef {Object.<string, FieldSchema>} FormSchema
 */

/**
 * Firebase Autoform Web Component
 * Auto-generates forms from schema definition or database structure
 *
 * @element firebase-autoform
 *
 * @fires form-submit - Fired when form is submitted successfully
 * @fires form-error - Fired when form submission fails
 * @fires form-reset - Fired when form is reset
 *
 * @cssprop --firebase-autoform-font-family - Font family
 * @cssprop --firebase-autoform-gap - Gap between form fields
 * @cssprop --firebase-autoform-label-color - Label text color
 * @cssprop --firebase-autoform-input-border - Input border color
 * @cssprop --firebase-autoform-error-color - Error text color
 *
 * @example
 * ```html
 * <firebase-autoform
 *   path="/users"
 *   .schema=${{
 *     name: { type: 'text', label: 'Name', required: true },
 *     email: { type: 'email', label: 'Email', required: true },
 *     age: { type: 'number', label: 'Age', min: 0, max: 120 }
 *   }}
 *   submit-label="Create User"
 *   @form-submit=${handleSubmit}>
 * </firebase-autoform>
 * ```
 */
export class FirebaseAutoform extends LitElement {
  static styles = styles;

  static properties = {
    /**
     * Database path to save data to
     * @type {string}
     */
    path: { type: String },

    /**
     * Form schema definition
     * @type {FormSchema}
     */
    schema: { type: Object },

    /**
     * Submit button label
     * @type {string}
     */
    submitLabel: { type: String, attribute: 'submit-label' },

    /**
     * Reset button label (if empty, no reset button shown)
     * @type {string}
     */
    resetLabel: { type: String, attribute: 'reset-label' },

    /**
     * Reset form after successful submit
     * @type {boolean}
     */
    resetOnSubmit: { type: Boolean, attribute: 'reset-on-submit' },

    /**
     * Show success message after submit
     * @type {boolean}
     */
    showSuccess: { type: Boolean, attribute: 'show-success' },

    /**
     * Success message text
     * @type {string}
     */
    successMessage: { type: String, attribute: 'success-message' },

    /**
     * Existing data to edit (for update mode)
     * @type {Object}
     */
    data: { type: Object },

    /**
     * Data key for updates
     * @type {string}
     */
    dataKey: { type: String, attribute: 'data-key' },

    /**
     * Disable entire form
     * @type {boolean}
     */
    disabled: { type: Boolean, reflect: true },

    /**
     * Internal state: loading
     * @type {boolean}
     * @private
     */
    _loading: { type: Boolean, state: true },

    /**
     * Internal state: field errors
     * @type {Object.<string, string>}
     * @private
     */
    _errors: { type: Object, state: true },

    /**
     * Internal state: form values
     * @type {Object}
     * @private
     */
    _values: { type: Object, state: true },

    /**
     * Internal state: success shown
     * @type {boolean}
     * @private
     */
    _showSuccessMessage: { type: Boolean, state: true },

    /**
     * Internal state: global error
     * @type {string}
     * @private
     */
    _globalError: { type: String, state: true },
  };

  /** @type {import('firebase/database').Database | null} */
  _database = null;

  constructor() {
    super();
    this.path = '';
    this.schema = {};
    this.submitLabel = 'Submit';
    this.resetLabel = '';
    this.resetOnSubmit = false;
    this.showSuccess = true;
    this.successMessage = 'Successfully saved!';
    this.data = null;
    this.dataKey = '';
    this.disabled = false;
    this._loading = false;
    this._errors = {};
    this._values = {};
    this._showSuccessMessage = false;
    this._globalError = '';
  }

  /**
   * Get current form values
   * @returns {Object}
   */
  get values() {
    return { ...this._values };
  }

  /**
   * Check if form is valid
   * @returns {boolean}
   */
  get isValid() {
    return Object.keys(this._errors).length === 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this._initDatabase();
    this._initializeValues();
  }

  /**
   * @param {Map<string, unknown>} changedProperties
   */
  updated(changedProperties) {
    if (changedProperties.has('schema') || changedProperties.has('data')) {
      this._initializeValues();
    }
  }

  /**
   * Initialize database connection
   * @private
   */
  async _initDatabase() {
    const wrapper = this.closest('firebase-wrapper');
    if (wrapper && wrapper.database) {
      this._database = wrapper.database;
      return;
    }

    document.addEventListener('firebase-ready', (e) => {
      if (e.detail.database) {
        this._database = e.detail.database;
      }
    });

    try {
      const { getDatabase } = await import('firebase/database');
      this._database = getDatabase();
    } catch (error) {
      // Wait for firebase-ready event
    }
  }

  /**
   * Initialize form values from schema defaults and existing data
   * @private
   */
  _initializeValues() {
    const values = {};

    // Set defaults from schema
    Object.entries(this.schema).forEach(([key, field]) => {
      if (field.default !== undefined) {
        values[key] = field.default;
      } else if (field.type === 'checkbox') {
        values[key] = false;
      } else {
        values[key] = '';
      }
    });

    // Override with existing data
    if (this.data) {
      Object.entries(this.data).forEach(([key, value]) => {
        if (key in this.schema) {
          values[key] = value;
        }
      });
    }

    this._values = values;
    this._errors = {};
  }

  /**
   * Handle input change
   * @param {Event} e
   * @param {string} fieldName
   * @private
   */
  _handleInput(e, fieldName) {
    const field = this.schema[fieldName];
    let value;

    if (field.type === 'checkbox') {
      value = e.target.checked;
    } else if (field.type === 'number' || field.type === 'range') {
      value = e.target.value === '' ? '' : Number(e.target.value);
    } else {
      value = e.target.value;
    }

    this._values = { ...this._values, [fieldName]: value };
    this._validateField(fieldName, value);
  }

  /**
   * Validate a single field
   * @param {string} fieldName
   * @param {*} value
   * @private
   */
  _validateField(fieldName, value) {
    const field = this.schema[fieldName];
    const errors = { ...this._errors };
    delete errors[fieldName];

    if (field.required && (value === '' || value === null || value === undefined)) {
      errors[fieldName] = 'This field is required';
    } else if (field.type === 'email' && value && !this._isValidEmail(value)) {
      errors[fieldName] = 'Please enter a valid email';
    } else if (field.minLength && value.length < field.minLength) {
      errors[fieldName] = `Minimum ${field.minLength} characters required`;
    } else if (field.maxLength && value.length > field.maxLength) {
      errors[fieldName] = `Maximum ${field.maxLength} characters allowed`;
    } else if (field.min !== undefined && value < field.min) {
      errors[fieldName] = `Minimum value is ${field.min}`;
    } else if (field.max !== undefined && value > field.max) {
      errors[fieldName] = `Maximum value is ${field.max}`;
    } else if (field.pattern && value && !new RegExp(field.pattern).test(value)) {
      errors[fieldName] = 'Invalid format';
    }

    this._errors = errors;
  }

  /**
   * Validate email format
   * @param {string} email
   * @returns {boolean}
   * @private
   */
  _isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Validate entire form
   * @returns {boolean}
   * @private
   */
  _validateForm() {
    Object.entries(this.schema).forEach(([fieldName, _field]) => {
      this._validateField(fieldName, this._values[fieldName]);
    });

    return Object.keys(this._errors).length === 0;
  }

  /**
   * Handle form submission
   * @param {Event} e
   * @private
   */
  async _handleSubmit(e) {
    e.preventDefault();

    if (!this._validateForm()) {
      return;
    }

    this._loading = true;
    this._globalError = '';
    this._showSuccessMessage = false;

    try {
      // Prepare data (remove empty strings for optional fields)
      const submitData = {};
      Object.entries(this._values).forEach(([key, value]) => {
        const field = this.schema[key];
        if (value !== '' || field.required) {
          submitData[key] = value;
        }
      });

      // Add timestamp
      submitData._updatedAt = Date.now();

      if (this._database && this.path) {
        const { ref, push, set, update } = await import('firebase/database');

        if (this.dataKey) {
          // Update existing
          const dataRef = ref(this._database, `${this.path}/${this.dataKey}`);
          await update(dataRef, submitData);
        } else {
          // Create new
          submitData._createdAt = Date.now();
          const listRef = ref(this._database, this.path);
          const newRef = push(listRef);
          await set(newRef, submitData);
          this.dataKey = newRef.key;
        }
      }

      this._dispatchSubmit(submitData);

      if (this.showSuccess) {
        this._showSuccessMessage = true;
        setTimeout(() => {
          this._showSuccessMessage = false;
        }, 3000);
      }

      if (this.resetOnSubmit) {
        this._handleReset();
      }
    } catch (error) {
      this._globalError = error.message;
      this._dispatchError(error.message);
    } finally {
      this._loading = false;
    }
  }

  /**
   * Handle form reset
   * @private
   */
  _handleReset() {
    this._initializeValues();
    this._showSuccessMessage = false;
    this._globalError = '';

    this.dispatchEvent(
      new CustomEvent('form-reset', {
        detail: {},
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Dispatch form-submit event
   * @param {Object} data
   * @private
   */
  _dispatchSubmit(data) {
    this.dispatchEvent(
      new CustomEvent('form-submit', {
        detail: { data, key: this.dataKey, path: this.path },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Dispatch form-error event
   * @param {string} message
   * @private
   */
  _dispatchError(message) {
    this.dispatchEvent(
      new CustomEvent('form-error', {
        detail: { message },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Render a form field based on its schema
   * @param {string} fieldName
   * @param {FieldSchema} field
   * @returns {import('lit').TemplateResult}
   * @private
   */
  _renderField(fieldName, field) {
    const value = this._values[fieldName] ?? '';
    const error = this._errors[fieldName];
    const inputClass = error ? 'form-input form-input--error' : 'form-input';
    const labelClass = field.required ? 'form-label form-label--required' : 'form-label';

    const commonAttrs = {
      id: fieldName,
      name: fieldName,
      disabled: this.disabled || field.disabled,
      readonly: field.readonly,
    };

    let input;

    switch (field.type) {
      case 'textarea':
        input = html`
          <textarea
            class="${inputClass}"
            .value=${value}
            placeholder=${field.placeholder || ''}
            minlength=${field.minLength || nothing}
            maxlength=${field.maxLength || nothing}
            ?required=${field.required}
            ?disabled=${commonAttrs.disabled}
            ?readonly=${commonAttrs.readonly}
            @input=${(e) => this._handleInput(e, fieldName)}
          ></textarea>
        `;
        break;

      case 'select':
        input = html`
          <select
            class="${inputClass}"
            .value=${value}
            ?required=${field.required}
            ?disabled=${commonAttrs.disabled}
            @change=${(e) => this._handleInput(e, fieldName)}
          >
            <option value="">${field.placeholder || 'Select...'}</option>
            ${(field.options || []).map(
              (opt) => html`
                <option value=${opt.value} ?selected=${value === opt.value}>
                  ${opt.label}
                </option>
              `
            )}
          </select>
        `;
        break;

      case 'checkbox':
        return html`
          <div class="form-group form-group--horizontal">
            <input
              type="checkbox"
              class="form-input"
              id=${fieldName}
              name=${fieldName}
              .checked=${Boolean(value)}
              ?required=${field.required}
              ?disabled=${commonAttrs.disabled}
              @change=${(e) => this._handleInput(e, fieldName)}
            />
            <label for=${fieldName} class="form-label">${field.label || fieldName}</label>
          </div>
          ${field.help ? html`<div class="field-help">${field.help}</div>` : ''}
          ${error ? html`<div class="field-error">${error}</div>` : ''}
        `;

      case 'radio':
        input = html`
          <div class="radio-group">
            ${(field.options || []).map(
              (opt) => html`
                <div class="form-group form-group--horizontal">
                  <input
                    type="radio"
                    class="form-input"
                    id="${fieldName}-${opt.value}"
                    name=${fieldName}
                    value=${opt.value}
                    .checked=${value === opt.value}
                    ?required=${field.required}
                    ?disabled=${commonAttrs.disabled}
                    @change=${(e) => this._handleInput(e, fieldName)}
                  />
                  <label for="${fieldName}-${opt.value}" class="form-label">
                    ${opt.label}
                  </label>
                </div>
              `
            )}
          </div>
        `;
        break;

      default:
        input = html`
          <input
            type=${field.type || 'text'}
            class="${inputClass}"
            .value=${value}
            placeholder=${field.placeholder || ''}
            min=${field.min ?? nothing}
            max=${field.max ?? nothing}
            step=${field.step || nothing}
            minlength=${field.minLength || nothing}
            maxlength=${field.maxLength || nothing}
            pattern=${field.pattern || nothing}
            ?required=${field.required}
            ?disabled=${commonAttrs.disabled}
            ?readonly=${commonAttrs.readonly}
            @input=${(e) => this._handleInput(e, fieldName)}
          />
        `;
    }

    return html`
      <div class="form-group">
        ${field.type !== 'checkbox'
          ? html`<label for=${fieldName} class="${labelClass}">
              ${field.label || fieldName}
            </label>`
          : ''}
        ${input}
        ${field.help ? html`<div class="field-help">${field.help}</div>` : ''}
        ${error ? html`<div class="field-error">${error}</div>` : ''}
      </div>
    `;
  }

  /**
   * Group fields by fieldset
   * @returns {Map<string, Array<[string, FieldSchema]>>}
   * @private
   */
  _groupFields() {
    const groups = new Map();
    groups.set('', []); // Default group (no fieldset)

    Object.entries(this.schema).forEach(([fieldName, field]) => {
      const group = field.group || '';
      if (!groups.has(group)) {
        groups.set(group, []);
      }
      groups.get(group).push([fieldName, field]);
    });

    return groups;
  }

  render() {
    const groups = this._groupFields();

    return html`
      ${this._showSuccessMessage
        ? html`<div class="form-message form-message--success">
            ${this.successMessage}
          </div>`
        : ''}
      ${this._globalError
        ? html`<div class="form-message form-message--error">
            ${this._globalError}
          </div>`
        : ''}

      <form class="autoform" @submit=${this._handleSubmit}>
        ${Array.from(groups.entries()).map(([groupName, fields]) => {
          if (groupName && fields.length > 0) {
            return html`
              <fieldset class="form-fieldset">
                <legend>${groupName}</legend>
                ${fields.map(([name, field]) => this._renderField(name, field))}
              </fieldset>
            `;
          }
          return fields.map(([name, field]) => this._renderField(name, field));
        })}

        <div class="form-actions">
          <button
            type="submit"
            class="form-button form-button--primary"
            ?disabled=${this.disabled || this._loading}
          >
            ${this._loading
              ? html`<span class="loading-spinner"></span>`
              : ''}
            ${this.submitLabel}
          </button>
          ${this.resetLabel
            ? html`
                <button
                  type="button"
                  class="form-button form-button--secondary"
                  ?disabled=${this.disabled || this._loading}
                  @click=${this._handleReset}
                >
                  ${this.resetLabel}
                </button>
              `
            : ''}
        </div>
      </form>
    `;
  }
}

customElements.define('firebase-autoform', FirebaseAutoform);
