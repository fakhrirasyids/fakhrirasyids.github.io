# FRS / SIGNAL LAB

Fakhri Rasyid Saputro's portfolio, implemented as plain HTML, CSS, and JavaScript.
No frameworks, npm dependencies, installation commands, build steps, or remote
fonts/CDNs. Serve the repository root with any static host.

## Branches

- `stable/v2`: previous Vue portfolio at `b3d3376dc6da9d2f1133608cc07ddda38bbe5368`.
- `dev`: this refactor and subsequent development.
- `main`: existing production branch; unchanged by this refactor.

`vercel.json` disables automatic deployments from `dev` and `stable/v2`.
Production merge and deployment require the owner's approval. To review in a
Vercel preview later, authorize deployment and enable `dev` in that setting.
Do not move the production branch to `dev`.

## Run locally

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`. This convenience server is not a build step or
application dependency; any static HTTP server works. Direct `file://` opening
does not provide the origin needed for module scripts and root-relative URLs.

## Experience

- Full-screen connection hero: a physical cable you can drag into a socket,
  pluck with the pointer, or connect by click, touch, or keyboard. The name fills
  when connected; the simulation settles to idle and respects reduced motion.
- Editorial art direction, staggered selected-work gallery, scroll reveals, and
  shared-image page transitions in supporting browsers. See `DESIGN.md` for research.
- Minimal opening with direct selected-work access and a compact navigation menu.
- All 50 projects: search, platform/technology filters, sorting, shareable query
  URLs, and progressive loading.
- Inspect mode: public project IDs, platforms, and recorded technologies.
- English, Indonesian, and Chinese: separate, crawlable HTML pages, including
  all 50 projects, five experience entries, and the homepage.
- Original CV, contact details, images, and supplied project links preserved.
- Three Medium articles recorded in the source, plus the complete Medium profile.
- Keyboard search: use the search button or `/`; on the archive `/` focuses its
  search field. In the dialog use Tab/arrows, Enter, and Escape.
- Light/dark theme and Inspect preferences use local storage when available.
- All core content, navigation, CV, language links, and contact actions work
  without JavaScript. Enhancement controls appear only after their module loads.

## Files and editing

| Path | Purpose |
| --- | --- |
| `index.html` | English homepage |
| `projects/index.html` | Complete project archive |
| `projects/<project-name-slug>/index.html` | Static project detail pages |
| `experience/`, `articles/` | Experience and writing |
| `id/`, `zh/` | Equivalent localized pages |
| `assets/site.css` | Shared styles, themes, breakpoints, reduced motion |
| `assets/site.js` | Progressive enhancement and events |
| `assets/studio.css`, `assets/studio.js` | Editorial design and interaction enhancement |
| `assets/connection.css`, `assets/connection.js` | Full-screen hero and input handling |
| `assets/cable.mjs` | Position-based cable physics and signal interpolation |
| `assets/core.mjs` | Search, filter, sorting, URL functions |
| `assets/theme.js` | Small before-paint theme preference loader |
| `assets/project-index.json` | Search index, fetched only when search opens |
| `assets/thumbs/` | Optimized WebP thumbnails |
| `assets/porto/`, `assets/me/`, `assets/icons/`, `assets/logo/` | Original assets |
| `data/projects.json`, `data/locales/` | Retained original content inventory |
| `sitemap.xml`, `robots.txt` | Discovery of the 162 canonical pages |
| `vercel.json` | Static-host settings, legacy redirects, headers |
| `404.html` | Missing-page fallback |
| `tests/` | Optional Node/Python standard-library checks |

HTML is the served source. Edit it directly. The retained `data/` files are an
audit/reference inventory: changing them alone does not update pages. When
editing a project, update its three language pages, archive cards,
featured/related cards where present, and the search index. When adding or
renaming routes, update the sitemap, language links, and redirects. Shared
layout edits must be applied across HTML pages. This deliberate duplication
keeps hosting and deployment completely buildless.

## Hosting and SEO

Canonical URLs use `https://fakhrirasyids.freelanxx.com`. Content pages have
individual titles, descriptions, canonicals, language alternates, social
metadata, and structured data. Real directory URLs replace the SPA catch-all
rewrite, so missing pages can return 404. Existing name-slug routes remain
canonical. Vercel redirects retain ID-based project URLs and `/project/` and
`/work/` aliases, including locale prefixes.

On another host, port the redirects and serve `404.html` with status 404.
Python's basic server does not implement Vercel redirects. GitHub Pages serves
canonical directories but needs host-specific handling for legacy aliases.
Vercel remains the intended production host.

Vercel is configured with framework `null` (Other), empty install/build commands,
and output directory `.`. These override the old Vue preset and `dist` output.
Headers include `nosniff`, a referrer policy, frame protection, and disabled
unused device permissions. Unversioned assets use a one-hour revalidated cache
instead of year-long immutable caching.

No analytics, cookies, service worker, API keys, backend, or form service is
needed. Contact actions open the user's mail/phone handler. External links
are preserved as supplied; their availability is not guaranteed.

## Verification

```sh
node --test tests/core.test.mjs tests/cable.test.mjs
python3 tests/validate.py
node --check assets/site.js
git diff --check
```

These checks cover content retention, local resources, routes, metadata, ARIA
references, color token contrast, size budgets, filters, query parsing, and
storage-denied theme startup. They do not substitute for browser, device,
screen-reader, or Lighthouse QA. See `VALIDATION.md` for verification limits.

Optional browser regression checks use an existing Python Playwright installation:
start the static server on port 8001, then run `python3 tests/browser_qa.py`.
Playwright is a development-only test tool, not an application dependency.
