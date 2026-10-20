# Refactor verification — 20 October 2026

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
