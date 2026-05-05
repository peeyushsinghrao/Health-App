# Yoga Instructor Panel — AI Agent Implementation Plan
**Project:** Soochna Sahayak (Health-App-main)
**Task:** Implement the "Yoga Instructor" third option (currently "Coming Soon") as a fully working panel.

---

## Project Architecture Overview

This is a **Next.js** app with two key files that need editing:

| File | Role |
|---|---|
| `src/app/page.tsx` | All JSX/HTML structure. Uses React only for markup — all interactivity is in vanilla JS. |
| `public/web-portal.js` | All logic: state, render, events, PDF, Excel, navigation. Loaded as a static script. |
| `web-portal.css` | Document/print styles. Read-only for this task (no new CSS classes needed). |

**Pattern used by existing panels (PLP, Staff Attendance):**
1. Home card on home screen → `onClick → showPanel('panel-id')`
2. A hidden `<div id="panel-id">` contains a form side + A4 preview side
3. `web-portal.js` manages all state, render loops, event listeners, PDF/Excel/Print
4. `showPanel()` / `showHomeScreen()` hide/show the right divs

---

## Step 1 — Update `showPanel()` and `showHomeScreen()` in `public/web-portal.js`

Both functions need `'yog-panel'` added to their hide lists.

**Find `showPanel` (around line 429) and replace:**
```js
// BEFORE
function showPanel(panelId) {
  document.getElementById('home-screen').style.display = 'none';
  document.getElementById('plp-panel').style.display = 'none';
  document.getElementById('staff-att-panel').style.display = 'none';
  ...
}

// AFTER — add the yog-panel line
function showPanel(panelId) {
  document.getElementById('home-screen').style.display = 'none';
  document.getElementById('plp-panel').style.display = 'none';
  document.getElementById('staff-att-panel').style.display = 'none';
  document.getElementById('yog-panel').style.display = 'none'; // ADD THIS
  ...
}
```

**Find `showHomeScreen` and replace:**
```js
// BEFORE
function showHomeScreen() {
  document.getElementById('home-screen').style.display = 'flex';
  document.getElementById('plp-panel').style.display = 'none';
  document.getElementById('staff-att-panel').style.display = 'none';
  ...
}

// AFTER
function showHomeScreen() {
  document.getElementById('home-screen').style.display = 'flex';
  document.getElementById('plp-panel').style.display = 'none';
  document.getElementById('staff-att-panel').style.display = 'none';
  document.getElementById('yog-panel').style.display = 'none'; // ADD THIS
  ...
}
```

---

## Step 2 — Update Home Screen Card in `src/app/page.tsx`

Find the disabled "Coming Soon" Yoga card and replace it with an active, clickable card.

**Find this block:**
```tsx
{/* Yoga Card - Coming Soon */}
<div className="card card-disabled">
  <div className="absolute top-6 right-6 badge badge-secondary">शीघ्र आ रहा है</div>
  <div className="card-icon-wrap ... text-[var(--text-muted)]">
    <Heart size={22} strokeWidth={1.5} />
  </div>
  <h3 className="... text-[var(--text-secondary)] ...">Yoga Instructor</h3>
  <p className="... text-[var(--text-muted)] ...">
    योग प्रशिक्षक उपस्थिति शीघ्र उपलब्ध
  </p>
  <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
    <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Coming Soon</span>
  </div>
</div>
```

**Replace with:**
```tsx
{/* Yoga Instructor Card - Active */}
<div
  className="home-card group card cursor-pointer"
  data-tooltip="Yoga Instructor Payment Report"
  onClick={() => { if (typeof window !== 'undefined') (window as any).showPanel?.('yog-panel'); }}
>
  <div className="absolute top-6 right-6 badge badge-primary">सक्रिय</div>

  <div className="card-icon-wrap w-[46px] h-[46px] rounded-[10px] bg-[var(--accent-light)] flex items-center justify-center mb-6 text-[var(--accent-primary)]">
    <Heart size={22} strokeWidth={1.5} />
  </div>

  <h3 className="font-display text-[19px] font-semibold text-[var(--text-primary)] mb-2">Yoga Instructor</h3>

  <p className="font-body text-[13px] text-[var(--text-muted)] leading-[1.65] mb-6">
    योग शिक्षक उपस्थिति पत्रक एवं भुगतान रिपोर्ट
  </p>

  <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
    <span className="text-[11px] font-medium text-[var(--accent-primary)] uppercase tracking-wider">Generate Report</span>
    <ArrowRight size={18} className="card-arrow text-[var(--text-muted)]" />
  </div>
</div>
```

**Also update the stats counter** (find `"2"` in the stats row near the cards and change to `"3"`):
```tsx
// BEFORE
<span className="stat-count">2</span>
<span className="stat-label">Active Tools</span>

// AFTER
<span className="stat-count">3</span>
<span className="stat-label">Active Tools</span>
```

---

## Step 3 — Add Yoga Panel HTML in `src/app/page.tsx`

Add this block **after the closing `</div>` of the `staff-att-panel` div** and **before the final `</div>` that closes the root component div**.

The full panel follows the exact same layout pattern as the other two panels: a `flex flex-col xl:flex-row` container with a form side on the left and an A4 preview on the right.

