import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Share2, Trophy } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function CoOpMode({ todos }) {
  const [sharedTasks, setSharedTasks] = useLocalStorage('sharedTasks', []);
  const [partyCode, setPartyCode] = useLocalStorage('partyCode', '');
  const [showShare, setShowShare] = useState(false);

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setPartyCode(code);
    setShowShare(true);
  };

  const addSharedTask = () => {
    const task = prompt('Task condiviso:');
    if (task) {
      setSharedTasks([...sharedTasks, {
        id: Date.now(),
        text: task,
        completedBy: [],
        requiredPlayers: 2,
      }]);
    }
  };

  const completeSharedTask = (taskId) => {
    setSharedTasks(sharedTasks.map(t =>
      t.id === taskId
        ? { ...t, completedBy: [...t.completedBy, 'You'] }
        : t
    ));
  };

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Users size={24} className="text-green-600 dark:text-green-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Co-Op Mode</h2>
      </div>

      {!partyCode ? (
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateCode}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl text-lg"
          >
            <Users className="inline mr-2" size={24} />
            Crea Party
          </motion.button>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
            Crea un party per task condivisi con amici!
          </p>
        </div>
      ) : (
        <>
          {/* Party Code */}
          <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Party Code</div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-300 tracking-wider">
                  {partyCode}
                </div>
              </div>
              <Share2 className="text-green-600" size={32} />
            </div>
          </div>

          {/* Shared Tasks */}
          <button
            onClick={addSharedTask}
            className="w-full mb-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg"
          >
            + Aggiungi Task Condiviso
          </button>

          <div className="space-y-2">
            {sharedTasks.map(task => {
              const isComplete = task.completedBy.length >= task.requiredPlayers;

              return (
                <motion.div
                  key={task.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-lg ${
                    isComplete
                      ? 'bg-green-100 dark:bg-green-900/20'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{task.text}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {task.completedBy.length}/{task.requiredPlayers} giocatori
                      </div>
                    </div>
                    {!task.completedBy.includes('You') && !isComplete && (
                      <button
                        onClick={() => completeSharedTask(task.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded"
                      >
                        Completa
                      </button>
                    )}
                    {isComplete && <Trophy className="text-yellow-600" size={24} />}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {sharedTasks.length === 0 && (
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Nessun task condiviso. Inizia ad aggiungerne!
            </p>
          )}
        </>
      )}

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
        <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
          {sharedTasks.filter(t => t.completedBy.length >= t.requiredPlayers).length}
        </div>
        <div className="text-xs text-blue-600 dark:text-blue-400">Task Co-Op Completati</div>
      </div>
    </div>
  );
}
