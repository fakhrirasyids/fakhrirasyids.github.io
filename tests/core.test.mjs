import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { normalize, matchesProject, selectProjects, readFilters, filterQuery, projectPath } from '../assets/core.mjs';

const projects = JSON.parse(readFileSync(new URL('../data/projects.json', import.meta.url))).map((p, index) => ({ ...p, index }));
const english = JSON.parse(readFileSync(new URL('../data/locales/en.json', import.meta.url)));
projects.forEach(p => { p.description = english.projects.items[p.i18nKey.split('.').at(-1)]; });

test('all fifty records are available without any filter', () => {
  assert.equal(selectProjects(projects, {}).length, 50);
});
test('search finds hardware capability in a project description', () => {
  const result = selectProjects(projects, { q: 'DICOM offline' });
  assert.ok(result.some(p => p.id === 'fmv-xray'));
  assert.ok(!result.some(p => p.id === 'teddy-project'));
});
test('multiple search words, platform and technology are intersected', () => {
  const result = selectProjects(projects, { q: 'pcr', platform: 'Desktop', tech: 'Kotlin Multiplatform' });
  assert.deepEqual(result.map(p => p.id), ['fmv-pcr-multiplatform']);
});
test('filters distinguish exact platform and technology names', () => {
  assert.ok(!matchesProject(projects[0], { tech: 'Kotlin' }));
  assert.ok(matchesProject(projects[0], { tech: 'Kotlin Multiplatform', platform: 'iOS' }));
});
test('case, whitespace and diacritics are normalized', () => {
  assert.equal(normalize('  Café  '), 'cafe');
  assert.ok(matchesProject(projects[0], { q: '  DIGIHEALTH   kiosk ' }));
});
test('Chinese descriptions remain searchable', () => {
  const zh = JSON.parse(readFileSync(new URL('../data/locales/zh.json', import.meta.url)));
  const project = { ...projects[1], description: zh.projects.items.xray_project };
  assert.ok(matchesProject(project, { q: '校准' }));
});
test('sorting never mutates the source inventory', () => {
  const before = projects.map(p => p.id);
  const result = selectProjects(projects, { sort: 'name' });
  assert.equal(result[0].name, '8xray App');
  assert.deepEqual(projects.map(p => p.id), before);
  assert.deepEqual(selectProjects(projects, {}).map(p => p.id), before);
});
test('unknown filters are rejected and query length is bounded', () => {
  const filters = readFilters('?platform=Fake&tech=Fake&sort=evil&q=' + 'a'.repeat(400), ['Android'], ['Kotlin']);
  assert.equal(filters.platform, ''); assert.equal(filters.tech, ''); assert.equal(filters.sort, 'original'); assert.equal(filters.q.length, 200);
});
test('shareable filter URLs round-trip Unicode and reserved characters', () => {
  const input = { q: '医疗 & USB', platform: 'iOS', tech: 'Kotlin Multiplatform', sort: 'name' };
  assert.deepEqual(readFilters(filterQuery(input), ['iOS'], ['Kotlin Multiplatform']), input);
  assert.equal(filterQuery({ q: '', platform: '', tech: '', sort: 'original' }), '');
});
test('zero results and special characters do not throw or become markup', () => {
  assert.deepEqual(selectProjects(projects, { q: '<script>alert(1)</script>' }), []);
  assert.deepEqual(selectProjects(projects, { q: 'no such project xyz123' }), []);
});
test('project paths preserve locale and encode unsafe characters', () => {
  assert.equal(projectPath('8xray-app', 'zh'), '/zh/projects/8xray-app/');
  assert.equal(projectPath('8xray-app', 'en'), '/projects/8xray-app/');
  assert.equal(projectPath('x/y', '../'), '/projects/x%2Fy/');
});
test('theme bootstrap survives blocked browser storage', () => {
  const document = { documentElement: { dataset: { theme: 'light' } } };
  vm.runInNewContext(readFileSync(new URL('../assets/theme.js', import.meta.url), 'utf8'), {
    document, localStorage: { getItem() { throw new Error('Storage blocked'); } },
  });
  assert.equal(document.documentElement.dataset.theme, 'light');
});
test('stored theme takes precedence over OS theme', () => {
  const document = { documentElement: { dataset: { theme: 'light' } } };
  vm.runInNewContext(readFileSync(new URL('../assets/theme.js', import.meta.url), 'utf8'), {
    document, localStorage: { getItem() { return 'dark'; } }, matchMedia() { return { matches: false }; },
  });
  assert.equal(document.documentElement.dataset.theme, 'dark');
});
