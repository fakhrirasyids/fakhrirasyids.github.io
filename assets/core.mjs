/** Shared, DOM-free behavior; also exercised by the dependency-free test suite. */
export function normalize(value) {
  return String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();
}

export function matchesProject(project, { q = '', platform = '', tech = '' } = {}) {
  if (platform && !project.platforms.includes(platform)) return false;
  if (tech && !project.technologies.includes(tech)) return false;
  const haystack = normalize([project.name, project.description || '', ...project.platforms, ...project.technologies].join(' '));
  return normalize(q).split(/\s+/).filter(Boolean).every(word => haystack.includes(word));
}

export function selectProjects(projects, filters, locale = 'en') {
  const result = projects.filter(project => matchesProject(project, filters));
  return result.sort(filters.sort === 'name'
    ? (a, b) => a.name.localeCompare(b.name, locale)
    : (a, b) => a.index - b.index);
}

export function readFilters(search, platforms, technologies) {
  const params = new URLSearchParams(search);
  return {
    q: (params.get('q') || '').slice(0, 200),
    platform: platforms.includes(params.get('platform')) ? params.get('platform') : '',
    tech: technologies.includes(params.get('tech')) ? params.get('tech') : '',
    sort: params.get('sort') === 'name' ? 'name' : 'original',
  };
}

export function filterQuery(filters) {
  const params = new URLSearchParams();
  for (const key of ['q', 'platform', 'tech', 'sort']) {
    if (filters[key] && !(key === 'sort' && filters[key] === 'original')) params.set(key, filters[key]);
  }
  const query = params.toString();
  return query ? '?' + query : '';
}

export function projectPath(slug, locale = 'en') {
  const prefix = ['id', 'zh'].includes(locale) ? '/' + locale : '';
  return prefix + '/projects/' + encodeURIComponent(slug) + '/';
}
