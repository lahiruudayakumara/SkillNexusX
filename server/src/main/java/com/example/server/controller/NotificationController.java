package com.example.server.controller;

import com.example.server.model.notification.Notification;
import com.example.server.service.notification.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private NotificationService service;

    @PostMapping
    public void createNotification(@RequestBody Notification notification) {
        service.sendNotification(notification);
    }

    @GetMapping
    public List<Notification> getAll(@RequestParam Long userId) {
        return service.getUserNotifications(userId);
    }

    @PostMapping("/{id}/read")
    public void markRead(@PathVariable Long id) {
        service.markAsRead(id);
    }
}
