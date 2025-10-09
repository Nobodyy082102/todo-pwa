import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, FileSpreadsheet, Calendar, FileCode } from 'lucide-react';
import { exportToCSV, exportToMarkdown, exportToICS, exportToPDF } from '../utils/exportUtils';

export function ExportPanel({ todos }) {
  const exportOptions = [
    {
      name: 'PDF',
      description: 'Documento formattato per la stampa',
      icon: FileText,
      color: 'red',
      action: () => exportToPDF(todos),
    },
    {
      name: 'CSV',
      description: 'Tabella per Excel/Google Sheets',
      icon: FileSpreadsheet,
      color: 'green',
      action: () => exportToCSV(todos),
    },
    {
      name: 'Markdown',
      description: 'Formato testo per note',
      icon: FileCode,
      color: 'blue',
      action: () => exportToMarkdown(todos),
    },
    {
      name: 'iCalendar',
      description: 'File calendario (.ics)',
      icon: Calendar,
      color: 'purple',
      action: () => exportToICS(todos),
    },
  ];

  const colorClasses = {
    red: {
      bg: 'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20',
      border: 'border-red-300 dark:border-red-600',
      icon: 'text-red-600 dark:text-red-400',
      hover: 'hover:border-red-500',
    },
    green: {
      bg: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      border: 'border-green-300 dark:border-green-600',
      icon: 'text-green-600 dark:text-green-400',
      hover: 'hover:border-green-500',
    },
    blue: {
      bg: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      border: 'border-blue-300 dark:border-blue-600',
      icon: 'text-blue-600 dark:text-blue-400',
      hover: 'hover:border-blue-500',
    },
    purple: {
      bg: 'from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20',
      border: 'border-purple-300 dark:border-purple-600',
      icon: 'text-purple-600 dark:text-purple-400',
      hover: 'hover:border-purple-500',
    },
  };

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <Download size={24} className="text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Esporta
        </h2>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Scarica le tue attività in diversi formati
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          const colors = colorClasses[option.color];

          return (
            <motion.button
              key={option.name}
              onClick={option.action}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`bg-gradient-to-br ${colors.bg} rounded-xl p-5 border-2 ${colors.border} ${colors.hover} transition-all text-left`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-white dark:bg-gray-800 shadow-sm`}>
                  <Icon size={24} className={colors.icon} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    {option.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          💡 <strong>Suggerimento:</strong> iCalendar esporta solo i task con promemoria attivi
        </p>
      </div>
    </div>
  );
}
