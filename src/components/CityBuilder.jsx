import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Coins } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const BUILDINGS = [
  { id: 'house', name: 'Casa', emoji: '🏠', cost: { wood: 10, stone: 5 }, benefit: '+1 Pet Slot' },
  { id: 'factory', name: 'Fabbrica', emoji: '🏭', cost: { wood: 20, stone: 15, gold: 5 }, benefit: '+2 Risorse/h' },
  { id: 'circus', name: 'Circo', emoji: '🎪', cost: { wood: 30, stone: 20, gold: 10 }, benefit: 'Mini-games' },
  { id: 'castle', name: 'Castello', emoji: '🏰', cost: { wood: 50, stone: 50, gold: 30 }, benefit: 'Boss Rush' },
];

export function CityBuilder({ todos }) {
  const [buildings, setBuildings] = useLocalStorage('cityBuildings', []);
  const [resources, setResources] = useLocalStorage('cityResources', { wood: 50, stone: 30, gold: 10 });

  const completedTasks = todos.filter(t => t.completed).length;
  const wood = completedTasks * 2;
  const stone = completedTasks;
  const gold = Math.floor(completedTasks / 2);

  const buildBuilding = (building) => {
    const canBuild = Object.entries(building.cost).every(([resource, cost]) =>
      (resource === 'wood' ? wood : resource === 'stone' ? stone : gold) >= cost
    );

    if (canBuild && !buildings.includes(building.id)) {
      setBuildings([...buildings, building.id]);
    }
  };

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Building2 size={24} className="text-orange-600 dark:text-orange-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Produttopoli</h2>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded text-center">
          <div className="text-lg font-bold">🪵 {wood}</div>
          <div className="text-xs">Legno</div>
        </div>
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-center">
          <div className="text-lg font-bold">🪨 {stone}</div>
          <div className="text-xs">Pietra</div>
        </div>
        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded text-center">
          <div className="text-lg font-bold">💰 {gold}</div>
          <div className="text-xs">Oro</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {BUILDINGS.map((building) => {
          const isBuilt = buildings.includes(building.id);
          const canBuild = Object.entries(building.cost).every(([resource, cost]) =>
            (resource === 'wood' ? wood : resource === 'stone' ? stone : gold) >= cost
          );

          return (
            <motion.button
              key={building.id}
              whileHover={{ scale: canBuild && !isBuilt ? 1.05 : 1 }}
              onClick={() => buildBuilding(building)}
              disabled={isBuilt || !canBuild}
              className={`p-4 rounded-xl ${
                isBuilt
                  ? 'bg-green-100 dark:bg-green-900/20 border-2 border-green-500'
                  : canBuild
                  ? 'bg-white dark:bg-gray-800 border-2 border-gray-300 hover:border-orange-500'
                  : 'bg-gray-100 dark:bg-gray-900 border-2 border-gray-300 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="text-4xl mb-2">{building.emoji}</div>
              <div className="font-bold text-sm mb-1">{building.name}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">{building.benefit}</div>
              {!isBuilt && (
                <div className="text-xs">
                  {Object.entries(building.cost).map(([res, cost]) => (
                    <span key={res} className="inline-block mr-1">
                      {res === 'wood' ? '🪵' : res === 'stone' ? '🪨' : '💰'}{cost}
                    </span>
                  ))}
                </div>
              )}
              {isBuilt && <div className="text-xs text-green-600 font-bold">✓ Costruito</div>}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
          {buildings.length}/{BUILDINGS.length}
        </div>
        <div className="text-xs text-blue-600 dark:text-blue-400">Edifici Costruiti</div>
      </div>
    </div>
  );
}
