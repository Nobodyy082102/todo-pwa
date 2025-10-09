import { useEffect, useRef } from 'react';
import { useNotifications } from '../hooks/useNotifications';

export function NotificationManager({ todos, onSnooze, onComplete }) {
  const { permission, showNotification, closeNotification } = useNotifications();
  const checkIntervalRef = useRef(null);
  const notifiedTodosRef = useRef(new Set());

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

            // Gestisci azioni (se supportate dal browser)
            if (navigator.serviceWorker && navigator.serviceWorker.controller) {
              navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data.type === 'NOTIFICATION_ACTION') {
                  if (event.data.action === 'complete' && event.data.todoId === todo.id) {
                    onComplete(todo.id);
                  } else if (event.data.action === 'snooze' && event.data.todoId === todo.id) {
                    onSnooze(todo.id, 30);
                  }
                }
              });
            }
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
