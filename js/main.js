/* ── PROGRESS (homepage cards) ───────────────────────────── */
function loadProgress() {
  try { return JSON.parse(localStorage.getItem('lark_progress')) || {}; } catch { return {}; }
}

function renderHomepageProgress() {
  const p = loadProgress();
  ['m1','m2','m3','m4','m5','m6'].forEach(key => {
    const fill = document.querySelector(`[data-module="${key}"] .progress-fill`);
    const pct  = document.querySelector(`[data-module="${key}"] .progress-pct`);
    const val  = p[key] || 0;
    if (fill) fill.style.width = val + '%';
    if (pct)  pct.textContent  = val > 0 ? val + '%' : 'Start';
    const bar = document.querySelector(`[data-module="${key}"] .progress-wrap`);
    if (bar) bar.setAttribute('aria-valuenow', val);
  });
}

/* ── TOAST ───────────────────────────────────────────────── */
function showToast(msg) {
  let toast = document.getElementById('lark-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'lark-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    Object.assign(toast.style, {
      position: 'fixed', bottom: '24px', left: '50%',
      transform: 'translateX(-50%) translateY(8px)',
      background: '#21242C', color: '#fff',
      padding: '10px 20px', borderRadius: '6px',
      fontSize: '.875rem', fontWeight: '700',
      boxShadow: '0 4px 16px rgba(0,0,0,.2)',
      zIndex: '9999', opacity: '0',
      transition: 'opacity .2s, transform .2s',
      pointerEvents: 'none',
    });
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(8px)';
  }, 3000);
}

/* ── NAV SCROLL SHADOW ───────────────────────────────────── */
function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 4 ? '0 2px 8px rgba(0,0,0,.10)' : 'none';
  }, { passive: true });
}

/* ── SMOOTH SCROLL ───────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
}

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderHomepageProgress();
  initNavScroll();
  initSmoothScroll();
  if (typeof initAuth === 'function') initAuth();
  if (typeof renderModulePage === 'function') {
    renderModulePage();
    initActivityButtons();
  }
});
