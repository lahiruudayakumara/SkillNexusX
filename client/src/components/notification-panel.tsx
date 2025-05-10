import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useNotificationSocket from '@/hooks/use-notification-socket';
import { Notification } from '@/types/notification-types';
import { Bell, Check, Clock, Trash } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  userId: number;
}

const NotificationPanel: React.FC<Props> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    axios
      .get<Notification[]>(`http://localhost:8082/api/notifications?userId=${userId}`)
      .then((res) => {
        setNotifications(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch notifications:', err);
        setError('Could not load notifications. Please try again later.');
        setIsLoading(false);
      });
  }, [userId]);

  useNotificationSocket(userId, (newNotification: Notification) => {
    setNotifications((prev) => [newNotification, ...prev]);
  });

  const markAsRead = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    axios.post(`http://localhost:8082/api/notifications/${id}/read`)
      .then(() => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
      })
      .catch((err) => {
        console.error('Failed to mark notification as read:', err);
      });
  };

  const deleteNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    axios.delete(`http://localhost:8082/api/notifications/${id}`)
      .then(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      })
      .catch((err) => {
        console.error('Failed to delete notification:', err);
      });
  };

  const markAllAsRead = () => {
    axios.post(`http://localhost:8082/api/notifications/read-all?userId=${userId}`)
      .then(() => {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true }))
        );
      })
      .catch((err) => {
        console.error('Failed to mark all notifications as read:', err);
      });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-pulse text-gray-500">Loading notifications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg max-h-96 overflow-hidden flex flex-col">
      <div className="bg-gray-50 p-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-2">
          <Bell size={18} className="text-blue-600" />
          <h3 className="font-semibold text-lg">Notifications</h3>
          {/* {unreadCount > 0 && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )} */}
        </div>
        {/* {notifications.length > 0 && (
          <button 
            onClick={markAllAsRead} 
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Mark all as read
          </button>
        )} */}
      </div>
      
      <div className="overflow-y-auto flex-grow">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No notifications yet</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notifications.map((notification) => {
              const timestamp = notification.createdAt ? new Date(notification.createdAt) : new Date();
              const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });
              
              return (
                <li
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                  onClick={(e) => markAsRead(notification.id, e)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.isRead ? 'font-medium' : ''}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock size={12} className="mr-1" />
                        <span>{timeAgo}</span>
                      </div>
                    </div>
                    {/* <div className="flex space-x-2 ml-4">
                      {!notification.isRead && (
                        <button 
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                          onClick={(e) => markAsRead(notification.id, e)}
                          title="Mark as read"
                        >
                          <Check size={16} />
                        </button>
                      )}
                    </div> */}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;