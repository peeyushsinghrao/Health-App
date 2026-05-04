# Soochna Sahayak — Fix & Feature Prompt (v3)
**5 Changes · Staff Attendance PDF Format · PLP Keyboard Bug · UI Optimization · Excel Export · Print**

> Give this entire document as a prompt to your AI coding assistant (Gemini / Windsurf / Cursor).
> Read all sections carefully before writing any code.

---

## ⚠️ ABSOLUTE NON-NEGOTIABLE RULES

1. **Do NOT break any existing working feature** — PLP PDF, Staff Attendance table, home screen navigation, back buttons.
2. **Do NOT modify any Hindi text** — reproduce every word exactly as-is.
3. **Do NOT change any design tokens** (colors, fonts, spacing) from the Warm Parchment design system already applied.
4. **Do NOT modify logic files** — only UI, formatting, and the specific bugs listed below.
5. **Do NOT simplify or skip any requirement** — implement every point fully.
6. **Every file you output must be COMPLETE** — no `...` placeholders, no `// rest remains same`.

---

## CHANGE 1 — Staff Attendance PDF Output Format

### Problem
The generated PDF for Staff Attendance does not match the required official government format.

### Required Format (based on uploaded reference PDF)
The PDF output must match **exactly** this structure:

---

#### Page Orientation
`A4 Landscape` — this is already set, keep it.

#### Document Structure (top to bottom, in exact order):

**Line 1 — Department (center, bold):**
```
आयुर्वेद विभाग
```

**Line 2 — Office Name (center):**
```
कार्यालय राजकीय [office name from input field]
```

**Line 3 — Two-column row:**
- Left: `क्रमांक - उपस्थिति / [kramank value]`
- Right: `दिनांक [selected date formatted as DD.MM.YYYY]`

**Line 4 — Title (center, bold, large, extra vertical spacing above AND below):**
```
उपस्थिति पत्रक
```

**Line 5 — Period (left-aligned, just above table):**
```
उपस्थिति अवधि [from-date] से [to-date] तक
```
Example: `उपस्थिति अवधि 11.04.2026 से 10.05.2026 तक`

---

#### Table Structure (CRITICAL — match reference PDF exactly)

The table must have these columns **in this exact order**:

| Column | Header | Notes |
|--------|--------|-------|
| 1 | क्र.सं. | Serial number, auto |
| 2 | नाम कार्मिक मय पद | Staff name + designation |
| 3..N | Date columns split by month | See below |
| N+1 | उपस्थिति पत्रक अवधि में लिए गए आकस्मिक अवकाश का योग | Auto-calculated |
| N+2 | पूर्व उपस्थिति पत्रक तक लिए गए आकस्मिक अवकाश का योग | Manual input |
| N+3 | अब तक कुल लिए आकस्मिक अवकाश का योग | Auto = N+1 + N+2 |

#### Month Header Split (reference PDF style)
The date columns must be **grouped under month sub-headers**. Example for period 11 April – 10 May:

```
┌─────────────────────────────────────────────────────────┐
│              माह - अप्रैल 2026    │  माह - मई 2026      │
├────┬──────┬──────┬──────┬──────┬──────┬──────┬──────────┤
│    │  11  │  12  │  13  │ ...  │  30  │   1  │  2  ...  │
```

- Group date columns under their respective month header
- Month header spans all date columns for that month
- Use `colspan` in HTML table for month header cells
- Date numbers only (no year/month in individual column headers) — just `11`, `12`, `13`...
- Font size for date columns in PDF: minimum `7pt` to fit landscape A4

#### Attendance Cell Values in PDF
In the PDF/print output, each attendance cell shows the **selected attendance status text**:
- Replace `<select>` with `<span>` showing selected value before PDF generation
- Restore `<select>` after PDF generation
- In the reference PDF format, short abbreviations are acceptable:
  - `उपस्थित` → `उपस्थित`
  - `Day Off` → `Day Off`
  - `आकस्मिक अव.` → `आकस्मिक अव.` (abbreviated to fit)
  - All other values: show full text

#### Leave Count Columns in PDF
The last 3 columns must show:
- N+1: Auto-counted आकस्मिक अवकाश count (read-only)
- N+2: Manually entered previous period count
- N+3: Total (N+1 + N+2) — auto-calculated

These 3 columns must have **vertical text headers** (CSS `writing-mode: vertical-rl; transform: rotate(180deg)`) in the PDF to save horizontal space, matching the reference document style.

---

#### Below Table (in order):

**Note section** (only if note is not empty):
```
नोट : [note text]
```

**Certification Text** (center, bold):
```
प्रमाणित किया जाता है कि उपस्थिति पत्रक का मिलान उपस्थिति पंजिका से कर लिया गया है, साथ ही कोई भी कार्मिक बिना सक्षम स्तर से अवकाश स्वीकृत कराए उपस्थिति पत्रक में उल्लिखित अवधि के दौरान अनुपस्थित नहीं रहा है।
```

**Signature Block** (bottom-right):
```
हस्ताक्षर प्रभारी
[office name from input field]  ← appears in seal area
```

