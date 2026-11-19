import test from 'node:test';
import assert from 'node:assert/strict';
import { createBody, contact, contain, stepAssembly, scatter } from '../assets/assembly-physics.mjs';

test('separating-axis detection handles separated, overlapping and rotated rectangles', () => {
  const a = createBody(100, 100, 60, 100);
  assert.equal(contact(a, createBody(300, 100, 60, 100)), null);
  assert.ok(contact(a, createBody(130, 100, 60, 100)).depth > 0);
  assert.ok(contact(a, createBody(130, 100, 60, 100, Math.PI / 4)).depth > 0);
  assert.equal(contact(a, createBody(160, 100, 60, 100)), null);
});

test('containment accounts for rotation at each boundary', () => {
  const b = createBody(-100, 500, 60, 80, Math.PI / 4);
  contain(b, 320, 400);
  const extent = (60 + 80) / 2 / Math.sqrt(2);
  assert.ok(b.x >= extent - .001);
  assert.ok(b.y <= 400 - extent + .001);
});

test('rebuild springs converge to original positions and angles', () => {
  const b = createBody(100, 100, 40, 50, .14);
  b.x = 260; b.y = 360; b.angle = 2;
  for (let i = 0; i < 180; i++) stepAssembly([b], 400, 500, 'built');
  assert.ok(Math.abs(b.x - 100) < .01);
  assert.ok(Math.abs(b.y - 100) < .01);
  assert.ok(Math.abs(b.angle - .14) < .001);
});

test('held body does not integrate, collide out of place, or spring home', () => {
  const a = createBody(100, 100, 40, 50), b = createBody(100, 110, 40, 50);
  a.held = true;
  for (let i = 0; i < 30; i++) stepAssembly([a, b], 400, 500, 'loose');
  assert.equal(a.x, 100); assert.equal(a.y, 100);
  assert.ok(b.y > a.y);
});

test('13 pieces stay finite and bounded through repeated scatter cycles at mobile and desktop sizes', () => {
  for (const width of [280, 720, 1320]) {
    const height = 450;
    const bodies = Array.from({ length: 13 }, (_, i) => createBody(30 + (i % 6) * (width - 60) / 6, 80 + Math.floor(i / 6) * 100, width / 9, 80));
    for (let cycle = 0; cycle < 3; cycle++) {
      scatter(bodies, width, height);
      for (let i = 0; i < 360; i++) stepAssembly(bodies, width, height, 'loose');
      for (const b of bodies) {
        assert.ok([b.x, b.y, b.angle, b.vx, b.vy].every(Number.isFinite));
        assert.ok(b.x >= 0 && b.x <= width && b.y >= 0 && b.y <= height);
      }
    }
  }
});

test('reduced-motion scatter is deterministic, contained and has zero velocity', () => {
  const make = () => Array.from({ length: 13 }, (_, i) => createBody(30 + i * 20, 150, 25, 60));
  const a = make(), b = make();
  scatter(a, 320, 450, true); scatter(b, 320, 450, true);
  assert.deepEqual(a, b);
  a.forEach(body => {
    assert.equal(body.vx, 0); assert.equal(body.vy, 0); assert.equal(body.spin, 0);
    assert.ok(body.x >= 0 && body.x <= 320);
  });
});
