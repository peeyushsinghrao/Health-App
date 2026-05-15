'use strict';

/* =========================================================
   CONSTANTS
   ========================================================= */
const KARYA_NAMES = [
  "ओपीडी",
  "प्रकृति परीक्षण",
  "आयुष सुविधा में पेनलबद्ध व्यक्तियों की संख्या",
  "उच्च रक्तचाप हेतु परीक्षित 30 वर्ष से अधिक आयु के व्यक्तियों का अनुपात",
  "मधुमेह हेतु परीक्षित 30 वर्ष से अधिक आयु के व्यक्तियों का अनुपात",
  "आयुष उपचार पा रहे मधुमेह रोगियों का अनुपात", // Fixed: was duplicate of [4]
  "आयुष उपचार पा रहे उच्च रक्तचाप रोगियों का अनुपात",
  "जीवनशैली में परिवर्तन हेतु वर्ष में 06, सात दिवसीय अभियान",
  "परिवारों को वितरित ब्रोशर",
  "जनता की भागीदारी वाली अंतक्षेत्रीय बैठकों का आयोजन / भागीदारी",
];

const PAD_BASE = { AMO: 5000, 'नर्स/कम्पा': 2000, ANM: 2000, ASHA: 1000 };

const MONTHS = [
  "जनवरी","फरवरी","मार्च","अप्रैल","मई","जून",
  "जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"
];

const currentYear = new Date().getFullYear();

/* =========================================================
   STATE
   ========================================================= */
let state = {
  ahwcName: '',
  jila: '',
  maah: MONTHS[new Date().getMonth()],
  varsh: String(currentYear),
  // rows: [{lakshya:'', prapti:''}] × 10
  rows: Array.from({length: 10}, () => ({lakshya:'', prapti:''})),
  // karmachari: [{naam,pad,bank_khataa,bank_naam,ifsc,mobile}]
  karmachari: Array.from({length: 5}, () => ({naam:'',pad:'',bank_khataa:'',bank_naam:'',ifsc:'',mobile:''})),
};

/* =========================================================
   CALCULATIONS
   ========================================================= */
function calcPercent(lakshya, prapti) {
  const l = parseFloat(lakshya), p = parseFloat(prapti);
  if (!l || isNaN(l) || l === 0 || isNaN(p)) return 0;
  return Math.round((p / l) * 10000) / 100;
}

function calcRashi(pct) {
  if (pct < 31) return 0;
  if (pct <= 50) return Math.round((pct / 100) * 500);
  if (pct <= 70) return Math.round(0.75 * 500);
  return 500;
}

function getPercentArr() {
  return state.rows.map(r => calcPercent(r.lakshya, r.prapti));
}
function getRashiArr() {
  return getPercentArr().map(p => calcRashi(p));
}
function getTotalRashi() {
  return getRashiArr().reduce((s, v) => s + v, 0);
}
function getPerformancePct() {
  return Math.round((getTotalRashi() / 5000) * 10000) / 100;
}
function getPayment(pad) {
  const base = PAD_BASE[pad] || 0;
  return Math.round((getPerformancePct() / 100) * base);
}

