import React, { useState } from 'react';
import { Tag, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Categorie predefinite con colori professionali
export const DEFAULT_CATEGORIES = [
  { name: 'Lavoro', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300 dark:border-blue-700' },
  { name: 'Personale', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300 dark:border-purple-700' },
  { name: 'Urgente', color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-300 dark:border-red-700' },
  { name: 'Casa', color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-300 dark:border-green-700' },
  { name: 'Progetto', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-700' },
  { name: 'Salute', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300 border-pink-300 dark:border-pink-700' },
  { name: 'Studio', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700' },
  { name: 'Shopping', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-teal-300 dark:border-teal-700' },
];

export function CategorySelector({ selectedCategories = [], onChange, showLabel = true }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  const toggleCategory = (categoryName) => {
    if (selectedCategories.includes(categoryName)) {
      onChange(selectedCategories.filter(c => c !== categoryName));
    } else {
      onChange([...selectedCategories, categoryName]);
    }
  };

  const addCustomCategory = () => {
    const trimmed = customCategory.trim();
    if (trimmed && !selectedCategories.includes(trimmed)) {
      onChange([...selectedCategories, trimmed]);
      setCustomCategory('');
    }
  };

  const getCategoryColor = (categoryName) => {
    const predefined = DEFAULT_CATEGORIES.find(c => c.name === categoryName);
    return predefined?.color || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
  };

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex items-center gap-2">
          <Tag size={20} className="text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Categorie
          </span>
        </div>
      )}

      {/* Selected categories as pills */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {selectedCategories.map((category) => (
              <motion.span
                key={category}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(category)}`}
              >
                {category}
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <X size={14} />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1"
      >
        <Plus size={16} />
        {isExpanded ? 'Nascondi categorie' : 'Aggiungi categoria'}
      </button>

      {/* Category selection panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
              {/* Predefined categories */}
              <div className="flex flex-wrap gap-2">
                {DEFAULT_CATEGORIES.map((category) => (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => toggleCategory(category.name)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedCategories.includes(category.name)
                        ? category.color
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Custom category input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomCategory();
                    }
                  }}
                  placeholder="Categoria personalizzata..."
                  maxLength={20}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={addCustomCategory}
                  disabled={!customCategory.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
