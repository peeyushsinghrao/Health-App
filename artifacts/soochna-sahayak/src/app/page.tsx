import { BarChart3, Users, Heart, Volume2, Eye, Printer, Download, ArrowRight, ChevronLeft, Sparkles, Table, FileDown } from 'lucide-react';
import '../web-portal.css';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-body antialiased relative overflow-x-hidden selection:bg-[var(--accent-primary)] selection:text-[var(--bg-base)]">

      {/* ========== LOADING OVERLAY ========== */}
      <div className="loading-overlay" id="overlay">
        <div className="loading-dots">
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
        </div>
        <div className="loading-text">PDF तैयार हो रही है...</div>
      </div>

      {/* ========== SOUND TOGGLE ========== */}
      <button
        id="sound-toggle"
        className="fixed bottom-6 right-6 p-3 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:shadow-[var(--shadow-green)] transition-all duration-300 z-50 no-print btn"
        onClick={() => { (window as any).toggleSound?.(); }}
        aria-label="Toggle sound effects"
        title="Sound Effects"
      >
        <span id="sound-icon"><Volume2 size={20} strokeWidth={2} /></span>
      </button>

      {/* ========== NAVBAR ========== */}
      <nav className="nav-bar">
        <div className="flex items-center gap-3">
          <span className="nav-brand-dot"></span>
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-display text-lg font-semibold text-[var(--text-primary)]">
              Soochna <span className="text-[var(--accent-primary)]">Sahayak</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge badge-primary hidden sm:inline-flex">
            Ayurveda Dept
          </span>
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
        </div>
      </nav>

      {/* ========== HOME SCREEN ========== */}
      <div id="home-screen" className="flex flex-col min-h-screen max-w-[1200px] mx-auto w-full relative z-10" style={{ display: 'flex' }}>

        {/* HERO SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start pt-16 pb-12 px-4 sm:px-8 lg:px-16 relative gap-8">
          <div className="flex flex-col w-full lg:max-w-[60%]">
            <div className="hero-eyebrow animate-rise-up mb-6">
              Smart Office Assistant
            </div>
            <h1 className="hero-title animate-rise-up delay-100 mb-4">
              Soochna Sahayak
            </h1>
            <p className="font-display text-xl text-[var(--text-secondary)] italic mb-4 animate-rise-up delay-150">
              Streamlining administrative workflows
            </p>
            <div className="hero-rule mb-6"></div>
            <p className="text-[14px] sm:text-[15px] text-[var(--text-secondary)] max-w-xl leading-relaxed animate-rise-up delay-250">
              A premium government productivity tool for the Ayurveda Department — designed with the warmth of parchment and the precision of modern SaaS.
            </p>
          </div>
          <div className="hero-deco hidden lg:block">स</div>
        </div>

        {/* Stats Row */}
        <div className="stats-row animate-rise-up delay-300">
          <div className="stat-item">
            <span className="stat-dot"></span>
            <span className="stat-count">3</span>
            <span className="stat-label">Active Tools</span>
          </div>
          <div className="stat-item">
            <span className="stat-dot"></span>
            <span className="stat-count">A4</span>
            <span className="stat-label">PDF Export</span>
          </div>
        </div>

        {/* CARD GRID */}
        <div className="card-grid">
          {/* PLP Card */}
          <div
            className="home-card group card featured cursor-pointer"
            data-tooltip="Generate PLP Performance Report"
            onClick={() => { (window as any).showPanel?.('plp-panel'); }}
          >
            <div className="absolute top-6 right-6 badge badge-primary">सक्रिय</div>
            <div className="card-icon-wrap w-[46px] h-[46px] rounded-[10px] bg-[var(--accent-light)] flex items-center justify-center mb-6 text-[var(--accent-primary)]">
              <BarChart3 size={22} strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-[19px] font-semibold text-[var(--text-primary)] mb-2">PLP Report</h3>
            <p className="font-body text-[13px] text-[var(--text-muted)] leading-[1.65] mb-6">
              AHWC मासिक प्रदर्शन रिपोर्ट तैयार करें
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <span className="text-[11px] font-medium text-[var(--accent-primary)] uppercase tracking-wider">Generate Report</span>
              <ArrowRight size={18} className="card-arrow text-[var(--text-muted)]" />
            </div>
          </div>

          {/* Staff Attendance Card */}
          <div
            className="home-card group card cursor-pointer"
            data-tooltip="Staff Attendance Tracker"
            onClick={() => { (window as any).showPanel?.('staff-att-panel'); }}
          >
            <div className="absolute top-6 right-6 badge badge-primary">सक्रिय</div>
            <div className="card-icon-wrap w-[46px] h-[46px] rounded-[10px] bg-[var(--accent-light)] flex items-center justify-center mb-6 text-[var(--accent-primary)]">
              <Users size={22} strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-[19px] font-semibold text-[var(--text-primary)] mb-2">Staff Attendance</h3>
            <p className="font-body text-[13px] text-[var(--text-muted)] leading-[1.65] mb-6">
              कार्मिक उपस्थिति पत्रक तैयार करें
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <span className="text-[11px] font-medium text-[var(--accent-primary)] uppercase tracking-wider">Track Attendance</span>
              <ArrowRight size={18} className="card-arrow text-[var(--text-muted)]" />
            </div>
          </div>

          {/* Yoga Instructor Card - Active */}
          <div
            className="home-card group card cursor-pointer"
            data-tooltip="Yoga Instructor Payment Report"
            onClick={() => { (window as any).showPanel?.('yog-panel'); }}
          >
            <div className="absolute top-6 right-6 badge badge-primary">सक्रिय</div>
            <div className="card-icon-wrap w-[46px] h-[46px] rounded-[10px] bg-[var(--accent-light)] flex items-center justify-center mb-6 text-[var(--accent-primary)]">
              <Heart size={22} strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-[19px] font-semibold text-[var(--text-primary)] mb-2">Yoga Instructor</h3>
            <p className="font-body text-[13px] text-[var(--text-muted)] leading-[1.65] mb-6">
              योग प्रशिक्षक उपस्थिति पत्रक एवं भुगतान रिपोर्ट
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <span className="text-[11px] font-medium text-[var(--accent-primary)] uppercase tracking-wider">Generate Report</span>
              <ArrowRight size={18} className="card-arrow text-[var(--text-muted)]" />
            </div>
          </div>
        </div>

        {/* HISTORY SECTION */}
        <div id="history-section" className="history-section no-print" style={{ display: 'none' }} />

        {/* FOOTER */}
        <footer>
          <p className="footer-line1">Empowering Office Efficiency</p>
          <p className="footer-line2">An Initiative by Peeyush Singh Rao, Assistant Accounts Officer Grade II</p>
        </footer>
      </div>

      {/* ========== PLP PANEL ========== */}
      <div id="plp-panel" className="page inner-page-wrap flex flex-col px-4 sm:px-6 py-8 sm:py-12 md:px-12 max-w-[1400px] mx-auto w-full gap-8 min-h-screen safe-bottom-mobile" style={{ display: 'none' }}>

        {/* Top Bar — matches Staff Att style */}
        <div className="flex items-center justify-between mb-2 no-print flex-wrap gap-3">
          <button
            className="back-btn no-print"
            onClick={() => { (window as any).showHomeScreen?.(); }}
          >
            <ChevronLeft size={16} strokeWidth={2} /> होम
          </button>
        </div>

        {/* Form Panel — full width, no side preview */}
        <div className="form-panel flex-1 no-print">
          <div className="page-title-area">
            <h2 className="font-display text-[26px] font-semibold text-[var(--text-primary)] mb-1">AHWC मासिक प्रदर्शन PLP रिपोर्ट</h2>
            <p className="text-[var(--text-muted)] text-sm">डेटा दर्ज करें</p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="err-box bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm mb-4" id="err-box" style={{ display: 'none' }} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-[0.02em] uppercase">AHWC का नाम *</label>
                <input className="form-input-base" type="text" id="ahwc-name" placeholder="जैसे: AHWC खजूरी बाजार" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-[0.02em] uppercase">जिला *</label>
                <input className="form-input-base" type="text" id="jila" placeholder="जैसे: रायपुर" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-[0.02em] uppercase">माह</label>
                <select className="form-input-base" id="maah" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-[0.02em] uppercase">वर्ष</label>
                <select className="form-input-base" id="varsh" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold text-[15px] mt-4 mb-2">
              <BarChart3 size={18} className="text-[var(--accent-primary)]" /> तालिका 1 — लक्ष्य एवं प्राप्ति
            </div>
            <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
              <table className="w-full text-left min-w-[600px] border-collapse">
                <thead>
                  <tr className="bg-[var(--bg-elevated)] text-[var(--text-secondary)] text-[12px] uppercase tracking-[0.05em]">
                    <th className="p-3 border-b border-[var(--border)]" style={{ width: '40px' }}>क्र.</th>
                    <th className="p-3 border-b border-[var(--border)]" style={{ minWidth: '200px' }}>कार्य का नाम</th>
                    <th className="p-3 border-b border-[var(--border)]" style={{ width: '80px' }}>लक्ष्य</th>
                    <th className="p-3 border-b border-[var(--border)]" style={{ width: '80px' }}>प्राप्ति</th>
                    <th className="p-3 border-b border-[var(--border)]" style={{ width: '90px' }}>प्रतिशत</th>
                    <th className="p-3 border-b border-[var(--border)]" style={{ width: '80px' }}>राशि (₹)</th>
                  </tr>
                </thead>
                <tbody id="karya-tbody" className="[&>*:nth-child(even)]:bg-[var(--bg-elevated)] [&>*:nth-child(odd)]:bg-[var(--bg-surface)] [&>*:hover]:bg-[var(--accent-primary)]/5 transition-colors" />
                <tfoot id="karya-tfoot" className="bg-[var(--bg-elevated)] border-t border-[var(--border)] font-semibold" />
              </table>
            </div>

            <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold text-[15px] mt-6 mb-2">
              <Users size={18} className="text-[var(--accent-primary)]" /> तालिका 2 — कर्मचारी भुगतान विवरण
            </div>
            <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
              <table className="w-full text-left min-w-[800px] border-collapse">
                <thead>
                  <tr className="bg-[var(--bg-elevated)] text-[var(--text-secondary)] text-[12px] uppercase tracking-[0.05em]">
                    <th className="p-3 border-b border-[var(--border)]" style={{ width: '40px' }}>क्र.</th>
                    <th className="p-3 border-b border-[var(--border)]" style={{ minWidth: '130px' }}>नाम</th>
                    <th className="p-3 border-b border-[var(--border)]" style={{ width: '110px' }}>पद</th>
                    <th className="p-3 border-b border-[var(--border)]" style={{ minWidth: '130px' }}>बैंक खाता</th>
                    <th className="p-3 border-b border-[var(--border)]" style={{ minWidth: '110px' }}>बैंक नाम</th>
                    <th className="p-3 border-b border-[var(--border)]" style={{ width: '100px' }}>IFSC</th>
                    <th className="p-3 border-b border-[var(--border)]" style={{ width: '100px' }}>मोबाइल</th>
                    <th className="p-3 border-b border-[var(--border)]" style={{ width: '100px' }}>भुगतान (₹)</th>
                    <th className="p-3 border-b border-[var(--border)]" style={{ width: '40px' }}>—</th>
                  </tr>
                </thead>
                <tbody id="karma-tbody" className="[&>*:nth-child(even)]:bg-[var(--bg-elevated)] [&>*:nth-child(odd)]:bg-[var(--bg-surface)] [&>*:hover]:bg-[var(--accent-primary)]/5 transition-colors" />
                <tfoot id="karma-tfoot" className="bg-[var(--bg-elevated)] border-t border-[var(--border)] font-semibold" />
              </table>
            </div>

            <button className="add-row-btn" id="add-karma-btn">+ कर्मचारी जोड़ें</button>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 bg-[var(--bg-surface)] md:bg-transparent p-4 md:p-0 border-t border-[var(--border)] md:border-none z-20 mt-4 btn-row no-print">
              <button className="btn btn-secondary" id="btn-plp-print">
                <Printer size={16} /> Print
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  const body = document.querySelector('.plp-preview-body') as HTMLElement;
                  if (body) {
                    const isOpen = body.style.display !== 'none';
                    body.style.display = isOpen ? 'none' : 'block';
                    if (!isOpen) body.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                <Eye size={16} /> Preview
              </button>
              <button className="btn btn-primary" id="btn-pdf">
                <FileDown size={16} /> Save PDF
              </button>
              <button className="btn btn-secondary" id="btn-excel">
                <Table size={16} /> Export Excel
              </button>
            </div>

            {/* Collapsible Document Preview */}
            <div className="no-print mt-2">
              <div className="att-preview-toggle-bar">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-[var(--text-secondary)]">📄 दस्तावेज़ प्रीव्यू</span>
                  <span className="badge badge-secondary text-[10px]">A4 Portrait</span>
                </div>
              </div>

              <div className="plp-preview-body" style={{ display: 'none' }}>
                <div className="att-preview-scaler" style={{ marginTop: '12px' }}>
                  <div id="doc-page" className="doc-page">
                    <div className="doc-header">
                      <div className="doc-title-top">आयुष्मान आरोग्य मंदिर (AHWC)</div>
                      <div className="doc-title-main">मासिक प्रदर्शन आधारित प्रोत्साहन रिपोर्ट(PLP)</div>
                    </div>
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
                    <div className="doc-certify">
                      प्रमाणित किया जाता है कि उपर्युक्त सूची में अंकित AMO , नर्स- कंपाउंडर , ए.एन.एम. व आशा कार्मिको द्वारा माह{' '}
                      <span id="doc-certify-maah">फरवरी 2026</span>{' '}
                      में मूल्यांकन सूचकों के अनुसार कार्य संपादित किया गया है एवं इससे सम्बन्धित रिकॉर्ड सुरक्षित रख लिया गया है। अतः संबंधित को निर्धारित मासिक दर से पी.एल.पी. का भुगतान किए जाने की अनुशंसा की जाती है।
                    </div>
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
            </div>

          </div>
        </div>

        <div className="text-center text-[13px] text-[var(--text-muted)] mt-12 mb-6 no-print">
          Made By Peeyush Singh, Assistant Accounts Officer II
        </div>
      </div>

      {/* ========== STAFF ATTENDANCE PANEL (v4 — REBUILT) ========== */}
      <div id="staff-att-panel" className="page" style={{ display: 'none', flexDirection: 'column', minHeight: '100vh' }}>

        {/* ── Sticky top control bar ── */}
        <div className="no-print att4-topbar">
          <div className="att4-topbar-left">
            <button className="back-btn" onClick={() => { (window as any).showHomeScreen?.(); }}>
              <ChevronLeft size={16} strokeWidth={2} /> होम
            </button>
            <div>
              <div className="att4-topbar-heading">कार्मिक उपस्थिति पत्रक</div>
              <div className="att4-topbar-sub">Staff Attendance Sheet — A4 Landscape PDF</div>
            </div>
          </div>
          <div className="att4-topbar-actions">
            <button id="att-btn-preview" className="btn btn-secondary">
              <Eye size={15} /> Preview
            </button>
            <button id="att-btn-print" className="btn btn-secondary">
              <Printer size={15} /> Print
            </button>
            <button id="att-btn-pdf" className="btn btn-primary">
              <Download size={15} /> PDF सहेजें
            </button>
          </div>
        </div>

        {/* ── Form section ── */}
        <div className="no-print att4-form-wrap">

          {/* Office name — full row */}
          <div className="att4-field-group">
            <label className="att4-label">कार्यालय राजकीय <span className="att4-req">*</span></label>
            <input id="att-office" className="att4-input" type="text" placeholder="जैसे: राजकीय आयुर्वेद चिकित्सालय, जयपुर" />
          </div>

          {/* 3-col: Kramank | Code No | Date */}
          <div className="att4-form-row3">
            <div className="att4-field-group">
              <label className="att4-label">क्रमांक - उपस्थिति /</label>
              <input id="att-kramank" className="att4-input" type="text" placeholder="जैसे: 123/2026" />
            </div>
            <div className="att4-field-group">
              <label className="att4-label">CODE No.</label>
              <input id="att-codeno" className="att4-input" type="number" placeholder="जैसे: 4521" inputMode="numeric" />
            </div>
            <div className="att4-field-group">
              <label className="att4-label">दिनांक</label>
              <input id="att-date" className="att4-input" type="date" />
            </div>
          </div>

          {/* Period */}
          <div className="att4-field-group">
            <label className="att4-label">
              उपस्थिति अवधि <span className="att4-req">*</span>
              <span className="att4-label-hint">(अधिकतम 31 दिन — चुनते ही तालिका बनेगी)</span>
            </label>
            <div className="att4-period-row">
              <input id="att-from" className="att4-input att4-input-date" type="date" />
              <span className="att4-period-sep">से</span>
              <input id="att-to" className="att4-input att4-input-date" type="date" />
              <span className="att4-period-sep">तक</span>
            </div>
          </div>

          {/* Note */}
          <div className="att4-field-group">
            <label className="att4-label">नोट / विशेष टिप्पणी</label>
            <textarea id="att-note" className="att4-input att4-textarea" rows={2} placeholder="विशेष टिप्पणी यहाँ लिखें..." />
          </div>

          {/* Add row */}
          <div>
            <button id="att-add-row" className="add-row-btn">+ कार्मिक जोड़ें</button>
          </div>
        </div>

        {/* ── A4 Landscape document area ── */}
        <div className="att4-doc-area">
          <div id="att-doc" className="att4-doc-page">
            {/* Rendered dynamically by web-portal.js */}
          </div>
        </div>

      </div>{/* ← closes staff-att-panel */}

      {/* ========== YOGA INSTRUCTOR PANEL ========== */}
      <div
        id="yog-panel"
        className="page inner-page-wrap flex flex-col px-4 sm:px-6 py-8 sm:py-12 md:px-12 max-w-[1400px] mx-auto w-full gap-8 min-h-screen safe-bottom-mobile"
        style={{ display: 'none' }}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-2 no-print flex-wrap gap-3">
          <button
            className="back-btn no-print"
            onClick={() => { (window as any).showHomeScreen?.(); }}
          >
            <ChevronLeft size={16} strokeWidth={2} /> होम
          </button>
        </div>

        {/* Form Panel — full width */}
        <div className="form-panel flex-1 no-print">
          <div className="page-title-area">
            <h2 className="font-display text-[26px] font-semibold text-[var(--text-primary)] mb-1">
              योग प्रशिक्षक उपस्थिति पत्रक
            </h2>
            <p className="text-[var(--text-muted)] text-sm">डेटा दर्ज करें</p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="err-box bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm mb-4" id="yog-err-box" style={{ display: 'none' }} />

            {/* Header fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-[0.02em] uppercase">
                  केंद्र का नाम <span className="text-[var(--text-muted)] font-normal normal-case text-[11px]">(कार्यालय आयुष्मान आरोग्य मंदिर राजकीय)</span>
                </label>
                <input className="form-input-base" type="text" id="yog-center-name" placeholder="केंद्र का पूरा नाम दर्ज करें" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-[0.02em] uppercase">
                  क्रमांक <span className="text-[var(--text-muted)] font-normal normal-case text-[11px]">(वैकल्पिक)</span>
                </label>
                <input className="form-input-base" type="text" id="yog-kramank" placeholder="क्रमांक" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-[0.02em] uppercase">दिनांक</label>
                <input className="form-input-base" type="date" id="yog-date" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-[0.02em] uppercase">माह</label>
                <select className="form-input-base" id="yog-month" style={{ maxWidth: '280px' }} />
              </div>
            </div>

            {/* Instructor Table — 9 columns matching PDF */}
            <div className="overflow-x-auto rounded-xl border border-[var(--border)] mt-2">
              <table className="w-full text-left border-collapse" style={{ minWidth: '980px' }}>
                <thead>
                  <tr className="bg-[var(--bg-elevated)] text-[var(--text-secondary)] text-[11px] font-bold [&>th]:py-1 [&>th]:px-2 [&>th]:border [&>th]:border-[var(--border)] [&>th]:text-center">
                    <th style={{ width: '32px' }}>1</th>
                    <th style={{ minWidth: '130px' }}>2</th>
                    <th style={{ width: '110px' }}>3</th>
                    <th style={{ width: '80px' }}>4</th>
                    <th style={{ width: '90px' }}>5</th>
                    <th style={{ width: '85px' }}>6</th>
                    <th style={{ width: '80px' }}>7</th>
                    <th style={{ width: '80px' }}>8</th>
                    <th style={{ width: '90px' }}>9</th>
                    <th style={{ width: '32px' }} className="no-print">—</th>
                  </tr>
                  <tr className="bg-[var(--bg-elevated)] text-[var(--text-secondary)] text-[10px] [&>th]:p-2 [&>th]:border [&>th]:border-[var(--border)] [&>th]:text-center [&>th]:leading-snug">
                    <th style={{ width: '32px' }}>क्र.सं.</th>
                    <th style={{ minWidth: '130px', textAlign: 'left' }}>नाम योग प्रशिक्षक</th>
                    <th style={{ width: '110px' }}>महिला / पुरुष</th>
                    <th style={{ width: '80px' }}>दिवस संख्या<br/><span className="font-normal text-[9px]">(स्वतः)</span></th>
                    <th style={{ width: '90px' }}>जन सामान्य योग घंटे</th>
                    <th style={{ width: '85px' }}>IEC कार्यक्रम घंटे<br/><span className="font-normal text-[9px]">(पुरुष: max 2)</span></th>
                    <th style={{ width: '80px' }}>कुल घंटे</th>
                    <th style={{ width: '80px' }}>दर ₹250/-</th>
                    <th style={{ width: '90px' }}>कुल भुगतान राशि (₹)</th>
                    <th style={{ width: '32px' }} className="no-print">—</th>
                  </tr>
                </thead>
                <tbody
                  id="yog-tbody"
                  className="[&>tr:nth-child(even)]:bg-[var(--bg-elevated)] [&>tr:nth-child(odd)]:bg-[var(--bg-surface)] [&>tr>td]:p-2 [&>tr>td]:border-b [&>tr>td]:border-[var(--border)] [&>tr>td]:text-center"
                />
              </table>
            </div>

            <button className="add-row-btn" id="yog-add-row-btn">+ योग प्रशिक्षक जोड़ें</button>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 bg-[var(--bg-surface)] md:bg-transparent p-4 md:p-0 border-t border-[var(--border)] md:border-none z-20 mt-4 btn-row no-print">
              <button className="btn btn-secondary" id="yog-btn-print">
                <Printer size={16} /> Print
              </button>
              <button className="btn btn-secondary" id="yog-btn-preview">
                <Eye size={16} /> Preview
              </button>
              <button className="btn btn-excel" id="yog-btn-excel">
                <Table size={16} /> Excel
              </button>
              <button className="btn btn-primary" id="yog-btn-pdf">
                <Download size={16} /> Save PDF
              </button>
            </div>

            {/* Collapsible Document Preview */}
            <div className="no-print mt-2">
              <div className="att-preview-toggle-bar">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-[var(--text-secondary)]">📄 दस्तावेज़ प्रीव्यू</span>
                  <span className="badge badge-secondary text-[10px]">A4 Portrait</span>
                </div>
              </div>

              <div className="yog-preview-body" style={{ display: 'none' }}>
                <div className="att-preview-scaler" style={{ marginTop: '12px' }}>

                  {/* ── YOGA DOC PAGE ── */}
                  <div id="yog-doc-page" className="doc-page" style={{ fontFamily: "'Noto Sans Devanagari', serif", fontSize: '8pt' }}>

                    {/* Line 1: Dept name */}
                    <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '11pt', letterSpacing: '0.03em', marginBottom: '2px' }}>
                      आयुर्वेद विभाग राजस्थान सरकार
                    </div>
                    {/* Line 2: Office name */}
                    <div style={{ textAlign: 'center', fontSize: '8.5pt', marginBottom: '5px', borderBottom: '1px solid #000', paddingBottom: '4px' }}>
                      कार्यालय — आयुष्मान आरोग्य मंदिर राजकीय{' '}
                      <span id="yog-doc-center" style={{ fontWeight: 700 }}>____________________</span>
                    </div>
                    {/* Line 3: Kramank & Date */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8pt', marginBottom: '5px' }}>
                      <span>क्रमांक: <span id="yog-doc-kramank">__________</span></span>
                      <span>दिनांक: <span id="yog-doc-date">__________</span></span>
                    </div>
                    {/* Line 4: Form title with मानदेय */}
                    <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '10pt', margin: '5px 0 2px', textDecoration: 'underline', letterSpacing: '0.03em' }}>
                      योग प्रशिक्षक मानदेय उपस्थिति पत्रक
                    </div>
                    {/* Line 5: Month */}
                    <div style={{ textAlign: 'center', fontSize: '8.5pt', marginBottom: '8px' }}>
                      माह — <span id="yog-doc-month" style={{ fontWeight: 600 }}>__________</span>
                    </div>

                    {/* Table — fixed layout, locked column widths per PLAN sec 8.3 */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', fontSize: '6.5pt', marginTop: '4px' }}>
                      <colgroup>
                        <col style={{ width: '5%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '12%' }} />
                        <col style={{ width: '8%' }} />
                        <col style={{ width: '12%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '8%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '15%' }} />
                      </colgroup>
                      <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                          {[1,2,3,4,5,6,7,8,9].map(n => (
                            <th key={n} style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', fontWeight: 700, fontSize: '7pt' }}>{n}</th>
                          ))}
                        </tr>
                        <tr style={{ background: '#f0f0f0' }}>
                          <th style={{ border: '1px solid #000', padding: '3px 2px', textAlign: 'center', fontSize: '6.5pt' }}>क्र.सं.</th>
                          <th style={{ border: '1px solid #000', padding: '3px 2px', textAlign: 'center', fontSize: '6.5pt' }}>नाम योग प्रशिक्षक</th>
                          <th style={{ border: '1px solid #000', padding: '3px 2px', textAlign: 'center', fontSize: '6.5pt' }}>महिला / पुरुष</th>
                          <th style={{ border: '1px solid #000', padding: '3px 2px', textAlign: 'center', fontSize: '6.5pt' }}>दिवस संख्या</th>
                          <th style={{ border: '1px solid #000', padding: '3px 2px', textAlign: 'center', fontSize: '6.5pt' }}>जन सामान्य योग घंटे</th>
                          <th style={{ border: '1px solid #000', padding: '3px 2px', textAlign: 'center', fontSize: '6.5pt' }}>IEC कार्यक्रम घंटे</th>
                          <th style={{ border: '1px solid #000', padding: '3px 2px', textAlign: 'center', fontSize: '6.5pt' }}>कुल घंटे</th>
                          <th style={{ border: '1px solid #000', padding: '3px 2px', textAlign: 'center', fontSize: '6.5pt' }}>दर ₹250/-</th>
                          <th style={{ border: '1px solid #000', padding: '3px 2px', textAlign: 'center', fontSize: '6.5pt' }}>कुल भुगतान राशि (₹)</th>
                        </tr>
                      </thead>
                      <tbody id="yog-doc-tbody" />
                    </table>

                    {/* Certification — exact official text */}
                    <div style={{ marginTop: '10px', fontSize: '7pt', lineHeight: 1.7, textAlign: 'justify' }}>
                      प्रमाणित किया जाता है कि उपर्युक्त टेबल में उल्लेखित दिवसों में योग प्रशिक्षक द्वारा प्रतिदिन एक घंटे से अधिक कार्य संपादित किया गया एवं उनके कार्य से संतुष्ट हूँ। कॉलम संख्या 9 में अंकित राशि के भुगतान की अनुशंसा की जाती है।
                    </div>

                    {/* Signature — right-aligned */}
                    <div style={{ marginTop: '28px', textAlign: 'right', fontSize: '7.5pt' }}>
                      <div style={{ display: 'inline-block', textAlign: 'center', minWidth: '160px' }}>
                        <div style={{ height: '40px', borderBottom: '1.5px solid #000', marginBottom: '4px' }} />
                        <div style={{ fontWeight: 700 }}>हस्ताक्षर प्रभारी अधिकारी</div>
                        <div id="yog-doc-seal" style={{ fontSize: '7pt', marginTop: '2px', fontStyle: 'italic' }} />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="text-center text-[12px] text-[var(--text-muted)] mt-4 mb-6 no-print">
          Made By Peeyush Singh, Assistant Accounts Officer II
        </div>
      </div>
    </div>
  );
}
