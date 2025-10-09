import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Mascot({ onTaskAdded, onTaskCompleted }) {
  const [expression, setExpression] = useState('neutral'); // neutral, smile, wave
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (onTaskAdded > 0) {
      setExpression('smile');
      setMessage('Ottimo lavoro!');
      setShowMessage(true);

      const timer = setTimeout(() => {
        setExpression('neutral');
        setShowMessage(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [onTaskAdded]);

  useEffect(() => {
    if (onTaskCompleted > 0) {
      setExpression('wave');
      setMessage('Ben fatto! 👏');
      setShowMessage(true);

      const timer = setTimeout(() => {
        setExpression('neutral');
        setShowMessage(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [onTaskCompleted]);

  // SVG elefantino minimal professionale
  const renderElephant = () => {
    switch (expression) {
      case 'smile':
        return (
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Corpo */}
            <circle cx="32" cy="32" r="20" fill="currentColor" className="text-gray-400 dark:text-gray-600" opacity="0.2"/>
            <circle cx="32" cy="32" r="18" fill="currentColor" className="text-blue-500"/>

            {/* Occhi (felici) */}
            <motion.path
              d="M 24 28 Q 26 32 28 28"
              stroke="white"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.path
              d="M 36 28 Q 38 32 40 28"
              stroke="white"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Sorriso */}
            <motion.path
              d="M 22 36 Q 32 42 42 36"
              stroke="white"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />

            {/* Proboscide */}
            <path d="M 32 46 Q 28 54 32 58" stroke="currentColor" className="text-blue-600 dark:text-blue-400" strokeWidth="3" fill="none" strokeLinecap="round"/>
          </svg>
        );

      case 'wave':
        return (
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Corpo */}
            <circle cx="32" cy="32" r="20" fill="currentColor" className="text-gray-400 dark:text-gray-600" opacity="0.2"/>
            <circle cx="32" cy="32" r="18" fill="currentColor" className="text-blue-500"/>

            {/* Occhi (chiusi felici) */}
            <path d="M 24 30 Q 26 28 28 30" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M 36 30 Q 38 28 40 30" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>

            {/* Sorriso grande */}
            <path d="M 20 36 Q 32 44 44 36" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

            {/* Proboscide che saluta (animata) */}
            <motion.path
              d="M 32 46 Q 24 50 20 46"
              stroke="currentColor"
              className="text-blue-600 dark:text-blue-400"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              animate={{
                d: [
                  "M 32 46 Q 24 50 20 46",
                  "M 32 46 Q 24 42 20 38",
                  "M 32 46 Q 24 50 20 46"
                ]
              }}
              transition={{
                duration: 0.6,
                repeat: 2,
                ease: "easeInOut"
              }}
            />
          </svg>
        );

      default: // neutral
        return (
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Corpo */}
            <circle cx="32" cy="32" r="20" fill="currentColor" className="text-gray-400 dark:text-gray-600" opacity="0.15"/>
            <circle cx="32" cy="32" r="18" fill="currentColor" className="text-gray-500 dark:text-gray-600"/>

            {/* Occhi */}
            <circle cx="26" cy="30" r="2" fill="white"/>
            <circle cx="38" cy="30" r="2" fill="white"/>

            {/* Bocca */}
            <path d="M 26 38 Q 32 40 38 38" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>

            {/* Proboscide */}
            <path d="M 32 46 Q 28 54 32 58" stroke="currentColor" className="text-gray-600 dark:text-gray-500" strokeWidth="3" fill="none" strokeLinecap="round"/>
          </svg>
        );
    }
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-30">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="relative"
      >
        {/* Elefantino */}
        <motion.div
          animate={expression === 'wave' ? { rotate: [0, -10, 10, -10, 0] } : {}}
          transition={{ duration: 0.6, repeat: expression === 'wave' ? 2 : 0 }}
        >
          {renderElephant()}
        </motion.div>

        {/* Messaggio tooltip */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap border border-gray-200 dark:border-gray-700"
            >
              {message}
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
