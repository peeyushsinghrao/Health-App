# उपस्थिति पत्रक — PDF Format Overhaul Prompt

**Objective:** Completely redesign the Staff Attendance PDF output in `public/web-portal.js` and `src/app/page.tsx` so it matches the reference format exactly — a **landscape A4** table where all days of the period fit horizontally in a single row per staff member, with vertical (rotated) status text inside each day cell, month-group header rows, and three summary columns at the right.

---

## Reference Format (from uploaded PDF)

The target document looks like this:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ अवधि - 11 अप्रैल 2026 से 10 मई 2026 तक                                                              │
├──────┬──────────────────────┬──────────────────────────────────┬───────────────────┬──────────────────┤
│      │                      │       माह - अप्रैल 2026          │  माह - मई 2026    │ उपस्थिति पत्रक  │ पूर्व उपस्थिति │ अब तक कुल │
│ क्र. │ नाम कार्मिक मय पद    ├──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┤ 1│2│3│4│5│6│7│8│9 │ अवधि में लिए   │ पत्रक तक लिए  │ लिए      │
│ सं.  │                      │11│12│13│14│15│16│17│18│19│20│..│  ...             │ गए आकस्मिक     │ गए आकस्मिक    │ आकस्मिक  │
│      │                      │  │  │  │  │  │  │  │  │  │  │  │                  │ अवकाश का योग   │ अवकाश का योग  │ अवकाश    │
├──────┼──────────────────────┼──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴─┴──────────────────┴───────────────┴──────────┤
│  1   │ डॉ राम लाल,          │उप│उप│उप│उप│उप│Day│उप│..│  आकस्मिक  │उप│उप│उप│      │      1          │       4        │    5     │
│      │ आयुर्वेद चिकित्सक   │स्│स्│स्│स्│स्│Off│स्│  │  अव.       │स्│स्│स्│      │                 │                │          │
│      │                      │थि│थि│थि│थि│थि│   │थि│  │            │थि│थि│थि│      │                 │                │          │
│      │                      │त │त │त │त │त │   │त │  │            │त │त │त │      │                 │                │          │
└──────┴──────────────────────┴──┴──┴──┴──┴──┴───┴──┴──┴────────────┴──┴──┴──┴──────┴─────────────────┴────────────────┴──────────┘
```

**Key visual rules from the reference:**
1. Status text inside each day-cell is **written vertically** (top-to-bottom, rotated) — e.g. "उपस्थित" reads downward
2. Day columns are **very narrow** — just wide enough for the vertical text
3. **Month-group headers** span the columns for that month (e.g. "माह - अप्रैल 2026" spans columns 11–30, "माह - मई 2026" spans 1–10)
4. Date numbers (11, 12, 13…) appear as a **second header row** under the month name
5. **Three summary columns** at the far right with full Hindi header text, multi-line wrapped
6. The entire table fits on **one A4 landscape page** (297mm × 210mm) with ≤8mm margins
7. The period line ("अवधि - ... से ... तक") appears as a **bordered header bar** above the table

---

## Step-by-Step Implementation

### Step 1 — Update `att-doc-page` dimensions in `src/app/web-portal.css`

Replace the existing `.att-doc-page` block:

```css
/* OLD — delete this */
.att-doc-page {
  width: 1122px; min-height: 794px;
  transform: scale(calc((100vw - 48px) / 1122px));
  margin-bottom: calc(((100vw - 48px) / 1122px - 1) * 794px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.12); border-radius: 2px;
}
@media(min-width: 1170px) { .att-doc-page { transform: scale(1); margin-bottom: 0; } }
```

```css
/* NEW — A4 landscape: 297mm × 210mm */
.att-doc-page {
  width: 1122px;   /* 297mm at 96dpi ≈ 1122px */
  min-height: 794px; /* 210mm at 96dpi ≈ 794px  */
  background: #fff;
  padding: 20px 22px;
  font-family: 'Noto Sans Devanagari', 'Noto Serif Devanagari', serif;
  font-size: 9pt;
  color: #000;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  border-radius: 2px;
  transform: scale(calc((100vw - 96px) / 1122px));
  transform-origin: top left;
  margin-bottom: calc((calc((100vw - 96px) / 1122px) - 1) * 794px);
}
@media(min-width: 1218px) {
  .att-doc-page { transform: scale(1); margin-bottom: 0; }
}
```

---

### Step 2 — Replace the document HTML in `src/app/page.tsx`

Find `<div id="att-doc-page"` and replace the entire block (lines ~570–618) with this new structure:

```tsx
<div id="att-doc-page" className="att-doc-page doc-page">

  {/* ── HEADER BAR ── */}
  <div style={{
    border: '1.5px solid #000', padding: '4px 8px',
    fontWeight: 700, fontSize: '9pt', marginBottom: 0,
    background: '#f8f8f8', fontFamily: "'Noto Sans Devanagari', serif"
  }}>
    अवधि - <span id="att-doc-period-from" /> से <span id="att-doc-period-to" /> तक
  </div>

  {/* ── MAIN ATTENDANCE TABLE ── */}
  <table id="att-doc-table" style={{
    width: '100%', borderCollapse: 'collapse',
    tableLayout: 'fixed', fontFamily: "'Noto Sans Devanagari', serif"
  }}>
    <thead id="att-doc-tbl-head" />
    <tbody id="att-doc-tbody" />
  </table>

  {/* ── CERTIFICATION ── */}
  <div id="att-doc-note-sec" style={{ marginTop: '8px', display: 'none' }}>
    <strong>नोट :</strong> <span id="att-doc-note-text" />
  </div>

  <div style={{
    marginTop: '8px', fontSize: '7pt', lineHeight: 1.5,
    border: '1px solid #999', padding: '5px 8px', background: '#fafafa'
  }}>
    प्रमाणित किया जाता है कि उपस्थिति पत्रक का मिलान उपस्थिति पंजिका से कर लिया गया है,
    साथ ही कोई भी कार्मिक बिना सक्षम स्तर से अवकाश स्वीकृत कराए उपस्थिति पत्रक में
    उल्लिखित अवधि के दौरान अनुपस्थित नहीं रहा है।
  </div>

  {/* ── SIGNATURE ── */}
  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
    <div style={{ fontSize: '7.5pt' }}>
      क्रमांक - उपस्थिति / <span id="att-doc-kramank" />
      &nbsp;&nbsp;&nbsp; दिनांक <span id="att-doc-date" />
    </div>
    <div style={{ textAlign: 'center', minWidth: '150px' }}>
      <div style={{ height: '36px', borderBottom: '1.5px solid #000', marginBottom: '4px' }} />
      <div style={{ fontWeight: 700, fontSize: '7.5pt' }}>हस्ताक्षर प्रभारी</div>
      <div id="att-doc-seal-office" style={{ fontSize: '7pt', marginTop: '2px' }} />
    </div>
  </div>

