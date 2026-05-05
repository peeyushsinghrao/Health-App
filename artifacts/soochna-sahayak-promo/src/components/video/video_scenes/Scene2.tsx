import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video/animations';
import { BilingualText } from '../BilingualText';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center"
      {...sceneTransitions.slideLeft}
    >
      <div className="w-full max-w-7xl mx-auto px-16 flex items-center justify-between" style={{ perspective: '1200px' }}>

        <div className="w-1/2 pr-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="inline-block px-4 py-1 rounded-full bg-bg-accent text-primary font-medium text-sm mb-6 border border-primary/20">
              <BilingualText
                english="AHWC Monthly Report"
                hindi="मासिक AHWC रिपोर्ट"
                flipDelay={3000}
              />
            </div>
            <h2 className="text-6xl font-display font-bold text-text-primary leading-tight mb-4">
              PLP रिपोर्ट
            </h2>
            <p className="text-2xl text-text-secondary leading-relaxed">
              <BilingualText
                english="Generate comprehensive monthly performance reports with automated data tables."
                hindi="स्वचालित डेटा तालिकाओं के साथ व्यापक मासिक प्रदर्शन रिपोर्ट तैयार करें।"
                flipDelay={2800}
              />
            </p>
          </motion.div>
        </div>

        <div className="w-1/2 relative z-10 h-[600px] flex items-center justify-center">
          <motion.div
            className="w-full aspect-[4/3] bg-surface rounded-2xl shadow-2xl overflow-hidden border border-text-muted/20 flex flex-col"
            initial={{ opacity: 0, rotateY: 30, x: 100, scale: 0.9 }}
            animate={phase >= 2 ? { opacity: 1, rotateY: -5, x: 0, scale: 1 } : { opacity: 0, rotateY: 30, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="h-12 bg-bg-elevated border-b border-text-muted/20 flex items-center px-4">
              <div className="w-3 h-3 rounded-full bg-error mr-2" />
              <div className="w-3 h-3 rounded-full bg-warning mr-2" />
              <div className="w-3 h-3 rounded-full bg-success" />
            </div>

            <div className="flex-1 p-6 flex flex-col gap-4">
              <motion.div
                className="h-8 w-1/3 bg-bg-accent rounded"
                initial={{ opacity: 0, width: 0 }}
                animate={phase >= 3 ? { opacity: 1, width: '33%' } : { opacity: 0, width: 0 }}
                transition={{ duration: 0.6 }}
              />
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <div className="h-10 w-12 bg-bg-elevated rounded" />
                  <div className="h-10 flex-1 bg-bg-elevated rounded" />
                  <div className="h-10 w-24 bg-bg-accent/50 rounded" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="absolute -right-8 -bottom-8 w-32 h-32 bg-accent/10 rounded-full blur-2xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>
      </div>
    </motion.div>
  );
}
