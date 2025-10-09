import React, { useMemo } from 'react';
import { TrendingUp, CheckCircle2, Clock, Target, Calendar, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export function StatsDashboard({ todos }) {
  const stats = useMemo(() => {
    const completed = todos.filter(t => t.completed);
    const pending = todos.filter(t => !t.completed);
    const total = todos.length;

    // Completion rate
    const completionRate = total > 0 ? Math.round((completed.length / total) * 100) : 0;

    // Priority breakdown
    const priorityBreakdown = {
      high: todos.filter(t => t.priority === 'high').length,
      medium: todos.filter(t => t.priority === 'medium').length,
      low: todos.filter(t => t.priority === 'low').length,
    };

    // Category breakdown (top 5)
    const categoryMap = {};
    todos.forEach(todo => {
      if (todo.categories && Array.isArray(todo.categories)) {
        todo.categories.forEach(cat => {
          categoryMap[cat] = (categoryMap[cat] || 0) + 1;
        });
      }
    });
    const topCategories = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Activity trend (last 7 days)
    const last7Days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayTodos = todos.filter(t => {
        const createdDate = new Date(t.createdAt);
        return createdDate >= date && createdDate < nextDate;
      });

      last7Days.push({
        date: date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' }),
        count: dayTodos.length,
      });
    }

    // Most productive day
    const maxDay = last7Days.reduce((max, day) => day.count > max.count ? day : max, last7Days[0] || { count: 0 });

    // Average completion time (for completed tasks)
    let avgCompletionTime = 0;
    if (completed.length > 0) {
      const totalTime = completed.reduce((sum, todo) => {
        // Assume completion time is the time between creation and completion
        // Since we don't store completion time, we'll just show 0 for now
        return sum;
      }, 0);
      avgCompletionTime = totalTime / completed.length;
    }

    return {
      total,
      completed: completed.length,
      pending: pending.length,
      completionRate,
      priorityBreakdown,
      topCategories,
      last7Days,
      maxDay,
    };
  }, [todos]);

  const StatCard = ({ icon: Icon, label, value, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 ${color}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon size={20} className="text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {label}
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </div>
          {subtitle && (
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const ProgressBar = ({ label, value, max, color }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-300">{label}</span>
          <span className="font-medium text-gray-900 dark:text-white">{value}</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full ${color}`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
        <BarChart3 size={28} className="text-indigo-600 dark:text-indigo-400" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Statistiche e Analisi
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Panoramica della tua produttività
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          label="Totale Attività"
          value={stats.total}
          color="border-l-4 border-indigo-500"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completate"
          value={stats.completed}
          color="border-l-4 border-green-500"
          subtitle={`${stats.completionRate}% completato`}
        />
        <StatCard
          icon={Clock}
          label="In Sospeso"
          value={stats.pending}
          color="border-l-4 border-amber-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Giorno Top"
          value={stats.maxDay?.count || 0}
          color="border-l-4 border-purple-500"
          subtitle={stats.maxDay?.date || '-'}
        />
      </div>

      {/* Priority Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Target size={20} className="text-indigo-600 dark:text-indigo-400" />
          Distribuzione per Priorità
        </h3>
        <div className="space-y-3">
          <ProgressBar
            label="Alta Priorità"
            value={stats.priorityBreakdown.high}
            max={stats.total}
            color="bg-red-500"
          />
          <ProgressBar
            label="Media Priorità"
            value={stats.priorityBreakdown.medium}
            max={stats.total}
            color="bg-amber-500"
          />
          <ProgressBar
            label="Bassa Priorità"
            value={stats.priorityBreakdown.low}
            max={stats.total}
            color="bg-green-500"
          />
        </div>
      </div>

      {/* Category Breakdown */}
      {stats.topCategories.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-indigo-600 dark:text-indigo-400" />
            Top 5 Categorie
          </h3>
          <div className="space-y-3">
            {stats.topCategories.map(([category, count]) => (
              <ProgressBar
                key={category}
                label={category}
                value={count}
                max={stats.total}
                color="bg-indigo-500"
              />
            ))}
          </div>
        </div>
      )}

      {/* Activity Trend (Last 7 Days) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-indigo-600 dark:text-indigo-400" />
          Attività Ultimi 7 Giorni
        </h3>
        <div className="flex items-end justify-between gap-2 h-40">
          {stats.last7Days.map((day, index) => {
            const maxCount = Math.max(...stats.last7Days.map(d => d.count), 1);
            const heightPercentage = (day.count / maxCount) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercentage}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-full bg-indigo-500 rounded-t-lg min-h-[4px] relative group"
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {day.count} attività
                  </div>
                </motion.div>
                <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  {day.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion Rate Circle */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">
          Tasso di Completamento
        </h3>
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-40 h-40">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress circle */}
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 70}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - stats.completionRate / 100) }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="text-indigo-600 dark:text-indigo-400"
                strokeLinecap="round"
              />
            </svg>
            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {stats.completionRate}%
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            {stats.completed} di {stats.total} attività completate
          </p>
        </div>
      </div>
    </div>
  );
}
