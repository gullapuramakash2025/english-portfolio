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

if (sections.length > 0 && navAnchors.length > 0) {
  const updateActiveOnScroll = () => {
    const scrollPosition = window.scrollY + 160; // bias slightly below top
    let currentId = sections[0].id;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const top = window.scrollY + rect.top;
      if (top <= scrollPosition) {
        currentId = section.id;
      }
    });

    setActiveSection(currentId);
  };

  // Set initial state
  updateActiveOnScroll();

  window.addEventListener('scroll', updateActiveOnScroll, { passive: true });
}

