'use client';

import Script from 'next/script';
import { BarChart3, Users, Heart, Volume2, ClipboardList, FileDown, Eye, Printer, Download, ArrowRight, ChevronLeft } from 'lucide-react';
import './web-portal.css';

/* ═══════════════════════════════════════════════════════════════
   Soochna Sahayak — Smart Office Assistant
   Full responsive website (web_portal port)
   ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans antialiased animate-fade-in relative overflow-x-hidden selection:bg-[var(--accent-primary)] selection:text-[var(--bg-base)]">
      {/* html2pdf.js CDN */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        strategy="beforeInteractive"
      />
      {/* Web Portal Logic */}
      <Script src="/web-portal.js" strategy="afterInteractive" />

      {/* Lightweight animation init — scroll reveal + parallax (CSS-driven) */}
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

      {/* Top Border Accent Line */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-[var(--accent-primary)] z-50 pointer-events-none"></div>

      {/* ========== LOADING OVERLAY ========== */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex-col items-center justify-center transition-opacity" id="overlay" style={{ display: 'none' }}>
        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] p-8 rounded-2xl flex flex-col items-center gap-4 shadow-[var(--shadow-glow-gold)]">
          <div className="flex space-x-2 spin">
            <div className="w-3 h-3 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <div className="text-[var(--text-secondary)] font-medium text-sm tracking-wide">PDF तैयार हो रही है...</div>
        </div>
      </div>

      {/* ========== SOUND TOGGLE ========== */}
      <button
        id="sound-toggle"
        className="fixed bottom-6 right-6 p-3 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-all z-50 no-print shadow-[var(--shadow-card-rest)] hover:shadow-[var(--shadow-glow-gold)]"
        onClick={() => { if (typeof window !== 'undefined') (window as any).toggleSound?.(); }}
        aria-label="Toggle sound effects"
        title="Sound Effects"
      >
        <span id="sound-icon"><Volume2 size={20} strokeWidth={2} /></span>
      </button>

      {/* ========== HOME SCREEN ========== */}
      <div id="home-screen" className="flex flex-col min-h-screen px-6 py-12 md:px-12 md:py-24 max-w-7xl mx-auto w-full relative z-10">
        
        {/* HERO SECTION */}
        <div className="flex flex-col justify-center min-h-[40vh] w-full items-start pt-12 pb-16 relative">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-[var(--accent-primary)] text-[var(--accent-primary)] text-[11px] font-semibold tracking-[0.1em] uppercase animate-fade-up bg-transparent backdrop-blur-md">
            Smart Office Assistant
          </div>
          <h1 className="text-5xl md:text-7xl font-bold display-font text-[var(--text-primary)] mb-6 animate-fade-up delay-100 !leading-[1.1] tracking-tight">
            Soochna Sahayak
          </h1>
          <p className="text-[var(--text-secondary)] text-lg md:text-xl font-light max-w-2xl animate-fade-up delay-200">
            Streamlining administrative workflows for Ayurveda Department
          </p>
        </div>

        {/* CARD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-auto pb-24 relative">
          {/* PLP Card - Primary Featured */}
          <div
            className="home-card group relative overflow-hidden bg-[var(--bg-surface)] border border-[var(--border)] rounded-[16px] p-[32px] cursor-pointer transition-all duration-300 hover:bg-[var(--bg-elevated)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] animate-fade-up delay-300 md:col-span-2 lg:col-span-1"
            data-tooltip="Generate PLP Performance Report"
            onClick={() => { if (typeof window !== 'undefined') (window as any).showPanel?.('plp-panel'); }}
            style={{ borderColor: 'rgba(245,166,35,0.4)' }}
          >
            {/* Gradient Overlay */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--accent-primary)]/10 rounded-full blur-[40px] group-hover:bg-[var(--accent-primary)]/20 transition-all pointer-events-none"></div>
            
            <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-[11px] font-semibold tracking-wider uppercase border border-[var(--accent-primary)]/30 pointer-events-none">
              Primary
            </div>

            <div className="w-12 h-12 rounded-xl flex items-center mb-6 text-[var(--accent-primary)] transition-transform duration-300">
              <BarChart3 size={32} strokeWidth={1.8} />
            </div>
            <h3 className="text-[20px] font-semibold text-[var(--text-primary)] mb-2">PLP Report</h3>
            <p className="text-[var(--text-secondary)] text-[14px]">Generate performance report</p>
            <div className="absolute bottom-8 right-8 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all duration-300">
              <ArrowRight size={20} strokeWidth={2.5} />
            </div>
          </div>

          {/* Staff Attendance Card */}
          <div
            className="home-card group relative overflow-hidden bg-[var(--bg-surface)] border border-[var(--border)] rounded-[16px] p-[32px] cursor-pointer transition-all duration-300 hover:bg-[var(--bg-elevated)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] hover:border-[rgba(245,166,35,0.4)] animate-fade-up delay-400"
            data-tooltip="Staff Attendance Tracker"
            onClick={() => { if (typeof window !== 'undefined') (window as any).showPanel?.('staff-att-panel'); }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center mb-6 text-[var(--accent-secondary)] transition-transform duration-300">
              <Users size={32} strokeWidth={1.8} />
            </div>
            <h3 className="text-[20px] font-semibold text-[var(--text-primary)] mb-2">Staff Attendance</h3>
            <p className="text-[var(--text-secondary)] text-[14px]">Track staff attendance</p>
            <div className="absolute bottom-8 right-8 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all duration-300">
              <ArrowRight size={20} strokeWidth={2.5} />
            </div>
          </div>

          {/* Yoga Card */}
          <div
            className="home-card group relative overflow-hidden bg-[var(--bg-surface)] border border-[var(--border)] rounded-[16px] p-[32px] transition-all duration-300 opacity-50 cursor-not-allowed animate-fade-up delay-500"
            onClick={() => alert('Coming Soon')}
          >
            <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-[var(--text-muted)]/20 text-[var(--text-secondary)] text-[11px] font-semibold tracking-wider uppercase border border-[var(--text-muted)]/30 pointer-events-none">
              Coming Soon
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center mb-6 text-[var(--text-secondary)]">
              <Heart size={32} strokeWidth={1.8} />
            </div>
            <h3 className="text-[20px] font-semibold text-[var(--text-primary)] mb-2">Yoga Instructor</h3>
            <p className="text-[var(--text-secondary)] text-[14px]">Attendance coming soon</p>
            <div className="absolute bottom-8 right-8 text-[var(--text-secondary)]">
              <ArrowRight size={20} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-auto pt-8 border-t border-[var(--border)] text-center pb-6">
          <p className="text-[13px] text-[var(--text-muted)] mb-1">Empowering Office Efficiency</p>
          <p className="text-[13px] text-[var(--text-muted)]">An Initiative by Peeyush Singh Rao, Assistant Accounts Officer Grade II</p>
        </div>
      </div>

      {/* ========== PLP PANEL ========== */}
      <div id="plp-panel" className="animate-fade-in flex-col px-6 py-12 md:px-12 max-w-[1400px] mx-auto w-full gap-8" style={{ display: 'none' }}>
        <button
          className="back-btn flex items-center gap-2 bg-transparent border border-[var(--border)] text-[var(--text-secondary)] px-4 py-2 rounded-lg hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all mb-8 self-start no-print"
          onClick={() => { if (typeof window !== 'undefined') (window as any).showHomeScreen?.(); }}
        >
          <ChevronLeft size={16} strokeWidth={2.5} /> Back
        </button>

        <div className="flex flex-col xl:flex-row gap-8 w-full">
          {/* Form Panel */}
          <div className="form-panel flex-1 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[16px] p-[20px] md:p-[32px] shadow-[var(--shadow-card-rest)] no-print backdrop-blur-md">
            
            <div className="mb-8 border-l-4 border-[var(--accent-primary)] pl-4">
              <h2 className="display-font text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-1">AHWC मासिक प्रदर्शन PLP रिपोर्ट</h2>
              <p className="text-[var(--text-secondary)] text-sm">डेटा दर्ज करें</p>
            </div>

            <div className="flex flex-col gap-6">
              {/* Error Box */}
              <div className="err-box bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-lg text-sm mb-4" id="err-box" style={{ display: 'none' }} />

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

              <button className="bg-transparent border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all px-4 py-2 rounded-lg text-sm font-medium self-start mt-2" id="add-karma-btn">+ कर्मचारी जोड़ें</button>

              {/* Generate PDF */}
              <div className="flex pt-4 sticky bottom-0 md:relative bg-[var(--bg-surface)] md:bg-transparent p-4 md:p-0 border-t border-[var(--border)] md:border-none z-20 mt-4">
                <button className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-[var(--accent-primary)] text-[var(--bg-base)] font-semibold px-7 py-3 rounded-[10px] hover:brightness-110 hover:-translate-y-[1px] active:translate-y-0 transition-all" id="btn-pdf">
                  <FileDown size={20} strokeWidth={2} /> Save PDF
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
      <div id="staff-att-panel" className="animate-fade-in flex-col px-6 py-12 md:px-12 max-w-[1400px] mx-auto w-full gap-8" style={{ display: 'none' }}>
        <button
          className="back-btn flex items-center gap-2 bg-transparent border border-[var(--border)] text-[var(--text-secondary)] px-4 py-2 rounded-lg hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all mb-8 self-start no-print"
          onClick={() => { if (typeof window !== 'undefined') (window as any).showHomeScreen?.(); }}
        >
          <ChevronLeft size={16} strokeWidth={2.5} /> Back
        </button>

        <div className="flex flex-col xl:flex-row gap-8 w-full">
          <div className="form-panel flex-1 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[16px] p-[20px] md:p-[32px] shadow-[var(--shadow-card-rest)] no-print backdrop-blur-md">
            
            <div className="mb-8 border-l-4 border-[var(--accent-primary)] pl-4">
              <h2 className="display-font text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-1">Staff Attendance</h2>
              <p className="text-[var(--text-secondary)] text-sm">डेटा दर्ज करें</p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="err-box bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-lg text-sm mb-4" id="att-err-box" style={{ display: 'none' }} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-[0.02em] uppercase">कार्यालय राजकीय</label>
                  <input className="form-input-base" type="text" id="att-office-name" placeholder="कार्यालय का पूरा नाम टाइप करें" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-[0.02em] uppercase">क्रमांक - उपस्थिति /</label>
                  <input className="form-input-base" type="text" id="att-kramank" placeholder="क्रमांक" />
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

              <button className="bg-transparent border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all px-4 py-2 rounded-lg text-sm font-medium self-start mt-2" id="att-add-row-btn">+ कार्मिक जोड़ें</button>

              <div className="flex flex-col gap-2 mt-4">
                <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-[0.02em] uppercase">नोट</label>
                <textarea className="form-input-base" id="att-note" rows={3} placeholder="कोई विशेष टिप्पणी हो तो यहाँ लिखें..." />
              </div>

              <div className="flex flex-wrap gap-4 pt-4 sticky bottom-0 md:relative bg-[var(--bg-surface)] md:bg-transparent p-4 md:p-0 border-t border-[var(--border)] md:border-none z-20 mt-4">
                <button className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-semibold px-6 py-3 rounded-[10px] hover:bg-[var(--accent-primary)]/20 transition-all border-none" id="att-btn-preview">
                  <Eye size={18} strokeWidth={2} /> Preview
                </button>
                <button className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-transparent border border-[var(--border)] text-[var(--text-primary)] font-semibold px-6 py-3 rounded-[10px] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all" id="att-btn-print">
                  <Printer size={18} strokeWidth={2} /> Print
                </button>
                <button className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-[var(--accent-primary)] text-[var(--bg-base)] font-semibold px-6 py-3 rounded-[10px] hover:brightness-110 hover:-translate-y-[1px] active:translate-y-0 transition-all border-none" id="att-btn-pdf">
                  <Download size={18} strokeWidth={2} /> Save PDF
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
        </div>

        <div className="text-center text-[13px] text-[var(--text-muted)] mt-12 mb-6 no-print">
          Made By Peeyush Singh, Assistant Accounts Officer II
        </div>
      </div>
    </div>
  );
}
