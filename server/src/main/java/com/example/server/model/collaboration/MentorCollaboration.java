package com.example.server.model.collaboration;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "mentor_collaborations")
@Getter
@Setter
@NoArgsConstructor
public class MentorCollaboration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long mentorId;
    private Long userId;
    private LocalDateTime scheduledTime;
    private Integer durationInMinutes;
    private String topic;
    private String status;

    public MentorCollaboration(Long mentorId, Long userId, LocalDateTime scheduledTime, Integer durationInMinutes, String topic, String status) {
        this.mentorId = mentorId;
        this.userId = userId;
        this.scheduledTime = scheduledTime;
        this.durationInMinutes = durationInMinutes;
        this.topic = topic;
        this.status = status;
    }
}
