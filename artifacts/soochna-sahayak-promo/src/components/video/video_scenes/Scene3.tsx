import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video/animations';
import { BilingualText } from '../BilingualText';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      {...sceneTransitions.wipe}
    >
      <div className="w-full max-w-7xl mx-auto px-16 flex flex-col items-center" style={{ perspective: '1000px' }}>

        <motion.div
          className="text-center mb-12 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h2 className="text-5xl font-display font-bold text-text-primary mb-3">
            कार्मिक उपस्थिति &amp; योग शिक्षक
          </h2>
          <p className="text-2xl text-text-secondary max-w-2xl mx-auto">
            <BilingualText
              english="Effortless staff attendance tracking and Yoga instructor payment reports."
              hindi="कर्मचारी उपस्थिति और योग प्रशिक्षक भुगतान रिपोर्ट।"
              flipDelay={2600}
            />
          </p>
        </motion.div>

        <div className="flex gap-8 w-full justify-center relative z-10">
          {/* Card 1 */}
          <motion.div
            className="w-1/3 aspect-square bg-surface rounded-2xl shadow-xl p-8 border border-text-muted/10 relative overflow-hidden"
            initial={{ opacity: 0, y: 50, rotateX: 20 }}
            animate={phase >= 2 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px]" />
            <div className="w-16 h-16 bg-bg-accent rounded-xl flex items-center justify-center mb-4">
              <div className="w-8 h-8 rounded-full border-2 border-primary opacity-50" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-2">
              <BilingualText
                english="Staff Attendance"
                hindi="कार्मिक उपस्थिति"
                flipDelay={3200}
              />
            </h3>
            <p className="text-text-secondary text-sm">
              <BilingualText
                english="Track daily presence, leaves, and holidays with precision."
                hindi="दैनिक उपस्थिति, अवकाश और त्योहार सटीकता से ट्रैक करें।"
                flipDelay={3600}
              />
            </p>
            <motion.div className="mt-6 space-y-3">
              {[1, 2, 3].map(i => (
                <motion.div key={i} className="h-2 w-full bg-bg-elevated rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={phase >= 3 ? { width: `${80 - i * 15}%` } : { width: 0 }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            className="w-1/3 aspect-square bg-surface rounded-2xl shadow-xl p-8 border border-text-muted/10 relative overflow-hidden"
            initial={{ opacity: 0, y: 50, rotateX: 20 }}
            animate={phase >= 2 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-[100px]" />
            <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <div className="w-8 h-8 border-2 border-accent opacity-50 rotate-45" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-2">
              <BilingualText
                english="Yoga Instructors"
                hindi="योग प्रशिक्षक"
                flipDelay={3400}
              />
            </h3>
            <p className="text-text-secondary text-sm">
              <BilingualText
                english="Automate payment calculation based on sessions conducted."
                hindi="संचालित सत्रों के आधार पर भुगतान स्वचालित रूप से करें।"
                flipDelay={3800}
              />
            </p>
            <motion.div className="mt-6 flex gap-2 items-end h-12">
              {[1, 2, 3, 4, 5].map(i => (
                <motion.div
                  key={i}
                  className="flex-1 bg-accent/20 rounded-t-sm"
                  initial={{ height: 0 }}
                  animate={phase >= 3 ? { height: `${40 + i * 7}px` } : { height: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                  style={{ alignSelf: 'flex-end' }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
