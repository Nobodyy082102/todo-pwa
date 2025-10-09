import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export function SeasonalEffects() {
  // Detect current season based on month
  const season = useMemo(() => {
    const month = new Date().getMonth(); // 0-11
    if (month >= 11 || month <= 1) return 'winter'; // Dec, Jan, Feb
    if (month >= 2 && month <= 4) return 'spring'; // Mar, Apr, May
    if (month >= 5 && month <= 7) return 'summer'; // Jun, Jul, Aug
    return 'autumn'; // Sep, Oct, Nov
  }, []);

  const effects = {
    winter: {
      emoji: '❄️',
      count: 20,
      name: 'Neve',
    },
    spring: {
      emoji: '🌸',
      count: 15,
      name: 'Fiori',
    },
    summer: {
      emoji: '🦋',
      count: 10,
      name: 'Farfalle',
    },
    autumn: {
      emoji: '🍂',
      count: 18,
      name: 'Foglie',
    },
  };

  const currentEffect = effects[season];

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {Array.from({ length: currentEffect.count }).map((_, i) => {
        const randomDelay = Math.random() * 5;
        const randomDuration = 8 + Math.random() * 10;
        const randomX = Math.random() * 100;
        const randomRotate = Math.random() * 360;
        const randomSize = 0.5 + Math.random() * 1;

        return (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-60"
            style={{
              left: `${randomX}%`,
              top: -50,
              fontSize: `${randomSize}rem`,
            }}
            animate={{
              y: [0, window.innerHeight + 100],
              x: season === 'winter'
                ? [0, Math.sin(i) * 50, 0]
                : season === 'summer'
                ? [0, Math.sin(i * 2) * 100, 0]
                : [0, Math.sin(i) * 30],
              rotate: [randomRotate, randomRotate + (season === 'autumn' ? 720 : 360)],
              opacity: season === 'winter'
                ? [0.6, 0.8, 0.6]
                : [0.4, 0.7, 0.4],
            }}
            transition={{
              y: {
                duration: randomDuration,
                repeat: Infinity,
                delay: randomDelay,
                ease: 'linear',
              },
              x: {
                duration: season === 'summer' ? 3 : 5,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              rotate: {
                duration: randomDuration,
                repeat: Infinity,
                ease: 'linear',
              },
              opacity: {
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
          >
            {currentEffect.emoji}
          </motion.div>
        );
      })}

      {/* Season indicator badge */}
      <div className="absolute top-20 right-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-lg">{currentEffect.emoji}</span>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {currentEffect.name}
          </span>
        </div>
      </div>
    </div>
  );
}
