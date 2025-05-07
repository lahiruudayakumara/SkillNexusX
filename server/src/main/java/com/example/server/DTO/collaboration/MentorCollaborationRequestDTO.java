package com.example.server.DTO.collaboration;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MentorCollaborationRequestDTO {
    private Long mentorId;
    private Long userId;
    private LocalDateTime scheduledTime;
    private Integer durationInMinutes;
    private String topic;
}
