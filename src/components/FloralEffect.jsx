import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function FloralEffect({ trigger, position }) {
  const [flowers, setFlowers] = useState([]);

  const flowerEmojis = ['🌸', '🌺', '🌻', '🌷', '🌹', '💐', '🏵️', '💮', '🌼', '🪷'];

  useEffect(() => {
    if (trigger > 0) {
      // Crea 12 fiori con posizioni e rotazioni casuali
      const newFlowers = Array.from({ length: 12 }, (_, i) => ({
        id: `${Date.now()}-${i}`,
        emoji: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
        angle: (360 / 12) * i + Math.random() * 30 - 15,
        distance: 80 + Math.random() * 40,
        rotation: Math.random() * 720 - 360,
        delay: Math.random() * 0.1,
      }));

      setFlowers(newFlowers);

      // Rimuovi i fiori dopo l'animazione
      setTimeout(() => setFlowers([]), 1000);
    }
  }, [trigger]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-50">
      <AnimatePresence>
        {flowers.map((flower) => {
          const radians = (flower.angle * Math.PI) / 180;
          const x = Math.cos(radians) * flower.distance;
          const y = Math.sin(radians) * flower.distance;

          return (
            <motion.div
              key={flower.id}
              initial={{
                x: position?.x || 0,
                y: position?.y || 0,
                scale: 0,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                x: (position?.x || 0) + x,
                y: (position?.y || 0) + y,
                scale: [0, 1.5, 1],
                rotate: flower.rotation,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 0.8,
                delay: flower.delay,
                ease: "easeOut",
              }}
              className="absolute text-3xl"
              style={{
                left: '50%',
                top: '50%',
                marginLeft: '-0.75rem',
                marginTop: '-0.75rem',
              }}
            >
              {flower.emoji}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