```tsx
{/* ========== YOGA INSTRUCTOR PANEL ========== */}
<div
  id="yog-panel"
  className="page inner-page-wrap flex flex-col px-4 sm:px-6 py-8 sm:py-12 md:px-12 max-w-[1400px] mx-auto w-full gap-8 min-h-screen safe-bottom-mobile"
  style={{ display: 'none' }}
>
  {/* Back Button */}
  <button
    className="back-btn no-print"
    onClick={() => { if (typeof window !== 'undefined') (window as any).showHomeScreen?.(); }}
  >
    <ChevronLeft size={16} strokeWidth={2} /> होम
  </button>

  <div className="flex flex-col xl:flex-row gap-8 w-full">

    {/* ── FORM SIDE ── */}
    <div className="form-panel flex-1 no-print">

      <div className="page-title-area">
        <h2 className="font-display text-[26px] font-semibold text-[var(--text-primary)] mb-1">
          योग शिक्षक उपस्थिति पत्रक
        </h2>
        <p className="text-[var(--text-muted)] text-sm">डेटा दर्ज करें</p>
      </div>

      <div className="flex flex-col gap-6">

        {/* Error box */}
        <div
          className="err-box bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm mb-4"
          id="yog-err-box"
          style={{ display: 'none' }}
        />

        {/* Header fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Center Name — full width */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-[0.02em] uppercase">
              कार्यालय आयुष्मान आरोग्य मंदिर राजकीय (केंद्र का नाम)
            </label>
            <input
              className="form-input-base"
              type="text"
              id="yog-center-name"
              placeholder="केंद्र का पूरा नाम दर्ज करें"
            />
          </div>

          {/* Kramank */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-[0.02em] uppercase">
              क्रमांक{' '}
              <span style={{ fontSize: '10px', fontWeight: 400, textTransform: 'none' }}>
                (वैकल्पिक)
              </span>
            </label>
            <input className="form-input-base" type="text" id="yog-kramank" placeholder="क्रमांक" />
          </div>

          {/* Date */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-[0.02em] uppercase">
              दिनांक
            </label>
            <input className="form-input-base" type="date" id="yog-date" />
          </div>

          {/* Month selector — full width */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-[0.02em] uppercase">
              माह
            </label>
            {/* JS will populate this <select> via populateYogMonthSelect() */}
            <select
              className="form-input-base"
              id="yog-month"
              style={{ maxWidth: '280px' }}
            />
          </div>

        </div>{/* end grid */}

        {/* Instructor Table */}
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] mt-2">
          <table className="w-full text-left border-collapse" style={{ minWidth: '900px' }}>
            <thead>
              <tr className="bg-[var(--bg-elevated)] text-[var(--text-secondary)] text-[11px] uppercase tracking-[0.04em] [&>th]:p-2 [&>th]:border-b [&>th]:border-[var(--border)] [&>th]:text-center">
                <th style={{ width: '36px' }}>क्र.</th>
                <th style={{ minWidth: '140px' }}>नाम योग शिक्षक</th>
                <th style={{ width: '120px' }}>महिला / पुरुष</th>
                <th style={{ width: '80px' }}>दिवस संख्या</th>
                <th style={{ width: '100px' }}>जन सामान्य को योग घंटे</th>
                <th style={{ width: '90px' }}>IEC कार्यक्रम घंटे</th>
                <th style={{ width: '90px' }}>कुल निष्पादित घंटे</th>
                <th style={{ width: '100px' }}>निर्धारित दर/घंटे</th>
                <th style={{ width: '100px' }}>कुल भुगतान योग राशि</th>
                <th style={{ width: '36px' }} className="no-print">—</th>
              </tr>
            </thead>
            {/* JS renders rows into this tbody */}
            <tbody
              id="yog-tbody"
              className="[&>tr:nth-child(even)]:bg-[var(--bg-elevated)] [&>tr:nth-child(odd)]:bg-[var(--bg-surface)] [&>tr>td]:p-2 [&>tr>td]:border-b [&>tr>td]:border-[var(--border)] [&>tr>td]:text-center"
            />
          </table>
        </div>

        {/* Add Row Button — hidden when 2 rows exist */}
        <button className="add-row-btn" id="yog-add-row-btn">
          + योग शिक्षक जोड़ें
        </button>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 bg-[var(--bg-surface)] md:bg-transparent p-4 md:p-0 border-t border-[var(--border)] md:border-none z-20 mt-4 btn-row no-print">
          <button className="btn btn-ghost" id="yog-btn-preview">
            <Eye size={16} /> Preview
          </button>
          <button className="btn btn-secondary" id="yog-btn-print">
            <Printer size={16} /> Print
          </button>
          <button className="btn btn-excel" id="yog-btn-excel">
            <Table size={16} /> Excel
          </button>
          <button className="btn btn-primary" id="yog-btn-pdf">
            <Download size={16} /> Save PDF
          </button>
        </div>

      </div>
    </div>{/* end form-panel */}

    {/* ── A4 PREVIEW SIDE ── */}
    <div className="flex-1 xl:max-w-[420px] 2xl:max-w-[500px]">
      <div className="text-[var(--text-secondary)] font-medium text-sm mb-4 flex items-center gap-2 no-print">
        📄 दस्तावेज़ प्रीव्यू (A4)
      </div>
      <div className="a4-scaler bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl overflow-hidden p-6 shadow-[var(--shadow-card-rest)]">
        <div
          id="yog-doc-page"
          className="doc-page"
          style={{ fontFamily: "'Noto Sans Devanagari', serif", fontSize: '8pt' }}
        >

          {/* Doc: Fixed dept header */}
          <div style={{ textAlign: 'center', marginBottom: '4px' }}>
            <div style={{ fontWeight: 700, fontSize: '9pt' }}>
              आयुर्वेद विभाग राजस्थान सरकार
            </div>
            <div style={{ fontSize: '8pt', marginTop: '2px' }}>
              कार्यालय आयुष्मान आरोग्य मंदिर राजकीय{' '}
              {/* JS updates this span */}
              <span id="yog-doc-center" style={{ fontWeight: 700 }}>
                ____________________
              </span>
            </div>
          </div>

          {/* Doc: Kramank & Date row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5pt', margin: '4px 0' }}>
            <span>क्रमांक - <span id="yog-doc-kramank">______</span></span>
            <span>दिनांक - <span id="yog-doc-date">______</span></span>
          </div>

          {/* Doc: Title */}
          <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '9pt', margin: '5px 0', textDecoration: 'underline' }}>
            योग शिक्षक उपस्थिति पत्रक
          </div>
          <div style={{ textAlign: 'center', fontSize: '8pt', marginBottom: '6px' }}>
            माह - <span id="yog-doc-month" style={{ fontWeight: 600 }}>______</span>
          </div>

          {/* Doc: Main 9-column table */}
          <table
            id="yog-doc-table"
            style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.5pt', tableLayout: 'fixed' }}
          >
            <thead>
              {/* Row 1: column labels */}
              <tr style={{ background: '#f0f0f0' }}>
                {[
                  ['28px',  'क्र.सं.'],
                  ['auto',  'नाम योग शिक्षक'],
                  ['52px',  'महिला / पुरुष योग शिक्षक'],
                  ['44px',  'माह के दौरान दिवस'],
                  ['50px',  'जन सामान्य को कराए गए योग शिक्षण के कुल घंटे'],
                  ['44px',  'IEC प्रोग्राम हेतु संपादित घंटे'],
                  ['44px',  'कुल निष्पादित कार्य घंटे'],
                  ['44px',  'निर्धारित दर प्रति घंटे'],
                  ['52px',  'कुल भुगतान योग राशि जिसकी अनुशंसा की जाती है'],
                ].map(([w, label], i) => (
                  <th
                    key={i}
                    style={{
                      border: '1px solid #000',
                      padding: '2px 3px',
                      textAlign: 'center',
                      fontWeight: 700,
                      width: w,
                      verticalAlign: 'middle',
                      lineHeight: 1.3,
                    }}
                  >
                    {label}
                  </th>
                ))}
              </tr>
              {/* Row 2: column numbers 1–9 */}
              <tr style={{ background: '#f8f8f8' }}>
                {[1,2,3,4,5,6,7,8,9].map(n => (
                  <th
                    key={n}
                    style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', fontWeight: 400 }}
                  >
                    {n}
                  </th>
                ))}
              </tr>
            </thead>
            {/* JS renders data rows here */}
            <tbody id="yog-doc-tbody" />
          </table>

          {/* Doc: Certification paragraph */}
          <div
            id="yog-doc-certify"
            style={{
              marginTop: '7px',
              fontSize: '7pt',
              lineHeight: 1.6,
              border: '1px solid #bbb',
              padding: '5px 7px',
              background: '#fafafa',
            }}
          >
            प्रमाणित किया जाता है कि उपर्युक्त टेबल के कॉलम संख्या 4 में उल्लेखित दिवसों में
            योग शिक्षक द्वारा प्रतिदिन एक घंटे से अधिक कार्य सम्पादित किया गया एवं मैं उनके
            कार्य से संतुष्ट हूँ। कॉलम संख्या 9 में अंकित राशि के भुगतान की अनुशंसा की जाती है।
          </div>

          {/* Doc: Signature block */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <div style={{ textAlign: 'center', minWidth: '160px' }}>
              <div style={{ height: '32px', borderBottom: '1.5px solid #000', marginBottom: '4px' }} />
              <div style={{ fontWeight: 700, fontSize: '7.5pt' }}>भारी</div>
              {/* JS puts center name here as seal */}
              <div id="yog-doc-seal" style={{ fontSize: '7pt', marginTop: '2px', color: '#555' }} />
            </div>
          </div>

        </div>{/* end yog-doc-page */}
      </div>
    </div>{/* end preview side */}

  </div>{/* end flex row */}

  {/* Panel footer */}
  <div className="text-center text-[13px] text-[var(--text-muted)] mt-12 mb-6 no-print">
    Made By Peeyush Singh, Assistant Accounts Officer II
  </div>

</div>{/* end yog-panel */}
```

