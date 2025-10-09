import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Lock, Unlock } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// ELEFANTINO - Pet Principale (sempre attivo)
const ELEPHANT_STAGES = [
  { level: 0, emoji: '🥚', name: 'Uovo', minTasks: 0 },
  { level: 1, emoji: '🐘', name: 'Elefantino', minTasks: 5 },
  { level: 2, emoji: '🐘✨', name: 'Elefante Giovane', minTasks: 20 },
  { level: 3, emoji: '🐘💪', name: 'Elefante Forte', minTasks: 50 },
  { level: 4, emoji: '🐘👑', name: 'Elefante Re', minTasks: 100 },
  { level: 5, emoji: '🐘🌟', name: 'Elefante Divino', minTasks: 200 },
];

// PET ELEMENTALI - Si sbloccano con achievement
const ELEMENTAL_PETS = {
  // ARIA
  bird: {
    id: 'bird',
    name: 'Uccello',
    element: 'Aria',
    unlockTasks: 15,
    color: 'from-sky-400 to-blue-500',
    stages: [
      { level: 0, emoji: '🥚', name: 'Uovo' },
      { level: 1, emoji: '🐣', name: 'Pulcino' },
      { level: 2, emoji: '🐦', name: 'Uccellino' },
      { level: 3, emoji: '🦅', name: 'Aquila' },
      { level: 4, emoji: '🦅✨', name: 'Aquila Reale' },
      { level: 5, emoji: '🦅🌟', name: 'Fenice' },
    ],
  },
  dragon: {
    id: 'dragon',
    name: 'Drago',
    element: 'Aria',
    unlockTasks: 40,
    color: 'from-purple-400 to-pink-500',
    stages: [
      { level: 0, emoji: '🥚', name: 'Uovo Magico' },
      { level: 1, emoji: '🦎', name: 'Draghetto' },
      { level: 2, emoji: '🐉', name: 'Drago Giovane' },
      { level: 3, emoji: '🐉💨', name: 'Drago Volante' },
      { level: 4, emoji: '🐉🔥', name: 'Drago di Fuoco' },
      { level: 5, emoji: '🐉👑', name: 'Drago Leggendario' },
    ],
  },

  // MARE
  fish: {
    id: 'fish',
    name: 'Pesce',
    element: 'Mare',
    unlockTasks: 25,
    color: 'from-cyan-400 to-teal-500',
    stages: [
      { level: 0, emoji: '🥚', name: 'Uovo' },
      { level: 1, emoji: '🐠', name: 'Pesciolino' },
      { level: 2, emoji: '🐟', name: 'Pesce' },
      { level: 3, emoji: '🐡', name: 'Pesce Palla' },
      { level: 4, emoji: '🦈', name: 'Squalo' },
      { level: 5, emoji: '🦈👑', name: 'Re del Mare' },
    ],
  },
  whale: {
    id: 'whale',
    name: 'Balena',
    element: 'Mare',
    unlockTasks: 60,
    color: 'from-blue-400 to-indigo-500',
    stages: [
      { level: 0, emoji: '🥚', name: 'Uovo Oceano' },
      { level: 1, emoji: '🐋', name: 'Balenotta' },
      { level: 2, emoji: '🐳', name: 'Balena' },
      { level: 3, emoji: '🐳💙', name: 'Balena Blu' },
      { level: 4, emoji: '🐳✨', name: 'Balena Luminosa' },
      { level: 5, emoji: '🐳🌟', name: 'Guardiana Oceano' },
    ],
  },

  // TERRA
  lion: {
    id: 'lion',
    name: 'Leone',
    element: 'Terra',
    unlockTasks: 30,
    color: 'from-orange-400 to-yellow-500',
    stages: [
      { level: 0, emoji: '🥚', name: 'Uovo' },
      { level: 1, emoji: '🐱', name: 'Leoncino' },
      { level: 2, emoji: '🦁', name: 'Leone Giovane' },
      { level: 3, emoji: '🦁💪', name: 'Leone Forte' },
      { level: 4, emoji: '🦁👑', name: 'Re della Savana' },
      { level: 5, emoji: '🦁🌟', name: 'Leone Immortale' },
    ],
  },
  bear: {
    id: 'bear',
    name: 'Orso',
    element: 'Terra',
    unlockTasks: 50,
    color: 'from-amber-600 to-brown-500',
    stages: [
      { level: 0, emoji: '🥚', name: 'Uovo' },
      { level: 1, emoji: '🐻', name: 'Orsetto' },
      { level: 2, emoji: '🐻‍❄️', name: 'Orso Polare' },
      { level: 3, emoji: '🐻💪', name: 'Orso Forte' },
      { level: 4, emoji: '🐻👑', name: 'Re della Foresta' },
      { level: 5, emoji: '🐻🌟', name: 'Guardiano Antico' },
    ],
  },
};

