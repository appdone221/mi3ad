import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'event' | 'booking' | 'payment' | 'system' | 'new_event' | 'nearby_event';
  timestamp: Date;
  read: boolean;
  eventId?: string;
  location?: string;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock events data for real-time notifications
const mockEvents = [
  {
    id: 'new_1',
    title: 'AI Workshop 2024',
    titleAr: 'ورشة الذكاء الاصطناعي 2024',
    location: 'Tech Hub Dubai',
    locationAr: 'مركز التقنية دبي',
    category: 'government',
    date: '2024-03-15',
    price: 0,
  },
  {
    id: 'new_2',
    title: 'Medical Innovation Summit',
    titleAr: 'قمة الابتكار الطبي',
    location: 'Medical Center',
    locationAr: 'المركز الطبي',
    category: 'clinics',
    date: '2024-03-20',
    price: 75,
  },
  {
    id: 'new_3',
    title: 'School Science Fair',
    titleAr: 'معرض العلوم المدرسي',
    location: 'Al Noor School',
    locationAr: 'مدرسة النور',
    category: 'schools',
    date: '2024-03-25',
    price: 0,
  },
  {
    id: 'new_4',
    title: 'Business Networking Event',
    titleAr: 'فعالية التواصل التجاري',
    location: 'Business Center',
    locationAr: 'مركز الأعمال',
    category: 'government',
    date: '2024-03-30',
    price: 50,
  },
  {
    id: 'new_5',
    title: 'Art Gallery Opening',
    titleAr: 'افتتاح معرض فني',
    location: 'Cultural Center',
    locationAr: 'المركز الثقافي',
    category: 'openings',
    date: '2024-04-05',
    price: 25,
  },
];

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    // Initial notifications
    {
      id: '1',
      title: 'Welcome to Mi3AD!',
      message: 'Discover amazing events in your area and book your tickets easily.',
      type: 'system',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      priority: 'medium',
    },
    {
      id: '2',
      title: 'Tech Conference 2024',
      message: 'Your booking has been confirmed. Event starts tomorrow at 9:00 AM.',
      type: 'booking',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      eventId: '1',
      priority: 'high',
    },
  ]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Real-time notifications for new events
  useEffect(() => {
    let eventIndex = 0;
    
    const interval = setInterval(() => {
      // Simulate new event notifications every 45 seconds
      if (Math.random() > 0.3 && eventIndex < mockEvents.length) {
        const event = mockEvents[eventIndex];
        
        // Randomly choose between new event and nearby event notification
        const isNearbyEvent = Math.random() > 0.5;
        
        if (isNearbyEvent) {
          addNotification({
            title: 'New Event Nearby!',
            message: `${event.title} is happening near you on ${new Date(event.date).toLocaleDateString()}`,
            type: 'nearby_event',
            eventId: event.id,
            location: event.location,
            priority: 'medium',
          });
        } else {
          addNotification({
            title: 'New Event Posted!',
            message: `${event.title} - ${event.price === 0 ? 'Free Event' : `${event.price} DL`}`,
            type: 'new_event',
            eventId: event.id,
            location: event.location,
            priority: 'medium',
          });
        }
        
        eventIndex++;
      }
      
      // Simulate other types of notifications occasionally
      if (Math.random() > 0.85) {
        const notificationTypes = [
          {
            title: 'Booking Reminder',
            message: 'Your event starts in 2 hours. Don\'t forget to attend!',
            type: 'booking' as const,
            priority: 'high' as const,
          },
          {
            title: 'Payment Processed',
            message: 'Your payment for Medical Symposium has been processed successfully.',
            type: 'payment' as const,
            priority: 'medium' as const,
          },
          {
            title: 'Event Update',
            message: 'The venue for Tech Conference has been changed. Check your tickets for details.',
            type: 'event' as const,
            priority: 'high' as const,
          },
        ];
        
        const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        addNotification(randomNotification);
      }
    }, 45000); // Every 45 seconds

    return () => clearInterval(interval);
  }, []);

  // Simulate location-based nearby event notifications
  useEffect(() => {
    const nearbyInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const nearbyEvents = [
          'Cultural Festival happening 2km away',
          'Business Meetup in your area tomorrow',
          'Free Health Checkup at nearby clinic',
          'Art Exhibition opening this weekend',
          'Tech Talk at local university',
        ];
        
        const randomEvent = nearbyEvents[Math.floor(Math.random() * nearbyEvents.length)];
        
        addNotification({
          title: 'Event Near You!',
          message: randomEvent,
          type: 'nearby_event',
          priority: 'medium',
        });
      }
    }, 60000); // Every minute

    return () => clearInterval(nearbyInterval);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      removeNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};