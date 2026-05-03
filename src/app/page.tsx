'use client';

import Script from 'next/script';
import { BarChart3, Users, Heart, Volume2, FileDown, Eye, Printer, Download, ArrowRight, ChevronLeft, Sparkles, FileText, Calendar, Table, Sun, Moon } from 'lucide-react';
import './web-portal.css';

/* ═══════════════════════════════════════════════════════════════
   Soochna Sahayak — Smart Office Assistant
   Premium Government SaaS UI Redesign
   ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-body antialiased relative overflow-x-hidden selection:bg-[var(--accent-primary)] selection:text-[var(--bg-base)]">
      
      {/* html2pdf.js CDN */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        strategy="beforeInteractive"
      />
      {/* SheetJS for Excel Export */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"
        strategy="beforeInteractive"
      />
      {/* Web Portal Logic */}
      <Script src="/web-portal.js" strategy="afterInteractive" />

      {/* Expose web-portal functions to window for React onClick handlers */}
      <Script id="expose-functions" strategy="lazyOnload" dangerouslySetInnerHTML={{ __html: `
(function(){
  // Expose functions from web-portal.js to window object
  if(typeof showPanel === 'function') window.showPanel = showPanel;
  if(typeof showHomeScreen === 'function') window.showHomeScreen = showHomeScreen;
  if(typeof toggleSound === 'function') window.toggleSound = toggleSound;
})();
` }} />

      {/* Animation Init — scroll reveal + parallax */}
      <Script id="anim-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var reveals = document.querySelectorAll('.reveal, .reveal-stagger');
  if(reveals.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    },{threshold:0.12, rootMargin:'0px 0px -40px 0px'});
    reveals.forEach(function(el){ io.observe(el); });
  }

  var home = document.getElementById('home-screen');
  var cards = home ? home.querySelectorAll('.home-card') : [];
  if(cards.length && window.matchMedia('(hover:hover)').matches){
    var raf = null;
    document.addEventListener('mousemove', function(e){
      if(raf) return;
      raf = requestAnimationFrame(function(){
        var cx = (e.clientX / window.innerWidth - 0.5) * 2;
        var cy = (e.clientY / window.innerHeight - 0.5) * 2;
        cards.forEach(function(c, i){
          var depth = (i + 1) * 0.4;
          c.style.transform = 'translate(' + (cx * depth * 0.5).toFixed(1) + 'px,' + (cy * depth * 0.3).toFixed(1) + 'px)';
        });
        raf = null;
      });
    });
    document.addEventListener('mouseleave', function(){
      cards.forEach(function(c){ c.style.transform = ''; });
    });
  }
})();
` }} />

      {/* ========== LOADING OVERLAY ========== */}
      <div className="loading-overlay opacity-0 pointer-events-none" id="overlay">
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
        onClick={() => { if (typeof window !== 'undefined') (window as any).toggleSound?.(); }}
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
              if (typeof window !== 'undefined') {
                if ((window as any).toggleTheme) {
                  (window as any).toggleTheme();
                } else {
                  // Fallback: toggle directly
                  const html = document.documentElement;
                  const isDark = html.getAttribute('data-theme') === 'dark';
                  const newTheme = isDark ? 'light' : 'dark';
                  html.setAttribute('data-theme', newTheme);
                  localStorage.setItem('theme', newTheme);
                }
                // Update icon visibility
                const sunEl = document.querySelector('.theme-icon-sun') as HTMLElement;
                const moonEl = document.querySelector('.theme-icon-moon') as HTMLElement;
                const isDarkNow = document.documentElement.getAttribute('data-theme') === 'dark';
                if (sunEl) sunEl.style.display = isDarkNow ? 'none' : 'block';
                if (moonEl) moonEl.style.display = isDarkNow ? 'block' : 'none';
              }
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
        </div>
      </nav>

      {/* ========== HOME SCREEN ========== */}
      <div id="home-screen" className="flex flex-col min-h-screen max-w-[1200px] mx-auto w-full relative z-10" style={{ display: 'flex' }}>

        {/* HERO SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start pt-16 pb-12 px-4 sm:px-8 lg:px-16 relative gap-8">
          <div className="flex flex-col w-full lg:max-w-[60%]">
            {/* Eyebrow Badge */}
            <div className="hero-eyebrow animate-rise-up mb-6">
              Smart Office Assistant
            </div>

            {/* Hero Title */}
            <h1 className="hero-title animate-rise-up delay-100 mb-4">
              Soochna Sahayak
            </h1>

            {/* Subtitle */}
            <p className="font-display text-xl text-[var(--text-secondary)] italic mb-4 animate-rise-up delay-150">
              Streamlining administrative workflows
            </p>

            {/* Horizontal Rule */}
            <div className="hero-rule mb-6"></div>

            {/* Description */}
            <p className="text-[14px] sm:text-[15px] text-[var(--text-secondary)] max-w-xl leading-relaxed animate-rise-up delay-250">
              A premium government productivity tool for the Ayurveda Department — designed with the warmth of parchment and the precision of modern SaaS.
            </p>
          </div>

          {/* Decorative 'स' */}
          <div className="hero-deco hidden lg:block">स</div>
        </div>

        {/* Stats Row */}
        <div className="stats-row animate-rise-up delay-300">
          <div className="stat-item">
            <span className="stat-dot"></span>
            <span className="stat-count">2</span>
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

          {/* PLP Card - Primary Featured */}
          <div
            className="home-card group card featured cursor-pointer"
            data-tooltip="Generate PLP Performance Report"
            onClick={() => { if (typeof window !== 'undefined') (window as any).showPanel?.('plp-panel'); }}
          >
            <div className="absolute top-6 right-6 badge badge-primary">सक्रिय</div>

            {/* Icon Block */}
            <div className="card-icon-wrap w-[46px] h-[46px] rounded-[10px] bg-[var(--accent-light)] flex items-center justify-center mb-6 text-[var(--accent-primary)]">
              <BarChart3 size={22} strokeWidth={1.5} />
            </div>

            {/* Card Title */}
            <h3 className="font-display text-[19px] font-semibold text-[var(--text-primary)] mb-2">PLP Report</h3>

            {/* Description */}
            <p className="font-body text-[13px] text-[var(--text-muted)] leading-[1.65] mb-6">
              AHWC मासिक प्रदर्शन रिपोर्ट तैयार करें
            </p>

            {/* Card Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <span className="text-[11px] font-medium text-[var(--accent-primary)] uppercase tracking-wider">Generate Report</span>
              <ArrowRight size={18} className="card-arrow text-[var(--text-muted)]" />
            </div>
          </div>

          {/* Staff Attendance Card */}
          <div
            className="home-card group card cursor-pointer"
            data-tooltip="Staff Attendance Tracker"
            onClick={() => { if (typeof window !== 'undefined') (window as any).showPanel?.('staff-att-panel'); }}
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

          {/* Yoga Card - Coming Soon */}
          <div className="card card-disabled">
            <div className="absolute top-6 right-6 badge badge-secondary">शीघ्र आ रहा है</div>

            <div className="card-icon-wrap w-[46px] h-[46px] rounded-[10px] bg-[var(--bg-elevated)] flex items-center justify-center mb-6 text-[var(--text-muted)]">
              <Heart size={22} strokeWidth={1.5} />
            </div>

            <h3 className="font-display text-[19px] font-semibold text-[var(--text-secondary)] mb-2">Yoga Instructor</h3>

            <p className="font-body text-[13px] text-[var(--text-muted)] leading-[1.65] mb-6">
              योग प्रशिक्षक उपस्थिति शीघ्र उपलब्ध
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Coming Soon</span>
            </div>
          </div>
        </div>

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
          onClick={() => { if (typeof window !== 'undefined') (window as any).showHomeScreen?.(); }}
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
              {/* Error Box */}
              <div className="err-box bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm mb-4" id="err-box" style={{ display: 'none' }} />

              {/* Basic Info */}
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

              {/* Table 1 */}
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

              {/* Table 2 */}
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

              {/* Generate PDF & Excel */}
              <div className="flex flex-wrap gap-3 pt-4 sticky bottom-0 md:relative bg-[var(--bg-surface)] md:bg-transparent p-4 md:p-0 border-t border-[var(--border)] md:border-none z-20 mt-4 btn-row">
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
        </div>

        {/* Screen-only footer */}
        <div className="text-center text-[13px] text-[var(--text-muted)] mt-12 mb-6 no-print">
          Made By Peeyush Singh, Assistant Accounts Officer II
        </div>
      </div>

      {/* ========== STAFF ATTENDANCE PANEL ========== */}
      <div id="staff-att-panel" className="page inner-page-wrap flex flex-col px-4 sm:px-6 py-8 sm:py-12 md:px-12 max-w-[1400px] mx-auto w-full gap-8 min-h-screen safe-bottom-mobile" style={{ display: 'none' }}>
        <button
          className="back-btn no-print"
          onClick={() => { if (typeof window !== 'undefined') (window as any).showHomeScreen?.(); }}
        >
          <ChevronLeft size={16} strokeWidth={2} /> होम
        </button>

        <div className="flex flex-col xl:flex-row gap-8 w-full">
          <div className="form-panel flex-1 no-print">

            <div className="page-title-area">
              <h2 className="font-display text-[26px] font-semibold text-[var(--text-primary)] mb-1">Staff Attendance</h2>
              <p className="text-[var(--text-muted)] text-sm">डेटा दर्ज करें</p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="err-box bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm mb-4" id="att-err-box" style={{ display: 'none' }} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-[0.02em] uppercase">कार्यालय राजकीय</label>
                  <input className="form-input-base" type="text" id="att-office-name" placeholder="कार्यालय का पूरा नाम टाइप करें" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-[0.02em] uppercase">
                    क्रमांक - उपस्थिति /
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: 400, textTransform: 'none', letterSpacing: '0' }}>
                      (वैकल्पिक)
                    </span>
                  </label>
                  <input className="form-input-base" type="text" id="att-kramank" placeholder="क्रमांक (वैकल्पिक)" />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-[0.02em] uppercase">दिनांक</label>
                  <div className="flex md:justify-end">
                    <input className="form-input-base max-w-[200px]" type="date" id="att-date" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-[0.02em] uppercase">उपस्थिति अवधि</label>
                  <div className="flex flex-wrap items-center gap-3">
                    <input className="form-input-base w-auto flex-1 md:flex-none" type="date" id="att-period-from" /> 
                    <span className="text-[var(--text-secondary)]">…से…</span> 
                    <input className="form-input-base w-auto flex-1 md:flex-none" type="date" id="att-period-to" /> 
                    <span className="text-[var(--text-secondary)]">…तक</span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[var(--border)] mt-4">
                <table className="w-full text-left min-w-[700px] border-collapse">
                  <thead>
                    <tr id="att-tbl-head" className="bg-[var(--bg-elevated)] text-[var(--text-secondary)] text-[12px] uppercase tracking-[0.05em] [&>th]:p-3 [&>th]:border-b [&>th]:border-[var(--border)]" />
                  </thead>
                  <tbody id="att-tbody" className="[&>tr:nth-child(even)]:bg-[var(--bg-elevated)] [&>tr:nth-child(odd)]:bg-[var(--bg-surface)] [&>tr:hover]:bg-[var(--accent-primary)]/5 transition-colors [&>tr>td]:p-2 [&>tr>td]:border-b [&>tr>td]:border-[var(--border)]" />
                </table>
              </div>

              <button className="add-row-btn" id="att-add-row-btn">+ कार्मिक जोड़ें</button>

              <div className="flex flex-col gap-2 mt-4">
                <label className="field-label">नोट</label>
                <textarea className="form-input-base field-textarea" id="att-note" rows={3} placeholder="कोई विशेष टिप्पणी हो तो यहाँ लिखें..." />
              </div>

              {/* Progress Pill */}
              <div className="progress-pill-wrap" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div className="progress-pill" id="att-progress-pill">
                  <span>0 कार्मिक</span>
                  <span className="progress-pill-dot">·</span>
                  <span>0 दिन</span>
                  <span className="progress-pill-dot">·</span>
                  <span>अवधि: —–—</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 sticky bottom-0 md:relative bg-[var(--bg-surface)] md:bg-transparent p-4 md:p-0 border-t border-[var(--border)] md:border-none z-20 mt-4 btn-row">
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
                  <Download size={16} /> Save PDF
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 xl:max-w-[400px] 2xl:max-w-[500px]">
            <div className="text-[var(--text-secondary)] font-medium text-sm mb-4 flex items-center gap-2 no-print">📄 दस्तावेज़ प्रीव्यू (A4)</div>
            <div className="a4-scaler bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl overflow-hidden p-6 shadow-[var(--shadow-card-rest)]">
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

                <div className="doc-tbl-scroll">
                  <table className="doc-tbl">
                    <thead>
                      <tr id="att-doc-tbl-head" />
                    </thead>
                    <tbody id="att-doc-tbody" />
                  </table>
                </div>

                <div id="att-doc-note-sec" style={{ marginTop: '10px', display: 'none' }}>
                  <strong>नोट :</strong> <span id="att-doc-note-text" />
                </div>

                <div className="cert-block" style={{ marginTop: '20px', border: 'none', background: 'transparent' }}>
                  <div className="cert-text" id="att-cert-text" style={{ fontWeight: 'bold', textAlign: 'center' }}>
                    प्रमाणित किया जाता है कि उपस्थिति पत्रक का मिलान उपस्थिति पंजिका से कर लिया गया है, साथ ही कोई भी कार्मिक बिना सक्षम स्तर से अवकाश स्वीकृत कराए उपस्थिति पत्रक में उल्लिखित अवधि के दौरान अनुपस्थित नहीं रहा है।
                  </div>
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
        </div>

        <div className="text-center text-[13px] text-[var(--text-muted)] mt-12 mb-6 no-print">
          Made By Peeyush Singh, Assistant Accounts Officer II
        </div>
      </div>
    </div>
  );
}
