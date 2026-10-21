# SIGNAL LAB — Make a connection

Iteration: 21 October 2026. The opening is now one full-screen interaction,
built around Fakhri's work connecting physical devices and digital interfaces.

## Research and interpretation

- [Stefan Vitasović's portfolio case study](https://tympanus.net/codrops/2025/03/05/case-study-stefan-vitasovic-portfolio-2025/)
  describes typography, negative space, and a recurring motion motif as the
  basis for a distinctive experience. Applied here: let the name and connection
  act as one composition, rather than adding a separate dashboard next to a bio.
- [Bruno Simon](https://bruno-simon.com/) makes exploration a central activity.
  Applied here: give the visitor one tangible action with a visible consequence.
  No source code, assets, or driving mechanic were copied.
- [Dennis Snellenberg](https://dennissnellenberg.com/) establishes personal
  identity through oversized type and a strong first composition.
- [Rauno Freiberg](https://rauno.me/) makes interaction craft part of the work
  itself. Applied here: pointer capture, rope constraints, keyboard parity,
  touch handling, focus restoration, and the idle state all matter.
- [W3C dragging guidance](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)
  calls for an alternative to dragging. The plug, socket, and text button all
  offer a click/tap action; native buttons also provide keyboard access.
- [W3C motion guidance](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
  informed the choice to have no endless ambient animation. The opening starts
  with a settled cable; interaction feedback ends after a short settling period.

These are design interpretations of the references, not claims to match their
production scope. Joshua's World was inaccessible; Aristide Benoist's captured
page stayed in its loader. Neither was used as evidence for detailed behavior.

## Composition

The hero occupies the viewport below a quiet header. It contains Fakhri's name,
one short connection phrase, the professional role, and direct work access.
The second line of the name begins outlined and becomes solid when connected.

A vermilion cable hangs between the left source and a loose plug. The socket
sits opposite. Moving near the cable perturbs its shape; dragging the plug lets
the visitor complete the circuit. A short pulse travels along the connected
cable. Click/tap and keyboard activation do the same. Escape resets it.

The interaction is an illustration of connection, not actual medical telemetry,
an electrical circuit simulator, or a prerequisite for viewing projects.
No sound, microphone, onboarding modal, scroll interception, or external service.

The previous introduction paragraph, portrait badge, sculpture, discipline tabs,
tuning slider, and instrument readouts have been removed from the hero. The
original portfolio content remains available below and on its existing pages.
Navigation settings sit inside a compact menu. The Inspect bar appears after
leaving the hero, keeping the first view uncluttered.

## Engineering

- Original Verlet integration and distance constraints in `assets/cable.mjs`.
- Fixed 60 Hz simulation steps, bounded elapsed time, capped 2× pixel density.
- Fewer rope points on small screens; no continuous frame loop when idle,
  offscreen, or in a background tab.
- Pointer capture only on the plug. The rest of the page retains native scrolling.
- Cancellation/lost-capture handling, resize recovery, and browser back/forward
  lifecycle handling.
- Reduced-motion mode uses an immediately updated static cable. Core controls
  and project links remain operable.
- The decorative canvas is hidden from assistive technology. Native buttons
  expose connection state, and a polite status announces connection/reset.
- JavaScript-disabled pages retain the full name, role, project link, navigation,
  CV, and original content.
- English, Indonesian, and Chinese homepages share the new hero.

Shared gallery, project-detail, about, and writing styles retain the prior
editorial direction. `assets/connection.css` is loaded only by the homepages.
The site remains plain HTML, CSS, and JavaScript without a build or runtime
dependencies. This revision is local to `dev`; production deployment is unchanged.
