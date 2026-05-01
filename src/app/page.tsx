'use client';

import Script from 'next/script';

/* ═══════════════════════════════════════════════════════════════
   Soochna Sahayak — Smart Office Assistant
   Full responsive website (web_portal port)
   ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <>
      {/* html2pdf.js CDN */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        strategy="beforeInteractive"
      />
      {/* Web Portal Logic */}
      <Script src="/web-portal.js" strategy="afterInteractive" />

      {/* ========== LOADING OVERLAY ========== */}
      <div className="overlay" id="overlay">
        <div className="overlay-box">
          <div className="spin" />
          PDF तैयार हो रहा है...
        </div>
      </div>

      {/* ========== HOME SCREEN ========== */}
      <div id="home-screen" className="home-screen">
        <div className="home-header-container">
          <div className="home-header">Soochna Sahayak</div>
          <div className="home-subtitle">Smart Office Assistant — Empowering Office Efficiency</div>
        </div>
        <div className="home-cards">
          <div
            className="home-card primary"
            onClick={() => { if (typeof window !== 'undefined') (window as any).showPanel?.('plp-panel'); }}
          >
            <div className="card-icon">📊</div>
            <div className="card-title">PLP Report</div>
            <div className="card-arrow">→</div>
          </div>
          <div
            className="home-card"
            onClick={() => { if (typeof window !== 'undefined') (window as any).showPanel?.('staff-att-panel'); }}
          >
            <div className="card-icon">👥</div>
            <div className="card-title">Staff Attendance</div>
            <div className="card-arrow">→</div>
          </div>
          <div className="home-card coming-soon" onClick={() => alert('Coming Soon')}>
            <div className="card-badge">Coming Soon</div>
            <div className="card-icon">🧘</div>
            <div className="card-title">Yoga Instructor Attendance</div>
            <div className="card-arrow">→</div>
          </div>
        </div>
        <div className="home-footer">
          <div className="hf-line1">Empowering Office Efficiency</div>
          <div className="hf-line2">An Initiative by Peeyush Singh Rao, Assistant Accounts Officer Grade II</div>
        </div>
      </div>

      {/* ========== PLP PANEL ========== */}
      <div className="outer-wrap" id="plp-panel" style={{ display: 'none' }}>
        <button
          className="back-btn no-print"
          onClick={() => { if (typeof window !== 'undefined') (window as any).showHomeScreen?.(); }}
        >
          ← Back to Home
        </button>

        {/* Form Panel */}
        <div className="form-panel no-print">
          <div className="form-panel-header">
            <span>📋</span>
            <span>AHWC मासिक प्रदर्शन PLP रिपोर्ट — डेटा दर्ज करें</span>
          </div>

          <div className="form-inner">
            {/* Error Box */}
            <div className="err-box" id="err-box" style={{ display: 'none' }} />

            {/* Basic Info */}
            <div className="field-grid">
              <div className="field-group">
                <label>AHWC का नाम *</label>
                <input type="text" id="ahwc-name" placeholder="जैसे: AHWC खजूरी बाजार" />
              </div>
              <div className="field-group">
                <label>जिला *</label>
                <input type="text" id="jila" placeholder="जैसे: रायपुर" />
              </div>
              <div className="field-group">
                <label>माह</label>
                <select id="maah" />
              </div>
              <div className="field-group">
                <label>वर्ष</label>
                <select id="varsh" />
              </div>
            </div>

            {/* Table 1 */}
            <div className="sec-label">📊 तालिका 1 — लक्ष्य एवं प्राप्ति</div>
            <div className="tbl-scroll">
              <table className="inp-table">
                <thead>
                  <tr>
                    <th style={{ width: '30px' }}>क्र.</th>
                    <th style={{ minWidth: '200px' }}>कार्य का नाम</th>
                    <th style={{ width: '80px' }}>लक्ष्य</th>
                    <th style={{ width: '80px' }}>प्राप्ति</th>
                    <th style={{ width: '90px' }}>प्रतिशत</th>
                    <th style={{ width: '80px' }}>राशि (₹)</th>
                  </tr>
                </thead>
                <tbody id="karya-tbody" />
                <tfoot id="karya-tfoot" />
              </table>
            </div>

            {/* Table 2 */}
            <div className="sec-label">👥 तालिका 2 — कर्मचारी भुगतान विवरण</div>
            <div className="tbl-scroll">
              <table className="inp-table">
                <thead>
                  <tr>
                    <th style={{ width: '30px' }}>क्र.</th>
                    <th style={{ minWidth: '130px' }}>नाम</th>
                    <th style={{ width: '110px' }}>पद</th>
                    <th style={{ minWidth: '130px' }}>बैंक खाता</th>
                    <th style={{ minWidth: '110px' }}>बैंक नाम</th>
                    <th style={{ width: '100px' }}>IFSC</th>
                    <th style={{ width: '100px' }}>मोबाइल</th>
                    <th style={{ width: '100px' }}>भुगतान (₹)</th>
                    <th style={{ width: '40px' }}>—</th>
                  </tr>
                </thead>
                <tbody id="karma-tbody" />
                <tfoot id="karma-tfoot" />
              </table>
            </div>

            <button className="add-row-btn ripple" id="add-karma-btn">+ कर्मचारी जोड़ें</button>

            {/* Generate PDF */}
            <div className="gen-btn-row">
              <button className="btn-pdf ripple" id="btn-pdf">📄 Generate PDF</button>
            </div>
          </div>
        </div>

        {/* Document Preview */}
        <div className="preview-wrap">
          <div className="preview-label no-print">📄 दस्तावेज़ प्रीव्यू (A4)</div>
          <div className="a4-scaler">
            <div id="doc-page" className="doc-page">
              {/* Document Header */}
              <div className="doc-header">
                <div className="doc-title-top">आयुष्मान आरोग्य मंदिर (AHWC)</div>
                <div className="doc-title-main">मासिक प्रदर्शन आधारित प्रोत्साहन रिपोर्ट(PLP)</div>
              </div>

              {/* Info Row */}
              <div className="doc-info-row">
                <div className="doc-info-item">
                  <span className="dil">AHWC नाम:</span>
                  <span className="div" id="doc-ahwc">________________________</span>
                </div>
                <div className="doc-info-item">
                  <span className="dil">जिला:</span>
                  <span className="div" id="doc-jila">____________</span>
                </div>
                <div className="doc-info-item">
                  <span className="dil">माह एवं वर्ष:</span>
                  <span className="div" id="doc-maah">फरवरी 2026</span>
                </div>
              </div>

              {/* Table 1 */}
              <div className="doc-tbl-title">तालिका 1 — कार्य विवरण एवं प्रदर्शन</div>
              <table className="doc-tbl">
                <thead>
                  <tr>
                    <th style={{ width: '28px' }}>क्र.</th>
                    <th>कार्य का नाम</th>
                    <th style={{ width: '48px' }}>लक्ष्य</th>
                    <th style={{ width: '48px' }}>प्राप्ति</th>
                    <th style={{ width: '58px' }}>प्रतिशत</th>
                    <th style={{ width: '52px' }}>राशि (₹)</th>
                  </tr>
                </thead>
                <tbody id="doc-t1-body" />
                <tfoot id="doc-t1-foot" />
              </table>

              {/* Table 2 */}
              <div className="doc-tbl-title">तालिका 2 — कर्मचारी भुगतान विवरण</div>
              <table className="doc-tbl doc-tbl-sm">
                <thead>
                  <tr>
                    <th style={{ width: '22px' }}>क्र.</th>
                    <th style={{ minWidth: '80px' }}>नाम</th>
                    <th style={{ width: '60px' }}>पद</th>
                    <th style={{ width: '90px' }}>बैंक खाता</th>
                    <th style={{ width: '70px' }}>बैंक नाम</th>
                    <th style={{ width: '60px' }}>IFSC</th>
                    <th style={{ width: '68px' }}>मोबाइल</th>
                    <th style={{ width: '58px' }}>भुगतान (₹)</th>
                  </tr>
                </thead>
                <tbody id="doc-t2-body" />
                <tfoot id="doc-t2-foot" />
              </table>

              {/* Certification */}
              <div className="doc-certify">
                प्रमाणित किया जाता है कि उपर्युक्त सूची में अंकित AMO , नर्स- कंपाउंडर , ए.एन.एम. व आशा कार्मिको द्वारा माह{' '}
                <span id="doc-certify-maah">फरवरी 2026</span>{' '}
                में मूल्यांकन सूचकों के अनुसार कार्य संपादित किया गया है एवं इससे सम्बन्धित रिकॉर्ड सुरक्षित रख लिया गया है। अतः संबंधित को निर्धारित मासिक दर से पी.एल.पी. का भुगतान किए जाने की अनुशंसा की जाती है।
              </div>

              {/* Signature */}
              <div className="doc-sig">
                <div className="sig-block">
                  <div className="sig-line-area" />
                  <div className="sig-text">
                    हस्ताक्षर प्रभारी अधिकारी<br />
                    AHWC - <span id="doc-sig-ahwc">______________</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Screen-only footer */}
        <div className="screen-footer no-print">
          Made By Peeyush Singh, Assistant Accounts Officer II
        </div>
      </div>

      {/* ========== STAFF ATTENDANCE PANEL ========== */}
      <div id="staff-att-panel" className="outer-wrap att-outer-wrap" style={{ display: 'none' }}>
        <button
          className="back-btn no-print"
          onClick={() => { if (typeof window !== 'undefined') (window as any).showHomeScreen?.(); }}
        >
          ← Back to Home
        </button>

        <div className="form-panel att-form-panel no-print">
          <div className="form-panel-header">
            <span>👥</span>
            <span>Staff Attendance — डेटा दर्ज करें</span>
          </div>

          <div className="form-inner">
            <div className="err-box" id="att-err-box" style={{ display: 'none' }} />
            <div className="field-grid">
              <div className="field-group">
                <label>कार्यालय राजकीय</label>
                <input type="text" id="att-office-name" placeholder="कार्यालय का पूरा नाम टाइप करें" />
              </div>
              <div className="field-group">
                <label>क्रमांक - उपस्थिति /</label>
                <input type="text" id="att-kramank" placeholder="क्रमांक" />
              </div>
              <div className="field-group" style={{ gridColumn: '1 / -1' }}>
                <label>दिनांक</label>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <input type="date" id="att-date" style={{ maxWidth: '200px' }} />
                </div>
              </div>
              <div className="field-group" style={{ gridColumn: '1 / -1' }}>
                <label>उपस्थिति अवधि</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input type="date" id="att-period-from" /> …से… <input type="date" id="att-period-to" /> …तक
                </div>
              </div>
            </div>

            <div className="tbl-scroll att-tbl-scroll">
              <table className="inp-table att-inp-table">
                <thead>
                  <tr id="att-tbl-head" />
                </thead>
                <tbody id="att-tbody" />
              </table>
            </div>

            <button className="add-row-btn ripple" id="att-add-row-btn">+ कार्मिक जोड़ें</button>

            <div className="field-group" style={{ marginBottom: '16px' }}>
              <label>नोट</label>
              <textarea id="att-note" rows={3} placeholder="कोई विशेष टिप्पणी हो तो यहाँ लिखें..." />
            </div>

            <div className="gen-btn-row att-btn-row">
              <button className="btn-premium btn-neutral ripple" id="att-btn-preview">👁️ Preview</button>
              <button className="btn-premium btn-primary ripple" id="att-btn-print">🖨️ Print</button>
              <button className="btn-premium btn-accent ripple" id="att-btn-pdf">💾 Save PDF</button>
            </div>
          </div>
        </div>

        <div className="preview-wrap att-preview-wrap">
          <div className="preview-label no-print">📄 दस्तावेज़ प्रीव्यू (A4)</div>
          <div className="a4-scaler att-a4-scaler">
            <div id="att-doc-page" className="att-doc-page doc-page">
              <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px' }}>आयुर्वेद विभाग</div>
              <div style={{ textAlign: 'center', marginBottom: '12px', fontSize: '0.9rem' }}>
                कार्यालय राजकीय <span id="att-doc-office" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>क्रमांक - उपस्थिति / <span id="att-doc-kramank" /></div>
                <div>दिनांक <span id="att-doc-date" /></div>
              </div>

              <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.3rem', margin: '20px 0' }}>उपस्थिति पत्रक</div>

              <div style={{ marginBottom: '8px' }}>
                उपस्थिति अवधि <span id="att-doc-period-from" /> से <span id="att-doc-period-to" /> तक
              </div>

              <div className="att-tbl-scroll doc-tbl-scroll">
                <table className="doc-tbl att-doc-tbl">
                  <thead>
                    <tr id="att-doc-tbl-head" />
                  </thead>
                  <tbody id="att-doc-tbody" />
                </table>
              </div>

              <div id="att-doc-note-sec" style={{ marginTop: '10px', display: 'none' }}>
                <strong>नोट :</strong> <span id="att-doc-note-text" />
              </div>

              <div className="doc-certify" style={{ marginTop: '20px', fontWeight: 'bold', textAlign: 'center', border: 'none', background: 'transparent' }}>
                प्रमाणित किया जाता है कि उपस्थिति पत्रक का मिलान उपस्थिति पंजिका से कर लिया गया है, साथ ही कोई भी कार्मिक बिना सक्षम स्तर से अवकाश स्वीकृत कराए उपस्थिति पत्रक में उल्लिखित अवधि के दौरान अनुपस्थित नहीं रहा है।
              </div>

              <div className="doc-sig" style={{ marginTop: '40px', textAlign: 'right' }}>
                <div className="sig-block" style={{ display: 'inline-block', textAlign: 'center' }}>
                  <div style={{ height: '40px' }} />
                  <div style={{ fontWeight: 'bold' }}>हस्ताक्षर प्रभारी</div>
                  <div id="att-doc-seal-office" style={{ marginTop: '4px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="screen-footer no-print">
          Made By Peeyush Singh, Assistant Accounts Officer II
        </div>
      </div>
    </>
  );
}
