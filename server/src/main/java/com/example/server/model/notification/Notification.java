package com.example.server.model.notification;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Notification {
    @Id
    @GeneratedValue
    private Long id;

    private Long recipientId;
    private Long actorId;
    private String type; // e.g. "FOLLOW", "COMMENT", "MENTION"
    private String message;
    private boolean isRead = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}