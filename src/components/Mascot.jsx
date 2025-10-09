import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Mascot({ onTaskAdded, onTaskCompleted }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState('idle'); // idle, celebrate, jump
  const [showReminder, setShowReminder] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');

  // Messaggi promemoria casuali - ESTESI!
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
    "Non dimenticare i tuoi obiettivi! 🎪",
    "Oggi è il giorno perfetto! ☀️",
    "Inizia da quella più facile! 🌱",
    "Un task alla volta! 🐾",
    "Sei sulla strada giusta! 🛤️",
    "Credici, puoi farcela! 💫",
    "Non procrastinare, agisci! ⚡",
    "Le tue priorità ti aspettano! 🔥",
    "Completiamo qualcosa oggi! 💯",
    "Il successo è fatto di piccoli passi! 👣",
    "Lavora con metodo! 📊",
    "Resta concentrato sull'obiettivo! 🎯",
    "Ogni sforzo conta! 💎",
    "Fai la differenza oggi! 🌟",
    "Trasforma i sogni in realtà! 🦋",
    "Il tempo è prezioso, usalo bene! ⏰",
    "Sei più forte di quanto pensi! 💪",
    "Progressi, non perfezione! 📈",
    "Inizia ora, ringrazia dopo! 🙏",
    "Le piccole vittorie contano! 🏅",
  ];

  // Sistema di promemoria casuali PIÙ FREQUENTI (ogni 1-2 minuti)
  useEffect(() => {
    const showRandomReminder = () => {
      const randomMessage = reminderMessages[Math.floor(Math.random() * reminderMessages.length)];
      setReminderMessage(randomMessage);
      setShowReminder(true);

      // Nascondi dopo 6 secondi (più tempo per leggere)
      setTimeout(() => {
        setShowReminder(false);
      }, 6000);
    };

    // Primo promemoria dopo 1 minuto
    const firstTimer = setTimeout(() => {
      showRandomReminder();
    }, 60000); // 1 minuto

    // Promemoria successivi ogni 90 secondi (1.5 minuti)
    const interval = setInterval(() => {
      showRandomReminder();
    }, 90000); // 1.5 minuti

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
          y: [0, -30, -15, -28, -12, -25, 0],
          rotate: [0, -10, 8, -6, 8, -8, 0],
          scale: [1, 1.15, 1.08, 1.12, 1.06, 1.10, 1],
        };
      case 'celebrate':
        return {
          rotate: [0, -20, 20, -18, 18, -15, 15, -10, 10, 0],
          scale: [1, 1.20, 1.05, 1.18, 1, 1.15, 1, 1.12, 1.05, 1],
          y: [0, -15, 0, -12, 0, -8, 0, -5, 0],
        };
      default: // idle
        return {
          y: [0, -5, -2, -4, 0],
          scale: [1, 1.04, 1.02, 1.03, 1],
          rotate: [0, -1, 0.5, -0.5, 0],
        };
    }
  };

  const getTailAnimation = () => {
    // Sincronizzata PERFETTAMENTE con il movimento del corpo
    switch (animationType) {
      case 'jump':
        return {
          path: [
            "M 18 40 Q 12 38 8 30",
            "M 18 40 Q 10 40 6 32",
            "M 18 40 Q 13 36 9 28",
            "M 18 40 Q 11 38 7 30",
            "M 18 40 Q 12 36 8 28",
            "M 18 40 Q 13 38 9 30",
            "M 18 40 Q 12 38 8 30",
          ],
          tip: [
            { x: 8, y: 30 },
            { x: 6, y: 32 },
            { x: 9, y: 28 },
            { x: 7, y: 30 },
            { x: 8, y: 28 },
            { x: 9, y: 30 },
            { x: 8, y: 30 },
          ]
        };
      case 'celebrate':
        return {
          path: [
            "M 18 40 Q 12 38 8 30",
            "M 18 40 Q 8 42 4 34",
            "M 18 40 Q 11 30 7 24",
            "M 18 40 Q 7 40 5 32",
            "M 18 40 Q 13 32 10 26",
            "M 18 40 Q 9 38 6 30",
            "M 18 40 Q 12 34 9 28",
            "M 18 40 Q 10 36 7 30",
            "M 18 40 Q 12 38 8 30",
          ],
          tip: [
            { x: 8, y: 30 },
            { x: 4, y: 34 },
            { x: 7, y: 24 },
            { x: 5, y: 32 },
            { x: 10, y: 26 },
            { x: 6, y: 30 },
            { x: 9, y: 28 },
            { x: 7, y: 30 },
            { x: 8, y: 30 },
          ]
        };
      default: // idle - sincronizzata PERFETTAMENTE
        return {
          path: [
            "M 18 40 Q 12 38 8 30",
            "M 18 40 Q 11 36 7 31",
            "M 18 40 Q 13 37 9 29",
            "M 18 40 Q 11 37 7 31",
            "M 18 40 Q 12 38 8 30",
          ],
          tip: [
            { x: 8, y: 30 },
            { x: 7, y: 31 },
            { x: 9, y: 29 },
            { x: 7, y: 31 },
            { x: 8, y: 30 },
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
            stiffness: 200,
            damping: 20,
            duration: animationType === 'celebrate' ? 0.6 : 0.8
          },
          opacity: { duration: 0.5, ease: "easeOut" },
          x: { type: 'spring', stiffness: 140, damping: 24 },
          y: {
            duration: animationType === 'idle' ? 4 : animationType === 'jump' ? 1.5 : 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse"
          },
          rotate: {
            duration: animationType === 'idle' ? 4 : animationType === 'celebrate' ? 2.5 : 1.5,
            repeat: Infinity,
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

          {/* Corpo arancione vibrante con pancia bianca */}
          <motion.ellipse
            cx="32"
            cy="38"
            rx="14"
            ry="16"
            fill="#FF9A56"
            animate={animationType === 'celebrate' ? { scale: [1, 1.12, 1, 1.06, 1] } : { scale: [1, 1.04, 1.01, 1.03, 1] }}
            transition={{
              duration: animationType === 'celebrate' ? 0.7 : 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Pancia bianca cremosa */}
          <motion.ellipse
            cx="32"
            cy="40"
            rx="10"
            ry="13"
            fill="#FFF8F0"
            animate={animationType === 'celebrate' ? { scale: [1, 1.1, 1, 1.05, 1] } : { scale: [1, 1.03, 1.01, 1.02, 1] }}
            transition={{
              duration: animationType === 'celebrate' ? 0.7 : 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.15
            }}
          />

          {/* Testa arancione vibrante */}
          <motion.circle
            cx="32"
            cy="24"
            r="13"
            fill="#FF9A56"
            animate={animationType === 'celebrate' ? { scale: [1, 1.12, 1, 1.06, 1] } : { scale: [1, 1.03, 1.01, 1.02, 1] }}
            transition={{
              duration: animationType === 'celebrate' ? 0.7 : 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.25
            }}
          />

          {/* Strisce tigrate arancione scuro sulla testa - PIÙ MARCATE */}
          <path d="M 24 18 Q 26 16 28 18" stroke="#D96528" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8"/>
          <path d="M 36 18 Q 38 16 40 18" stroke="#D96528" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8"/>
          <path d="M 28 22 Q 30 20 32 22" stroke="#D96528" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.75"/>
          <path d="M 32 22 Q 34 20 36 22" stroke="#D96528" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.75"/>
          <path d="M 22 20 Q 23 19 24 20" stroke="#D96528" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
          <path d="M 40 20 Q 41 19 42 20" stroke="#D96528" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>

          {/* Muso bianco cremoso */}
          <circle cx="32" cy="27" r="7" fill="#FFF8F0"/>

          {/* Orecchie arancioni fluide e reattive */}
          <motion.path
            d="M 21 17 L 16 6 L 26 15 Z"
            fill="#FF9A56"
            animate={animationType !== 'idle' ? {
              rotate: [-10, 10, -8, 8, -10],
              transformOrigin: "21px 17px"
            } : {
              rotate: [0, -4, 0, -2.5, -1, 0],
              transformOrigin: "21px 17px"
            }}
            transition={{
              duration: animationType === 'celebrate' ? 0.5 : 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.path
            d="M 43 17 L 48 6 L 38 15 Z"
            fill="#FF9A56"
            animate={animationType !== 'idle' ? {
              rotate: [10, -10, 8, -8, 10],
              transformOrigin: "43px 17px"
            } : {
              rotate: [0, 4, 0, 2.5, 1, 0],
              transformOrigin: "43px 17px"
            }}
            transition={{
              duration: animationType === 'celebrate' ? 0.5 : 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4
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
            {/* Occhi VERDI CHIARI brillanti */}
            <motion.ellipse
              cx="26"
              cy="23"
              rx="3.5"
              ry="5"
              fill="#6EE7B7"
              animate={{ scaleY: [1, 0.08, 1] }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 4.5, ease: "easeInOut" }}
            />
            <motion.ellipse
              cx="38"
              cy="23"
              rx="3.5"
              ry="5"
              fill="#6EE7B7"
              animate={{ scaleY: [1, 0.08, 1] }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 4.5, ease: "easeInOut" }}
            />
            {/* Pupille a fessura verticale nere */}
            <motion.ellipse
              cx="26"
              cy="23"
              rx="1"
              ry="3.8"
              fill="#000000"
              animate={{ scaleY: [1, 0.08, 1], ry: [3.8, 0.3, 3.8] }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 4.5, ease: "easeInOut" }}
            />
            <motion.ellipse
              cx="38"
              cy="23"
              rx="1"
              ry="3.8"
              fill="#000000"
              animate={{ scaleY: [1, 0.08, 1], ry: [3.8, 0.3, 3.8] }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 4.5, ease: "easeInOut" }}
            />
            {/* Riflessi luminosi brillanti */}
            <circle cx="27" cy="21.5" r="1.2" fill="white" opacity="0.9"/>
            <circle cx="39" cy="21.5" r="1.2" fill="white" opacity="0.9"/>
            <circle cx="25.5" cy="24" r="0.6" fill="white" opacity="0.6"/>
            <circle cx="37.5" cy="24" r="0.6" fill="white" opacity="0.6"/>
          </motion.g>

          {/* Naso rosa a triangolo */}
          <motion.path
            d="M 32 27 L 30 29.5 L 34 29.5 Z"
            fill="#FF9AA2"
            animate={animationType === 'celebrate' ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.35, repeat: animationType === 'celebrate' ? 5 : 0 }}
          />

          {/* Baffi SUPER LUNGHI e realistici con movimento fluido */}
          <g className="opacity-85">
            {/* Sinistra - 3 baffi ultra fluidi */}
            <motion.line x1="16" y1="27" x2="4" y2="24" stroke="#444444" strokeWidth="1.3" strokeLinecap="round"
              animate={{
                rotate: [0, -5, -1, -4, 0, -3, 0],
                transformOrigin: "16px 27px",
                x2: [4, 3, 4, 3.5, 4]
              }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.line x1="16" y1="29" x2="3" y2="29" stroke="#444444" strokeWidth="1.3" strokeLinecap="round"
              animate={{
                rotate: [0, -3, 0, -2, -1, 0],
                transformOrigin: "16px 29px",
                x2: [3, 2, 3, 2.5, 3]
              }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            />
            <motion.line x1="16" y1="31" x2="5" y2="34" stroke="#444444" strokeWidth="1.3" strokeLinecap="round"
              animate={{
                rotate: [0, 5, 1, 4, 0, 3, 0],
                transformOrigin: "16px 31px",
                x2: [5, 4, 5, 4.5, 5]
              }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            />
            {/* Destra - 3 baffi ultra fluidi */}
            <motion.line x1="48" y1="27" x2="60" y2="24" stroke="#444444" strokeWidth="1.3" strokeLinecap="round"
              animate={{
                rotate: [0, 5, 1, 4, 0, 3, 0],
                transformOrigin: "48px 27px",
                x2: [60, 61, 60, 60.5, 60]
              }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
            <motion.line x1="48" y1="29" x2="61" y2="29" stroke="#444444" strokeWidth="1.3" strokeLinecap="round"
              animate={{
                rotate: [0, 3, 0, 2, 1, 0],
                transformOrigin: "48px 29px",
                x2: [61, 62, 61, 61.5, 61]
              }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            />
            <motion.line x1="48" y1="31" x2="59" y2="34" stroke="#444444" strokeWidth="1.3" strokeLinecap="round"
              animate={{
                rotate: [0, -5, -1, -4, 0, -3, 0],
                transformOrigin: "48px 31px",
                x2: [59, 60, 59, 59.5, 59]
              }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
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

          {/* Coda arancione animata PERFETTAMENTE SINCRONIZZATA */}
          <motion.path
            stroke="#FF9A56"
            strokeWidth="5.8"
            fill="none"
            strokeLinecap="round"
            animate={{
              d: getTailAnimation().path
            }}
            transition={{
              duration: animationType === 'idle' ? 4 : animationType === 'jump' ? 1.5 : 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse"
            }}
          />
          {/* Punta coda bianca - ATTACCATA PERFETTAMENTE sulla coda */}
          <motion.circle
            r="3.2"
            fill="#FFF8F0"
            animate={{
              cx: getTailAnimation().tip.map(t => t.x),
              cy: getTailAnimation().tip.map(t => t.y),
            }}
            transition={{
              duration: animationType === 'idle' ? 4 : animationType === 'jump' ? 1.5 : 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse"
            }}
          />

          {/* Zampe arancioni con cuscinetti rosa animati */}
          <motion.g
            animate={{ y: animationType === 'idle' ? [0, 0.5, 0] : [0, -1, 0] }}
            transition={{ duration: animationType === 'idle' ? 4 : 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ellipse cx="26" cy="50" rx="3.5" ry="4.5" fill="#FF9A56"/>
            <ellipse cx="38" cy="50" rx="3.5" ry="4.5" fill="#FF9A56"/>
            <ellipse cx="26" cy="51" rx="2.5" ry="3" fill="#FFB6C1" opacity="0.9"/>
            <ellipse cx="38" cy="51" rx="2.5" ry="3" fill="#FFB6C1" opacity="0.9"/>
            {/* Mini cuscinetti */}
            <circle cx="24.5" cy="49.5" r="0.8" fill="#FFB6C1" opacity="0.8"/>
            <circle cx="27.5" cy="49.5" r="0.8" fill="#FFB6C1" opacity="0.8"/>
            <circle cx="36.5" cy="49.5" r="0.8" fill="#FFB6C1" opacity="0.8"/>
            <circle cx="39.5" cy="49.5" r="0.8" fill="#FFB6C1" opacity="0.8"/>
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
