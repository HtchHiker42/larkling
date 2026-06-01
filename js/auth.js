/* ── AUTH ─────────────────────────────────────────────────
   Uses Google Identity Services (GIS) for sign-in.
   To enable real Google login:
     1. Go to console.cloud.google.com
     2. Create an OAuth 2.0 Client ID (Web application)
     3. Add your domain to Authorized JavaScript origins
     4. Replace GOOGLE_CLIENT_ID below with your client ID
   ──────────────────────────────────────────────────────── */

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';
const AUTH_KEY = 'lark_user';

function getUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; }
}

function setUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem(AUTH_KEY);
}

function updateNavForUser(user) {
  const actions = document.querySelector('.nav-actions');
  if (!actions) return;
  if (user) {
    actions.innerHTML = `
      <div class="nav-user" aria-label="Signed in as ${user.name}">
        <div class="nav-avatar" aria-hidden="true">${user.name.charAt(0).toUpperCase()}</div>
        <span class="nav-user-name">${user.name.split(' ')[0]}</span>
        <button class="btn btn-ghost btn-sm" id="sign-out-btn">Sign out</button>
      </div>
    `;
    document.getElementById('sign-out-btn')?.addEventListener('click', signOut);
  } else {
    actions.innerHTML = `
      <button class="btn btn-ghost btn-sm" id="login-btn">Log in</button>
      <button class="btn btn-green btn-sm" id="signup-btn">Get started</button>
    `;
    document.getElementById('login-btn')?.addEventListener('click', openAuthModal);
    document.getElementById('signup-btn')?.addEventListener('click', openAuthModal);
  }
}

function openAuthModal() {
  document.getElementById('auth-modal')?.classList.add('open');
  document.getElementById('auth-modal')?.querySelector('button')?.focus();
}

function closeAuthModal() {
  document.getElementById('auth-modal')?.classList.remove('open');
}

function signOut() {
  clearUser();
  updateNavForUser(null);
  showToast('Signed out.');
}

/* Google Identity Services callback */
function handleGoogleCredential(response) {
  // Decode JWT payload (no sensitive ops — just reading display info)
  try {
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    const user = { name: payload.name, email: payload.email, picture: payload.picture };
    setUser(user);
    closeAuthModal();
    updateNavForUser(user);
    showToast(`Welcome, ${user.name.split(' ')[0]}!`);
  } catch {
    showToast('Sign-in failed. Please try again.');
  }
}

function initGoogleSignIn() {
  if (typeof google === 'undefined' || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
    // Fallback: simple name-based mock sign-in for demo
    document.getElementById('google-btn')?.addEventListener('click', () => {
      const name = prompt('Enter your name to continue (demo mode):');
      if (!name || !name.trim()) return;
      const user = { name: name.trim(), email: '', picture: '' };
      setUser(user);
      closeAuthModal();
      updateNavForUser(user);
      showToast(`Welcome, ${user.name.split(' ')[0]}!`);
    });
    return;
  }
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleCredential,
  });
  google.accounts.id.renderButton(document.getElementById('google-btn'), {
    theme: 'outline', size: 'large', width: 320, text: 'continue_with',
  });
}

function buildAuthModal() {
  const modal = document.createElement('div');
  modal.id = 'auth-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Sign in to LARK');
  modal.innerHTML = `
    <div class="auth-backdrop"></div>
    <div class="auth-box">
      <button class="auth-close" aria-label="Close sign-in dialog" id="auth-close-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <div class="auth-logo" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M12 2C9.5 2 7.5 3.5 6.5 5.5C5 5 3 5.5 2 7c1.5 0 2.5.5 3 1.5C3.5 9.5 3 11 3.5 12.5 4.5 11 6 10 7.5 10c.5 1.5.5 3 0 4.5C9 13.5 10.5 12.5 12 12.5s3 1 3.5 2C15 13 14.5 11.5 14 10c1.5 0 3 1 4 2.5.5-1.5 0-3-1.5-4C17.5 8 18.5 7 20 7c-1-1.5-3-2-4.5-1.5C14.5 3.5 13.5 2 12 2z"/></svg>
      </div>
      <h2 class="auth-title">Sign in to LARK</h2>
      <p class="auth-sub">Track your progress across all six modules and submit work to the Digital Seed Archive.</p>
      <div id="google-btn" class="google-btn-wrap">
        <button class="google-btn-fallback" type="button">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </div>
      <p class="auth-terms">By continuing, you agree to LARK's open-access terms. Your data is never sold.</p>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('auth-close-btn').addEventListener('click', closeAuthModal);
  modal.querySelector('.auth-backdrop').addEventListener('click', closeAuthModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAuthModal(); });
}

function initAuth() {
  buildAuthModal();
  const user = getUser();
  updateNavForUser(user);
  // Wire up any static login/signup buttons that exist before JS runs
  document.addEventListener('click', e => {
    if (e.target.closest('#login-btn') || e.target.closest('#signup-btn')) openAuthModal();
  });
  // Load GIS script if real client ID provided
  if (GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE') {
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = initGoogleSignIn;
    document.head.appendChild(s);
  } else {
    initGoogleSignIn();
  }
}
