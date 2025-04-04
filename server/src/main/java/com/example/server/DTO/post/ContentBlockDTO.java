package com.example.server.DTO.post;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import com.example.server.model.post.ContentType;

@Data
@Getter
@Setter
public class ContentBlockDTO {
    private Long id;
    private ContentType type;
    private String content;
    private String url;
    private Integer videoDuration;
    private int position;
}
