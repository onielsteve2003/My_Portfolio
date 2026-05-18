/* ── Custom Cursor (desktop / mouse only) ─────────────────── */
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

// Skip the rAF loop entirely on touch devices — saves battery & CPU
if (!isTouch && cursorDot && cursorRing) {
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  }, { passive: true });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.24;
    ringY += (mouseY - ringY) * 0.24;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

document.addEventListener('DOMContentLoaded', function () {

  /* ── AOS ─────────────────────────────────────────────────── */
  AOS.init({ duration: 700, once: true });

  /* ── Theme Toggle ────────────────────────────────────────── */
  const themeBtn = document.querySelector('li.theme-toggle');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeBtn) {
      const icon = themeBtn.querySelector('i');
      if (icon) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
      }
    }
  }

  // Always default to dark on load; light is toggle-only
  applyTheme('dark');

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  /* ── Mobile Menu ─────────────────────────────────────────── */
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks   = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });

    // also close when theme toggle li is clicked on mobile
    const themeToggleLi = navLinks.querySelector('li.theme-toggle');
    if (themeToggleLi) {
      themeToggleLi.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    }
  }

  /* ── Scroll Hint ─────────────────────────────────────────── */
  const scrollHint = document.querySelector('.hero-scroll-hint');
  if (scrollHint) {
    scrollHint.addEventListener('click', () => {
      const about = document.getElementById('about');
      if (about) about.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ── Scroll Events ───────────────────────────────────────── */
  const navbar     = document.querySelector('.nav-wrapper');
  const scrollTop  = document.getElementById('scroll-top');

  function onScroll() {
    if (navbar) {
      navbar.classList.toggle('nav-scrolled', window.scrollY > 30);
    }
    if (scrollTop) {
      scrollTop.classList.toggle('visible', window.scrollY > 400);
    }
  }

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Experience Tabs ─────────────────────────────────────── */
  const expTabs   = document.querySelectorAll('.exp-tab');
  const expPanels = document.querySelectorAll('.exp-panel');

  expTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      expTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      expPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add('active');
    });
  });

  /* ── Project Filter ──────────────────────────────────────── */
  const filterBtns    = document.querySelectorAll('.filter-btn');
  const projectCards  = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ── Scroll To Top ───────────────────────────────────────── */
  if (scrollTop) {
    scrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Contact Form ────────────────────────────────────────── */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();

      const formData = {
        name:    document.getElementById('name')?.value,
        email:   document.getElementById('email')?.value,
        subject: document.getElementById('subject')?.value,
        message: document.getElementById('message')?.value,
      };

      try {
        await axios.post('https://onielsteve.herokuapp.com/api/users', formData);
        showNotification('Message sent successfully!', 'success');
        contactForm.reset();
      } catch {
        showNotification('Error sending message. Please try again.', 'error');
      }
    });
  }

  /* ── Notification Helper ─────────────────────────────────── */
  function showNotification(message, type = 'success') {
    let el = document.querySelector('.notification');
    if (!el) {
      el = document.createElement('div');
      el.className = 'notification';
      document.body.appendChild(el);
    }

    el.textContent = message;
    el.className = `notification ${type}`;

    // trigger show
    requestAnimationFrame(() => {
      requestAnimationFrame(() => el.classList.add('show'));
    });

    setTimeout(() => {
      el.classList.remove('show');
    }, 3500);
  }

});
