import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video/animations';
import { BilingualText } from '../BilingualText';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-primary"
      {...sceneTransitions.clipCircle}
    >
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-12">

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="w-24 h-24 rounded-full border-4 border-bg-light flex items-center justify-center mb-8"
        >
          <span className="text-bg-light font-display text-5xl">स</span>
        </motion.div>

        <motion.h1
          className="text-6xl font-display font-bold text-text-inverse mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          सूचना सहायक
        </motion.h1>

        <motion.p
          className="text-2xl text-bg-light/70 font-body mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Soochna Sahayak
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-bg-accent/80 font-body tracking-wide mb-8"
        >
          <BilingualText
            english="Empowering Ayurveda Administration"
            hindi="आयुर्वेद प्रशासन को सशक्त बनाना"
            flipDelay={3200}
          />
        </motion.div>

        <motion.div
          className="h-px w-24 bg-bg-light/30 mx-auto mb-8"
          initial={{ width: 0 }}
          animate={phase >= 2 ? { width: '96px' } : { width: 0 }}
          transition={{ duration: 0.8 }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-bg-light/70 text-lg flex flex-col items-center gap-1"
        >
          <span>Created by</span>
          <span className="font-medium text-bg-light text-xl">Peeyush Singh Rao</span>
          <span className="text-sm">
            <BilingualText
              english="Assistant Accounts Officer Grade II"
              hindi="सहायक लेखा अधिकारी श्रेणी II"
              flipDelay={4500}
            />
          </span>
        </motion.div>

      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-bg-light/5"
            style={{
              width: (i * 37 % 100) + 50,
              height: (i * 37 % 100) + 50,
              left: `${i * 23 % 100}%`,
              top: `${i * 17 % 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, i % 2 === 0 ? 25 : -25, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: (i % 5) * 4 + 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
