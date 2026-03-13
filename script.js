// Smooth scrolling with offset for sticky nav
document.querySelectorAll('.nav__links a, .site-footer__backtotop').forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();

    const rect = target.getBoundingClientRect();
    const offsetTop = window.pageYOffset + rect.top - 90; // account for nav height

    window.scrollTo({
      top: offsetTop < 0 ? 0 : offsetTop,
      behavior: 'smooth',
    });

    const navLinks = document.querySelector('.nav__links');
    const toggle = document.querySelector('.nav__toggle');
    if (navLinks && toggle && navLinks.classList.contains('nav__links--open')) {
      navLinks.classList.remove('nav__links--open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// Mobile nav toggle
const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('nav__links--open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Close mobile nav when clicking outside
document.addEventListener('click', (event) => {
  const target = event.target;
  if (!navLinks || !navToggle) return;
  if (navLinks.contains(target) || navToggle.contains(target)) return;
  if (navLinks.classList.contains('nav__links--open')) {
    navLinks.classList.remove('nav__links--open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// Scroll reveal animations
const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && revealElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => observer.observe(el));
} else {
  // Fallback: just show all
  revealElements.forEach((el) => el.classList.add('reveal--visible'));
}

// Active section highlighting (desktop rail + mobile nav)
const navAnchors = Array.from(document.querySelectorAll('.nav__links a'));
const sections = Array.from(document.querySelectorAll('main section[id]'));

function setActiveSection(id) {
  navAnchors.forEach((a) => {
    const href = a.getAttribute('href');
    const isActive = href === `#${id}`;
    a.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

if ('IntersectionObserver' in window && sections.length > 0 && navAnchors.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0));
      if (visible.length === 0) return;
      const id = visible[0].target.getAttribute('id');
      if (!id) return;
      setActiveSection(id);
    },
    {
      root: null,
      threshold: 0.35,
      rootMargin: '-15% 0px -60% 0px',
    }
  );

  sections.forEach((s) => sectionObserver.observe(s));
}

