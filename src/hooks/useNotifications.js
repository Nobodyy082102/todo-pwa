import { useState, useEffect, useCallback } from 'react';

export function useNotifications() {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );
  const [activeNotifications, setActiveNotifications] = useState(new Map());

  useEffect(() => {
    if (typeof Notification !== 'undefined' && permission === 'default') {
      Notification.requestPermission().then(setPermission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') {
      console.warn('Le notifiche non sono supportate in questo browser');
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  }, []);

  const showNotification = useCallback((title, options = {}) => {
    if (permission !== 'granted') {
      console.warn('Permesso notifiche non concesso');
      return null;
    }

    const notification = new Notification(title, {
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      requireInteraction: true, // La notifica rimane visibile
      ...options,
    });

    // Aggiungi alla mappa delle notifiche attive
    if (options.tag) {
      setActiveNotifications(prev => {
        const newMap = new Map(prev);
        newMap.set(options.tag, notification);
        return newMap;
      });
    }

    return notification;
  }, [permission]);

  const closeNotification = useCallback((tag) => {
    const notification = activeNotifications.get(tag);
    if (notification) {
      notification.close();
      setActiveNotifications(prev => {
        const newMap = new Map(prev);
        newMap.delete(tag);
        return newMap;
      });
    }
  }, [activeNotifications]);

  const closeAllNotifications = useCallback(() => {
    activeNotifications.forEach(notification => notification.close());
    setActiveNotifications(new Map());
  }, [activeNotifications]);

  return {
    permission,
    requestPermission,
    showNotification,
    closeNotification,
    closeAllNotifications,
    isSupported: typeof Notification !== 'undefined',
  };
}
