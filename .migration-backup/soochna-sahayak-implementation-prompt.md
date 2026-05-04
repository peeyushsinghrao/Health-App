# Soochna Sahayak — Implementation Prompt
**Fix all bugs + implement 4 features in `public/web-portal.js`, `src/app/page.tsx`, `src/app/globals.css`, and `src/app/web-portal.css`**

---

## Project Context

**App:** Soochna Sahayak — A Next.js 16 static-export government productivity tool for the Ayurveda Department. Two active modules: **PLP Report** (monthly performance + payroll) and **Staff Attendance** (daily attendance sheet). All logic is in `public/web-portal.js` (vanilla JS, 1223 lines). UI is in `src/app/page.tsx` (React/TSX, 624 lines). Styles split across `src/app/globals.css` and `src/app/web-portal.css`.

**Architecture constraints:**
- `next.config.ts` has `output: "export"` — fully static, no server-side code
- All persistence must use `localStorage` (no API routes for this feature set)
- No new npm packages — use only what's already installed (`next-pwa` is NOT installed; use manual service worker for PWA)
- The app ships `public/web-portal.js` as a plain script loaded via Next.js `<Script>` tag
- Deployed to Netlify (`netlify.toml` publishes `out/`)

---

## Part 1 — Fix All Bugs

### Bug 1 · Timezone Off-by-One (CRITICAL)
**File:** `public/web-portal.js` · Lines 474–475

`new Date('2025-03-01')` parses as UTC midnight. In IST (UTC+5:30) it displays as the *previous day*. Every date in the attendance sheet prints one day early.

**Fix — every `new Date(dateString)` call that receives a `YYYY-MM-DD` string from `<input type="date">` must append `T00:00:00`:**

```js
// getDatesArray() — lines 474-475
// BEFORE:
let curr = new Date(from);
const end = new Date(to);

// AFTER:
let curr = new Date(from + 'T00:00:00');
const end = new Date(to + 'T00:00:00');
```

Apply the same fix to **every** other date parsing call in the file:
- Line 556: `new Date(attState.date)` → `new Date(attState.date + 'T00:00:00')`
- Line 563: `new Date(attState.periodFrom)` → `new Date(attState.periodFrom + 'T00:00:00')`
- Line 567: `new Date(attState.periodTo)` → `new Date(attState.periodTo + 'T00:00:00')`
- Line 672: `new Date(attState.date)` → `new Date(attState.date + 'T00:00:00')`
- Line 743: `new Date(attState.periodFrom)` → `new Date(attState.periodFrom + 'T00:00:00')`
- Line 981 & 1058: any `new Date(ds)` where `ds` is a `YYYY-MM-DD` string

---

### Bug 2 · Theme Icon Freezes in Dark Mode (MEDIUM)
**File:** `public/web-portal.js` · Line 1180

`window.toggleTheme` changes `data-theme` but never updates `.theme-icon-sun` / `.theme-icon-moon` visibility. The inline `onClick` in `page.tsx` handles icons only in its fallback path, which never runs after `web-portal.js` loads.

**Fix — add icon update inside `window.toggleTheme`:**

```js
window.toggleTheme = function() {
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  var newTheme = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  // ADD: sync sun/moon icons
  var sun = document.querySelector('.theme-icon-sun');
  var moon = document.querySelector('.theme-icon-moon');
  if (sun) sun.style.display = newTheme === 'dark' ? 'none' : 'block';
  if (moon) moon.style.display = newTheme === 'dark' ? 'block' : 'none';
};
```

---

### Bug 3 · PLP Data Lost on Page Refresh (CRITICAL)
**File:** `public/web-portal.js`

Staff Attendance has `autoSaveAtt()` + `restoreAttDraft()`. PLP has nothing. All target rows, employee bank details, and IFSC codes are lost on refresh.

**Fix — add auto-save for PLP, mirroring the existing att pattern exactly:**

