import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Mascot({ onTaskAdded, onTaskCompleted }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState('idle'); // idle, celebrate, jump
  const [showReminder, setShowReminder] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');

  // Messaggi promemoria casuali
  const reminderMessages = [
    "Hai attività in sospeso! 📝",
    "Ricorda di completare i tuoi task! ✨",
    "Forza! Ce la puoi fare! 💪",
    "Dai un'occhiata alle tue attività 👀",
    "È il momento di essere produttivi! 🚀",
    "Controlla la tua lista TODO! 📋",
    "Piccoli passi, grandi risultati! 🎯",
    "Ogni attività completata è una vittoria! 🏆",
    "Mantieni il focus! 🎯",
    "Sei a un passo dal successo! ⭐",
  ];

  // Sistema di promemoria casuali (ogni 2-4 minuti)
  useEffect(() => {
    const showRandomReminder = () => {
      const randomMessage = reminderMessages[Math.floor(Math.random() * reminderMessages.length)];
      setReminderMessage(randomMessage);
      setShowReminder(true);

      // Nascondi dopo 5 secondi
      setTimeout(() => {
        setShowReminder(false);
      }, 5000);
    };

    // Primo promemoria dopo 2 minuti
    const firstTimer = setTimeout(() => {
      showRandomReminder();
    }, 120000); // 2 minuti

    // Promemoria successivi ogni 3 minuti
    const interval = setInterval(() => {
      showRandomReminder();
    }, 180000); // 3 minuti

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, []);

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
          y: [0, -25, -12, -25, 0],
          rotate: [0, -8, 8, -8, 0],
          scale: [1, 1.12, 1.06, 1.12, 1],
        };
      case 'celebrate':
        return {
          rotate: [0, -18, 18, -18, 18, -12, 12, 0],
          scale: [1, 1.18, 1, 1.18, 1, 1.12, 1],
          y: [0, -12, 0, -8, 0],
        };
      default: // idle
        return {
          y: [0, -4, 0],
          scale: [1, 1.03, 1],
        };
    }
  };

  const getTailAnimation = () => {
    switch (animationType) {
      case 'jump':
        return {
          d: [
            "M 8 40 Q 2 38 4 30",
            "M 8 40 Q 0 40 2 32",
            "M 8 40 Q 1 36 3 28",
            "M 8 40 Q 2 38 4 30",
          ]
        };
      case 'celebrate':
        return {
          d: [
            "M 8 40 Q 2 38 4 30",
            "M 8 40 Q -2 42 0 34",
            "M 8 40 Q 1 30 3 24",
            "M 8 40 Q -1 40 2 32",
            "M 8 40 Q 3 32 6 26",
            "M 8 40 Q 2 38 4 30",
          ]
        };
      default:
        return {
          d: [
            "M 8 40 Q 2 38 4 30",
            "M 8 40 Q 1 36 3 32",
            "M 8 40 Q 2 38 4 30",
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
            stiffness: 180,
            damping: 18,
            duration: animationType === 'celebrate' ? 0.7 : 0.9
          },
          opacity: { duration: 0.6, ease: "easeOut" },
          x: { type: 'spring', stiffness: 120, damping: 22 },
          y: {
            duration: animationType === 'idle' ? 3.5 : animationType === 'jump' ? 1.3 : 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse"
          },
          rotate: {
            duration: animationType === 'celebrate' ? 2.2 : 1.8,
            repeat: animationType === 'celebrate' ? 3 : 0,
            ease: "easeInOut"
          }
        }}
      >
        {/* Gattino Arancione e Bianco SVG */}
        <svg width="85" height="85" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ombra dinamica */}
          <motion.ellipse
            cx="32"
            cy="54"
            rx="15"
            ry="3.5"
            fill="currentColor"
            className="text-gray-400 dark:text-gray-700"
            opacity="0.35"
            animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.22, 0.35] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Corpo arancione con pancia bianca */}
          <motion.ellipse
            cx="32"
            cy="38"
            rx="14"
            ry="16"
            fill="#FF8C42"
            animate={animationType === 'celebrate' ? { scale: [1, 1.12, 1, 1.06, 1] } : { scale: [1, 1.03, 1] }}
            transition={{
              duration: animationType === 'celebrate' ? 0.7 : 3.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Pancia bianca */}
          <motion.ellipse
            cx="32"
            cy="40"
            rx="10"
            ry="13"
            fill="#FFFFFF"
            animate={animationType === 'celebrate' ? { scale: [1, 1.1, 1, 1.05, 1] } : { scale: [1, 1.02, 1] }}
            transition={{
              duration: animationType === 'celebrate' ? 0.7 : 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1
            }}
          />

          {/* Testa arancione */}
          <motion.circle
            cx="32"
            cy="24"
            r="13"
            fill="#FF8C42"
            animate={animationType === 'celebrate' ? { scale: [1, 1.12, 1, 1.06, 1] } : { scale: [1, 1.02, 1] }}
            transition={{
              duration: animationType === 'celebrate' ? 0.7 : 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2
            }}
          />

          {/* Strisce tigrate arancione scuro sulla testa */}
          <path d="M 24 18 Q 26 16 28 18" stroke="#E67529" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.7"/>
          <path d="M 36 18 Q 38 16 40 18" stroke="#E67529" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.7"/>
          <path d="M 28 22 Q 30 20 32 22" stroke="#E67529" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
          <path d="M 32 22 Q 34 20 36 22" stroke="#E67529" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>

          {/* Muso bianco */}
          <circle cx="32" cy="27" r="7" fill="#FFFFFF"/>

          {/* Orecchie arancioni fluide */}
          <motion.path
            d="M 21 17 L 16 6 L 26 15 Z"
            fill="#FF8C42"
            animate={animationType !== 'idle' ? {
              rotate: [-8, 8, -8],
              transformOrigin: "21px 17px"
            } : {
              rotate: [0, -3, 0, -2, 0],
              transformOrigin: "21px 17px"
            }}
            transition={{
              duration: animationType === 'celebrate' ? 0.6 : 4.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.path
            d="M 43 17 L 48 6 L 38 15 Z"
            fill="#FF8C42"
            animate={animationType !== 'idle' ? {
              rotate: [8, -8, 8],
              transformOrigin: "43px 17px"
            } : {
              rotate: [0, 3, 0, 2, 0],
              transformOrigin: "43px 17px"
            }}
            transition={{
              duration: animationType === 'celebrate' ? 0.6 : 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3
            }}
          />

          {/* Interno orecchie rosa chiaro */}
          <path d="M 21 17 L 19 10 L 24 15 Z" fill="#FFB6C1" opacity="0.7"/>
          <path d="M 43 17 L 45 10 L 40 15 Z" fill="#FFB6C1" opacity="0.7"/>

          {/* Occhi grandi da gatto - più realistici */}
          <motion.g
            animate={animationType === 'celebrate' ? {
              scale: [1, 1.35, 1, 1.25, 1],
              y: [0, -2.5, 0, -1.5, 0]
            } : {}}
            transition={{ duration: 0.6, repeat: animationType === 'celebrate' ? 4 : 0 }}
          >
            {/* Occhi ambra */}
            <motion.ellipse
              cx="26"
              cy="23"
              rx="3.5"
              ry="5"
              fill="#FFA500"
              animate={{ scaleY: [1, 0.08, 1] }}
              transition={{ duration: 0.18, repeat: Infinity, repeatDelay: 4.2, ease: "easeInOut" }}
            />
            <motion.ellipse
              cx="38"
              cy="23"
              rx="3.5"
              ry="5"
              fill="#FFA500"
              animate={{ scaleY: [1, 0.08, 1] }}
              transition={{ duration: 0.18, repeat: Infinity, repeatDelay: 4.2, ease: "easeInOut" }}
            />
            {/* Pupille a fessura verticale */}
            <motion.ellipse
              cx="26"
              cy="23"
              rx="1"
              ry="3.5"
              fill="#1a1a1a"
              animate={{ scaleY: [1, 0.08, 1] }}
              transition={{ duration: 0.18, repeat: Infinity, repeatDelay: 4.2, ease: "easeInOut" }}
            />
            <motion.ellipse
              cx="38"
              cy="23"
              rx="1"
              ry="3.5"
              fill="#1a1a1a"
              animate={{ scaleY: [1, 0.08, 1] }}
              transition={{ duration: 0.18, repeat: Infinity, repeatDelay: 4.2, ease: "easeInOut" }}
            />
            {/* Riflessi luminosi */}
            <circle cx="27" cy="21.5" r="1" fill="white" opacity="0.8"/>
            <circle cx="39" cy="21.5" r="1" fill="white" opacity="0.8"/>
          </motion.g>

          {/* Naso rosa a triangolo */}
          <motion.path
            d="M 32 27 L 30 29.5 L 34 29.5 Z"
            fill="#FF9AA2"
            animate={animationType === 'celebrate' ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.35, repeat: animationType === 'celebrate' ? 5 : 0 }}
          />

          {/* Baffi più lunghi e realistici */}
          <g className="opacity-80">
            {/* Sinistra - 3 baffi */}
            <motion.line x1="16" y1="27" x2="6" y2="25" stroke="#555555" strokeWidth="1.2" strokeLinecap="round"
              animate={{ rotate: [0, -4, 0, -2.5, 0], transformOrigin: "16px 27px" }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.line x1="16" y1="29" x2="5" y2="29" stroke="#555555" strokeWidth="1.2" strokeLinecap="round"
              animate={{ rotate: [0, -2, 0, -1, 0], transformOrigin: "16px 29px" }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />
            <motion.line x1="16" y1="31" x2="6" y2="33" stroke="#555555" strokeWidth="1.2" strokeLinecap="round"
              animate={{ rotate: [0, 4, 0, 2.5, 0], transformOrigin: "16px 31px" }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            />
            {/* Destra - 3 baffi */}
            <motion.line x1="48" y1="27" x2="58" y2="25" stroke="#555555" strokeWidth="1.2" strokeLinecap="round"
              animate={{ rotate: [0, 4, 0, 2.5, 0], transformOrigin: "48px 27px" }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.line x1="48" y1="29" x2="59" y2="29" stroke="#555555" strokeWidth="1.2" strokeLinecap="round"
              animate={{ rotate: [0, 2, 0, 1, 0], transformOrigin: "48px 29px" }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />
            <motion.line x1="48" y1="31" x2="58" y2="33" stroke="#555555" strokeWidth="1.2" strokeLinecap="round"
              animate={{ rotate: [0, -4, 0, -2.5, 0], transformOrigin: "48px 31px" }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            />
          </g>

          {/* Guance rosa (appaiono quando emozionato) */}
          <AnimatePresence>
            {animationType !== 'idle' && (
              <>
                <motion.circle
                  cx="17"
                  cy="30"
                  r="4.5"
                  fill="#FFB6C1"
                  opacity="0.5"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                />
                <motion.circle
                  cx="47"
                  cy="30"
                  r="4.5"
                  fill="#FFB6C1"
                  opacity="0.5"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                />
              </>
            )}
          </AnimatePresence>

          {/* Bocca del gatto a W */}
          <motion.g>
            <motion.path
              d="M 32 29.5 Q 30 31 28 31"
              stroke="#333"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
            />
            <motion.path
              d="M 32 29.5 Q 34 31 36 31"
              stroke="#333"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
            />
            {animationType !== 'idle' && (
              <motion.path
                d="M 27 31 Q 32 35 37 31"
                stroke="#333"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
            )}
          </motion.g>

          {/* Coda arancione animata super fluida */}
          <motion.path
            stroke="#FF8C42"
            strokeWidth="5.5"
            fill="none"
            strokeLinecap="round"
            animate={getTailAnimation()}
            transition={{
              duration: animationType === 'idle' ? 4 : animationType === 'jump' ? 1.2 : 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse"
            }}
          />
          {/* Punta coda bianca */}
          <motion.circle
            cx="4"
            cy="30"
            r="3"
            fill="#FFFFFF"
            animate={{
              x: animationType === 'idle' ? [0, -1, 0] : animationType === 'jump' ? [-2, 2, -2] : [-3, 3, -3],
              y: animationType === 'idle' ? [0, -1, 0] : [-2, 2, -2]
            }}
            transition={{
              duration: animationType === 'idle' ? 4 : animationType === 'jump' ? 1.2 : 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse"
            }}
          />

          {/* Zampe arancioni con cuscinetti bianchi */}
          <motion.g>
            <ellipse cx="26" cy="50" rx="3.5" ry="4.5" fill="#FF8C42"/>
            <ellipse cx="38" cy="50" rx="3.5" ry="4.5" fill="#FF8C42"/>
            <ellipse cx="26" cy="51" rx="2.5" ry="3" fill="#FFB6C1"/>
            <ellipse cx="38" cy="51" rx="2.5" ry="3" fill="#FFB6C1"/>
          </motion.g>

          {/* Particelle celebrative colorate */}
          <AnimatePresence>
            {animationType === 'celebrate' && (
              <>
                {[...Array(12)].map((_, i) => (
                  <motion.circle
                    key={i}
                    cx="32"
                    cy="28"
                    r="2.5"
                    fill={['#FFD700', '#FF8C42', '#FFB6C1', '#87CEEB', '#98FB98', '#DDA0DD'][i % 6]}
                    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1.2, 0],
                      x: Math.cos(i * 30 * Math.PI / 180) * 30,
                      y: Math.sin(i * 30 * Math.PI / 180) * 30,
                      opacity: [1, 1, 0],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: 2,
                      delay: i * 0.08,
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Stelline occasionali intorno */}
          {animationType === 'celebrate' && (
            <>
              <motion.text
                x="10"
                y="20"
                fontSize="12"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: [0, 1, 0], rotate: [0, 180, 360] }}
                transition={{ duration: 1.5, repeat: 2 }}
              >
                ✨
              </motion.text>
              <motion.text
                x="50"
                y="18"
                fontSize="12"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: [0, 1, 0], rotate: [0, -180, -360] }}
                transition={{ duration: 1.5, repeat: 2, delay: 0.3 }}
              >
                ⭐
              </motion.text>
            </>
          )}
        </svg>
      </motion.div>

      {/* Speech Bubble con Promemoria */}
      <AnimatePresence>
        {showReminder && (
          <motion.div
            initial={{ scale: 0, opacity: 0, x: 100 }}
            animate={{ scale: 1, opacity: 1, x: 85 }}
            exit={{ scale: 0, opacity: 0, x: 100 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="absolute top-0 left-0 pointer-events-auto"
          >
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl px-4 py-3 min-w-[180px] border-2 border-orange-400 dark:border-orange-500">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 text-center">
                {reminderMessage}
              </p>
              {/* Triangolino speech bubble */}
              <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[10px] border-r-orange-400 dark:border-r-orange-500" />
              <div className="absolute left-[-7px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[8px] border-r-white dark:border-r-gray-800" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
