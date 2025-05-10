package com.example.server.service.notification;

import com.example.server.model.notification.Notification;
import com.example.server.model.user.User;
import com.example.server.repository.notification.NotificationRepository;
import com.example.server.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {
    @Autowired
    private NotificationRepository notificationRepo;
    @Autowired private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    public void sendNotification(Notification notification) {
        notificationRepo.save(notification);
        messagingTemplate.convertAndSendToUser(
                notification.getRecipientId().toString(),
                "/queue/notifications",
                notification
        );
    }

    public List<Notification> getUserNotifications(Long userId) {
        List<Notification> notifications = notificationRepository.findByRecipientId(userId);
        return notifications.stream().map(this::enrichNotificationWithUsername).collect(Collectors.toList());
    }

    public void markAsRead(Long id) {
        Notification n = notificationRepo.findById(id).orElseThrow();
        n.setRead(true);
        notificationRepo.save(n);
    }

    private Notification enrichNotificationWithUsername(Notification notification) {
        Optional<User> sender = userRepository.findById(notification.getActorId());
        if (sender.isPresent()) {
            String username = sender.get().getFullName();
            notification.setMessage("User " + username + " " + notification.getType().toLowerCase() + " you.");
        } else {
            notification.setMessage("Unknown user " +notification.getType().toLowerCase() + " you.");
        }
        return notification;
    }
}
