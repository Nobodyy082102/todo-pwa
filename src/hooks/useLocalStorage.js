import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // Stato per memorizzare il valore
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Errore nel caricamento da localStorage:', error);
      return initialValue;
    }
  });

  // Funzione per aggiornare il valore
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Errore nel salvataggio su localStorage:', error);
    }
  };

  return [storedValue, setValue];
}
