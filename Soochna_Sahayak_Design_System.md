# Soochna Sahayak — Complete Design System & Prompt Guide
**Warm Parchment Theme · Premium Government Productivity Tool**

> This document merges everything: the original prompt, the live HTML preview implementation, all animations, all components, and additional upgrade suggestions. Items marked **✅ Already Implemented** exist in the HTML preview. Items marked **🆕 Add This** are new enhancements to add to the Gemini prompt.

---

## TABLE OF CONTENTS

1. [Design Identity](#1-design-identity)
2. [Design Tokens — Colors, Typography, Spacing](#2-design-tokens)
3. [Atmosphere & Texture](#3-atmosphere--texture)
4. [Global Layout Structure](#4-global-layout-structure)
5. [Navbar](#5-navbar)
6. [Homepage — Hero Section](#6-homepage--hero-section)
7. [Homepage — Card Grid](#7-homepage--card-grid)
8. [All Animations — Complete Reference](#8-all-animations--complete-reference)
9. [Inner Pages — Shared Elements](#9-inner-pages--shared-elements)
10. [Form System](#10-form-system)
11. [Table System](#11-table-system)
12. [Button System](#12-button-system)
13. [Special Components](#13-special-components)
14. [Loading Overlay](#14-loading-overlay)
15. [Footer](#15-footer)
16. [Responsive Rules](#16-responsive-rules)
17. [Print & PDF CSS](#17-print--pdf-css)
18. [Files to Modify](#18-files-to-modify)
19. [🆕 New Suggestions — Not Yet in Prompt](#19-new-suggestions--not-yet-in-prompt)
20. [Final Quality Checklist](#20-final-quality-checklist)

---

## 1. Design Identity

| Property | Value |
|---|---|
| **Concept** | "A premium government ledger meets modern SaaS" |
| **Feel** | Calm authority. Like a beautifully typeset official document crossed with a Notion workspace |
| **Tone** | Trustworthy · Warm · Refined · Editorial |
| **One unforgettable element** | Ink-on-parchment texture with deep forest green as the single commanding accent |
| **References** | Notion, Linear, GOV.UK design system, luxury print design |
| **Font pairing** | Lora (serif display) + DM Sans (clean body) + JetBrains Mono (numbers) |

---

## 2. Design Tokens

### 2.1 Color Palette
✅ Already Implemented in HTML preview

```css
:root {
  --bg-base:        #FAFAF5;   /* warm ivory — main page background */
  --bg-surface:     #FFFFFF;   /* pure white — cards, panels */
  --bg-elevated:    #F4F3EC;   /* warm off-white — table rows, inputs */
  --bg-deep:        #ECEADE;   /* deeper parchment — hover states */
  --accent-primary: #1A5C38;   /* deep forest green — ONLY strong color */
  --accent-light:   #E8F2EC;   /* pale green tint — badges, highlights */
  --accent-amber:   #B45309;   /* warm amber — warnings, low % values */
  --text-primary:   #1C1917;   /* near-black ink */
  --text-secondary: #44403C;   /* warm dark grey */
  --text-muted:     #A8A29E;   /* light warm grey */
  --border:         #E2DFD5;   /* warm beige border */
  --border-strong:  #C5BFB0;   /* stronger border for tables */
  --shadow-sm:      0 1px 3px rgba(28,25,23,0.08), 0 1px 2px rgba(28,25,23,0.06);
  --shadow-md:      0 4px 16px rgba(28,25,23,0.10), 0 2px 6px rgba(28,25,23,0.06);
  --shadow-lg:      0 12px 40px rgba(28,25,23,0.14), 0 4px 12px rgba(28,25,23,0.08);
  --shadow-green:   0 0 0 3px rgba(26,92,56,0.15);
}
```

### 2.2 Typography
✅ Already Implemented

```css
/* Google Fonts import */
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&display=swap');
```

| Role | Font | Weight | Size | Use |
|---|---|---|---|---|
| Display / Hero | Lora | 700 | 52px | Page hero title |
| Section Heading | Lora | 600 | 26px | Page title areas |
| Card Title | Lora | 600 | 19px | Option cards |
| Body | DM Sans | 400 | 15px | Paragraph text |
| Labels | DM Sans | 500 | 11px | Form field labels (UPPERCASE) |
| Captions | DM Sans | 400 | 12–13px | Muted secondary text |
| Mono / Numbers | JetBrains Mono | 400–500 | 12–13px | Counts, percentages, serial nos. |

### 2.3 Spacing System
Use **only** these values: `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80 / 96px`

### 2.4 Border Radius
```css
--radius-sm: 6px;   /* inputs, badges */
--radius-md: 10px;  /* buttons */
--radius-lg: 14px;  /* cards */
--radius-xl: 20px;  /* panels */
```

---

## 3. Atmosphere & Texture

### 3.1 Paper Grain Texture
✅ Already Implemented (opacity: 0.028 in HTML)

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.025;  /* Keep between 0.02–0.03. Never higher. */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}
/* All content must sit above: position: relative; z-index: 1; */
```

### 3.2 Top Accent Border
✅ Already Implemented

```css
body {
  border-top: 3px solid var(--accent-primary);
}
```

### 3.3 Sticky Navbar Blur
✅ Already Implemented

```css
.nav-bar {
  background: rgba(250,250,245,0.90);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 100;
}
```

---

## 4. Global Layout Structure

```
┌──────────────────────────────────────────┐
│  3px green top border (body::after)      │
│  STICKY NAVBAR (backdrop-blur)           │
│──────────────────────────────────────────│
│  HERO SECTION (left-aligned, max 1200px) │
│  STATS ROW                               │
│  CARD GRID (3 cols, gap 20px)            │
│──────────────────────────────────────────│
│  FOOTER (bg-elevated, center text)       │
└──────────────────────────────────────────┘
```

---

## 5. Navbar

✅ Already Implemented

```
[Brand: "Soochna Sahayak" in Lora]     [Dept. pill badge]
```

| Element | Style |
|---|---|
| Brand | Lora 600, 16px. "Sahayak" in `--accent-primary` color |
| Department badge | Pill · `--accent-light` bg · `--accent-primary` text · 10px uppercase · tracking-widest |
| Background | `rgba(250,250,245,0.90)` with `backdrop-filter: blur(8px)` |
| Border | `border-bottom: 1px solid var(--border)` |
| Position | `sticky`, `top: 0`, `z-index: 100` |
| Padding | `14px 64px` |

---

## 6. Homepage — Hero Section

✅ Already Implemented

### Layout
```
[Left 60%]                    [Right 40%]
  Eyebrow badge                 Giant decorative "स"
  "Soochna Sahayak" (h1)        (220px, opacity 0.055)
  "Smart Office Assistant"
  Horizontal rule (60px)
  Supporting description text
```

### Eyebrow Badge
```css
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-primary);
  background: var(--accent-light);
  border: 1px solid rgba(26,92,56,0.2);
  border-radius: 999px;
  padding: 4px 12px;
}
/* Green dot ::before pseudo element — width/height 6px, bg accent-primary */
```

### Hero Title
```css
.hero-title {
  font-family: 'Lora', serif;
  font-size: 52px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}
```

### Decorative "स"
```css
.hero-deco {
  font-family: 'Lora', serif;
  font-size: 220px;
  font-weight: 700;
  color: rgba(26,92,56,0.055);
  line-height: 1;
  user-select: none;
  pointer-events: none;
}
/* Hidden on mobile < 768px */
```

### Stats Row (below hero)
✅ Already Implemented — 3 stat items with green dot + bold count + label

---

## 7. Homepage — Card Grid

✅ Already Implemented

### Grid
```css
.card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}
```

### Card Base
```css
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);  /* 14px */
  padding: 32px;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 280ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Card Decorative Corner (::after)
```css
.card::after {
  content: '';
  position: absolute;
  top: -24px; right: -24px;
  width: 90px; height: 90px;
  background: radial-gradient(circle, rgba(26,92,56,0.06) 0%, transparent 70%);
  border-radius: 50%;
  transition: transform 300ms ease;
}
.card:hover::after { transform: scale(1.3); }
```

### Card Hover State
```css
.card:hover {
  box-shadow: var(--shadow-lg);
  border-color: rgba(26,92,56,0.25);
  transform: translateY(-4px);
}
.card:hover .card-arrow {
  transform: translateX(4px);
  stroke: var(--accent-primary);
}
```

### Card Internal Structure
1. **Icon block** — 46×46px, `--accent-light` bg, `border-radius: 10px`, SVG icon 22px in `--accent-primary`
2. **Card title** — Lora 600, 19px
3. **Description** — DM Sans 13px, `--text-muted`, line-height 1.65
4. **Card footer** — flex row: left tag · right arrow icon, separated by `border-top: 1px solid var(--border)`

### PLP Card (Featured)
```css
.card.featured {
  border-left: 3px solid var(--accent-primary);
}
/* "सक्रिय" badge — top-right absolute position, badge-green style */
```

### Yoga Card (Disabled)
```css
.card.disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}
/* "शीघ्र आ रहा है" badge — badge-muted style */
```

---

## 8. All Animations — Complete Reference

### 8.1 Core Keyframes
✅ Already Implemented

```css
@keyframes riseUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

### 8.2 Hero Section — Staggered Entrance
✅ Already Implemented

| Element | Animation | Duration | Delay | Easing |
|---|---|---|---|---|
| Eyebrow badge | `riseUp` | 600ms | 0ms | ease |
| Hero title | `riseUp` | 600ms | 80ms | ease |
| Hero subtitle | `riseUp` | 600ms | 150ms | ease |
| Horizontal rule | `riseUp` | 600ms | 200ms | ease |
| Description text | `riseUp` | 600ms | 250ms | ease |
| Decorative "स" | `riseUp` | 800ms | 100ms | ease |
| Stats row | `riseUp` | 600ms | 320ms | ease |

All use `animation-fill-mode: both` so they start hidden.

### 8.3 Card Grid — Staggered Entrance
✅ Already Implemented

```css
.card:nth-child(1) { animation: riseUp 500ms ease both; animation-delay: 100ms; }
.card:nth-child(2) { animation: riseUp 500ms ease both; animation-delay: 220ms; }
.card:nth-child(3) { animation: riseUp 500ms ease both; animation-delay: 340ms; }
```

### 8.4 Card Hover Micro-animations
✅ Already Implemented

| Element | Trigger | Effect |
|---|---|---|
| Card body | `:hover` | `translateY(-4px)` + shadow upgrades |
| Card `::after` corner glow | `:hover` | `scale(1.3)` |
| Arrow icon | `:hover` | `translateX(4px)` + stroke color → accent |
| Back button icon | `:hover` | `translateX(-2px)` |
| Table rows | `:hover` | `background: rgba(26,92,56,0.04)` |

### 8.5 Form Input Focus Animation
✅ Already Implemented

```css
.field-input {
  transition: border-color 150ms, box-shadow 150ms;
}
.field-input:focus {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-green);  /* 0 0 0 3px rgba(26,92,56,0.15) */
  background: #fff;
}
```

### 8.6 Button Micro-animations
✅ Already Implemented

```css
/* Primary Button */
.btn-primary:hover {
  background: #14472D;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(26,92,56,0.35);
}
.btn-primary:active { transform: translateY(0); }

/* Secondary Button */
.btn-secondary:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  background: rgba(26,92,56,0.04);
}
```

### 8.7 Page Transition
✅ Already Implemented in HTML (JS-driven class toggle)

```css
.page { display: none; }
.page.active {
  display: block;
  animation: pageFadeIn 400ms ease both;
}
@keyframes pageFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### 8.8 Inner Page Elements — Staggered Entrance
✅ Already Implemented

```css
.inner-page-wrap > *:nth-child(1) { animation: riseUp 450ms ease both; animation-delay: 0ms; }
.inner-page-wrap > *:nth-child(2) { animation: riseUp 450ms ease both; animation-delay: 60ms; }
.inner-page-wrap > *:nth-child(3) { animation: riseUp 450ms ease both; animation-delay: 120ms; }
.inner-page-wrap > *:nth-child(4) { animation: riseUp 450ms ease both; animation-delay: 180ms; }
```

### 8.9 Reduced Motion Support
🆕 Add This to globals.css

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
}
```

### 8.10 🆕 New Animations to Add

#### Loading Dots (PDF overlay spinner)
```css
@keyframes bounceDot {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40%           { transform: translateY(-10px); opacity: 1; }
}
.loading-dot:nth-child(1) { animation: bounceDot 1.2s ease infinite; animation-delay: 0ms; }
.loading-dot:nth-child(2) { animation: bounceDot 1.2s ease infinite; animation-delay: 200ms; }
.loading-dot:nth-child(3) { animation: bounceDot 1.2s ease infinite; animation-delay: 400ms; }
```

#### Navbar Slide Down on Load
```css
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-100%); }
  to   { opacity: 1; transform: translateY(0); }
}
.nav-bar { animation: slideDown 500ms ease both; }
```

#### Nav Brand Dot Pulse
```css
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(26,92,56,0.4); }
  50%       { box-shadow: 0 0 0 6px rgba(26,92,56,0); }
}
.nav-brand-dot { animation: pulse 3s ease infinite; }
```

#### Button Ripple on Click
```css
.btn { position: relative; overflow: hidden; }
.btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.2);
  opacity: 0;
  transform: scale(0);
  border-radius: inherit;
  transition: transform 0.4s ease, opacity 0.4s ease;
}
.btn:active::after {
  transform: scale(2);
  opacity: 1;
  transition: none;
}
```

#### Table Row Slide-in on Page Load
```css
@keyframes rowSlide {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}
tbody tr:nth-child(1) { animation: rowSlide 300ms ease both; animation-delay: 50ms; }
tbody tr:nth-child(2) { animation: rowSlide 300ms ease both; animation-delay: 100ms; }
tbody tr:nth-child(3) { animation: rowSlide 300ms ease both; animation-delay: 150ms; }
/* Add up to n rows as needed */
```

#### Certification Block Entrance
```css
.cert-block {
  animation: riseUp 500ms ease both;
  animation-delay: 300ms;
}
```

---

## 9. Inner Pages — Shared Elements

### Back Button
✅ Already Implemented

```css
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 7px 14px;
  transition: all 150ms ease;
}
.back-btn:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}
.back-btn:hover svg { transform: translateX(-2px); }
```

Text: ChevronLeft icon + `"होम"`

### Page Title Area
✅ Already Implemented

```css
.page-title-area {
  border-left: 4px solid var(--accent-primary);
  padding-left: 18px;
  margin-bottom: 36px;
}
.page-title {
  font-family: 'Lora', serif;
  font-size: 26px;
  font-weight: 600;
}
.page-subtitle {
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 5px;
}
```

---

## 10. Form System

### Form Panel
✅ Already Implemented

```css
.form-panel {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);  /* 20px */
  padding: 36px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 24px;
}
.form-section-title {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 20px;
}
```

### Field Labels
✅ Already Implemented

```css
.field-label {
  display: block;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
  margin-bottom: 7px;
}
```

### Text Inputs
✅ Already Implemented

```css
.field-input {
  width: 100%;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 10px 13px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  transition: border-color 150ms, box-shadow 150ms;
  outline: none;
}
.field-input:focus {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-green);
  background: #fff;
}
```

### Textarea (Note Field)
✅ Already Implemented

Same styles as `.field-input` plus:
```css
.field-textarea {
  min-height: 80px;
  resize: vertical;
}
```

### Custom Select / Dropdown
✅ Already Implemented

```css
.select-wrap { position: relative; }
.select-wrap select { appearance: none; padding-right: 32px; }
/* Chevron via ::after pseudo: border-top: 5px solid var(--text-muted) */
.select-wrap select:focus {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-green);
}
```

### Grid Layouts
✅ Already Implemented

```css
.form-row         { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-row.single  { grid-template-columns: 1fr; }
.form-row.triple  { grid-template-columns: 1fr 1fr 1fr; }
```

---

## 11. Table System

### Table Wrapper
✅ Already Implemented

```css
.table-wrap {
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  overflow-x: auto;  /* horizontal scroll on mobile */
}
```

### Table Header
```css
thead tr {
  background: var(--bg-elevated);
  border-bottom: 2px solid var(--border-strong);
}
thead th {
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  padding: 10px 14px;
  white-space: nowrap;
}
```

### Table Body
```css
tbody tr { border-bottom: 1px solid var(--border); transition: background 120ms ease; }
tbody tr:nth-child(even) { background: var(--bg-elevated); }
tbody tr:hover           { background: rgba(26,92,56,0.04); }
tbody td { padding: 10px 14px; }
```

### Mono Numbers
```css
.mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
```

### Status Indicators (PLP % column)
✅ Already Implemented — color-coded values
- Green `#16A34A` — high achievement (> 75%)
- Amber `var(--accent-amber)` — mid/low (0–75%)
- Red `#DC2626` — critical

### Add Row Button
✅ Already Implemented

```css
.add-row-btn {
  width: 100%;
  padding: 10px;
  background: var(--bg-elevated);
  border: 1px dashed var(--border-strong);
  color: var(--accent-primary);
  font-size: 13px;
  font-weight: 500;
  border-radius: var(--radius-md);
  margin-top: 12px;
  transition: all 150ms ease;
}
.add-row-btn:hover {
  background: var(--accent-light);
  border-color: var(--accent-primary);
}
```

---

## 12. Button System

✅ All 4 tiers implemented

### Tier 1 — Primary (Save PDF)
```css
.btn-primary {
  background: var(--accent-primary);
  color: white;
  font-weight: 600;
  font-size: 14px;
  padding: 11px 22px;
  border-radius: var(--radius-md);
  box-shadow: 0 2px 8px rgba(26,92,56,0.30);
}
.btn-primary:hover {
  background: #14472D;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(26,92,56,0.35);
}
.btn-primary:active { transform: translateY(0); }
```
Icon: Save (lucide) before text

### Tier 2 — Secondary (Print)
```css
.btn-secondary {
  background: transparent;
  border: 1px solid var(--border-strong);
  color: var(--text-primary);
  padding: 11px 20px;
}
.btn-secondary:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  background: rgba(26,92,56,0.04);
}
```
Icon: Printer (lucide) before text

### Tier 3 — Ghost (Preview)
```css
.btn-ghost {
  background: var(--accent-light);
  color: var(--accent-primary);
  border: 1px solid rgba(26,92,56,0.20);
  padding: 11px 20px;
}
.btn-ghost:hover { background: rgba(26,92,56,0.12); }
```
Icon: Eye (lucide) before text

### Tier 4 — Danger Outline (Delete Row)
```css
/* bg transparent, border 1px solid #FCA5A5, color #DC2626 */
/* padding: 4px 10px, font-size: 11px */
/* hover: bg #FEF2F2 */
```

### All Buttons — Shared Base
```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: 'DM Sans', sans-serif;
  border-radius: var(--radius-md);
  cursor: pointer;
  border: none;
  transition: all 150ms ease;
}
.btn svg {
  width: 16px; height: 16px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
}
```

---

## 13. Special Components

### Certification Block (Staff Attendance)
✅ Already Implemented

```css
.cert-block {
  background: var(--accent-light);
  border: 1px solid rgba(26,92,56,0.2);
  border-left: 4px solid var(--accent-primary);
  border-radius: var(--radius-md);
  padding: 20px 24px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.cert-text {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.7;
  text-align: center;
}
```

Hindi text (exact, do not change):
> प्रमाणित किया जाता है कि उपस्थिति पत्रक का मिलान उपस्थिति पंजिका से कर लिया गया है, साथ ही कोई भी कार्मिक बिना सक्षम स्तर से अवकाश स्वीकृत कराए उपस्थिति पत्रक में उल्लिखित अवधि के दौरान अनुपस्थित नहीं रहा है।

### Signature Block
✅ Already Implemented

```
Right-aligned, bottom of page.
"हस्ताक्षर प्रभारी" — border-top line + office name below in italic muted text.
```

### Badges / Pills
✅ Already Implemented

```css
.badge-green { background: var(--accent-light); color: var(--accent-primary); border: 1px solid rgba(26,92,56,0.2); }
.badge-muted { background: var(--bg-elevated); color: var(--text-muted); border: 1px solid var(--border); }
/* All badges: font-size 10px, font-weight 500, letter-spacing 0.06em, UPPERCASE, border-radius 999px, padding 3px 9px */
```

### A4 Preview Panel
```css
/* White bg, border: 1px solid --border, border-radius: --radius-lg */
/* box-shadow: --shadow-lg */
/* 4px solid --accent-primary top strip */
/* transform: scale(...) to fit viewport, transform-origin: top center */
/* Inside: Lora for headings, DM Sans for body, clean black borders for print */
```

---

## 14. Loading Overlay

🆕 Add This — Not yet in HTML, must be coded

```css
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(250,250,245,0.85);
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}
.loading-dots { display: flex; gap: 8px; }
.loading-dot {
  width: 10px; height: 10px;
  background: var(--accent-primary);
  border-radius: 50%;
}
/* Use bounceDot keyframe from Section 8.10 */
.loading-text {
  font-family: 'Lora', serif;
  font-style: italic;
  font-size: 16px;
  color: var(--text-secondary);
}
```

Text: `"PDF तैयार हो रही है..."`

---

## 15. Footer

✅ Already Implemented

```css
footer {
  border-top: 1px solid var(--border);
  background: var(--bg-elevated);
  padding: 28px 64px;
  text-align: center;
}
.footer-line1 { font-size: 13px; font-weight: 500; color: var(--text-secondary); }
.footer-line2 { font-size: 12px; color: var(--text-muted); }
.footer-line2::before { content: '· '; color: var(--accent-primary); font-weight: 700; }
```

Lines (exact, do not change):
- Line 1: `Empowering Office Efficiency`
- Line 2: `An Initiative by Peeyush Singh Rao, Assistant Accounts Officer Grade II`

---

## 16. Responsive Rules

### Mobile (< 768px)
```css
@media (max-width: 768px) {
  .nav-bar { padding: 12px 20px; }
  .hero { padding: 40px 20px 32px; flex-direction: column; }
  .hero-deco { display: none; }
  .hero-title { font-size: 36px; }
  .stats-row { padding: 0 20px 24px; flex-wrap: wrap; gap: 16px; }
  .card-section { padding: 0 20px 60px; }
  .card-grid { grid-template-columns: 1fr; }
  .inner-page-wrap { padding: 24px 20px 100px; }
  .form-row { grid-template-columns: 1fr; }
  footer { padding: 24px 20px; }

  /* Sticky bottom action bar */
  .btn-row {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: var(--bg-surface);
    border-top: 1px solid var(--border);
    padding: 12px 16px;
    z-index: 50;
    flex-direction: column;
    gap: 8px;
  }
  .btn { width: 100%; justify-content: center; }
}
```

### Tablet (768px–1024px)
```css
@media (768px <= width <= 1024px) {
  .card-grid { grid-template-columns: 1fr 1fr; }
  /* PLP card: grid-column: 1 / -1 (full width top row) */
  .hero-title { font-size: 40px; }
}
```

### Desktop (> 1024px)
Standard layout — 3 col cards, side-by-side form+preview.

---

## 17. Print & PDF CSS

```css
@media print {
  body::before { display: none; }
  body { border-top: none; background: white; }
  .no-print { display: none !important; }
  #att-doc-page, .plp-doc-page {
    position: absolute; left: 0; top: 0;
    width: 100%;
    transform: none !important;
    box-shadow: none;
    border: none;
  }
  @page { size: A4 landscape; margin: 8mm; }
  select { display: none; }
  .att-select-print-span { display: inline; }
  /* Minimum font: 7pt in tables */
  /* No mid-row page breaks */
}
```

**html2pdf.js settings:**
```js
{
  margin: [5, 5, 5, 5],
  filename: `Upasthiti_Patrak_${fromDate}_${toDate}.pdf`,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollY: 0 },
  jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
  pagebreak: { mode: 'avoid-all' }
}
```

---

## 18. Files to Modify

### MODIFY ONLY these files:
| File | What changes |
|---|---|
| `src/app/globals.css` | Full design system: tokens, keyframes, grain, fonts |
| `src/app/layout.tsx` | Google Fonts import, body class, grain overlay div |
| `src/app/page.tsx` | Full homepage: hero, cards, footer |
| `src/app/plp/page.tsx` | PLP form page |
| `src/app/staff-attendance/page.tsx` | Staff Attendance page |
| `src/components/*` | Shared Card, Button, Input, Table if they exist |

### DO NOT MODIFY:
- Any API routes
- Any server actions
- Any data fetching / state management logic
- Any Hindi text string content
- Any calculation logic (leave counts, PDF generation logic)

---

## 19. 🆕 New Suggestions — Not Yet in Prompt

These are design upgrades not in the original prompt. Add them to your Gemini prompt for a truly exceptional output.

### 19.1 Navbar Slide-Down Animation
```css
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-100%); }
  to   { opacity: 1; transform: translateY(0); }
}
.nav-bar { animation: slideDown 500ms ease both; }
```

### 19.2 Live Green Pulse Dot in Navbar Brand
A small pulsing green dot next to the brand name signals "system active".
```css
.nav-brand-dot {
  width: 8px; height: 8px;
  background: var(--accent-primary);
  border-radius: 50%;
  animation: pulse 3s ease infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(26,92,56,0.4); }
  50%       { box-shadow: 0 0 0 6px rgba(26,92,56,0); }
}
```

### 19.3 Button Click Ripple Effect
Makes buttons feel physically responsive on click — very Apple-like.
```css
.btn { position: relative; overflow: hidden; }
.btn::after {
  content: '';
  position: absolute; inset: 0;
  background: rgba(255,255,255,0.2);
  opacity: 0; transform: scale(0);
  border-radius: inherit;
  transition: transform 0.4s, opacity 0.4s;
}
.btn:active::after { transform: scale(2); opacity: 1; transition: none; }
```

### 19.4 Table Row Slide-in Animation
Each row slides in slightly from the left on page load — editorial feel.
```css
@keyframes rowSlide {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}
tbody tr:nth-child(n) { animation: rowSlide 300ms ease both; animation-delay: calc(n * 50ms); }
```

### 19.5 Scroll-Triggered Fade for Form Panels
Form panels below the fold should animate in as you scroll down.
```js
// Use Intersection Observer API
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });
document.querySelectorAll('.form-panel').forEach(el => observer.observe(el));
```
```css
.form-panel { opacity: 0; transform: translateY(20px); transition: opacity 500ms ease, transform 500ms ease; }
.form-panel.visible { opacity: 1; transform: translateY(0); }
```

### 19.6 Hero Horizontal Rule Width Animation
The short 60px rule below the subtitle grows from 0 to 60px on load — elegant reveal.
```css
.hero-rule {
  width: 0;
  animation: growRule 600ms ease both;
  animation-delay: 300ms;
}
@keyframes growRule {
  from { width: 0; }
  to   { width: 60px; }
}
```

### 19.7 Card Icon Bounce on First Hover
```css
.card:hover .card-icon-wrap {
  animation: iconBounce 400ms var(--ease-spring) both;
}
@keyframes iconBounce {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.12); }
  100% { transform: scale(1.05); }
}
```

### 19.8 Glowing Top Border on Scroll
The 3px top accent border glows when user scrolls down — JS adds class on `window.scroll`.
```js
window.addEventListener('scroll', () => {
  document.body.classList.toggle('scrolled', window.scrollY > 20);
});
```
```css
body.scrolled::after {
  box-shadow: 0 0 20px rgba(26,92,56,0.5);
}
```

### 19.9 Certification Block Typewriter Effect (Optional)
The long Hindi certification text could appear character-by-character when it scrolls into view — very premium feel for a government document.

### 19.10 Page Count / Progress Indicator
For Staff Attendance with many staff rows, add a subtle pill: `"3 कार्मिक · 30 दिन · अवधि: 11.04–10.05"` that updates live.

### 19.11 Form Auto-save Indicator
Small toast notification (bottom-right) that flashes `"✓ ड्राफ्ट सुरक्षित"` using `localStorage` — so data is not lost on refresh.

### 19.12 Dark Mode Toggle (Future Enhancement)
A sun/moon icon in the navbar that switches between Warm Parchment (light) and a Deep Ink dark theme. Implement with `data-theme` attribute on `<html>` and a second set of CSS variables.

---

## 20. Final Quality Checklist

Before the AI outputs any code, it must verify ALL of these:

### Design
- [ ] Feels like a premium, editorial government tool (not a basic form)
- [ ] Lora serif used for ALL headings, DM Sans for body
- [ ] Parchment/ivory background is warm — not harsh white or cold grey
- [ ] `--accent-primary` (forest green) is the ONLY strong color
- [ ] Amber used ONLY for warnings / low achievement percentages
- [ ] Grain texture applied subtly (opacity 0.025 — never higher)

### Cards
- [ ] Cards elevate on hover with shadow + `translateY(-4px)`
- [ ] Corner radial gradient grows on card hover
- [ ] Arrow slides right on card hover
- [ ] PLP card has left green border + "सक्रिय" badge
- [ ] Yoga card is visibly dimmed (opacity 0.45) + not clickable

### Animations
- [ ] Hero elements stagger from 0ms to 320ms delays
- [ ] Cards stagger at 100ms / 220ms / 340ms
- [ ] Inner page elements stagger at 0ms / 60ms / 120ms / 180ms
- [ ] Page transitions use fade+rise on `.page.active`
- [ ] All transitions use 150–280ms durations (not instant, not slow)
- [ ] `prefers-reduced-motion` disables all animations

### Functionality
- [ ] All Hindi strings 100% unchanged
- [ ] Option 1 (PLP) PDF generation works
- [ ] Option 2 Staff Attendance table, dropdowns, leave calc all work
- [ ] Back buttons navigate correctly to home
- [ ] Option 3 (Yoga) shows "Coming Soon" only — no functionality

### Layout
- [ ] Mobile: 1-column cards, sticky bottom action bar
- [ ] Table: `overflow-x: auto` for horizontal scroll
- [ ] Decorative "स" hidden on mobile
- [ ] Form rows stack vertically on mobile

### Output Rules
- [ ] Every file is complete — no `...` or `// rest remains same`
- [ ] No new files created unnecessarily
- [ ] No logic files touched
- [ ] No library added without reason (no Bootstrap, no Tailwind additions beyond what exists)

---

*Document generated from: original design prompt + live HTML preview implementation (`soochna-sahayak-preview.html`) + new design suggestions.*

*Apply to: Next.js + Tailwind CSS project · Soochna Sahayak (Smart Office Assistant)*