```js
// Add after the existing debouncedAutoSave declaration (~line 1122)

function autoSavePLP() {
  try {
    localStorage.setItem('plp_draft', JSON.stringify({
      ahwcName: state.ahwcName,
      jila: state.jila,
      maah: state.maah,
      varsh: state.varsh,
      rows: state.rows,
      karmachari: state.karmachari,
      savedAt: new Date().toISOString()
    }));
    showToast('✓ PLP ड्राफ्ट सुरक्षित');
  } catch(e) { /* storage full — fail silently */ }
}
var debouncedPLPSave = debounce(autoSavePLP, 1500);

(function restorePLPDraft() {
  try {
    var saved = localStorage.getItem('plp_draft');
    if (!saved) return;
    var data = JSON.parse(saved);
    if (data.ahwcName) { state.ahwcName = data.ahwcName; var el = document.getElementById('ahwc-name'); if (el) el.value = data.ahwcName; }
    if (data.jila)     { state.jila = data.jila;         var el2 = document.getElementById('jila');      if (el2) el2.value = data.jila; }
    if (data.maah)     { state.maah = data.maah;         var el3 = document.getElementById('maah');      if (el3) el3.value = data.maah; }
    if (data.varsh)    { state.varsh = data.varsh;       var el4 = document.getElementById('varsh');     if (el4) el4.value = data.varsh; }
    if (data.rows && data.rows.length === 10) state.rows = data.rows;
    if (data.karmachari && data.karmachari.length > 0) state.karmachari = data.karmachari;
    renderAll();
    showToast('📂 PLP ड्राफ्ट पुनः लोड किया गया');
  } catch(e) {}
})();

// Hook into PLP panel events
var plpPanel = document.getElementById('plp-panel');
if (plpPanel) {
  plpPanel.addEventListener('input', debouncedPLPSave);
  plpPanel.addEventListener('change', debouncedPLPSave);
}
```

---

### Bug 4 · Attendance Date Range Has No Limit — Can Crash Browser (MEDIUM)
**File:** `public/web-portal.js` · Line 477

No cap on `getDatesArray()`. Selecting Jan 1 → Dec 31 renders 365 `<select>` dropdowns per staff row, freezing the browser.

**Fix — cap at 31 days with a toast warning:**

```js
// Inside getDatesArray(), replace the while loop:
const MAX_DAYS = 31;
while (curr <= end) {
  if (dates.length >= MAX_DAYS) {
    showToast('⚠️ अधिकतम 31 दिन की अवधि चुनें', 3500);
    break;
  }
  dates.push(new Date(curr));
  curr.setDate(curr.getDate() + 1);
}
```

---

### Bug 5 · Month Dropdown Hardcoded to February (LOW)
**File:** `public/web-portal.js` · Line 316

```js
// initDropdowns() — BEFORE:
if (m === 'फरवरी') o.selected = true;

// AFTER:
const currentMonthName = MONTHS[new Date().getMonth()];
if (m === currentMonthName) o.selected = true;

// Also update the state default at line ~30:
// BEFORE:
maah: 'फरवरी',
// AFTER:
maah: MONTHS[new Date().getMonth()],
```

---

### Bug 6 · Prapti Can Exceed Lakshya — Shows >100% on Official Documents (LOW)
**File:** `public/web-portal.js` · Line 45

```js
// In calcPercent(), add visual warning via cell class (don't cap the value — keep it for accuracy)
// After computing pct, return it as-is but mark in renderKaryaTable():

// In renderKaryaTable() tbody template, replace the pct-cell td:
`<td class="pct-cell${pcts[i] > 100 ? ' pct-over' : ''}">${pcts[i].toFixed(2)}%</td>`

// Add to globals.css or web-portal.css:
.pct-over { color: #B45309 !important; background: #FFFBEB; }
```

---

### Bug 7 · Duplicate `var el` Declarations in `restoreAttDraft` (LOW)
**File:** `public/web-portal.js` · Lines 1137–1142

Replace all six `var el` re-declarations with distinct variable names (`el1`–`el6`) or use a helper function to avoid confusion under strict mode.

---

### Bug 8 · XSS Risk in Preview `innerHTML` (MEDIUM)
**File:** `public/web-portal.js` · Lines 171, 191

`renderPreview()` writes `t1rows` and `t2rows` into `innerHTML` using template literals. User input (`row.naam`, `row.bank_naam`, etc.) passes through `esc()` in form renders but **not** in preview renders.

