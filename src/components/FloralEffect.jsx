import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function FloralEffect({ trigger, position }) {
  const [flowers, setFlowers] = useState([]);

  const flowerEmojis = ['🌸', '🌺', '🌻', '🌷', '🌹', '💐', '🏵️', '💮', '🌼', '🪷', '🌿', '✨'];

  useEffect(() => {
    if (trigger > 0) {
      // Crea 12 fiori in posizioni casuali
      const newFlowers = Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const distance = 80 + Math.random() * 40;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        return {
          id: `${trigger}-${i}`,
          emoji: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
          x,
          y,
          rotation: Math.random() * 720 - 360,
          delay: i * 0.03,
        };
      });

      setFlowers(newFlowers);

      // Rimuovi i fiori dopo l'animazione
      const timer = setTimeout(() => {
        setFlowers([]);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div
      className="absolute inset-0 pointer-events-none z-50 overflow-visible"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <AnimatePresence>
        {flowers.map((flower) => (
          <motion.div
            key={flower.id}
            initial={{
              x: position.x,
              y: position.y,
              scale: 0,
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              x: position.x + flower.x,
              y: position.y + flower.y,
              scale: [0, 1.5, 1],
              opacity: [1, 1, 0],
              rotate: flower.rotation,
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 1.5,
              delay: flower.delay,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            style={{
              position: 'absolute',
              fontSize: '2rem',
              zIndex: 9999,
              pointerEvents: 'none',
            }}
          >
            {flower.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