---

#### PDF Generation Settings
Use `html2pdf.js` with these exact settings:
```js
{
  margin: [5, 5, 5, 5],
  filename: `Upasthiti_Patrak_${fromDate}_${toDate}.pdf`,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: {
    scale: 2,
    useCORS: true,
    letterRendering: true,
    scrollY: 0,
    windowWidth: 1200
  },
  jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
  pagebreak: { mode: 'avoid-all' }
}
```

#### Print CSS for Staff Attendance
```css
@media print {
  body * { visibility: hidden; }
  #att-doc-page, #att-doc-page * { visibility: visible; }
  #att-doc-page {
    position: absolute; left: 0; top: 0;
    width: 100%;
    transform: none !important;
    box-shadow: none;
    border: none;
    margin: 0 !important;
  }
  @page { size: A4 landscape; margin: 8mm; }
  select { display: none !important; }
  .att-print-span { display: inline !important; }
  .att-doc-page table { font-size: 7pt; border-collapse: collapse; }
  .att-doc-page td, .att-doc-page th { border: 1px solid #000; padding: 2px 3px; }
}
```

---

## CHANGE 2 — PLP Mobile Keyboard Bug Fix

### Problem
On mobile, when typing a number in any PLP form input field (e.g., target/achievement fields), after typing a single digit the mobile keyboard dismisses automatically. The user then has to tap the field again to continue typing — making it impossible to type multi-digit numbers smoothly.

### Root Cause
This is caused by one of:
- The input field losing focus due to a re-render triggered by an `onChange` state update
- The input type being `number` with aggressive mobile browser behavior
- Incorrect `key` prop causing React to re-mount the input on every keystroke

### Fix — Implement ALL of these:

#### Fix 2a — Use `inputMode` instead of `type="number"`
```jsx
// WRONG — causes keyboard dismiss on some mobile browsers:
<input type="number" ... />

// CORRECT — keeps keyboard open, allows decimal/negative:
<input
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  ...
/>
```

#### Fix 2b — Stable `key` Props
Ensure NO input field in the PLP form has a dynamic `key` prop that changes on every render.
```jsx
// WRONG:
<input key={Math.random()} ... />
<input key={`field-${value}`} ... />

// CORRECT:
<input key="plp-target-opd" ... />
// or no key at all if it's a static field
```

#### Fix 2c — Debounced State Updates
If the PLP form uses controlled inputs with `onChange` that triggers heavy re-renders (like live preview updates), debounce the preview update — NOT the input value:
```js
// Store raw input value in local state (immediate, no debounce)
const [localValue, setLocalValue] = useState(value);

// Debounce only the parent state / preview update
const debouncedUpdate = useCallback(
  debounce((v) => onUpdate(v), 300),
  []
);

const handleChange = (e) => {
  setLocalValue(e.target.value);      // immediate — keeps keyboard open
  debouncedUpdate(e.target.value);    // debounced — updates preview
};
```

#### Fix 2d — Prevent Blur on Preview Re-render
If the A4 preview panel re-renders when input changes and causes the whole form to re-render:
- Wrap the preview component in `React.memo()`
- Wrap the preview update function in `useCallback()`
- Use `useRef` to store preview content and update it via direct DOM manipulation instead of state

#### Fix 2e — Input Attributes for Mobile
Add these attributes to every numeric input in PLP:
```jsx
<input
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  autoComplete="off"
  autoCorrect="off"
  autoCapitalize="none"
  spellCheck={false}
  onFocus={(e) => e.target.select()}  // select all on focus for easy replacement
/>
```

#### Validation
After fix, verify:
- [ ] Type `1` → keyboard stays open → type `0` → field shows `10`
- [ ] Works on both Android Chrome and iOS Safari
- [ ] No input field loses focus mid-typing
- [ ] Percentage calculation still updates correctly after typing

---

## CHANGE 3 — UI Optimization for Mobile & PC

### Problem
UI has layout issues on both mobile and desktop that need fixing.

### Fix 3a — Mobile Optimizations

#### Navigation
```css
@media (max-width: 768px) {
  .nav-bar { padding: 10px 16px; }
  .nav-brand { font-size: 14px; }
  .nav-pill { display: none; } /* hide dept badge on small screens */
}
```

#### Hero Section
```css
@media (max-width: 768px) {
  .hero {
    display: flex;
    flex-direction: column;
    padding: 32px 16px 24px;
    gap: 0;
  }
  .hero-title { font-size: 32px; line-height: 1.15; }
  .hero-subtitle { font-size: 16px; }
  .hero-deco { display: none; }
  .hero-rule { width: 40px; }
}
```

#### Cards on Mobile
```css
@media (max-width: 768px) {
  .card-grid { grid-template-columns: 1fr; gap: 12px; }
  .card { padding: 20px; }
  .card-section { padding: 0 16px 80px; }
}
```

#### Form Panels on Mobile
```css
@media (max-width: 768px) {
  .form-panel { padding: 16px; border-radius: 12px; }
  .form-row { grid-template-columns: 1fr !important; gap: 14px; }
  .period-row { flex-wrap: wrap; gap: 8px; }
  .period-sep { width: 100%; text-align: center; }
}
```

