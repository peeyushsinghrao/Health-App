import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video/animations';
import { BilingualText } from '../BilingualText';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      {...sceneTransitions.morphExpand}
    >
      <div className="w-full max-w-7xl mx-auto px-16 flex flex-row-reverse items-center justify-between" style={{ perspective: '1200px' }}>

        <div className="w-[45%] pl-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h2 className="text-6xl font-display font-bold text-text-primary leading-tight mb-2">
              <BilingualText
                english={<>One-Click<br /><span className="text-accent">PDF Export</span></>}
                hindi={<>एक क्लिक<br /><span className="text-accent">पीडीएफ निर्यात</span></>}
                flipDelay={3000}
                tag="span"
              />
            </h2>
            <p className="text-2xl text-text-secondary leading-relaxed mb-8">
              <BilingualText
                english="Generate print-ready A4 documents instantly. Works entirely offline as a Progressive Web App."
                hindi="तुरंत प्रिंट-तैयार A4 दस्तावेज़ बनाएं। पूर्णतः ऑफलाइन Progressive Web App के रूप में कार्य करता है।"
                flipDelay={2800}
              />
            </p>

            <motion.div
              className="inline-flex items-center px-6 py-3 bg-primary text-text-inverse rounded-lg font-medium shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={phase >= 2 ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <svg className="w-6 h-6 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <BilingualText
                english="Download PDF"
                hindi="पीडीएफ डाउनलोड करें"
                flipDelay={4000}
              />
            </motion.div>
          </motion.div>
        </div>

        <div className="w-[55%] relative z-10 h-[600px] flex items-center justify-center">
          {[2, 1, 0].map((i) => (
            <motion.div
              key={i}
              className="absolute w-[350px] aspect-[1/1.414] bg-surface rounded-sm shadow-xl border border-text-muted/10 p-6 flex flex-col"
              initial={{ opacity: 0, y: i * 20 + 50, rotate: i * 5, rotateX: 60 }}
              animate={phase >= 2 ? { opacity: 1 - (i * 0.2), y: i * 15, rotate: i * -4, rotateX: 10, z: -i * 50 }
                : { opacity: 0, y: i * 20 + 50, rotate: i * 5, rotateX: 60 }}
              transition={{ duration: 1, delay: 0.2 + (2 - i) * 0.15, ease: 'easeOut' }}
              style={{ zIndex: 10 - i }}
            >
              {i === 0 && (
                <>
                  <div className="w-full flex justify-between items-center mb-8 border-b border-text-muted/20 pb-4">
                    <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center">
                      <span className="text-primary text-xs font-display">स</span>
                    </div>
                    <div className="text-right">
                      <div className="h-2 w-24 bg-text-muted/20 rounded mb-2 ml-auto" />
                      <div className="h-2 w-16 bg-text-muted/20 rounded ml-auto" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6].map(j => (
                      <div key={j} className="h-2 w-full bg-bg-elevated rounded" />
                    ))}
                    <div className="h-2 w-2/3 bg-bg-elevated rounded" />
                  </div>
                  <div className="mt-auto flex justify-between pt-8">
                    <div className="h-8 w-24 bg-bg-accent rounded" />
                    <div className="h-8 w-24 bg-primary/10 rounded" />
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
