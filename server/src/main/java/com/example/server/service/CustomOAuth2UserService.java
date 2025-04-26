package com.example.server.service;

import com.example.server.model.user.User;
import com.example.server.repository.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private static final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);

    private final UserRepository userRepository;

    private static final Map<String, String> PROVIDER_EMAIL_MAP = Map.of(
            "google", "email",
            "github", "login",
            "facebook", "email",
            "linkedin", "emailAddress"
    );

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = getOAuth2User(userRequest);

        String email = oAuth2User.getAttribute("email");
        String username = oAuth2User.getAttribute("username");
        String fullName = oAuth2User.getAttribute("fullName");

        if (email == null || email.isEmpty()) {
            throw new OAuth2AuthenticationException("OAuth2 user email is null or empty");
        }

        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isEmpty()) {
            synchronized (this) {
                existingUser = userRepository.findByEmail(email);
                if (existingUser.isEmpty()) {
                    User newUser = getUser(email, fullName, username);
                    userRepository.save(newUser);
                    logger.info("New OAuth user registered: " + email);
                }
            }
        }

        return new DefaultOAuth2User(
                Collections.singleton((org.springframework.security.core.GrantedAuthority) () -> "ROLE_USER"),
                oAuth2User.getAttributes(),
                "email"
        );
    }

    private static User getUser(String email, String fullName, String username) {
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setFullName(fullName != null ? fullName : "OAuth User");
        newUser.setUsername(username != null ? username : email.split("@")[0]);
        newUser.setPassword("");
        return newUser;
    }

    private OAuth2User getOAuth2User(OAuth2UserRequest userRequest) {
        Map<String, Object> attributes = userRequest.getAdditionalParameters();
        String providerId = userRequest.getClientRegistration().getRegistrationId();
        String emailAttribute = PROVIDER_EMAIL_MAP.getOrDefault(providerId, "email");

        return new DefaultOAuth2User(
                Collections.emptyList(),
                attributes,
                emailAttribute
        );
    }
}
