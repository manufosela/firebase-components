import { html, fixture, expect } from '@open-wc/testing';
import '../src/index.js';

describe('FirebaseUploadfile', () => {
  it('renders with default properties', async () => {
    const el = await fixture(html`<firebase-uploadfile></firebase-uploadfile>`);

    expect(el.path).to.equal('/uploads');
    expect(el.accept).to.equal('*/*');
    expect(el.maxSize).to.equal(10 * 1024 * 1024);
    expect(el.multiple).to.be.false;
    expect(el.autoUpload).to.be.false;
    expect(el.showProgress).to.be.true;
  });

  it('renders upload container', async () => {
    const el = await fixture(html`<firebase-uploadfile></firebase-uploadfile>`);

    const container = el.shadowRoot.querySelector('.upload-container');
    expect(container).to.exist;
  });

  it('renders file input with correct attributes', async () => {
    const el = await fixture(html`
      <firebase-uploadfile
        accept="image/*"
        multiple
      ></firebase-uploadfile>
    `);

    const input = el.shadowRoot.querySelector('input[type="file"]');
    expect(input).to.exist;
    expect(input.getAttribute('accept')).to.equal('image/*');
    expect(input.hasAttribute('multiple')).to.be.true;
  });

  it('formats file sizes correctly', async () => {
    const el = await fixture(html`<firebase-uploadfile></firebase-uploadfile>`);

    expect(el._formatSize(500)).to.equal('500 B');
    expect(el._formatSize(1536)).to.equal('1.5 KB');
    expect(el._formatSize(2621440)).to.equal('2.5 MB');
  });

  it('has cancel method', async () => {
    const el = await fixture(html`<firebase-uploadfile></firebase-uploadfile>`);

    expect(el.cancel).to.be.a('function');
    el.cancel(); // Should not throw
  });

  it('has clear method', async () => {
    const el = await fixture(html`<firebase-uploadfile></firebase-uploadfile>`);

    expect(el.clear).to.be.a('function');
    el.clear();
    expect(el._files).to.deep.equal([]);
  });

  it('respects disabled state', async () => {
    const el = await fixture(html`<firebase-uploadfile disabled></firebase-uploadfile>`);

    expect(el.disabled).to.be.true;
    const input = el.shadowRoot.querySelector('input[type="file"]');
    expect(input.disabled).to.be.true;
  });

  it('shows custom button text', async () => {
    const el = await fixture(html`
      <firebase-uploadfile button-text="Upload Image"></firebase-uploadfile>
    `);

    const btn = el.shadowRoot.querySelector('.upload-btn');
    expect(btn.textContent.trim()).to.equal('Upload Image');
  });

  it('exposes progress and uploading state', async () => {
    const el = await fixture(html`<firebase-uploadfile></firebase-uploadfile>`);

    expect(el.progress).to.equal(0);
    expect(el.uploading).to.be.false;
  });
});
