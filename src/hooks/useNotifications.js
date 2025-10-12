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

    // Determina il base path corretto (per GitHub Pages o locale)
    const basePath = import.meta.env.BASE_URL || '/';
    const iconPath = `${basePath}pwa-192x192.png`.replace('//', '/');

    const notification = new Notification(title, {
      icon: iconPath,
      badge: iconPath,
      requireInteraction: true, // La notifica rimane visibile
      vibrate: [200, 100, 200], // Pattern di vibrazione
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
    setActiveNotifications(prev => {
      const notification = prev.get(tag);
      if (notification) {
        notification.close();
        const newMap = new Map(prev);
        newMap.delete(tag);
        return newMap;
      }
      return prev;
    });
  }, []);

  const closeAllNotifications = useCallback(() => {
    setActiveNotifications(prev => {
      prev.forEach(notification => notification.close());
      return new Map();
    });
  }, []);

  return {
    permission,
    requestPermission,
    showNotification,
    closeNotification,
    closeAllNotifications,
    isSupported: typeof Notification !== 'undefined',
  };
}
