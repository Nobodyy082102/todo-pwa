import React from 'react';
import { motion } from 'framer-motion';

export function ParticleEffect({ trigger, type = 'confetti' }) {
  if (!trigger) return null;

  const particleCount = type === 'confetti' ? 30 : 20;
  const colors = ['#6366f1', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="fixed inset-0 pointer-events-none z-[10000]">
      {[...Array(particleCount)].map((_, i) => {
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 150 + Math.random() * 150;
        const x = Math.cos(angle) * velocity;
        const y = Math.sin(angle) * velocity - 100; // Bias verso l'alto
        const rotation = Math.random() * 720 - 360;
        const scale = 0.5 + Math.random() * 0.5;
        const color = colors[Math.floor(Math.random() * colors.length)];

        return (
          <motion.div
            key={i}
            initial={{
              position: 'fixed',
              left: '50%',
              top: '50%',
              width: 10,
              height: 10,
              borderRadius: type === 'confetti' ? '2px' : '50%',
              backgroundColor: color,
              opacity: 1,
            }}
            animate={{
              x: [0, x * 0.7, x],
              y: [0, y * 0.7, y + 200],
              rotate: [0, rotation / 2, rotation],
              scale: [0, scale * 1.2, 0],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 1.2 + Math.random() * 0.5,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          />
        );
      })}
    </div>
  );
}

export function SparkleEffect({ x, y, show }) {
  if (!show) return null;

  return (
    <div className="fixed pointer-events-none z-[10000]" style={{ left: x, top: y }}>
      {[...Array(8)].map((_, i) => {
        const angle = (Math.PI * 2 * i) / 8;
        const distance = 40;
        const sparkleX = Math.cos(angle) * distance;
        const sparkleY = Math.sin(angle) * distance;

        return (
          <motion.div
            key={i}
            initial={{
              position: 'absolute',
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: '#fbbf24',
              boxShadow: '0 0 10px #fbbf24',
            }}
            animate={{
              x: [0, sparkleX],
              y: [0, sparkleY],
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 0.6,
              delay: i * 0.05,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
}

// Particelle di background ambiente
export function AmbientParticles() {
  return (
    <div className="particles-container">
      {[...Array(15)].map((_, i) => {
        const size = 2 + Math.random() * 4;
        const startX = Math.random() * 100;
        const startY = 100 + Math.random() * 20;
        const duration = 15 + Math.random() * 10;
        const delay = Math.random() * 5;

        return (
          <motion.div
            key={i}
            initial={{
              position: 'absolute',
              left: `${startX}%`,
              top: `${startY}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: 'currentColor',
              opacity: 0.1,
            }}
            animate={{
              y: [0, -window.innerHeight - 100],
              x: [0, Math.sin(i) * 50],
              opacity: [0, 0.3, 0.1, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="text-indigo-400 dark:text-indigo-600"
          />
        );
      })}
    </div>
  );
}
