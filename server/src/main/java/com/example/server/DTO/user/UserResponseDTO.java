package com.example.server.DTO.user;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserResponseDTO {
    private Long id;
    private String email;
    private String username;
    private String provider;
    private String fullName;
    private boolean enabled;
    private boolean verified;
    private List<FollowDTO> followers;
    private List<FollowDTO> following;
}