#### Table on Mobile
```css
@media (max-width: 768px) {
  .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  table { min-width: 800px; } /* force scroll, don't compress */
  thead th { font-size: 9px; padding: 6px 8px; white-space: nowrap; }
  tbody td { padding: 6px 8px; font-size: 12px; }
  .select-wrap select { font-size: 11px; padding: 5px 24px 5px 8px; }
}
```

#### Sticky Action Bar (Mobile)
```css
@media (max-width: 768px) {
  .btn-row {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: var(--bg-surface);
    border-top: 1px solid var(--border);
    padding: 10px 16px;
    z-index: 50;
    flex-direction: row;  /* keep row but make buttons flex-1 */
    gap: 8px;
  }
  .btn { flex: 1; justify-content: center; font-size: 13px; padding: 10px 8px; }
  .btn svg { display: none; } /* hide icons on very small screens to save space */
}
@media (max-width: 360px) {
  .btn-row { flex-direction: column; }
}
/* Add padding to page content so sticky bar doesn't overlap last content */
.inner-page-wrap { padding-bottom: 90px; }
```

#### Touch Targets
All interactive elements (buttons, inputs, selects, card clickable areas) must have a minimum touch target of `44px` height:
```css
.btn { min-height: 44px; }
.field-input, .field-textarea, .select-wrap select { min-height: 44px; }
.card { min-height: 60px; }
```

---

### Fix 3b — Desktop Optimizations

#### Max-width Containers
```css
.hero, .card-section, .inner-page-wrap {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
```

#### Two-column Layout for Inner Pages (Desktop)
On desktop, show form panel on the left and A4 preview on the right:
```css
@media (min-width: 1024px) {
  .att-page-layout {
    display: grid;
    grid-template-columns: 420px 1fr;
    gap: 32px;
    align-items: flex-start;
  }
  .att-form-col { position: sticky; top: 80px; max-height: calc(100vh - 100px); overflow-y: auto; }
  .att-preview-col { min-width: 0; }
}
```

#### Scrollable Form Column
On desktop, the left form column should scroll independently while the right preview stays visible. Use `position: sticky` + `overflow-y: auto` on form column.

#### Card Grid (Desktop — 3 columns)
```css
@media (min-width: 1024px) {
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (768px <= width < 1024px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
  .card.featured { grid-column: 1 / -1; }
}
```

#### Hover States (Desktop only — prevent on touch)
```css
@media (hover: hover) {
  .card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
  .btn-primary:hover { transform: translateY(-1px); }
}
```

#### Typography Scaling
```css
@media (min-width: 1440px) {
  .hero-title { font-size: 60px; }
}
@media (max-width: 480px) {
  .hero-title { font-size: 28px; }
  .page-title { font-size: 20px; }
}
```

---

## CHANGE 4 — Make क्रमांक Field Optional in Staff Attendance

### Problem
The `क्रमांक - उपस्थिति /` field is currently required (validated before PDF/print). It should be optional.

### Fix

#### 4a — Remove Required Validation
In the validation logic before PDF/Print generation, remove any check for `att-kramank` being empty.

The only required fields for Staff Attendance are:
- ✅ कार्यालय का नाम (office name) — **required**
- ❌ क्रमांक — **now optional** (remove from required checks)
- ✅ उपस्थिति अवधि from + to dates — **required**
- ✅ At least one staff name — **required**

#### 4b — Update Input Placeholder
```jsx
<input
  type="text"
  id="att-kramank"
  placeholder="क्रमांक (वैकल्पिक)"  // "optional" in Hindi
/>
```

#### 4c — Update Label
```
क्रमांक - उपस्थिति /  (वैकल्पिक)
```
Add `(वैकल्पिक)` in small muted text next to the label — do NOT change the main label text.
```jsx
<label>
  क्रमांक - उपस्थिति /
  <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
    (वैकल्पिक)
  </span>
</label>
```

#### 4d — PDF Behavior When Empty
In the document preview and PDF:
- If क्रमांक has a value: show `क्रमांक - उपस्थिति / [value]`
- If क्रमांक is empty: show `क्रमांक - उपस्थिति /` with blank space after slash (do not hide the label)

---

## CHANGE 5 — Add Print in PLP + Excel Export in Staff Attendance

### Change 5a — Print Button for PLP

#### Where to Add
Add a "Print" button to the PLP action buttons row, between the Preview and Save PDF buttons:

**Button order (left to right):**
`👁 Preview` → `🖨 Print` → `💾 Save PDF`

#### Print Button Style
Use Tier 2 (Secondary) button from the design system:
```jsx
<button className="btn btn-secondary" onClick={handlePLPPrint}>
  <PrinterIcon size={16} />  {/* lucide-react */}
  Print
</button>
```

