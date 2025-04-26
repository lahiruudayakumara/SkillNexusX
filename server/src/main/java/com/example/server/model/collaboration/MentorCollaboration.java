package com.example.server.model.collaboration;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MentorCollaboration {

    private Long id;
    private Long mentorId;
    private Long userId;
    private LocalDateTime scheduledTime;
    private Integer durationInMinutes;
    private String resources;
}
