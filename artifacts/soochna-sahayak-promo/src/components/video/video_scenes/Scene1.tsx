import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video/animations';
import { BilingualText } from '../BilingualText';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setPhase(4), 5000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      {...sceneTransitions.clipCircle}
    >
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center px-12" style={{ perspective: '1000px' }}>

        <motion.div
          className="absolute text-[40vw] text-primary/5 font-display leading-none select-none z-0"
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 4, ease: 'easeOut' }}
        >
          स
        </motion.div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-6 flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center mb-4 bg-primary/10">
              <span className="text-primary font-display text-3xl">स</span>
            </div>
            <BilingualText
              english="Ayurveda Department"
              hindi="आयुर्वेद विभाग"
              className="text-accent uppercase tracking-widest text-sm font-semibold"
              flipDelay={3800}
            />
          </motion.div>

          <motion.h1
            className="text-7xl md:text-8xl font-display font-bold text-text-primary mb-6"
            initial={{ opacity: 0, rotateX: -30, y: 40 }}
            animate={phase >= 2 ? { opacity: 1, rotateX: 0, y: 0 } : { opacity: 0, rotateX: -30, y: 40 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            सूचना सहायक<br />
            <span className="text-4xl md:text-5xl text-text-secondary font-body font-normal mt-4 block">Soochna Sahayak</span>
          </motion.h1>

          <motion.div
            className="h-[2px] bg-primary mx-auto"
            initial={{ width: 0, opacity: 0 }}
            animate={phase >= 2 ? { width: '120px', opacity: 1 } : { width: 0, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />

          <motion.p
            className="mt-8 text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
          >
            <BilingualText
              english="Smart Office Assistant for streamlining administrative workflows."
              hindi="प्रशासनिक कार्यों को सरल बनाने वाला स्मार्ट कार्यालय सहायक।"
              flipDelay={4200}
            />
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