#### Print Logic for PLP
```js
function handlePLPPrint() {
  // Replace all inputs with their values for printing
  const inputs = document.querySelectorAll('.plp-doc-page input, .plp-doc-page select');
  const stored = [];
  inputs.forEach(el => {
    stored.push({ el, html: el.outerHTML });
    const span = document.createElement('span');
    span.textContent = el.value || el.options?.[el.selectedIndex]?.text || '';
    span.className = 'plp-print-span';
    el.parentNode.replaceChild(span, el);
  });

  window.print();

  // Restore inputs after print dialog closes
  // Use afterprint event to restore
  window.addEventListener('afterprint', function restoreInputs() {
    stored.forEach(({ el, html }) => {
      // Re-render inputs by re-triggering React state
    });
    window.removeEventListener('afterprint', restoreInputs);
  }, { once: true });
}
```

**Simpler approach (recommended):** Use a `isPrinting` state variable. When `true`, render all form values as `<span>` instead of `<input>`. Trigger `window.print()` after state update, then reset `isPrinting` to `false` on `afterprint` event.

```js
const [isPrinting, setIsPrinting] = useState(false);

function handlePLPPrint() {
  setIsPrinting(true);
  setTimeout(() => {
    window.print();
    window.addEventListener('afterprint', () => setIsPrinting(false), { once: true });
  }, 100); // Small delay to let React re-render
}
```

#### Print CSS for PLP
```css
@media print {
  body * { visibility: hidden; }
  .plp-doc-page, .plp-doc-page * { visibility: visible; }
  .plp-doc-page {
    position: absolute; left: 0; top: 0;
    width: 100%;
    transform: none !important;
    box-shadow: none;
    border: none;
  }
  @page { size: A4 portrait; margin: 10mm; }
  .plp-print-span { display: inline; }
  input, select { display: none; }
}
```

---

### Change 5b — Excel Export for Staff Attendance

#### Where to Add
Add an "Excel" export button to the Staff Attendance action buttons row:

**Button order (left to right):**
`👁 Preview` → `🖨 Print` → `📊 Excel` → `💾 Save PDF`

#### Button Style
Use a new Tier 2 variant with amber/green tint:
```jsx
<button className="btn btn-excel" onClick={handleExcelExport}>
  <TableIcon size={16} />
  Excel
</button>
```

```css
.btn-excel {
  background: transparent;
  border: 1px solid #16A34A;
  color: #16A34A;
  padding: 11px 20px;
  border-radius: var(--radius-md);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  transition: all 150ms ease;
}
.btn-excel:hover {
  background: #F0FDF4;
  border-color: #14532D;
  color: #14532D;
}
```

