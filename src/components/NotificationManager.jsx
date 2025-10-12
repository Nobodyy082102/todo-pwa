import { useEffect, useRef, useCallback } from 'react';
import { useNotifications } from '../hooks/useNotifications';

export function NotificationManager({ todos, onSnooze, onComplete }) {
  const { permission, showNotification, closeNotification } = useNotifications();
  const checkIntervalRef = useRef(null);
  const notifiedTodosRef = useRef(new Set());

  // Handler per service worker messages (definito una sola volta)
  const handleServiceWorkerMessage = useCallback((event) => {
    if (event.data.type === 'NOTIFICATION_ACTION') {
      if (event.data.action === 'complete') {
        onComplete(event.data.todoId);
      } else if (event.data.action === 'snooze') {
        onSnooze(event.data.todoId, 30);
      }
    }
  }, [onComplete, onSnooze]);

  // Registra event listener per service worker una sola volta
  useEffect(() => {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

      return () => {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      };
    }
  }, [handleServiceWorkerMessage]);

  useEffect(() => {
    if (permission !== 'granted') return;

    const checkReminders = () => {
      const now = Date.now();

      todos.forEach((todo) => {
        if (todo.completed) {
          // Chiudi notifica se l'attività è stata completata
          closeNotification(`todo-${todo.id}`);
          notifiedTodosRef.current.delete(todo.id);
          return;
        }

        if (!todo.reminder) return;

        const shouldNotify =
          todo.reminder.type === 'specific'
            ? now >= todo.reminder.datetime && !notifiedTodosRef.current.has(todo.id)
            : now >= todo.reminder.nextTrigger;

        if (shouldNotify) {
          // Chiudi notifica precedente se esiste
          closeNotification(`todo-${todo.id}`);

          const notification = showNotification(todo.title, {
            body: todo.description || 'Completa questa attività!',
            tag: `todo-${todo.id}`,
            requireInteraction: true,
            vibrate: [200, 100, 200],
            actions: [
              { action: 'complete', title: 'Completa' },
              { action: 'snooze', title: 'Snooze 30min' },
            ],
          });

          if (notification) {
            // Segna come notificato per promemoria specifici
            if (todo.reminder.type === 'specific') {
              notifiedTodosRef.current.add(todo.id);
            }

            // Gestisci click sulla notifica
            notification.onclick = () => {
              onComplete(todo.id);
              notification.close();
            };
          }
        }
      });
    };

    // Controlla ogni 10 secondi
    checkIntervalRef.current = setInterval(checkReminders, 10000);
    checkReminders(); // Controllo immediato

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [todos, permission, showNotification, closeNotification, onSnooze, onComplete]);

  return null; // Questo componente non renderizza nulla
}