**Fix — wrap all user-supplied fields in `esc()` inside `renderPreview()`:**

```js
// In the t2rows template inside renderPreview() (~line 183):
// Every row.naam, row.pad, row.bank_khataa, row.bank_naam, row.ifsc, row.mobile
// must be wrapped: ${esc(row.naam)}, ${esc(row.pad)}, etc.
// KARYA_NAMES are constants — no escaping needed.
```

---

## Part 2 — Implement 4 Features

---

### Feature 1 · Report History — View Past Submissions

**What it does:** Every time a PDF is successfully generated (PLP or Attendance), save a metadata record to `localStorage`. Show a "Recent Reports" section on the home screen below the card grid. Each entry shows module name, AHWC/Office name, month/period, generation date, and a "Restore" button that re-loads the data back into the form.

**Implementation:**

**Step 1 — Define the history store in `public/web-portal.js`:**

```js
var HISTORY_KEY = 'ss_report_history';
var MAX_HISTORY = 20;

function saveReportToHistory(entry) {
  // entry: { id, type ('plp'|'att'), title, subtitle, period, generatedAt }
  try {
    var history = getReportHistory();
    entry.id = Date.now().toString();
    entry.generatedAt = new Date().toISOString();
    history.unshift(entry); // newest first
    if (history.length > MAX_HISTORY) history = history.slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch(e) {}
}

function getReportHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch(e) { return []; }
}

function deleteHistoryEntry(id) {
  try {
    var history = getReportHistory().filter(function(e) { return e.id !== id; });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistorySection();
  } catch(e) {}
}
```

**Step 2 — Call `saveReportToHistory()` on PDF success:**

Inside the PLP PDF generation `try` block (after `await html2pdf()...save()`):
```js
saveReportToHistory({
  type: 'plp',
  title: 'PLP रिपोर्ट',
  subtitle: state.ahwcName + ' — ' + state.jila,
  period: state.maah + ' ' + state.varsh,
  snapshot: JSON.stringify({ ahwcName: state.ahwcName, jila: state.jila, maah: state.maah, varsh: state.varsh, rows: state.rows, karmachari: state.karmachari })
});
renderHistorySection();
```

Inside the Attendance PDF generation `try` block:
```js
saveReportToHistory({
  type: 'att',
  title: 'उपस्थिति पत्रक',
  subtitle: attState.officeName,
  period: attState.periodFrom + ' – ' + attState.periodTo,
  snapshot: JSON.stringify({ officeName: attState.officeName, kramank: attState.kramank, date: attState.date, periodFrom: attState.periodFrom, periodTo: attState.periodTo, note: attState.note, staff: attState.staff })
});
renderHistorySection();
```

**Step 3 — Render the history section in `public/web-portal.js`:**

