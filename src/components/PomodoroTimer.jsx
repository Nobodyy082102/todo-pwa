import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Zap, Timer } from 'lucide-react';
import { useSoundEffects } from '../hooks/useSoundEffects';

const WORK_TIME = 25 * 60; // 25 minuti
const SHORT_BREAK = 5 * 60; // 5 minuti
const LONG_BREAK = 15 * 60; // 15 minuti
const POMODOROS_BEFORE_LONG_BREAK = 4;

export function PomodoroTimer({ taskId, taskTitle, onSessionComplete }) {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const { playAchievement } = useSoundEffects();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    playAchievement();

    if (mode === 'work') {
      const newPomodoros = pomodorosCompleted + 1;
      setPomodorosCompleted(newPomodoros);

      if (onSessionComplete) {
        onSessionComplete(taskId, WORK_TIME);
      }

      // Notifica browser
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro completato! 🍅', {
          body: `Ottimo lavoro su "${taskTitle}"! Tempo per una pausa.`,
          icon: '/icon-192.png',
        });
      }

      // Passa a pausa
      if (newPomodoros % POMODOROS_BEFORE_LONG_BREAK === 0) {
        setMode('longBreak');
        setTimeLeft(LONG_BREAK);
      } else {
        setMode('shortBreak');
        setTimeLeft(SHORT_BREAK);
      }
    } else {
      // Fine pausa
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pausa terminata! ⏰', {
          body: 'Pronto per un altro pomodoro?',
          icon: '/icon-192.png',
        });
      }

      setMode('work');
      setTimeLeft(WORK_TIME);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode('work');
    setTimeLeft(WORK_TIME);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work'
    ? ((WORK_TIME - timeLeft) / WORK_TIME) * 100
    : mode === 'shortBreak'
    ? ((SHORT_BREAK - timeLeft) / SHORT_BREAK) * 100
    : ((LONG_BREAK - timeLeft) / LONG_BREAK) * 100;

  const modeConfig = {
    work: {
      label: 'Focus',
      icon: Zap,
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      borderColor: 'border-indigo-300 dark:border-indigo-600',
    },
    shortBreak: {
      label: 'Pausa Breve',
      icon: Coffee,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-300 dark:border-green-600',
    },
    longBreak: {
      label: 'Pausa Lunga',
      icon: Coffee,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-300 dark:border-blue-600',
    },
  };

  const config = modeConfig[mode];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${config.bgColor} rounded-xl p-4 border-2 ${config.borderColor} shadow-lg`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-gray-700 dark:text-gray-300" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {config.label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: POMODOROS_BEFORE_LONG_BREAK }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < pomodorosCompleted % POMODOROS_BEFORE_LONG_BREAK
                  ? 'bg-red-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Timer Display */}
      <div className="relative">
        <div className="text-center mb-4">
          <motion.div
            key={timeLeft}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className={`text-4xl font-bold bg-gradient-to-r ${config.color} text-transparent bg-clip-text`}
          >
            {formatTime(timeLeft)}
          </motion.div>
        </div>

        {/* Progress Ring */}
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
          <motion.div
            className={`h-full bg-gradient-to-r ${config.color}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTimer}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${config.color} text-white font-medium shadow-md`}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
          <span>{isRunning ? 'Pausa' : 'Avvia'}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetTimer}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <RotateCcw size={16} className="text-gray-700 dark:text-gray-300" />
        </motion.button>
      </div>

      {/* Pomodoros Count */}
      <div className="mt-3 text-center text-xs text-gray-600 dark:text-gray-400">
        🍅 {pomodorosCompleted} pomodoro{pomodorosCompleted !== 1 ? 's' : ''} completati
      </div>
    </motion.div>
  );
}
