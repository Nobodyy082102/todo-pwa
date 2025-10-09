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
    // Coda del gatto invece della proboscide
    switch (animationType) {
      case 'jump':
        return {
          d: [
            "M 8 40 Q 4 35 6 30",
            "M 8 40 Q 2 38 4 32",
            "M 8 40 Q 3 36 5 28",
            "M 8 40 Q 4 35 6 30",
          ]
        };
      case 'celebrate':
        return {
          d: [
            "M 8 40 Q 4 35 6 30",
            "M 8 40 Q 0 40 2 34",
            "M 8 40 Q 2 32 4 26",
            "M 8 40 Q 0 38 3 30",
            "M 8 40 Q 4 34 7 28",
            "M 8 40 Q 4 35 6 30",
          ]
        };
      default:
        return {
          d: [
            "M 8 40 Q 4 35 6 30",
            "M 8 40 Q 3 37 5 32",
            "M 8 40 Q 4 35 6 30",
          ]
        };
    }
  };

  return (
    <div className="fixed top-20 left-6 md:top-24 md:left-8 z-[9999] pointer-events-none">
      <motion.div
        initial={{ scale: 0, opacity: 0, x: -50 }}
        animate={{
          scale: 1,
          opacity: 1,
          x: 0,
          ...getBodyAnimation()
        }}
        transition={{
          scale: {
            type: 'spring',
            stiffness: 150,
            damping: 15,
            duration: animationType === 'celebrate' ? 0.8 : 1
          },
          opacity: { duration: 0.6, ease: "easeOut" },
          x: { type: 'spring', stiffness: 100, damping: 20 },
          y: {
            duration: animationType === 'idle' ? 3 : animationType === 'jump' ? 1.2 : 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse"
          },
          rotate: {
            duration: animationType === 'celebrate' ? 2.5 : 1.5,
            repeat: animationType === 'celebrate' ? 3 : 0,
            ease: "easeInOut"
          }
        }}
      >
        {/* Gattino SVG sempre animato */}
        <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ombra */}
          <motion.ellipse
            cx="32"
            cy="54"
            rx="14"
            ry="3"
            fill="currentColor"
            className="text-gray-400 dark:text-gray-700"
            opacity="0.3"
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.2, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Corpo del gatto */}
          <motion.ellipse
            cx="32"
            cy="38"
            rx="14"
            ry="16"
            fill="currentColor"
            className="text-orange-500 dark:text-orange-600"
            animate={animationType === 'celebrate' ? { scale: [1, 1.1, 1, 1.05, 1] } : { scale: [1, 1.02, 1] }}
            transition={{
              duration: animationType === 'celebrate' ? 0.8 : 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Testa */}
          <motion.circle
            cx="32"
            cy="24"
            r="12"
            fill="currentColor"
            className="text-orange-500 dark:text-orange-600"
            animate={animationType === 'celebrate' ? { scale: [1, 1.1, 1, 1.05, 1] } : { scale: [1, 1.01, 1] }}
            transition={{
              duration: animationType === 'celebrate' ? 0.8 : 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2
            }}
          />

          {/* Orecchie fluide */}
          <motion.path
            d="M 22 18 L 18 8 L 26 16 Z"
            fill="currentColor"
            className="text-orange-500 dark:text-orange-600"
            animate={animationType !== 'idle' ? {
              rotate: [-5, 5, -5],
              transformOrigin: "22px 18px"
            } : {
              rotate: [0, -2, 0, -1, 0],
              transformOrigin: "22px 18px"
            }}
            transition={{
              duration: animationType === 'celebrate' ? 0.5 : 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.path
            d="M 42 18 L 46 8 L 38 16 Z"
            fill="currentColor"
            className="text-orange-500 dark:text-orange-600"
            animate={animationType !== 'idle' ? {
              rotate: [5, -5, 5],
              transformOrigin: "42px 18px"
            } : {
              rotate: [0, 2, 0, 1, 0],
              transformOrigin: "42px 18px"
            }}
            transition={{
              duration: animationType === 'celebrate' ? 0.5 : 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3
            }}
          />

          {/* Interno orecchie rosa */}
          <path d="M 22 18 L 20 12 L 24 16 Z" fill="#ff6b9d" opacity="0.6"/>
          <path d="M 42 18 L 44 12 L 40 16 Z" fill="#ff6b9d" opacity="0.6"/>

          {/* Occhi animati */}
          <motion.g
            animate={animationType === 'celebrate' ? {
              scale: [1, 1.3, 1, 1.2, 1],
              y: [0, -2, 0, -1, 0]
            } : {}}
            transition={{ duration: 0.5, repeat: animationType === 'celebrate' ? 4 : 0 }}
          >
            {/* Occhi grandi da gatto */}
            <motion.ellipse
              cx="26"
              cy="22"
              rx="3"
              ry="4"
              fill="#2d3748"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
            />
            <motion.ellipse
              cx="38"
              cy="22"
              rx="3"
              ry="4"
              fill="#2d3748"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
            />
            {/* Pupille */}
            <motion.ellipse
              cx="26"
              cy="22"
              rx="1.5"
              ry="2.5"
              fill="#10b981"
              animate={{ scaleY: [1, 0.1, 1], scaleX: [1, 0.8, 1] }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
            />
            <motion.ellipse
              cx="38"
              cy="22"
              rx="1.5"
              ry="2.5"
              fill="#10b981"
              animate={{ scaleY: [1, 0.1, 1], scaleX: [1, 0.8, 1] }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
            />
          </motion.g>

          {/* Naso rosa */}
          <motion.path
            d="M 32 26 L 30 28 L 34 28 Z"
            fill="#ff6b9d"
            animate={animationType === 'celebrate' ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3, repeat: animationType === 'celebrate' ? 5 : 0 }}
          />

          {/* Baffi fluidi */}
          <g className="opacity-70">
            {/* Sinistra */}
            <motion.line x1="18" y1="26" x2="10" y2="24" stroke="currentColor" strokeWidth="1.5" className="text-gray-600 dark:text-gray-400"
              animate={{ rotate: [0, -3, 0, -2, 0], transformOrigin: "18px 26px" }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.line x1="18" y1="28" x2="10" y2="30" stroke="currentColor" strokeWidth="1.5" className="text-gray-600 dark:text-gray-400"
              animate={{ rotate: [0, 3, 0, 2, 0], transformOrigin: "18px 28px" }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            {/* Destra */}
            <motion.line x1="46" y1="26" x2="54" y2="24" stroke="currentColor" strokeWidth="1.5" className="text-gray-600 dark:text-gray-400"
              animate={{ rotate: [0, 3, 0, 2, 0], transformOrigin: "46px 26px" }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.line x1="46" y1="28" x2="54" y2="30" stroke="currentColor" strokeWidth="1.5" className="text-gray-600 dark:text-gray-400"
              animate={{ rotate: [0, -3, 0, -2, 0], transformOrigin: "46px 28px" }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </g>

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

          {/* Bocca del gatto */}
          <motion.g>
            <motion.path
              d="M 32 28 Q 32 30 30 30"
              stroke="#2d3748"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            <motion.path
              d="M 32 28 Q 32 30 34 30"
              stroke="#2d3748"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            {animationType !== 'idle' && (
              <motion.path
                d="M 28 30 Q 32 33 36 30"
                stroke="#2d3748"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
            )}
          </motion.g>

          {/* Coda animata fluida */}
          <motion.path
            stroke="currentColor"
            className="text-orange-600 dark:text-orange-500"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
            animate={getTrunkAnimation()}
            transition={{
              duration: animationType === 'idle' ? 3.5 : animationType === 'jump' ? 1 : 2,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse"
            }}
          />

          {/* Zampe */}
          <motion.g>
            <ellipse cx="26" cy="50" rx="3" ry="4" fill="currentColor" className="text-orange-600 dark:text-orange-500"/>
            <ellipse cx="38" cy="50" rx="3" ry="4" fill="currentColor" className="text-orange-600 dark:text-orange-500"/>
          </motion.g>

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
