import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Award } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const SKILLS = {
  productivity: [
    { id: 'fast_learner', name: 'Fast Learner', desc: '+50% XP', cost: 10, icon: '📚' },
    { id: 'time_master', name: 'Time Master', desc: 'Timer +10min', cost: 15, icon: '⏱️' },
    { id: 'perfectionist', name: 'Perfectionist', desc: 'Alta priorità +bonus', cost: 20, icon: '⭐' },
  ],
  collection: [
    { id: 'pet_whisperer', name: 'Pet Whisperer', desc: 'Pet evolvono più veloce', cost: 12, icon: '🐾' },
    { id: 'gardener', name: 'Gardener', desc: 'Giardino più grande', cost: 18, icon: '🌱' },
    { id: 'collector', name: 'Collector', desc: 'Drop rate +25%', cost: 25, icon: '💎' },
  ],
  combat: [
    { id: 'warrior', name: 'Warrior', desc: 'Boss damage +50%', cost: 15, icon: '⚔️' },
    { id: 'lucky', name: 'Lucky', desc: 'Gacha rari +10%', cost: 20, icon: '🍀' },
    { id: 'champion', name: 'Champion', desc: 'Quest XP doppio', cost: 30, icon: '🏆' },
  ],
};

export function SkillTree({ todos }) {
  const [unlockedSkills, setUnlockedSkills] = useLocalStorage('skills', []);
  const [skillPoints, setSkillPoints] = useLocalStorage('skillPoints', 5);

  const completedTasks = todos.filter(t => t.completed).length;
  const earnedPoints = Math.floor(completedTasks / 10);

  const unlockSkill = (skillId, cost) => {
    if (skillPoints >= cost && !unlockedSkills.includes(skillId)) {
      setUnlockedSkills([...unlockedSkills, skillId]);
      setSkillPoints(skillPoints - cost);
    }
  };

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <TrendingUp size={24} className="text-green-600 dark:text-green-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skill Tree</h2>
        </div>
        <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-lg">
          <span className="text-sm font-bold text-green-700 dark:text-green-300">
            {skillPoints} Punti
          </span>
        </div>
      </div>

      {Object.entries(SKILLS).map(([category, skills]) => (
        <div key={category} className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 capitalize flex items-center gap-2">
            {category === 'productivity' && <Zap size={16} />}
            {category === 'collection' && <Award size={16} />}
            {category === 'combat' && <Award size={16} />}
            {category}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {skills.map((skill) => {
              const isUnlocked = unlockedSkills.includes(skill.id);
              const canAfford = skillPoints >= skill.cost;

              return (
                <motion.button
                  key={skill.id}
                  whileHover={{ scale: canAfford && !isUnlocked ? 1.05 : 1 }}
                  onClick={() => unlockSkill(skill.id, skill.cost)}
                  disabled={isUnlocked || !canAfford}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isUnlocked
                      ? 'bg-green-50 dark:bg-green-900/30 border-green-500'
                      : canAfford
                      ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-green-500'
                      : 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="text-3xl mb-1">{skill.icon}</div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white mb-1">
                    {skill.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {skill.desc}
                  </div>
                  <div className="text-xs font-bold text-green-600 dark:text-green-400">
                    {isUnlocked ? '✓ Sbloccato' : `${skill.cost} Punti`}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}

      <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-4">
        💡 Guadagna 1 punto skill ogni 10 task completati! ({earnedPoints} guadagnati)
      </p>
    </div>
  );
}
