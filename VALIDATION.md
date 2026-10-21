# Connection hero verification — 21 October 2026

Implemented locally on `dev`, continuing the previous uncommitted redesign.
No deployment, commit, or push was performed.

## Passed

- 15 Node tests: 13 existing search/filter/theme tests plus cable constraint
  stability at mobile/tablet/desktop widths and signal interpolation boundaries.
- Static integrity: 163 HTML pages, 150 localized project pages, all 50 project
  records and original project links, and 162 sitemap entries.
- Chromium: actual plug drag into socket; click and keyboard connection/reset;
  Escape reset; cable stops rendering after settling; menu; both themes;
  search dialog Escape and focus return; Inspect; archive search, load more,
  empty state/reset, and detail navigation.
- 35 responsive route/viewport checks: three homepages, archive, experience,
  writing, and a project detail at 320, 390, 768, 1024, and 1440 CSS pixels.
  No horizontal page overflow found.
- Touch-emulated connect/disconnect and direct project-section navigation.
- Reduced motion produces static art and working connection controls.
- JavaScript-disabled homepage content/navigation remains visible without
  horizontal overflow, and all 50 archive projects remain available.
- No JavaScript runtime errors during the browser regression run.
- Visual review of desktop and mobile hero, connected state, dark menu, plus
  the retained gallery/detail layouts reviewed during the previous iteration.
- Contrast checks for actual theme tokens, JavaScript syntax, asset budgets,
  and `git diff --check`. Token checks are not a full accessibility audit.

The search Escape handler now stops propagation: closing a search dialog opened
from the menu restores focus to search, without simultaneously hiding the menu.

The in-app browser failed during connection setup. Browser verification used
the already installed standalone Chromium/Playwright tooling. No dependencies
were installed. Tests are in `tests/browser_qa.py`.

## Payload and verification limits

Approximate local gzip sizes: 11.7 KB CSS across base/studio/hero, and 9.6 KB JS
including site behavior, shared enhancements, hero controller, cable simulation,
core filters, and theme startup. Images are separate. These are payload
measurements, not Lighthouse or Core Web Vitals scores.

All original project images, portraits, and CV files remain untouched. The
favicon and social preview reflect the redesigned identity. Existing untracked
`dist/` and `node_modules/` directories were not modified.

Safari, Firefox, physical-device performance, screen-reader testing, Lighthouse,
and live hosting/redirect checks remain unverified. Shared-image transitions
remain progressive enhancement; normal links do not depend on them.

## Historical refactor verification — 20 October 2026

The report below describes the prior implementation and its checks at that time.

## Scope

Starting commit: `b3d3376dc6da9d2f1133608cc07ddda38bbe5368` on `dev`.
`stable/v2` preserves that checkpoint. No production update or deployment is
part of this change.

## Passed

- JavaScript syntax checks for the UI, core functions, and theme loader.
- 13 Node tests: actual project search, combined filters, sorting, Chinese
  search, query round-trips, invalid filters, empty results, unsafe query
  characters, locale paths, and blocked-storage theme behavior.
- All 163 HTML documents parsed: 162 canonical pages plus the 404 page.
- All 150 project detail pages retain localized descriptions, original project
  names, and every supplied external project link.
- Each language archive includes all 50 projects in delivered HTML.
- Local links, assets/srcsets, fragments, label targets, ARIA references, and
  unique IDs resolve.
- Each page has one H1, a language, main landmark, canonical, description,
  viewport, and parseable embedded JSON.
- All 162 sitemap entries resolve to actual pages.
- Text color token pairs meet at least 4.5:1 contrast. This is a token check,
  not a complete rendered accessibility audit.
- Reduced-motion rules, visible focus styles, native dialog semantics, image
  dimensions, lazy loading, and no-JavaScript content are implemented.
- `git diff --check` passes.

## Payload observations

Local gzip measurements, not a network performance audit:

| Resource | Approximate gzip size |
| --- | ---: |
| Shared CSS | 6.6 KB |
| UI JavaScript | 3.3 KB |
| Core JavaScript | 0.9 KB |
| Theme loader | 0.3 KB |
| Homepage HTML | 6.7 KB |

The optional search index loads only on opening search. Fonts are system fonts.
All visual assets are first-party files. Thumbnails are resized WebP variants;
original project media, portraits, icons, logos, and CV are preserved byte-for-byte.

## Not verified here

The approved browser-control capability is unavailable in this workspace.
There is no claimed rendered desktop/mobile QA, measured Core Web Vitals,
Lighthouse score, screen-reader test, or live Vercel deployment test.

Before production approval, review in Chrome, Firefox, Safari, and a mobile
browser at 320, 390, 768, and 1440 CSS pixels. Check both themes, navigation,
overflow, system buttons, filters/reset/load more, Inspect mode, language
links, search focus return/Escape, and reduced motion. Check 200% text zoom,
JavaScript disabled, and storage blocked. Run an accessibility audit and
Lighthouse on an approved preview. Verify aliases, CV, actual 404 responses,
and Vercel static build settings on the host.

## Content and behavior notes

- Experience dates and claims come from the existing portfolio; they were not
  revised from conversation memory or inferred as new achievements.
- The old article page used a third-party RSS-to-JSON API. This version retains
  the three known article links and complete Medium profile, without auto-fetching
  a changing feed.
- External links were retained without accessing other repositories. The source
  assigns the SpaceAttack GitHub URL to Stasave; it was preserved instead of
  guessing a replacement repository.
- Inspect mode annotates public metadata; it does not reveal private source.
- Original media and CV URLs remain `/assets/...` after moving files out of the
  framework-specific `public/` directory.
- Automatic deployments from `dev` are disabled in the new Vercel configuration
  pending explicit preview or production approval.