</div>
```

> **Note:** Remove the old `att-doc-office` heading and `उपस्थिति पत्रक` centered title — the reference format does not have these. The period line is the document header. Office name goes only in the signature block.

---

### Step 3 — Rewrite `renderAttPreview(dates)` in `public/web-portal.js`

Find the existing `renderAttPreview` function (around line 550) and **replace it entirely** with the following:

```js
function renderAttPreview(dates) {
  // ── Sync simple text fields ──
  var pFromStr = '', pToStr = '';
  if (attState.periodFrom) {
    var d = new Date(attState.periodFrom + 'T00:00:00');
    pFromStr = d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  }
  if (attState.periodTo) {
    var d2 = new Date(attState.periodTo + 'T00:00:00');
    pToStr = d2.getDate() + ' ' + MONTHS[d2.getMonth()] + ' ' + d2.getFullYear();
  }
  var elFrom = document.getElementById('att-doc-period-from');
  var elTo   = document.getElementById('att-doc-period-to');
  if (elFrom) elFrom.textContent = pFromStr;
  if (elTo)   elTo.textContent   = pToStr;

  var elKr   = document.getElementById('att-doc-kramank');
  var elDate = document.getElementById('att-doc-date');
  var elSeal = document.getElementById('att-doc-seal-office');
  if (elKr)   elKr.textContent   = attState.kramank || '';
  if (elDate) elDate.textContent = (function(){
    if (!attState.date) return '';
    var dd = new Date(attState.date + 'T00:00:00');
    return String(dd.getDate()).padStart(2,'0') + '.' +
           String(dd.getMonth()+1).padStart(2,'0') + '.' + dd.getFullYear();
  })();
  if (elSeal) elSeal.textContent = attState.officeName || '';

  // ── Note section ──
  var noteSec = document.getElementById('att-doc-note-sec');
  if (noteSec) {
    if (attState.note && attState.note.trim()) {
      var elNoteText = document.getElementById('att-doc-note-text');
      if (elNoteText) elNoteText.textContent = attState.note.trim();
      noteSec.style.display = 'block';
    } else {
      noteSec.style.display = 'none';
    }
  }

  if (!dates || dates.length === 0) return;

  // ── Group dates by month ──
  var monthGroups = [];
  var curGroup = null;
  dates.forEach(function(d) {
    var mk = d.getFullYear() + '-' + d.getMonth();
    if (!curGroup || curGroup.key !== mk) {
      curGroup = {
        key: mk,
        label: 'माह - ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear(),
        count: 0
      };
      monthGroups.push(curGroup);
    }
    curGroup.count++;
  });

  // ── Column widths ──
  // Fixed: क्र.सं.=22px, नाम=90px, each day=18px, each summary=50px
  var SNO_W    = 22;
  var NAME_W   = 90;
  var DAY_W    = 18;
  var SUM_W    = 50;
  var DAYS_CNT = dates.length;

  // ── Build <colgroup> ──
  var colgroupHtml = '<colgroup>';
  colgroupHtml += '<col style="width:' + SNO_W + 'px">';
  colgroupHtml += '<col style="width:' + NAME_W + 'px">';
  for (var ci = 0; ci < DAYS_CNT; ci++) {
    colgroupHtml += '<col style="width:' + DAY_W + 'px">';
  }
  colgroupHtml += '<col style="width:' + SUM_W + 'px">';
  colgroupHtml += '<col style="width:' + SUM_W + 'px">';
  colgroupHtml += '<col style="width:' + SUM_W + 'px">';
  colgroupHtml += '</colgroup>';

  // ── Build <thead> — 2 header rows ──
  var theadHtml = '<colgroup>' + colgroupHtml.replace('<colgroup>','').replace('</colgroup>','') + '</colgroup>';

  // ROW 1: क्र.सं. (rowspan=2) | नाम (rowspan=2) | month group spans | 3 summary cols (rowspan=2)
  var SUMMARY_STYLE = 'border:1.5px solid #000;background:#e8e8e8;font-size:6pt;font-weight:700;' +
                      'text-align:center;vertical-align:middle;padding:2px 1px;line-height:1.3;';
  theadHtml += '<tr style="background:#f0f0f0">';
  theadHtml += '<th rowspan="2" style="border:1.5px solid #000;font-size:7.5pt;font-weight:700;' +
               'text-align:center;vertical-align:middle;padding:2px 1px;background:#e8e8e8">क्र.सं.</th>';
  theadHtml += '<th rowspan="2" style="border:1.5px solid #000;font-size:7.5pt;font-weight:700;' +
               'text-align:left;vertical-align:middle;padding:3px 4px;background:#e8e8e8">नाम कार्मिक मय पद</th>';
  monthGroups.forEach(function(g) {
    theadHtml += '<th colspan="' + g.count + '" style="border:1.5px solid #000;background:#e0e0e0;' +
                 'font-size:7.5pt;font-weight:700;text-align:center;padding:2px 1px">' + g.label + '</th>';
  });
  theadHtml += '<th rowspan="2" style="' + SUMMARY_STYLE + '">उपस्थिति पत्रक अवधि में लिए गए आकस्मिक अवकाश का योग</th>';
  theadHtml += '<th rowspan="2" style="' + SUMMARY_STYLE + '">पूर्व उपस्थिति पत्रक तक लिए गए आकस्मिक अवकाश का योग</th>';
  theadHtml += '<th rowspan="2" style="' + SUMMARY_STYLE + '">अब तक कुल लिए आकस्मिक अवकाश का योग</th>';
  theadHtml += '</tr>';

  // ROW 2: date numbers only
  theadHtml += '<tr>';
  dates.forEach(function(d) {
    theadHtml += '<th style="border:1.5px solid #000;font-size:6.5pt;font-weight:700;' +
                 'text-align:center;padding:2px 0;background:#e8e8e8">' + d.getDate() + '</th>';
  });
  theadHtml += '</tr>';

  document.getElementById('att-doc-tbl-head').innerHTML = theadHtml;

  // ── Build <tbody> ──
  var DAY_CELL_STYLE = 'border:1.5px solid #000;padding:1px 0;text-align:center;' +
                       'vertical-align:middle;font-size:6pt;';
  var VERT_SPAN_STYLE = 'writing-mode:vertical-rl;text-orientation:mixed;' +
                        'transform:rotate(180deg);display:inline-block;' +
                        'font-size:5.5pt;line-height:1;max-height:40px;overflow:hidden;';

  var tbodyHtml = '';
  attState.staff.forEach(function(s, idx) {
    // Count current-period CL
    var currentCL = 0;
    dates.forEach(function(d) {
      var ds = d.toISOString().split('T')[0];
      var val = s.days[ds] || 'उपस्थित';
      if (val === 'आकस्मिक अवकाश') currentCL++;
    });
    var prevCL  = parseInt(s.prevLeaves) || 0;
    var totalCL = currentCL + prevCL;

    tbodyHtml += '<tr>';
    // Serial number
    tbodyHtml += '<td style="border:1.5px solid #000;text-align:center;font-size:8pt;' +
                 'font-weight:700;vertical-align:middle;padding:2px 1px">' + (idx + 1) + '</td>';
    // Name
    tbodyHtml += '<td style="border:1.5px solid #000;text-align:left;font-size:7pt;' +
                 'vertical-align:middle;padding:3px 4px;line-height:1.35">' + esc(s.name) + '</td>';
    // Day cells
    dates.forEach(function(d) {
      var ds  = d.toISOString().split('T')[0];
      var val = s.days[ds] || 'उपस्थित';
      var bgColor = '';
      if (val === 'Day Off')          bgColor = 'background:#fff3cd;';
      if (val === 'आकस्मिक अवकाश')   bgColor = 'background:#fde8e8;';
      if (val === 'अनुपस्थित')        bgColor = 'background:#fde8e8;';
      tbodyHtml += '<td style="' + DAY_CELL_STYLE + bgColor + '">';
      tbodyHtml += '<span style="' + VERT_SPAN_STYLE + '">' + esc(val) + '</span>';
      tbodyHtml += '</td>';
    });
    // Summary cells
    tbodyHtml += '<td style="border:1.5px solid #000;text-align:center;font-size:8pt;' +
                 'font-weight:700;vertical-align:middle;background:#f0f9f0">' + currentCL + '</td>';
    tbodyHtml += '<td style="border:1.5px solid #000;text-align:center;font-size:8pt;' +
                 'vertical-align:middle" id="att-doc-n2-' + idx + '">' + prevCL + '</td>';
    tbodyHtml += '<td style="border:1.5px solid #000;text-align:center;font-size:9pt;' +
                 'font-weight:700;vertical-align:middle;background:#e8f4e8" id="att-doc-n3-' + idx + '">' + totalCL + '</td>';
    tbodyHtml += '</tr>';
  });

  document.getElementById('att-doc-tbody').innerHTML = tbodyHtml;
}
```

---

### Step 4 — Update PDF Generation Options in `public/web-portal.js`

Find the `att-btn-pdf` click handler (~line 772) and update the `opt` object:

```js
// BEFORE:
const opt = {
  margin: [5, 5, 5, 5],
  filename: `Upasthiti_Patrak_${pFromStr}_${pToStr}.pdf`,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollY: 0 },
  jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
  pagebreak: { mode: 'avoid-all' }
};

