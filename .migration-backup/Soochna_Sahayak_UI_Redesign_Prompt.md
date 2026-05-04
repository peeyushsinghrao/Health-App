# Soochna Sahayak — Light/Pastel UI Redesign
## Full Implementation Prompt · Web Portal (PC & Laptop Optimised) · May 2026

---

## Project Context

This is a vanilla HTML/CSS/JS web portal for generating government health reports (AHWC PLP reports).

| File | Role |
|------|------|
| `index.html` | Markup — form + A4 preview |
| `style.css` | All styles (this is the primary file to edit) |
| `script.js` | **DO NOT TOUCH** |

**Libraries in use:** `html2pdf.js` (CDN), Google Fonts (Noto Sans/Serif Devanagari).  
The portal renders a form panel + A4 document preview side by side on desktop. All Hindi/Devanagari text and JS logic must remain **100% untouched**.

> ⛔ **Do NOT change:** any form field IDs, JS logic in `script.js`, PDF generation, `.doc-page` internal HTML, table structure, or Hindi copy text.

---

## Phase 1 — Design Token Overhaul
### `style.css` — `:root` block

Replace the existing `:root` variables with this complete pastel design system.

Add this font import at the very **top** of `style.css` (alongside the existing Noto import):

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
```

Then replace the `:root` block:

```css
:root {
  /* — Base Backgrounds — */
  --bg-page:        #f0f4f8;       /* cool-slate page wash */
  --bg-surface:     #ffffff;       /* card / panel surface */
  --bg-elevated:    #f8fafc;       /* table rows, input bg */
  --bg-muted:       #eef2f7;       /* secondary panels */

  /* — Brand — Sage Green (replaces forest green) — */
  --green:          #3d7a5e;       /* primary brand */
  --green-mid:      #5a9e80;       /* mid tone */
  --green-light:    #d4eddf;       /* tint / fills */
  --green-xlight:   #edf7f1;       /* very light fill */

  /* — Pastel Accents — */
  --accent-blue:    #5b8def;       /* links, info states */
  --accent-amber:   #e09b2f;       /* percentage cells, warnings */
  --accent-rose:    #e05c6a;       /* delete / error */
  --accent-violet:  #7b6ff0;       /* secondary badges */

  /* — Borders — */
  --border-default: #dce4ed;
  --border-strong:  #b8c8d8;
  --border-focus:   #5a9e80;

  /* — Typography — */
  --text-primary:   #1a2332;
  --text-secondary: #4a5568;
  --text-muted:     #8a98a8;
  --text-on-green:  #ffffff;

  /* — Shadows — */
  --shadow-card:    0 2px 12px rgba(61,122,94,.08), 0 1px 3px rgba(0,0,0,.06);
  --shadow-lifted:  0 8px 28px rgba(61,122,94,.12), 0 2px 8px rgba(0,0,0,.08);
  --shadow-inset:   inset 0 1px 3px rgba(0,0,0,.06);

  /* — Radius — */
  --r-sm:  6px;
  --r-md:  10px;
  --r-lg:  14px;
  --r-xl:  20px;

  /* — Fonts — */
  --font-main: 'Noto Sans Devanagari', sans-serif;
  --font-doc:  'Noto Serif Devanagari', 'Noto Sans Devanagari', serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
}
```

---

## Phase 2 — Page Layout & Body

```css
html, body {
  min-height: 100vh;
  background: var(--bg-page);
  font-family: var(--font-main);
  color: var(--text-primary);
}

/* Subtle grid texture on page background */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(61,122,94,.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(61,122,94,.025) 1px, transparent 1px);
  background-size: 32px 32px;
}

.outer-wrap {
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 1;
}

/* PC / Laptop: side-by-side layout */
@media (min-width: 1024px) {
  .outer-wrap {
    padding: 24px 28px;
    max-width: 1500px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(580px, 1fr) minmax(420px, 640px);
    grid-template-rows: auto;
    align-items: start;
    gap: 24px;
  }
  .form-panel   { grid-column: 1; }
  .preview-wrap { grid-column: 2; }
}