#### Excel Export Library
Use **SheetJS (xlsx)** — load via CDN if not already installed:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
```
Or import in Next.js:
```bash
npm install xlsx
```
```js
import * as XLSX from 'xlsx';
```

#### Excel Export Logic — Full Implementation
```js
function handleExcelExport() {
  const wb = XLSX.utils.book_new();

  // ── Build header rows ──────────────────────────────────────
  // Row 1: आयुर्वेद विभाग (merged across all columns)
  // Row 2: कार्यालय राजकीय [office name]
  // Row 3: क्रमांक (left) | दिनांक (right)
  // Row 4: उपस्थिति पत्रक (merged, centered)
  // Row 5: उपस्थिति अवधि [from] से [to] तक

  const officeNameVal = document.getElementById('att-office-name')?.value || '';
  const kramankVal    = document.getElementById('att-kramank')?.value || '';
  const dateVal       = document.getElementById('att-date')?.value || '';
  const fromDate      = document.getElementById('att-period-from')?.value || '';
  const toDate        = document.getElementById('att-period-to')?.value || '';

  // ── Generate date range array ──────────────────────────────
  function getDatesInRange(from, to) {
    const dates = [];
    let current = new Date(from);
    const end = new Date(to);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }
  const dates = getDatesInRange(fromDate, toDate);

  // ── Build column headers ───────────────────────────────────
  // Format: DD only (e.g., 11, 12, 13...)
  const dateHeaders = dates.map(d => d.getDate().toString());

  // ── Collect staff data ─────────────────────────────────────
  const staffRows = document.querySelectorAll('.att-staff-row');
  const dataRows = [];

  staffRows.forEach((row, idx) => {
    const nameInput = row.querySelector('.att-name-input');
    const selects   = row.querySelectorAll('.att-day-select');
    const prevLeave = row.querySelector('.att-prev-leave')?.value || '0';
    const alLeave   = row.querySelector('.att-al-count')?.textContent || '0';
    const totalLeave = parseInt(alLeave) + parseInt(prevLeave);

    const rowData = [
      idx + 1,                        // क्र.सं.
      nameInput?.value || '',          // नाम
      ...Array.from(selects).map(s => s.value), // attendance per day
      parseInt(alLeave),               // N+1
      parseInt(prevLeave),             // N+2
      totalLeave                       // N+3
    ];
    dataRows.push(rowData);
  });

  // ── Assemble worksheet data ────────────────────────────────
  const totalCols = 2 + dateHeaders.length + 3; // क्र.सं + नाम + dates + 3 leave cols

  const wsData = [
    // Row 1: Department
    ['आयुर्वेद विभाग'],
    // Row 2: Office
    [`कार्यालय राजकीय ${officeNameVal}`],
    // Row 3: Kramank + Date
    [`क्रमांक - उपस्थिति / ${kramankVal}`, ...Array(totalCols - 2).fill(''), `दिनांक ${dateVal}`],
    // Row 4: Title
    ['उपस्थिति पत्रक'],
    // Row 5: Period
    [`उपस्थिति अवधि ${fromDate} से ${toDate} तक`],
    // Row 6: Empty spacer
    [],
    // Row 7: Column headers
    [
      'क्र.सं.',
      'नाम कार्मिक मय पद',
      ...dateHeaders,
      'उपस्थिति पत्रक अवधि में लिए गए आकस्मिक अवकाश का योग',
      'पूर्व उपस्थिति पत्रक तक लिए गए आकस्मिक अवकाश का योग',
      'अब तक कुल लिए आकस्मिक अवकाश का योग'
    ],
    // Data rows
    ...dataRows,
    // Empty row
    [],
    // Certification text
    ['प्रमाणित किया जाता है कि उपस्थिति पत्रक का मिलान उपस्थिति पंजिका से कर लिया गया है, साथ ही कोई भी कार्मिक बिना सक्षम स्तर से अवकाश स्वीकृत कराए उपस्थिति पत्रक में उल्लिखित अवधि के दौरान अनुपस्थित नहीं रहा है।'],
    [],
    // Signature
    [...Array(totalCols - 1).fill(''), 'हस्ताक्षर प्रभारी'],
    [...Array(totalCols - 1).fill(''), officeNameVal],
  ];

  // ── Create worksheet ───────────────────────────────────────
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // ── Merges ────────────────────────────────────────────────
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } }, // Row 1: dept
    { s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } }, // Row 2: office
    { s: { r: 3, c: 0 }, e: { r: 3, c: totalCols - 1 } }, // Row 4: title
    { s: { r: 4, c: 0 }, e: { r: 4, c: totalCols - 1 } }, // Row 5: period
  ];

  // ── Column widths ─────────────────────────────────────────
  ws['!cols'] = [
    { wch: 6 },   // क्र.सं.
    { wch: 30 },  // नाम
    ...dateHeaders.map(() => ({ wch: 8 })),  // date columns
    { wch: 20 }, { wch: 20 }, { wch: 16 }  // leave count cols
  ];

  // ── Add sheet to workbook ─────────────────────────────────
  XLSX.utils.book_append_sheet(wb, ws, 'उपस्थिति पत्रक');

  // ── Save file ─────────────────────────────────────────────
  const fileName = `Upasthiti_Patrak_${fromDate}_${toDate}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
```

#### Validation Before Excel Export
Same validation as PDF:
- Office name must not be empty
- Period from + to must be selected
- from ≤ to
- At least one staff name entered
Show same error messages in `.err-box`.

---

## 🆕 New Suggestions — Premium UI Enhancements (Add to Gemini Prompt)

> These are design upgrades not in the original prompt. These are **purely additive** — they do not change any functionality, logic, or Hindi text. Implement them alongside the 5 changes above for a truly exceptional output.
> **Do NOT skip any of these.** Apply all 12 in one pass.

---

### 19.1 Navbar Slide-Down Animation
The navbar should animate down into view on page load instead of appearing instantly.

```css
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-100%); }
  to   { opacity: 1; transform: translateY(0); }
}
.nav-bar { animation: slideDown 500ms ease both; }
```

---

### 19.2 Live Green Pulse Dot in Navbar Brand
Add a small pulsing green dot next to the brand name — signals "system active" to the user. Very subtle but premium.

```css
/* Add a <span class="nav-brand-dot"></span> inside .nav-brand, before the text */
.nav-brand-dot {
  width: 8px;
  height: 8px;
  background: var(--accent-primary);
  border-radius: 50%;
  flex-shrink: 0;
  animation: pulse 3s ease infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(26,92,56,0.4); }
  50%       { box-shadow: 0 0 0 6px rgba(26,92,56,0); }
}
```

---

### 19.3 Button Click Ripple Effect
Every button should have a ripple/ink-spread effect when clicked. Makes the UI feel physically responsive — very Apple-like.

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

Apply to: ALL buttons (`.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-excel`, `.add-row-btn`).

---

### 19.4 Table Row Slide-in Animation
Each staff attendance table row should slide in slightly from the left on page load — gives the table an editorial, data-journalism feel.

```css
@keyframes rowSlide {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}
tbody tr:nth-child(1) { animation: rowSlide 300ms ease both; animation-delay: 50ms; }
tbody tr:nth-child(2) { animation: rowSlide 300ms ease both; animation-delay: 100ms; }
tbody tr:nth-child(3) { animation: rowSlide 300ms ease both; animation-delay: 150ms; }
tbody tr:nth-child(4) { animation: rowSlide 300ms ease both; animation-delay: 200ms; }
tbody tr:nth-child(5) { animation: rowSlide 300ms ease both; animation-delay: 250ms; }
/* Continue pattern for up to 10 rows */
```