```js
function restoreFromHistory(id) {
  var history = getReportHistory();
  var entry = history.find(function(e) { return e.id === id; });
  if (!entry || !entry.snapshot) return;
  try {
    var data = JSON.parse(entry.snapshot);
    if (entry.type === 'plp') {
      state.ahwcName = data.ahwcName || '';
      state.jila     = data.jila     || '';
      state.maah     = data.maah     || state.maah;
      state.varsh    = data.varsh    || state.varsh;
      if (data.rows) state.rows = data.rows;
      if (data.karmachari) state.karmachari = data.karmachari;
      // sync header inputs
      ['ahwc-name','jila','maah','varsh'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.value = state[id === 'ahwc-name' ? 'ahwcName' : id];
      });
      renderAll();
      showPanel('plp-panel');
      showToast('📂 रिपोर्ट पुनः लोड की गई');
    } else if (entry.type === 'att') {
      attState.officeName  = data.officeName  || '';
      attState.kramank     = data.kramank     || '';
      attState.date        = data.date        || '';
      attState.periodFrom  = data.periodFrom  || '';
      attState.periodTo    = data.periodTo    || '';
      attState.note        = data.note        || '';
      if (data.staff) attState.staff = data.staff;
      // sync inputs
      var fields = { 'att-office-name': 'officeName', 'att-kramank': 'kramank', 'att-date': 'date', 'att-period-from': 'periodFrom', 'att-period-to': 'periodTo', 'att-note': 'note' };
      Object.keys(fields).forEach(function(elId) {
        var el = document.getElementById(elId);
        if (el) el.value = attState[fields[elId]];
      });
      renderAttTable();
      showPanel('staff-att-panel');
      showToast('📂 उपस्थिति पत्रक पुनः लोड किया गया');
    }
  } catch(e) { showToast('⚠️ रिपोर्ट लोड नहीं हो सकी'); }
}

function renderHistorySection() {
  var container = document.getElementById('history-section');
  if (!container) return;
  var history = getReportHistory();
  if (history.length === 0) {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'block';
  var items = history.map(function(entry) {
    var date = new Date(entry.generatedAt);
    var dateStr = date.toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    var icon = entry.type === 'plp' ? '📊' : '📋';
    return [
      '<div class="history-item">',
      '  <div class="history-icon">' + icon + '</div>',
      '  <div class="history-info">',
      '    <div class="history-title">' + entry.title + ' — ' + (entry.period || '') + '</div>',
      '    <div class="history-subtitle">' + (entry.subtitle || '') + '</div>',
      '    <div class="history-date">' + dateStr + '</div>',
      '  </div>',
      '  <div class="history-actions">',
      '    <button class="history-restore-btn" onclick="restoreFromHistory(\'' + entry.id + '\')">पुनः लोड</button>',
      '    <button class="history-delete-btn" onclick="deleteHistoryEntry(\'' + entry.id + '\')" aria-label="Delete">✕</button>',
      '  </div>',
      '</div>'
    ].join('');
  }).join('');
  container.innerHTML = [
    '<div class="history-header">',
    '  <h2 class="history-heading">हालिया रिपोर्टें</h2>',
    '  <button class="history-clear-btn" onclick="clearAllHistory()">सभी हटाएं</button>',
    '</div>',
    '<div class="history-list">' + items + '</div>'
  ].join('');
}

function clearAllHistory() {
  if (!confirm('सभी रिपोर्ट इतिहास हटाएं?')) return;
  localStorage.removeItem(HISTORY_KEY);
  renderHistorySection();
  showToast('🗑️ इतिहास साफ किया गया');
}

// Init on load
renderHistorySection();
```

**Step 4 — Add the `#history-section` div to `src/app/page.tsx`:**

After the closing `</div>` of `.card-grid` and before `<footer>` in the home screen:
```tsx
{/* HISTORY SECTION */}
<div id="history-section" className="history-section no-print" style={{ display: 'none' }} />
```

**Step 5 — Add history styles to `src/app/globals.css`:**

```css
/* ── HISTORY SECTION ── */
.history-section { margin-bottom: 48px; }
.history-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 14px;
}
.history-heading {
  font-family: var(--font-display); font-size: 1.1rem; font-weight: 600;
  color: var(--text-primary);
}
.history-clear-btn {
  font-size: .75rem; color: var(--text-muted); background: none; border: none;
  cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: color .2s;
}
.history-clear-btn:hover { color: var(--error); }
.history-list { display: flex; flex-direction: column; gap: 8px; }
.history-item {
  display: flex; align-items: center; gap: 14px;
  background: var(--bg-surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 14px 16px;
  box-shadow: var(--shadow-card); transition: border-color .2s;
}
.history-item:hover { border-color: var(--border-hover); }
.history-icon { font-size: 1.4rem; flex-shrink: 0; }
.history-info { flex: 1; min-width: 0; }
.history-title { font-weight: 600; font-size: .875rem; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.history-subtitle { font-size: .78rem; color: var(--text-secondary); margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.history-date { font-size: .72rem; color: var(--text-muted); margin-top: 3px; }
.history-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.history-restore-btn {
  font-size: .75rem; font-weight: 600; color: var(--accent);
  background: var(--accent-light); border: 1px solid rgba(26,92,56,.2);
  border-radius: 6px; padding: 5px 12px; cursor: pointer; transition: all .2s;
  font-family: var(--font-body);
}
.history-restore-btn:hover { background: rgba(26,92,56,.15); }
.history-delete-btn {
  width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border);
  background: none; color: var(--text-muted); cursor: pointer; font-size: .75rem;
  display: flex; align-items: center; justify-content: center; transition: all .2s;
}
.history-delete-btn:hover { border-color: #FECACA; color: #DC2626; background: #FEF2F2; }
```