---

## Step 4 — Add Yoga Module to `public/web-portal.js`

Append this entire block at the **very end of the file**, after the existing `window.showPanel = showPanel;` and `window.showHomeScreen = showHomeScreen;` lines.

### 4a. Helper functions

```js
/* =========================================================
   YOGA INSTRUCTOR MODULE
   ========================================================= */
(function () {
  'use strict';
```

### 4b. Constants

```js
  var YOG_MONTHS = [
    'जनवरी','फरवरी','मार्च','अप्रैल','मई','जून',
    'जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'
  ];

  // Days in each month (0-based index). Feb handled dynamically.
  var YOG_MONTH_DAYS = [31,28,31,30,31,30,31,31,30,31,30,31];
```

### 4c. Month helper

```js
  function getDaysInMonth(monthIdx, year) {
    if (monthIdx === 1) {
      return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 29 : 28;
    }
    return YOG_MONTH_DAYS[monthIdx];
  }

  // Returns { idx, year, label, days } for currently selected month
  function getSelectedMonthMeta() {
    var sel = document.getElementById('yog-month');
    if (!sel || !sel.value) return { idx: 0, year: new Date().getFullYear(), label: '', days: 31 };
    var val = parseInt(sel.value, 10);
    // value encoding: monthIdx * 10000 + year
    var monthIdx = Math.floor(val / 10000);
    var year = val % 10000;
    return {
      idx: monthIdx,
      year: year,
      label: YOG_MONTHS[monthIdx] + ' ' + year,
      days: getDaysInMonth(monthIdx, year)
    };
  }
```