When a new row is added via "+ कार्मिक जोड़ें", it should also slide in with the same animation (add class `row-enter` and trigger via JS).

---

### 19.5 Scroll-Triggered Fade for Form Panels
Form panels that are below the fold should animate in as the user scrolls down to them — not all at once on page load.

**JavaScript (add to component useEffect or vanilla JS):**
```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('panel-visible');
      observer.unobserve(entry.target); // animate only once
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.form-panel').forEach(el => observer.observe(el));
```

**CSS:**
```css
.form-panel {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 500ms ease, transform 500ms ease;
}
.form-panel.panel-visible {
  opacity: 1;
  transform: translateY(0);
}
```

> ⚠️ In React/Next.js: use `useEffect` with `IntersectionObserver` on refs, or use a library like `react-intersection-observer`. Do NOT use this on the first visible panel — only panels below the fold.

---

### 19.6 Hero Horizontal Rule Width Animation
The short decorative rule (line) below the subtitle in the hero should grow from 0 to 60px width on load — an elegant, editorial reveal that draws the eye.

```css
.hero-rule {
  width: 0;
  height: 1px;
  background: var(--border-strong);
  animation: growRule 600ms ease both;
  animation-delay: 300ms;
  animation-fill-mode: both;
}
@keyframes growRule {
  from { width: 0; opacity: 0; }
  to   { width: 60px; opacity: 1; }
}
```

---

### 19.7 Card Icon Bounce on Hover
The icon block inside each home screen card should spring/bounce when the card is hovered. Use a spring easing curve for a satisfying feel.

```css
:root {
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card:hover .card-icon-wrap {
  animation: iconBounce 400ms var(--ease-spring) both;
}

@keyframes iconBounce {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.15); }
  100% { transform: scale(1.05); }
}
```

> Note: Do not add `transition` to `.card-icon-wrap` — use animation only to avoid conflict.

---

### 19.8 Glowing Top Border on Scroll
The 3px green top border of the app should glow/intensify when the user scrolls down — a subtle signal that the page is being navigated.

**JavaScript:**
```js
// Add to layout or _app.tsx useEffect
window.addEventListener('scroll', () => {
  document.body.classList.toggle('scrolled', window.scrollY > 20);
});
```

**CSS:**
```css
/* Default — no glow */
body::after {
  content: '';
  position: fixed; top: 0; left: 0; right: 0;
  height: 3px;
  background: var(--accent-primary);
  z-index: 1000;
  transition: box-shadow 300ms ease;
}

/* Glows when scrolled */
body.scrolled::after {
  box-shadow: 0 0 20px rgba(26,92,56,0.5), 0 0 40px rgba(26,92,56,0.2);
}
```

---

### 19.9 Certification Block Typewriter Effect (Staff Attendance)
The long Hindi certification paragraph in Staff Attendance should appear with a typewriter effect when it scrolls into view — character by character. This makes it feel like the document is being officially "certified" in real time.

**Implementation approach:**
```js
function typewriter(element, text, speed = 18) {
  element.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, speed);
}

// Trigger when cert block enters viewport via IntersectionObserver
const certObserver = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    typewriter(
      document.querySelector('.cert-text'),
      'प्रमाणित किया जाता है कि उपस्थिति पत्रक का मिलान उपस्थिति पंजिका से कर लिया गया है, साथ ही कोई भी कार्मिक बिना सक्षम स्तर से अवकाश स्वीकृत कराए उपस्थिति पत्रक में उल्लिखित अवधि के दौरान अनुपस्थित नहीं रहा है।',
      20
    );
    certObserver.disconnect();
  }
}, { threshold: 0.5 });
certObserver.observe(document.querySelector('.cert-block'));
```

> ⚠️ Hindi Unicode text requires careful character handling — iterate by spreading into an array (`[...text]`) to handle multi-byte characters:
```js
const chars = [...text]; // Correct for Hindi Unicode
```

---

### 19.10 Live Progress Indicator Pill (Staff Attendance)
Show a small live-updating status pill just above the attendance table showing current data stats. Updates whenever staff rows, dates, or attendance values change.

**Pill location:** Just above `.table-wrap`, right-aligned.

**Display format:**
```
[pill] 3 कार्मिक  ·  30 दिन  ·  अवधि: 11.04–10.05
```

**CSS:**
```css
.progress-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 4px 14px;
  margin-bottom: 12px;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: 0.02em;
}
.progress-pill-dot {
  color: var(--accent-primary);
  font-weight: 700;
}
```

**JS (update on any relevant change):**
```js
function updateProgressPill() {
  const staffCount = document.querySelectorAll('.att-staff-row').length;
  const from = document.getElementById('att-period-from')?.value;
  const to   = document.getElementById('att-period-to')?.value;
  const dayCount = from && to ? getDatesInRange(from, to).length : 0;
  const fromFmt = from ? formatDDMM(from) : '—';
  const toFmt   = to   ? formatDDMM(to)   : '—';

  document.querySelector('.progress-pill').innerHTML =
    `<span>${staffCount} कार्मिक</span>
     <span class="progress-pill-dot">·</span>
     <span>${dayCount} दिन</span>
     <span class="progress-pill-dot">·</span>
     <span>अवधि: ${fromFmt}–${toFmt}</span>`;
}
```

