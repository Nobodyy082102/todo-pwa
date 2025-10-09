import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_CATEGORIES } from './CategorySelector';

export function FilterPanel({ onFilterChange, activeFilters }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const togglePriority = (priority) => {
    const current = activeFilters.priorities || [];
    const updated = current.includes(priority)
      ? current.filter(p => p !== priority)
      : [...current, priority];
    onFilterChange({ ...activeFilters, priorities: updated });
  };

  const toggleCategory = (category) => {
    const current = activeFilters.categories || [];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    onFilterChange({ ...activeFilters, categories: updated });
  };

  const toggleShowCompleted = () => {
    onFilterChange({ ...activeFilters, showCompleted: !activeFilters.showCompleted });
  };

  const setDateRange = (range) => {
    onFilterChange({ ...activeFilters, dateRange: range });
  };

  const clearAllFilters = () => {
    onFilterChange({
      priorities: [],
      categories: [],
      showCompleted: true,
      dateRange: 'all',
    });
  };

  const hasActiveFilters = () => {
    return (
      (activeFilters.priorities && activeFilters.priorities.length > 0) ||
      (activeFilters.categories && activeFilters.categories.length > 0) ||
      activeFilters.showCompleted === false ||
      (activeFilters.dateRange && activeFilters.dateRange !== 'all')
    );
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-300',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300',
    low: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-300',
  };

  const priorityLabels = {
    high: 'Alta',
    medium: 'Media',
    low: 'Bassa',
  };

  const getCategoryColor = (categoryName) => {
    const predefined = DEFAULT_CATEGORIES.find(c => c.name === categoryName);
    return predefined?.color || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
  };

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg overflow-hidden hover-lift border border-white/20 dark:border-white/10">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Filter size={20} className="text-gray-600 dark:text-gray-400" />
          <span className="font-semibold text-gray-900 dark:text-white">
            Filtri
          </span>
          {hasActiveFilters() && (
            <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">
              Attivi
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters() && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearAllFilters();
              }}
              className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
            >
              Cancella tutto
            </button>
          )}
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronDown size={20} className="text-gray-600 dark:text-gray-400" />
          )}
        </div>
      </button>

      {/* Filter Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-5 border-t border-gray-200 dark:border-gray-700 pt-4">
              {/* Priority Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priorità
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['high', 'medium', 'low'].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => togglePriority(priority)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        activeFilters.priorities?.includes(priority)
                          ? priorityColors[priority]
                          : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {priorityLabels[priority]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categorie
                </h4>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_CATEGORIES.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => toggleCategory(category.name)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        activeFilters.categories?.includes(category.name)
                          ? category.color
                          : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Periodo
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'Tutte' },
                    { value: 'today', label: 'Oggi' },
                    { value: 'week', label: 'Questa settimana' },
                    { value: 'month', label: 'Questo mese' },
                  ].map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setDateRange(range.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        (activeFilters.dateRange || 'all') === range.value
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-300'
                          : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Show Completed Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mostra completate
                </span>
                <button
                  onClick={toggleShowCompleted}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    activeFilters.showCompleted !== false
                      ? 'bg-indigo-600'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      activeFilters.showCompleted !== false ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
