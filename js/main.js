/* ── PROGRESS STATE ─────────────────────────────────────── */
const PROGRESS_KEY = 'lark_progress';

const defaultProgress = {
  m1: 0, m2: 0, m3: 0, m4: 0, m5: 0, m6: 0
};

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || defaultProgress;
  } catch {
    return defaultProgress;
  }
}

function saveProgress(data) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

function renderProgress() {
  const p = loadProgress();
  const modules = ['m1','m2','m3','m4','m5','m6'];

  modules.forEach((key, i) => {
    // Update progress bars on course cards
    const fill = document.querySelector(`[data-module="${key}"] .progress-fill`);
    const pct  = document.querySelector(`[data-module="${key}"] .progress-pct`);
    if (fill) fill.style.width = p[key] + '%';
    if (pct)  pct.textContent  = p[key] > 0 ? p[key] + '%' : 'Start';

    // Update hero journey dots
    const dot = document.querySelector(`[data-journey="${key}"]`);
    if (!dot) return;
    dot.classList.remove('done', 'active', 'locked');
    if (p[key] === 100) {
      dot.classList.add('done');
      dot.innerHTML = `<svg viewBox="0 0 10 10" fill="none" aria-hidden="true"><polyline points="1.5,5 4,7.5 8.5,2" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`;
    } else if (p[key] > 0) {
      dot.classList.add('active');
      dot.textContent = '▶';
    } else {
      dot.classList.add('locked');
      dot.textContent = i + 1;
    }
  });
}

/* ── CARD CLICK (simulate starting a module) ────────────── */
function initCardClicks() {
  document.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.module;
      if (!key) return;
      const p = loadProgress();
      // Advance by 20% each click for demo purposes
      p[key] = Math.min(100, (p[key] || 0) + 20);
      saveProgress(p);
      renderProgress();
      showToast(`Progress saved for ${card.querySelector('.course-card-title').textContent}`);
    });

    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  });
}

/* ── TOAST ──────────────────────────────────────────────── */
function showToast(msg) {
  let toast = document.getElementById('lark-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'lark-toast';
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
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
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

/* ── STICKY NAV SHADOW ──────────────────────────────────── */
function initNavScroll() {
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 4
      ? '0 2px 8px rgba(0,0,0,.10)'
      : 'none';
  }, { passive: true });
}

/* ── SMOOTH SCROLL for anchor links ────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── INIT ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderProgress();
  initCardClicks();
  initNavScroll();
  initSmoothScroll();
});