export function VirtualPet({ todos }) {
  const [unlockedPets, setUnlockedPets] = useLocalStorage('unlockedPets', []);
  const [activePet, setActivePet] = useLocalStorage('activePet', 'elephant');
  const [showCollection, setShowCollection] = useState(false);

  const completedTasks = todos.filter(t => t.completed).length;

  // Calcola livello pet attivo
  const currentPet = useMemo(() => {
    if (activePet === 'elephant') {
      const stage = [...ELEPHANT_STAGES].reverse().find(s => completedTasks >= s.minTasks) || ELEPHANT_STAGES[0];
      return {
        id: 'elephant',
        name: 'Elefantino',
        element: 'Principale',
        stage,
        isMain: true,
      };
    }

    const petData = ELEMENTAL_PETS[activePet];
    if (!petData) return null;

    // Calcola livello basato su task (ogni 10 task = 1 livello)
    const petLevel = Math.min(5, Math.floor(completedTasks / 10));
    const stage = petData.stages[petLevel];

    return {
      ...petData,
      stage,
      isMain: false,
    };
  }, [activePet, completedTasks]);

  // Auto-sblocco pet
  useMemo(() => {
    const newUnlocked = [];
    Object.values(ELEMENTAL_PETS).forEach(pet => {
      if (completedTasks >= pet.unlockTasks && !unlockedPets.includes(pet.id)) {
        newUnlocked.push(pet.id);
      }
    });

    if (newUnlocked.length > 0) {
      setUnlockedPets([...unlockedPets, ...newUnlocked]);
    }
  }, [completedTasks, unlockedPets]);

  const nextPetToUnlock = useMemo(() => {
    const locked = Object.values(ELEMENTAL_PETS)
      .filter(pet => !unlockedPets.includes(pet.id))
      .sort((a, b) => a.unlockTasks - b.unlockTasks);
    return locked[0] || null;
  }, [unlockedPets]);

  const allPets = ['elephant', ...unlockedPets];

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Heart size={24} className="text-pink-600 dark:text-pink-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Pet Virtuale
          </h2>
        </div>
        <button
          onClick={() => setShowCollection(!showCollection)}
          className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium rounded-lg transition-all"
        >
          <Sparkles size={16} />
          <span>Collezione</span>
        </button>
      </div>

      {currentPet && (
        <>
          {/* Pet Display */}
          <div className={`relative bg-gradient-to-br ${currentPet.isMain ? 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20' : currentPet.color} rounded-xl p-8 mb-4`}>
            {/* Pet Emoji */}
            <motion.div
              className="text-8xl text-center mb-4 cursor-pointer"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.1 }}
            >
              {currentPet.stage.emoji}
            </motion.div>

            {/* Info */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {currentPet.stage.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {currentPet.element} • Livello {currentPet.stage.level}
              </p>
            </div>

            {/* Progress to next level */}
            {currentPet.isMain && currentPet.stage.level < ELEPHANT_STAGES.length - 1 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>Prossimo livello</span>
                  <span>{completedTasks} / {ELEPHANT_STAGES[currentPet.stage.level + 1].minTasks}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, (completedTasks / ELEPHANT_STAGES[currentPet.stage.level + 1].minTasks) * 100)}%`
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Pet Collection */}
          <AnimatePresence>
            {showCollection && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Collezione Pet ({allPets.length}/7)
                </h4>

                {/* Grid Pet */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Elefantino */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActivePet('elephant')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      activePet === 'elephant'
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="text-3xl mb-1">🐘</div>
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                      Elefantino
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Principale
                    </div>
                  </motion.button>

                  {/* Pet Sbloccati */}
                  {Object.values(ELEMENTAL_PETS).map(pet => {
                    const isUnlocked = unlockedPets.includes(pet.id);
                    const petLevel = Math.min(5, Math.floor(completedTasks / 10));
                    const currentStage = pet.stages[petLevel];

                    return (
                      <motion.button
                        key={pet.id}
                        whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
                        whileTap={{ scale: isUnlocked ? 0.95 : 1 }}
                        onClick={() => isUnlocked && setActivePet(pet.id)}
                        disabled={!isUnlocked}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          !isUnlocked
                            ? 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                            : activePet === pet.id
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                            : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="text-3xl mb-1">
                          {isUnlocked ? currentStage.emoji : '🔒'}
                        </div>
                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                          {pet.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {isUnlocked ? pet.element : `${pet.unlockTasks} task`}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Next Unlock */}
                {nextPetToUnlock && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-300 dark:border-amber-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock size={16} className="text-amber-600" />
                      <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                        Prossimo Pet: {nextPetToUnlock.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-amber-700 dark:text-amber-400 mb-1">
                      <span>{nextPetToUnlock.element}</span>
                      <span>{completedTasks} / {nextPetToUnlock.unlockTasks}</span>
                    </div>
                    <div className="w-full bg-amber-200 dark:bg-amber-900/40 rounded-full h-2">
                      <motion.div
                        className="h-full bg-amber-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(100, (completedTasks / nextPetToUnlock.unlockTasks) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Stats Collezione */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
                    <div className="text-lg font-bold text-sky-700 dark:text-sky-300">
                      {unlockedPets.filter(id => ['bird', 'dragon'].includes(id)).length}/2
                    </div>
                    <div className="text-xs text-sky-600 dark:text-sky-400">Aria</div>
                  </div>
                  <div className="p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                    <div className="text-lg font-bold text-cyan-700 dark:text-cyan-300">
                      {unlockedPets.filter(id => ['fish', 'whale'].includes(id)).length}/2
                    </div>
                    <div className="text-xs text-cyan-600 dark:text-cyan-400">Mare</div>
                  </div>
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-lg font-bold text-orange-700 dark:text-orange-300">
                      {unlockedPets.filter(id => ['lion', 'bear'].includes(id)).length}/2
                    </div>
                    <div className="text-xs text-orange-600 dark:text-orange-400">Terra</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Motivational Message */}
          <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-4">
            {completedTasks === 0
              ? 'Completa task per far crescere il tuo elefantino! 🐘'
              : completedTasks < 15
              ? 'Ottimo inizio! Continua a completare task! 💪'
              : allPets.length < 7
              ? `Ancora ${7 - allPets.length} pet da sbloccare! 🎯`
              : 'Collezione completa! Sei un maestro! 👑✨'}
          </p>
        </>
      )}
    </div>
  );
}