---

### 19.11 Form Auto-Save with Toast Notification
Automatically save Staff Attendance form data to `localStorage` every time a value changes. Show a small toast notification confirming the save so users never lose data on accidental refresh or tab close.

**Auto-save JS:**
```js
// Collect all form data into an object and save
function autoSave() {
  const data = {
    officeName: document.getElementById('att-office-name')?.value,
    kramank:    document.getElementById('att-kramank')?.value,
    date:       document.getElementById('att-date')?.value,
    from:       document.getElementById('att-period-from')?.value,
    to:         document.getElementById('att-period-to')?.value,
    note:       document.getElementById('att-note')?.value,
    staffRows:  collectStaffData(),  // your existing staff data collector
    savedAt:    new Date().toISOString()
  };
  localStorage.setItem('att_draft', JSON.stringify(data));
  showToast('✓ ड्राफ्ट सुरक्षित');
}

// Debounce auto-save so it fires 1.5s after last change
const debouncedAutoSave = debounce(autoSave, 1500);
document.getElementById('staff-att-panel')
  .addEventListener('input', debouncedAutoSave);
```

**Toast component CSS:**
```css
.toast {
  position: fixed;
  bottom: 80px;  /* above sticky button bar on mobile */
  right: 20px;
  background: var(--text-primary);
  color: white;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 999;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 200ms ease, transform 200ms ease;
  pointer-events: none;
}
.toast.show {
  opacity: 1;
  transform: translateY(0);
}
```

**Toast JS:**
```js
function showToast(message, duration = 2000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 200);
  }, duration);
}
```

**On page load — restore from localStorage:**
```js
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('att_draft');
  if (saved) {
    const data = JSON.parse(saved);
    // Restore each field value
    if (data.officeName) document.getElementById('att-office-name').value = data.officeName;
    if (data.kramank)    document.getElementById('att-kramank').value    = data.kramank;
    // ... restore all fields
    showToast('📂 पिछला ड्राफ्ट पुनः लोड किया गया');
  }
});
```

---

### 19.12 Dark Mode Toggle (Future Enhancement — Scaffold Now)
Add a sun/moon toggle icon in the navbar that switches between the Warm Parchment (light) theme and a Deep Ink dark theme. Scaffold the structure now even if the dark theme CSS is minimal — so it can be filled in later without restructuring.

**Navbar addition:**
```jsx
<button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
  {isDark ? <SunIcon size={16} /> : <MoonIcon size={16} />}
</button>
```

**CSS:**
```css
.theme-toggle {
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-muted);
  transition: all 150ms ease;
}
.theme-toggle:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

/* Dark mode variable overrides */
[data-theme="dark"] {
  --bg-base:        #111210;
  --bg-surface:     #1A1C18;
  --bg-elevated:    #222420;
  --text-primary:   #F2F0E8;
  --text-secondary: #B8B4A8;
  --text-muted:     #6B685E;
  --border:         #2C2E28;
  --border-strong:  #3A3C36;
  /* Keep --accent-primary same — green works on dark too */
}
```

**JS:**
```js
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// On load — restore saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
```

> ⚠️ `prefers-color-scheme` media query should also be checked on first load if no saved preference exists.

---

### ✅ New Suggestions — Implementation Checklist

After implementing all 12 suggestions, verify:

- [ ] Navbar slides down smoothly on page load (19.1)
- [ ] Green pulse dot visible and animating in navbar (19.2)
- [ ] All buttons produce ripple on click — no glow artifacts (19.3)
- [ ] Table rows slide in from left on load, staggered (19.4)
- [ ] Form panels below fold fade in on scroll (19.5)
- [ ] Hero rule grows from 0 to 60px on load (19.6)
- [ ] Card icon bounces on card hover (19.7)
- [ ] Top border glows on scroll, resets at top (19.8)
- [ ] Certification text types out character-by-character on scroll (19.9)
- [ ] Progress pill updates live with staff count + day count (19.10)
- [ ] Auto-save fires 1.5s after last input, toast appears and disappears (19.11)
- [ ] Dark mode toggle visible in navbar, switches theme, persists on reload (19.12)
- [ ] All 12 animations respect `prefers-reduced-motion: reduce`
- [ ] No Hindi text changed anywhere
- [ ] No existing functionality broken

---

## Implementation Order (Follow This Sequence)

Apply changes in this exact order to minimize risk of breakage:

