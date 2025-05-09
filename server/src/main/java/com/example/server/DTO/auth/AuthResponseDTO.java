package com.example.server.DTO.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.Instant;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponseDTO {
    @JsonProperty("username")
    private String username;

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("email")
    private String email;

    private String token;
    @JsonProperty("expires_in")
    private Date expiresIn;

    @JsonProperty("refresh_token")
    private String refreshToken;

    @JsonProperty("timestamp")
    private Instant timestamp = Instant.now();
}