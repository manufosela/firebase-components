import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/firebase-wrapper.js';

// Mock Firebase modules
const mockApp = { name: '[DEFAULT]', options: {} };
const mockAuth = { currentUser: null };
const mockDatabase = { app: mockApp };
const mockFirestore = { type: 'firestore' };
const mockStorage = { app: mockApp };

// Mock Firebase imports
const mockFirebaseApp = {
  initializeApp: () => mockApp,
  getApps: () => [],
  getApp: () => mockApp,
};

const mockFirebaseAuth = {
  getAuth: () => mockAuth,
  connectAuthEmulator: () => {},
};

const mockFirebaseDatabase = {
  getDatabase: () => mockDatabase,
  connectDatabaseEmulator: () => {},
};

const mockFirebaseFirestore = {
  getFirestore: () => mockFirestore,
  connectFirestoreEmulator: () => {},
};

const mockFirebaseStorage = {
  getStorage: () => mockStorage,
  connectStorageEmulator: () => {},
};

// Setup module mocks before tests
const originalImport = globalThis.import;

describe('FirebaseWrapper', () => {
  const testConfig = {
    apiKey: 'test-api-key',
    authDomain: 'test.firebaseapp.com',
    projectId: 'test-project',
    storageBucket: 'test.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abc123',
    databaseURL: 'https://test-project.firebaseio.com',
  };

  describe('initialization', () => {
    it('should be defined', async () => {
      const el = await fixture(html`<firebase-wrapper></firebase-wrapper>`);
      expect(el).to.exist;
      expect(el.tagName.toLowerCase()).to.equal('firebase-wrapper');
    });

    it('should have default property values', async () => {
      const el = await fixture(html`<firebase-wrapper></firebase-wrapper>`);
      expect(el.config).to.be.null;
      expect(el.emulators).to.be.false;
      expect(el.emulatorConfig).to.be.null;
      expect(el.showStatus).to.be.false;
    });

    it('should accept config property', async () => {
      const el = await fixture(
        html`<firebase-wrapper .config=${testConfig}></firebase-wrapper>`
      );
      expect(el.config).to.deep.equal(testConfig);
    });

    it('should accept emulators attribute', async () => {
      const el = await fixture(
        html`<firebase-wrapper emulators></firebase-wrapper>`
      );
      expect(el.emulators).to.be.true;
    });

    it('should accept show-status attribute', async () => {
      const el = await fixture(
        html`<firebase-wrapper show-status></firebase-wrapper>`
      );
      expect(el.showStatus).to.be.true;
    });
  });

  describe('status display', () => {
    it('should not show status by default', async () => {
      const el = await fixture(html`<firebase-wrapper></firebase-wrapper>`);
      const statusIndicator = el.shadowRoot.querySelector('.status-indicator');
      expect(statusIndicator).to.be.null;
    });

    it('should show status when show-status is set', async () => {
      const el = await fixture(
        html`<firebase-wrapper show-status></firebase-wrapper>`
      );
      const statusIndicator = el.shadowRoot.querySelector('.status-indicator');
      expect(statusIndicator).to.exist;
    });

    it('should show pending status initially', async () => {
      const el = await fixture(
        html`<firebase-wrapper show-status></firebase-wrapper>`
      );
      const statusIndicator = el.shadowRoot.querySelector('.status-indicator');
      expect(statusIndicator.classList.contains('status-indicator--pending')).to
        .be.true;
    });

    it('should show emulator badge when emulators enabled', async () => {
      const el = await fixture(
        html`<firebase-wrapper show-status emulators></firebase-wrapper>`
      );
      const badge = el.shadowRoot.querySelector('.emulator-badge');
      expect(badge).to.exist;
      expect(badge.textContent).to.equal('Emulators');
    });
  });

  describe('slot', () => {
    it('should render slotted content', async () => {
      const el = await fixture(html`
        <firebase-wrapper>
          <div class="child">Child content</div>
        </firebase-wrapper>
      `);
      const slot = el.shadowRoot.querySelector('slot');
      expect(slot).to.exist;

      const slottedElements = slot.assignedElements();
      expect(slottedElements.length).to.equal(1);
      expect(slottedElements[0].classList.contains('child')).to.be.true;
    });
  });

  describe('getters', () => {
    it('should return null for app when not initialized', async () => {
      const el = await fixture(html`<firebase-wrapper></firebase-wrapper>`);
      expect(el.app).to.be.null;
    });

    it('should return null for auth when not initialized', async () => {
      const el = await fixture(html`<firebase-wrapper></firebase-wrapper>`);
      expect(el.auth).to.be.null;
    });

    it('should return null for database when not initialized', async () => {
      const el = await fixture(html`<firebase-wrapper></firebase-wrapper>`);
      expect(el.database).to.be.null;
    });

    it('should return null for firestore when not initialized', async () => {
      const el = await fixture(html`<firebase-wrapper></firebase-wrapper>`);
      expect(el.firestore).to.be.null;
    });

    it('should return null for storage when not initialized', async () => {
      const el = await fixture(html`<firebase-wrapper></firebase-wrapper>`);
      expect(el.storage).to.be.null;
    });

    it('should return false for isReady when not initialized', async () => {
      const el = await fixture(html`<firebase-wrapper></firebase-wrapper>`);
      expect(el.isReady).to.be.false;
    });
  });

  describe('events', () => {
    it('should dispatch firebase-error when config is missing', async () => {
      const el = await fixture(html`<firebase-wrapper></firebase-wrapper>`);

      // Manually trigger initialization without config
      setTimeout(() => el._initializeFirebase());
      const event = await oneEvent(el, 'firebase-error');

      expect(event).to.exist;
      expect(event.detail.message).to.equal(
        'Firebase configuration is required'
      );
    });

    it('should have bubbles and composed set to true on events', async () => {
      const el = await fixture(html`<firebase-wrapper></firebase-wrapper>`);

      setTimeout(() => el._initializeFirebase());
      const event = await oneEvent(el, 'firebase-error');

      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });
  });

  describe('error handling', () => {
    it('should show error message when show-status is enabled', async () => {
      const el = await fixture(
        html`<firebase-wrapper show-status></firebase-wrapper>`
      );

      el._setError('Test error message');
      await el.updateComplete;

      const errorMessage = el.shadowRoot.querySelector('.error-message');
      expect(errorMessage).to.exist;
      expect(errorMessage.textContent).to.equal('Test error message');
    });

    it('should update status to error state', async () => {
      const el = await fixture(
        html`<firebase-wrapper show-status></firebase-wrapper>`
      );

      el._setError('Test error');
      await el.updateComplete;

      const statusIndicator = el.shadowRoot.querySelector('.status-indicator');
      expect(statusIndicator.classList.contains('status-indicator--error')).to
        .be.true;
    });
  });

  describe('accessibility', () => {
    it('should have proper role structure', async () => {
      const el = await fixture(html`<firebase-wrapper></firebase-wrapper>`);
      expect(el.shadowRoot).to.exist;
    });

    it('should be hidden when hidden attribute is set', async () => {
      const el = await fixture(
        html`<firebase-wrapper hidden></firebase-wrapper>`
      );
      const styles = getComputedStyle(el);
      expect(styles.display).to.equal('none');
    });
  });
});
