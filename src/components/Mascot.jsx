import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Mascot({ onTaskAdded, onTaskCompleted }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState('idle'); // idle, celebrate, jump

  useEffect(() => {
    if (onTaskAdded > 0) {
      setIsAnimating(true);
      setAnimationType('jump');

      const timer = setTimeout(() => {
        setIsAnimating(false);
        setAnimationType('idle');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [onTaskAdded]);

  useEffect(() => {
    if (onTaskCompleted > 0) {
      setIsAnimating(true);
      setAnimationType('celebrate');

      const timer = setTimeout(() => {
        setIsAnimating(false);
        setAnimationType('idle');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [onTaskCompleted]);

  // Determina le varianti di animazione
  const getBodyAnimation = () => {
    switch (animationType) {
      case 'jump':
        return {
          y: [0, -20, -10, -20, 0],
          rotate: [0, -5, 5, -5, 0],
          scale: [1, 1.1, 1.05, 1.1, 1],
        };
      case 'celebrate':
        return {
          rotate: [0, -15, 15, -15, 15, -10, 10, 0],
          scale: [1, 1.15, 1, 1.15, 1, 1.1, 1],
          y: [0, -10, 0, -5, 0],
        };
      default: // idle
        return {
          y: [0, -3, 0],
          scale: [1, 1.02, 1],
        };
    }
  };

  const getTrunkAnimation = () => {
    switch (animationType) {
      case 'jump':
        return {
          d: [
            "M 32 46 Q 28 54 32 58",
            "M 32 46 Q 36 52 32 58",
            "M 32 46 Q 24 52 28 58",
            "M 32 46 Q 28 54 32 58",
          ]
        };
      case 'celebrate':
        return {
          d: [
            "M 32 46 Q 28 54 32 58",
            "M 32 46 Q 20 50 18 54",
            "M 32 46 Q 44 50 46 54",
            "M 32 46 Q 20 52 16 58",
            "M 32 46 Q 44 52 48 58",
            "M 32 46 Q 28 54 32 58",
          ]
        };
      default:
        return {
          d: [
            "M 32 46 Q 28 54 32 58",
            "M 32 46 Q 30 55 32 58",
            "M 32 46 Q 28 54 32 58",
          ]
        };
    }
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-30 pointer-events-none">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          ...getBodyAnimation()
        }}
        transition={{
          scale: { type: 'spring', stiffness: 200 },
          opacity: { duration: 0.3 },
          y: {
            duration: animationType === 'idle' ? 2 : animationType === 'jump' ? 1 : 2,
            repeat: Infinity,
            ease: "easeInOut"
          },
          rotate: {
            duration: animationType === 'celebrate' ? 2 : 1,
            repeat: animationType === 'celebrate' ? 3 : 0,
          },
        }}
      >
        {/* Elefantino SVG sempre animato */}
        <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ombra */}
          <motion.ellipse
            cx="32"
            cy="52"
            rx="12"
            ry="3"
            fill="currentColor"
            className="text-gray-400 dark:text-gray-700"
            opacity="0.3"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Corpo */}
          <motion.circle
            cx="32"
            cy="30"
            r="18"
            fill="currentColor"
            className="text-blue-500 dark:text-blue-600"
            animate={animationType === 'celebrate' ? { scale: [1, 1.1, 1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, repeat: animationType === 'celebrate' ? 4 : 0 }}
          />

          {/* Occhi animati */}
          <motion.g
            animate={animationType === 'celebrate' ? {
              scale: [1, 1.3, 1, 1.2, 1],
              y: [0, -2, 0, -1, 0]
            } : {}}
            transition={{ duration: 0.5, repeat: animationType === 'celebrate' ? 4 : 0 }}
          >
            <motion.circle
              cx="24"
              cy="26"
              r="2.5"
              fill="white"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
            <motion.circle
              cx="40"
              cy="26"
              r="2.5"
              fill="white"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
          </motion.g>

          {/* Guance rosa (compaiono quando celebra/salta) */}
          <AnimatePresence>
            {animationType !== 'idle' && (
              <>
                <motion.circle
                  cx="18"
                  cy="32"
                  r="4"
                  fill="#ff6b9d"
                  opacity="0.4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                />
                <motion.circle
                  cx="46"
                  cy="32"
                  r="4"
                  fill="#ff6b9d"
                  opacity="0.4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                />
              </>
            )}
          </AnimatePresence>

          {/* Bocca (cambia espressione) */}
          <motion.path
            d={animationType === 'idle' ? "M 26 36 Q 32 38 38 36" : "M 24 36 Q 32 42 40 36"}
            stroke="white"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            animate={{
              d: animationType === 'idle'
                ? ["M 26 36 Q 32 38 38 36", "M 26 36 Q 32 37 38 36", "M 26 36 Q 32 38 38 36"]
                : undefined
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Proboscide super animata */}
          <motion.path
            stroke="currentColor"
            className="text-blue-600 dark:text-blue-400"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            animate={getTrunkAnimation()}
            transition={{
              duration: animationType === 'idle' ? 2 : animationType === 'jump' ? 0.8 : 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Particelle celebrative */}
          <AnimatePresence>
            {animationType === 'celebrate' && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.circle
                    key={i}
                    cx="32"
                    cy="30"
                    r="2"
                    fill={['#fbbf24', '#f59e0b', '#60a5fa', '#3b82f6'][i % 4]}
                    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1, 0],
                      x: Math.cos(i * 45 * Math.PI / 180) * 25,
                      y: Math.sin(i * 45 * Math.PI / 180) * 25,
                      opacity: [1, 1, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: 2,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </svg>
      </motion.div>
    </div>
  );
}
