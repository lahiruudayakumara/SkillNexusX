package com.example.server.DTO.post;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
public class PostCreateDTO {
    @JsonProperty(namespace = "userId")
    private Long userId;

    @JsonProperty(namespace = "title")
    private String title;

    @JsonProperty(namespace = "contentBlocks")
    private List<ContentBlockDTO> contentBlocks;

    @JsonProperty(namespace = "isPublished")
    private boolean isPublished;
}