---

### Feature 2 · Input Validation — Real-Time Inline Feedback

**What it does:** As the user types IFSC, mobile, and bank account numbers in Table 2 of PLP, show a green ✓ or red ✗ indicator inline — without waiting for PDF save.

**Implementation:**

**Step 1 — Add CSS for validation states to `src/app/globals.css`:**

```css
/* ── INLINE VALIDATION ── */
.field-valid { border-color: var(--success) !important; }
.field-invalid { border-color: var(--error) !important; background: #FEF2F2; }
.field-hint {
  font-size: .65rem; margin-top: 3px; padding: 0 2px;
  display: none; /* shown by JS */
}
.field-hint-ok  { color: var(--success); }
.field-hint-err { color: var(--error); }

/* Add a validation indicator inside each td via pseudo — applied via JS class on the <td> */
td.td-valid::after   { content: '✓'; color: var(--success); font-size: .7rem; margin-left: 4px; }
td.td-invalid::after { content: '✗'; color: var(--error);   font-size: .7rem; margin-left: 4px; }
```

**Step 2 — Add real-time validation to the `karma-tbody` input listener in `public/web-portal.js`:**

Locate the existing `document.getElementById('karma-tbody').addEventListener('input', ...)` block and add validation logic for specific fields:

```js
document.getElementById('karma-tbody').addEventListener('input', e => {
  const el = e.target;
  const ki = el.dataset.ki, kf = el.dataset.kf;
  if (ki === undefined || !kf) return;
  let val = el.value;
  if (kf === 'ifsc') val = val.toUpperCase();
  state.karmachari[+ki][kf] = val;
  if (kf === 'ifsc') el.value = val;
  renderPreview();

  // ── Real-time validation ──
  var td = el.closest('td');
  if (!td) return;
  td.classList.remove('td-valid', 'td-invalid');

  if (kf === 'ifsc' && val.length > 0) {
    td.classList.add(validateIfsc(val) ? 'td-valid' : 'td-invalid');
  }
  if (kf === 'mobile' && val.length > 0) {
    td.classList.add(validateMobile(val) ? 'td-valid' : 'td-invalid');
  }
  if (kf === 'bank_khataa' && val.length > 0) {
    td.classList.add(validateBankAccount(val) ? 'td-valid' : 'td-invalid');
  }
});
```

**Step 3 — Clear validation state when row is re-rendered (already handled since `renderAll()` rebuilds the DOM).**

---

### Feature 3 · Mobile Form UX — Sticky "Generate PDF" Button

**What it does:** On mobile, the sticky button bar at the bottom overlaps with the A4 document preview and the safe-area-inset. Fix the z-index layering, add proper safe-area padding, and ensure the preview panel is scrollable above it without being hidden.

**Implementation:**

**Step 1 — Fix the button row CSS in `src/app/globals.css`:**

Locate existing `.btn-row` media-query block (~line 982) and update:

```css
@media (max-width: 768px) {
  /* Sticky button bar — properly pinned to bottom with safe-area */
  .btn-row {
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    padding: 12px 16px env(safe-area-inset-bottom, 12px) 16px !important;
    background: var(--bg-surface) !important;
    border-top: 1px solid var(--border) !important;
    box-shadow: 0 -4px 20px rgba(28,25,23,.08) !important;
    z-index: 40 !important;
    display: flex !important;
    gap: 8px !important;
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch;
    /* Remove margin that pushes it into layout flow */
    margin-top: 0 !important;
  }

  .btn-row .btn {
    flex-shrink: 0;
    font-size: .78rem !important;
    padding: 10px 14px !important;
  }

  /* Push page content up so it's not hidden behind the fixed bar */
  .safe-bottom-mobile {
    padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px)) !important;
  }

  /* Ensure the A4 preview section scrolls above the bar */
  .a4-scaler {
    margin-bottom: 16px;
  }
}
```

**Step 2 — In `src/app/page.tsx`, update both button row divs (lines 364 and 550):**

