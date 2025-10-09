import React, { useState } from 'react';
import { Share2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateShareUrl, copyToClipboard, shareViaWebShare } from '../utils/shareUtils';

export function ShareButton({ todo }) {
  const [showMenu, setShowMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = async () => {
    // Try Web Share API first (mobile)
    const shared = await shareViaWebShare(todo);
    if (shared) {
      setShowMenu(false);
      return;
    }

    // Otherwise show copy menu
    setShowMenu(!showMenu);
  };

  const handleCopyLink = async () => {
    const url = generateShareUrl(todo);
    if (url) {
      const success = await copyToClipboard(url);
      if (success) {
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
          setShowMenu(false);
        }, 2000);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
        title="Condividi attività"
      >
        <Share2 size={18} />
      </button>

      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-8 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 min-w-[200px]"
            >
              <button
                onClick={handleCopyLink}
                disabled={copySuccess}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left text-sm"
              >
                {copySuccess ? (
                  <>
                    <Check size={16} className="text-green-600 dark:text-green-400" />
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Link copiato!
                    </span>
                  </>
                ) : (
                  <>
                    <Share2 size={16} className="text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      Copia link
                    </span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowMenu(false)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left text-sm mt-1"
              >
                <X size={16} className="text-gray-600 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">Annulla</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