```
1.  Change 4      → Make क्रमांक optional (smallest, safest change)
2.  Change 2      → Fix PLP keyboard bug (isolated to PLP inputs only)
3.  Change 3      → Mobile + desktop UI optimizations (CSS only, no logic)
4.  Change 5a     → Add Print button to PLP (new button + print CSS)
5.  Change 5b     → Add Excel export to Staff Attendance (new library + button)
6.  New 19.1–19.3 → Navbar animation + pulse dot + button ripple (CSS only, safe)
7.  New 19.4–19.6 → Table row slide-in + scroll fade + hero rule (CSS + minimal JS)
8.  New 19.7–19.8 → Card icon bounce + glowing top border (CSS + 3 lines JS)
9.  New 19.9      → Certification typewriter effect (JS, Staff Attendance only)
10. New 19.10     → Live progress pill (JS, Staff Attendance only)
11. New 19.11     → Auto-save + toast (JS, Staff Attendance only)
12. New 19.12     → Dark mode scaffold (CSS variables + toggle button)
13. Change 1      → Staff Attendance PDF format overhaul (largest change, do last)
```

---

## Verification Checklist

After all changes, verify every item:

### Change 1 — PDF Format
- [ ] PDF is A4 Landscape
- [ ] आयुर्वेद विभाग appears centered at top
- [ ] Office name appears correctly on line 2 and in seal
- [ ] क्रमांक left-aligned, दिनांक right-aligned on same line
- [ ] उपस्थिति पत्रक centered, bold, extra spacing
- [ ] Period line appears above table
- [ ] Month sub-headers group date columns correctly
- [ ] Dates show as numbers only (11, 12, 13...)
- [ ] Attendance values show as text in PDF cells
- [ ] Last 3 columns have vertical headers
- [ ] Leave counts calculate correctly
- [ ] Certification text appears centered, bold
- [ ] Signature + office name appear bottom-right

### Change 2 — Keyboard Bug
- [ ] Type multi-digit number in PLP without losing focus
- [ ] Works on Android Chrome
- [ ] Works on iOS Safari
- [ ] Percentage auto-calculates after typing

### Change 3 — UI
- [ ] Mobile: 1-column card grid
- [ ] Mobile: sticky bottom button bar
- [ ] Mobile: table scrolls horizontally
- [ ] Mobile: form fields full width
- [ ] Desktop: 3-column card grid
- [ ] Desktop: form + preview side by side
- [ ] All touch targets ≥ 44px
- [ ] No horizontal overflow on any screen

### Change 4 — Optional क्रमांक
- [ ] No error shown when क्रमांक is empty
- [ ] `(वैकल्पिक)` label appears in muted text
- [ ] PDF still generates when क्रमांक is empty
- [ ] When filled, क्रमांक appears correctly in PDF

### Change 5a — PLP Print
- [ ] Print button appears between Preview and Save PDF
- [ ] Clicking Print opens browser print dialog
- [ ] Only the PLP document is visible in print
- [ ] All input values print as text (not blank input boxes)
- [ ] Page size is A4 Portrait in print
- [ ] After print dialog closes, form is restored to editable state

### Change 5b — Excel Export
- [ ] Excel button appears in Staff Attendance action row
- [ ] Clicking Excel downloads a `.xlsx` file
- [ ] File contains all header rows (dept, office, title, period)
- [ ] All staff rows present with correct attendance values
- [ ] Leave count columns correct
- [ ] Certification text in file
- [ ] Signature row in file
- [ ] Column widths are readable
- [ ] Merged cells correct for header rows

### 🆕 New Suggestions (19.1–19.12)
- [ ] Navbar slides down on page load (19.1)
- [ ] Green pulse dot animating in navbar brand (19.2)
- [ ] Button ripple on click works on all button types (19.3)
- [ ] Table rows slide in from left, staggered per row (19.4)
- [ ] Form panels below fold fade in on scroll via IntersectionObserver (19.5)
- [ ] Hero rule grows 0→60px on load (19.6)
- [ ] Card icon bounces with spring easing on hover (19.7)
- [ ] Top border glows when scrolled down, resets at top (19.8)
- [ ] Certification text types character-by-character on scroll into view (19.9)
- [ ] Progress pill shows live कार्मिक count, day count, period (19.10)
- [ ] Auto-save fires 1.5s after last change, toast "✓ ड्राफ्ट सुरक्षित" shown (19.11)
- [ ] Dark mode toggle in navbar, persists across refresh (19.12)
- [ ] All 12 new animations respect `prefers-reduced-motion` (disabled when set)

---

## Files That Will Be Modified

| File | Changes |
|------|---------|
| `src/app/staff-attendance/page.tsx` | PDF format overhaul · Excel export · optional क्रमांक · mobile UI |
| `src/app/plp/page.tsx` | Keyboard bug fix · Print button · mobile UI |
| `src/app/page.tsx` | Mobile card grid UI |
| `src/app/globals.css` | Mobile/desktop responsive CSS additions |
| `src/app/layout.tsx` | SheetJS CDN or import (if not using npm) |

## Files That Must NOT Be Modified

- Any API route files
- Any server action files
- Any calculation logic beyond what's described above
- Any Hindi text strings
- Any design token values (colors, fonts, spacing)
- Existing PDF generation settings for PLP

---

*Prompt version: v3 · Last updated: May 2026*
*Project: Soochna Sahayak (Smart Office Assistant) · Next.js + Tailwind CSS*
