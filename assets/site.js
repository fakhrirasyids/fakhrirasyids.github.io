import { matchesProject, selectProjects, readFilters, filterQuery, projectPath } from './core.mjs';
import { initStudio } from './studio.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const root = document.documentElement;
const locale = root.lang;
const ui = JSON.parse($('#ui-data').textContent);
const storage = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* Storage is optional. */ } },
};

// Reveal only the enhancement controls after their module has successfully loaded.
root.classList.add('js');

const themeButton = $('.theme-toggle');
const themeMeta = $('meta[name="theme-color"]');
function setTheme(theme) {
  root.dataset.theme = theme;
  themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
  themeMeta.content = theme === 'dark' ? '#191917' : '#f1efe7';
}
setTheme(root.dataset.theme);
themeButton.addEventListener('click', () => {
  const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(theme);
  storage.set('frs-theme', theme);
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  if (!storage.get('frs-theme')) setTheme(event.matches ? 'dark' : 'light');
});

const inspectButton = $('.inspect-toggle');
function setInspect(active) {
  root.classList.toggle('inspect', active);
  inspectButton.setAttribute('aria-pressed', String(active));
}
setInspect(storage.get('frs-inspect') === 'true');
inspectButton.addEventListener('click', () => {
  const active = !root.classList.contains('inspect');
  setInspect(active);
  storage.set('frs-inspect', String(active));
});

const menu = $('.menu-toggle');
const navigation = $('#site-nav');
function closeMenu() {
  navigation.classList.remove('is-open');
  menu.setAttribute('aria-expanded', 'false');
}
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  navigation.classList.toggle('is-open', expanded);
});
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('click', event => {
  if (menu.getAttribute('aria-expanded') === 'true' && !event.target.closest('.site-header, dialog')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu(); menu.focus();
  }
});
matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);

initStudio();

let toastTimer;
function toast(message) {
  $('.toast').textContent = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $('.toast').textContent = ''; }, 3500);
}
$('.copy-email')?.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText('fakhrirasyids@gmail.com'); toast(ui.copied); }
  catch { toast(ui.copyfail); }
});

// Progressive enhancement: all 50 cards remain ordinary HTML links without JS.
const filtersForm = $('#project-filters');
if (filtersForm) {
  const grid = $('#project-grid');
  const count = $('#result-count');
  const more = $('#load-more');
  const empty = $('#empty-results');
  const input = $('#project-search');
  const platform = $('#platform-filter');
  const tech = $('#tech-filter');
  const sort = $('#sort-filter');
  const records = $$('#project-grid [data-project]').map(element => ({ ...JSON.parse(element.dataset.project), element }));
  let limit = 12;
  let timer;
  function currentFilters() { return { q: input.value.trim(), platform: platform.value, tech: tech.value, sort: sort.value }; }
  function render({ updateURL = true, focusNew = false } = {}) {
    const filters = currentFilters();
    const matching = selectProjects(records, filters, locale);
    const shown = matching.slice(0, limit);
    const visible = new Set(shown);
    records.forEach(record => { record.element.hidden = !visible.has(record); });
    // Move existing nodes, preserving link semantics and avoiding HTML injection.
    matching.forEach(record => grid.append(record.element));
    count.textContent = `${shown.length} ${ui.of} ${matching.length} ${ui.results}`;
    more.hidden = shown.length >= matching.length;
    empty.hidden = matching.length > 0;
    if (updateURL) {
      try { history.replaceState(null, '', location.pathname + filterQuery(filters) + location.hash); }
      catch { /* Local file previews may not permit URL updates. */ }
    }
    if (focusNew) shown[Math.max(0, limit - 12)]?.element.querySelector('a').focus();
  }
  function loadURL() {
    const values = readFilters(location.search, [...platform.options].map(o => o.value), [...tech.options].map(o => o.value));
    input.value = values.q; platform.value = values.platform; tech.value = values.tech; sort.value = values.sort;
    limit = 12; render({ updateURL: false });
  }
  function update() { limit = 12; render(); }
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(update, 120); });
  [platform, tech, sort].forEach(control => control.addEventListener('change', () => { clearTimeout(timer); update(); }));
  filtersForm.addEventListener('submit', event => { event.preventDefault(); clearTimeout(timer); update(); });
  filtersForm.addEventListener('reset', () => { clearTimeout(timer); setTimeout(update, 0); });
  more.addEventListener('click', () => { limit += 12; render({ focusNew: true }); });
  window.addEventListener('popstate', loadURL);
  loadURL();
}

// Native dialog supplies focus containment, Escape handling, and inert background.
const dialog = $('#search-dialog');
const commandInput = $('#command-search');
const commandResults = $('#command-results');
const commandStatus = $('#command-status');
let searchIndex;
let searchPromise;
let opener;
function renderSearch() {
  if (!searchIndex) return;
  const matches = searchIndex.filter(item => matchesProject(item, { q: commandInput.value }));
  commandResults.replaceChildren();
  for (const item of matches.slice(0, 8)) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    const title = document.createElement('span');
    const meta = document.createElement('small');
    const arrow = document.createElement('span');
    link.href = projectPath(item.slug, locale);
    title.textContent = item.name;
    meta.textContent = item.platforms.join(' / ');
    arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true');
    title.append(meta); link.append(title, arrow); li.append(link); commandResults.append(li);
  }
  commandStatus.textContent = matches.length ? `${Math.min(8, matches.length)} ${ui.of} ${matches.length} ${ui.results}` : ui.empty;
}
async function openSearch(trigger) {
  if (typeof dialog.showModal !== 'function') {
    location.href = (locale === 'en' ? '' : '/' + locale) + '/projects/'; return;
  }
  opener = trigger;
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('modal-open');
  commandInput.focus();
  if (searchIndex) { renderSearch(); return; }
  commandStatus.textContent = ui.loading;
  try {
    searchPromise ??= fetch('/assets/project-index.json', { signal: AbortSignal.timeout(10000) })
      .then(response => { if (!response.ok) throw new Error('Search index unavailable'); return response.json(); });
    const data = await searchPromise;
    searchIndex = data.map(item => ({ ...item, description: item.descriptions[locale] || item.descriptions.en }));
    renderSearch();
  } catch {
    commandStatus.textContent = ui.searcherror;
    searchPromise = null;
  }
}
$$('.search-open').forEach(button => button.addEventListener('click', () => openSearch(button)));
$('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('keydown', event => {
  // Search inputs can consume Escape to clear text before the dialog sees it.
  if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); dialog.close(); }
});
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); opener?.focus(); });
commandInput.addEventListener('input', renderSearch);
commandInput.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown') { event.preventDefault(); commandResults.querySelector('a')?.focus(); }
  if (event.key === 'Enter' && commandResults.querySelector('a')) { event.preventDefault(); commandResults.querySelector('a').click(); }
});
commandResults.addEventListener('keydown', event => {
  const links = [...commandResults.querySelectorAll('a')];
  const index = links.indexOf(document.activeElement);
  if (event.key === 'ArrowDown') { event.preventDefault(); links[Math.min(index + 1, links.length - 1)]?.focus(); }
  if (event.key === 'ArrowUp') { event.preventDefault(); (links[index - 1] || commandInput).focus(); }
});
document.addEventListener('keydown', event => {
  const editing = event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]');
  if (event.key === '/' && !editing && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
    if ($('#project-search')) $('#project-search').focus();
    else openSearch(document.activeElement);
  }
});
