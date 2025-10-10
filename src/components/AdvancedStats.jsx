import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export function AdvancedStats({ todos }) {
  const stats = useMemo(() => {
    const completed = todos.filter(t => t.completed);

    // Distribuzione per priorità
    const priorityDist = {
      high: todos.filter(t => t.priority === 'high').length,
      medium: todos.filter(t => t.priority === 'medium').length,
      low: todos.filter(t => t.priority === 'low').length,
    };

    const priorityData = [
      { name: 'Priorità Alta', value: priorityDist.high, color: '#ef4444' },
      { name: 'Priorità Media', value: priorityDist.medium, color: '#f59e0b' },
      { name: 'Priorità Bassa', value: priorityDist.low, color: '#10b981' },
    ];

    // Distribuzione per categoria
    const categoryMap = {};
    todos.forEach(todo => {
      if (todo.categories) {
        todo.categories.forEach(cat => {
          categoryMap[cat] = (categoryMap[cat] || 0) + 1;
        });
      }
    });

    const categoryData = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // Task completati per giorno (ultimi 14 giorni)
    const dailyData = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = completed.filter(todo => {
        if (!todo.completedAt) return false;
        const completedDate = new Date(todo.completedAt);
        return completedDate >= date && completedDate < nextDate;
      }).length;

      dailyData.push({
        date: date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }),
        completati: count,
      });
    }

    // Produttività per ora del giorno
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      ora: `${i}:00`,
      task: 0,
    }));

    completed.forEach(todo => {
      if (todo.completedAt) {
        const hour = new Date(todo.completedAt).getHours();
        hourlyData[hour].task++;
      }
    });

    return { priorityData, categoryData, dailyData, hourlyData };
  }, [todos]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp size={24} className="text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Statistiche Avanzate
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuzione Priorità */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Distribuzione Priorità
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Categorie più usate */}
        {stats.categoryData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Categorie Popolari
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.categoryData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Trend ultimi 14 giorni */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Task Completati (Ultimi 14 Giorni)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.dailyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="completati"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: '#6366f1', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Produttività per ora */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Produttività per Ora del Giorno
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.hourlyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="ora" stroke="#888" fontSize={10} interval={2} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="task" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
