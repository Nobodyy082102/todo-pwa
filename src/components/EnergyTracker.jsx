import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Battery, Zap, Coffee } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function EnergyTracker() {
  const [energyLogs, setEnergyLogs] = useLocalStorage('energyLogs', []);
  const [currentEnergy, setCurrentEnergy] = useState(3); // 1-5

  const handleLogEnergy = () => {
    const now = new Date();
    const hour = now.getHours();

    const log = {
      timestamp: now.getTime(),
      hour,
      energy: currentEnergy,
      date: now.toDateString(),
    };

    setEnergyLogs([...energyLogs, log]);
  };

  const stats = useMemo(() => {
    // Group by hour
    const byHour = energyLogs.reduce((acc, log) => {
      if (!acc[log.hour]) {
        acc[log.hour] = [];
      }
      acc[log.hour].push(log.energy);
      return acc;
    }, {});

    // Calculate average per hour
    const hourlyAverage = Object.entries(byHour).map(([hour, energies]) => ({
      hour: parseInt(hour),
      avg: energies.reduce((sum, e) => sum + e, 0) / energies.length,
      count: energies.length,
    }));

    // Best time (highest average energy)
    const bestTime = hourlyAverage.length > 0
      ? hourlyAverage.reduce((best, curr) => curr.avg > best.avg ? curr : best)
      : null;

    // Today's logs
    const today = new Date().toDateString();
    const todayLogs = energyLogs.filter(log => log.date === today);

    return {
      hourlyAverage,
      bestTime,
      totalLogs: energyLogs.length,
      todayLogs: todayLogs.length,
    };
  }, [energyLogs]);

  const energyEmojis = {
    1: '🪫',
    2: '🔋',
    3: '⚡',
    4: '⚡⚡',
    5: '⚡⚡⚡',
  };

  const energyLabels = {
    1: 'Esausto',
    2: 'Basso',
    3: 'Normale',
    4: 'Alto',
    5: 'Pieno',
  };

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Battery size={24} className="text-yellow-600 dark:text-yellow-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Energy Tracker
        </h2>
      </div>

      {/* Current Energy Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Come ti senti ora?
        </label>
        <div className="flex gap-2 justify-center mb-4">
          {[1, 2, 3, 4, 5].map((level) => (
            <motion.button
              key={level}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentEnergy(level)}
              className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                currentEnergy === level
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="text-2xl mb-1">{energyEmojis[level]}</div>
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {level}
              </div>
            </motion.button>
          ))}
        </div>

        <button
          onClick={handleLogEnergy}
          className="w-full py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg transition-all"
        >
          Registra: {energyLabels[currentEnergy]} {energyEmojis[currentEnergy]}
        </button>
      </div>

      {/* Stats */}
      {stats.totalLogs > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                {stats.totalLogs}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                Log Totali
              </div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <div className="text-xl font-bold text-green-700 dark:text-green-300">
                {stats.todayLogs}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">
                Oggi
              </div>
            </div>
          </div>

          {/* Best Time */}
          {stats.bestTime && (
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-300 dark:border-yellow-700 mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap size={20} className="text-yellow-600" />
                <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                  Momento Migliore
                </h3>
              </div>
              <p className="text-center text-xl font-bold text-yellow-900 dark:text-yellow-200">
                {stats.bestTime.hour}:00 - {stats.bestTime.hour + 1}:00
              </p>
              <p className="text-center text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                Energia media: {stats.bestTime.avg.toFixed(1)}/5 ⚡
              </p>
            </div>
          )}

          {/* Hourly Chart */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Energia per Ora
            </h3>
            {stats.hourlyAverage.slice().sort((a, b) => a.hour - b.hour).map((item) => (
              <div key={item.hour} className="flex items-center gap-2">
                <div className="text-xs text-gray-600 dark:text-gray-400 w-12">
                  {item.hour}:00
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.avg / 5) * 100}%` }}
                    className={`h-full ${
                      item.avg >= 4
                        ? 'bg-green-500'
                        : item.avg >= 3
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 w-8">
                  {item.avg.toFixed(1)}
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          {stats.bestTime && (
            <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Coffee size={16} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-indigo-800 dark:text-indigo-300">
                  <strong>Suggerimento:</strong> Programma task importanti intorno alle{' '}
                  {stats.bestTime.hour}:00 quando hai più energia!
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {stats.totalLogs === 0 && (
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Registra la tua energia durante il giorno per vedere i pattern! 📊
        </p>
      )}
    </div>
  );
}
