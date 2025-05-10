import { Notification } from '@/types/notification-types';
import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { over, Client } from 'stompjs';

export default function useNotificationSocket(
  userId: number,
  onNotification: (n: Notification) => void
) {
  useEffect(() => {
    const socket = new SockJS('http://localhost:8082/ws');
    const stompClient: Client = over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe(`/user/${userId}/queue/notifications`, (message) => {
        const notification: Notification = JSON.parse(message.body);
        onNotification(notification);
      });
    });

    return () => {
      if (stompClient.connected) {
        stompClient.disconnect(() => {});
      }
    };
  }, [userId, onNotification]);
}
