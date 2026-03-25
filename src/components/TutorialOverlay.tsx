'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'vita-mahjong-tutorial-done';

interface TutorialStep {
  target: string; // CSS selector or 'board-center'
  text: string;
  position: 'above' | 'below';
}

const STEPS: TutorialStep[] = [
  { target: '.tile.free', text: 'Tap a tile to pick it up', position: 'below' },
  { target: '.slot-bar', text: 'Tiles go here. Match 2 of the same to clear them', position: 'below' },
  { target: '.board-wrapper', text: 'Clear top tiles to reveal ones below', position: 'above' },
  { target: '.game-avatar', text: "Tap your cat to visit settings & skills", position: 'below' },
];

interface Props {
  onComplete: () => void;
}

export default function TutorialOverlay({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const updateRect = useCallback(() => {
    const selector = STEPS[step]?.target;
    if (!selector) return;
    const el = document.querySelector(selector);
    if (el) {
      setRect(el.getBoundingClientRect());
    }
  }, [step]);

  useEffect(() => {
    // Small delay to let dealing animation settle
    const t = setTimeout(updateRect, 200);
    window.addEventListener('resize', updateRect);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', updateRect);
    };
  }, [updateRect]);

  const advance = useCallback(() => {
    if (step >= STEPS.length - 1) {
      localStorage.setItem(STORAGE_KEY, '1');
      onComplete();
    } else {
      setStep(s => s + 1);
    }
  }, [step, onComplete]);

  const skip = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, '1');
    onComplete();
  }, [onComplete]);

  if (!rect) return null;

  const pad = 8;
  const spotLeft = rect.left - pad;
  const spotTop = rect.top - pad;
  const spotW = rect.width + pad * 2;
  const spotH = rect.height + pad * 2;
  const current = STEPS[step];

  return (
    <div
      className="tutorial-overlay"
      onClick={advance}
      style={{ position: 'fixed', inset: 0, zIndex: 20000 }}
    >
      {/* Dark backdrop with cutout */}
      <div
        style={{
          position: 'absolute',
          left: spotLeft,
          top: spotTop,
          width: spotW,
          height: spotH,
          borderRadius: 12,
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.65)',
          pointerEvents: 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />

      {/* Pulsing ring around spotlight */}
      <motion.div
        style={{
          position: 'absolute',
          left: spotLeft - 3,
          top: spotTop - 3,
          width: spotW + 6,
          height: spotH + 6,
          borderRadius: 14,
          border: '2px solid rgba(252, 211, 77, 0.5)',
          pointerEvents: 'none',
        }}
        animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.02, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Text bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="tutorial-bubble"
          style={{
            position: 'absolute',
            left: '50%',
            ...(current.position === 'below'
              ? { top: spotTop + spotH + 20 }
              : { top: spotTop - 20, transform: 'translate(-50%, -100%)' }),
          }}
          initial={{ opacity: 0, y: current.position === 'below' ? -10 : 10 }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: current.position === 'below' ? -10 : 10 }}
          transition={{ duration: 0.3 }}
        >
          <p className="tutorial-text">{current.text}</p>
          <div className="tutorial-dots">
            {STEPS.map((_, i) => (
              <div key={i} className={`tutorial-dot ${i === step ? 'active' : ''}`} />
            ))}
          </div>
          <span className="tutorial-tap">Tap to continue</span>
        </motion.div>
      </AnimatePresence>

      {/* Skip button */}
      <button
        className="tutorial-skip"
        onClick={(e) => { e.stopPropagation(); skip(); }}
      >
        Skip
      </button>
    </div>
  );
}

export function useTutorial() {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      // Show after dealing animation
      const t = setTimeout(() => setShowTutorial(true), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  const completeTutorial = useCallback(() => {
    setShowTutorial(false);
  }, []);

  return { showTutorial, completeTutorial };
}
