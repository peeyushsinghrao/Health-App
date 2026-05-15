# Soochna Sahayak — Design System Gist
**Theme:** Warm Parchment Edition · Premium Government SaaS

---

## Colors

```
bg-base         #FAFAF5   warm off-white parchment
bg-surface      #FFFFFF   cards, panels, navbar
bg-elevated     #F4F3EC   inputs, table headers
bg-deep         #ECEADE   deepest layer

accent-primary  #1A5C38   forest green (brand)
accent-hover    #14472D   darker green on hover
accent-light    #E8F2EC   light green tint
accent-amber    #B45309   warm amber (warnings)

text-primary    #1C1917   near-black
text-secondary  #44403C   warm dark grey
text-muted      #A8A29E   placeholders, captions

border          #E2DFD5   default borders
border-strong   #C5BFB0   strong borders, tables

success  #16A34A   warning  #B45309   error  #DC2626
```

---

## Typography

| Role | Font | Notes |
|---|---|---|
| Headings | Lora (serif) | 600–700 weight, editorial |
| Body / UI | DM Sans (sans) | 400–600 weight, clean |
| Numbers / Code | JetBrains Mono | tabular, monospaced |
| Devanagari | Noto Sans/Serif Devanagari | inside A4 docs, 900 weight |

**Heading scale:** `clamp(4rem → 1.125rem)` across xl / lg / md / sm  
**Body scale:** `body-lg` 1.125rem → `body-md` 1rem → `body-sm` 0.875rem → `label-sm` 0.75rem uppercase

---

## Spacing & Radius

```
radius-sm   6px   inputs, small elements
radius-md  10px   buttons, badges
radius-lg  14px   cards, wrappers
radius-xl  20px   large panels
```

---

## Shadows

```
shadow-sm   subtle resting card
shadow-md   elevated elements
shadow-lg   hover cards, A4 preview
shadow-green   0 0 0 3px rgba(26,92,56,0.15)   focus ring
```

---

## Body / Global

- `3px solid #1A5C38` top border on `<body>`
- Paper grain texture via SVG `feTurbulence` at `opacity: 0.025`
- Text selection → green bg + white text
- Smooth scroll, antialiased fonts

---

## Buttons

| Variant | Style |
|---|---|
| primary | solid green, white text, green shadow, lifts on hover |
| secondary | transparent, grey border → green on hover |
| ghost | light-green fill, green text |
| danger | transparent, red border/text, light-red hover |
| excel | transparent, #16A34A border/text |
| All | radius 10px · font-weight 600 · white ripple on active |

---

## Cards

- White bg · 1px border · radius 14px · padding 32px
- Hover → `translateY(-4px)` + `shadow-lg` + green border
- Active → `scale(0.98)` + 100ms transition
- Decorative radial green glow in top-right corner
- Featured variant → 3px left green border

---

## Form Inputs

- bg: `#F4F3EC` · border: `#E2DFD5` · radius: 6px · padding: 10px 13px
- Focus → green border + `0 0 0 3px rgba(26,92,56,0.15)` ring + white bg

---

## Staff Attendance A4 Document

```
Paper size    1122 × 794 px  (A4 landscape)
Background    #FFFFFF
Shadow        0 6px 32px rgba(0,0,0,0.22)
Scaling       CSS transform scale((100vw - 96px) / 1122px)
Full size at  viewport ≥ 1218px
Print page    @page { size: A4 landscape; margin: 6mm; }
```

**Header:** Dept name 13pt/900 · Office 10pt/700 · double-rule border  
**Title:** "उपस्थिति पत्रक" 16pt/900 · underlined · centered  
**Table headers:** bg `#e8e4dc` · 6.5pt/700  
**Month headers:** bg `#d0cbbf`  
**Day cells:** 54px tall · vertical `writing-mode` dropdowns (5pt)  
**CL columns:** 50px · 5.5pt · `writing-mode: vertical-rl` rotated 180°  
**Certification:** 8pt/700 · centered · 1px solid #000 border  
**Signature:** bottom-right · 1.5px solid top line

---

## Animations

```
ease-out-expo       cubic-bezier(0.16, 1, 0.3, 1)       snappy exits
ease-spring         cubic-bezier(0.34, 1.56, 0.64, 1)   bounce/spring
ease-in-out-smooth  cubic-bezier(0.4, 0, 0.2, 1)        Material standard

pulse       3s infinite  — brand dot breathing
bounceDot   1.2s staggered (0/200/400ms) — loading dots
growRule    600ms delay 300ms — hero underline grows in
```

---

## Dark Mode

Activated via `[data-theme="dark"]` on `<html>`, saved to `localStorage`.

```
bg-base     #1A1917   bg-surface  #252220   bg-elevated  #2E2B28
text        #F5F0E8   borders     #3A3630   (green stays #1A5C38)
```

---

## Responsive

| Breakpoint | Change |
|---|---|
| ≤ 640px | Attendance form → single column, topbar stacks |
| ≤ 768px | Cards → single column, hero-title → 32px |
| 768–1024px | Cards → 2 columns, featured → full width |
| ≥ 1218px | A4 document renders at full 1:1 scale |

---

## Stack

`React + Vite · TypeScript · Tailwind CSS v4 · shadcn/ui · Lucide React`  
`Express 5 · Drizzle ORM · PostgreSQL · pnpm workspaces`  
`html2pdf.js · SheetJS — loaded from CDN at runtime`  
`Language: Hindi (hi) · Fonts: Google Fonts`