// AFTER:
var opt = {
  margin:    [6, 6, 6, 6],   // top, right, bottom, left in mm
  filename:  'Upasthiti_Patrak_' + pFromStr + '_' + pToStr + '.pdf',
  image:     { type: 'jpeg', quality: 0.98 },
  html2canvas: {
    scale:          2.5,     // Higher scale = crisper Devanagari text
    useCORS:        true,
    letterRendering:true,
    scrollY:        0,
    width:          1122,    // Exact A4 landscape px width
    windowWidth:    1122
  },
  jsPDF: {
    unit:        'mm',
    format:      'a4',
    orientation: 'landscape'  // 297mm wide × 210mm tall
  },
  pagebreak: { mode: 'avoid-all' }
};
```

---

### Step 5 — Update `renderAttTable()` form-side table to match

In `renderAttTable()` (~line 491), the **form-side** `<select>` dropdowns already work correctly. You only need to:

1. Make the `<select>` options match the status values used in the preview:
   - `उपस्थित` (default)
   - `अनुपस्थित`
   - `आकस्मिक अवकाश`
   - `Day Off`

2. Make sure the option values are **consistent** between the form `<select>` and what `renderAttPreview` reads from `s.days[dateStr]`. Currently the form uses `'आकस्मिक अवकाश'` — confirm this is the exact string checked in `renderAttPreview`:

```js
// In the options template inside renderAttTable() (~line 520):
var STATUS_OPTIONS = [
  'उपस्थित',
  'अनुपस्थित',
  'आकस्मिक अवकाश',
  'Day Off'
];
var optionsHtml = STATUS_OPTIONS.map(function(opt) {
  return '<option value="' + opt + '"' + (val === opt ? ' selected' : '') + '>' + opt + '</option>';
}).join('');
```

---

### Step 6 — Update `updateLeavesForStaff()` to count correctly

The current code checks `val === 'आकस्मिक अवकाश'` which is correct. **No change needed** — just confirm it matches the option value from Step 5.

---

### Step 7 — Add CSS for day-cell vertical text in print mode

In `src/app/globals.css`, inside the existing `@media print` block, add:

```css
@media print {
  /* Ensure vertical text renders in PDF */
  .att-day-cell-span {
    writing-mode: vertical-rl !important;
    text-orientation: mixed !important;
    transform: rotate(180deg) !important;
    display: inline-block !important;
  }
  /* Remove all screen-only chrome */
  .att-doc-page {
    transform: none !important;
    margin: 0 !important;
    box-shadow: none !important;
    width: 100% !important;
  }
  /* Table fits the page */
  #att-doc-table {
    page-break-inside: avoid;
    font-size: 6.5pt !important;
  }
}
```

---

## Column Width Formula

For a period spanning **N days**, the column widths must satisfy:

```
Total width = (A4 landscape printable width) - (left + right margins)
            = 297mm - 12mm = 285mm