function inr(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

/* =========================================================
   RENDER HELPERS
   ========================================================= */
function padOptions(selected) {
  const opts = ['','AMO','ANM','ASHA','नर्स/कम्पा'];
  const labels = {'':'-- चुनें --','AMO':'AMO','ANM':'ANM','ASHA':'ASHA','नर्स/कम्पा':'नर्स/कम्पा'};
  return opts.map(v =>
    `<option value="${v}"${v === selected ? ' selected' : ''}>${labels[v]}</option>`
  ).join('');
}

/* =========================================================
   FORM TABLE 1 RENDER
   ========================================================= */
function renderKaryaTable() {
  const pcts = getPercentArr(), rashis = getRashiArr(), total = getTotalRashi(), perf = getPerformancePct();
  const tbody = state.rows.map((row, i) => `
    <tr>
      <td class="sno">${i+1}</td>
      <td class="karya-name">${KARYA_NAMES[i]}</td>
      <td><input type="text" inputMode="numeric" pattern="[0-9]*" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" value="${row.lakshya}" data-row="${i}" data-field="lakshya" placeholder="0"></td>
      <td><input type="text" inputMode="numeric" pattern="[0-9]*" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" value="${row.prapti}" data-row="${i}" data-field="prapti" placeholder="0"></td>
      <td class="pct-cell${pcts[i] > 100 ? ' pct-over' : ''}">${pcts[i].toFixed(2)}%</td>
      <td class="rashi-cell">₹${rashis[i]}</td>
    </tr>`).join('');
  const tfoot = `<tr>
    <td colspan="5" style="text-align:right;font-weight:700;padding:6px 8px">
      कुल: ₹${total} / ₹5000 &nbsp;|&nbsp; प्रदर्शन: ${perf.toFixed(2)}%
    </td>
    <td style="font-weight:700;color:var(--green)">₹${total}</td>
  </tr>`;
  document.getElementById('karya-tbody').innerHTML = tbody;
  document.getElementById('karya-tfoot').innerHTML = tfoot;
}

/* =========================================================
   FORM TABLE 2 RENDER
   ========================================================= */
function renderKarmachariTable() {
  const total = state.karmachari.reduce((s, r) => s + getPayment(r.pad), 0);
  const tbody = state.karmachari.map((row, i) => `
    <tr>
      <td class="sno">${i+1}</td>
      <td><input type="text" value="${esc(row.naam)}" data-ki="${i}" data-kf="naam" placeholder="नाम दर्ज करें" style="text-align:left"></td>
      <td><select data-ki="${i}" data-kf="pad">${padOptions(row.pad)}</select></td>
      <td><input type="text" value="${esc(row.bank_khataa)}" data-ki="${i}" data-kf="bank_khataa" placeholder="खाता संख्या"></td>
      <td><input type="text" value="${esc(row.bank_naam)}" data-ki="${i}" data-kf="bank_naam" placeholder="बैंक नाम" style="text-align:left"></td>
      <td><input type="text" value="${esc(row.ifsc)}" data-ki="${i}" data-kf="ifsc" placeholder="IFSC" style="text-transform:uppercase"></td>
      <td><input type="tel" value="${esc(row.mobile)}" data-ki="${i}" data-kf="mobile" placeholder="मोबाइल"></td>
      <td class="rashi-cell">${inr(getPayment(row.pad))}</td>
      <td><button class="rm-btn" data-del="${i}" ${state.karmachari.length <= 1 ? 'disabled' : ''}>✕</button></td>
    </tr>`).join('');
  const tfoot = `<tr>
    <td colspan="7" style="text-align:right;font-weight:700;padding:6px 8px">कुल भुगतान:</td>
    <td style="font-weight:700;color:var(--green)">${inr(total)}</td>
    <td></td>
  </tr>`;
  document.getElementById('karma-tbody').innerHTML = tbody;
  document.getElementById('karma-tfoot').innerHTML = tfoot;
}

function esc(s) { return (s||'').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

/* =========================================================
   DOCUMENT PREVIEW RENDER
   ========================================================= */
function renderPreview() {
  const pcts = getPercentArr(), rashis = getRashiArr(), total = getTotalRashi(), perf = getPerformancePct();

  // Header info
  document.getElementById('doc-ahwc').textContent = state.ahwcName || '________________________';
  document.getElementById('doc-jila').textContent = state.jila || '____________';
  document.getElementById('doc-maah').textContent = `${state.maah} ${state.varsh}`;
  document.getElementById('doc-sig-ahwc').textContent = state.ahwcName || '______________';
  document.getElementById('doc-certify-maah').textContent = `${state.maah} ${state.varsh}`;

  // Table 1
  const t1rows = state.rows.map((row, i) => `
    <tr>
      <td style="text-align:center">${i+1}</td>
      <td style="text-align:left;font-size:.68rem">${KARYA_NAMES[i]}</td>
      <td style="text-align:center">${row.lakshya || '—'}</td>
      <td style="text-align:center">${row.prapti || '—'}</td>
      <td style="text-align:center;font-weight:600">${pcts[i].toFixed(2)}%</td>
      <td style="text-align:center;font-weight:600">₹${rashis[i]}</td>
    </tr>`).join('');
  const t1foot = `<tr class="doc-tbl-foot">
    <td colspan="4" style="text-align:right;font-size:.7rem">
      कुल प्रदर्शन राशि: ₹${total} / ₹5000 &nbsp;|&nbsp; प्रदर्शन प्रतिशत: ${perf.toFixed(2)}%
    </td>
    <td colspan="2" style="text-align:center;font-weight:700">₹${total}</td>
  </tr>`;
  document.getElementById('doc-t1-body').innerHTML = t1rows;
  document.getElementById('doc-t1-foot').innerHTML = t1foot;

  // Table 2
  const kTotal = state.karmachari.reduce((s, r) => s + getPayment(r.pad), 0);
  const t2rows = state.karmachari.map((row, i) => `
    <tr>
      <td style="text-align:center">${i+1}</td>
      <td style="text-align:left">${esc(row.naam) || '________________'}</td>
      <td style="text-align:center;font-weight:600">${esc(row.pad) || '—'}</td>
      <td style="text-align:center">${esc(row.bank_khataa) || '____________'}</td>
      <td style="text-align:left">${esc(row.bank_naam) || '____________'}</td>
      <td style="text-align:center">${esc(row.ifsc) || '________'}</td>
      <td style="text-align:center">${esc(row.mobile) || '__________'}</td>
      <td style="text-align:center;font-weight:600">${inr(getPayment(row.pad))}</td>
    </tr>`).join('');
  const t2foot = `<tr class="doc-tbl-foot">
    <td colspan="7" style="text-align:right;font-size:.68rem">कुल भुगतान राशि:</td>
    <td style="text-align:center;font-weight:700">${inr(kTotal)}</td>
  </tr>`;
  document.getElementById('doc-t2-body').innerHTML = t2rows;
  document.getElementById('doc-t2-foot').innerHTML = t2foot;
}

function renderAll() {
  renderKaryaTable();
  renderKarmachariTable();
  renderPreview();
}

/* =========================================================
   EVENT DELEGATION — FORM INPUTS
   ========================================================= */
function updatePLPFormCells() {
  const pcts = getPercentArr(), rashis = getRashiArr(), total = getTotalRashi(), perf = getPerformancePct();
  
  // Table 1 Update
  state.rows.forEach((r, i) => {
    const tr = document.querySelector(`#karya-tbody tr:nth-child(${i+1})`);
    if(tr) {
      const pctCell = tr.querySelector('.pct-cell');
      if(pctCell) pctCell.textContent = pcts[i].toFixed(2) + '%';
      const rashiCell = tr.querySelector('.rashi-cell');
      if(rashiCell) rashiCell.textContent = '₹' + rashis[i];
    }
  });
  const kTfoot = document.getElementById('karya-tfoot');
  if(kTfoot) {
    kTfoot.innerHTML = `<tr>
      <td colspan="5" style="text-align:right;font-weight:700;padding:6px 8px">
        कुल: ₹${total} / ₹5000 &nbsp;|&nbsp; प्रदर्शन: ${perf.toFixed(2)}%
      </td>
      <td style="font-weight:700;color:var(--green)">₹${total}</td>
    </tr>`;
  }
  
  // Table 2 Update (amount depends on perf)
  state.karmachari.forEach((k, i) => {
    const tr = document.querySelector(`#karma-tbody tr:nth-child(${i+1})`);
    if(tr) {
      const rashiCell = tr.querySelector('.rashi-cell');
      if(rashiCell) rashiCell.textContent = inr(getPayment(k.pad));
    }
  });
  const kTotal = state.karmachari.reduce((s, r) => s + getPayment(r.pad), 0);
  const cTfoot = document.getElementById('karma-tfoot');
  if(cTfoot) {
    cTfoot.innerHTML = `<tr>
      <td colspan="7" style="text-align:right;font-weight:700;padding:6px 8px">कुल भुगतान:</td>
      <td style="font-weight:700;color:var(--green)">${inr(kTotal)}</td>
      <td></td>
    </tr>`;
  }
}

document.getElementById('karya-tbody').addEventListener('input', e => {
  const el = e.target;
  const row = el.dataset.row, field = el.dataset.field;
  if (row === undefined || !field) return;
  state.rows[+row][field] = el.value;
  updatePLPFormCells();
  renderPreview();
});

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

document.getElementById('karma-tbody').addEventListener('change', e => {
  const el = e.target;
  const ki = el.dataset.ki, kf = el.dataset.kf;
  if (ki === undefined || !kf) return;
  state.karmachari[+ki][kf] = el.value;
  if (kf === 'pad') {
    updatePLPFormCells();
  }
  renderPreview();
});

document.getElementById('karma-tbody').addEventListener('click', e => {
  const btn = e.target.closest('.rm-btn');
  if (!btn) return;
  const idx = +btn.dataset.del;
  if (state.karmachari.length <= 1) return;
  state.karmachari.splice(idx, 1);
  renderAll();
});

/* =========================================================
   HEADER INPUTS
   ========================================================= */
document.getElementById('ahwc-name').addEventListener('input', e => { state.ahwcName = e.target.value; renderPreview(); });
document.getElementById('jila').addEventListener('input', e => { state.jila = e.target.value; renderPreview(); });
document.getElementById('maah').addEventListener('change', e => { state.maah = e.target.value; renderPreview(); });
document.getElementById('varsh').addEventListener('change', e => { state.varsh = e.target.value; renderPreview(); });

/* ADD ROW */
document.getElementById('add-karma-btn').addEventListener('click', () => {
  state.karmachari.push({naam:'',pad:'',bank_khataa:'',bank_naam:'',ifsc:'',mobile:''});
  renderAll();
  // Animate the newly added row
  setTimeout(() => {
    const rows = document.querySelectorAll('#karma-tbody tr');
    const newRow = rows[rows.length - 1];
    if (newRow) {
      newRow.style.animation = 'fadeSlideUp 0.4s ease';
    }
  }, 10);
});

/* =========================================================
   POPULATE DROPDOWNS ON LOAD
   ========================================================= */
(function initDropdowns() {
  const maahSel = document.getElementById('maah');
  const currentMonthName = MONTHS[new Date().getMonth()];
  MONTHS.forEach(m => {
    const o = document.createElement('option');
    o.value = m; o.textContent = m;
    if (m === currentMonthName) o.selected = true;
    maahSel.appendChild(o);
  });

  const varshSel = document.getElementById('varsh');
  for (let y = currentYear - 2; y <= currentYear + 3; y++) {
    const o = document.createElement('option');
    o.value = y; o.textContent = y;
    if (y === currentYear) o.selected = true;
    varshSel.appendChild(o);
  }
})();

/* =========================================================
   PDF GENERATION
   ========================================================= */
function validateIfsc(ifsc) {
  const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return regex.test(ifsc?.toUpperCase());
}

function validateMobile(mobile) {
  const regex = /^\d{10}$/;
  return regex.test(mobile);
}

function validateBankAccount(account) {
  const regex = /^\d{9,}$/;
  return regex.test(account);
}

document.getElementById('btn-pdf').addEventListener('click', async () => {
  const ahwc = state.ahwcName.trim(), jila = state.jila.trim();
  let errs = [];
  if (!ahwc) errs.push('AHWC का नाम आवश्यक है');
  if (!jila) errs.push('जिला आवश्यक है');

  // Validate all employee data
  state.karmachari.forEach((emp, index) => {
    if (emp.ifsc && !validateIfsc(emp.ifsc)) {
      errs.push(`कर्मचारी ${index + 1}: अमान्य IFSC कोड (${emp.ifsc})`);
    }
    if (emp.mobile && !validateMobile(emp.mobile)) {
      errs.push(`कर्मचारी ${index + 1}: मोबाइल नंबर 10 अंकों का होना चाहिए (${emp.mobile})`);
    }
    if (emp.bank_khataa && !validateBankAccount(emp.bank_khataa)) {
      errs.push(`कर्मचारी ${index + 1}: बैंक खाता न्यूनतम 9 अंक (${emp.bank_khataa})`);
    }
  });

  const errBox = document.getElementById('err-box');
  if (errs.length) {
    errBox.innerHTML = errs.map(e => `<div>⚠️ ${e}</div>`).join('');
    errBox.style.display = 'block';
    if (window.soundFX) window.soundFX.error();
    return;
  }
  errBox.style.display = 'none';

  if (typeof html2pdf === 'undefined') {
    showToast('⚠️ PDF लाइब्रेरी लोड हो रही है, कृपया 2 सेकंड बाद पुनः प्रयास करें');
    return;
  }

  const overlay = document.getElementById('overlay');
  overlay.classList.add('active');

  try {
    await new Promise(r => setTimeout(r, 200));
    const element = document.getElementById('doc-page');
    const opt = {
      margin: [3, 3, 3, 3],
      filename: `AHWC_PLP_Report_${state.maah}_${state.varsh}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollY: 0, windowWidth: 794 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'avoid-all' },
    };
    await html2pdf().set(opt).from(element).save();
    if (window.soundFX) window.soundFX.success();
    var pdfBtn = document.getElementById('btn-pdf');
    if (pdfBtn) { pdfBtn.classList.add('success-pulse'); setTimeout(function(){ pdfBtn.classList.remove('success-pulse'); }, 600); }
    
    saveReportToHistory({
      type: 'plp',
      title: 'PLP रिपोर्ट',
      subtitle: state.ahwcName + ' — ' + state.jila,
      period: state.maah + ' ' + state.varsh,
      snapshot: JSON.stringify({ ahwcName: state.ahwcName, jila: state.jila, maah: state.maah, varsh: state.varsh, rows: state.rows, karmachari: state.karmachari })
    });
    renderHistorySection();
  } finally {
    overlay.classList.remove('active');
  }
});

/* =========================================================
   INITIAL RENDER
   ========================================================= */
renderAll();

/* Auto-navigate via URL hash (e.g. /#att, /#plp, /#yog) */
(function() {
  var h = window.location.hash;
  if (h === '#att') setTimeout(function() { showPanel('staff-att-panel'); }, 200);
  else if (h === '#plp') setTimeout(function() { showPanel('plp-panel'); }, 200);
  else if (h === '#yog') setTimeout(function() { showPanel('yog-panel'); }, 200);
})();

/* === NAVIGATION === */
function showPanel(panelId) {
  document.getElementById('home-screen').style.display = 'none';
  document.getElementById('plp-panel').style.display = 'none';
  document.getElementById('staff-att-panel').style.display = 'none';
  document.getElementById('yog-panel').style.display = 'none';
  
  const target = document.getElementById(panelId);
  if (target) {
    target.style.display = 'flex';
    target.classList.add('page-transition');
    setTimeout(() => target.classList.remove('page-transition'), 400);
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showHomeScreen() {
  document.getElementById('home-screen').style.display = 'flex';
  document.getElementById('plp-panel').style.display = 'none';
  document.getElementById('staff-att-panel').style.display = 'none';
  document.getElementById('yog-panel').style.display = 'none';
  
  // Add animation to home screen
  const homeScreen = document.getElementById('home-screen');
  homeScreen.classList.add('page-transition');
  setTimeout(() => homeScreen.classList.remove('page-transition'), 400);
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* === STAFF ATTENDANCE v4 — REBUILT FROM SCRATCH === */
(function() {
  'use strict';

  var HINDI_MONTHS = [
    'जनवरी','फरवरी','मार्च','अप्रैल','मई','जून',
    'जुलाई','अगस्त','सितम्बर','अक्टूबर','नवम्बर','दिसम्बर'
  ];

  var ATT_OPTIONS = [
    'उपस्थित','Day off','CL','चाइल्डकेयरलीव','PL',
    'परिवर्तित अवकाश','असाधारण अवकाश','प्रसूति अवकाश',
    'पितृत्व अवकाश','willful absence','Onduty','अवकाश पर','कार्यमुक्त'
  ];

  var state = {
    officeName: '',
    kramank: '',
    codeNo: '',
    date: '',
    from: '',
    to: '',
    note: '',
    staff: [{ name: '', desig: '', prevCL: 0, days: {} }]
  };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function getDates() {
    if (!state.from || !state.to) return [];
    var arr = [], curr = new Date(state.from + 'T00:00:00');
    var end  = new Date(state.to + 'T00:00:00');
    while (curr <= end && arr.length < 31) {
      arr.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }
    return arr;
  }

  function groupByMonth(dates) {
    var groups = [];
    dates.forEach(function(d) {
      var key = d.getMonth() + '-' + d.getFullYear();
      if (groups.length && groups[groups.length - 1].key === key) {
        groups[groups.length - 1].dates.push(d);
      } else {
        groups.push({
          key: key,
          label: HINDI_MONTHS[d.getMonth()] + ' ' + d.getFullYear(),
          dates: [d]
        });
      }
    });
    return groups;
  }

  function fmtD(ds) {
    if (!ds) return '';
    var d = new Date(ds + 'T00:00:00');
    return ('0'+d.getDate()).slice(-2)+'.'+('0'+(d.getMonth()+1)).slice(-2)+'.'+d.getFullYear();
  }

  /* ── Main document renderer ── */
  function renderDoc() {
    var doc = document.getElementById('att-doc');
    if (!doc) return;
    var dates  = getDates();
    var groups = groupByMonth(dates);
    var html   = '';

    /* ── Document header ── */
    html += '<div class="att4-hdr">';
    html += '<div class="att4-dept">आयुर्वेद विभाग राजस्थान सरकार</div>';
    html += '<div class="att4-office">कार्यालय राजकीय <strong>' + esc(state.officeName) + '</strong></div>';
    html += '<div class="att4-meta">';
    html += '<span>क्रमांक - उपस्थिति / ' + esc(state.kramank) + '</span>';
    html += '<span>CODE No. <strong>' + esc(state.codeNo) + '</strong></span>';
    html += '<span>दिनांक: ' + fmtD(state.date) + '</span>';
    html += '</div>';
    html += '<div class="att4-title">उपस्थिति पत्रक</div>';
    html += '</div>';

    /* ── Period line ── */
    if (dates.length > 0) {
      html += '<div class="att4-period">उपस्थिति अवधि <strong>' + fmtD(state.from) + '</strong> से <strong>' + fmtD(state.to) + '</strong> तक</div>';
    }

    /* ── Table ── */
    if (dates.length > 0) {
      html += '<div style="overflow-x:hidden"><table class="att4-tbl" cellpadding="0" cellspacing="0">';

      /* Month header row */
      html += '<thead><tr>';
      html += '<th rowspan="2" class="att4-th att4-th-no">क्र.सं.</th>';
      html += '<th rowspan="2" class="att4-th att4-th-name">नाम कार्मिक<br>मय पद</th>';
      groups.forEach(function(g) {
        html += '<th colspan="' + g.dates.length + '" class="att4-th att4-th-month">' + esc(g.label) + '</th>';
      });
      html += '<th rowspan="2" class="att4-th att4-th-sum"><span class="att4-th-sum-inner">उपस्थित</span></th>';
      html += '<th rowspan="2" class="att4-th att4-th-sum"><span class="att4-th-sum-inner">CL</span></th>';
      html += '<th rowspan="2" class="att4-th att4-th-sum"><span class="att4-th-sum-inner">अवकाश</span></th>';
      html += '<th rowspan="2" class="att4-th att4-th-del no-print"></th>';
      html += '</tr>';

      /* Date numbers row */
      html += '<tr>';
      dates.forEach(function(d) {
        html += '<th class="att4-th att4-th-day">' + d.getDate() + '</th>';
      });
      html += '</tr></thead>';

      /* Staff rows */
      html += '<tbody>';
      var LEAVE_TYPES = ['चाइल्डकेयरलीव','PL','परिवर्तित अवकाश','असाधारण अवकाश','प्रसूति अवकाश','पितृत्व अवकाश','willful absence','अवकाश पर','कार्यमुक्त'];
      state.staff.forEach(function(s, idx) {
        var presentCount = 0, clCount = 0, leaveCount = 0;
        var dayCells = '';
        dates.forEach(function(d) {
          var ds  = d.toISOString().split('T')[0];
          var val = s.days[ds] || 'उपस्थित';
          if (val === 'उपस्थित') presentCount++;
          else if (val === 'CL') clCount++;
          else if (LEAVE_TYPES.indexOf(val) !== -1) leaveCount++;
          var opts = ATT_OPTIONS.map(function(o) {
            return '<option value="' + esc(o) + '"' + (o === val ? ' selected' : '') + '>' + esc(o) + '</option>';
          }).join('');
          dayCells +=
            '<td class="att4-td att4-td-day">' +
              '<select class="att4-sel no-print" data-idx="' + idx + '" data-ds="' + ds + '">' + opts + '</select>' +
              '<span class="att4-vspan print-only">' + esc(val) + '</span>' +
            '</td>';
        });
        html += '<tr>';
        html += '<td class="att4-td att4-td-no">' + (idx + 1) + '</td>';
        html += '<td class="att4-td att4-td-name">' +
          '<div class="att4-name-wrap">' +
            '<input class="att4-ninp no-print" data-idx="' + idx + '" data-field="name" value="' + esc(s.name) + '" placeholder="नाम" />' +
            '<div class="att4-name-print print-only"><div class="att4-np">' + esc(s.name) + '</div></div>' +
          '</div></td>';
        html += dayCells;
        html += '<td class="att4-td att4-td-sum" id="att4-p-' + idx + '">' + presentCount + '</td>';
        html += '<td class="att4-td att4-td-sum" id="att4-cl-' + idx + '">' + clCount + '</td>';
        html += '<td class="att4-td att4-td-sum" id="att4-lv-' + idx + '">' + leaveCount + '</td>';
        html += '<td class="att4-td att4-td-del no-print">' +
          '<button class="att4-delbtn" data-idx="' + idx + '"' + (state.staff.length <= 1 ? ' disabled' : '') + '>\u2715</button>' +
        '</td>';
        html += '</tr>';
      });
      html += '</tbody></table></div>';
    } else {
      html += '<div class="att4-empty">उपस्थिति अवधि चुनें — तालिका स्वतः बनेगी</div>';
    }

    /* ── Note ── */
    if (state.note && state.note.trim()) {
      html += '<div class="att4-note"><strong>नोट:</strong> ' + esc(state.note.trim()) + '</div>';
    }

    /* ── Certification ── */
    html += '<div class="att4-certify">प्रमाणित किया जाता है कि उपस्थिति पत्रक का मिलान उपस्थिति पंजिका से कर लिया गया है, साथ ही कोई भी कार्मिक बिना सक्षम स्तर से अवकाश स्वीकृत कराए उपस्थिति पत्रक में उल्लिखित अवधि के दौरान अनुपस्थित नहीं रहा है।</div>';

    /* ── Signature ── */
    html += '<div class="att4-sig">' +
      '<div class="att4-sig-block">' +
        '<div class="att4-sig-gap"></div>' +
        '<div class="att4-sig-line">' +
          '<div class="att4-sig-label">हस्ताक्षर प्रभारी</div>' +
          '<div class="att4-sig-office">' + esc(state.officeName || 'कार्यालय') + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

    doc.innerHTML = html;
    hookEvents();
  }

  /* ── Wire up events on dynamically-rendered elements ── */
  function hookEvents() {
    /* Day select changes */
    document.querySelectorAll('.att4-sel').forEach(function(sel) {
      sel.addEventListener('change', function() {
        var idx = +this.dataset.idx, ds = this.dataset.ds;
        state.staff[idx].days[ds] = this.value;
        var span = this.nextElementSibling;
        if (span) span.textContent = this.value;
        refreshCL(idx);
      });
    });

    /* Name input */
    document.querySelectorAll('.att4-ninp').forEach(function(inp) {
      inp.addEventListener('input', function() {
        var idx = +this.dataset.idx;
        state.staff[idx].name = this.value;
        var wrap = this.closest('.att4-name-wrap');
        if (wrap) {
          var np = wrap.querySelector('.att4-np');
          if (np) np.textContent = this.value;
        }
      });
    });

    /* Delete row buttons */
    document.querySelectorAll('.att4-delbtn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var idx = +this.dataset.idx;
        if (state.staff.length <= 1) return;
        state.staff.splice(idx, 1);
        renderDoc();
      });
    });
  }

  var LEAVE_TYPES_SET = ['चाइल्डकेयरलीव','PL','परिवर्तित अवकाश','असाधारण अवकाश','प्रसूति अवकाश','पितृत्व अवकाश','willful absence','अवकाश पर','कार्यमुक्त'];

  /* ── Recalculate totals for one staff row ── */
  function refreshCL(idx) {
    var dates = getDates();
    var presentCount = 0, clCount = 0, leaveCount = 0;
    dates.forEach(function(d) {
      var ds = d.toISOString().split('T')[0];
      var val = state.staff[idx].days[ds] || 'उपस्थित';
      if (val === 'उपस्थित') presentCount++;
      else if (val === 'CL') clCount++;
      else if (LEAVE_TYPES_SET.indexOf(val) !== -1) leaveCount++;
    });
    var ep = document.getElementById('att4-p-' + idx);
    if (ep) ep.textContent = presentCount;
    var ec = document.getElementById('att4-cl-' + idx);
    if (ec) ec.textContent = clCount;
    var el = document.getElementById('att4-lv-' + idx);
    if (el) el.textContent = leaveCount;
  }

  /* ── Validate period (max 31 days, end >= start) ── */
  function validatePeriod(from, to) {
    if (!from || !to) return true;
    var f = new Date(from + 'T00:00:00'), t = new Date(to + 'T00:00:00');
    var diff = Math.round((t - f) / 86400000) + 1;
    if (diff < 1)  { if (typeof showToast === 'function') showToast('\u26a0\ufe0f समाप्ति तिथि प्रारंभ से पहले नहीं हो सकती', 3000); return false; }
    if (diff > 31) { if (typeof showToast === 'function') showToast('\u26a0\ufe0f अधिकतम 31 दिन की अवधि चुनें', 3000); return false; }
    return true;
  }

  function bind(id, evt, fn) {
    var el = document.getElementById(id);
    if (el) el.addEventListener(evt, fn);
  }

  /* ── Form field listeners ── */
  bind('att-office',  'input',  function() { state.officeName = this.value; renderDoc(); });
  bind('att-kramank', 'input',  function() { state.kramank    = this.value; renderDoc(); });
  bind('att-codeno',  'input',  function() { state.codeNo     = this.value; renderDoc(); });
  bind('att-date',    'change', function() { state.date       = this.value; renderDoc(); });
  bind('att-note',    'input',  function() { state.note       = this.value; renderDoc(); });

  bind('att-from', 'change', function() {
    if (!validatePeriod(this.value, state.to)) { this.value = state.from; return; }
    state.from = this.value;
    renderDoc();
  });
  bind('att-to', 'change', function() {
    if (!validatePeriod(state.from, this.value)) { this.value = state.to; return; }
    state.to = this.value;
    renderDoc();
  });

  bind('att-add-row', 'click', function() {
    state.staff.push({ name: '', desig: '', prevCL: 0, days: {} });
    renderDoc();
    var doc = document.getElementById('att-doc');
    if (doc) setTimeout(function() { doc.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, 100);
  });

  bind('att-btn-preview', 'click', function() {
    var doc = document.getElementById('att-doc');
    if (doc) doc.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  bind('att-btn-print', 'click', function() { window.print(); });

  bind('att-btn-pdf', 'click', function() {
    if (!state.officeName.trim()) {
      if (typeof showToast === 'function') showToast('\u26a0\ufe0f कार्यालय नाम आवश्यक है', 3000);
      return;
    }
    if (!state.from || !state.to) {
      if (typeof showToast === 'function') showToast('\u26a0\ufe0f उपस्थिति अवधि आवश्यक है', 3000);
      return;
    }
    if (typeof html2pdf === 'undefined') {
      if (typeof showToast === 'function') showToast('\u26a0\ufe0f PDF लाइब्रेरी लोड हो रही है...', 3000);
      return;
    }
    var overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.add('active');
    var el = document.getElementById('att-doc');

    el.classList.add('att4-pdf-mode');

    /* Wait 2 rAF + 200ms so the browser fully repaints with pdf-mode CSS
       before html2canvas reads any computed display values */
    var startExport = function() {

    var doExport = function() {
      var opt = {
        margin:      [5, 5, 5, 5],
        filename:    'Upasthiti_Patrak_' + fmtD(state.from) + '_to_' + fmtD(state.to) + '.pdf',
        image:       { type: 'jpeg', quality: 1.0 },
        html2canvas: {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          letterRendering: true,
          scrollY: 0,
          width: 1122,
          windowWidth: 1122,
          logging: false,
          foreignObjectRendering: false,
          imageTimeout: 0,
          onclone: function(clonedDoc) {
            var style = clonedDoc.createElement('style');
            style.textContent = "@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700;900&family=Noto+Serif+Devanagari:wght@400;500;600;700;900&display=block');";
            clonedDoc.head.insertBefore(style, clonedDoc.head.firstChild);
            return new Promise(function(resolve) { setTimeout(resolve, 800); });
          }
        },
        jsPDF:       { unit: 'mm', format: 'a4', orientation: 'landscape' },
        pagebreak:   { mode: 'avoid-all' }
      };
      html2pdf().set(opt).from(el).save().then(function() {
        el.classList.remove('att4-pdf-mode');
        if (window.soundFX) window.soundFX.success();
        try {
          if (typeof saveReportToHistory === 'function') {
            saveReportToHistory({
              type:     'att',
              title:    'उपस्थिति पत्रक',
              subtitle: state.officeName,
              period:   fmtD(state.from) + ' \u2013 ' + fmtD(state.to),
              snapshot: JSON.stringify({
                officeName: state.officeName, kramank: state.kramank,
                codeNo: state.codeNo, date: state.date,
                from: state.from, to: state.to,
                note: state.note, staff: state.staff
              })
            });
            if (typeof renderHistorySection === 'function') renderHistorySection();
          }
        } catch(e) { /* ignore */ }
        if (overlay) overlay.classList.remove('active');
      }).catch(function() {
        el.classList.remove('att4-pdf-mode');
        if (overlay) overlay.classList.remove('active');
      });
    };

    var runExport = function() {
      if (document.fonts && document.fonts.load) {
        Promise.all([
          document.fonts.load('900 14pt "Noto Serif Devanagari"', 'आयुर्वेद विभाग राजस्थान सरकार'),
          document.fonts.load('700 10pt "Noto Serif Devanagari"', 'हस्ताक्षर प्रभारी उपस्थिति'),
          document.fonts.load('400 8pt "Noto Serif Devanagari"', 'प्रमाणित किया जाता है'),
          document.fonts.load('700 8pt "Noto Sans Devanagari"', 'उपस्थित अवकाश'),
          document.fonts.load('600 6pt "Noto Sans Devanagari"', 'उपस्थित CL Day off'),
          document.fonts.load('400 8pt "Noto Sans Devanagari"', 'कार्मिक पदनाम')
        ]).then(doExport).catch(doExport);
      } else {
        doExport();
      }
    };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(runExport);
    } else {
      runExport();
    }
    }; /* end startExport */

    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        setTimeout(startExport, 200);
      });
    });
  });

  /* Initial render */
  renderDoc();

})();
/* === END STAFF ATTENDANCE v4 === */

/* =========================================================
   SOUND SYSTEM — Web Audio API (lightweight, no external files)
   ========================================================= */
(function(){
  var audioCtx = null;
  var soundEnabled = localStorage.getItem('soundEnabled');
  // Default ON if never set
  if (soundEnabled === null) soundEnabled = 'true';

  function getAudioCtx() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch(e) { return null; }
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playTone(freq, duration, vol, type) {
    if (soundEnabled !== 'true') return;
    var ctx = getAudioCtx();
    if (!ctx) return;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(Math.min(vol || 0.12, 0.3), ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  window.soundFX = {
    click: function() { playTone(800, 0.06, 0.10, 'sine'); },
    success: function() {
      playTone(523, 0.12, 0.15, 'sine');
      setTimeout(function(){ playTone(659, 0.15, 0.15, 'sine'); }, 80);
      setTimeout(function(){ playTone(784, 0.18, 0.12, 'sine'); }, 170);
    },
    error: function() {
      playTone(300, 0.15, 0.12, 'triangle');
      setTimeout(function(){ playTone(260, 0.2, 0.10, 'triangle'); }, 120);
    },
    toggle: function() { playTone(600, 0.05, 0.08, 'sine'); }
  };

  window.isSoundEnabled = function() { return soundEnabled === 'true'; };

  window.toggleSound = function() {
    soundEnabled = soundEnabled === 'true' ? 'false' : 'true';
    localStorage.setItem('soundEnabled', soundEnabled);

    var btn = document.getElementById('sound-toggle');
    var icon = document.getElementById('sound-icon');
    if (btn && icon) {
      if (soundEnabled === 'true') {
        btn.classList.remove('muted');
        icon.textContent = '\u{1F514}';
        btn.title = 'Sound Effects — On';
        btn.setAttribute('aria-label', 'Mute sound effects');
      } else {
        btn.classList.add('muted');
        icon.textContent = '\u{1F507}';
        btn.title = 'Sound Effects — Off';
        btn.setAttribute('aria-label', 'Enable sound effects');
      }
    }
    window.soundFX.toggle();
  };

  // Set initial state
  var btn = document.getElementById('sound-toggle');
  var icon = document.getElementById('sound-icon');
  if (btn && icon) {
    if (soundEnabled !== 'true') {
      btn.classList.add('muted');
      icon.textContent = '\u{1F507}';
      btn.title = 'Sound Effects — Off';
    } else {
      icon.textContent = '\u{1F514}';
      btn.title = 'Sound Effects — On';
    }
  }

  /* === Enhanced Ripple Effect (positioned at click point) === */
  document.addEventListener('click', function(e) {
    var target = e.target.closest('.home-card,.btn-premium,.btn-pdf,.add-row-btn,.back-btn,.rm-btn,.sound-toggle');
    if (!target) return;
    var rect = target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var size = Math.max(rect.width, rect.height) * 2.5;
    var wave = document.createElement('span');
    wave.className = 'ripple-wave';
    wave.style.width = size + 'px';
    wave.style.height = size + 'px';
    wave.style.left = (x - size / 2) + 'px';
    wave.style.top = (y - size / 2) + 'px';
    target.appendChild(wave);
    setTimeout(function() { if (wave.parentNode) wave.parentNode.removeChild(wave); }, 600);
    window.soundFX.click();
  });
})();
/* === END SOUND SYSTEM === */

/* === PLP PREVIEW & PRINT === */
(function() {
  var plpPreviewBtn = document.getElementById('btn-plp-preview');
  if (plpPreviewBtn) {
    plpPreviewBtn.addEventListener('click', function() {
      var docPage = document.getElementById('doc-page');
      if (docPage) docPage.scrollIntoView({ behavior: 'smooth' });
    });
  }

  var plpPrintBtn = document.getElementById('btn-plp-print');
  if (plpPrintBtn) {
    plpPrintBtn.addEventListener('click', function() {
      window.print();
    });
  }
})();

/* === EXCEL EXPORT FUNCTIONS === */
function exportPLPToExcel() {
  if (typeof XLSX === 'undefined') { alert('SheetJS library not loaded.'); return; }
  var pcts = getPercentArr(), rashis = getRashiArr(), total = getTotalRashi(), perf = getPerformancePct();
  var ws_data = [
    ['आयुष्मान आरोग्य मंदिर (AHWC) - PLP रिपोर्ट'],
    [''],
    ['AHWC का नाम:', state.ahwcName],
    ['जिला:', state.jila],
    ['माह:', state.maah],
    ['वर्ष:', state.varsh],
    [''],
    ['तालिका 1 - कार्य विवरण एवं प्रदर्शन'],
    ['क्र.', 'कार्य का नाम', 'लक्ष्य', 'प्राप्ति', 'प्रतिशत', 'राशि (₹)']
  ];
  state.rows.forEach(function(r, i) {
    ws_data.push([i + 1, KARYA_NAMES[i] || '', r.lakshya || '', r.prapti || '', pcts[i].toFixed(2) + '%', rashis[i]]);
  });
  ws_data.push(['', '', '', '', 'कुल:', total]);
  ws_data.push(['', '', '', '', 'प्रदर्शन:', perf.toFixed(2) + '%']);
  ws_data.push(['']);
  ws_data.push(['तालिका 2 - कर्मचारी भुगतान विवरण']);
  ws_data.push(['क्र.', 'नाम', 'पद', 'बैंक खाता', 'बैंक नाम', 'IFSC', 'मोबाइल', 'भुगतान (₹)']);
  state.karmachari.forEach(function(k, i) {
    ws_data.push([i + 1, k.naam, k.pad, k.bank_khataa, k.bank_naam, k.ifsc, k.mobile, inr(getPayment(k.pad))]);
  });
  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.aoa_to_sheet(ws_data);
  ws['!cols'] = [{wch:5},{wch:50},{wch:10},{wch:10},{wch:10},{wch:12},{wch:15},{wch:12}];
  XLSX.utils.book_append_sheet(wb, ws, 'PLP Report');
  var filename = 'PLP_Report_' + (state.ahwcName || 'AHWC').replace(/\s+/g,'_') + '_' + state.maah + '_' + state.varsh + '.xlsx';
  XLSX.writeFile(wb, filename);
  if (window.soundFX) window.soundFX.success();
}

function exportAttToExcel() {
  if (typeof XLSX === 'undefined') { alert('SheetJS library not loaded.'); return; }
  if (!attState.from || !attState.to) { showToast('\u26a0\ufe0f उपस्थिति अवधि चुनें', 3000); return; }

  var officeName = attState.officeName || '';
  var kramankVal = attState.kramank || '';
  var dateVal = attState.date || '';
  var fromDate = attState.from || '';
  var toDate = attState.to || '';

  // Build dates array inline
  var _dates_xl = [], _curr_xl = new Date(fromDate + 'T00:00:00'), _end_xl = new Date(toDate + 'T00:00:00');
  while (_curr_xl <= _end_xl && _dates_xl.length < 31) { _dates_xl.push(new Date(_curr_xl)); _curr_xl.setDate(_curr_xl.getDate() + 1); }
  var dates = _dates_xl;
  var dateHeaders = dates.map(function(d) { return d.getDate().toString(); });
  var totalCols = 2 + dateHeaders.length + 3;

  // Format date strings
  function fmtDate(ds) {
    if (!ds) return '';
    var d = new Date(ds + 'T00:00:00');
    return String(d.getDate()).padStart(2,'0') + '.' + String(d.getMonth()+1).padStart(2,'0') + '.' + d.getFullYear();
  }

  // Build month-group row (row 6 — matches Excel structure)
  var MONTHS_XL = ['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितम्बर','अक्टूबर','नवम्बर','दिसम्बर'];
  var monthGroupRow = ['अवधि - ' + fmtDate(fromDate) + ' से ' + fmtDate(toDate) + ' तक', ''];
  var mgCounts = {};
  var mgOrder  = [];
  dates.forEach(function(d) {
    var mk = d.getFullYear() + '-' + d.getMonth();
    if (!mgCounts[mk]) { mgCounts[mk] = 0; mgOrder.push({ key: mk, label: 'माह - ' + MONTHS_XL[d.getMonth()] + ' ' + d.getFullYear() }); }
    mgCounts[mk]++;
  });
  mgOrder.forEach(function(g) {
    monthGroupRow.push(g.label);
    for (var gi = 1; gi < mgCounts[g.key]; gi++) monthGroupRow.push('');
  });
  monthGroupRow.push('उपस्थिति पत्रक अवधि में लिए गए आकस्मिक अवकाश का योग');
  monthGroupRow.push('पूर्व उपस्थिति पत्रक तक लिए गए आकस्मिक अवकाश का योग');
  monthGroupRow.push('अब तक कुल लिए आकस्मिक अवकाश का योग');

  var wsData = [
    ['आयुर्वेद विभाग राजस्थान सरकार'],
    ['कार्यालय राजकीय ' + officeName],
    ['क्रमांक - उपस्थिति / ' + kramankVal].concat(Array(totalCols - 2).fill('')).concat(['दिनांक ' + fmtDate(dateVal)]),
    ['उपस्थिति पत्रक'],
    ['उपस्थिति अवधि ' + fmtDate(fromDate) + ' से ' + fmtDate(toDate) + ' तक'],
    monthGroupRow,
    ['क्र.सं.', 'नाम कार्मिक मय पद'].concat(dateHeaders).concat([
      'उपस्थिति पत्रक अवधि में लिए गए आकस्मिक अवकाश का योग',
      'पूर्व उपस्थिति पत्रक तक लिए गए आकस्मिक अवकाश का योग',
      'अब तक कुल लिए आकस्मिक अवकाश का योग'
    ])
  ];

  attState.staff.forEach(function(s, idx) {
    var currentPeriodCL = 0;
    var dayVals = dates.map(function(d) {
      var ds = d.toISOString().split('T')[0];
      var val = s.days[ds] || 'उपस्थित';
      if (val === 'आकस्मिक अवकाश') currentPeriodCL++;
      return val;
    });
    var prevCL = parseInt(s.prevCL) || 0;
    wsData.push([idx+1, s.name || ''].concat(dayVals).concat([currentPeriodCL, prevCL, currentPeriodCL + prevCL]));
  });

  wsData.push([]);
  wsData.push(['प्रमाणित किया जाता है कि उपस्थिति पत्रक का मिलान उपस्थिति पंजिका से कर लिया गया है, साथ ही कोई भी कार्मिक बिना सक्षम स्तर से अवकाश स्वीकृत कराए उपस्थिति पत्रक में उल्लिखित अवधि के दौरान अनुपस्थित नहीं रहा है।']);
  wsData.push([]);
  var sigRow = Array(totalCols - 1).fill(''); sigRow.push('हस्ताक्षर प्रभारी');
  wsData.push(sigRow);
  var offRow = Array(totalCols - 1).fill(''); offRow.push(officeName);
  wsData.push(offRow);

  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.aoa_to_sheet(wsData);

  ws['!merges'] = [
    {s:{r:0,c:0}, e:{r:0,c:totalCols-1}},
    {s:{r:1,c:0}, e:{r:1,c:totalCols-1}},
    {s:{r:3,c:0}, e:{r:3,c:totalCols-1}},
    {s:{r:4,c:0}, e:{r:4,c:totalCols-1}}
  ];

  var cols = [{wch:6},{wch:30}];
  dateHeaders.forEach(function(){ cols.push({wch:4}); });
  cols.push({wch:10},{wch:10},{wch:8});
  ws['!cols'] = cols;

  XLSX.utils.book_append_sheet(wb, ws, 'उपस्थिति पत्रक');
  XLSX.writeFile(wb, 'Upasthiti_Patrak_' + fromDate + '_' + toDate + '.xlsx');
  if (window.soundFX) window.soundFX.success();
}

// Attach event listeners when DOM is ready
(function() {
  var plpExcelBtn = document.getElementById('btn-excel');
  if (plpExcelBtn) plpExcelBtn.addEventListener('click', exportPLPToExcel);
  var attExcelBtn = document.getElementById('att-btn-excel');
  if (attExcelBtn) attExcelBtn.addEventListener('click', exportAttToExcel);
})();
/* === END EXCEL EXPORT === */

/* updateProgressPill removed — att-progress-pill no longer in v3 UI */

/* === TOAST NOTIFICATION (19.11) === */
function showToast(message, duration) {
  duration = duration || 2000;
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(function() { toast.classList.add('show'); });
  setTimeout(function() {
    toast.classList.remove('show');
    setTimeout(function() { toast.remove(); }, 200);
  }, duration);
}

/* === AUTO-SAVE (19.11) === */
function debounce(fn, delay) {
  var timer;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
}

function collectAttStaffData() {
  return attState.staff.map(function(s) {
    return { name: s.name, desig: s.desig || '', prevCL: s.prevCL || 0, days: Object.assign({}, s.days) };
  });
}

function autoSaveAtt() {
  var data = {
    officeName: attState.officeName,
    kramank: attState.kramank,
    codeNo: attState.codeNo,
    date: attState.date,
    from: attState.from,
    to: attState.to,
    note: attState.note,
    staffRows: collectAttStaffData(),
    savedAt: new Date().toISOString()
  };
  try {
    localStorage.setItem('att_draft', JSON.stringify(data));
    showToast('✓ ड्राफ्ट सुरक्षित');
  } catch(e) { /* storage full */ }
}

var debouncedAutoSave = debounce(autoSaveAtt, 1500);

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

// Listen for input changes on the staff attendance panel


// Hook into PLP panel events
var plpPanel = document.getElementById('plp-panel');
if (plpPanel) {
  plpPanel.addEventListener('input', debouncedPLPSave);
  plpPanel.addEventListener('change', debouncedPLPSave);
}

// Restore from localStorage on load
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

(function restoreAttDraft() {
  try {
    var saved = localStorage.getItem('att_draft');
    if (!saved) return;
    var data = JSON.parse(saved);
    if (data.officeName) { attState.officeName = data.officeName; var el1 = document.getElementById('att-office'); if (el1) el1.value = data.officeName; }
    if (data.kramank) { attState.kramank = data.kramank; var el2 = document.getElementById('att-kramank'); if (el2) el2.value = data.kramank; }
    if (data.codeNo) { attState.codeNo = data.codeNo; var elc = document.getElementById('att-codeno'); if (elc) elc.value = data.codeNo; }
    if (data.date) { attState.date = data.date; var el3 = document.getElementById('att-date'); if (el3) el3.value = data.date; }
    if (data.from) { attState.from = data.from; var el4 = document.getElementById('att-from'); if (el4) el4.value = data.from; }
    if (data.to) { attState.to = data.to; var el5 = document.getElementById('att-to'); if (el5) el5.value = data.to; }
    if (data.note) { attState.note = data.note; var el6 = document.getElementById('att-note'); if (el6) el6.value = data.note; }
    if (data.staffRows && data.staffRows.length > 0) {
      attState.staff = data.staffRows.map(function(s) {
        return { name: s.name || '', desig: s.desig || '', prevCL: s.prevCL || s.prevLeaves || 0, days: s.days || {} };
      });
    }
    /* renderDoc is called by the IIFE — the restored state will be picked up automatically */
  } catch(e) { /* ignore parse errors */ }
})();

/* === TYPEWRITER EFFECT (19.9) === */
function typewriter(element, text, speed) {
  speed = speed || 20;
  element.textContent = '';
  var chars = [...text]; // Handle Hindi Unicode properly
  var i = 0;
  var timer = setInterval(function() {
    element.textContent += chars[i];
    i++;
    if (i >= chars.length) clearInterval(timer);
  }, speed);
}

// Trigger when cert block enters viewport
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  var certTextEl = document.getElementById('att-cert-text');
  if (certTextEl) {
    var certFullText = certTextEl.textContent.trim();
    var certObserver = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        typewriter(certTextEl, certFullText, 20);
        certObserver.disconnect();
      }
    }, { threshold: 0.5 });
    certObserver.observe(certTextEl.closest('.cert-block') || certTextEl);
  }
}

/* === THEME: always light === */
document.documentElement.setAttribute('data-theme', 'light');

/* === GLOWING TOP BORDER ON SCROLL (19.8) === */
window.addEventListener('scroll', function() {
  document.body.classList.toggle('scrolled', window.scrollY > 20);
});

/* === SCROLL-TRIGGERED FADE FOR FORM PANELS (19.5) === */
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Only apply to panels that are NOT the first visible panel
  var panels = document.querySelectorAll('.form-panel');
  if (panels.length > 1) {
    for (var i = 1; i < panels.length; i++) {
      panels[i].classList.add('scroll-reveal');
    }
  }
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('panel-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.form-panel.scroll-reveal').forEach(function(el) {
    observer.observe(el);
  });
})();

/* === REPORT HISTORY === */
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
    } else if (entry.type === 'yog') {
      localStorage.setItem('yog_draft', entry.snapshot);
      showPanel('yog-panel');
      setTimeout(function () {
        if (window._yogState && window._renderYogTable && window._renderYogDoc) {
          var d = data;
          if (d.centerName) { window._yogState.centerName = d.centerName; var el = document.getElementById('yog-center-name'); if (el) el.value = d.centerName; }
          if (d.kramank)    { window._yogState.kramank    = d.kramank;    var el2 = document.getElementById('yog-kramank');     if (el2) el2.value = d.kramank; }
          if (d.date)       { window._yogState.date       = d.date;       var el3 = document.getElementById('yog-date');        if (el3) el3.value = d.date; }
          if (d.monthVal)   { window._yogState.monthVal   = d.monthVal;   var el4 = document.getElementById('yog-month');       if (el4) el4.value = d.monthVal; }
          if (d.rows && d.rows.length > 0) window._yogState.rows = d.rows;
          window._renderYogTable();
          window._renderYogDoc();
          showToast('📂 योग रिपोर्ट पुनः लोड की गई');
        }
      }, 100);
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
    var icon = entry.type === 'plp' ? '📊' : entry.type === 'yog' ? '🧘' : '📋';
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

// Mobile button hint
if (window.innerWidth < 768 && !sessionStorage.getItem('btn_hint_shown')) {
  sessionStorage.setItem('btn_hint_shown', '1');
  setTimeout(function() { showToast('👇 नीचे बटन उपलब्ध हैं', 2500); }, 800);
}

// Expose navigation functions to window for React onClick handlers
window.showPanel = showPanel;
window.showHomeScreen = showHomeScreen;

/* =========================================================
   YOGA INSTRUCTOR MODULE
   ========================================================= */
(function () {
  'use strict';

  var YOG_MONTHS = [
    'जनवरी','फरवरी','मार्च','अप्रैल','मई','जून',
    'जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'
  ];
  var YOG_MONTH_DAYS = [31,28,31,30,31,30,31,31,30,31,30,31];

  function getDaysInMonth(monthIdx, year) {
    if (monthIdx === 1) {
      return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 29 : 28;
    }
    return YOG_MONTH_DAYS[monthIdx];
  }

  function getSelectedMonthMeta() {
    var sel = document.getElementById('yog-month');
    if (!sel || !sel.value) return { idx: 0, year: new Date().getFullYear(), label: '', days: 31 };
    var val = parseInt(sel.value, 10);
    var monthIdx = Math.floor(val / 10000);
    var year = val % 10000;
    return {
      idx: monthIdx,
      year: year,
      label: YOG_MONTHS[monthIdx] + ' ' + year,
      days: getDaysInMonth(monthIdx, year)
    };
  }

  var yogState = {
    centerName: '',
    kramank: '',
    date: '',
    monthVal: 0,
    rows: [
      { naam: '', gender: 'पुरुष', days: '', hoursYog: '', hoursIEC: '' }
    ]
  };

  function populateYogMonthSelect() {
    var sel = document.getElementById('yog-month');
    if (!sel) return;
    var now = new Date();
    var curMonth = now.getMonth();
    var curYear  = now.getFullYear();
    sel.innerHTML = '';
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
    return { days: days, hoursYog: hoursYog, hoursIEC: hoursIEC, totalHours: totalHours, rate: 250, payment: payment, isFemale: isFemale };
  }

  function renderYogTable() {
    var tbody = document.getElementById('yog-tbody');
    if (!tbody) return;
    var meta = getSelectedMonthMeta();
    var html = '';

    yogState.rows.forEach(function (row, idx) {
      var calc = calcYogRow(row);
      html += '<tr>';
      // Col 1: क्र.सं.
      html += '<td style="font-weight:600">' + (idx + 1) + '</td>';
      // Col 2: नाम
      html += '<td><input class="form-input-base yog-inp" style="min-width:120px;font-size:12px" '
            + 'type="text" data-idx="' + idx + '" data-field="naam" '
            + 'value="' + esc(row.naam) + '" placeholder="नाम दर्ज करें"></td>';
      // Col 3: Gender dropdown
      html += '<td><select class="form-input-base yog-sel" style="font-size:12px" '
            + 'data-idx="' + idx + '" data-field="gender">'
            + '<option value="पुरुष"' + (row.gender === 'पुरुष' ? ' selected' : '') + '>पुरुष</option>'
            + '<option value="महिला"' + (row.gender === 'महिला' ? ' selected' : '') + '>महिला</option>'
            + '</select></td>';
      // Col 4: Days (max = total days in selected month)
      html += '<td><input class="form-input-base yog-inp" style="font-size:12px;text-align:center" '
            + 'type="number" min="0" max="' + meta.days + '" '
            + 'data-idx="' + idx + '" data-field="days" '
            + 'value="' + (row.days || '') + '" placeholder="0"></td>';
      // Col 5: editable for BOTH genders (max 20 for female, max 31 for male)
      html += '<td><input class="form-input-base yog-inp" style="font-size:12px;text-align:center" '
            + 'type="number" min="0" max="' + (calc.isFemale ? 20 : 31) + '" step="0.5" '
            + 'data-idx="' + idx + '" data-field="hoursYog" '
            + 'value="' + (row.hoursYog || '') + '" placeholder="0"></td>';
      if (calc.isFemale) {
        // Col 6: NA for female
        html += '<td style="color:var(--text-muted);font-style:italic;font-size:12px;background:var(--bg-elevated)">NA</td>';
      } else {
        // Col 6: IEC hours editable for male (max 2)
        html += '<td><input class="form-input-base yog-inp" style="font-size:12px;text-align:center" '
              + 'type="number" min="0" max="2" step="0.5" '
              + 'data-idx="' + idx + '" data-field="hoursIEC" '
              + 'value="' + (row.hoursIEC || '') + '" placeholder="0"></td>';
      }
      // Col 7: auto-calculated total for BOTH genders
      html += '<td style="font-weight:600;color:var(--accent-primary)">' + calc.totalHours + '</td>';
      // Col 8: fixed rate
      html += '<td style="color:var(--text-secondary);font-size:11px">₹250/-</td>';
      // Col 9: payment
      html += '<td style="font-weight:700;color:var(--accent-primary)">₹' + calc.payment.toLocaleString('en-IN') + '/-</td>';
      html += '<td class="no-print"><button class="rm-btn" '
            + 'onclick="window._yogRemoveRow(' + idx + ')" '
            + (yogState.rows.length <= 1 ? 'disabled' : '') + '>✕</button></td>';
      html += '</tr>';
    });

    tbody.innerHTML = html;

    var addBtn = document.getElementById('yog-add-row-btn');
    if (addBtn) addBtn.style.display = yogState.rows.length >= 2 ? 'none' : '';

    tbody.querySelectorAll('.yog-inp').forEach(function (inp) {
      inp.addEventListener('input', function () {
        var idx = parseInt(this.dataset.idx, 10);
        yogState.rows[idx][this.dataset.field] = this.value;
        // Update calculated cells in-place — avoids re-render which would destroy focus
        var calc = calcYogRow(yogState.rows[idx]);
        // Clamp days field to the current month's max days
        if (this.dataset.field === 'days') {
          var maxD = getSelectedMonthMeta().days;
          if ((parseFloat(this.value) || 0) > maxD) {
            this.value = String(maxD);
            yogState.rows[idx].days = String(maxD);
          }
        }
        var trs = tbody.querySelectorAll('tr');
        if (trs[idx]) {
          var tds = trs[idx].querySelectorAll('td');
          // td[6] = col 7 (auto total) for BOTH genders now
          if (tds[6]) tds[6].textContent = calc.totalHours || 0;
          // td[8] = col 9 (payment) for both genders
          if (tds[8]) {
            tds[8].textContent = calc.payment ? '₹' + calc.payment.toLocaleString('en-IN') + '/-' : '—';
            tds[8].style.fontWeight = '700';
            tds[8].style.color = 'var(--accent-primary)';
          }
        }
        if (!window._debouncedRenderYogDoc) window._debouncedRenderYogDoc = debounce(renderYogDoc, 200);
        window._debouncedRenderYogDoc();
        debouncedYogSave();
      });
    });

    tbody.querySelectorAll('.yog-sel').forEach(function (sel) {
      sel.addEventListener('change', function () {
        var i = parseInt(this.dataset.idx, 10);
        yogState.rows[i][this.dataset.field] = this.value;
        if (this.dataset.field === 'gender' && this.value === 'महिला') {
          yogState.rows[i].hoursIEC = '';
        }
        renderYogTable();
        renderYogDoc();
        debouncedYogSave();
      });
    });
  }

  window._yogRemoveRow = function (idx) {
    if (yogState.rows.length <= 1) return;
    yogState.rows.splice(idx, 1);
    renderYogTable();
    renderYogDoc();
  };

  function renderYogDoc() {
    var elCenter = document.getElementById('yog-doc-center');
    if (elCenter) elCenter.textContent = yogState.centerName || '____________________';

    var elKr = document.getElementById('yog-doc-kramank');
    if (elKr) elKr.textContent = yogState.kramank || '__________';

    var elDate = document.getElementById('yog-doc-date');
    if (elDate) {
      if (yogState.date) {
        var d = new Date(yogState.date + 'T00:00:00');
        elDate.textContent = d.toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' });
      } else {
        elDate.textContent = '__________';
      }
    }

    var elMonth = document.getElementById('yog-doc-month');
    if (elMonth) elMonth.textContent = getSelectedMonthMeta().label || '__________';

    var elSeal = document.getElementById('yog-doc-seal');
    if (elSeal) elSeal.textContent = yogState.centerName ? yogState.centerName : '';

    var docTbody = document.getElementById('yog-doc-tbody');
    if (!docTbody) return;

    var C  = 'border:1px solid #000;padding:3px 2px;text-align:center;vertical-align:middle;font-size:6.5pt;';
    var CL = 'border:1px solid #000;padding:3px 3px;text-align:left;vertical-align:middle;font-size:6.5pt;';
    var CN = 'border:1px solid #000;padding:3px 2px;text-align:center;vertical-align:middle;font-size:6.5pt;color:#888;font-style:italic;';

    var rows = yogState.rows.map(function (row, idx) {
      var calc = calcYogRow(row);
      // col 5 & 6: NA for female; col 7: totalHours (directly entered for female)
      // col 5: shows hoursYog for both genders (female col 5 is now editable)
      var col5 = '<td style="' + C + '">' + (row.hoursYog || '—') + '</td>';
      // col 6: NA for female, IEC hours for male
      var col6 = calc.isFemale ? '<td style="' + CN + '">NA</td>' : '<td style="' + C + '">' + (row.hoursIEC || '—') + '</td>';
      var col7 = '<td style="' + C + 'font-weight:700;">' + (calc.totalHours || '—') + '</td>';
      return '<tr>'
        + '<td style="' + C + '">' + (idx + 1) + '</td>'
        + '<td style="' + CL + '">' + esc(row.naam || '') + '</td>'
        + '<td style="' + C + '">' + row.gender + ' योग प्रशिक्षक</td>'
        + '<td style="' + C + '">' + (row.days || '—') + '</td>'
        + col5 + col6 + col7
        + '<td style="' + C + '">₹250/-</td>'
        + '<td style="' + C + 'font-weight:700;">' + (calc.payment ? '₹' + calc.payment.toLocaleString('en-IN') + '/-' : '—') + '</td>'
        + '</tr>';
    }).join('');
    docTbody.innerHTML = rows;
  }

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
      renderYogTable();
      renderYogDoc();
      debouncedYogSave();
    });
  }

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

  function exportYogPDF() {
    if (typeof window.html2pdf === 'undefined') { showToast('⚠️ PDF लाइब्रेरी लोड नहीं हुई'); return; }
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
      saveReportToHistory({
        type: 'yog',
        title: 'योग प्रशिक्षक',
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

  function printYogDoc() {
    var el = document.getElementById('yog-doc-page');
    if (!el) return;
    var win = window.open('', '_blank');
    win.document.write('<html><head><title>योग प्रशिक्षक उपस्थिति पत्रक</title>');
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

  function exportYogExcel() {
    if (typeof XLSX === 'undefined') { showToast('⚠️ Excel लाइब्रेरी लोड नहीं हुई'); return; }
    var meta = getSelectedMonthMeta();
    var wb = XLSX.utils.book_new();
    var wsData = [
      ['आयुर्वेद विभाग राजस्थान सरकार'],
      ['कार्यालय आयुष्मान आरोग्य मंदिर राजकीय - ' + (yogState.centerName || '')],
      ['योग प्रशिक्षक उपस्थिति पत्रक', '', '', '', '', '', '', '', 'माह: ' + meta.label],
      [],
      ['क्र.सं.','नाम योग प्रशिक्षक','महिला / पुरुष','दिवस संख्या',
       'जन सामान्य योग घंटे','IEC कार्यक्रम घंटे','कुल निष्पादित घंटे',
       'निर्धारित दर/घंटे','कुल भुगतान राशि']
    ];
    yogState.rows.forEach(function (row, idx) {
      var calc = calcYogRow(row);
      wsData.push([
        idx + 1, row.naam || '', row.gender + ' योग प्रशिक्षक',
        row.days || '', row.hoursYog || '',
        calc.isFemale ? 'NA' : (row.hoursIEC || ''),
        calc.totalHours, '₹250/-',
        calc.payment ? '₹' + calc.payment + '/-' : ''
      ]);
    });
    wsData.push([]);
    wsData.push(['प्रमाणित किया जाता है कि उपर्युक्त टेबल के कॉलम संख्या 4 में उल्लेखित दिवसों में योग प्रशिक्षक द्वारा प्रतिदिन एक घंटे से अधिक कार्य सम्पादित किया गया।']);
    var ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [{wch:6},{wch:28},{wch:20},{wch:14},{wch:18},{wch:18},{wch:20},{wch:18},{wch:20}];
    XLSX.utils.book_append_sheet(wb, ws, 'योग प्रशिक्षक');
    XLSX.writeFile(wb, 'Yog_Shikshak_' + meta.label.replace(' ', '_') + '.xlsx');
    if (window.soundFX) window.soundFX.success();
    showToast('✅ Excel सहेजा गया');
  }

  function attachYogButtons() {
    var pdfBtn = document.getElementById('yog-btn-pdf');
    if (pdfBtn) pdfBtn.addEventListener('click', exportYogPDF);
    var printBtn = document.getElementById('yog-btn-print');
    if (printBtn) printBtn.addEventListener('click', printYogDoc);
    var excelBtn = document.getElementById('yog-btn-excel');
    if (excelBtn) excelBtn.addEventListener('click', exportYogExcel);
    var previewBtn = document.getElementById('yog-btn-preview');
    if (previewBtn) previewBtn.addEventListener('click', function () {
      var body = document.querySelector('.yog-preview-body');
      if (body) {
        var isOpen = body.style.display !== 'none';
        body.style.display = isOpen ? 'none' : 'block';
        if (!isOpen) { body.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      }
    });
  }

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

  var debouncedYogSave = debounce(autoSaveYog, 1500);

  var yogPanel = document.getElementById('yog-panel');
  if (yogPanel) {
    yogPanel.addEventListener('input', debouncedYogSave);
    yogPanel.addEventListener('change', debouncedYogSave);
  }

  function restoreYogDraft() {
    try {
      var saved = localStorage.getItem('yog_draft');
      if (!saved) return;
      var data = JSON.parse(saved);
      if (data.centerName) { yogState.centerName = data.centerName; var el = document.getElementById('yog-center-name'); if (el) el.value = data.centerName; }
      if (data.kramank)    { yogState.kramank    = data.kramank;    var el2 = document.getElementById('yog-kramank');    if (el2) el2.value = data.kramank; }
      if (data.date)       { yogState.date       = data.date;       var el3 = document.getElementById('yog-date');       if (el3) el3.value = data.date; }
      if (data.monthVal)   { yogState.monthVal   = data.monthVal;   var el4 = document.getElementById('yog-month');      if (el4) el4.value = data.monthVal; }
      if (data.rows && data.rows.length > 0) yogState.rows = data.rows;
      renderYogTable();
      renderYogDoc();
      showToast('📂 योग ड्राफ्ट पुनः लोड किया गया');
    } catch (e) { /* ignore */ }
  }

  // Expose to window for restoreFromHistory
  window._yogState       = yogState;
  window._renderYogTable = renderYogTable;
  window._renderYogDoc   = renderYogDoc;

  // ── INIT ──
  populateYogMonthSelect();
  attachYogHeaderListeners();
  attachYogAddRow();
  attachYogButtons();
  renderYogTable();
  renderYogDoc();
  restoreYogDraft();

})(); /* end Yoga Module IIFE */

