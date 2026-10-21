import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCable, stepCable, cablePoint } from '../assets/cable.mjs';

test('rope remains bounded with fixed endpoints under repeated pointer forces', () => {
  for (const width of [320, 768, 1440]) {
    const bounds = { width, height: 720 };
    const start = { x: width * .105, y: 350 };
    const end = { x: width * .885, y: 350 };
    const rope = createCable(start, end);
    for (let frame = 0; frame < 300; frame++) {
      stepCable(rope, start, end, width * .88, bounds, { x: width / 2, y: 500 });
      assert.ok(rope.every(p => Number.isFinite(p.x) && Number.isFinite(p.y)));
    }
    assert.equal(rope[0].x, start.x); assert.equal(rope[0].y, start.y);
    assert.equal(rope.at(-1).x, end.x); assert.equal(rope.at(-1).y, end.y);
    assert.ok(rope.every(p => p.x >= 0 && p.x <= width && p.y >= 0 && p.y <= bounds.height));
  }
});

test('signal interpolation covers both ends and clamps out-of-range inputs', () => {
  const a = { x: 20, y: 30 }, b = { x: 300, y: 150 };
  const rope = createCable(a, b);
  assert.deepEqual(cablePoint(rope, -1), a);
  const last = cablePoint(rope, 2);
  assert.ok(Math.abs(last.x - b.x) < .001 && Math.abs(last.y - b.y) < .001);
  assert.ok(Object.values(cablePoint(rope, .5)).every(Number.isFinite));
});