### 4d. State

```js
  var yogState = {
    centerName: '',
    kramank: '',
    date: '',        // ISO string YYYY-MM-DD
    monthVal: 0,     // encoded as monthIdx * 10000 + year
    rows: [
      { naam: '', gender: 'पुरुष', days: '', hoursYog: '', hoursIEC: '' }
    ]
  };
```

### 4e. Month select population (called once on init)

```js
  function populateYogMonthSelect() {
    var sel = document.getElementById('yog-month');
    if (!sel) return;
    var now = new Date();
    var curMonth = now.getMonth();   // 0-based
    var curYear  = now.getFullYear();
    sel.innerHTML = '';
    // Show 12 months: 6 past + current + 5 future
    for (var offset = -6; offset <= 5; offset++) {
      var m = curMonth + offset;
      var y = curYear;
      while (m < 0)  { m += 12; y--; }
      while (m > 11) { m -= 12; y++; }
      var opt = document.createElement('option');
      opt.value = m * 10000 + y;
      opt.textContent = YOG_MONTHS[m] + ' ' + y;
      if (offset === 0) opt.selected = true;
      sel.appendChild(opt);
    }
    yogState.monthVal = parseInt(sel.value, 10);
  }
```

### 4f. Row calculation (the core business logic)

```js
  // Given a row object, returns all derived values with capping applied.
  function calcYogRow(row) {
    var isFemale = row.gender === 'महिला';
    var meta = getSelectedMonthMeta();

    var days = Math.min(parseInt(row.days, 10) || 0, meta.days);

    var maxYog  = isFemale ? 20 : 31;
    var hoursYog = Math.min(parseFloat(row.hoursYog) || 0, maxYog);

    var hoursIEC = 0;
    if (!isFemale) {
      hoursIEC = Math.min(parseFloat(row.hoursIEC) || 0, 2);
    }

    var maxTotal   = isFemale ? 20 : 33;
    var totalHours = Math.min(hoursYog + hoursIEC, maxTotal);

    var maxPayment = isFemale ? 5000 : 8000;
    var payment    = Math.min(totalHours * 250, maxPayment);

    return { days, hoursYog, hoursIEC, totalHours, rate: 250, payment, isFemale };
  }
```

### 4g. Form table render

