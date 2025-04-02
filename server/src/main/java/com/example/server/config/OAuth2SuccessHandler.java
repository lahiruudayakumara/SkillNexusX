package com.example.server.config;

import com.example.server.util.JwtTokenProvider;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2SuccessHandler.class);
    private static final String FALLBACK_EMAIL_SUFFIX = "@unknownprovider.com";

    private final JwtTokenProvider jwtUtil;

    @Value("${app.oauth2.redirect-url:http://localhost:5173}")
    private String redirectBaseUrl;

    public OAuth2SuccessHandler(JwtTokenProvider jwtUtil) {
        this.jwtUtil = jwtUtil;
        this.setUseReferer(false);
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        if (response.isCommitted()) {
            logger.warn("Response already committed for user authentication. Skipping processing.");
            return;
        }

        try {
            String email = extractEmail(authentication);

            if (email == null || email.trim().isEmpty()) {
                logger.error("Failed to extract valid email from authentication principal");
                handleErrorRedirect(request, response, "missing_email");
                return;
            }

            String jwt = jwtUtil.generateAccessToken(email, getProviderName(authentication));

            String encodedToken = URLEncoder.encode(jwt, StandardCharsets.UTF_8);
            String redirectUrl = String.format("%s/callback?token=%s", redirectBaseUrl, encodedToken);

            logger.info("OAuth2 authentication successful for user: {}. Redirecting to: {}", email, redirectUrl);

            clearAuthenticationAttributes(request);
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);

        } catch (Exception e) {
            logger.error("Failed to process OAuth2 authentication success for user: {}",
                    authentication.getName(), e);
            handleErrorRedirect(request, response, "authentication_error");
        }
    }

    private String extractEmail(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (principal instanceof OidcUser oidcUser) {
            return oidcUser.getEmail();
        }

        if (principal instanceof DefaultOAuth2User oauthUser) {
            Map<String, Object> attributes = oauthUser.getAttributes();

            String email = (String) attributes.get("email");
            if (email != null) return email;

            if (attributes.containsKey("login")) {  // GitHub
                return attributes.get("login") + "@github.com";
            }
            if (attributes.containsKey("id")) {     // Facebook/LinkedIn fallback
                return attributes.get("id") + FALLBACK_EMAIL_SUFFIX;
            }

            logger.warn("No email found in attributes for provider: {}", oauthUser.getAuthorities());
        }

        return null;
    }

    private String getProviderName(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .findFirst()
                .map(grantedAuthority -> grantedAuthority.getAuthority().replace("ROLE_", ""))
                .orElse("unknown");
    }

    private void handleErrorRedirect(HttpServletRequest request, HttpServletResponse response,
                                     String errorCode) throws IOException {
        String errorUrl = String.format("%s/error?code=%s",
                redirectBaseUrl,
                URLEncoder.encode(errorCode, StandardCharsets.UTF_8));
        getRedirectStrategy().sendRedirect(request, response, errorUrl);
    }
}