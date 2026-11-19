import { createBody, stepAssembly, scatter, contain, clamp } from './assembly-physics.mjs';

export function initAssembly() {
  const hero = document.querySelector('.assembly-hero');
  if (!hero || hero.classList.contains('assembly-ready')) return;
  const root = document.documentElement;
  const board = hero.querySelector('.assembly-board');
  const elements = [...board.querySelectorAll('[data-piece]')];
  const toggle = hero.querySelector('.assembly-toggle');
  const status = hero.querySelector('.assembly-status');
  const hint = hero.querySelector('.assembly-hint');
  const defaultHint = hint.innerHTML;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const copy = {
    en: { break: 'Break it', build: 'Rebuild', board: 'Playable name assembly', piece: 'Move letter', photo: 'Move photo of Fakhri at work', picked: 'Picked up. Click a destination, or use arrow keys and Enter to place.', placed: 'Placed.', loose: 'Taken apart. Drag or pick up a piece; Rebuild restores the name.', built: 'Rebuilt. Fakhri Rasyid Saputro.' },
    id: { break: 'Bongkar', build: 'Rakit lagi', board: 'Nama yang bisa dimainkan', piece: 'Pindahkan huruf', photo: 'Pindahkan foto Fakhri saat bekerja', picked: 'Diambil. Klik tujuan, atau gunakan tombol panah lalu Enter untuk meletakkan.', placed: 'Diletakkan.', loose: 'Dibongkar. Geser atau pilih bagian; Rakit lagi mengembalikan nama.', built: 'Dirakit kembali. Fakhri Rasyid Saputro.' },
    zh: { break: '拆开', build: '重新组装', board: '可互动的姓名组件', piece: '移动字母', photo: '移动 Fakhri 工作时的照片', picked: '已拾取。点击目标位置，或用方向键移动、回车放下。', placed: '已放下。', loose: '已拆开。拖动或选取组件；点击重新组装还原姓名。', built: '已重新组装。Fakhri Rasyid Saputro。' },
  }[root.lang] || null;
  if (!copy) return;
  let bodies = [], width = 0, height = 0, boardHeight = 0, mode = 'built', selected = -1;
  let pointer = null, frame = 0, until = 0, last = 0, accumulator = 0, inView = true, lastPointerActivation = -Infinity;
  const guide = document.createElement('div');
  guide.className = 'assembly-guide';
  guide.setAttribute('aria-hidden', 'true');
  board.prepend(guide);

  function render() {
    bodies.forEach((b, i) => {
      elements[i].style.transform = `translate(${(b.x - b.home.x).toFixed(2)}px, ${(b.y - b.home.y).toFixed(2)}px) rotate(${b.angle.toFixed(4)}rad)`;
    });
  }
  function stop() {
    cancelAnimationFrame(frame); frame = 0; last = 0; accumulator = 0;
    hero.classList.remove('is-running');
  }
  function snapHome() {
    bodies.forEach(b => { Object.assign(b, b.home, { vx: 0, vy: 0, spin: 0, held: false }); });
    render();
  }
  function tick(now) {
    frame = 0;
    if (document.hidden || !inView || reduced.matches) { stop(); return; }
    accumulator += Math.min(64, last ? now - last : 16.67); last = now;
    while (accumulator >= 1000 / 60) {
      stepAssembly(bodies, width, height, mode);
      accumulator -= 1000 / 60;
    }
    render();
    if (now < until) frame = requestAnimationFrame(tick);
    else { if (mode === 'built') snapHome(); stop(); }
  }
  function wake(duration = 5000) {
    render();
    if (reduced.matches || !inView || document.hidden) return;
    until = performance.now() + duration;
    if (!frame) { hero.classList.add('is-running'); frame = requestAnimationFrame(tick); }
  }
  function setMode(value, announce = true) {
    mode = value; hero.dataset.mode = value;
    toggle.setAttribute('aria-pressed', String(value === 'loose'));
    toggle.querySelector('.assembly-toggle-label').textContent = value === 'loose' ? copy.build : copy.break;
    if (announce) status.textContent = value === 'loose' ? copy.loose : copy.built;
  }
  function clearSelection() {
    if (selected >= 0) bodies[selected].held = false;
    elements.forEach(el => el.setAttribute('aria-pressed', 'false'));
    selected = -1;
    hint.innerHTML = defaultHint;
  }
  function rebuild(announce = true) {
    pointer = null; clearSelection(); setMode('built', announce);
    if (reduced.matches) { stop(); snapHome(); } else wake(1500);
  }
  function layout() {
    stop(); pointer = null; clearSelection(); setMode('built', false);
    elements.forEach(el => { el.style.transform = ''; el.style.rotate = '0deg'; });
    const rect = board.getBoundingClientRect();
    width = rect.width; boardHeight = rect.height; height = Math.max(1, boardHeight - 32);
    bodies = elements.map(el => {
      const r = el.getBoundingClientRect();
      return createBody(r.x - rect.x + r.width / 2, r.y - rect.y + r.height / 2, r.width, r.height, el.hasAttribute('data-photo') ? .14 : 0);
    });
    guide.replaceChildren(...bodies.map(b => {
      const mark = document.createElement('i');
      Object.assign(mark.style, { left: `${b.x - b.width / 2}px`, top: `${b.y - b.height / 2}px`, width: `${b.width}px`, height: `${b.height}px` });
      return mark;
    }));
    render();
  }
  function focusPiece(index) {
    elements.forEach((el, i) => el.tabIndex = i === index ? 0 : -1);
    elements[index].focus({ preventScroll: true });
  }
  function pick(index) {
    clearSelection(); selected = index;
    const b = bodies[index]; b.held = true; b.vx = b.vy = b.spin = 0;
    setMode('loose', false);
    elements[index].setAttribute('aria-pressed', 'true');
    focusPiece(index); status.textContent = copy.picked;
    hint.textContent = { en: 'Tap a new spot to place it.', id: 'Ketuk tempat baru untuk meletakkan.', zh: '点击新位置即可放下。' }[root.lang];
  }
  function place(point, throwVelocity = false) {
    if (selected < 0) return;
    const b = bodies[selected];
    if (point) { b.x = point.x; b.y = point.y; }
    if (!throwVelocity) b.vx = b.vy = b.spin = 0;
    contain(b, width, height);
    clearSelection(); status.textContent = copy.placed; wake();
  }
  function localPoint(event) {
    const r = board.getBoundingClientRect();
    return { x: event.clientX - r.x, y: event.clientY - r.y };
  }

  elements.forEach((el, i) => {
    el.setAttribute('role', 'button'); el.tabIndex = i === 0 ? 0 : -1;
    el.setAttribute('aria-label', el.hasAttribute('data-photo') ? copy.photo : `${copy.piece} ${el.textContent} (${i + 1}/12)`);
    el.setAttribute('aria-describedby', 'assembly-help'); el.setAttribute('aria-pressed', 'false');
    el.addEventListener('keydown', event => {
      const arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
      if (arrows.includes(event.key)) {
        event.preventDefault();
        if (selected === i) {
          const b = bodies[i], amount = event.shiftKey ? 30 : 10;
          b.x += event.key === 'ArrowLeft' ? -amount : event.key === 'ArrowRight' ? amount : 0;
          b.y += event.key === 'ArrowUp' ? -amount : event.key === 'ArrowDown' ? amount : 0;
          contain(b, width, height); render();
        } else focusPiece((i + (event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1) + elements.length) % elements.length);
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (selected === i) place(); else pick(i);
      }
    });
    // Assistive-technology activation may dispatch a click without pointer events.
    el.addEventListener('click', event => {
      // Touch can emit a zero-detail click after pointerup. Do not activate twice.
      if (event.detail !== 0 || event.pointerType || performance.now() - lastPointerActivation < 500) return;
      if (selected === i) place(); else pick(i);
    });
  });

  board.addEventListener('pointerdown', event => {
    if (event.button !== 0 || pointer || !event.isPrimary) return;
    lastPointerActivation = performance.now();
    const point = localPoint(event), element = event.target.closest('[data-piece]');
    if (selected >= 0) { place(point); return; }
    if (!element) return;
    event.preventDefault();
    const index = elements.indexOf(element); pick(index);
    const b = bodies[index];
    pointer = { id: event.pointerId, index, x: point.x, y: point.y, dx: b.x - point.x, dy: b.y - point.y, moved: false, time: event.timeStamp };
    element.setPointerCapture(event.pointerId);
  });
  board.addEventListener('pointermove', event => {
    if (!pointer || event.pointerId !== pointer.id) return;
    const point = localPoint(event), b = bodies[pointer.index];
    if (Math.hypot(point.x - pointer.x, point.y - pointer.y) > 4) pointer.moved = true;
    if (!pointer.moved) return;
    const x = point.x + pointer.dx, y = point.y + pointer.dy;
    const dt = Math.max(8, event.timeStamp - pointer.time) / 16.67;
    b.vx = clamp((x - b.x) / dt, -18, 18); b.vy = clamp((y - b.y) / dt, -18, 18);
    b.spin = reduced.matches ? 0 : b.vx * .002;
    b.x = x; b.y = y; contain(b, width, height);
    pointer.time = event.timeStamp; wake();
  });
  function release(event) {
    if (!pointer || event.pointerId !== pointer.id) return;
    const old = pointer; pointer = null;
    if (event.type !== 'pointerup') place();
    else if (old.moved) place(null, true);
    if (elements[old.index].hasPointerCapture(old.id)) elements[old.index].releasePointerCapture(old.id);
  }
  board.addEventListener('pointerup', release);
  board.addEventListener('pointercancel', release);
  board.addEventListener('lostpointercapture', release);
  hero.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mode === 'loose') { event.preventDefault(); rebuild(); }
  });
  hero.addEventListener('focusout', event => {
    if (!board.contains(event.relatedTarget) && selected >= 0 && !pointer) place();
  });
  toggle.addEventListener('click', () => {
    if (mode === 'loose') rebuild();
    else { clearSelection(); setMode('loose'); scatter(bodies, width, height, reduced.matches); wake(); }
  });

  layout();
  board.removeAttribute('aria-hidden');
  board.setAttribute('role', 'group'); board.setAttribute('aria-label', copy.board);
  hero.classList.add('assembly-ready');
  new ResizeObserver(() => {
    if (Math.abs(board.clientWidth - width) > 1 || Math.abs(board.clientHeight - boardHeight) > 1) layout();
  }).observe(board);
  document.fonts?.ready.then(layout);
  reduced.addEventListener('change', () => { stop(); rebuild(false); });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    root.classList.toggle('hero-in-view', inView);
    if (!inView) stop();
  }, { threshold: .15 }).observe(hero);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  addEventListener('pagehide', stop);
  addEventListener('pageshow', event => { if (event.persisted) layout(); });
}
