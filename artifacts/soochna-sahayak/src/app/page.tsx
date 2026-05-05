import { BarChart3, Users, Heart, Volume2, Eye, Printer, Download, ArrowRight, ChevronLeft, Sparkles, Table, Sun, Moon, FileDown } from 'lucide-react';
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
          <button
            className="theme-toggle"
            onClick={() => {
              const html = document.documentElement;
              if ((window as any).toggleTheme) {
                (window as any).toggleTheme();
              } else {
                const isDark = html.getAttribute('data-theme') === 'dark';
                const newTheme = isDark ? 'light' : 'dark';
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
              }
              const sunEl = document.querySelector('.theme-icon-sun') as HTMLElement;
              const moonEl = document.querySelector('.theme-icon-moon') as HTMLElement;
              const isDarkNow = document.documentElement.getAttribute('data-theme') === 'dark';
              if (sunEl) sunEl.style.display = isDarkNow ? 'none' : 'block';
              if (moonEl) moonEl.style.display = isDarkNow ? 'block' : 'none';
            }}
            aria-label="Toggle dark mode"
            id="theme-toggle-btn"
          >
            <Sun size={16} className="theme-icon-sun" />
            <Moon size={16} className="theme-icon-moon" style={{ display: 'none' }} />
          </button>
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
              योग शिक्षक उपस्थिति पत्रक एवं भुगतान रिपोर्ट
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
        <button
          className="back-btn no-print"
          onClick={() => { (window as any).showHomeScreen?.(); }}
        >
          <ChevronLeft size={16} strokeWidth={2} /> होम
        </button>

        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 w-full">
          {/* Form Panel */}
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

              <div className="flex flex-wrap gap-3 pt-4 bg-[var(--bg-surface)] md:bg-transparent p-4 md:p-0 border-t border-[var(--border)] md:border-none z-20 mt-4 btn-row no-print">
                <button className="btn btn-ghost" id="btn-plp-preview">
                  <Eye size={16} /> Preview
                </button>
                <button className="btn btn-secondary" id="btn-plp-print">
                  <Printer size={16} /> Print
                </button>
                <button className="btn btn-primary" id="btn-pdf">
                  <FileDown size={16} /> Save PDF
                </button>
                <button className="btn btn-secondary" id="btn-excel">
                  <Table size={16} /> Export Excel
                </button>
              </div>
            </div>
          </div>

          {/* Document Preview */}
          <div className="flex-1 xl:max-w-[400px] 2xl:max-w-[500px]">
            <div className="text-[var(--text-secondary)] font-medium text-sm mb-4 flex items-center gap-2 no-print">📄 दस्तावेज़ प्रीव्यू (A4)</div>
            <div className="a4-scaler bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl overflow-hidden p-6 shadow-[var(--shadow-card-rest)]">
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

        <div className="text-center text-[13px] text-[var(--text-muted)] mt-12 mb-6 no-print">
          Made By Peeyush Singh, Assistant Accounts Officer II
        </div>
      </div>

      {/* ========== STAFF ATTENDANCE PANEL ========== */}
      <div id="staff-att-panel" className="page inner-page-wrap flex flex-col px-4 sm:px-6 py-6 sm:py-10 md:px-10 max-w-[1300px] mx-auto w-full gap-0 min-h-screen safe-bottom-mobile" style={{ display: 'none' }}>

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8 no-print flex-wrap gap-3">
          <button
            className="back-btn"
            onClick={() => { (window as any).showHomeScreen?.(); }}
          >
            <ChevronLeft size={16} strokeWidth={2} /> होम
          </button>
          <div className="flex items-center gap-3">
            <div className="progress-pill" id="att-progress-pill">
              <span>0 कार्मिक</span>
              <span className="progress-pill-dot">·</span>
              <span>0 दिन</span>
              <span className="progress-pill-dot">·</span>
              <span>अवधि: —–—</span>
            </div>
          </div>
        </div>

        {/* Panel Title */}
        <div className="att-panel-header no-print mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center shadow-md shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-[24px] sm:text-[28px] font-semibold text-[var(--text-primary)] leading-tight">
                कार्मिक उपस्थिति पत्रक
              </h2>
              <p className="text-[var(--text-muted)] text-[14px] mt-1">Staff Attendance Sheet — A4 Landscape PDF</p>
            </div>
          </div>
        </div>

        {/* Error Box */}
        <div className="err-box bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm mb-6 no-print" id="att-err-box" style={{ display: 'none' }} />

        {/* ── STEP 1: Header Information ── */}
        <div className="att-step-card no-print">
          <div className="att-step-label">
            <span className="att-step-num">1</span>
            <span>हेडर जानकारी</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2 flex flex-col gap-2">
              <label className="att-field-label">
                <span className="att-field-icon">🏛️</span>
                कार्यालय राजकीय <span className="text-red-500">*</span>
              </label>
              <input
                className="form-input-base"
                type="text"
                id="att-office-name"
                placeholder="जैसे: कार्यालय मुख्य चिकित्सा एवं स्वास्थ्य अधिकारी"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="att-field-label">
                <span className="att-field-icon">🗓️</span>
                दिनांक
              </label>
              <input className="form-input-base" type="date" id="att-date" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="att-field-label">
                <span className="att-field-icon">#</span>
                क्रमांक <span className="text-[var(--text-muted)] font-normal text-[11px] normal-case">(वैकल्पिक)</span>
              </label>
              <input className="form-input-base" type="text" id="att-kramank" placeholder="जैसे: 123/2025" />
            </div>
          </div>

          {/* Period selector — most important field, gets its own prominent row */}
          <div className="att-period-row">
            <div className="att-period-label">
              <span className="att-field-icon">📅</span>
              उपस्थिति अवधि <span className="text-red-500">*</span>
              <span className="att-period-hint">दोनों तिथियाँ चुनने पर तालिका स्वतः तैयार होगी</span>
            </div>
            <div className="att-period-inputs">
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-[11px] text-[var(--text-muted)] font-medium uppercase tracking-wider">से (From)</span>
                <input className="form-input-base" type="date" id="att-period-from" />
              </div>
              <div className="att-period-arrow">→</div>
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-[11px] text-[var(--text-muted)] font-medium uppercase tracking-wider">तक (To)</span>
                <input className="form-input-base" type="date" id="att-period-to" />
              </div>
            </div>
          </div>
        </div>

        {/* ── STEP 2: Staff Attendance Table ── */}
        <div className="att-step-card no-print">
          <div className="att-step-label">
            <span className="att-step-num">2</span>
            <span>कार्मिक एवं उपस्थिति विवरण</span>
          </div>

          {/* Legend */}
          <div className="att-legend">
            <span className="att-legend-title">स्थिति संकेत:</span>
            <span className="att-legend-item att-status-present">उपस्थित</span>
            <span className="att-legend-item att-status-absent">अनुपस्थित</span>
            <span className="att-legend-item att-status-cl">आकस्मिक अवकाश</span>
            <span className="att-legend-item att-status-dayoff">Day Off</span>
          </div>

          {/* Scroll hint + Table */}
          <div className="att-table-outer">
            <div className="att-scroll-hint-wrap">
              <div className="overflow-x-auto att-table-scroll" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
                <table className="w-full text-left border-collapse att-data-table" style={{ minWidth: '600px' }}>
                  <thead>
                    <tr id="att-tbl-head" className="bg-[var(--bg-elevated)] text-[var(--text-secondary)] text-[11px] uppercase tracking-[0.04em] [&>th]:p-3 [&>th]:border-b [&>th]:border-[var(--border)] [&>th]:whitespace-nowrap" />
                  </thead>
                  <tbody id="att-tbody" className="[&>tr:nth-child(even)]:bg-[var(--bg-elevated)] [&>tr:nth-child(odd)]:bg-[var(--bg-surface)] [&>tr>td]:border-b [&>tr>td]:border-[var(--border)] [&>tr>td]:align-middle" />
                </table>
              </div>
              <div className="att-scroll-fade" aria-hidden="true" />
            </div>
            <div className="att-scroll-tip no-print">
              <span>← बायें-दायें स्क्रॉल करें</span>
            </div>
          </div>

          <button className="add-row-btn" id="att-add-row-btn">+ कार्मिक जोड़ें</button>

          <div className="flex flex-col gap-2 mt-5">
            <label className="att-field-label">
              <span className="att-field-icon">📝</span>
              नोट / टिप्पणी <span className="text-[var(--text-muted)] font-normal text-[11px] normal-case">(वैकल्पिक)</span>
            </label>
            <textarea
              className="form-input-base field-textarea"
              id="att-note"
              rows={3}
              placeholder="कोई विशेष टिप्पणी हो तो यहाँ लिखें..."
            />
          </div>
        </div>

        {/* ── STEP 3: Review & Export ── */}
        <div className="att-step-card no-print">
          <div className="att-step-label">
            <span className="att-step-num">3</span>
            <span>समीक्षा एवं निर्यात</span>
          </div>

          {/* Preview section */}
          <div className="mb-6">
            <div className="att-preview-toggle-bar">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-[var(--text-secondary)]">📄 दस्तावेज़ प्रीव्यू</span>
                <span className="badge badge-secondary text-[10px]">A4 Landscape</span>
              </div>
              <button
                className="att-preview-toggle-btn"
                onClick={(e) => {
                  const wrap = (e.currentTarget as HTMLElement).closest('.att-step-card')?.querySelector('.att-preview-body') as HTMLElement;
                  if (wrap) {
                    const isOpen = wrap.style.display !== 'none';
                    wrap.style.display = isOpen ? 'none' : 'block';
                    (e.currentTarget as HTMLElement).textContent = isOpen ? '▼ दिखाएँ' : '▲ छुपाएँ';
                  }
                }}
              >
                ▼ दिखाएँ
              </button>
            </div>

            <div className="att-preview-body" style={{ display: 'none' }}>
              <div className="att-preview-scaler">
                <div id="att-doc-page" className="att-doc-page doc-page">
                  <div style={{
                    textAlign: 'center', fontWeight: 700, fontSize: '10pt',
                    padding: '4px 8px', borderBottom: '2px solid #000', marginBottom: '2px',
                    fontFamily: "'Noto Sans Devanagari', serif", letterSpacing: '0.01em'
                  }}>
                    <div id="att-doc-office" style={{ marginBottom: '1px' }}>कार्यालय राजकीय</div>
                    <div style={{ fontSize: '8pt', fontWeight: 500 }}>कार्मिक उपस्थिति पत्रक</div>
                  </div>
                  <div style={{
                    border: '1.5px solid #000', padding: '4px 8px',
                    fontWeight: 700, fontSize: '9pt', marginBottom: 0,
                    background: '#f8f8f8', fontFamily: "'Noto Sans Devanagari', serif"
                  }}>
                    अवधि - <span id="att-doc-period-from" /> से <span id="att-doc-period-to" /> तक
                  </div>

                  <table id="att-doc-table" style={{
                    width: '100%', borderCollapse: 'collapse',
                    tableLayout: 'fixed', fontFamily: "'Noto Sans Devanagari', serif"
                  }}>
                    <thead id="att-doc-tbl-head" />
                    <tbody id="att-doc-tbody" />
                  </table>

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
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="att-action-bar">
            <div className="att-action-hint">तैयार हो जाने पर PDF/Excel में सहेजें</div>
            <div className="flex flex-wrap gap-3">
              <button className="btn btn-ghost" id="att-btn-preview">
                <Eye size={16} /> Preview
              </button>
              <button className="btn btn-secondary" id="att-btn-print">
                <Printer size={16} /> Print
              </button>
              <button className="btn btn-excel" id="att-btn-excel">
                <Table size={16} /> Excel
              </button>
              <button className="btn btn-primary" id="att-btn-pdf">
                <Download size={16} /> PDF सहेजें
              </button>
            </div>
          </div>
        </div>

        {/* ========== YOGA INSTRUCTOR PANEL ========== */}
        <div
          id="yog-panel"
          className="page inner-page-wrap flex flex-col px-4 sm:px-6 py-8 sm:py-12 md:px-12 max-w-[1400px] mx-auto w-full gap-8 min-h-screen safe-bottom-mobile"
          style={{ display: 'none' }}
        >
          {/* Back Button */}
          <button
            className="back-btn no-print"
            onClick={() => { (window as any).showHomeScreen?.(); }}
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
                    <select
                      className="form-input-base"
                      id="yog-month"
                      style={{ maxWidth: '280px' }}
                    />
                  </div>

                </div>

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
                    <tbody
                      id="yog-tbody"
                      className="[&>tr:nth-child(even)]:bg-[var(--bg-elevated)] [&>tr:nth-child(odd)]:bg-[var(--bg-surface)] [&>tr>td]:p-2 [&>tr>td]:border-b [&>tr>td]:border-[var(--border)] [&>tr>td]:text-center"
                    />
                  </table>
                </div>

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
            </div>

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
                  <div style={{ textAlign: 'center', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 700, fontSize: '9pt' }}>
                      आयुर्वेद विभाग राजस्थान सरकार
                    </div>
                    <div style={{ fontSize: '8pt', marginTop: '2px' }}>
                      कार्यालय आयुष्मान आरोग्य मंदिर राजकीय{' '}
                      <span id="yog-doc-center" style={{ fontWeight: 700 }}>____________________</span>
                    </div>
                  </div>

                  {/* Doc: Kramank & Date row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5pt', marginBottom: '4px' }}>
                    <span>क्रमांक: <span id="yog-doc-kramank">______</span></span>
                    <span>दिनांक: <span id="yog-doc-date">______</span></span>
                  </div>

                  {/* Doc: Title */}
                  <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '9pt', margin: '6px 0', textDecoration: 'underline' }}>
                    योग शिक्षक उपस्थिति पत्रक माह{' '}
                    <span id="yog-doc-month">______</span>
                  </div>

                  {/* Doc: Table */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '7pt', marginTop: '4px' }}>
                    <thead>
                      <tr style={{ background: '#f5f0e8' }}>
                        <th style={{ border: '1px solid #000', padding: '2px 3px', textAlign: 'center' }}>क्र.</th>
                        <th style={{ border: '1px solid #000', padding: '2px 3px' }}>नाम</th>
                        <th style={{ border: '1px solid #000', padding: '2px 3px', textAlign: 'center' }}>पद</th>
                        <th style={{ border: '1px solid #000', padding: '2px 3px', textAlign: 'center' }}>दिवस</th>
                        <th style={{ border: '1px solid #000', padding: '2px 3px', textAlign: 'center' }}>योग घंटे</th>
                        <th style={{ border: '1px solid #000', padding: '2px 3px', textAlign: 'center' }}>IEC घंटे</th>
                        <th style={{ border: '1px solid #000', padding: '2px 3px', textAlign: 'center' }}>कुल घंटे</th>
                        <th style={{ border: '1px solid #000', padding: '2px 3px', textAlign: 'center' }}>दर/घंटे</th>
                        <th style={{ border: '1px solid #000', padding: '2px 3px', textAlign: 'center' }}>भुगतान</th>
                      </tr>
                    </thead>
                    <tbody id="yog-doc-tbody" />
                  </table>

                  {/* Doc: Certificate */}
                  <div style={{ marginTop: '8px', fontSize: '7pt', lineHeight: 1.6 }}>
                    प्रमाणित किया जाता है कि उपर्युक्त टेबल के कॉलम संख्या 4 में उल्लेखित दिवसों में
                    योग शिक्षक द्वारा प्रतिदिन एक घंटे से अधिक कार्य सम्पादित किया गया।
                  </div>

                  {/* Doc: Seal */}
                  <div style={{ marginTop: '20px', textAlign: 'right', fontSize: '7.5pt' }}>
                    <div style={{ fontWeight: 700 }}>हस्ताक्षर प्रभारी</div>
                    <div id="yog-doc-seal" style={{ fontSize: '7pt', marginTop: '2px' }} />
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
