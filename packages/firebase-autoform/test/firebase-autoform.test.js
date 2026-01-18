import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/firebase-autoform.js';

describe('FirebaseAutoform', () => {
  it('sets default properties', async () => {
    const el = await fixture(html`<firebase-autoform></firebase-autoform>`);

    expect(el.path).to.equal('');
    expect(el.submitLabel).to.equal('Submit');
    expect(el.resetLabel).to.equal('');
    expect(el.resetOnSubmit).to.equal(false);
    expect(el.showSuccess).to.equal(true);
  });

  it('renders fields from schema', async () => {
    const schema = {
      name: { type: 'text', label: 'Name', required: true },
      email: { type: 'email', label: 'Email' },
      role: {
        type: 'select',
        label: 'Role',
        options: [
          { value: 'admin', label: 'Admin' },
          { value: 'user', label: 'User' }
        ]
      },
      subscribed: { type: 'checkbox', label: 'Subscribed' },
      notes: { type: 'textarea', label: 'Notes' }
    };

    const el = await fixture(html`<firebase-autoform .schema=${schema}></firebase-autoform>`);
    await el.updateComplete;

    const inputs = el.shadowRoot.querySelectorAll('input');
    const selects = el.shadowRoot.querySelectorAll('select');
    const textareas = el.shadowRoot.querySelectorAll('textarea');

    expect(inputs.length).to.be.greaterThan(0);
    expect(selects.length).to.equal(1);
    expect(textareas.length).to.equal(1);
    expect(el.shadowRoot.textContent).to.include('Name');
  });

  it('shows validation errors for required fields', async () => {
    const schema = {
      name: { type: 'text', label: 'Name', required: true }
    };

    const el = await fixture(html`<firebase-autoform .schema=${schema}></firebase-autoform>`);
    await el.updateComplete;

    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await el.updateComplete;

    const error = el.shadowRoot.querySelector('.field-error');
    const input = el.shadowRoot.querySelector('input');

    expect(error).to.exist;
    expect(input.classList.contains('form-input--error')).to.equal(true);
  });

  it('dispatches form-submit with data', async () => {
    const schema = {
      name: { type: 'text', label: 'Name', required: true },
      email: { type: 'email', label: 'Email', required: true }
    };

    const el = await fixture(html`<firebase-autoform .schema=${schema}></firebase-autoform>`);
    await el.updateComplete;

    const nameInput = el.shadowRoot.querySelector('input[name="name"]');
    const emailInput = el.shadowRoot.querySelector('input[name="email"]');

    nameInput.value = 'Ada';
    nameInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    emailInput.value = 'ada@example.com';
    emailInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    const form = el.shadowRoot.querySelector('form');
    setTimeout(() => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));

    const { detail } = await oneEvent(el, 'form-submit');
    expect(detail.data.name).to.equal('Ada');
    expect(detail.data.email).to.equal('ada@example.com');
  });

  it('renders grouped fields inside fieldset', async () => {
    const schema = {
      title: { type: 'text', label: 'Title', group: 'Meta' },
      status: { type: 'select', label: 'Status', group: 'Meta', options: [] }
    };

    const el = await fixture(html`<firebase-autoform .schema=${schema}></firebase-autoform>`);
    await el.updateComplete;

    const fieldset = el.shadowRoot.querySelector('fieldset');
    const legend = el.shadowRoot.querySelector('legend');

    expect(fieldset).to.exist;
    expect(legend.textContent).to.equal('Meta');
  });

  it('resets values when reset button is clicked', async () => {
    const schema = {
      name: { type: 'text', label: 'Name' }
    };

    const el = await fixture(html`
      <firebase-autoform .schema=${schema} reset-label="Reset"></firebase-autoform>
    `);
    await el.updateComplete;

    const input = el.shadowRoot.querySelector('input[name="name"]');
    input.value = 'Test';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    const resetButton = el.shadowRoot.querySelector('.form-button--secondary');
    resetButton.click();
    await el.updateComplete;

    expect(el.values.name).to.equal('');
  });
});
