import { LitElement, html, nothing } from 'lit';
import { styles } from './firebase-uploadfile.styles.js';

/**
 * Firebase Upload File Web Component
 * Provides file upload functionality for Firebase Storage
 *
 * @element firebase-uploadfile
 *
 * @fires upload-progress - Fired during upload with progress info
 * @fires upload-complete - Fired when upload completes successfully
 * @fires upload-error - Fired when an error occurs
 *
 * @cssprop --firebase-uploadfile-font-family - Font family
 * @cssprop --firebase-uploadfile-border-color - Border color
 * @cssprop --firebase-uploadfile-active-color - Active/hover border color
 * @cssprop --firebase-uploadfile-progress-color - Progress bar color
 *
 * @slot icon - Custom upload icon
 * @slot button - Custom upload button
 *
 * @example
 * ```html
 * <firebase-uploadfile
 *   path="/uploads/images"
 *   accept="image/*"
 *   max-size="5242880"
 *   @upload-complete=${handleComplete}>
 * </firebase-uploadfile>
 * ```
 */
export class FirebaseUploadfile extends LitElement {
  static styles = styles;

  static properties = {
    /** Storage path for uploads */
    path: { type: String },

    /** Accepted file types */
    accept: { type: String },

    /** Maximum file size in bytes */
    maxSize: { type: Number, attribute: 'max-size' },

    /** Allow multiple files */
    multiple: { type: Boolean },

    /** Button text */
    buttonText: { type: String, attribute: 'button-text' },

    /** Auto-upload on selection */
    autoUpload: { type: Boolean, attribute: 'auto-upload' },

    /** Show progress bar */
    showProgress: { type: Boolean, attribute: 'show-progress' },

    /** Disable component */
    disabled: { type: Boolean, reflect: true },

    // Internal state
    _files: { type: Array, state: true },
    _progress: { type: Number, state: true },
    _uploading: { type: Boolean, state: true },
    _error: { type: String, state: true },
    _success: { type: String, state: true },
    _dragover: { type: Boolean, state: true },
  };

  /** @type {import('firebase/storage').FirebaseStorage | null} */
  _storage = null;

  /** @type {import('firebase/storage').UploadTask | null} */
  _uploadTask = null;

  constructor() {
    super();
    this.path = '/uploads';
    this.accept = '*/*';
    this.maxSize = 10 * 1024 * 1024; // 10MB default
    this.multiple = false;
    this.buttonText = 'Select File';
    this.autoUpload = false;
    this.showProgress = true;
    this.disabled = false;
    this._files = [];
    this._progress = 0;
    this._uploading = false;
    this._error = '';
    this._success = '';
    this._dragover = false;
  }

  get progress() {
    return this._progress;
  }

  get uploading() {
    return this._uploading;
  }

