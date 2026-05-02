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
  maah: 'फरवरी',
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
      <td><input type="number" min="0" value="${row.lakshya}" data-row="${i}" data-field="lakshya" placeholder="0"></td>
      <td><input type="number" min="0" value="${row.prapti}" data-row="${i}" data-field="prapti" placeholder="0"></td>
      <td class="pct-cell">${pcts[i].toFixed(2)}%</td>
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
      <td style="text-align:left">${row.naam || '________________'}</td>
      <td style="text-align:center;font-weight:600">${row.pad || '—'}</td>
      <td style="text-align:center">${row.bank_khataa || '____________'}</td>
      <td style="text-align:left">${row.bank_naam || '____________'}</td>
      <td style="text-align:center">${row.ifsc || '________'}</td>
      <td style="text-align:center">${row.mobile || '__________'}</td>
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
document.getElementById('karya-tbody').addEventListener('input', e => {
  const el = e.target;
  const row = el.dataset.row, field = el.dataset.field;
  if (row === undefined || !field) return;
  state.rows[+row][field] = el.value;
  renderAll();
});

document.getElementById('karma-tbody').addEventListener('input', e => {
  const el = e.target;
  const ki = el.dataset.ki, kf = el.dataset.kf;
  if (ki === undefined || !kf) return;
  let val = el.value;
  if (kf === 'ifsc') val = val.toUpperCase();
  state.karmachari[+ki][kf] = val;
  if (kf === 'ifsc') el.value = val;
  renderAll();
});

