/* ══════════════════════════════════════════════════════════
   BennettCare – app.js
   Author: Ojasvee Tyagi · S24SCSET102 · Bennett University
══════════════════════════════════════════════════════════ */

'use strict';

// ── Request ID counter ──────────────────────────────────
let reqCounter = 1025;
function nextReqId() { return `BC${reqCounter++}`; }

// ══════════════════════════════════════════════════════════
//  PAGE NAVIGATION
// ══════════════════════════════════════════════════════════
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Show target page
  const target = document.getElementById(`page-${pageId}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update nav active state
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageId);
  });

  // Close mobile nav if open
  document.getElementById('navLinks')?.classList.remove('open');

  // Trigger counter animation on home page
  if (pageId === 'home') {
    setTimeout(animateCounters, 400);
  }
}

// ══════════════════════════════════════════════════════════
//  NAVBAR: SCROLL & HAMBURGER
// ══════════════════════════════════════════════════════════
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  navbar?.classList.toggle('scrolled', window.scrollY > 10);
});

document.getElementById('navHamburger')?.addEventListener('click', () => {
  document.getElementById('navLinks')?.classList.toggle('open');
});

// ══════════════════════════════════════════════════════════
//  FORM SUBMISSION (Mock)
// ══════════════════════════════════════════════════════════
function submitForm(event, type) {
  event.preventDefault();

  const id = nextReqId();
  const btn = event.target.querySelector('button[type=submit]');

  // Loading state
  if (btn) {
    btn.disabled = true;
    btn.textContent = '⏳ Submitting...';
  }

  // Simulate async submit
  setTimeout(() => {
    if (type === 'food') {
      document.getElementById('foodFormCard').classList.add('hidden');
      const success = document.getElementById('foodSuccess');
      success.classList.remove('hidden');
      document.getElementById('foodRequestId').textContent = id;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } else if (type === 'delivery') {
      document.getElementById('deliveryFormCard').classList.add('hidden');
      const success = document.getElementById('deliverySuccess');
      success.classList.remove('hidden');
      document.getElementById('deliveryRequestId').textContent = id;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } else if (type === 'volunteer') {
      document.getElementById('volFormCard').classList.add('hidden');
      const success = document.getElementById('volSuccess');
      success.classList.remove('hidden');
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Re-enable button (in case user clicks back)
    if (btn) {
      btn.disabled = false;
      btn.textContent = btn.dataset.orig || btn.textContent;
    }
  }, 1200);
}

function resetForm(type) {
  if (type === 'food') {
    document.getElementById('foodForm')?.reset();
    document.getElementById('foodFormCard')?.classList.remove('hidden');
    document.getElementById('foodSuccess')?.classList.add('hidden');
  } else if (type === 'delivery') {
    document.getElementById('deliveryForm')?.reset();
    document.getElementById('deliveryFormCard')?.classList.remove('hidden');
    document.getElementById('deliverySuccess')?.classList.add('hidden');
  }
}

// ══════════════════════════════════════════════════════════
//  TRACK REQUEST (Mock)
// ══════════════════════════════════════════════════════════
function trackRequest() {
  const input = document.getElementById('trackInput')?.value.trim();
  if (!input) return;

  // Accept BC#### format
  const match = input.match(/BC(\d+)/i);
  if (!match) {
    showToast('Please enter a valid Request ID (e.g. BC1024)', 'error');
    return;
  }

  const num = parseInt(match[1]);
  let type = 'Dinner Assistance';
  let state = 'active';

  // Deterministic mock based on number
  if (num % 3 === 0) { type = 'Lunch Assistance'; state = 'completed'; }
  else if (num % 3 === 1) { type = 'Dinner Assistance'; state = 'active'; }
  else { type = 'Package Collection'; state = 'pending'; }

  loadTrack(`BC${num}`, type, state);
}

function loadTrack(id, type, state) {
  const card = document.getElementById('trackCard');
  if (!card) return;

  // Update badge
  card.querySelector('.track-id-badge strong').textContent = id;
  card.querySelector('.track-type-badge').textContent =
    type.includes('Lunch') || type.includes('Dinner') || type.includes('Breakfast')
      ? `🍛 ${type}` : `📦 ${type}`;

  // Update input
  const inp = document.getElementById('trackInput');
  if (inp) inp.value = id;

  // Re-render timeline based on state
  const steps = card.querySelectorAll('.timeline-step');
  steps.forEach((step, i) => {
    step.classList.remove('completed', 'active', 'pending');
    const dot = step.querySelector('.ts-dot');
    dot?.classList.remove('pulse');

    if (state === 'completed') {
      step.classList.add('completed');
    } else if (state === 'active') {
      if (i < 2) step.classList.add('completed');
      else if (i === 2) { step.classList.add('active'); dot?.classList.add('pulse'); }
      else step.classList.add('pending');
    } else {
      // pending
      if (i === 0) step.classList.add('completed');
      else if (i === 1) { step.classList.add('active'); dot?.classList.add('pulse'); }
      else step.classList.add('pending');
    }
  });

  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  showToast(`Tracking ${id}`, 'success');
}

// ══════════════════════════════════════════════════════════
//  COUNTER ANIMATION
// ══════════════════════════════════════════════════════════
function animateCounters() {
  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 1200;
    const step = target / (duration / 16);
    let current = 0;
    el.dataset.animated = 'true';

    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current);
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

// ══════════════════════════════════════════════════════════
//  TOAST NOTIFICATION
// ══════════════════════════════════════════════════════════
function showToast(message, type = 'info') {
  // Remove existing toasts
  document.querySelectorAll('.bc-toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = `bc-toast bc-toast-${type}`;
  toast.textContent = message;

  const colors = { success: '#059669', error: '#dc2626', info: '#1a56db' };
  const bg = colors[type] || colors.info;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    background: bg,
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '10px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '.875rem',
    fontWeight: '600',
    zIndex: '9999',
    boxShadow: '0 4px 20px rgba(0,0,0,.2)',
    transform: 'translateY(80px)',
    opacity: '0',
    transition: 'all .3s cubic-bezier(.4,0,.2,1)',
  });

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });

  setTimeout(() => {
    toast.style.transform = 'translateY(80px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ══════════════════════════════════════════════════════════
//  INTERSECTION OBSERVER — fade-in cards
// ══════════════════════════════════════════════════════════
function setupObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.problem-card, .solution-card, .future-item, .safety-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(el);
  });
}

// ══════════════════════════════════════════════════════════
//  REPORT ISSUE (Mock Modal)
// ══════════════════════════════════════════════════════════
document.querySelectorAll('.btn-danger').forEach(btn => {
  if (btn.textContent.includes('Report')) {
    btn.addEventListener('click', () => {
      showToast('Report form coming soon. For urgent issues, contact campus security.', 'info');
    });
  }
});

// ══════════════════════════════════════════════════════════
//  FORM — hidden class utility
// ══════════════════════════════════════════════════════════
// Add CSS for .hidden class
const style = document.createElement('style');
style.textContent = `.hidden { display: none !important; }`;
document.head.appendChild(style);

// ══════════════════════════════════════════════════════════
//  INITIALIZE
// ══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Set initial active nav
  document.querySelector('[data-page="home"]')?.classList.add('active');

  // Setup animations
  setupObserver();

  // Animate counters if home is active
  setTimeout(animateCounters, 800);

  // Prevent form default on all demo buttons
  document.querySelectorAll('a[href="tel:+911"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('📞 In the real system, this would call campus services directly.', 'info');
    });
  });

  // Export CSV mock
  document.querySelectorAll('.btn-outline-sm').forEach(btn => {
    if (btn.textContent.includes('Export')) {
      btn.addEventListener('click', () => showToast('Export feature coming in full release.', 'info'));
    }
  });

  // Admin filter mock
  document.querySelector('.admin-filter')?.addEventListener('change', function () {
    showToast(`Filtering by: ${this.value}`, 'info');
  });

  console.log('%cBennettCare', 'font-size:24px;font-weight:900;color:#1a56db;');
  console.log('%cCreated by Ojasvee Tyagi · S24SCSET102 · Bennett University', 'color:#475569;');
});