```js
  function renderYogTable() {
    var tbody = document.getElementById('yog-tbody');
    if (!tbody) return;
    var meta = getSelectedMonthMeta();
    var html = '';

    yogState.rows.forEach(function (row, idx) {
      var calc = calcYogRow(row);

      html += '<tr>';
      // Col 1: S.No.
      html += '<td style="font-weight:600">' + (idx + 1) + '</td>';

      // Col 2: Name input
      html += '<td><input class="form-input-base yog-inp" style="min-width:120px;font-size:12px" '
            + 'type="text" data-idx="' + idx + '" data-field="naam" '
            + 'value="' + esc(row.naam) + '" placeholder="नाम दर्ज करें"></td>';

      // Col 3: Gender select
      html += '<td><select class="form-input-base yog-sel" style="font-size:12px" '
            + 'data-idx="' + idx + '" data-field="gender">'
            + '<option value="पुरुष"' + (row.gender === 'पुरुष' ? ' selected' : '') + '>पुरुष</option>'
            + '<option value="महिला"' + (row.gender === 'महिला' ? ' selected' : '') + '>महिला</option>'
            + '</select></td>';

      // Col 4: Days (max = days in selected month)
      html += '<td><input class="form-input-base yog-inp" style="font-size:12px;text-align:center" '
            + 'type="number" min="0" max="' + meta.days + '" '
            + 'data-idx="' + idx + '" data-field="days" '
            + 'value="' + (row.days || '') + '" placeholder="0"></td>';

      // Col 5: Yoga hours (पुरुष max 31, महिला max 20)
      html += '<td><input class="form-input-base yog-inp" style="font-size:12px;text-align:center" '
            + 'type="number" min="0" max="' + (calc.isFemale ? 20 : 31) + '" step="0.5" '
            + 'data-idx="' + idx + '" data-field="hoursYog" '
            + 'value="' + (row.hoursYog || '') + '" placeholder="0"></td>';

      // Col 6: IEC hours — NA and disabled for महिला
      if (calc.isFemale) {
        html += '<td style="color:var(--text-muted);font-style:italic;font-size:12px">NA</td>';
      } else {
        html += '<td><input class="form-input-base yog-inp" style="font-size:12px;text-align:center" '
              + 'type="number" min="0" max="2" step="0.5" '
              + 'data-idx="' + idx + '" data-field="hoursIEC" '
              + 'value="' + (row.hoursIEC || '') + '" placeholder="0"></td>';
      }

      // Col 7: Total hours (auto, read-only display)
      html += '<td style="font-weight:600;color:var(--accent-primary)">' + calc.totalHours + '</td>';

      // Col 8: Rate (fixed, non-editable)
      html += '<td style="color:var(--text-secondary);font-size:11px">₹250/घंटे</td>';

      // Col 9: Payment (auto)
      html += '<td style="font-weight:700;color:var(--accent-primary)">₹'
            + calc.payment.toLocaleString('en-IN') + '</td>';

      // Remove button (disabled if only 1 row)
      html += '<td class="no-print"><button class="rm-btn" '
            + 'onclick="window._yogRemoveRow(' + idx + ')" '
            + (yogState.rows.length <= 1 ? 'disabled' : '') + '>✕</button></td>';

      html += '</tr>';
    });

    tbody.innerHTML = html;

    // Hide "Add" button once 2 rows exist (max is 2)
    var addBtn = document.getElementById('yog-add-row-btn');
    if (addBtn) addBtn.style.display = yogState.rows.length >= 2 ? 'none' : '';

    // Attach input listeners to newly rendered inputs
    tbody.querySelectorAll('.yog-inp').forEach(function (inp) {
      inp.addEventListener('input', function () {
        yogState.rows[parseInt(this.dataset.idx, 10)][this.dataset.field] = this.value;
        renderYogDoc();
        debouncedYogSave();
      });
    });

    // Attach change listeners to gender selects
    tbody.querySelectorAll('.yog-sel').forEach(function (sel) {
      sel.addEventListener('change', function () {
        var idx = parseInt(this.dataset.idx, 10);
        yogState.rows[idx][this.dataset.field] = this.value;
        // Reset IEC when switching to female
        if (this.dataset.field === 'gender' && this.value === 'महिला') {
          yogState.rows[idx].hoursIEC = '';
        }
        renderYogTable();   // full re-render to show/hide IEC cell
        renderYogDoc();
        debouncedYogSave();
      });
    });
  }

  // Exposed globally so onclick="window._yogRemoveRow(idx)" works
  window._yogRemoveRow = function (idx) {
    if (yogState.rows.length <= 1) return;
    yogState.rows.splice(idx, 1);
    renderYogTable();
    renderYogDoc();
  };
```

### 4h. A4 document render

```js
  function renderYogDoc() {
    // Header spans
    var elCenter = document.getElementById('yog-doc-center');
    if (elCenter) elCenter.textContent = yogState.centerName || '____________________';

    var elKr = document.getElementById('yog-doc-kramank');
    if (elKr) elKr.textContent = yogState.kramank || '______';

    var elDate = document.getElementById('yog-doc-date');
    if (elDate) {
      if (yogState.date) {
        var d = new Date(yogState.date + 'T00:00:00');
        elDate.textContent = d.toLocaleDateString('hi-IN', {
          day: '2-digit', month: 'long', year: 'numeric'
        });
      } else {
        elDate.textContent = '______';
      }
    }

    var elMonth = document.getElementById('yog-doc-month');
    if (elMonth) elMonth.textContent = getSelectedMonthMeta().label || '______';

    var elSeal = document.getElementById('yog-doc-seal');
    if (elSeal) elSeal.textContent = yogState.centerName || '';

    // Table body rows
    var docTbody = document.getElementById('yog-doc-tbody');
    if (!docTbody) return;

    var C = 'border:1px solid #000;padding:2px 3px;text-align:center;vertical-align:middle;';

    var rows = yogState.rows.map(function (row, idx) {
      var calc = calcYogRow(row);
      return '<tr>'
        + '<td style="' + C + '">' + (idx + 1) + '</td>'
        + '<td style="' + C + 'text-align:left;">' + (row.naam || '') + '</td>'
        + '<td style="' + C + '">' + row.gender + ' योग शिक्षक</td>'
        + '<td style="' + C + '">' + (row.days || '') + '</td>'
        + '<td style="' + C + '">' + (row.hoursYog || '') + '</td>'
        + '<td style="' + C + '">' + (calc.isFemale ? 'NA' : (row.hoursIEC || '')) + '</td>'
        + '<td style="' + C + 'font-weight:700">' + calc.totalHours + '</td>'
        + '<td style="' + C + '">₹250/-</td>'
        + '<td style="' + C + 'font-weight:700">'
        + (calc.payment ? '₹' + calc.payment.toLocaleString('en-IN') + '/-' : '') + '</td>'
        + '</tr>';
    }).join('');

    docTbody.innerHTML = rows;
  }
```

