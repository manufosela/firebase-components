import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/firebase-loginbutton.js';

describe('FirebaseLoginbutton', () => {
  describe('initialization', () => {
    it('should be defined', async () => {
      const el = await fixture(
        html`<firebase-loginbutton></firebase-loginbutton>`
      );
      expect(el).to.exist;
      expect(el.tagName.toLowerCase()).to.equal('firebase-loginbutton');
    });

    it('should have default property values', async () => {
      const el = await fixture(
        html`<firebase-loginbutton></firebase-loginbutton>`
      );
      expect(el.provider).to.equal('google');
      expect(el.label).to.equal('');
      expect(el.disabled).to.be.false;
      expect(el.showLogout).to.be.false;
      expect(el.popup).to.be.true;
      expect(el.scopes).to.equal('');
    });

    it('should accept provider attribute', async () => {
      const el = await fixture(
        html`<firebase-loginbutton provider="github"></firebase-loginbutton>`
      );
      expect(el.provider).to.equal('github');
    });

    it('should accept label attribute', async () => {
      const el = await fixture(
        html`<firebase-loginbutton label="Custom Label"></firebase-loginbutton>`
      );
      expect(el.label).to.equal('Custom Label');
    });

    it('should accept disabled attribute', async () => {
      const el = await fixture(
        html`<firebase-loginbutton disabled></firebase-loginbutton>`
      );
      expect(el.disabled).to.be.true;
    });

    it('should accept show-logout attribute', async () => {
      const el = await fixture(
        html`<firebase-loginbutton show-logout></firebase-loginbutton>`
      );
      expect(el.showLogout).to.be.true;
    });

    it('should accept popup attribute', async () => {
      const el = await fixture(
        html`<firebase-loginbutton .popup=${false}></firebase-loginbutton>`
      );
      expect(el.popup).to.be.false;
    });

    it('should accept scopes attribute', async () => {
      const el = await fixture(
        html`<firebase-loginbutton
          scopes="email,profile"
        ></firebase-loginbutton>`
      );
      expect(el.scopes).to.equal('email,profile');
    });
  });

  describe('rendering', () => {
    it('should render a button element', async () => {
      const el = await fixture(
        html`<firebase-loginbutton></firebase-loginbutton>`
      );
      const button = el.shadowRoot.querySelector('button');
      expect(button).to.exist;
    });

    it('should render with Google styling by default', async () => {
      const el = await fixture(
        html`<firebase-loginbutton></firebase-loginbutton>`
      );
      const button = el.shadowRoot.querySelector('button');
      expect(button.classList.contains('login-button--google')).to.be.true;
    });

    it('should render with GitHub styling', async () => {
      const el = await fixture(
        html`<firebase-loginbutton provider="github"></firebase-loginbutton>`
      );
      const button = el.shadowRoot.querySelector('button');
      expect(button.classList.contains('login-button--github')).to.be.true;
    });

    it('should render with Email styling', async () => {
      const el = await fixture(
        html`<firebase-loginbutton provider="email"></firebase-loginbutton>`
      );
      const button = el.shadowRoot.querySelector('button');
      expect(button.classList.contains('login-button--email')).to.be.true;
    });

    it('should render with Anonymous styling', async () => {
      const el = await fixture(
        html`<firebase-loginbutton provider="anonymous"></firebase-loginbutton>`
      );
      const button = el.shadowRoot.querySelector('button');
      expect(button.classList.contains('login-button--anonymous')).to.be.true;
    });

    it('should render default label for Google', async () => {
      const el = await fixture(
        html`<firebase-loginbutton provider="google"></firebase-loginbutton>`
      );
      const button = el.shadowRoot.querySelector('button');
      expect(button.textContent).to.include('Sign in with Google');
    });

    it('should render default label for GitHub', async () => {
      const el = await fixture(
        html`<firebase-loginbutton provider="github"></firebase-loginbutton>`
      );
      const button = el.shadowRoot.querySelector('button');
      expect(button.textContent).to.include('Sign in with GitHub');
    });

    it('should render default label for Email', async () => {
      const el = await fixture(
        html`<firebase-loginbutton provider="email"></firebase-loginbutton>`
      );
      const button = el.shadowRoot.querySelector('button');
      expect(button.textContent).to.include('Sign in with Email');
    });

    it('should render default label for Anonymous', async () => {
      const el = await fixture(
        html`<firebase-loginbutton provider="anonymous"></firebase-loginbutton>`
      );
      const button = el.shadowRoot.querySelector('button');
      expect(button.textContent).to.include('Continue as Guest');
    });

    it('should render custom label', async () => {
      const el = await fixture(
        html`<firebase-loginbutton
          label="Custom Login"
        ></firebase-loginbutton>`
      );
      const button = el.shadowRoot.querySelector('button');
      expect(button.textContent).to.include('Custom Login');
    });

    it('should render button icon', async () => {
      const el = await fixture(
        html`<firebase-loginbutton></firebase-loginbutton>`
      );
      const icon = el.shadowRoot.querySelector('.button-icon');
      expect(icon).to.exist;
    });

    it('should render SVG in icon', async () => {
      const el = await fixture(
        html`<firebase-loginbutton></firebase-loginbutton>`
      );
      const svg = el.shadowRoot.querySelector('.button-icon svg');
      expect(svg).to.exist;
    });
  });

  describe('disabled state', () => {
    it('should disable button when disabled is true', async () => {
      const el = await fixture(
        html`<firebase-loginbutton disabled></firebase-loginbutton>`
      );
      const button = el.shadowRoot.querySelector('button');
      expect(button.disabled).to.be.true;
    });

    it('should enable button when disabled is false', async () => {
      const el = await fixture(
        html`<firebase-loginbutton></firebase-loginbutton>`
      );
      const button = el.shadowRoot.querySelector('button');
      expect(button.disabled).to.be.false;
    });
  });

  describe('email form', () => {
    it('should show email form when email provider button is clicked', async () => {
      const el = await fixture(
        html`<firebase-loginbutton provider="email"></firebase-loginbutton>`
      );
      const button = el.shadowRoot.querySelector('button');
      button.click();
      await el.updateComplete;

      const form = el.shadowRoot.querySelector('.email-form');
      expect(form).to.exist;
    });

    it('should have email input in form', async () => {
      const el = await fixture(
        html`<firebase-loginbutton provider="email"></firebase-loginbutton>`
      );
      el._showEmailForm = true;
      await el.updateComplete;

      const emailInput = el.shadowRoot.querySelector('input[type="email"]');
      expect(emailInput).to.exist;
    });

    it('should have password input in form', async () => {
      const el = await fixture(
        html`<firebase-loginbutton provider="email"></firebase-loginbutton>`
      );
      el._showEmailForm = true;
      await el.updateComplete;

      const passwordInput = el.shadowRoot.querySelector(
        'input[type="password"]'
      );
      expect(passwordInput).to.exist;
    });

    it('should have cancel button in form', async () => {
      const el = await fixture(
        html`<firebase-loginbutton provider="email"></firebase-loginbutton>`
      );
      el._showEmailForm = true;
      await el.updateComplete;

      const cancelButton = el.shadowRoot.querySelector(
        'button[type="button"]'
      );
      expect(cancelButton).to.exist;
      expect(cancelButton.textContent).to.include('Cancel');
    });

    it('should hide form when cancel is clicked', async () => {
      const el = await fixture(
        html`<firebase-loginbutton provider="email"></firebase-loginbutton>`
      );
      el._showEmailForm = true;
      await el.updateComplete;

      const cancelButton = el.shadowRoot.querySelector(
        'button[type="button"]'
      );
      cancelButton.click();
      await el.updateComplete;

      const form = el.shadowRoot.querySelector('.email-form');
      expect(form).to.be.null;
    });
  });

  describe('getters', () => {
    it('should return null for user when not authenticated', async () => {
      const el = await fixture(
        html`<firebase-loginbutton></firebase-loginbutton>`
      );
      expect(el.user).to.be.null;
    });

    it('should return false for isAuthenticated when no user', async () => {
      const el = await fixture(
        html`<firebase-loginbutton></firebase-loginbutton>`
      );
      expect(el.isAuthenticated).to.be.false;
    });
  });

  describe('loading state', () => {
    it('should show loading spinner when loading', async () => {
      const el = await fixture(
        html`<firebase-loginbutton></firebase-loginbutton>`
      );
      el._loading = true;
      await el.updateComplete;

      const spinner = el.shadowRoot.querySelector('.loading-spinner');
      expect(spinner).to.exist;
    });

    it('should disable button when loading', async () => {
      const el = await fixture(
        html`<firebase-loginbutton></firebase-loginbutton>`
      );
      el._loading = true;
      await el.updateComplete;

      const button = el.shadowRoot.querySelector('button');
      expect(button.disabled).to.be.true;
    });
  });

  describe('events', () => {
    it('should dispatch login-error when _setError is called', async () => {
      const el = await fixture(
        html`<firebase-loginbutton></firebase-loginbutton>`
      );

      setTimeout(() => el._setError('Test error'));
      const event = await oneEvent(el, 'login-error');

      expect(event).to.exist;
      expect(event.detail.message).to.equal('Test error');
    });

    it('should have bubbles and composed on login-error event', async () => {
      const el = await fixture(
        html`<firebase-loginbutton></firebase-loginbutton>`
      );

      setTimeout(() => el._setError('Test error'));
      const event = await oneEvent(el, 'login-error');

      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    it('should dispatch login-success when _dispatchLoginSuccess is called', async () => {
      const el = await fixture(
        html`<firebase-loginbutton></firebase-loginbutton>`
      );

      const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
        emailVerified: true,
        providerId: 'google.com',
      };

      setTimeout(() => el._dispatchLoginSuccess(mockUser));
      const event = await oneEvent(el, 'login-success');

      expect(event).to.exist;
      expect(event.detail.user.uid).to.equal('test-uid');
      expect(event.detail.user.email).to.equal('test@example.com');
    });

    it('should have bubbles and composed on login-success event', async () => {
      const el = await fixture(
        html`<firebase-loginbutton></firebase-loginbutton>`
      );

      const mockUser = {
        uid: 'test-uid',
        email: null,
        displayName: null,
        photoURL: null,
        emailVerified: false,
        providerId: null,
      };

      setTimeout(() => el._dispatchLoginSuccess(mockUser));
      const event = await oneEvent(el, 'login-success');

      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });
  });

  describe('accessibility', () => {
    it('should have aria-label on button', async () => {
      const el = await fixture(
        html`<firebase-loginbutton></firebase-loginbutton>`
      );
      const button = el.shadowRoot.querySelector('button');
      expect(button.getAttribute('aria-label')).to.exist;
    });

    it('should have proper role structure', async () => {
      const el = await fixture(
        html`<firebase-loginbutton></firebase-loginbutton>`
      );
      expect(el.shadowRoot).to.exist;
    });

    it('should be hidden when hidden attribute is set', async () => {
      const el = await fixture(
        html`<firebase-loginbutton hidden></firebase-loginbutton>`
      );
      const styles = getComputedStyle(el);
      expect(styles.display).to.equal('none');
    });
  });

  describe('providers', () => {
    const providers = [
      'google',
      'github',
      'email',
      'anonymous',
      'microsoft',
      'twitter',
      'facebook',
    ];

    providers.forEach((provider) => {
      it(`should render ${provider} provider button`, async () => {
        const el = await fixture(
          html`<firebase-loginbutton
            provider="${provider}"
          ></firebase-loginbutton>`
        );
        const button = el.shadowRoot.querySelector('button');
        expect(button.classList.contains(`login-button--${provider}`)).to.be
          .true;
      });
    });
  });

  describe('error handling', () => {
    it('should display error message in email form', async () => {
      const el = await fixture(
        html`<firebase-loginbutton provider="email"></firebase-loginbutton>`
      );
      el._showEmailForm = true;
      el._error = 'Invalid credentials';
      await el.updateComplete;

      const errorMessage = el.shadowRoot.querySelector('.error-message');
      expect(errorMessage).to.exist;
      expect(errorMessage.textContent).to.equal('Invalid credentials');
    });

    it('should set error state when _setError is called', async () => {
      const el = await fixture(
        html`<firebase-loginbutton></firebase-loginbutton>`
      );
      el._setError('Test error message');

      expect(el._error).to.equal('Test error message');
    });
  });
});
