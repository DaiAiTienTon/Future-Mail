---
name: Future Mail
description: A time capsule for your future self
colors:
  primary: "#1c1917" # stone-900
  neutral-bg: "#fafaf9" # stone-50
  neutral-surface: "#ffffff" # white
  neutral-border: "#f5f5f4" # stone-100
  neutral-text: "#292524" # stone-800
  neutral-muted: "#78716c" # stone-500
  status-success: "#10b981" # emerald-500
  status-warning: "#f59e0b" # amber-500
  status-error: "#f43f5e" # rose-500
typography:
  display:
    fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif"
    fontWeight: 400
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontWeight: 400
rounded:
  md: "0.375rem"
  xl: "0.75rem"
  "2xl": "1rem"
  "3xl": "1.5rem"
  full: "9999px"
spacing:
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.full}"
    padding: "0.75rem 1.5rem"
  button-primary-hover:
    backgroundColor: "#292524" # stone-800
  card-container:
    backgroundColor: "{colors.neutral-surface}"
    rounded: "{rounded.3xl}"
    padding: "1.5rem"
---

# Design System: Future Mail

## Overview

**Creative North Star: "The Minimalist Time Capsule"**

Future Mail employs a stark, highly contrasted, and typography-driven aesthetic. By stripping away extraneous decorations, the interface focuses entirely on the gravity of time and the personal nature of the letters being written. It relies heavily on a monochromatic "stone" palette to convey permanence, with vibrant semantic colors used only sparingly for status indicators.

**Key Characteristics:**
- Monochromatic foundation (Stone palette) with high contrast.
- Serif typography for primary headings to evoke classic letter-writing.
- Sans-serif for UI elements and readability.
- Generous border radii (`3xl` and `full`) to soften the stark contrast.

## Colors

The palette is intentionally subdued and monochromatic, allowing the content of the letters to take precedence.

### Primary
- **Stone Black** (#1c1917): Used for primary actions, heavy text, and major visual anchors.

### Neutral
- **Stone 50 / Off-White** (#fafaf9): The primary canvas background.
- **Pure White** (#ffffff): Elevated surface backgrounds (cards, modals).
- **Stone 100** (#f5f5f4): Subtle borders and dividers.
- **Stone 500** (#78716c): Muted text, timestamps, and secondary information.
- **Stone 800** (#292524): Primary reading text and secondary button backgrounds.

### Status (Semantic)
- **Emerald** (#10b981): Success states and "Sent" indicators.
- **Amber** (#f59e0b): Warning states and "Scheduled/Sending" indicators.
- **Rose** (#f43f5e): Error states and "Failed/Cancelled" indicators.

### Named Rules
**The Monochromatic Dominance Rule.** The UI must remain entirely grayscale (Stone palette) except for strictly semantic status icons (emerald, amber, rose). Do not use colored backgrounds or text for decoration.

## Typography

**Display Font:** System Serif (`font-serif`)
**Body Font:** System Sans-Serif (`font-sans`)

**Character:** Classic meets modern. Serif headings ground the application in the tradition of physical mail, while sans-serif body text ensures modern legibility.

### Hierarchy
- **Display** (4xl, serif): Used exclusively for the most important numbers or hero states (e.g., stats on the dashboard).
- **Headline** (2xl, serif): Used for page titles and major empty states.
- **Title** (lg, serif): Used for section headers.
- **Body** (base/sm, sans-serif): Used for all UI text, forms, and letter content.

## Layout

The layout uses a responsive, single-column centered container model. It is designed to feel like a focused sheet of paper.
- **Spacing Rhythm:** Based on a strict 4px/8px Tailwind grid.
- **Padding:** Generous padding (`p-6` to `p-12`) is used to let content breathe.

## Elevation & Depth

Future Mail uses an almost entirely flat design language.

### Shadow Vocabulary
- **Subtle Lift** (`shadow-sm`): Applied to cards and containers to slightly separate them from the canvas.
- **Hover Lift** (`shadow-md`): Applied when interacting with clickable cards to afford interactivity.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only to separate white cards from the off-white canvas or as a response to hover states.

## Shapes

The form language is remarkably soft to counterbalance the stark color palette.
- Cards use extreme rounding (`rounded-3xl`).
- Buttons and pills use pill-shapes (`rounded-full`).

## Components

### Buttons
- **Shape:** Pill-shaped (rounded-full).
- **Primary:** Stone-800 background, Stone-50 text, px-6 py-3.
- **Hover / Focus:** Transitions to Stone-900.

### Cards / Containers
- **Corner Style:** 3xl radius (24px).
- **Background:** Pure White.
- **Shadow Strategy:** Subtle lift (shadow-sm) with border-stone-100.
- **Hover:** Transitions to shadow-md and border-stone-200.

### Status Pills
- **Style:** Stone-50 background, rounded-full, px-3 py-1.5.
- **Text:** Stone-600, text-xs, font-medium, accompanied by a 16px Lucide icon matching the semantic status color.

## Do's and Don'ts

### Do:
- **Do** use `font-serif` for prominent headings and numbers to maintain the "classic letter" feel.
- **Do** use `rounded-3xl` for main content containers and `rounded-full` for actions.

### Don't:
- **Don't** introduce new brand colors into the UI. Keep it strictly Stone grayscale.
- **Don't** use heavy drop shadows. Rely on subtle borders and `shadow-sm`.