@media (min-width: 1400px) {
  .outer-wrap {
    grid-template-columns: 1fr 680px;
    padding: 28px 36px;
  }
}
```

---

## Phase 3 — Top Page Header Bar
### HTML change in `index.html`

Add this block **before** the `<div class="outer-wrap">` tag:

```html
<!-- PAGE HEADER -->
<header class="page-header no-print">
  <div class="page-header-inner">
    <div class="header-brand">
      <div class="header-logo"><span>✦</span></div>
      <div class="header-brand-text">
        <span class="header-title">Soochna Sahayak</span>
        <span class="header-tagline">Smart Office Assistant · Ayurveda Dept</span>
      </div>
    </div>
    <div class="header-meta">
      <span class="header-badge">AHWC PLP Report</span>
      <span class="header-version">v2.0</span>
    </div>
  </div>
</header>
```

### CSS for the header

```css
.page-header {
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-default);
  box-shadow: 0 1px 8px rgba(61,122,94,.07);
  position: sticky;
  top: 0;
  z-index: 100;
}
.page-header-inner {
  max-width: 1500px;
  margin: 0 auto;
  padding: 10px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-brand { display: flex; align-items: center; gap: 12px; }
.header-logo {
  width: 36px; height: 36px; border-radius: 9px;
  background: linear-gradient(135deg, var(--green-light), var(--green-xlight));
  border: 1.5px solid var(--green-light);
  display: flex; align-items: center; justify-content: center;
  color: var(--green); font-size: 1rem;
  box-shadow: 0 2px 8px rgba(61,122,94,.15);
}
.header-title {
  display: block; font-size: .95rem; font-weight: 700;
  color: var(--text-primary); letter-spacing: -.01em;
}
.header-tagline {
  display: block; font-size: .68rem; color: var(--text-muted);
  margin-top: 1px;
}
.header-meta { display: flex; align-items: center; gap: 10px; }
.header-badge {
  font-size: .65rem; font-weight: 700; letter-spacing: .07em;
  text-transform: uppercase; padding: 3px 10px; border-radius: 999px;
  background: var(--green-light); color: var(--green);
  border: 1px solid rgba(61,122,94,.2);
}
.header-version {
  font-size: .65rem; color: var(--text-muted);
  font-family: var(--font-mono);
}
```

---

## Phase 4 — Form Panel

```css
.form-panel {
  background: var(--bg-surface);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-default);
  overflow: hidden;
  transition: box-shadow .2s;
}
.form-panel:focus-within {
  box-shadow: var(--shadow-lifted);
  border-color: var(--border-focus);
}

/* Panel header — pastel sage gradient */
.form-panel-header {
  background: linear-gradient(135deg, var(--green) 0%, var(--green-mid) 100%);
  color: var(--text-on-green);
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: .92rem;
  font-weight: 700;
  letter-spacing: -.01em;
  border-bottom: 1px solid rgba(255,255,255,.15);
}
.form-panel-header span:first-child {
  width: 28px; height: 28px; border-radius: 7px;
  background: rgba(255,255,255,.15);
  display: flex; align-items: center; justify-content: center;
  font-size: .85rem; flex-shrink: 0;
}

.form-inner { padding: 20px 22px; }

/* Error box */
.err-box {
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: var(--r-sm);
  padding: 10px 14px;
  color: var(--accent-rose);
  font-size: .82rem;
  margin-bottom: 14px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.err-box::before { content: '⚠'; flex-shrink: 0; }
```

---

## Phase 5 — Field Grid & Inputs

```css
.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
  margin-bottom: 20px;
}
@media (max-width: 520px) { .field-grid { grid-template-columns: 1fr; } }

.field-group { display: flex; flex-direction: column; gap: 5px; }

.field-group label {
  font-size: .74rem;
  font-weight: 700;
  color: var(--text-secondary);
  letter-spacing: .02em;
  text-transform: uppercase;
}

.field-group input,
.field-group select {
  border: 1.5px solid var(--border-default);
  border-radius: var(--r-sm);
  padding: 9px 12px;
  font-size: .86rem;
  font-family: var(--font-main);
  color: var(--text-primary);
  background: var(--bg-elevated);
  transition: border-color .2s, box-shadow .2s, background .2s;
  box-shadow: var(--shadow-inset);
}
.field-group input:hover,
.field-group select:hover {
  border-color: var(--border-strong);
  background: var(--bg-surface);
}
.field-group input:focus,
.field-group select:focus {
  outline: none;
  border-color: var(--border-focus);
  background: var(--bg-surface);
  box-shadow: 0 0 0 3px rgba(90,158,128,.12), var(--shadow-inset);
}

