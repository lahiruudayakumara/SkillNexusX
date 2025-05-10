package com.example.server.DTO.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FollowDTO {
    private Long id;
    private String name;
    private String avatar;

    public FollowDTO(Long id, String name, String avatar) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
    }
}
