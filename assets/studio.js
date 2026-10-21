import { initConnection } from './connection.js';

export function initStudio() {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer: fine)');
  const strings = {
    en: { view: 'OPEN ↗' },
    id: { view: 'BUKA ↗' },
    zh: { view: '查看 ↗' },
  }[root.lang] || { view: 'OPEN ↗' };

  // Each element remains visible if JS or IntersectionObserver is unavailable.
  const reveal = document.querySelectorAll('.featured-card, .about-copy, .note-row, .experience-row');
  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('will-reveal');
        observer.unobserve(entry.target);
      }
    }), { threshold: .08 });
    reveal.forEach(element => {
      if (element.getBoundingClientRect().top > innerHeight) element.classList.add('will-reveal');
      observer.observe(element);
    });
    reduced.addEventListener('change', () => {
      if (reduced.matches) reveal.forEach(element => element.classList.remove('will-reveal'));
    });
  }

  // Local time belongs to the engineer, regardless of the visitor's timezone.
  const clock = document.querySelector('[data-jakarta-time]');
  if (clock) {
    const update = () => { clock.textContent = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(new Date()) + ' WIB'; };
    update();
    const timer = setInterval(update, 60000);
    addEventListener('pagehide', () => clearInterval(timer), { once: true });
  }

  // Pointer treatment is supplementary: the actual link and cursor remain intact.
  const cursor = document.createElement('span');
  cursor.className = 'project-cursor';
  cursor.textContent = strings.view;
  cursor.setAttribute('aria-hidden', 'true');
  document.body.append(cursor);
  document.querySelectorAll('.featured-card .project-link').forEach(link => {
    link.addEventListener('pointermove', event => {
      if (!fine.matches || reduced.matches) return;
      cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      cursor.classList.add('is-visible');
    });
    link.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
    link.addEventListener('click', () => cursor.classList.remove('is-visible'));
  });
  addEventListener('scroll', () => cursor.classList.remove('is-visible'), { passive: true });

  // A real link navigation, enhanced by shared-image transitions where supported.
  document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', event => {
      if (reduced.matches || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const preview = link.querySelector('.project-image');
      if (preview) preview.style.viewTransitionName = 'project-preview';
    });
  });
  addEventListener('pageshow', () => {
    document.querySelectorAll('.project-image').forEach(element => element.style.removeProperty('view-transition-name'));
  });

  initConnection();
}
