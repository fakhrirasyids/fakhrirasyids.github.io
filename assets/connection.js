import { createCable, stepCable, cablePoint } from './cable.mjs';

export function initConnection() {
  const hero = document.querySelector('.connection-hero');
  if (!hero) return;
  const root = document.documentElement;
  const canvas = hero.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const plug = hero.querySelector('.cable-plug');
  const socket = hero.querySelector('.cable-socket');
  const action = hero.querySelector('.connection-action');
  const status = hero.querySelector('.connection-status');
  const instruction = hero.querySelector('.connection-instruction');
  const text = {
    en: { connect: 'Make a connection', disconnect: 'Disconnect', idle: 'Drag the plug. Or just click it.', active: 'Different worlds. One connection.', on: 'Connected', off: 'Connection reset', plug: 'Connect cable', unplug: 'Disconnect cable' },
    id: { connect: 'Hubungkan', disconnect: 'Putuskan', idle: 'Geser konektor. Atau klik saja.', active: 'Dua dunia. Satu koneksi.', on: 'Terhubung', off: 'Koneksi direset', plug: 'Hubungkan kabel', unplug: 'Putuskan kabel' },
    zh: { connect: '建立连接', disconnect: '断开连接', idle: '拖动插头，或轻点一下。', active: '不同世界，一个连接。', on: '已连接', off: '连接已重置', plug: '连接线缆', unplug: '断开线缆' },
  }[root.lang];
  let width, height, start, rest, target, end, points, length;
  let frame = 0, last = 0, accumulator = 0, awakeUntil = 0, pulseStart = null;
  let connected = false, dragging = false, pointer = null, down = null, moved = false, visible = true;
  let bg, ink, accent;
  const colors = () => {
    const s = getComputedStyle(root);
    bg = s.getPropertyValue('--bg').trim(); ink = s.getPropertyValue('--ink').trim();
    accent = s.getPropertyValue('--signal-color').trim();
  };
  const place = (element, p) => {
    element.style.left = p.x + 'px'; element.style.top = p.y + 'px';
  };
  function wake(duration = 1600) {
    awakeUntil = Math.max(awakeUntil, performance.now() + duration);
    if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw);
  }
  function settle() {
    for (let i = 0; i < 160; i++) stepCable(points, start, end, length, { width, height });
    points.forEach(p => { p.px = p.x; p.py = p.y; });
  }
  const ropeLength = goal => Math.hypot(goal.x - start.x, goal.y - start.y) + Math.min(width * .12, height * .15);
  function resize() {
    const rect = hero.getBoundingClientRect();
    width = rect.width; height = rect.height;
    start = { x: width * .105, y: height * .49 };
    target = { x: width * .885, y: height * .49 };
    rest = { x: width * .66, y: height * .73 };
    end = { ...(connected ? target : rest) };
    length = ropeLength(end);
    points = createCable(start, end, width < 600 ? 30 : 44);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    place(socket, target); place(hero.querySelector('.cable-source'), start); place(plug, end);
    colors(); settle(); wake();
  }
  function connect(value) {
    connected = value;
    hero.classList.toggle('is-connected', value);
    hero.dataset.connected = String(value);
    action.textContent = value ? text.disconnect : text.connect;
    action.setAttribute('aria-pressed', String(value));
    plug.setAttribute('aria-label', value ? text.unplug : text.plug);
    plug.setAttribute('aria-pressed', String(value));
    socket.setAttribute('aria-pressed', String(value));
    instruction.textContent = value ? text.active : text.idle;
    status.textContent = value ? text.on : text.off;
    length = ropeLength(value ? target : rest);
    if (reduced.matches) { end = { ...(value ? target : rest) }; settle(); }
    pulseStart = value && !reduced.matches ? performance.now() : null;
    wake(2400);
  }
  function path() {
    ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i++) {
      const a = points[i], b = points[i + 1];
      ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2);
    }
    ctx.lineTo(end.x, end.y);
  }
  function draw(now) {
    frame = 0;
    if (!visible || document.hidden) return;
    const dt = Math.min(now - (last || now), 50); last = now;
    accumulator += dt;
    if (!reduced.matches) {
      while (accumulator >= 1000 / 60) {
        if (!dragging) {
          const goal = connected ? target : rest;
          end.x += (goal.x - end.x) * .14; end.y += (goal.y - end.y) * .14;
        }
        stepCable(points, start, end, length, { width, height }, pointer);
        accumulator -= 1000 / 60;
      }
    } else { accumulator = 0; }
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const cableWidth = width < 600 ? 8 : 12;
    // A restrained physical material: a soft shadow, insulated core, and highlight.
    ctx.save(); ctx.translate(0, 7); path(); ctx.strokeStyle = '#00000012'; ctx.lineWidth = cableWidth + 5; ctx.stroke(); ctx.restore();
    path(); ctx.strokeStyle = accent; ctx.lineWidth = cableWidth; ctx.stroke();
    path(); ctx.strokeStyle = '#ffffff30'; ctx.lineWidth = 2; ctx.stroke();
    if (root.classList.contains('inspect')) {
      ctx.fillStyle = ink;
      points.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill(); });
    }
    if (pulseStart !== null) {
      const progress = (now - pulseStart) / 1500;
      if (progress <= 1) {
        const p = cablePoint(points, progress);
        ctx.beginPath(); ctx.arc(p.x, p.y, cableWidth * .7, 0, Math.PI * 2);
        ctx.fillStyle = bg; ctx.fill(); ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.stroke();
      } else pulseStart = null;
    }
    place(plug, end);
    hero.classList.toggle('near-socket', dragging && Math.hypot(end.x - target.x, end.y - target.y) < 80);
    if (!reduced.matches && (dragging || now < awakeUntil)) frame = requestAnimationFrame(draw);
  }
  function local(event) {
    const r = hero.getBoundingClientRect();
    return { x: Math.max(24, Math.min(width - 24, event.clientX - r.left)),
      y: Math.max(24, Math.min(height - 100, event.clientY - r.top)) };
  }
  plug.addEventListener('pointerdown', event => {
    if (event.button !== 0 || reduced.matches) return;
    down = local(event); moved = false; dragging = true; pointer = null;
    plug.setPointerCapture(event.pointerId); hero.classList.add('is-dragging'); wake();
  });
  plug.addEventListener('pointermove', event => {
    if (!dragging) return;
    const p = local(event);
    if (Math.hypot(p.x - down.x, p.y - down.y) > 5) moved = true;
    if (moved) end = p;
    wake();
  });
  plug.addEventListener('pointerup', event => {
    if (!dragging) return;
    dragging = false; hero.classList.remove('is-dragging');
    if (plug.hasPointerCapture(event.pointerId)) plug.releasePointerCapture(event.pointerId);
    if (moved) connect(Math.hypot(end.x - target.x, end.y - target.y) < 80);
    wake();
  });
  const cancel = () => {
    dragging = false; moved = false; pointer = null;
    hero.classList.remove('is-dragging'); wake();
  };
  plug.addEventListener('pointercancel', cancel);
  plug.addEventListener('lostpointercapture', () => { if (dragging) cancel(); });
  plug.addEventListener('click', event => {
    if (event.detail === 0 || !moved) connect(!connected);
    moved = false;
  });
  action.addEventListener('click', () => connect(!connected));
  socket.addEventListener('click', () => connect(!connected));
  hero.addEventListener('pointermove', event => {
    if (dragging || reduced.matches || event.pointerType !== 'mouse') return;
    // Affect only nearby rope segments, never the text or the visitor's scroll.
    pointer = local(event); wake(900);
  });
  hero.addEventListener('pointerleave', () => { pointer = null; wake(900); });
  hero.addEventListener('keydown', event => {
    if (event.key === 'Escape') { cancel(); connect(false); plug.focus(); }
  });
  reduced.addEventListener('change', () => { pulseStart = null; cancel(); resize(); });
  new ResizeObserver(resize).observe(hero);
  new MutationObserver(() => { colors(); wake(0); }).observe(root, {
    attributes: true, attributeFilter: ['data-theme', 'class'],
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    root.classList.toggle('hero-in-view', entry.intersectionRatio > .25);
    if (visible) { last = 0; wake(0); }
    else { cancelAnimationFrame(frame); frame = 0; }
  }, { threshold: [0, .25] }).observe(hero);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else { last = 0; wake(0); }
  });
  addEventListener('pagehide', () => { cancelAnimationFrame(frame); frame = 0; });
  addEventListener('pageshow', () => { last = 0; wake(0); });
  hero.classList.add('connection-ready');
  resize();
}