### 4i. Header field event listeners

```js
  function attachYogHeaderListeners() {
    var centerEl = document.getElementById('yog-center-name');
    if (centerEl) centerEl.addEventListener('input', function () {
      yogState.centerName = this.value;
      renderYogDoc();
      debouncedYogSave();
    });

    var krEl = document.getElementById('yog-kramank');
    if (krEl) krEl.addEventListener('input', function () {
      yogState.kramank = this.value;
      renderYogDoc();
      debouncedYogSave();
    });

    var dateEl = document.getElementById('yog-date');
    if (dateEl) {
      // Set today as default
      var today = new Date().toISOString().slice(0, 10);
      dateEl.value = today;
      yogState.date = today;

      dateEl.addEventListener('change', function () {
        yogState.date = this.value;
        renderYogDoc();
        debouncedYogSave();
      });
    }

    var monthEl = document.getElementById('yog-month');
    if (monthEl) monthEl.addEventListener('change', function () {
      yogState.monthVal = parseInt(this.value, 10);
      renderYogTable();   // re-render because max days may have changed
      renderYogDoc();
      debouncedYogSave();
    });
  }
```

### 4j. Add-row button

```js
  function attachYogAddRow() {
    var btn = document.getElementById('yog-add-row-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (yogState.rows.length >= 2) return;
      yogState.rows.push({ naam: '', gender: 'पुरुष', days: '', hoursYog: '', hoursIEC: '' });
      renderYogTable();
      renderYogDoc();
    });
  }
```

### 4k. PDF export

```js
  function exportYogPDF() {
    if (typeof window.html2pdf === 'undefined') {
      showToast('⚠️ PDF लाइब्रेरी लोड नहीं हुई');
      return;
    }
    var meta = getSelectedMonthMeta();
    var overlay = document.getElementById('overlay');
    if (overlay) { overlay.style.opacity = '1'; overlay.style.pointerEvents = 'auto'; }

    window.html2pdf().set({
      margin: [8, 8, 8, 8],
      filename: 'Yog_Shikshak_' + meta.label.replace(' ', '_') + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(document.getElementById('yog-doc-page')).save().then(function () {
      if (overlay) { overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none'; }
      if (window.soundFX) window.soundFX.success();
      showToast('✅ PDF सहेजा गया');
      // Save to report history
      saveReportToHistory({
        type: 'yog',
        title: 'योग शिक्षक',
        subtitle: yogState.centerName || 'केंद्र',
        period: meta.label,
        snapshot: JSON.stringify({
          centerName: yogState.centerName,
          kramank: yogState.kramank,
          date: yogState.date,
          monthVal: yogState.monthVal,
          rows: yogState.rows
        })
      });
      renderHistorySection();
    });
  }
```

### 4l. Print export

```js
  function printYogDoc() {
    var el = document.getElementById('yog-doc-page');
    if (!el) return;
    var win = window.open('', '_blank');
    win.document.write('<html><head><title>योग शिक्षक उपस्थिति पत्रक</title>');
    win.document.write('<style>'
      + 'body{font-family:"Noto Sans Devanagari",serif;margin:10mm;}'
      + 'table{border-collapse:collapse;width:100%;}'
      + 'th,td{border:1px solid #000;padding:3px 4px;font-size:7.5pt;}'
      + 'th{background:#f0f0f0;font-weight:700;}'
      + '</style>');
    win.document.write('</head><body>');
    win.document.write(el.outerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    setTimeout(function () { win.print(); win.close(); }, 400);
  }
```

### 4m. Excel export

```js
  function exportYogExcel() {
    if (typeof XLSX === 'undefined') {
      showToast('⚠️ Excel लाइब्रेरी लोड नहीं हुई');
      return;
    }
    var meta = getSelectedMonthMeta();
    var wb = XLSX.utils.book_new();
    var wsData = [
      ['आयुर्वेद विभाग राजस्थान सरकार'],
      ['कार्यालय आयुष्मान आरोग्य मंदिर राजकीय - ' + (yogState.centerName || '')],
      ['योग शिक्षक उपस्थिति पत्रक', '', '', '', '', '', '', '', 'माह: ' + meta.label],
      [],
      ['क्र.सं.','नाम योग शिक्षक','महिला / पुरुष','दिवस संख्या',
       'जन सामान्य योग घंटे','IEC कार्यक्रम घंटे','कुल निष्पादित घंटे',
       'निर्धारित दर/घंटे','कुल भुगतान राशि']
    ];
    yogState.rows.forEach(function (row, idx) {
      var calc = calcYogRow(row);
      wsData.push([
        idx + 1,
        row.naam || '',
        row.gender + ' योग शिक्षक',
        row.days || '',
        row.hoursYog || '',
        calc.isFemale ? 'NA' : (row.hoursIEC || ''),
        calc.totalHours,
        '₹250/-',
        calc.payment ? '₹' + calc.payment + '/-' : ''
      ]);
    });
    wsData.push([]);
    wsData.push(['प्रमाणित किया जाता है कि उपर्युक्त टेबल के कॉलम संख्या 4 में उल्लेखित दिवसों में योग शिक्षक द्वारा प्रतिदिन एक घंटे से अधिक कार्य सम्पादित किया गया।']);

    var ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [{wch:6},{wch:28},{wch:20},{wch:14},{wch:18},{wch:18},{wch:20},{wch:18},{wch:20}];
    XLSX.utils.book_append_sheet(wb, ws, 'योग शिक्षक');
    XLSX.writeFile(wb, 'Yog_Shikshak_' + meta.label.replace(' ', '_') + '.xlsx');
    if (window.soundFX) window.soundFX.success();
    showToast('✅ Excel सहेजा गया');
  }
```

