package com.example.server.DTO.post;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class CommentResponseDTO {
    private Long id;
    private String content;
    private String author;
    private LocalDateTime createdAt;
    private List<CommentResponseDTO> replies;
}
