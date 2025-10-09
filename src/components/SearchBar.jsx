import React from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

export function SearchBar({ value, onChange, placeholder = 'Cerca attività...' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative glass-light dark:glass-dark rounded-2xl shadow-lg hover-glow border border-white/20 dark:border-white/10"
    >
      <div className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 border-2 border-transparent rounded-lg focus:outline-none focus:border-indigo-500 dark:bg-gray-800 dark:text-white transition-colors"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
