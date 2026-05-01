'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, FileText, Users, BarChart3, Bell, Person, Lock,
  ArrowForward, Plus, X, ChevronLeft, Description,
  AlertCircle, Download, Eye, Printer
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS & DATA
   ═══════════════════════════════════════════════════════════════ */
const KARYA_NAMES = [
  "ओपीडी", "प्रकृति परीक्षण",
  "आयुष सुविधा में पेनलबद्ध व्यक्तियों की संख्या",
  "उच्च रक्तचाप हेतु परीक्षित 30 वर्ष से अधिक आयु के व्यक्तियों का अनुपात",
  "मधुमेह हेतु परीक्षित 30 वर्ष से अधिक आयु के व्यक्तियों का अनुपात",
  "आयुष उपचार पा रहे मधुमेह रोगियों का अनुपात",
  "आयुष उपचार पा रहे उच्च रक्तचाप रोगियों का अनुपात",
  "जीवनशैली में परिवर्तन हेतु वर्ष में 06, सात दिवसीय अभियान",
  "परिवारों को वितरित ब्रोशर",
  "जनता की भागीदारी वाली अंतक्षेत्रीय बैठकों का आयोजन / भागीदारी",
];

const PAD_BASE: Record<string, number> = { AMO: 5000, 'नर्स/कम्पा': 2000, ANM: 2000, ASHA: 1000 };
const PAD_OPTIONS = ['', 'AMO', 'ANM', 'ASHA', 'नर्स/कम्पा'];
const MONTHS = ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
const ATT_OPTIONS = ["उपस्थित", "Day off", "आकस्मिक अवकाश", "चाइल्डकेयर लीव", "उपार्जित अवकाश", "परिवर्तित अवकाश", "अर्धवेतन अवकाश", "असाधारण अवकाश", "प्रसूति अवकाश", "पितृत्व अवकाश", "willful absence", "Onduty", "अवकाश पर", "कार्यमुक्त"];