Remove `sticky bottom-0` from the className (now handled by CSS media query) and simplify to just `btn-row no-print`:

```tsx
{/* PLP button row — line 364 */}
<div className="flex flex-wrap gap-3 pt-4 btn-row no-print">
  {/* ...buttons unchanged... */}
</div>

{/* Attendance button row — line 550 */}
<div className="flex flex-wrap gap-3 pt-4 btn-row no-print">
  {/* ...buttons unchanged... */}
</div>
```

**Step 3 — Add a mobile scroll-hint above the button bar on first visit (`public/web-portal.js`):**

```js
// Show once per session on mobile
if (window.innerWidth < 768 && !sessionStorage.getItem('btn_hint_shown')) {
  sessionStorage.setItem('btn_hint_shown', '1');
  setTimeout(function() { showToast('👇 नीचे बटन उपलब्ध हैं', 2500); }, 800);
}
```

---

### Feature 4 · Offline PWA Support

**What it does:** Make the app installable and fully usable offline. Since `next.config.ts` uses `output: "export"`, all assets are static — a service worker can cache them all. No `next-pwa` package needed; write the files manually.

**Implementation:**

**Step 1 — Create `public/manifest.json`:**

```json
{
  "name": "Soochna Sahayak",
  "short_name": "Soochna",
  "description": "Smart Office Assistant — Ayurveda Department",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FAFAF5",
  "theme_color": "#1A5C38",
  "orientation": "any",
  "icons": [
    {
      "src": "/logo.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ],
  "categories": ["productivity", "government"],
  "lang": "hi"
}
```

**Step 2 — Create `public/sw.js` (service worker with cache-first strategy):**

```js
'use strict';

var CACHE_NAME = 'soochna-sahayak-v1';
var ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/web-portal.js',
  '/manifest.json',
  '/logo.svg',
  'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

// Install — pre-cache all shell assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      // Cache local assets reliably; CDN assets best-effort
      var local = ASSETS_TO_CACHE.filter(function(u) { return !u.startsWith('http'); });
      var remote = ASSETS_TO_CACHE.filter(function(u) { return u.startsWith('http'); });
      return cache.addAll(local).then(function() {
        return Promise.allSettled(remote.map(function(url) {
          return cache.add(url).catch(function() { /* CDN offline — skip */ });
        }));
      });
    }).then(function() { return self.skipWaiting(); })
  );
});

// Activate — delete old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

// Fetch — cache-first for same-origin, network-first for CDN
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  var url = new URL(event.request.url);

  // Cache-first for same-origin (app shell + assets)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        if (cached) return cached;
        return fetch(event.request).then(function(response) {
          if (response && response.status === 200) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, clone); });
          }
          return response;
        }).catch(function() {
          // If navigation fails and we're offline, serve root
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
    );
    return;
  }

  // Network-first for CDN (fonts, libraries) — fall back to cache
  event.respondWith(
    fetch(event.request).then(function(response) {
      if (response && response.status === 200) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, clone); });
      }
      return response;
    }).catch(function() {
      return caches.match(event.request);
    })
  );
});
```

**Step 3 — Register the service worker in `src/app/layout.tsx`:**

Add a `<Script>` tag inside `<body>` in the layout (after existing scripts):

```tsx
import Script from 'next/script';
// Inside <body>:
<Script id="sw-register" strategy="afterInteractive">{`
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').catch(function(err) {
        console.warn('SW registration failed:', err);
      });
    });
  }
`}</Script>
```

**Step 4 — Add `<link rel="manifest">` and `<meta name="theme-color">` to `src/app/layout.tsx`:**

Inside the `<head>` / `metadata` export. If using Next.js Metadata API:

```tsx
// In layout.tsx metadata export, add:
export const metadata: Metadata = {
  // ...existing fields...
  manifest: '/manifest.json',
  themeColor: '#1A5C38',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Soochna Sahayak',
  },
};
```

Or if using raw `<head>` tags:
```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#1A5C38" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
```

**Step 5 — Add an "Install App" button to the navbar (optional but recommended):**

In `public/web-portal.js` at the end of the file, add:

