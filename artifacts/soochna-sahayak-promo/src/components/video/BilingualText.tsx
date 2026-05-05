import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface BilingualTextProps {
  english: string;
  hindi: string;
  className?: string;
  flipDelay?: number;
  flipDuration?: number;
  tag?: 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'div';
}

export function BilingualText({
  english,
  hindi,
  className = '',
  flipDelay = 2200,
  flipDuration = 0.55,
  tag: Tag = 'p',
}: BilingualTextProps) {
  const [showHindi, setShowHindi] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowHindi(true), flipDelay);
    return () => clearTimeout(t);
  }, [flipDelay]);

  return (
    <span className={`relative inline-block overflow-hidden ${className}`} style={{ minHeight: '1.2em' }}>
      <AnimatePresence mode="wait" initial={false}>
        {!showHindi ? (
          <motion.span
            key="english"
            className="block"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -28, filter: 'blur(4px)' }}
            transition={{
              enter: { duration: flipDuration, ease: [0.22, 1, 0.36, 1] },
              exit: { duration: flipDuration * 0.8, ease: [0.64, 0, 0.78, 0] },
            }}
          >
            {english}
          </motion.span>
        ) : (
          <motion.span
            key="hindi"
            className="block font-display"
            initial={{ opacity: 0, y: 28, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: flipDuration, ease: [0.22, 1, 0.36, 1] }}
          >
            {hindi}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
