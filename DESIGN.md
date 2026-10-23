# Pulse Interface System — “Instrument”

Pulse is delivery infrastructure. The interface should feel like a precision
instrument: quiet on the surface, exact underneath. This document is the
source of truth for the public site and the operations console.

## 1. Principles

1. **Signal over decoration.** One accent colour marks what matters. Everything
   else is ink, paper and hairlines.
2. **Editorial over dashboard-generic.** Strong display typography, asymmetric
   grids and generous whitespace carry the hierarchy. Cards are not the default
   container.
3. **Structure is visible.** Rules, dividers and alignment do the work that
   shadows and glow usually do.
4. **Density with air.** Operational data can be compact, but each region gets
   enough margin to read as a deliberate object.
5. **Honest interface.** Never claim live health, traffic or activity that the
   client cannot verify. Sample data is always labelled **Sample**.
6. **Motion explains, never performs.** Short fades and line draws only. Nothing
   loops or pulses unless it represents real, live activity.

## 2. Colour

Light editorial surfaces, ink typography, a single vermilion signal.

| Token                   | Value     | Role                                          |
| ----------------------- | --------- | --------------------------------------------- |
| `--color-canvas`        | `#f6f7f4` | Page background; warm porcelain               |
| `--color-surface`       | `#ffffff` | Panels, inputs, raised surfaces               |
| `--color-surface-2`     | `#eef0ea` | Hover fills, secondary surfaces               |
| `--color-ink`           | `#171816` | Primary text and dark panels                  |
| `--color-ink-2`         | `#2a2b27` | Hover on ink elements                         |
| `--color-muted`         | `#62655f` | Body copy, secondary labels                   |
| `--color-faint`         | `#6c6f67` | Micro-labels, timestamps (still AA on canvas) |
| `--color-line`          | `#e2e4de` | Default hairline                              |
| `--color-line-strong`   | `#cfd2ca` | Emphasised rule, control borders              |
| `--color-accent`        | `#d94a2b` | Signal: marks, data lines, selected states    |
| `--color-accent-ink`    | `#b23a1f` | Accent text and filled accent buttons         |
| `--color-accent-bright` | `#ff7a5c` | Accent text on ink panels                     |
| `--color-accent-soft`   | `#fbeee9` | Selected-row wash                             |
| `--color-ok`            | `#1f7a4d` | Sent, healthy                                 |
| `--color-warn`          | `#9a6700` | Queued, retrying                              |
| `--color-err`           | `#b42318` | Failed                                        |
| `--color-email`         | `#3f6f8f` | Email channel                                 |
| `--color-sms`           | `#9a6b2f` | SMS channel                                   |
| `--color-push`          | `#d94a2b` | Push channel                                  |

**Rules**

- Accent is a signal, not a theme. Most views use it once or twice.
- Use `accent-ink` for small accent text on light surfaces. Use
  `accent-bright` for small accent text on ink surfaces.
- Dark panels (`bg-ink`) are reserved for code, request traces, delivery
  contracts and other machine output. They are not a general-purpose card.
- Status colour appears in the dot and the label, never as a large fill.

## 3. Typography

| Face                                     | Use                                                |
| ---------------------------------------- | -------------------------------------------------- |
| **Bricolage Grotesque** (`font-display`) | Headlines, metrics, plan prices                    |
| **Hanken Grotesk** (`font-sans`)         | Body, controls, navigation                         |
| **JetBrains Mono** (`font-mono`)         | IDs, code, timestamps, micro-labels, table headers |

**Scale**

- Hero display: `4rem–5.8rem`, weight 600, tracking `-0.055em`, line-height
  `0.93–0.98`.
- Page title: `2.6rem` mobile / `3.2rem` desktop, weight 600.
- Section title: `2rem–3rem`, weight 600, tracking `-0.045em`.
- Body: 13–16px, line-height 1.6.
- Micro-label: 10px mono, uppercase, tracking `0.1em–0.12em`.
- Table header: 10px mono uppercase, tracking `0.1em`.
- Numeric readouts use `tabular-nums`.

Use sentence case for headings and body. Uppercase mono is reserved for
labels, eyebrow text, table headers and machine data.

## 4. Layout

- Public site: max width `1280px`, gutters `20px` mobile / `32px` desktop.
- Console: fixed `248px` sidebar on `lg+`; content max width `1320px` with
  `16–32px` gutters. Mobile uses a drawer triggered from the header.
- 8px spacing rhythm. Section padding is generous: `80–112px` public,
  `28–40px` console pages.
- Panels use `12px` (`rounded-xl`) or `16px` (`rounded-2xl`) radii. Controls use
  `8px` (`rounded-lg`). Avoid pill-shaped containers except status badges and
  compact controls.
