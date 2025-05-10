package com.example.server.repository.notification;

import com.example.server.model.notification.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long userId);
    long countByRecipientIdAndIsReadFalse(Long userId);
    List<Notification> findByRecipientId(Long userId);
}