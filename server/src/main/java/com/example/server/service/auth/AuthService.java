package com.example.server.service.auth;

import com.example.server.DTO.auth.AuthRequestDTO;
import com.example.server.DTO.auth.RegisterRequestDTO;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface AuthService {
    String registerUser(RegisterRequestDTO request);
    String registerOrGetOAuth2User(String email, String provider, Map<String, Object> attributes);
    ResponseEntity<?> authenticateUser(AuthRequestDTO request);
    ResponseEntity<?> refreshAccessToken(Map<String, String> requestBody);
}