Fixed columns = क्र.सं.(8mm) + नाम(25mm) + 3×summary(14mm each) = 75mm

Available for day columns = 285mm - 75mm = 210mm
Day column width = 210mm / N

For N=30: 7mm per day ✓ (fits comfortably)
For N=31: 6.8mm per day ✓ (still fits)
For N=20: 10.5mm per day (wider, looks better)
```

Apply this dynamically in `renderAttPreview()` by computing `DAY_W` from the date count:

```js
var PRINT_AVAILABLE_MM = 210; // mm available for day columns
var DAY_W_MM = Math.floor(PRINT_AVAILABLE_MM / dates.length);
var DAY_W_PX = Math.round(DAY_W_MM * (1122 / 297)); // convert mm to px at 1122px=297mm

// Use DAY_W_PX for each day column's width in the <col> and in inline styles
```

---

## Final Checklist

- [ ] **Period bar** at top: `अवधि - [from date in Hindi] से [to date in Hindi] तक` with border
- [ ] **Month group headers** span the correct number of columns per month
- [ ] **Date numbers** (11, 12, 13…) appear as second header row, bold
- [ ] **Status values** inside day cells are **vertical text** (rotated)
- [ ] **Narrow day columns** — approximately 7mm each in the final PDF
- [ ] **Three summary columns** at right with full Hindi label text, small font, line-wrapped
- [ ] **Day Off cells** have amber/yellow background tint
- [ ] **CL cells** have red/pink background tint
- [ ] **Total CL** is auto-calculated = current period CL + previous leaves input
- [ ] **PDF orientation** is `landscape`, format `a4`, margin `[6,6,6,6]`
- [ ] **html2canvas scale** is 2.5 for crisp Devanagari font rendering
- [ ] **No page header** "आयुर्वेद विभाग" or "उपस्थिति पत्रक" centered title (the reference format does not have these above the table)
- [ ] Office name appears **only** in the signature block bottom-right

---

## Files Changed

| File | Change |
|------|--------|
| `public/web-portal.js` | Rewrite `renderAttPreview()` entirely; update `att-btn-pdf` opt object; fix `STATUS_OPTIONS` consistency |
| `src/app/page.tsx` | Replace `att-doc-page` inner HTML with new structure (period bar + bare table + cert + sig) |
| `src/app/web-portal.css` | Update `.att-doc-page` min-height and transform; remove now-unused `.att-name-col`, `.att-day-col`, `.att-count-col` rules |
| `src/app/globals.css` | Add print-mode CSS for vertical text and table layout |
