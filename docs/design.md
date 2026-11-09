---
version: alpha
name: Atharva Tayade
description: "Dark monochrome interface measured from priyanshpatel.com: system-ui type, flat surfaces and pill-shaped controls."
colors:
  background: "#030711"
  surface: "#030711"
  on-surface: "#E1E7EF"
  on-background: "#E1E7EF"
  on-surface-variant: "#9CA3B0"
  outline: "#1F2937"
  outline-variant: "#9CA3B04D"
  primary: "#E1E7EF"
  on-primary: "#000000"
  secondary: "#D97706"
typography:
  headline-display:
    fontFamily: system-ui
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: system-ui
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: -0.025em
  body-md:
    fontFamily: system-ui
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-lg:
    fontFamily: system-ui
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.56
    letterSpacing: -0.025em
  body-sm:
    fontFamily: system-ui
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
  label-md:
    fontFamily: system-ui
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1
  label-sm:
    fontFamily: system-ui
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.43
  headline-display-mobile:
    fontFamily: system-ui
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.025em
rounded:
  sm: 6px
  md: 8px
  lg: 12px
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 12px
components:
  button-ghost:
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: 0px
    padding: 0px
  card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 0px
  link:
    textColor: "{colors.background}"
---

# Priyansh Patel Design System

## Overview

Priyansh Patel describes itself as: “Product-minded builder and developer - shipping Web3 and developer tools from idea to launch. Strong in product strategy, user focus, and technical execution on Solana and full-stack. View projects, products, and experie” The interface is dark, built on **Near Black (#030711)** with **Cool Mist (#E1E7EF)** text and almost no color: actions are carried by contrast, not hue.

Type is set in **system-ui**. Headlines run large with tight negative tracking; body text is 16px. Depth comes from soft drop shadows. Controls are pill-shaped.

Measured from [priyanshpatel.com](https://priyanshpatel.com/) on November 9, 2026 at 1440×900 and 390×844 from 256 rendered elements. Values are computed styles from the live page, not the original source files.

## Colors

The palette has 8 roles.

- **Near Black (#030711):** Page background, seen 5 times. Token `background`.
- **Cool Mist (#E1E7EF):** Primary text and headings, seen 32 times. Token `on-surface`.
- **Blue (#9CA3B0):** Secondary text, seen 31 times. Token `on-surface-variant`.
- **Deep Blue (#1F2937):** Borders and dividers, seen 25 times. Token `outline`.
- **Blue 30% (#9CA3B04D):** Secondary dividers, seen 7 times. Token `outline-variant`.
- **Cool Mist (#E1E7EF):** Primary actions (the main text color; the palette is monochrome), seen 33 times. Token `primary`.
- **Near Black (#000000):** Text and icons on primary. Token `on-primary`.
- **Vivid Orange (#D97706):** Accent, seen 15 times. Token `secondary`.

## Typography

**system-ui** carries the whole interface. Fallback stack: `ui-sans-serif, system-ui, sans-serif, Apple Color Emoji`.

- **headline-display:** system-ui 48px at weight 700, line height 1, tracking -0.025em (36px on mobile). Page title (h1).
- **headline-lg:** system-ui 20px at weight 700, line height 1.4, tracking -0.025em. Section headings (h2).
- **body-md:** system-ui 16px at weight 400, line height 1.5. Body text.
- **body-lg:** system-ui 18px at weight 600, line height 1.56, tracking -0.025em. Lead paragraphs.
- **body-sm:** system-ui 14px at weight 400, line height 1.43. Secondary and small text.
- **label-md:** system-ui 16px at weight 600, line height 1. Buttons, navigation and labels.
- **label-sm:** system-ui 14px at weight 500, line height 1.43. Small labels and badges.

## Layout

Spacing follows a 8px grid: 92% of measured gaps and paddings are multiples of 8px.

- **Scale:** xs 4px, sm 8px, md 16px, lg 24px, xl 40px.
- **Gaps:** 12px is the most common gap in flex and grid layouts.
- **Breakpoints:** 640px, 768px, 1024px, 1280px.

## Elevation & Depth

Raised elements use soft drop shadows. The most used recipes:

- `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px`

## Shapes

Interactive controls are pill-shaped. Measured radii, most used first:

- **full (9999px):** 44 elements.
- **sm (6px):** 32 elements.
- **md (8px):** 28 elements.
- **lg (12px):** 16 elements.

## Components

Measured from the rendered page. Token values reference the tokens above.

- **button-ghost (“Thaler Finance Core Team June 20”):** transparent fill, #E1E7EF text, 16px/400, padding 0px.
- **card:** #030711 fill, #E1E7EF text, 16px/400, 12px radius, padding 0px, border 1px solid #1F2937.
- **link:** transparent fill, #030711 text, padding 0px.

## Do's and Don'ts

- Do use #030711 for the page.
- Do keep text in 2 levels: #E1E7EF, #9CA3B0.
- Do let contrast carry emphasis; primary actions use #E1E7EF on #030711.
- Do set headlines in system-ui with tight tracking (-0.025em).
- Do keep spacing on the 8px grid.
- Do make buttons and chips fully rounded (9999px); most other elements use 6px corners.
- Don't introduce new font families beyond system-ui.
- Don't add saturated accent colors; the measured palette is almost entirely neutral.
- Don't make interface transitions slower than 0.15s.

## Motion

Interface transitions are quick: 0.15s. Longer ambient animations run 0.72s, 0.9s.

- **Easing:** `cubic-bezier(0, 0, 0.2, 1)`, `cubic-bezier(0.22, 1, 0.36, 1)`, `cubic-bezier(0.4, 0, 0.2, 1)`.
- **Reduced motion:** the page responds to `prefers-reduced-motion`.
