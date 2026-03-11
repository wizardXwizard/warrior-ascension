import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, X } from 'lucide-react';

interface PanicModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PanicMode = ({ isOpen, onClose }: PanicModeProps) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(300);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-8 max-w-xs"
          >
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-accent-red/20 border-2 border-accent-red animate-pulse">
                <ShieldAlert size={48} className="text-accent-red" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-accent-red tracking-tighter">STAY CALM</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Urges are temporary. They pass like waves. Stand up, move your body, and breathe.
              </p>
            </div>

            <div className="text-6xl font-black font-orbitron tabular-nums text-glow-red">
              {formatTime(timeLeft)}
            </div>

            <div className="space-y-4 pt-8">
              <p className="text-xs text-gray-500 uppercase tracking-widest italic">
                You are stronger than a chemical impulse.
              </p>
              <button
                onClick={onClose}
                className="w-full btn-secondary py-4"
              >
                I AM IN CONTROL
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