### 4n. Button event listeners

```js
  function attachYogButtons() {
    var pdfBtn = document.getElementById('yog-btn-pdf');
    if (pdfBtn) pdfBtn.addEventListener('click', exportYogPDF);

    var printBtn = document.getElementById('yog-btn-print');
    if (printBtn) printBtn.addEventListener('click', printYogDoc);

    var excelBtn = document.getElementById('yog-btn-excel');
    if (excelBtn) excelBtn.addEventListener('click', exportYogExcel);

    var previewBtn = document.getElementById('yog-btn-preview');
    if (previewBtn) previewBtn.addEventListener('click', function () {
      var docPage = document.getElementById('yog-doc-page');
      if (docPage) {
        docPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showToast('👁️ प्रीव्यू देखें →');
      }
    });
  }
```

### 4o. Auto-save (debounced, same pattern as PLP/Att)

```js
  function autoSaveYog() {
    try {
      localStorage.setItem('yog_draft', JSON.stringify({
        centerName: yogState.centerName,
        kramank:    yogState.kramank,
        date:       yogState.date,
        monthVal:   yogState.monthVal,
        rows:       yogState.rows,
        savedAt:    new Date().toISOString()
      }));
      showToast('✓ ड्राफ्ट सुरक्षित');
    } catch (e) { /* storage full — fail silently */ }
  }

  // debounce() is already defined earlier in web-portal.js
  var debouncedYogSave = debounce(autoSaveYog, 1500);

  // Hook panel-level input/change to auto-save
  var yogPanel = document.getElementById('yog-panel');
  if (yogPanel) {
    yogPanel.addEventListener('input', debouncedYogSave);
    yogPanel.addEventListener('change', debouncedYogSave);
  }
```

### 4p. Draft restore on page load

```js
  function restoreYogDraft() {
    try {
      var saved = localStorage.getItem('yog_draft');
      if (!saved) return;
      var data = JSON.parse(saved);

      if (data.centerName) {
        yogState.centerName = data.centerName;
        var el = document.getElementById('yog-center-name');
        if (el) el.value = data.centerName;
      }
      if (data.kramank) {
        yogState.kramank = data.kramank;
        var el2 = document.getElementById('yog-kramank');
        if (el2) el2.value = data.kramank;
      }
      if (data.date) {
        yogState.date = data.date;
        var el3 = document.getElementById('yog-date');
        if (el3) el3.value = data.date;
      }
      if (data.monthVal) {
        yogState.monthVal = data.monthVal;
        var el4 = document.getElementById('yog-month');
        if (el4) el4.value = data.monthVal;
      }
      if (data.rows && data.rows.length > 0) yogState.rows = data.rows;

      renderYogTable();
      renderYogDoc();
      showToast('📂 योग ड्राफ्ट पुनः लोड किया गया');
    } catch (e) { /* ignore */ }
  }
```

### 4q. Module init (called last inside the IIFE)

```js
  // ── INIT ──
  populateYogMonthSelect();
  attachYogHeaderListeners();
  attachYogAddRow();
  attachYogButtons();
  renderYogTable();
  renderYogDoc();
  restoreYogDraft();

})(); /* end Yoga Module IIFE */
```

---

## Step 5 — Update `renderHistorySection()` icon for 'yog' type

Find this line in the `renderHistorySection` function:
```js
// BEFORE
var icon = entry.type === 'plp' ? '📊' : '📋';

// AFTER
var icon = entry.type === 'plp' ? '📊' : entry.type === 'yog' ? '🧘' : '📋';
```

---

## Step 6 — Update `restoreFromHistory()` for 'yog' type

Find the end of the `restoreFromHistory` function and add the `yog` case before the closing `}`:

```js
    } else if (entry.type === 'att') {
      // ... existing att restore code ...
      showToast('📂 उपस्थिति पत्रक पुनः लोड किया गया');

    } else if (entry.type === 'yog') {             // ← ADD THIS BLOCK
      // Store snapshot and navigate; the Yoga module's restoreYogDraft
      // will be triggered by writing to localStorage and re-calling restore.
      try {
        localStorage.setItem('yog_draft', entry.snapshot);
        showPanel('yog-panel');
        // Give the panel time to show, then restore
        setTimeout(function () {
          var data = JSON.parse(entry.snapshot);
          if (data.centerName) {
            yogState.centerName = data.centerName;
            var el = document.getElementById('yog-center-name');
            if (el) el.value = data.centerName;
          }
          if (data.kramank) {
            yogState.kramank = data.kramank;
            var el2 = document.getElementById('yog-kramank');
            if (el2) el2.value = data.kramank;
          }
          if (data.date) {
            yogState.date = data.date;
            var el3 = document.getElementById('yog-date');
            if (el3) el3.value = data.date;
          }
          if (data.monthVal) {
            yogState.monthVal = data.monthVal;
            var el4 = document.getElementById('yog-month');
            if (el4) el4.value = data.monthVal;
          }
          if (data.rows) yogState.rows = data.rows;
          renderYogTable();
          renderYogDoc();
          showToast('📂 योग रिपोर्ट पुनः लोड की गई');
        }, 100);
      } catch(e) { showToast('⚠️ रिपोर्ट लोड नहीं हो सकी'); }
    }
```

