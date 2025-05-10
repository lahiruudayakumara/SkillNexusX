package com.example.server.service.notification;

import com.example.server.model.notification.Notification;

import java.util.List;

public interface NotificationService {
    void sendNotification(Notification notification);
    List<Notification> getUserNotifications(Long userId);
    void markAsRead(Long id);
}
