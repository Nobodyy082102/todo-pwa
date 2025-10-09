import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Map, Lock, Trophy, Star } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ZONES = [
  { id: 'forest', name: 'Foresta Incantata', emoji: '🌲', tasksRequired: 0, theme: 'from-green-400 to-emerald-600', treasures: ['Spada di Legno', 'Pozione HP'] },
  { id: 'desert', name: 'Deserto Ardente', emoji: '🏜️', tasksRequired: 10, theme: 'from-yellow-400 to-orange-600', treasures: ['Lancia del Sole', 'Amuleto Fuoco'] },
  { id: 'ocean', name: 'Oceano Profondo', emoji: '🌊', tasksRequired: 25, theme: 'from-blue-400 to-cyan-600', treasures: ['Tridente', 'Perla Magica'] },
  { id: 'mountain', name: 'Montagna Celeste', emoji: '⛰️', tasksRequired: 50, theme: 'from-gray-400 to-slate-600', treasures: ['Martello Titanio', 'Cristallo Cielo'] },
  { id: 'volcano', name: 'Vulcano Infernale', emoji: '🌋', tasksRequired: 75, theme: 'from-red-500 to-orange-700', treasures: ['Spada Fiamme', 'Armatura Lava'] },
  { id: 'space', name: 'Galassia Infinita', emoji: '🌌', tasksRequired: 100, theme: 'from-purple-500 to-indigo-900', treasures: ['Lancia Cosmica', 'Corona Stelle'] },
];

export function WorldMap({ todos }) {
  const [unlockedZones, setUnlockedZones] = useLocalStorage('unlockedZones', ['forest']);
  const [collectedTreasures, setCollectedTreasures] = useLocalStorage('treasures', []);

  const completedTasks = todos.filter(t => t.completed).length;

  const currentZones = useMemo(() => {
    return ZONES.map(zone => ({
      ...zone,
      isUnlocked: completedTasks >= zone.tasksRequired,
      isActive: unlockedZones.includes(zone.id),
      progress: Math.min(100, (completedTasks / zone.tasksRequired) * 100),
    }));
  }, [completedTasks, unlockedZones]);

  const unlockZone = (zoneId) => {
    if (!unlockedZones.includes(zoneId)) {
      setUnlockedZones([...unlockedZones, zoneId]);
    }
  };

  const collectTreasure = (treasure) => {
    if (!collectedTreasures.includes(treasure)) {
      setCollectedTreasures([...collectedTreasures, treasure]);
    }
  };

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Map size={24} className="text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mappa del Mondo
        </h2>
      </div>

      <div className="space-y-3">
        {currentZones.map((zone, index) => (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl bg-gradient-to-r ${zone.theme} ${!zone.isUnlocked && 'opacity-50'} relative overflow-hidden`}
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl">{zone.emoji}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">
                  {zone.name}
                </h3>
                {zone.isUnlocked ? (
                  <>
                    <div className="flex items-center gap-2 text-sm text-white/90 mb-2">
                      <Star size={14} />
                      <span>{zone.tasksRequired} task richiesti</span>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {zone.treasures.map((treasure) => (
                        <button
                          key={treasure}
                          onClick={() => collectTreasure(treasure)}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            collectedTreasures.includes(treasure)
                              ? 'bg-yellow-400 text-gray-900'
                              : 'bg-white/30 text-white hover:bg-white/50'
                          }`}
                        >
                          {collectedTreasures.includes(treasure) ? '✓' : '🎁'} {treasure}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-white/80 mb-2">
                      <Lock size={16} />
                      <span className="text-sm">
                        {completedTasks} / {zone.tasksRequired} task
                      </span>
                    </div>
                    <div className="w-full bg-black/30 rounded-full h-2">
                      <div className="h-full bg-white/50 rounded-full" style={{ width: `${zone.progress}%` }} />
                    </div>
                  </>
                )}
              </div>
              {zone.isUnlocked && !zone.isActive && (
                <button
                  onClick={() => unlockZone(zone.id)}
                  className="px-4 py-2 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100"
                >
                  Esplora
                </button>
              )}
              {zone.isActive && (
                <Trophy size={24} className="text-yellow-300" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {unlockedZones.length}/{ZONES.length}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400">Zone Sbloccate</div>
        </div>
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
            {collectedTreasures.length}
          </div>
          <div className="text-xs text-yellow-600 dark:text-yellow-400">Tesori</div>
        </div>
      </div>
    </div>
  );
}