  connectedCallback() {
    super.connectedCallback();
    this._findStorage();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._uploadTask) {
      this._uploadTask.cancel();
    }
  }

  /**
   * Find and set up storage reference
   * @private
   */
  _findStorage() {
    const wrapper = this.closest('firebase-wrapper');
    if (wrapper && wrapper.storage) {
      this._storage = wrapper.storage;
    } else {
      this._initFromGlobal();
    }

    document.addEventListener('firebase-ready', (e) => {
      if (e.detail.storage) {
        this._storage = e.detail.storage;
      }
    });
  }

  /**
   * Initialize from global Firebase instance
   * @private
   */
  async _initFromGlobal() {
    try {
      const { getStorage } = await import('firebase/storage');
      this._storage = getStorage();
    } catch (error) {
      // Wait for firebase-ready event
    }
  }

  /**
   * Handle file input change
   * @param {Event} e
   * @private
   */
  _handleFileChange(e) {
    const input = e.target;
    if (input.files && input.files.length > 0) {
      this._processFiles(Array.from(input.files));
    }
  }

  /**
   * Process selected files
   * @param {File[]} files
   * @private
   */
  _processFiles(files) {
    this._error = '';
    this._success = '';

    // Validate files
    const validFiles = files.filter(file => {
      if (file.size > this.maxSize) {
        this._error = `File "${file.name}" exceeds maximum size of ${this._formatSize(this.maxSize)}`;
        return false;
      }
      return true;
    });

    this._files = this.multiple ? [...this._files, ...validFiles] : validFiles;

    if (this.autoUpload && this._files.length > 0) {
      this._uploadAll();
    }
  }

  /**
   * Handle drag over
   * @param {DragEvent} e
   * @private
   */
  _handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    this._dragover = true;
  }

  /**
   * Handle drag leave
   * @param {DragEvent} e
   * @private
   */
  _handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    this._dragover = false;
  }

  /**
   * Handle drop
   * @param {DragEvent} e
   * @private
   */
  _handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this._dragover = false;

    if (e.dataTransfer?.files) {
      this._processFiles(Array.from(e.dataTransfer.files));
    }
  }

  /**
   * Upload a single file
   * @param {File} file
   * @returns {Promise<string>} Download URL
   */
  async upload(file) {
    if (!this._storage) {
      throw new Error('Storage not initialized');
    }

    this._uploading = true;
    this._progress = 0;
    this._error = '';

    try {
      const { ref, uploadBytesResumable, getDownloadURL } = await import('firebase/storage');

      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(this._storage, `${this.path}/${fileName}`);

      this._uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type,
      });

      return new Promise((resolve, reject) => {
        this._uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this._progress = Math.round(progress);

            this.dispatchEvent(new CustomEvent('upload-progress', {
              detail: {
                progress: this._progress,
                bytesTransferred: snapshot.bytesTransferred,
                totalBytes: snapshot.totalBytes,
              },
              bubbles: true,
              composed: true,
            }));
          },
          (error) => {
            this._uploading = false;
            this._error = error.message;
            this._dispatchError(error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(this._uploadTask.snapshot.ref);
            this._uploading = false;
            this._success = 'Upload complete!';

            this.dispatchEvent(new CustomEvent('upload-complete', {
              detail: {
                downloadURL,
                fullPath: this._uploadTask.snapshot.ref.fullPath,
                name: file.name,
                size: file.size,
                contentType: file.type,
              },
              bubbles: true,
              composed: true,
            }));

            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      this._uploading = false;
      this._error = error.message;
      this._dispatchError(error);
      throw error;
    }
  }

  /**
   * Upload all selected files
   * @private
   */
  async _uploadAll() {
    for (const file of this._files) {
      await this.upload(file);
    }
    this._files = [];
  }

  /**
   * Cancel current upload
   */
  cancel() {
    if (this._uploadTask) {
      this._uploadTask.cancel();
      this._uploadTask = null;
      this._uploading = false;
      this._progress = 0;
    }
  }

  /**
   * Clear selected files
   */
  clear() {
    this._files = [];
    this._error = '';
    this._success = '';
  }

  /**
   * Remove a file from selection
   * @param {number} index
   * @private
   */
  _removeFile(index) {
    this._files = this._files.filter((_, i) => i !== index);
  }

  /**
   * Dispatch error event
   * @param {Error} error
   * @private
   */
  _dispatchError(error) {
    this.dispatchEvent(new CustomEvent('upload-error', {
      detail: { message: error.message, code: error.code || 'unknown' },
      bubbles: true,
      composed: true,
    }));
  }

  /**
   * Format file size
   * @param {number} bytes
   * @returns {string}
   * @private
   */
  _formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /**
   * Open file picker
   * @private
   */
  _openFilePicker() {
    if (!this.disabled && !this._uploading) {
      this.shadowRoot.querySelector('input[type="file"]')?.click();
    }
  }

  render() {
    const containerClass = `upload-container ${this._dragover ? 'dragover' : ''}`;

    return html`
      <div
        class="${containerClass}"
        @click=${this._openFilePicker}
        @dragover=${this._handleDragOver}
        @dragleave=${this._handleDragLeave}
        @drop=${this._handleDrop}
      >
        <input
          type="file"
          accept=${this.accept}
          ?multiple=${this.multiple}
          ?disabled=${this.disabled || this._uploading}
          @change=${this._handleFileChange}
        />

        <slot name="icon">
          <div class="upload-icon">📤</div>
        </slot>

        <div class="upload-text">
          Drag and drop files here, or click to select
        </div>

        <div class="upload-hint">
          Max size: ${this._formatSize(this.maxSize)}
          ${this.accept !== '*/*' ? ` | Accepted: ${this.accept}` : ''}
        </div>

        <slot name="button">
          <button
            class="upload-btn"
            ?disabled=${this.disabled || this._uploading}
            @click=${(e) => { e.stopPropagation(); this._openFilePicker(); }}
          >
            ${this.buttonText}
          </button>
        </slot>
      </div>

      ${this._files.length > 0 ? this._renderFileList() : nothing}
      ${this._uploading && this.showProgress ? this._renderProgress() : nothing}
      ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
      ${this._success ? html`<div class="success">${this._success}</div>` : nothing}

      ${this._files.length > 0 && !this.autoUpload ? html`
        <button
          class="upload-btn"
          style="margin-top: 1rem;"
          ?disabled=${this._uploading}
          @click=${this._uploadAll}
        >
          Upload ${this._files.length} file${this._files.length > 1 ? 's' : ''}
        </button>
      ` : nothing}
    `;
  }

  /**
   * Render file list
   * @private
   */
  _renderFileList() {
    return html`
      <div class="file-list">
        ${this._files.map((file, index) => html`
          <div class="file-item">
            <div class="file-info">
              <span class="file-name">${file.name}</span>
              <span class="file-size">(${this._formatSize(file.size)})</span>
            </div>
            <button
              class="remove-btn"
              @click=${() => this._removeFile(index)}
              ?disabled=${this._uploading}
            >
              ✕
            </button>
          </div>
        `)}
      </div>
    `;
  }

  /**
   * Render progress bar
   * @private
   */
  _renderProgress() {
    return html`
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${this._progress}%"></div>
        </div>
        <div class="progress-text">${this._progress}% uploaded</div>
      </div>
    `;
  }
}

customElements.define('firebase-uploadfile', FirebaseUploadfile);
