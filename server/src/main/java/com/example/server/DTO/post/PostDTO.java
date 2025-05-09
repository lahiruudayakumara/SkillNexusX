package com.example.server.DTO.post;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostDTO {
    private Long id;
    private Long userId;
    private String title;
    private List<ContentBlockDTO> contentBlocks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String fullName;
    private String username;
    private boolean liked;
    private Number likeCount;
    private boolean follwedByUser;

    @JsonProperty("isPublished")
    private boolean isPublished;
}
