import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

export function ActivityHeatmap({ todos }) {
  const heatmapData = useMemo(() => {
    const completed = todos.filter(t => t.completed && t.completedAt);

    // Get last 12 weeks
    const weeks = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 83); // 12 weeks = 84 days

    // Create map of dates to task counts
    const taskCounts = {};
    completed.forEach(task => {
      const date = new Date(task.completedAt);
      const dateStr = date.toDateString();
      taskCounts[dateStr] = (taskCounts[dateStr] || 0) + 1;
    });

    // Generate 12 weeks of data
    for (let week = 0; week < 12; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + week * 7 + day);

        const dateStr = date.toDateString();
        const count = taskCounts[dateStr] || 0;

        weekData.push({
          date: date.toISOString().split('T')[0],
          count,
          dateStr,
          isToday: dateStr === today.toDateString(),
          isFuture: date > today,
        });
      }
      weeks.push(weekData);
    }

    // Calculate stats
    const maxCount = Math.max(...Object.values(taskCounts), 1);
    const totalDays = Object.keys(taskCounts).length;
    const totalTasks = Object.values(taskCounts).reduce((sum, count) => sum + count, 0);

    return { weeks, maxCount, totalDays, totalTasks };
  }, [todos]);

  const getColor = (count) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    const intensity = Math.min(4, Math.ceil((count / heatmapData.maxCount) * 4));

    const colors = [
      'bg-green-200 dark:bg-green-900/40',
      'bg-green-400 dark:bg-green-700/60',
      'bg-green-600 dark:bg-green-500/80',
      'bg-green-800 dark:bg-green-400',
    ];

    return colors[intensity - 1];
  };

  const getDayLabel = (dayIndex) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    return days[dayIndex];
  };

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Calendar size={24} className="text-green-600 dark:text-green-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Heatmap Attività
        </h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-xl font-bold text-green-700 dark:text-green-300">
            {heatmapData.totalTasks}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            Task Totali
          </div>
        </div>
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
            {heatmapData.totalDays}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            Giorni Attivi
          </div>
        </div>
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-xl font-bold text-purple-700 dark:text-purple-300">
            {heatmapData.totalDays > 0 ? Math.round(heatmapData.totalTasks / heatmapData.totalDays) : 0}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400">
            Media/Giorno
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-2 justify-start pt-5">
            {[1, 3, 5].map(dayIndex => (
              <div key={dayIndex} className="h-3 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                {getDayLabel(dayIndex)}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {heatmapData.weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <motion.div
                  key={day.date}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
                  whileHover={{ scale: 1.5, zIndex: 10 }}
                  className={`w-3 h-3 rounded-sm ${
                    day.isFuture
                      ? 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700'
                      : getColor(day.count)
                  } ${day.isToday ? 'ring-2 ring-blue-500' : ''}`}
                  title={`${day.date}: ${day.count} task`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className="text-xs text-gray-600 dark:text-gray-400">Meno</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm ${
                level === 0
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : level === 1
                  ? 'bg-green-200 dark:bg-green-900/40'
                  : level === 2
                  ? 'bg-green-400 dark:bg-green-700/60'
                  : level === 3
                  ? 'bg-green-600 dark:bg-green-500/80'
                  : 'bg-green-800 dark:bg-green-400'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-600 dark:text-gray-400">Più</span>
      </div>

      <p className="mt-4 text-xs text-center text-gray-600 dark:text-gray-400">
        Ultimi 3 mesi di attività • Ispirato a GitHub
      </p>
    </div>
  );
}