document.getElementById('karma-tbody').addEventListener('change', e => {
  const el = e.target;
  const ki = el.dataset.ki, kf = el.dataset.kf;
  if (ki === undefined || !kf) return;
  state.karmachari[+ki][kf] = el.value;
  renderAll();
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
  MONTHS.forEach(m => {
    const o = document.createElement('option');
    o.value = m; o.textContent = m;
    if (m === 'फरवरी') o.selected = true;
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
    return;
  }
  errBox.style.display = 'none';

  const overlay = document.getElementById('overlay');
  overlay.classList.add('active');

  try {
    await new Promise(r => setTimeout(r, 200));
    const element = document.getElementById('doc-page');
    const opt = {
      margin: [4, 4, 4, 4],
      filename: `AHWC_PLP_Report_${state.maah}_${state.varsh}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2.5, useCORS: true, letterRendering: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'avoid-all' },
    };
    await html2pdf().set(opt).from(element).save();
  } finally {
    overlay.classList.remove('active');
  }
});

/* =========================================================
   INITIAL RENDER
   ========================================================= */
renderAll();

/* === NAVIGATION === */
function showPanel(panelId) {
  document.getElementById('home-screen').style.display = 'none';
  document.getElementById('plp-panel').style.display = 'none';
  document.getElementById('staff-att-panel').style.display = 'none';
  
  const target = document.getElementById(panelId);
  if (target) {
    target.style.display = 'flex';
    target.classList.add('page-transition');
    setTimeout(() => target.classList.remove('page-transition'), 400);
  }

  if (panelId === 'staff-att-panel') {
    document.body.classList.add('is-staff-att');
  } else {
    document.body.classList.remove('is-staff-att');
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showHomeScreen() {
  document.getElementById('home-screen').style.display = 'flex';
  document.getElementById('plp-panel').style.display = 'none';
  document.getElementById('staff-att-panel').style.display = 'none';
  document.body.classList.remove('is-staff-att');
  
  // Add animation to home screen
  const homeScreen = document.getElementById('home-screen');
  homeScreen.classList.add('page-transition');
  setTimeout(() => homeScreen.classList.remove('page-transition'), 400);
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* === STAFF ATTENDANCE === */
let attState = {
  officeName: '',
  kramank: '',
  date: '',
  periodFrom: '',
  periodTo: '',
  note: '',
  staff: [
    { name: '', prevLeaves: 0, days: {} }
  ]
};

const ATT_OPTIONS = [
  "उपस्थित",
  "Day off",
  "आकस्मिक अवकाश",
  "चाइल्डकेयर लीव",
  "उपार्जित अवकाश",
  "परिवर्तित अवकाश",
  "अर्धवेतन अवकाश",
  "असाधारण अवकाश",
  "प्रसूति अवकाश",
  "पितृत्व अवकाश",
  "willful absence",
  "Onduty",
  "अवकाश पर",
  "कार्यमुक्त"
];

function getDatesArray(from, to) {
  const dates = [];
  if (!from || !to) return dates;
  let curr = new Date(from);
  const end = new Date(to);
  if (curr > end) return dates;
  while (curr <= end) {
    dates.push(new Date(curr));
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
}

function formatDateDisplay(d) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}.${mm}.${yy}`;
}

function renderAttTable() {
  const dates = getDatesArray(attState.periodFrom, attState.periodTo);
  
  let headHtml = `
    <th style="width:30px">क्र.सं.</th>
    <th class="att-name-col">नाम कार्मिक मय पद</th>
  `;
  dates.forEach(d => {
    headHtml += `<th class="att-day-col">${formatDateDisplay(d)}</th>`;
  });
  headHtml += `
    <th class="att-count-col">उपस्थिति पत्रक अवधि में उपभोग किए गए आकस्मिक अवकाश का योग</th>
    <th class="att-count-col">पिछले उपस्थिति पत्रक अवधि तक उपयोग किए गए कुल आकस्मिक अवकाश</th>
    <th class="att-count-col">अब तक कुल उपभोग आकस्मिक अवकाश</th>
    <th style="width:40px">—</th>
  `;
  document.getElementById('att-tbl-head').innerHTML = headHtml;

  let bodyHtml = '';
  attState.staff.forEach((s, idx) => {
    let currentPeriodCL = 0;
    
    let daysCells = '';
    dates.forEach(d => {
      const dateStr = d.toISOString().split('T')[0];
      const val = s.days[dateStr] || 'उपस्थित';
      if (val === 'आकस्मिक अवकाश') currentPeriodCL++;
      
      let optionsHtml = '';
      ATT_OPTIONS.forEach(opt => {
        optionsHtml += `<option value="${opt}" ${opt === val ? 'selected' : ''}>${opt}</option>`;
      });
      
      daysCells += `<td>
        <select data-idx="${idx}" data-date="${dateStr}" class="att-day-select">${optionsHtml}</select>
        <span class="att-select-print-span" style="display:none;">${val}</span>
      </td>`;
    });
    
    const prevCL = parseInt(s.prevLeaves) || 0;
    const totalCL = currentPeriodCL + prevCL;
    
    bodyHtml += `
      <tr>
        <td class="sno">${idx + 1}</td>
        <td><input type="text" data-idx="${idx}" class="att-name-input" value="${esc(s.name)}" placeholder="नाम एवं पद"></td>
        ${daysCells}
        <td style="font-weight:bold" id="att-n1-${idx}">${currentPeriodCL}</td>
        <td><input type="number" min="0" data-idx="${idx}" class="att-prev-input" value="${s.prevLeaves}"></td>
        <td style="font-weight:bold" id="att-n3-${idx}">${totalCL}</td>
        <td><button class="rm-btn" onclick="removeAttRow(${idx})" ${attState.staff.length <= 1 ? 'disabled' : ''}>✕</button></td>
      </tr>
    `;
  });
  document.getElementById('att-tbody').innerHTML = bodyHtml;
  
  renderAttPreview(dates);
}

function renderAttPreview(dates) {
  document.getElementById('att-doc-office').textContent = attState.officeName || '';
  document.getElementById('att-doc-kramank').textContent = attState.kramank || '';
  
  let dateStr = '';
  if (attState.date) {
    const d = new Date(attState.date);
    dateStr = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
  }
  document.getElementById('att-doc-date').textContent = dateStr;
  
  let pFromStr = '', pToStr = '';
  if (attState.periodFrom) {
    const d = new Date(attState.periodFrom);
    pFromStr = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
  }
  if (attState.periodTo) {
    const d = new Date(attState.periodTo);
    pToStr = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
  }
  document.getElementById('att-doc-period-from').textContent = pFromStr;
  document.getElementById('att-doc-period-to').textContent = pToStr;
  
  document.getElementById('att-doc-seal-office').textContent = attState.officeName || '';
  
  const noteSec = document.getElementById('att-doc-note-sec');
  if (attState.note.trim()) {
    document.getElementById('att-doc-note-text').textContent = attState.note.trim();
    noteSec.style.display = 'block';
  } else {
    noteSec.style.display = 'none';
  }

  let headHtml = `
    <th style="width:20px">क्र.सं.</th>
    <th class="att-name-col">नाम कार्मिक मय पद</th>
  `;
  dates.forEach(d => {
    headHtml += `<th class="att-day-col">${formatDateDisplay(d)}</th>`;
  });
  headHtml += `
    <th class="att-count-col">उपस्थिति पत्रक अवधि में उपभोग किए गए आकस्मिक अवकाश का योग</th>
    <th class="att-count-col">पिछले उपस्थिति पत्रक अवधि तक उपयोग किए गए कुल आकस्मिक अवकाश</th>
    <th class="att-count-col">अब तक कुल उपभोग आकस्मिक अवकाश</th>
  `;
  document.getElementById('att-doc-tbl-head').innerHTML = headHtml;

  let bodyHtml = '';
  attState.staff.forEach((s, idx) => {
    let currentPeriodCL = 0;
    let daysCells = '';
    dates.forEach(d => {
      const dateStr = d.toISOString().split('T')[0];
      const val = s.days[dateStr] || 'उपस्थित';
      if (val === 'आकस्मिक अवकाश') currentPeriodCL++;
      daysCells += `<td>${val}</td>`;
    });
    
    const prevCL = parseInt(s.prevLeaves) || 0;
    const totalCL = currentPeriodCL + prevCL;
    
    bodyHtml += `
      <tr>
        <td style="text-align:center">${idx + 1}</td>
        <td>${esc(s.name)}</td>
        ${daysCells}
        <td style="text-align:center;font-weight:bold" id="att-doc-n1-${idx}">${currentPeriodCL}</td>
        <td style="text-align:center" id="att-doc-n2-${idx}">${prevCL}</td>
        <td style="text-align:center;font-weight:bold" id="att-doc-n3-${idx}">${totalCL}</td>
      </tr>
    `;
  });
  document.getElementById('att-doc-tbody').innerHTML = bodyHtml;
}

function removeAttRow(idx) {
  if (attState.staff.length <= 1) return;
  attState.staff.splice(idx, 1);
  renderAttTable();
}

function updateLeavesForStaff(idx) {
  const dates = getDatesArray(attState.periodFrom, attState.periodTo);
  let currentPeriodCL = 0;
  dates.forEach(d => {
    const dateStr = d.toISOString().split('T')[0];
    const val = attState.staff[idx].days[dateStr] || 'उपस्थित';
    if (val === 'आकस्मिक अवकाश') currentPeriodCL++;
  });
  
  const prevCL = parseInt(attState.staff[idx].prevLeaves) || 0;
  const totalCL = currentPeriodCL + prevCL;

  // Update Form
  const n1 = document.getElementById(`att-n1-${idx}`);
  if (n1) n1.textContent = currentPeriodCL;
  const n3 = document.getElementById(`att-n3-${idx}`);
  if (n3) n3.textContent = totalCL;

  // Update Preview
  const docN1 = document.getElementById(`att-doc-n1-${idx}`);
  if (docN1) docN1.textContent = currentPeriodCL;
  const docN2 = document.getElementById(`att-doc-n2-${idx}`);
  if (docN2) docN2.textContent = prevCL;
  const docN3 = document.getElementById(`att-doc-n3-${idx}`);
  if (docN3) docN3.textContent = totalCL;
}

// Event Listeners for Live Sync
document.getElementById('att-office-name').addEventListener('input', e => { 
  attState.officeName = e.target.value; 
  document.getElementById('att-doc-office').textContent = attState.officeName;
  document.getElementById('att-doc-seal-office').textContent = attState.officeName;
});
document.getElementById('att-kramank').addEventListener('input', e => { 
  attState.kramank = e.target.value; 
  document.getElementById('att-doc-kramank').textContent = attState.kramank;
});
document.getElementById('att-date').addEventListener('change', e => { 
  attState.date = e.target.value; 
  let dateStr = '';
  if (attState.date) {
    const d = new Date(attState.date);
    dateStr = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
  }
  document.getElementById('att-doc-date').textContent = dateStr;
});
document.getElementById('att-period-from').addEventListener('change', e => { attState.periodFrom = e.target.value; renderAttTable(); });
document.getElementById('att-period-to').addEventListener('change', e => { attState.periodTo = e.target.value; renderAttTable(); });
document.getElementById('att-note').addEventListener('input', e => { 
  attState.note = e.target.value; 
  const noteSec = document.getElementById('att-doc-note-sec');
  if (attState.note.trim()) {
    document.getElementById('att-doc-note-text').textContent = attState.note.trim();
    noteSec.style.display = 'block';
  } else {
    noteSec.style.display = 'none';
  }
});

document.getElementById('att-add-row-btn').addEventListener('click', () => {
  attState.staff.push({ name: '', prevLeaves: 0, days: {} });
  renderAttTable();
  // Animate the newly added row
  setTimeout(() => {
    const rows = document.querySelectorAll('#att-tbody tr');
    const newRow = rows[rows.length - 1];
    if (newRow) {
      newRow.style.animation = 'fadeSlideUp 0.4s ease';
    }
  }, 10);
});

document.getElementById('att-tbody').addEventListener('input', e => {
  const el = e.target;
  const idx = el.dataset.idx;
  if (idx === undefined) return;
  
  if (el.classList.contains('att-name-input')) {
    attState.staff[+idx].name = el.value;
    renderAttPreview(getDatesArray(attState.periodFrom, attState.periodTo)); // Re-render preview to sync name
  } else if (el.classList.contains('att-prev-input')) {
    attState.staff[+idx].prevLeaves = el.value;
    updateLeavesForStaff(+idx);
  }
});

document.getElementById('att-tbody').addEventListener('change', e => {
  const el = e.target;
  const idx = el.dataset.idx;
  if (idx === undefined) return;
  
  if (el.classList.contains('att-day-select')) {
    const date = el.dataset.date;
    const val = el.value;
    attState.staff[+idx].days[date] = val;
    // Update the print span sibling
    const span = el.nextElementSibling;
    if (span && span.classList.contains('att-select-print-span')) {
      span.textContent = val;
    }
    renderAttPreview(getDatesArray(attState.periodFrom, attState.periodTo));
    updateLeavesForStaff(+idx);
  }
});

function validateAttForm() {
  let errs = [];
  if (!attState.officeName.trim()) {
    errs.push('कार्यालय का नाम आवश्यक है।');
  }
  if (!attState.periodFrom || !attState.periodTo) {
    errs.push('उपस्थिति अवधि चुनना आवश्यक है।');
  } else if (new Date(attState.periodFrom) > new Date(attState.periodTo)) {
    errs.push('अवधि प्रारंभ तिथि समाप्ति तिथि से पहले होनी चाहिए।');
  }
  
  const hasStaff = attState.staff.some(s => s.name.trim() !== '');
  if (!hasStaff) {
    errs.push('कम से कम एक कार्मिक का नाम आवश्यक है।');
  }
  
  const errBox = document.getElementById('att-err-box');
  if (errs.length > 0) {
    errBox.innerHTML = errs.map(e => `<div>⚠️ ${e}</div>`).join('');
    errBox.style.display = 'block';
    return false;
  }
  errBox.style.display = 'none';
  return true;
}

document.getElementById('att-btn-preview').addEventListener('click', () => {
  if (!validateAttForm()) return;
  document.getElementById('att-doc-page').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('att-btn-print').addEventListener('click', () => {
  if (!validateAttForm()) return;
  window.print();
});

document.getElementById('att-btn-pdf').addEventListener('click', async () => {
  if (!validateAttForm()) return;
  
  const overlay = document.getElementById('overlay');
  overlay.classList.add('active');

  let pFromStr = attState.periodFrom || 'Start';
  let pToStr = attState.periodTo || 'End';

  try {
    await new Promise(r => setTimeout(r, 200));
    const element = document.getElementById('att-doc-page');
    const opt = {
      margin: [5, 5, 5, 5],
      filename: `Upasthiti_Patrak_${pFromStr}_${pToStr}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
      pagebreak: { mode: 'avoid-all' }
    };
    await html2pdf().set(opt).from(element).save();
  } finally {
    overlay.classList.remove('active');
  }
});

renderAttTable();
/* === END STAFF ATTENDANCE === */

/* === DARK MODE TOGGLE === */
(function(){
  window.toggleTheme = function() {
    var html = document.documentElement;
    var isDark = html.getAttribute('data-theme') === 'dark';

    // Add smooth transition class
    document.body.classList.add('dark-transition');

    if (isDark) {
      html.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }

    // Remove transition class after animation completes
    setTimeout(function(){ document.body.classList.remove('dark-transition'); }, 450);

    // Update icon
    var icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = isDark ? '\u{1F319}' : '\u2600\uFE0F';

    // Update tooltip
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.title = isDark ? 'Dark Mode' : 'Light Mode';
      btn.setAttribute('aria-label', isDark ? 'Switch to dark mode' : 'Switch to light mode');
    }
  };

  // Set initial icon state
  var isInitDark = document.documentElement.getAttribute('data-theme') === 'dark';
  var ei = document.getElementById('theme-icon');
  if (ei) ei.textContent = isInitDark ? '\u2600\uFE0F' : '\u{1F319}';
  var eb = document.getElementById('theme-toggle');
  if (eb) eb.title = isInitDark ? 'Light Mode' : 'Dark Mode';
})();
/* === END DARK MODE TOGGLE === */
