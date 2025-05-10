package com.example.server.controller;

import com.example.server.DTO.auth.AuthRequestDTO;
import com.example.server.DTO.auth.AuthResponseDTO;
import com.example.server.DTO.auth.RegisterRequestDTO;
import com.example.server.model.user.User;
import com.example.server.repository.user.UserRepository;
import com.example.server.service.auth.AuthService;
import com.example.server.service.auth.AuthServiceImpl;
import com.example.server.util.JwtTokenProvider;
import com.example.server.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final UserRepository userRepository;

    @Autowired
    public AuthController(AuthService authService,
                          AuthenticationManager authenticationManager,
                          JwtTokenProvider jwtTokenProvider, UserRepository userRepository) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    // Register a new user (email/password)
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequestDTO request) {
        try {
            String successMessage = authService.registerUser(request);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(successMessage);
        } catch (AuthServiceImpl.UserAlreadyExistsException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body((ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error occurred");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> loginUser(@Valid @RequestBody AuthRequestDTO request) {
        try {
            // Check if the identifier is an email or username
            Optional<User> optionalUser = userRepository.findByEmailOrUsername(request.getEmailOrUsername(), request.getEmailOrUsername());

            // If no user is found
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(AuthResponseDTO.builder()
                                .timestamp(Instant.now())
//                                .error("Invalid username or password")
                                .build());
            }

            User user = optionalUser.get();

            // Authenticate using the email or username
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmailOrUsername(), request.getPassword())
            );

            // If authentication is successful, generate tokens
            String token = jwtTokenProvider.generateAccessToken(user.getEmail(), "local");
            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail(), "local");

            logger.info("User {} logged in successfully", user.getEmail());

            // Return the authentication response
            return ResponseEntity.ok(AuthResponseDTO.builder()
                    .email(user.getEmail())
                    .username(user.getUsername())
                    .userId(user.getId())
                    .token(token)
                    .expiresIn(jwtTokenProvider.getExpirationDateFromToken(token))
                    .refreshToken(refreshToken)
                    .timestamp(Instant.now())
                    .build());
        } catch (AuthenticationException e) {
            // Catch authentication failure
            logger.warn("Authentication failed for user {}: {}", request.getEmailOrUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponseDTO.builder()
                            .timestamp(Instant.now())
//                            .error("Invalid credentials")
                            .build());
        }
    }




    // Refresh the access token
    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponseDTO> refreshToken(@RequestBody Map<String, String> requestBody) {
        String refreshToken = requestBody.get("refreshToken");
        if (refreshToken == null || !jwtTokenProvider.validateRefreshToken(refreshToken)) {
            logger.warn("Invalid or expired refresh token provided");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponseDTO.builder()
                            .timestamp(Instant.now())
                            .build());
        }

        try {
            String email = jwtTokenProvider.getEmailFromToken(refreshToken);
            String provider = "local"; // Adjust if provider info is stored in token
            String newAccessToken = jwtTokenProvider.generateAccessToken(email, provider);

            logger.info("Refresh token processed successfully for user {}", email);
            return ResponseEntity.ok(AuthResponseDTO.builder()
                    .email(email)
                    .token(newAccessToken)
                    .expiresIn(jwtTokenProvider.getExpirationDateFromToken(newAccessToken))
                    .refreshToken(refreshToken)
                    .timestamp(Instant.now())
                    .build());
        } catch (Exception e) {
            logger.error("Failed to refresh token: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AuthResponseDTO.builder()
                            .timestamp(Instant.now())
                            .build());
        }
    }

    // OAuth2 sign-up/login callback
    @GetMapping("/oauth2/callback")
    public ResponseEntity<?> oauth2SignUpOrLogin(@RequestParam(required = false) String token, Authentication authentication) {
        // If neither authentication nor token is present
        if (authentication == null && token == null) {
            logger.warn("No authentication or token provided in OAuth2 callback");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponseDTO.builder()
                            .timestamp(Instant.now())
//                            .message("Unauthorized: Missing authentication or token")
                            .build());
        }

        if (token != null) {
            try {
                logger.info("OAuth2 callback received with pre-generated token");
                String email = jwtTokenProvider.getEmailFromToken(token);
                if (email == null) {
                    throw new IllegalArgumentException("Invalid token: Could not extract email");
                }
                return ResponseEntity.ok(AuthResponseDTO.builder()
                        .email(email)
                        .token(token)
                        .expiresIn(jwtTokenProvider.getExpirationDateFromToken(token))
                        .timestamp(Instant.now())
                        .build());
            } catch (Exception e) {
                logger.error("Failed to handle pre-generated token: {}", e.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(AuthResponseDTO.builder()
                                .timestamp(Instant.now())
//                                .message("Invalid token: " + e.getMessage())
                                .build());
            }
        }

        // Handle OAuth2 login/sign-up via authentication
        try {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            String email = oAuth2User.getAttribute("email") != null ? oAuth2User.getAttribute("email") : oAuth2User.getName();
            String username = oAuth2User.getAttribute("name") != null ? oAuth2User.getAttribute("name") : email;
            String provider = authentication.getAuthorities().stream()
                    .findFirst()
                    .map(auth -> auth.getAuthority().replace("ROLE_", "").toLowerCase())
                    .orElse("unknown");

            logger.info("OAuth2 user info: email={}, username={}, provider={}", email, username, provider);

            String registeredEmail = authService.registerOrGetOAuth2User(email, provider, oAuth2User.getAttributes());
            String accessToken = jwtTokenProvider.generateAccessToken(registeredEmail, provider);
            String refreshToken = jwtTokenProvider.generateRefreshToken(registeredEmail, provider);

            logger.info("OAuth2 sign-up/login successful for user {} via {}", registeredEmail, provider);
            return ResponseEntity.ok(AuthResponseDTO.builder()
                    .username(username)
                    .email(registeredEmail)
                    .token(accessToken)
                    .expiresIn(jwtTokenProvider.getExpirationDateFromToken(accessToken))
                    .refreshToken(refreshToken)
                    .timestamp(Instant.now())
                    .build());
        } catch (Exception e) {
            logger.error("OAuth2 sign-up/login failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AuthResponseDTO.builder()
                            .timestamp(Instant.now())
//                            .message("OAuth2 login failed: " + e.getMessage())
                            .build());
        }
    }


    private HttpStatus getStatusFromException(AuthenticationException e) {
        if (e instanceof BadCredentialsException) return HttpStatus.UNAUTHORIZED;
        if (e instanceof DisabledException || e instanceof LockedException) return HttpStatus.FORBIDDEN;
        return HttpStatus.UNAUTHORIZED;
    }
}