```js
/* === PWA INSTALL PROMPT === */
(function() {
  var deferredPrompt = null;
  var installBtn = document.getElementById('pwa-install-btn');

  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.style.display = 'flex';
  });

  if (installBtn) {
    installBtn.addEventListener('click', function() {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function(result) {
        if (result.outcome === 'accepted') {
          showToast('✅ ऐप इंस्टॉल हो रहा है...');
          if (installBtn) installBtn.style.display = 'none';
        }
        deferredPrompt = null;
      });
    });
  }

  window.addEventListener('appinstalled', function() {
    if (installBtn) installBtn.style.display = 'none';
    showToast('✅ Soochna Sahayak इंस्टॉल हो गया!');
  });
})();
```

In `src/app/page.tsx`, add the install button inside the navbar's right section (hidden by default):

```tsx
<button
  id="pwa-install-btn"
  className="hidden items-center gap-2 text-xs font-semibold text-[var(--accent)] bg-[var(--accent-light)] border border-[rgba(26,92,56,0.2)] rounded-full px-3 py-1.5 cursor-pointer transition-all hover:bg-[rgba(26,92,56,0.15)]"
  style={{ display: 'none' }}
>
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
  इंस्टॉल करें
</button>
```

**Step 6 — Update `netlify.toml` to serve `sw.js` with correct headers (no caching on the SW itself):**

```toml
[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate"
    Content-Type = "application/javascript"
```

---

## Testing Checklist

After implementing all of the above, verify:

- [ ] **Bug 1 (Timezone):** Select attendance period Mar 1–5. All 5 dates show correctly as 01.03, 02.03, 03.03, 04.03, 05.03 in the form and preview.
- [ ] **Bug 2 (Theme icon):** Toggle dark mode. Sun/Moon icon switches correctly on every click.
- [ ] **Bug 3 (PLP auto-save):** Fill in AHWC name + 2 employee rows. Refresh the page. All data should restore automatically.
- [ ] **Bug 4 (Date range cap):** Set attendance period to Jan 1 → Dec 31. A toast warning appears and the table renders only 31 columns.
- [ ] **Bug 5 (Month default):** Open the PLP form. The month dropdown should default to the current month, not February.
- [ ] **Bug 6 (>100% display):** Enter Prapti > Lakshya. The percentage cell turns amber — it's visually flagged.
- [ ] **Bug 8 (XSS):** Enter `<img src=x onerror="alert(1)">` as an employee name. No alert fires in the preview.
- [ ] **Feature 1 (History):** Generate a PLP PDF. Go back to home screen. The history section shows the entry. Click "पुनः लोड" — the form restores and navigates to PLP panel.
- [ ] **Feature 2 (Validation):** Type an invalid IFSC (e.g. `ABC1`). The cell turns red. Type a valid one (e.g. `SBIN0001234`). It turns green.
- [ ] **Feature 3 (Sticky bar):** On a 375px-wide screen, the Generate PDF button bar is visible at the bottom without covering the preview. The page content scrolls above it.
- [ ] **Feature 4 (PWA):** Open DevTools → Application → Manifest. Shows correctly. Service worker registered. Go offline. Reload — app still works. On mobile Chrome, "Add to Home Screen" prompt appears.

---

## Files Modified Summary

| File | Changes |
|------|---------|
| `public/web-portal.js` | Fix 8 bugs; add PLP auto-save + restore; add history store + render + restore; add real-time validation; add PWA install prompt; add date range cap; add toast for mobile hint |
| `public/sw.js` | **NEW** — Service worker (cache-first for app shell, network-first for CDN) |
| `public/manifest.json` | **NEW** — PWA manifest |
| `src/app/page.tsx` | Add `#history-section` div in home screen; add `#pwa-install-btn` in navbar; simplify `.btn-row` className (remove `sticky`); add SW registration `<Script>` |
| `src/app/layout.tsx` | Add manifest + theme-color meta; add SW registration script |
| `src/app/globals.css` | Add `.history-*` styles; add `.field-valid/.field-invalid/.td-valid/.td-invalid`; fix `.btn-row` mobile CSS; add `.pct-over`; update `.safe-bottom-mobile` padding |
| `netlify.toml` | Add `/sw.js` no-cache header |