type Screen = 'splash' | 'home' | 'report' | 'attendance';

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function HealthAppPreview() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [navIndex, setNavIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setScreen('home'), 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleNav = useCallback((i: number) => {
    setNavIndex(i);
    if (i === 0) setScreen('home');
    else if (i === 1) setScreen('report');
    else if (i === 2) setScreen('attendance');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-teal-50 flex flex-col items-center justify-center p-4 font-[system-ui,_sans-serif]">
      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-teal-800 tracking-tight">
          AHWC Health App
        </h1>
        <p className="text-sm text-teal-600 mt-1">Interactive Preview — Flutter Mobile App</p>
      </div>

      {/* Phone Frame */}
      <div className="relative w-full max-w-[390px] h-[780px] bg-black rounded-[3rem] shadow-2xl p-[10px] ring-1 ring-white/10">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-black rounded-b-2xl z-50" />

        {/* Screen */}
        <div className="w-full h-full bg-[#F7F9FC] rounded-[2.4rem] overflow-hidden relative">
          <AnimatePresence mode="wait">
            {screen === 'splash' && <SplashScreen key="splash" />}
            {screen === 'home' && <HomeScreen key="home" onNavigate={handleNav} onFeatureTap={(s) => { setScreen(s); if (s === 'report') setNavIndex(1); if (s === 'attendance') setNavIndex(2); }} />}
            {screen === 'report' && <ReportScreen key="report" onBack={() => { setScreen('home'); setNavIndex(0); }} />}
            {screen === 'attendance' && <AttendanceScreen key="attendance" onBack={() => { setScreen('home'); setNavIndex(0); }} />}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-slate-400 mt-6 text-center">
        Built with Next.js &middot; Inspired by Flutter App by Peeyush Singh Rao
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SPLASH SCREEN
   ═══════════════════════════════════════════════════════════════ */
function SplashScreen() {
  return (
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-[#0A6E6E] to-[#0D8A8A] flex flex-col items-center justify-center"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-sm"
      >
        <Description className="w-12 h-12 text-white" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-white text-2xl font-bold"
      >
        AHWC
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-white/70 text-sm mt-2"
      >
        आयुष्मान आरोग्य मंदिर
      </motion.p>

      {/* Shimmer loading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-12 flex gap-1.5"
      >
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            className="w-2 h-2 bg-white/80 rounded-full"
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HOME SCREEN
   ═══════════════════════════════════════════════════════════════ */
function HomeScreen({ onNavigate, onFeatureTap }: { onNavigate: (i: number) => void; onFeatureTap: (s: Screen) => void }) {
  const [snack, setSnack] = useState('');

  const showNotify = () => {
    setSnack('आपको सूचित किया जाएगा!');
    setTimeout(() => setSnack(''), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 overflow-y-auto pb-20"
    >
      {/* AHWC Header */}
      <div className="relative">
        <div className="bg-gradient-to-br from-[#0A6E6E] to-[#0D8A8A] pt-12 pb-16 px-5">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-white font-bold text-lg">AHWC</h2>
              <p className="text-white/70 text-xs">आयुष्मान आरोग्य मंदिर</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-white/90"><Bell className="w-5 h-5" /></button>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Person className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-white font-bold text-xl">नमस्ते, डॉ. शर्मा 👋</h3>
            <p className="text-white/80 text-sm mt-0.5">आज क्या करना है?</p>
          </div>
        </div>
        {/* Wave */}
        <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 390 24" fill="none">
          <path d="M0 4C97.5 24 292.5 24 390 4V24H0V4Z" fill="#F7F9FC" />
        </svg>
      </div>

      {/* Quick Stats Strip */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: -10, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="relative z-10 -mt-6 mx-4 bg-white rounded-xl shadow-lg shadow-black/5 px-4 py-3 flex items-center justify-around"
      >
        <StatItem value="12" label="रिपोर्ट इस माह" />
        <div className="w-px h-7 bg-gray-300" />
        <StatItem value="3" label="कर्मचारी" />
        <div className="w-px h-7 bg-gray-300" />
        <StatItem value="2" label="मॉड्यूल" />
      </motion.div>

      {/* Main Features */}
      <div className="px-4 mt-6">
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="text-sm font-semibold text-gray-800 mb-3"
        >
          मुख्य सुविधाएं
        </motion.p>

        {/* Hero Feature Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onFeatureTap('report')}
          className="relative h-[140px] rounded-[20px] bg-gradient-to-br from-[#F5A623] to-[#FF8C00] shadow-lg shadow-orange-300/30 cursor-pointer overflow-hidden"
        >
          <div className="absolute inset-0 p-4 flex">
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <Description className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold text-[15px]">PLP रिपोर्ट जनरेटर</h4>
                  <p className="text-white/80 text-[11px] mt-1 leading-tight">
                    मासिक प्रदर्शन आधारित प्रोत्साहन रिपोर्ट
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <span className="inline-flex items-center gap-1 text-white text-xs border border-white/60 rounded-full px-3 py-1.5">
                  रिपोर्ट बनाएं <ArrowForward className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute -top-2.5 -right-2.5 w-[70px] h-[70px] rounded-full bg-white/8" />
              <div className="absolute -top-5 -right-5 w-[50px] h-[50px] rounded-full bg-white/12" />
            </div>
          </div>
        </motion.div>

        {/* Staff Attendance Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onFeatureTap('attendance')}
          className="mt-4 h-[120px] rounded-[20px] bg-gradient-to-br from-[#0A6E6E] to-[#0D8A8A] shadow-lg shadow-teal-300/20 cursor-pointer overflow-hidden flex items-center px-5"
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-white font-bold text-[15px]">Staff Attendance</h4>
              <p className="text-white/70 text-[11px] mt-0.5">उपस्थिति पत्रक बनाएं और PDF तैयार करें</p>
            </div>
          </div>
          <ArrowForward className="w-5 h-5 text-white/60" />
        </motion.div>
      </div>

      {/* Coming Soon */}
      <div className="px-4 mt-6">
        <p className="text-[13px] text-gray-500 mb-3">जल्द आ रहा है</p>

        <ComingSoonCard
          title="कर्मचारी विवरण"
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-500"
          eta="जून 2025 में उपलब्ध"
          onNotify={showNotify}
          delay={0.8}
        />
        <ComingSoonCard
          title="डेटा एनालिटिक्स"
          icon={<BarChart3 className="w-5 h-5" />}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
          eta="जुलाई 2025 में उपलब्ध"
          onNotify={showNotify}
          delay={0.9}
        />
      </div>

      <div className="h-24" />

      {/* Bottom Nav */}
      <BottomNav current={0} onTap={onNavigate} />

      {/* Snackbar */}
      <AnimatePresence>
        {snack && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            className="absolute bottom-24 left-4 right-4 bg-[#0A6E6E] text-white text-sm rounded-xl px-4 py-3 text-center shadow-lg"
          >
            {snack}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STAT ITEM
   ═══════════════════════════════════════════════════════════════ */
function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center flex-1">
      <div className="text-lg font-bold text-[#0A6E6E]">{value}</div>
      <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMING SOON CARD
   ═══════════════════════════════════════════════════════════════ */
function ComingSoonCard({ title, icon, iconBg, iconColor, eta, onNotify, delay }: {
  title: string; icon: React.ReactNode; iconBg: string; iconColor: string;
  eta: string; onNotify: () => void; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 0.65, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center bg-white rounded-2xl p-4 shadow-sm mb-2"
    >
      <div className={`w-10 h-10 ${iconBg} rounded-[10px] flex items-center justify-center ${iconColor} opacity-60`}>
        {icon}
      </div>
      <div className="flex-1 ml-3 min-w-0">
        <h5 className="text-[15px] font-semibold text-gray-800">{title}</h5>
        <div className="flex items-center gap-1 mt-0.5">
          <Lock className="w-2.5 h-2.5 text-gray-400" />
          <span className="text-[11px] text-gray-400">जल्द आ रहा है</span>
        </div>
        <p className="text-[10px] text-gray-400/70 mt-0.5">{eta}</p>
      </div>
      <button onClick={onNotify} className="text-xs text-[#0A6E6E] font-semibold shrink-0 hover:underline">
        सूचित करें
      </button>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BOTTOM NAV
   ═══════════════════════════════════════════════════════════════ */
function BottomNav({ current, onTap }: { current: number; onTap: (i: number) => void }) {
  const tabs = [
    { icon: Home, label: 'होम', idx: 0 },
    { icon: FileText, label: 'रिपोर्ट', idx: 1 },
    { icon: Users, label: 'कर्मचारी', idx: 2 },
    { icon: BarChart3, label: 'एनालिटिक्स', idx: 3 },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[370px] z-30 px-5 pb-3 pt-1">
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 18 }}
        className="bg-white rounded-2xl shadow-xl shadow-black/10 h-16 flex items-center justify-around px-2"
      >
        {tabs.map(t => {
          const active = t.idx === current;
          return (
            <button
              key={t.idx}
              onClick={() => onTap(t.idx)}
              className="flex flex-col items-center py-1.5 px-3 transition-all"
            >
              <motion.div animate={{ scale: active ? 1.15 : 1 }} transition={{ type: 'spring', stiffness: 400 }}>
                <t.icon className={`w-6 h-6 ${active ? 'text-[#0A6E6E]' : 'text-gray-300'}`} />
              </motion.div>
              <motion.div
                animate={{ opacity: active ? 1 : 0 }}
                className="mt-1"
              >
                {active && <div className="w-1 h-1 bg-[#0A6E6E] rounded-full mx-auto mb-0.5" />}
                <span className="text-[10px] text-[#0A6E6E] font-medium">{t.label}</span>
              </motion.div>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REPORT SCREEN (PLP Form)
   ═══════════════════════════════════════════════════════════════ */
function ReportScreen({ onBack }: { onBack: () => void }) {
  const [ahwcName, setAhwcName] = useState('');
  const [jila, setJila] = useState('');
  const [maah, setMaah] = useState('फरवरी');
  const [varsh, setVarsh] = useState(String(new Date().getFullYear()));
  const [rows, setRows] = useState(KARYA_NAMES.map(() => ({ lakshya: '', prapti: '' })));
  const [employees, setEmployees] = useState([
    { naam: '', pad: '', bank: '', bankName: '', ifsc: '', mobile: '' },
    { naam: '', pad: '', bank: '', bankName: '', ifsc: '', mobile: '' },
  ]);
  const [errors, setErrors] = useState<string[]>([]);

  const calcPercent = (l: string, p: string) => {
    const ln = parseFloat(l), pn = parseFloat(p);
    if (!ln || isNaN(ln) || ln === 0 || isNaN(pn)) return 0;
    return Math.round((pn / ln) * 10000) / 100;
  };

  const calcRashi = (pct: number) => {
    if (pct < 31) return 0;
    if (pct <= 50) return Math.round((pct / 100) * 500);
    if (pct <= 70) return Math.round(0.75 * 500);
    return 500;
  };

  const totalRashi = useMemo(() => rows.reduce((s, r) => s + calcRashi(calcPercent(r.lakshya, r.prapti)), 0), [rows]);
  const perfPct = useMemo(() => Math.round((totalRashi / 5000) * 10000) / 100, [totalRashi]);
  const getPayment = (pad: string) => {
    const base = PAD_BASE[pad] || 0;
    return Math.round((perfPct / 100) * base);
  };
  const totalPayment = useMemo(() => employees.reduce((s, e) => s + getPayment(e.pad), 0), [employees, perfPct]);

  const updateRow = (i: number, field: 'lakshya' | 'prapti', val: string) => {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  };

  const updateEmployee = (i: number, field: string, val: string) => {
    setEmployees(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e));
  };

  const addEmployee = () => {
    setEmployees(prev => [...prev, { naam: '', pad: '', bank: '', bankName: '', ifsc: '', mobile: '' }]);
  };

  const removeEmployee = (i: number) => {
    if (employees.length <= 1) return;
    setEmployees(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleGeneratePdf = () => {
    const errs: string[] = [];
    if (!ahwcName.trim()) errs.push('AHWC का नाम आवश्यक है');
    if (!jila.trim()) errs.push('जिला आवश्यक है');
    setErrors(errs);
    setTimeout(() => setErrors([]), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 bg-[#F7F9FC] overflow-y-auto"
    >
      {/* App Bar */}
      <div className="bg-[#0A6E6E] text-white px-4 py-3 pt-11 flex items-center gap-3 sticky top-0 z-20">
        <button onClick={onBack} className="p-1"><ChevronLeft className="w-5 h-5" /></button>
        <h2 className="text-[15px] font-semibold flex-1 truncate">AHWC मासिक प्रदर्शन PLP रिपोर्ट</h2>
      </div>

      <div className="p-4 pb-32">
        {/* Errors */}
        <AnimatePresence>
          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 border border-red-300 rounded-xl p-3 mb-4"
            >
              {errors.map((e, i) => (
                <div key={i} className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {e}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Basic Info Card */}
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="text-sm font-bold text-gray-800 mb-3">📋 डेटा दर्ज करें</h3>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="AHWC का नाम *" placeholder="जैसे: AHWC खजूरी बाजार" value={ahwcName} onChange={setAhwcName} />
            <InputField label="जिला *" placeholder="जैसे: रायपुर" value={jila} onChange={setJila} />
            <SelectField label="माह" options={MONTHS} value={maah} onChange={setMaah} />
            <SelectField label="वर्ष" options={Array.from({ length: 6 }, (_, i) => String(new Date().getFullYear() - 2 + i))} value={varsh} onChange={setVarsh} />
          </div>
        </motion.div>

        {/* Table 1 - Tasks */}
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-800">📊 तालिका 1 — लक्ष्य एवं प्राप्ति</h3>
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <ChevronLeft className="w-3 h-3" />Scroll
            </span>
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full min-w-[520px] text-xs">
              <thead>
                <tr className="bg-[#0A6E6E] text-white">
                  <th className="py-2 px-1.5 font-semibold w-8">क्र.</th>
                  <th className="py-2 px-1.5 font-semibold text-left min-w-[180px]">कार्य का नाम</th>
                  <th className="py-2 px-1 font-semibold w-16">लक्ष्य</th>
                  <th className="py-2 px-1 font-semibold w-16">प्राप्ति</th>
                  <th className="py-2 px-1 font-semibold w-14">प्रतिशत</th>
                  <th className="py-2 px-1 font-semibold w-14">राशि (₹)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const pct = calcPercent(row.lakshya, row.prapti);
                  const rash = calcRashi(pct);
                  return (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-1.5 px-1.5 text-center font-bold text-[#0A6E6E]">{i + 1}</td>
                      <td className="py-1.5 px-2 text-left text-[11px] leading-tight">{KARYA_NAMES[i]}</td>
                      <td className="py-1 px-1">
                        <input type="number" className="w-full text-center bg-transparent border border-gray-200 rounded-md py-1 text-xs focus:border-[#0A6E6E] focus:outline-none" placeholder="0" value={row.lakshya} onChange={e => updateRow(i, 'lakshya', e.target.value)} />
                      </td>
                      <td className="py-1 px-1">
                        <input type="number" className="w-full text-center bg-transparent border border-gray-200 rounded-md py-1 text-xs focus:border-[#0A6E6E] focus:outline-none" placeholder="0" value={row.prapti} onChange={e => updateRow(i, 'prapti', e.target.value)} />
                      </td>
                      <td className="py-1.5 px-1 text-center font-bold text-orange-500 bg-orange-50 rounded-md">{pct.toFixed(2)}%</td>
                      <td className="py-1.5 px-1 text-center font-bold text-[#0A6E6E]">₹{rash}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-[#E8F5F5] border-t-2 border-[#0A6E6E]">
                  <td colSpan={5} className="py-2 px-2 text-right font-bold text-xs">
                    कुल: ₹{totalRashi} / ₹5000 | प्रदर्शन: {perfPct.toFixed(2)}%
                  </td>
                  <td className="py-2 px-1 text-center font-bold text-[#0A6E6E] text-sm">₹{totalRashi}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.div>

        {/* Table 2 - Employees */}
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-800">👥 तालिका 2 — कर्मचारी विवरण</h3>
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <ChevronLeft className="w-3 h-3" />Scroll
            </span>
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full min-w-[600px] text-xs">
              <thead>
                <tr className="bg-[#0A6E6E] text-white">
                  <th className="py-2 px-1 font-semibold w-7">क्र.</th>
                  <th className="py-2 px-1 font-semibold text-left">नाम</th>
                  <th className="py-2 px-1 font-semibold">पद</th>
                  <th className="py-2 px-1 font-semibold">बैंक खाता</th>
                  <th className="py-2 px-1 font-semibold text-left">बैंक नाम</th>
                  <th className="py-2 px-1 font-semibold">IFSC</th>
                  <th className="py-2 px-1 font-semibold">मोबाइल</th>
                  <th className="py-2 px-1 font-semibold">भुगतान</th>
                  <th className="py-2 px-1 font-semibold w-7"></th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-1 px-1 text-center font-bold">{i + 1}</td>
                    <td className="py-1 px-1">
                      <input type="text" className="w-full bg-transparent border border-gray-200 rounded-md py-1 px-1.5 text-xs focus:border-[#0A6E6E] focus:outline-none" placeholder="नाम" value={emp.naam} onChange={e => updateEmployee(i, 'naam', e.target.value)} />
                    </td>
                    <td className="py-1 px-1">
                      <select className="w-full bg-transparent border border-gray-200 rounded-md py-1 text-xs focus:border-[#0A6E6E] focus:outline-none" value={emp.pad} onChange={e => updateEmployee(i, 'pad', e.target.value)}>
                        <option value="">--</option>
                        {PAD_OPTIONS.filter(Boolean).map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </td>
                    <td className="py-1 px-1">
                      <input type="text" className="w-full bg-transparent border border-gray-200 rounded-md py-1 px-1 text-xs focus:border-[#0A6E6E] focus:outline-none" placeholder="खाता" value={emp.bank} onChange={e => updateEmployee(i, 'bank', e.target.value)} />
                    </td>
                    <td className="py-1 px-1">
                      <input type="text" className="w-full bg-transparent border border-gray-200 rounded-md py-1 px-1.5 text-xs focus:border-[#0A6E6E] focus:outline-none" placeholder="बैंक" value={emp.bankName} onChange={e => updateEmployee(i, 'bankName', e.target.value)} />
                    </td>
                    <td className="py-1 px-1">
                      <input type="text" className="w-full bg-transparent border border-gray-200 rounded-md py-1 px-1 text-xs uppercase focus:border-[#0A6E6E] focus:outline-none" placeholder="IFSC" value={emp.ifsc} onChange={e => updateEmployee(i, 'ifsc', e.target.value.toUpperCase())} />
                    </td>
                    <td className="py-1 px-1">
                      <input type="tel" className="w-full bg-transparent border border-gray-200 rounded-md py-1 px-1 text-xs focus:border-[#0A6E6E] focus:outline-none" placeholder="मोबाइल" value={emp.mobile} onChange={e => updateEmployee(i, 'mobile', e.target.value)} />
                    </td>
                    <td className="py-1.5 px-1 text-center font-bold text-[#0A6E6E]">₹{getPayment(emp.pad)}</td>
                    <td className="py-1 px-1">
                      <button onClick={() => removeEmployee(i)} disabled={employees.length <= 1} className="p-0.5">
                        <X className={`w-3.5 h-3.5 ${employees.length > 1 ? 'text-red-500 hover:text-red-700' : 'text-gray-300'}`} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[#E8F5F5] border-t-2 border-[#0A6E6E]">
                  <td colSpan={7} className="py-2 px-2 text-right font-bold text-xs">कुल भुगतान:</td>
                  <td className="py-2 px-1 text-center font-bold text-[#0A6E6E] text-sm">₹{totalPayment}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
          <button onClick={addEmployee} className="mt-3 flex items-center gap-2 bg-[#E8F5F5] text-[#0A6E6E] px-4 py-2 rounded-full text-sm font-medium hover:bg-teal-100 transition">
            <Plus className="w-4 h-4" /> कर्मचारी जोड़ें
          </button>
        </motion.div>
      </div>

      {/* FAB */}
      <motion.button
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.6, type: 'spring' }}
        onClick={handleGeneratePdf}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#F5A623] text-gray-900 px-6 py-3 rounded-full font-semibold text-sm shadow-lg shadow-orange-300/30 flex items-center gap-2 hover:bg-[#e6951a] transition active:scale-95"
      >
        <FileText className="w-4 h-4" /> PDF बनाएं
      </motion.button>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ATTENDANCE SCREEN
   ═══════════════════════════════════════════════════════════════ */
function AttendanceScreen({ onBack }: { onBack: () => void }) {
  const today = new Date();
  const [officeName, setOfficeName] = useState('');
  const [kramank, setKramank] = useState('');
  const [date, setDate] = useState(today.toISOString().split('T')[0]);
  const [periodFrom, setPeriodFrom] = useState('');
  const [periodTo, setPeriodTo] = useState('');
  const [note, setNote] = useState('');
  const [staff, setStaff] = useState([{ name: '', prevLeaves: 0, days: {} as Record<string, string> }]);

  const getDates = useMemo(() => {
    if (!periodFrom || !periodTo) return [];
    const dates: Date[] = [];
    let curr = new Date(periodFrom);
    const end = new Date(periodTo);
    while (curr <= end) {
      dates.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }
    return dates;
  }, [periodFrom, periodTo]);

  const fmtDate = (d: Date) => {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}.${mm}.${String(d.getFullYear()).slice(-2)}`;
  };

  const updateStaffDay = (idx: number, dateStr: string, val: string) => {
    setStaff(prev => prev.map((s, i) => i === idx ? { ...s, days: { ...s.days, [dateStr]: val } } : s));
  };

  const updateStaffName = (idx: number, name: string) => {
    setStaff(prev => prev.map((s, i) => i === idx ? { ...s, name } : s));
  };

  const updateStaffPrev = (idx: number, val: number) => {
    setStaff(prev => prev.map((s, i) => i === idx ? { ...s, prevLeaves: val } : s));
  };

  const addStaff = () => {
    setStaff(prev => [...prev, { name: '', prevLeaves: 0, days: {} }]);
  };

  const removeStaff = (idx: number) => {
    if (staff.length <= 1) return;
    setStaff(prev => prev.filter((_, i) => i !== idx));
  };

  const getCasualLeaves = (s: typeof staff[0]) => {
    return getDates.filter(d => s.days[d.toISOString().split('T')[0]] === 'आकस्मिक अवकाश').length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 bg-[#F7F9FC] overflow-y-auto"
    >
      {/* App Bar */}
      <div className="bg-[#0A6E6E] text-white px-4 py-3 pt-11 flex items-center gap-3 sticky top-0 z-20">
        <button onClick={onBack} className="p-1"><ChevronLeft className="w-5 h-5" /></button>
        <h2 className="text-[15px] font-semibold flex-1 truncate">Staff Attendance — उपस्थिति पत्रक</h2>
      </div>

      <div className="p-4 pb-32">
        {/* Basic Info */}
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="text-sm font-bold text-gray-800 mb-3">📋 डेटा दर्ज करें</h3>
          <div className="grid grid-cols-1 gap-3">
            <InputField label="कार्यालय राजकीय" placeholder="कार्यालय का पूरा नाम" value={officeName} onChange={setOfficeName} />
            <InputField label="क्रमांक - उपस्थिति /" placeholder="क्रमांक" value={kramank} onChange={setKramank} />
            <InputField label="दिनांक" type="date" value={date} onChange={setDate} />
            <div className="grid grid-cols-2 gap-2">
              <InputField label="अवधि प्रारंभ" type="date" value={periodFrom} onChange={setPeriodFrom} />
              <InputField label="अवधि समाप्ति" type="date" value={periodTo} onChange={setPeriodTo} />
            </div>
          </div>
        </motion.div>

        {/* Attendance Table */}
        {getDates.length > 0 && (
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="mb-4">
            <h3 className="text-sm font-bold text-gray-800 mb-2">📅 उपस्थिति तालिका</h3>
            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
              <table className="w-full min-w-[700px] text-[10px]">
                <thead>
                  <tr className="bg-[#0A6E6E] text-white">
                    <th className="py-2 px-1 font-semibold w-7">क्र.</th>
                    <th className="py-2 px-1 font-semibold text-left min-w-[100px]">नाम कार्मिक</th>
                    {getDates.map(d => (
                      <th key={d.toISOString()} className="py-2 px-0.5 font-semibold whitespace-nowrap text-[9px]">
                        {fmtDate(d)}
                      </th>
                    ))}
                    <th className="py-2 px-0.5 font-semibold text-[8px]">CL<br />अवधि</th>
                    <th className="py-2 px-0.5 font-semibold text-[8px]">CL<br />पिछला</th>
                    <th className="py-2 px-0.5 font-semibold text-[8px]">CL<br />कुल</th>
                    <th className="w-5" />
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s, idx) => {
                    const cl = getCasualLeaves(s);
                    return (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-1 px-1 text-center font-bold">{idx + 1}</td>
                        <td className="py-1 px-1">
                          <input type="text" className="w-full bg-transparent border border-gray-200 rounded py-0.5 px-1 text-[10px] focus:border-[#0A6E6E] focus:outline-none" placeholder="नाम" value={s.name} onChange={e => updateStaffName(idx, e.target.value)} />
                        </td>
                        {getDates.map(d => {
                          const ds = d.toISOString().split('T')[0];
                          const val = s.days[ds] || 'उपस्थित';
                          return (
                            <td key={ds} className="py-0.5 px-0.5">
                              <select className="w-full bg-transparent border border-gray-200 rounded py-0.5 text-[8px] focus:border-[#0A6E6E] focus:outline-none" value={val} onChange={e => updateStaffDay(idx, ds, e.target.value)}>
                                {ATT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt === 'उपस्थित' ? 'उ' : opt === 'Day off' ? 'DO' : opt === 'आकस्मिक अवकाश' ? 'CL' : 'अ'}</option>)}
                              </select>
                            </td>
                          );
                        })}
                        <td className="py-1 px-0.5 text-center font-bold text-orange-500">{cl}</td>
                        <td className="py-1 px-0.5 text-center">
                          <input type="number" min="0" className="w-full text-center bg-transparent border border-gray-200 rounded py-0.5 text-[10px] focus:border-[#0A6E6E] focus:outline-none" value={s.prevLeaves} onChange={e => updateStaffPrev(idx, parseInt(e.target.value) || 0)} />
                        </td>
                        <td className="py-1 px-0.5 text-center font-bold text-[#0A6E6E]">{cl + (s.prevLeaves || 0)}</td>
                        <td className="py-1 px-0.5">
                          <button onClick={() => removeStaff(idx)} disabled={staff.length <= 1}>
                            <X className={`w-3 h-3 ${staff.length > 1 ? 'text-red-500' : 'text-gray-300'}`} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <button onClick={addStaff} className="mt-3 flex items-center gap-2 bg-[#E8F5F5] text-[#0A6E6E] px-4 py-2 rounded-full text-sm font-medium hover:bg-teal-100 transition">
              <Plus className="w-4 h-4" /> कार्मिक जोड़ें
            </button>
          </motion.div>
        )}

        {/* Note */}
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <label className="text-xs font-bold text-gray-600 mb-2 block">नोट</label>
          <textarea className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs focus:border-[#0A6E6E] focus:outline-none resize-none" rows={3} placeholder="कोई विशेष टिप्पणी हो तो यहाँ लिखें..." value={note} onChange={e => setNote(e.target.value)} />
        </motion.div>

        {/* Preview Section */}
        {getDates.length > 0 && officeName && (
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <h3 className="text-sm font-bold text-gray-800 mb-3">📄 दस्तावेज़ प्रीव्यू</h3>
            <div className="border border-gray-300 rounded-lg p-4 text-[10px] bg-gray-50">
              <div className="text-center font-bold text-sm mb-1">आयुर्वेद विभाग</div>
              <div className="text-center text-xs mb-3">कार्यालय राजकीय {officeName}</div>
              <div className="flex justify-between mb-3">
                <span>क्रमांक - उपस्थिति / {kramank || '___'}</span>
                <span>दिनांक {date ? fmtDate(new Date(date)) : '___'}</span>
              </div>
              <div className="text-center font-bold text-base mb-3">उपस्थिति पत्रक</div>
              <div className="mb-3">उपस्थिति अवधि {periodFrom ? fmtDate(new Date(periodFrom)) : '___'} से {periodTo ? fmtDate(new Date(periodTo)) : '___'} तक</div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="border border-gray-400 py-1 px-0.5 text-[9px]">क्र.</th>
                      <th className="border border-gray-400 py-1 px-0.5 text-[9px]">नाम</th>
                      {getDates.map(d => <th key={d.toISOString()} className="border border-gray-400 py-1 px-0.5 text-[8px]">{fmtDate(d)}</th>)}
                      <th className="border border-gray-400 py-1 px-0.5 text-[8px]">CL<br/>अवधि</th>
                      <th className="border border-gray-400 py-1 px-0.5 text-[8px]">CL<br/>पिछला</th>
                      <th className="border border-gray-400 py-1 px-0.5 text-[8px]">CL<br/>कुल</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map((s, idx) => {
                      const cl = getCasualLeaves(s);
                      return (
                        <tr key={idx}>
                          <td className="border border-gray-400 py-1 px-0.5 text-center">{idx + 1}</td>
                          <td className="border border-gray-400 py-1 px-0.5">{s.name || '____________'}</td>
                          {getDates.map(d => {
                            const ds = d.toISOString().split('T')[0];
                            return <td key={ds} className="border border-gray-400 py-1 px-0.5 text-center">{s.days[ds] || 'उपस्थित'}</td>;
                          })}
                          <td className="border border-gray-400 py-1 px-0.5 text-center font-bold">{cl}</td>
                          <td className="border border-gray-400 py-1 px-0.5 text-center">{s.prevLeaves || 0}</td>
                          <td className="border border-gray-400 py-1 px-0.5 text-center font-bold">{cl + (s.prevLeaves || 0)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {note && (
                <div className="mt-3 text-[10px]">
                  <strong>नोट:</strong> {note}
                </div>
              )}
              <div className="mt-4 text-center font-bold text-[10px] leading-relaxed border-t border-gray-300 pt-3">
                प्रमाणित किया जाता है कि उपस्थिति पत्रक का मिलान उपस्थिति पंजिका से कर लिया गया है...
              </div>
              <div className="text-right mt-6">
                <div className="h-8 border-b border-gray-800 w-32 ml-auto mb-1" />
                <div className="font-bold text-xs">हस्ताक्षर प्रभारी</div>
                <div className="text-[10px]">{officeName}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex gap-2 flex-wrap">
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-gray-500 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-gray-600 transition">
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-blue-500 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-blue-600 transition">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-[#F5A623] text-gray-900 px-4 py-2.5 rounded-full text-sm font-medium hover:bg-[#e6951a] transition">
            <Download className="w-4 h-4" /> Save PDF
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHARED INPUT COMPONENTS
   ═══════════════════════════════════════════════════════════════ */
function InputField({ label, placeholder, value, onChange, type = 'text' }: {
  label: string; placeholder?: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-bold text-gray-500">{label}</label>
      {type === 'date' ? (
        <input type="date" className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-[#0A6E6E] focus:outline-none" value={value} onChange={e => onChange(e.target.value)} />
      ) : (
        <input type="text" className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-[#0A6E6E] focus:outline-none" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  );
}

function SelectField({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-bold text-gray-500">{label}</label>
      <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-[#0A6E6E] focus:outline-none appearance-none" value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
