// Small, deterministic 2D toy. Oriented bounding boxes, not font-outline collisions.
export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export function createBody(x, y, width, height, angle = 0) {
  return { x, y, width, height, angle, home: { x, y, angle }, vx: 0, vy: 0, spin: 0, held: false };
}

function axes(b) {
  const c = Math.cos(b.angle), s = Math.sin(b.angle);
  return [{ x: c, y: s }, { x: -s, y: c }];
}

// Separating-axis collision detection. The normal points from a towards b.
export function contact(a, b) {
  const aa = axes(a), ba = axes(b);
  let depth = Infinity, normal;
  for (const n of [...aa, ...ba]) {
    const radius = (body, ax) => Math.abs(n.x * ax[0].x + n.y * ax[0].y) * body.width / 2
      + Math.abs(n.x * ax[1].x + n.y * ax[1].y) * body.height / 2;
    const distance = (b.x - a.x) * n.x + (b.y - a.y) * n.y;
    const overlap = radius(a, aa) + radius(b, ba) - Math.abs(distance);
    if (overlap <= 0) return null;
    if (overlap < depth) {
      depth = overlap;
      const direction = distance < 0 ? -1 : 1;
      normal = { x: n.x * direction, y: n.y * direction };
    }
  }
  return { ...normal, depth };
}

export function contain(b, width, height) {
  const c = Math.abs(Math.cos(b.angle)), s = Math.abs(Math.sin(b.angle));
  const rx = Math.min(width / 2, (c * b.width + s * b.height) / 2);
  const ry = Math.min(height / 2, (s * b.width + c * b.height) / 2);
  if (b.x < rx || b.x > width - rx) { b.vx *= -.35; b.spin *= .65; }
  if (b.y < ry || b.y > height - ry) {
    b.vy *= -.25;
    b.vx *= .82;
    b.spin *= .68;
  }
  b.x = clamp(b.x, rx, width - rx);
  b.y = clamp(b.y, ry, height - ry);
}

// One fixed 1/60s step: independent of display refresh rate.
export function stepAssembly(bodies, width, height, mode) {
  for (const b of bodies) {
    if (b.held) continue;
    if (mode === 'built') {
      b.vx = (b.vx + (b.home.x - b.x) * .035) * .78;
      b.vy = (b.vy + (b.home.y - b.y) * .035) * .78;
      b.spin = (b.spin + (b.home.angle - b.angle) * .035) * .78;
    } else {
      b.vx *= .993;
      b.vy = Math.min(20, (b.vy + .28) * .993);
      b.spin *= .984;
    }
    b.x += b.vx; b.y += b.vy; b.angle += b.spin;
  }
  if (mode === 'built') return;
  for (let pass = 0; pass < 4; pass++) {
    for (let i = 0; i < bodies.length; i++) {
      const a = bodies[i];
      for (let j = i + 1; j < bodies.length; j++) {
        const b = bodies[j], hit = contact(a, b);
        if (!hit || (a.held && b.held)) continue;
        const wa = a.held ? 0 : 1, wb = b.held ? 0 : 1, sum = wa + wb;
        const correction = Math.max(0, hit.depth - .2) * .75 / sum;
        a.x -= hit.x * correction * wa; a.y -= hit.y * correction * wa;
        b.x += hit.x * correction * wb; b.y += hit.y * correction * wb;
        const speed = (b.vx - a.vx) * hit.x + (b.vy - a.vy) * hit.y;
        if (speed < 0) {
          const impulse = -1.22 * speed / sum;
          a.vx -= impulse * hit.x * wa; a.vy -= impulse * hit.y * wa;
          b.vx += impulse * hit.x * wb; b.vy += impulse * hit.y * wb;
          a.spin *= .93; b.spin *= .93;
        }
      }
    }
    bodies.forEach(b => { if (!b.held) contain(b, width, height); });
  }
}

export function scatter(bodies, width, height, still = false) {
  bodies.forEach((b, i) => {
    b.held = false;
    b.vx = Math.sin(i * 2.4 + 1) * 6;
    b.vy = -4 - (i % 3) * 2;
    b.spin = Math.sin(i * 1.7 + .4) * .035;
    if (still) {
      b.x = b.home.x + Math.sin(i * 2) * width * .035;
      b.y = b.home.y + Math.cos(i * 1.7) * height * .08;
      b.angle = b.home.angle + Math.sin(i * 2.1) * .18;
      b.vx = b.vy = b.spin = 0;
      contain(b, width, height);
    }
  });
}