> **Note:** `yogState`, `renderYogTable`, and `renderYogDoc` are accessible here because they were added to the Yoga Module IIFE scope in Step 4. To make them accessible in `restoreFromHistory`, expose them on `window` inside the IIFE:
> ```js
> // Inside IIFE, after declaring them:
> window._yogState        = yogState;
> window._renderYogTable  = renderYogTable;
> window._renderYogDoc    = renderYogDoc;
> ```
> Then in `restoreFromHistory`, use `window._yogState`, `window._renderYogTable()`, `window._renderYogDoc()`.

---

## Business Logic Rules (DO NOT CHANGE)

| Rule | Detail |
|---|---|
| Rows | Min 1, max 2 |
| Gender | पुरुष or महिला per row |
| Days max | Total days of selected month (leap year aware) |
| पुरुष — योग घंटे max | 31 |
| पुरुष — IEC घंटे max | 2 |
| पुरुष — total घंटे max | 33 |
| पुरुष — payment max | ₹8,000 |
| महिला — योग घंटे max | 20 |
| महिला — IEC घंटे | Disabled, shows "NA" |
| महिला — total घंटे max | 20 |
| महिला — payment max | ₹5,000 |
| Rate | ₹250/घंटे (fixed, never editable) |
| Payment formula | `min(totalHours × 250, maxPayment)` |

---

## ID Reference (HTML ↔ JS)

| Element | ID | JS reads/writes |
|---|---|---|
| Center name input | `yog-center-name` | `yogState.centerName` |
| Kramank input | `yog-kramank` | `yogState.kramank` |
| Date input | `yog-date` | `yogState.date` |
| Month select | `yog-month` | `yogState.monthVal` |
| Form table body | `yog-tbody` | rendered by `renderYogTable()` |
| Add row button | `yog-add-row-btn` | disabled when rows.length ≥ 2 |
| Error box | `yog-err-box` | show/hide on validation |
| PDF button | `yog-btn-pdf` | calls `exportYogPDF()` |
| Print button | `yog-btn-print` | calls `printYogDoc()` |
| Excel button | `yog-btn-excel` | calls `exportYogExcel()` |
| Preview button | `yog-btn-preview` | scrolls to A4 preview |
| Doc: center span | `yog-doc-center` | mirrors centerName |
| Doc: kramank span | `yog-doc-kramank` | mirrors kramank |
| Doc: date span | `yog-doc-date` | formatted Hindi date |
| Doc: month span | `yog-doc-month` | e.g. "अप्रैल 2026" |
| Doc: table body | `yog-doc-tbody` | rendered by `renderYogDoc()` |
| Doc: seal span | `yog-doc-seal` | mirrors centerName |

---

## Existing Utilities Already Available (DO NOT REDEFINE)

These are defined earlier in `web-portal.js` and can be called directly:

- `esc(str)` — escapes HTML special chars for safe insertion
- `debounce(fn, delay)` — returns debounced version of fn
- `showToast(message, duration)` — shows toast notification
- `saveReportToHistory(entry)` — saves to localStorage history
- `renderHistorySection()` — re-renders the history panel on home screen
- `showPanel(panelId)` — navigation to a panel
- `showHomeScreen()` — navigation back to home
- `XLSX` — SheetJS, loaded via CDN script tag in page.tsx
- `html2pdf` — html2pdf.js, loaded via CDN script tag in page.tsx

---

## Checklist for Agent

- [ ] Step 1: `showPanel()` hides `yog-panel`
- [ ] Step 1: `showHomeScreen()` hides `yog-panel`
- [ ] Step 2: Home card changed from disabled to active with `showPanel('yog-panel')`
- [ ] Step 2: Stats counter updated from 2 → 3
- [ ] Step 3: `yog-panel` div added to `page.tsx` with all correct IDs
- [ ] Step 4: Yoga IIFE module appended to end of `web-portal.js`
- [ ] Step 4: All IDs in JS match IDs in HTML exactly
- [ ] Step 4: `window._yogRemoveRow` exposed for inline onclick
- [ ] Step 5: History icon updated for `'yog'` type
- [ ] Step 6: `restoreFromHistory` handles `'yog'` type
- [ ] Verify: No syntax errors in `web-portal.js` (`node --check public/web-portal.js`)
- [ ] Verify: महिला row shows NA for IEC and never allows >₹5000
- [ ] Verify: पुरुष row allows IEC input and never allows >₹8000
- [ ] Verify: Days field is capped to actual days in selected month
- [ ] Verify: Switching month updates the days max constraint
- [ ] Verify: Auto-save stores to `localStorage('yog_draft')` on input
- [ ] Verify: Page load restores from `yog_draft` if present
