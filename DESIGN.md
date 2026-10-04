# Design System: Pulse Dashboard
**Project ID:** 7145741390492825757

## 1. Visual Theme & Atmosphere
The Pulse aesthetic is an **immersive, ultra-premium dark mode** heavily inspired by high-end design agencies (like Phenomenon Studio). The atmosphere is deep, cinematic, and engineered for high data density without feeling cluttered. 
It relies heavily on **polished glassmorphism** (frosted, semi-transparent layers over a pitch-black void), sophisticated **bento-box grid layouts** that break the monotony of traditional dashboards, and dramatic depth-of-field lighting. The interface should feel less like a traditional web app and more like a high-performance WebGL data visualization engine, designed to support fluid, staggered motion graphics and micro-interactions.

## 2. Color Palette & Roles

*   **Obsidian Void (Background)** (`#090A0F`)
    *   *Role:* The absolute base layer. Absorbs light and provides infinite contrast for glowing accents.
*   **Frosted Container (Surface)** (`#12131C`)
    *   *Role:* Used for bento-box cards, sidebars, and primary layout panels. Designed to be paired with `backdrop-blur` to create physical depth.
*   **Electric Violet (Primary Accent)** (`#8B5CF6`)
    *   *Role:* Used for primary Call-to-Action buttons, active states, and primary data streams (e.g., Email telemetry).
*   **Radiant Cyan (Secondary Accent)** (`#06B6D4`)
    *   *Role:* Used for secondary highlights, live latency sparklines, and SMS gateway data.
*   **Neon Emerald (Tertiary Accent)** (`#10B981`)
    *   *Role:* Indicates system health, successful delivery states, and active push notification tokens.
*   **Phenomenon Orange (Cinematic Highlight)** (`#FF7A00`)
    *   *Role:* Reserved for critical surges, high-energy 3D gradient underlays, and dramatic focal points.
*   **Crisp White (Primary Text)** (`#F8FAFC`)
    *   *Role:* High-contrast headings and primary metric readouts.
*   **Muted Zinc (Secondary Text)** (`#94A3B8`)
    *   *Role:* Supporting copy, timestamps, and secondary labels to maintain visual hierarchy.

## 3. Typography Rules

*   **Primary Font (Headlines & Body):** `Geist` (or `Inter`)
    *   *Usage:* Used for all primary interface text. Headlines are bold (`600`) with tight letter-spacing (`-0.02em` to `-0.03em`) for a dense, engineered look. Body text is regular (`400`) and optimized for readability.
*   **Monospace Font (Data & Badges):** `JetBrains Mono`
    *   *Usage:* Exclusively used for technical data, JSON payloads, latency metrics, and status badges (`label-sm`, `10px`, tight tracking). It reinforces the "developer-first" engine aesthetic.

## 4. Component Stylings

*   **Bento-Box Cards & Containers:**
    *   *Shape:* Precise, architectural corner treatment. `rounded-xl` (12px) for primary feature plates and `rounded-lg` (8px) for metric summary cards.
    *   *Surface:* Dark obsidian `#12131C` with a sub-pixel highlight border `border: 1px solid rgba(255, 255, 255, 0.07)` and a `backdrop-filter: blur(16px)`.
    *   *Elevation:* Relies on luminescence and directional ambient glows rather than murky drop shadows. Hovering over a card activates a soft directional glow matching the component's accent category (e.g., `box-shadow: 0 8px 32px -8px rgba(139, 92, 246, 0.18)`).
*   **Buttons:**
    *   *Primary:* Solid high-energy accent fill with `#FFFFFF` text. Features a subtle inset highlight and a matched `12px` ambient halo on hover.
    *   *Secondary/Ghost:* Surface fill of `rgba(255, 255, 255, 0.04)` bordered by `rgba(255, 255, 255, 0.12)`. Transparent background with `#94A3B8` icon color that brightens on hover.
*   **Inputs & JSON Editors:**
    *   *Style:* Extreme minimalism. `#0E0F17` background with a 1px border of `rgba(255, 255, 255, 0.10)`. Active focus strips browser rings and renders a seamless inner border combined with an outer neon dispersion glow.

## 5. Layout Principles

*   **Bento Grid Architecture:** Avoid standard full-width rows. Use asymmetric, interlocking grids (bento-boxes) that guide the eye hierarchically through the telemetry data.
*   **Extreme Whitespace:** Utilize massive padding (`space-xl`: `2rem`, `margin-lg`: `2rem`) within cards to let metrics breathe. The density of data is offset by the expansiveness of the containers.
*   **Z-Axis Depth:** Elements should feel like they exist in 3D space. The sidebar sits at the bottom layer, bento cards float above it, and tooltips/modals hover at the highest elevation with intense blur backdrops (`backdrop-blur-2xl`).
