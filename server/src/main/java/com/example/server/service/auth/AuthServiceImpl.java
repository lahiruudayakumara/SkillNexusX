package com.example.server.service.auth;

import com.example.server.DTO.auth.AuthRequestDTO;
import com.example.server.DTO.auth.AuthResponseDTO;
import com.example.server.DTO.auth.RegisterRequestDTO;
import com.example.server.model.user.User;
import com.example.server.repository.user.UserRepository;
import com.example.server.util.JwtTokenProvider;
import com.example.server.util.PasswordUtil;
import com.example.server.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    public AuthServiceImpl(UserRepository userRepository, AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public String registerUser(RegisterRequestDTO request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("User with this email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(PasswordUtil.encodePassword(request.getPassword()));
        userRepository.save(user);
        return "User registered successfully";
    }

    // Authenticate a user (either via username/password or OAuth)
    public ResponseEntity<?> authenticateUser(AuthRequestDTO request) {
        if (isInvalidRequest(request)) {
            return ResponseUtil.badRequestResponse("Email and password are required");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmailOrUsername(), request.getPassword())
            );

            return generateLoginResponse(authentication);
        } catch (BadCredentialsException e) {
            return ResponseUtil.unauthorizedResponse("Invalid credentials");
        } catch (DisabledException e) {
            return ResponseUtil.forbiddenResponse("User account is disabled");
        } catch (LockedException e) {
            return ResponseUtil.forbiddenResponse("User account is locked");
        } catch (AuthenticationException e) {
            return ResponseUtil.unauthorizedResponse("Authentication failed");
        }
    }

    // OAuth2 authentication flow
    public ResponseEntity<?> authenticateWithOAuth(OAuth2AuthenticationToken oauthToken) {
        OAuth2User oAuth2User = oauthToken.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        if (email == null) {
            return ResponseUtil.unauthorizedResponse("OAuth2 user email is null");
        }

        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isEmpty()) {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullName(oAuth2User.getAttribute("given_name") != null ? oAuth2User.getAttribute("given_name") : "OAuthUser");
            newUser.setPassword(""); // No password for OAuth users
            userRepository.save(newUser);
            logger.info("New OAuth user registered: " + email);
        }

        String token = jwtTokenProvider.generateAccessToken(email, "USER");

        AuthResponseDTO response = AuthResponseDTO.builder()
                .username(oAuth2User.getAttribute("given_name"))
                .token(token)
                .refreshToken(oauthToken.getPrincipal().getAttribute("refresh_token"))  // OAuth2 refresh token if available
                .expiresIn(jwtTokenProvider.extractExpiration(token, false))
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.ok(response);
    }

    // Refresh access token using the refresh token
    public ResponseEntity<?> refreshAccessToken(Map<String, String> requestBody) {
        String refreshToken = requestBody.get("refreshToken");
        if (refreshToken == null || !jwtTokenProvider.validateRefreshToken(refreshToken)) {
            return ResponseUtil.unauthorizedResponse("Invalid or expired refresh token");
        }

        String email = jwtTokenProvider.extractEmail(refreshToken, true);
        if (email == null) {
            return ResponseUtil.unauthorizedResponse("Invalid refresh token");
        }

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseUtil.unauthorizedResponse("User not found");
        }

        String newAccessToken = jwtTokenProvider.generateAccessToken(email, "USER");
        Date expiryDate = jwtTokenProvider.extractExpiration(newAccessToken, false);

        AuthResponseDTO response = AuthResponseDTO.builder()
                .username(optionalUser.get().getUsername())
                .token(newAccessToken)
                .refreshToken(refreshToken)
                .expiresIn(expiryDate)
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.ok(response);
    }

    private boolean isInvalidRequest(AuthRequestDTO request) {
        return request.getEmailOrUsername() == null || request.getEmailOrUsername().isEmpty() ||
                request.getPassword() == null || request.getPassword().isEmpty();
    }

    private ResponseEntity<?> generateLoginResponse(Authentication authentication) {
        String username = authentication.getName();
        String token = jwtTokenProvider.generateAccessToken(username, "USER");
        AuthResponseDTO response = AuthResponseDTO.builder()
                .username(username)
                .token(token)
                .expiresIn(jwtTokenProvider.extractExpiration(token, false))
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.ok(response);
    }

    public String registerOrGetOAuth2User(String email, String provider, Map<String, Object> attributes) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            return userOptional.get().getEmail();
        }

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setUsername(attributes.get("name").toString());
        newUser.setProvider(provider);
        newUser.setProviderId(attributes.get("id").toString());
        userRepository.save(newUser);

        return newUser.getEmail();
    }

    public class UserAlreadyExistsException extends RuntimeException {
        public UserAlreadyExistsException(String message) {
            super(message);
        }
    }

}
