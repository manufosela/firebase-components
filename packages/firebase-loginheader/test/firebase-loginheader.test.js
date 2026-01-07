import { html, fixture, expect } from '@open-wc/testing';
import '../src/index.js';

describe('FirebaseLoginheader', () => {
  it('renders with default properties', async () => {
    const el = await fixture(html`<firebase-loginheader></firebase-loginheader>`);

    expect(el.showName).to.be.true;
    expect(el.showEmail).to.be.false;
    expect(el.showMenu).to.be.true;
    expect(el.loginText).to.equal('Sign In');
    expect(el.logoutText).to.equal('Sign Out');
  });

  it('shows login button when not authenticated', async () => {
    const el = await fixture(html`<firebase-loginheader></firebase-loginheader>`);

    // Wait for loading to complete
    el._loading = false;
    await el.updateComplete;

    const btn = el.shadowRoot.querySelector('.login-btn');
    expect(btn).to.exist;
    expect(btn.textContent.trim()).to.equal('Sign In');
  });

  it('uses custom login text', async () => {
    const el = await fixture(html`
      <firebase-loginheader login-text="Get Started"></firebase-loginheader>
    `);

    el._loading = false;
    await el.updateComplete;

    const btn = el.shadowRoot.querySelector('.login-btn');
    expect(btn.textContent.trim()).to.equal('Get Started');
  });

  it('exposes user getter', async () => {
    const el = await fixture(html`<firebase-loginheader></firebase-loginheader>`);

    expect(el.user).to.be.null;
  });

  it('exposes isAuthenticated getter', async () => {
    const el = await fixture(html`<firebase-loginheader></firebase-loginheader>`);

    expect(el.isAuthenticated).to.be.false;
  });

  it('has signOut method', async () => {
    const el = await fixture(html`<firebase-loginheader></firebase-loginheader>`);

    expect(el.signOut).to.be.a('function');
  });

  it('has openMenu and closeMenu methods', async () => {
    const el = await fixture(html`<firebase-loginheader></firebase-loginheader>`);

    expect(el.openMenu).to.be.a('function');
    expect(el.closeMenu).to.be.a('function');
  });

  it('fires login-click event', async () => {
    const el = await fixture(html`<firebase-loginheader></firebase-loginheader>`);
    el._loading = false;
    await el.updateComplete;

    let clicked = false;
    el.addEventListener('login-click', () => { clicked = true; });

    const btn = el.shadowRoot.querySelector('.login-btn');
    btn.click();

    expect(clicked).to.be.true;
  });

  it('shows loading state initially', async () => {
    const el = await fixture(html`<firebase-loginheader></firebase-loginheader>`);

    const loading = el.shadowRoot.querySelector('.loading');
    expect(loading).to.exist;
  });

  it('accepts menu items', async () => {
    const el = await fixture(html`<firebase-loginheader></firebase-loginheader>`);

    el.menuItems = [
      { label: 'Profile', action: 'profile' },
      { label: 'Settings', action: 'settings' }
    ];

    expect(el.menuItems).to.have.lengthOf(2);
  });

  it('generates initials correctly', async () => {
    const el = await fixture(html`<firebase-loginheader></firebase-loginheader>`);

    // Without user
    expect(el._getInitials()).to.equal('?');

    // With display name
    el._user = { displayName: 'John Doe', email: 'john@test.com' };
    expect(el._getInitials()).to.equal('JD');

    // With email only
    el._user = { email: 'alice@test.com' };
    expect(el._getInitials()).to.equal('A');
  });
});
