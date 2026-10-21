// Position-based rope: fixed endpoints, Verlet integration, distance constraints.
// Coordinates are CSS pixels. This is an interactive illustration, not telemetry.
export function createCable(start, end, count = 36) {
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const x = start.x + (end.x - start.x) * t;
    const y = start.y + (end.y - start.y) * t + Math.sin(t * Math.PI) * 90;
    return { x, y, px: x, py: y };
  });
}

export function stepCable(points, start, end, length, bounds, pointer = null) {
  const segment = Math.max(length, Math.hypot(end.x - start.x, end.y - start.y) * 1.01) / (points.length - 1);
  let movement = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i];
    const vx = (p.x - p.px) * .91;
    const vy = (p.y - p.py) * .91;
    p.px = p.x; p.py = p.y;
    p.x += vx; p.y += vy + .34;
    if (pointer) {
      const dx = p.x - pointer.x, dy = p.y - pointer.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 80 && distance > .01) {
        const force = (1 - distance / 80) * 3;
        p.x += dx / distance * force; p.y += dy / distance * force;
      }
    }
    movement += Math.abs(vx) + Math.abs(vy);
  }
  for (let pass = 0; pass < 14; pass++) {
    Object.assign(points[0], start);
    Object.assign(points.at(-1), end);
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i], b = points[i + 1];
      const dx = b.x - a.x, dy = b.y - a.y;
      const distance = Math.hypot(dx, dy) || 1;
      const correction = (distance - segment) / distance;
      const shareA = i === 0 ? 0 : i === points.length - 2 ? 1 : .5;
      const shareB = i === points.length - 2 ? 0 : i === 0 ? 1 : .5;
      a.x += dx * correction * shareA; a.y += dy * correction * shareA;
      b.x -= dx * correction * shareB; b.y -= dy * correction * shareB;
    }
    for (let i = 1; i < points.length - 1; i++) {
      points[i].x = Math.max(12, Math.min(bounds.width - 12, points[i].x));
      points[i].y = Math.max(12, Math.min(bounds.height - 76, points[i].y));
    }
  }
  Object.assign(points[0], start);
  Object.assign(points.at(-1), end);
  return movement / points.length;
}

export function cablePoint(points, progress) {
  const index = Math.max(0, Math.min(1, progress)) * (points.length - 1);
  const i = Math.min(points.length - 2, Math.floor(index));
  const t = index - i;
  return { x: points[i].x + (points[i + 1].x - points[i].x) * t,
    y: points[i].y + (points[i + 1].y - points[i].y) * t };
}
