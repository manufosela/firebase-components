import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/firebase-crud.js';

// Mock Firebase database module
const mockData = {
  user1: { name: 'John', email: 'john@example.com' },
  user2: { name: 'Jane', email: 'jane@example.com' },
};

describe('FirebaseCrud', () => {
  describe('initialization', () => {
    it('should be defined', async () => {
      const el = await fixture(html`<firebase-crud></firebase-crud>`);
      expect(el).to.exist;
      expect(el.tagName.toLowerCase()).to.equal('firebase-crud');
    });

    it('should have default property values', async () => {
      const el = await fixture(html`<firebase-crud></firebase-crud>`);
      expect(el.path).to.equal('');
      expect(el.autoSync).to.be.false;
      expect(el.orderBy).to.equal('');
      expect(el.orderDirection).to.equal('asc');
      expect(el.limitTo).to.equal(0);
      expect(el.showLoading).to.be.false;
      expect(el.emptyMessage).to.equal('No data available');
    });

    it('should accept path attribute', async () => {
      const el = await fixture(
        html`<firebase-crud path="/users"></firebase-crud>`
      );
      expect(el.path).to.equal('/users');
    });

    it('should accept auto-sync attribute', async () => {
      const el = await fixture(
        html`<firebase-crud auto-sync></firebase-crud>`
      );
      expect(el.autoSync).to.be.true;
    });

    it('should accept order-by attribute', async () => {
      const el = await fixture(
        html`<firebase-crud order-by="createdAt"></firebase-crud>`
      );
      expect(el.orderBy).to.equal('createdAt');
    });

    it('should accept order-direction attribute', async () => {
      const el = await fixture(
        html`<firebase-crud order-direction="desc"></firebase-crud>`
      );
      expect(el.orderDirection).to.equal('desc');
    });

    it('should accept limit-to attribute', async () => {
      const el = await fixture(
        html`<firebase-crud limit-to="10"></firebase-crud>`
      );
      expect(el.limitTo).to.equal(10);
    });

    it('should accept show-loading attribute', async () => {
      const el = await fixture(
        html`<firebase-crud show-loading></firebase-crud>`
      );
      expect(el.showLoading).to.be.true;
    });

    it('should accept empty-message attribute', async () => {
      const el = await fixture(
        html`<firebase-crud empty-message="No items found"></firebase-crud>`
      );
      expect(el.emptyMessage).to.equal('No items found');
    });
  });

  describe('getters', () => {
    it('should return null for data when not loaded', async () => {
      const el = await fixture(html`<firebase-crud></firebase-crud>`);
      expect(el.data).to.be.null;
    });

    it('should return false for loading initially', async () => {
      const el = await fixture(html`<firebase-crud></firebase-crud>`);
      expect(el.loading).to.be.false;
    });

    it('should return false for isSyncing initially', async () => {
      const el = await fixture(html`<firebase-crud></firebase-crud>`);
      expect(el.isSyncing).to.be.false;
    });
  });

  describe('rendering', () => {
    it('should render empty state by default', async () => {
      const el = await fixture(html`<firebase-crud></firebase-crud>`);
      const emptyState = el.shadowRoot.querySelector('.empty-state');
      expect(emptyState).to.exist;
      expect(emptyState.textContent).to.equal('No data available');
    });

    it('should render custom empty message', async () => {
      const el = await fixture(
        html`<firebase-crud empty-message="Nothing here"></firebase-crud>`
      );
      const emptyState = el.shadowRoot.querySelector('.empty-state');
      expect(emptyState.textContent).to.equal('Nothing here');
    });

    it('should not show sync indicator when autoSync is false', async () => {
      const el = await fixture(html`<firebase-crud></firebase-crud>`);
      const syncIndicator = el.shadowRoot.querySelector('.sync-indicator');
      expect(syncIndicator).to.be.null;
    });

    it('should show sync indicator when autoSync is true', async () => {
      const el = await fixture(
        html`<firebase-crud auto-sync></firebase-crud>`
      );
      const syncIndicator = el.shadowRoot.querySelector('.sync-indicator');
      expect(syncIndicator).to.exist;
    });
  });

  describe('slots', () => {
    it('should have a default slot', async () => {
      const el = await fixture(html`
        <firebase-crud>
          <div class="custom-content">Custom content</div>
        </firebase-crud>
      `);
      const slot = el.shadowRoot.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });

    it('should have a loading slot', async () => {
      const el = await fixture(html`<firebase-crud></firebase-crud>`);
      // Loading slot is rendered when loading is true
      el._loading = true;
      el.showLoading = true;
      await el.updateComplete;

      const loadingSlot = el.shadowRoot.querySelector('slot[name="loading"]');
      expect(loadingSlot).to.exist;
    });

    it('should have an error slot', async () => {
      const el = await fixture(html`<firebase-crud></firebase-crud>`);
      el._error = 'Test error';
      await el.updateComplete;

      const errorSlot = el.shadowRoot.querySelector('slot[name="error"]');
      expect(errorSlot).to.exist;
    });

    it('should have an empty slot', async () => {
      const el = await fixture(html`<firebase-crud></firebase-crud>`);
      const emptySlot = el.shadowRoot.querySelector('slot[name="empty"]');
      expect(emptySlot).to.exist;
    });
  });

  describe('loading state', () => {
    it('should show loading indicator when showLoading is true and loading', async () => {
      const el = await fixture(
        html`<firebase-crud show-loading></firebase-crud>`
      );
      el._loading = true;
      await el.updateComplete;

      const loading = el.shadowRoot.querySelector('.loading');
      expect(loading).to.exist;
    });

    it('should show loading spinner', async () => {
      const el = await fixture(
        html`<firebase-crud show-loading></firebase-crud>`
      );
      el._loading = true;
      await el.updateComplete;

      const spinner = el.shadowRoot.querySelector('.loading-spinner');
      expect(spinner).to.exist;
    });
  });

  describe('error state', () => {
    it('should show error when _error is set', async () => {
      const el = await fixture(html`<firebase-crud></firebase-crud>`);
      el._error = 'Database connection failed';
      await el.updateComplete;

      const error = el.shadowRoot.querySelector('.error');
      expect(error).to.exist;
      expect(error.textContent).to.include('Database connection failed');
    });

    it('should show error title', async () => {
      const el = await fixture(html`<firebase-crud></firebase-crud>`);
      el._error = 'Test error';
      await el.updateComplete;

      const errorTitle = el.shadowRoot.querySelector('.error-title');
      expect(errorTitle).to.exist;
      expect(errorTitle.textContent).to.equal('Error');
    });
  });

  describe('internal methods', () => {
    it('should dispatch data-loaded event', async () => {
      const el = await fixture(html`<firebase-crud path="/test"></firebase-crud>`);

      setTimeout(() => {
        el._data = mockData;
        el._dispatchDataLoaded();
      });

      const event = await oneEvent(el, 'data-loaded');
      expect(event).to.exist;
      expect(event.detail.data).to.deep.equal(mockData);
      expect(event.detail.path).to.equal('/test');
    });

    it('should dispatch data-error event', async () => {
      const el = await fixture(html`<firebase-crud path="/test"></firebase-crud>`);

      setTimeout(() => el._dispatchError('Test error message'));
      const event = await oneEvent(el, 'data-error');

      expect(event).to.exist;
      expect(event.detail.message).to.equal('Test error message');
      expect(event.detail.path).to.equal('/test');
    });

    it('should dispatch data-updated event', async () => {
      const el = await fixture(html`<firebase-crud path="/test"></firebase-crud>`);

      setTimeout(() =>
        el._dispatchDataUpdated('create', 'newKey', { name: 'Test' })
      );
      const event = await oneEvent(el, 'data-updated');

      expect(event).to.exist;
      expect(event.detail.operation).to.equal('create');
      expect(event.detail.key).to.equal('newKey');
      expect(event.detail.data).to.deep.equal({ name: 'Test' });
    });

    it('should have bubbles and composed on events', async () => {
      const el = await fixture(html`<firebase-crud path="/test"></firebase-crud>`);

      setTimeout(() => el._dispatchDataLoaded());
      const event = await oneEvent(el, 'data-loaded');

      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });
  });

  describe('CRUD method signatures', () => {
    it('should have create method', async () => {
      const el = await fixture(html`<firebase-crud></firebase-crud>`);
      expect(el.create).to.be.a('function');
    });

    it('should have read method', async () => {
      const el = await fixture(html`<firebase-crud></firebase-crud>`);
      expect(el.read).to.be.a('function');
    });

    it('should have update method', async () => {
      const el = await fixture(html`<firebase-crud></firebase-crud>`);
      expect(el.update).to.be.a('function');
    });

    it('should have delete method', async () => {
      const el = await fixture(html`<firebase-crud></firebase-crud>`);
      expect(el.delete).to.be.a('function');
    });

    it('should have refresh method', async () => {
      const el = await fixture(html`<firebase-crud></firebase-crud>`);
      expect(el.refresh).to.be.a('function');
    });

    it('should throw error when create is called without database', async () => {
      const el = await fixture(html`<firebase-crud></firebase-crud>`);
      try {
        await el.create({ name: 'Test' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal(
          'Database not initialized or path not set'
        );
      }
    });

    it('should throw error when read is called without database', async () => {
      const el = await fixture(html`<firebase-crud></firebase-crud>`);
      try {
        await el.read('key1');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal(
          'Database not initialized or path not set'
        );
      }
    });

    it('should throw error when update is called without database', async () => {
      const el = await fixture(html`<firebase-crud></firebase-crud>`);
      try {
        await el.update('key1', { name: 'Updated' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal(
          'Database not initialized or path not set'
        );
      }
    });

    it('should throw error when delete is called without database', async () => {
      const el = await fixture(html`<firebase-crud></firebase-crud>`);
      try {
        await el.delete('key1');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal(
          'Database not initialized or path not set'
        );
      }
    });
  });

  describe('accessibility', () => {
    it('should have proper shadow DOM', async () => {
      const el = await fixture(html`<firebase-crud></firebase-crud>`);
      expect(el.shadowRoot).to.exist;
    });

    it('should be hidden when hidden attribute is set', async () => {
      const el = await fixture(html`<firebase-crud hidden></firebase-crud>`);
      const styles = getComputedStyle(el);
      expect(styles.display).to.equal('none');
    });
  });
});