/* Section labels */
.sec-label {
  font-size: .82rem;
  font-weight: 700;
  color: var(--green);
  background: var(--green-xlight);
  border: 1px solid var(--green-light);
  border-radius: var(--r-sm);
  padding: 7px 12px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -.01em;
}
```

---

## Phase 6 — Input Tables

```css
.tbl-scroll {
  overflow-x: auto;
  margin-bottom: 16px;
  border-radius: var(--r-md);
  border: 1px solid var(--border-default);
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
}

.inp-table {
  width: 100%;
  border-collapse: collapse;
  font-size: .78rem;
  font-family: var(--font-main);
  min-width: 600px;
}

/* Table header */
.inp-table thead th {
  background: linear-gradient(180deg, var(--green) 0%, var(--green-mid) 100%);
  color: var(--text-on-green);
  padding: 9px 8px;
  text-align: center;
  border: none;
  border-right: 1px solid rgba(255,255,255,.12);
  font-weight: 700;
  white-space: nowrap;
  font-size: .72rem;
  letter-spacing: .01em;
}
.inp-table thead th:last-child { border-right: none; }

/* Table body */
.inp-table tbody td {
  border-bottom: 1px solid var(--border-default);
  border-right: 1px solid var(--border-default);
  padding: 3px;
  text-align: center;
  vertical-align: middle;
}
.inp-table tbody td:last-child { border-right: none; }
.inp-table tbody tr:nth-child(even) { background: var(--bg-elevated); }
.inp-table tbody tr:hover { background: var(--green-xlight); }
.inp-table tbody tr:hover td { border-color: var(--green-light); }

/* Table cell inputs */
.inp-table td input,
.inp-table td select {
  width: 100%;
  border: 1.5px solid transparent;
  padding: 5px;
  font-size: .76rem;
  font-family: var(--font-main);
  background: transparent;
  text-align: center;
  color: var(--text-primary);
  border-radius: 4px;
  transition: border-color .15s, background .15s;
}
.inp-table td input:focus,
.inp-table td select:focus {
  outline: none;
  border-color: var(--border-focus);
  background: var(--bg-surface);
  box-shadow: 0 0 0 2px rgba(90,158,128,.1);
}

