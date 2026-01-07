import { html, fixture, expect } from '@open-wc/testing';
import '../src/index.js';

describe('FirebaseAutolist', () => {
  it('renders with default properties', async () => {
    const el = await fixture(html`<firebase-autolist></firebase-autolist>`);

    expect(el.path).to.equal('');
    expect(el.autoSync).to.be.false;
    expect(el.orderDirection).to.equal('asc');
    expect(el.limitTo).to.equal(0);
    expect(el.showLoading).to.be.true;
    expect(el.layout).to.equal('list');
  });

  it('shows empty state by default', async () => {
    const el = await fixture(html`<firebase-autolist></firebase-autolist>`);

    await el.updateComplete;
    const empty = el.shadowRoot.querySelector('.empty');
    expect(empty).to.exist;
    expect(empty.textContent).to.equal('No items found');
  });

  it('shows custom empty message', async () => {
    const el = await fixture(html`
      <firebase-autolist empty-message="Nothing here"></firebase-autolist>
    `);

    await el.updateComplete;
    const empty = el.shadowRoot.querySelector('.empty');
    expect(empty.textContent).to.equal('Nothing here');
  });

  it('exposes items getter', async () => {
    const el = await fixture(html`<firebase-autolist></firebase-autolist>`);

    expect(el.items).to.be.an('array');
    expect(el.items).to.have.lengthOf(0);
  });

  it('exposes count getter', async () => {
    const el = await fixture(html`<firebase-autolist></firebase-autolist>`);

    expect(el.count).to.equal(0);
  });

  it('exposes loading getter', async () => {
    const el = await fixture(html`<firebase-autolist></firebase-autolist>`);

    expect(el.loading).to.be.false;
  });

  it('has refresh method', async () => {
    const el = await fixture(html`<firebase-autolist></firebase-autolist>`);

    expect(el.refresh).to.be.a('function');
  });

  it('has setItemRenderer method', async () => {
    const el = await fixture(html`<firebase-autolist></firebase-autolist>`);

    expect(el.setItemRenderer).to.be.a('function');
  });

  it('renders header when showHeader is true', async () => {
    const el = await fixture(html`
      <firebase-autolist show-header></firebase-autolist>
    `);

    // Need items to see header
    el._items = [{ _key: '1', name: 'Test' }];
    await el.updateComplete;

    const header = el.shadowRoot.querySelector('.list-header');
    expect(header).to.exist;
  });

  it('reflects layout attribute', async () => {
    const el = await fixture(html`
      <firebase-autolist layout="grid"></firebase-autolist>
    `);

    expect(el.getAttribute('layout')).to.equal('grid');
  });
});
