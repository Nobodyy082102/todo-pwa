import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Download } from 'lucide-react';

export function VoiceInput({ onTasksCreated }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition non supportato in questo browser. Usa Chrome o Edge!');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'it-IT';
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript((prev) => prev + finalTranscript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const parseTasksFromText = () => {
    if (!transcript.trim()) {
      alert('Nessun testo da convertire!');
      return;
    }

    // Split by common delimiters
    const lines = transcript
      .split(/[,;.\n]|poi|dopo|anche|e poi|inoltre/)
      .map(line => line.trim())
      .filter(line => line.length > 3);

    const tasks = lines.map(line => {
      // Simple priority detection
      const priority =
        /urgente|subito|importante|critico/i.test(line) ? 'high' :
        /medio|normale/i.test(line) ? 'medium' : 'low';

      return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: line.replace(/urgente|subito|importante|critico|medio|normale/gi, '').trim(),
        priority,
        completed: false,
        createdAt: Date.now(),
        categories: [],
      };
    });

    if (tasks.length === 0) {
      alert('Nessun task rilevato. Prova a parlare più chiaramente!');
      return;
    }

    onTasksCreated(tasks);
    setTranscript('');
    alert(`${tasks.length} task creati! 🎉`);
  };

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Mic size={24} className="text-red-600 dark:text-red-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Brain Dump Vocale
        </h2>
      </div>

      <div className="space-y-4">
        {/* Voice Button */}
        <div className="flex justify-center">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={isListening ? stopListening : startListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                : 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
            }`}
          >
            {isListening ? (
              <MicOff size={40} className="text-white" />
            ) : (
              <Mic size={40} className="text-white" />
            )}
          </motion.button>
        </div>

        {/* Status */}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isListening ? (
              <span className="text-red-600 dark:text-red-400">🔴 Ascolto in corso...</span>
            ) : (
              'Premi per iniziare a parlare'
            )}
          </p>
        </div>

        {/* Transcript */}
        <AnimatePresence>
          {transcript && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {transcript}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Convert Button */}
        {transcript && !isListening && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={parseTasksFromText}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg transition-all"
          >
            <Download size={20} />
            <span>Converti in Task</span>
          </motion.button>
        )}

        {/* Instructions */}
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <p>💡 <strong>Come usarlo:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Premi il microfono e parla liberamente</li>
            <li>Separa task con: virgola, punto, "poi", "anche"</li>
            <li>Dì "urgente" o "importante" per alta priorità</li>
            <li>Esempio: "Comprare latte, poi chiamare Mario, urgente finire report"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