/* Special cells */
.sno {
  background: var(--green-xlight);
  font-weight: 700;
  color: var(--green-mid);
  width: 30px;
  text-align: center;
  font-family: var(--font-mono);
  font-size: .72rem;
}
.karya-name { text-align: left; padding: 4px 8px; font-size: .75rem; }
.pct-cell   { background: #fffbeb; font-weight: 700; color: var(--accent-amber); font-family: var(--font-mono); }
.rashi-cell { font-weight: 700; color: var(--green); font-family: var(--font-mono); }

/* Table footer */
.inp-table tfoot td {
  background: var(--green-light);
  border-top: 2px solid var(--green-mid);
  border-bottom: none;
  font-size: .78rem;
  padding: 7px 6px;
  font-weight: 700;
  color: var(--green);
}
```

---

## Phase 7 — Buttons

```css
/* Add Row Button */
.add-row-btn {
  background: var(--bg-surface);
  color: var(--green);
  border: 1.5px dashed var(--green-mid);
  padding: 7px 18px;
  border-radius: var(--r-sm);
  cursor: pointer;
  font-size: .8rem;
  font-family: var(--font-main);
  margin-bottom: 18px;
  transition: all .2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.add-row-btn::before { content: '+'; font-weight: 900; font-size: .9rem; }
.add-row-btn:hover {
  background: var(--green-xlight);
  border-color: var(--green);
  border-style: solid;
  box-shadow: 0 2px 8px rgba(61,122,94,.12);
}

/* Remove Button */
.rm-btn {
  background: #fef2f2;
  color: var(--accent-rose);
  border: 1px solid #fca5a5;
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: .68rem;
  font-family: var(--font-main);
  transition: all .15s;
}
.rm-btn:hover { background: var(--accent-rose); color: #fff; border-color: var(--accent-rose); }
.rm-btn:disabled {
  background: var(--bg-muted); color: var(--text-muted);
  border-color: var(--border-default); cursor: not-allowed;
}

/* Button Row */
.gen-btn-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 6px;
  border-top: 1px solid var(--border-default);
  margin-top: 6px;
}

/* Primary: PDF */
.btn-pdf {
  background: linear-gradient(135deg, var(--green) 0%, var(--green-mid) 100%);
  color: var(--text-on-green);
  border: none;
  padding: 10px 28px;
  border-radius: var(--r-sm);
  cursor: pointer;
  font-size: .9rem;
  font-family: var(--font-main);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 3px 12px rgba(61,122,94,.25);
  transition: all .2s;
}
.btn-pdf:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(61,122,94,.32);
}
.btn-pdf:active { transform: translateY(0); box-shadow: 0 2px 8px rgba(61,122,94,.2); }

/* Secondary buttons */
.btn-secondary {
  background: var(--bg-surface);
  color: var(--green);
  border: 1.5px solid var(--green-mid);
  padding: 9px 20px;
  border-radius: var(--r-sm);
  cursor: pointer;
  font-size: .88rem;
  font-family: var(--font-main);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 7px;
  transition: all .2s;
}
.btn-secondary:hover {
  background: var(--green-xlight);
  box-shadow: 0 2px 10px rgba(61,122,94,.12);
}
```

---

## Phase 8 — A4 Preview Panel (Right Column on Desktop)

```css
/* Preview column wrapper */
.preview-wrap {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: sticky;
  top: 72px;              /* clears the sticky header height */
  max-height: calc(100vh - 88px);
  overflow: hidden;
}

/* Preview header bar */
.preview-label {
  font-size: .78rem;
  font-weight: 700;
  color: var(--text-secondary);
  background: var(--bg-surface);
  padding: 10px 16px;
  border-radius: var(--r-md) var(--r-md) 0 0;
  border: 1px solid var(--border-default);
  border-bottom: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2px 8px rgba(0,0,0,.04);
}
.preview-label::before {
  content: 'DOCUMENT PREVIEW';
  font-size: .62rem; font-weight: 700; letter-spacing: .1em;
  text-transform: uppercase; color: var(--text-muted);
}
.preview-label::after {
  content: '● Ready';
  font-size: .62rem; font-weight: 700;
  color: var(--green-mid); letter-spacing: .04em;
}

/* A4 scaler — the mount around the white paper */
.a4-scaler {
  width: 100%;
  overflow: auto;
  display: flex;
  justify-content: center;
  padding: 16px;
  border-radius: 0 0 var(--r-md) var(--r-md);
  border: 1px solid var(--border-default);
  border-top: none;
  flex: 1;
  background-image:
    linear-gradient(135deg, #dce4ed 0%, #e8edf3 100%),
    repeating-conic-gradient(rgba(255,255,255,.3) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px;
}

/* The A4 paper — extra shadow for physical depth */
.doc-page {
  box-shadow:
    0 4px 0 rgba(0,0,0,.08),
    0 8px 24px rgba(0,0,0,.12),
    0 1px 0 rgba(255,255,255,.8) inset;
  /* ⚠ Keep all existing transform/scale rules — do NOT remove them */
}
```

---

## Phase 9 — Loading Overlay

```css
.overlay {
  position: fixed; inset: 0;
  background: rgba(240,244,248,.75);
  backdrop-filter: blur(6px);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.overlay.active { display: flex; }
.overlay-box {
  background: var(--bg-surface);
  padding: 28px 36px;
  border-radius: var(--r-lg);
  text-align: center;
  font-family: var(--font-main);
  font-size: .9rem;
  font-weight: 700;
  color: var(--green);
  border: 1px solid var(--green-light);
  box-shadow: var(--shadow-lifted);
}
.spin {
  width: 32px; height: 32px;
  border: 3px solid var(--green-light);
  border-top-color: var(--green-mid);
  border-radius: 50%;
  animation: spin .7s linear infinite;
  margin: 0 auto 12px;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

---

## Phase 10 — Footer

```css
.screen-footer {
  text-align: center;
  font-size: .7rem;
  color: var(--text-muted);
  padding: 12px;
  font-family: var(--font-main);
  border-top: 1px solid var(--border-default);
  background: var(--bg-surface);
  grid-column: 1 / -1;   /* span both grid columns */
}
```

---

## Phase 11 — Responsive Rules (Complete)

```css
/* Tablet — single column */
@media (max-width: 1023px) {
  .outer-wrap {
    display: flex;
    flex-direction: column;
    padding: 14px;
    gap: 16px;
  }
  .preview-wrap { position: static; max-height: none; }
  .preview-wrap .a4-scaler {
    padding: 10px;
    border-radius: 0 0 var(--r-md) var(--r-md);
  }
}

/* Phablet / Large phone */
@media (max-width: 600px) {
  .page-header-inner        { padding: 10px 14px; }
  .header-tagline           { display: none; }
  .form-inner               { padding: 14px; }
  .field-grid               { grid-template-columns: 1fr; }
  .gen-btn-row              { flex-direction: column; }
  .btn-pdf, .btn-secondary  { width: 100%; justify-content: center; }
  .sec-label                { font-size: .76rem; }
}

/* Wide Desktop — more whitespace */
@media (min-width: 1600px) {
  .outer-wrap {
    max-width: 1600px;
    grid-template-columns: 1fr 720px;
    padding: 32px 48px;
    gap: 28px;
  }
}
```

---

## Phase 12 — Micro-Detail Polish

```css
/* Scrollbar */
::-webkit-scrollbar             { width: 8px; height: 8px; }
::-webkit-scrollbar-track       { background: var(--bg-page); }
::-webkit-scrollbar-thumb       { background: var(--border-strong); border-radius: 999px; }
::-webkit-scrollbar-thumb:hover { background: var(--green-mid); }

/* Selection highlight */
::selection { background: var(--green-light); color: var(--green); }

/* Accessibility focus ring */
:focus-visible { outline: 2px solid var(--border-focus); outline-offset: 2px; }

/* Smooth transitions globally */
button, input, select, a {
  transition: color .15s, background .15s, border-color .15s, box-shadow .15s;
}
```

---

## Phase 13 — Print Media

```css
@media print {
  .no-print        { display: none !important; }
  .page-header     { display: none !important; }
  body             { background: #fff; }
  body::before     { display: none; }
  .outer-wrap      { padding: 0; gap: 0; display: block; }
  .a4-scaler       { background: #fff; padding: 0; border: none; }
  .doc-page {
    transform: none !important;
    margin-bottom: 0 !important;
    border: none;
    width: 100%;
    min-height: unset;
    padding: 8mm 10mm;
    box-shadow: none;
  }
}
```

---

## ⚠ Preserve List — Do NOT Change

| Item | Why |
|------|-----|
| All `.doc-page` internal CSS | Controls the printable A4 document |
| `.doc-tbl`, `.doc-tbl-sm`, `.doc-header`, `.doc-certify`, `.doc-sig` | Document structure |
| All JS in `script.js` | Field population, PDF generation, table rows |
| Form field IDs (`#ahwc-name`, `#jila`, `#maah`, `#varsh`, `#karya-tbody`…) | JS depends on these |
| All Hindi/Devanagari text in `index.html` | Content copy |
| `html2pdf.js` CDN reference | PDF generation |
| Google Noto fonts import | Hindi text rendering |
| `.doc-page` `transform`/`scale` rules | Critical for A4 fit in viewport |

---

## Optional Enhancement — Stats Strip

Add inside `.form-inner`, before `.field-grid`, in `index.html`:

```html
<div class="stats-strip no-print">
  <div class="stat-chip">
    <span class="sc-val">A4</span>
    <span class="sc-lbl">PDF Export</span>
  </div>
  <div class="stat-chip">
    <span class="sc-val">2</span>
    <span class="sc-lbl">Tables</span>
  </div>
  <div class="stat-chip sc-active">
    <span class="sc-val">●</span>
    <span class="sc-lbl">Ready</span>
  </div>
</div>
```

```css
.stats-strip {
  display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;
}
.stat-chip {
  display: flex; align-items: center; gap: 6px;
  background: var(--bg-elevated); border: 1px solid var(--border-default);
  border-radius: 999px; padding: 4px 12px;
  font-size: .7rem; color: var(--text-muted);
}
.sc-val { font-weight: 700; color: var(--text-secondary); font-family: var(--font-mono); }
.stat-chip.sc-active .sc-val { color: var(--green-mid); }
.sc-lbl { font-size: .65rem; }
```

---

## Summary — Files to Edit

| File | Changes |
|------|---------|
| `style.css` | Full rewrite of all CSS rules — keep `.doc-page` and `@media print` blocks |
| `index.html` | Add `<header class="page-header">` above `.outer-wrap`; optionally add stats-strip inside `.form-inner` |
| `script.js` | **No changes** |

---

*Soochna Sahayak · Light/Pastel Redesign · PC & Laptop Optimised · May 2026*