- Borders are `1px`. Prefer a rule or a divider over a shadow.
- Tables are horizontally compact, not cramped: hide non-essential columns on
  small screens and let the detail panel carry the rest.

## 5. Components

### Buttons

- Height `44px` default, `36px` compact.
- Primary: ink fill, white text. Hover: `ink-2`.
- Secondary: white fill, hairline border. Hover: `surface-2`.
- Accent: `accent-ink` fill, white text. Used once per view at most.
- Ghost: text only, hover wash.
- Always pair an icon with a label unless the control has an `aria-label`.

### Inputs

- Height `44px`, white fill, hairline border, `8px` radius.
- Focus uses a visible accent outline with a `3px` offset. Never remove the
  focus ring.
- Labels sit above the field; hints and units sit to the right in 10–11px mono.
- Destructive or irreversible actions are never adjacent to primary actions.

### Panels

- Light panel: `surface`, hairline border, `16px` radius.
- Ink panel: `ink`, white text, `16px` radius. Use for code and traces.
- Section headers use `14–15px` semibold titles with optional 11px muted
  descriptions.

### Badges and labels

- Badge: 10px mono uppercase, hairline border, canvas fill.
- Sample/example badges are mandatory whenever illustrative data is shown.
- Status dots are 6px; the label carries the meaning, not the dot alone.

### Tables

- Header: 10px mono uppercase, faint, hairline bottom rule.
- Row: 12px, `py-3`, hairline separator, hover wash on light surfaces.
- Selected row: `accent-soft` at 45% opacity.
- Show three to four columns on mobile; reveal technical columns at `sm`,
  `md`, `lg` and `xl` as space allows. Never rely on a hidden horizontal
  scrollbar to expose essential data.

### Code and traces

- Ink panel, 12px mono, line-height 1.7.
- Horizontal overflow is allowed inside `pre`; it must not widen the page.
- Copy actions use the shared copy control with a short confirmation state.
- Keep request metadata (method, path, status) adjacent to the payload.

### Charts

- 1–1.75px lines. A hairline baseline is required; faint dashed horizontal
  guides are allowed when they help judge the scale.
- One accent series; secondary series use email blue / SMS ochre.
- Label axes in 9–10px mono; no y-axis decoration unless the scale is
  meaningful.
- Interactive hit areas may be larger than the visible mark.

## 6. Data honesty

- The dashboard and delivery log may fall back to sample data only when the
  API request fails and no live response is available. A successful empty
  response shows an empty state.
- Any sample view must show a visible **Sample** badge in the panel header and
  again in the detail/table footer.
- The sample notice reads plainly: “Live metrics are unavailable. Showing
  clearly labeled 24h sample values.”
- Never display “All systems normal”, “live traffic”, uptime claims or a
  pulsing live dot unless the data backing them is present and current.
- Page-level example configurations are labelled **Example configuration**.
- Empty states explain what will appear and how to create it; they do not
  pretend data exists.

## 7. Motion and accessibility

- Reveal: 10px rise + fade, `700ms`, `cubic-bezier(0.22, 1, 0.36, 1)`.
- Hover and focus transitions: `150ms`.
- Live indicators may pulse only when the connection is real. Reduced-motion
  users get static marks.
- Minimum touch target: `44px` for primary controls; `36px` for compact
  controls with adequate spacing.
- Body text contrast is at least 4.5:1 on canvas and surface. Micro-labels use
  `faint` at 51% lightness, not a lighter grey.
- Focus is always visible and uses the accent outline.
- Tables expose row selection through `aria-selected` and keyboard Enter/Space.

## 8. Voice

- Direct, calm, technically literate.
- Short sentences. No exclamation marks. No growth-marketing adjectives.
- Use “messages”, “deliveries”, “routes”, “attempts” precisely.
- Errors say what failed and what the operator can do next.
- Sample and example copy is explicit; never blur the line between a
  demonstration and production data.

## 9. Avoid

- Glassmorphism, neon glow, gradient text and ambient coloured shadows.
- Purple/cyan “AI dashboard” palettes.
- A card around every block.
- Tiny grey text below 10px for meaningful information.
- Fake status badges, uptime claims or live activity indicators.
- Four-way channel toggles that do not map to the API’s single-channel
  contract.
- Silent auth bypasses or demo-token fallbacks.

## 10. Rendered reference

Current screenshots of the implemented public site and console live in
[`docs/frontend.md`](docs/frontend.md). Captures are taken against a running
local instance and use local test deliveries where a populated table is
needed; any fallback data keeps its **Sample** label.
