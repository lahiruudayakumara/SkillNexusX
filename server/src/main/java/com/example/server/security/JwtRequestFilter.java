package com.example.server.security;

import com.example.server.util.JwtTokenProvider;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public JwtRequestFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String requestPath = request.getRequestURI();

        if (isPublicEndpoint(requestPath)) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwtToken = extractJwtFromRequest(request);

        if (jwtToken != null) {
            try {

                if (jwtTokenProvider.validateToken(jwtToken, false)) {
                    String email = jwtTokenProvider.getEmailFromToken(jwtToken);
                    String provider = jwtTokenProvider.extractProvider(jwtToken, false);

                    UserDetails userDetails = new User(email, "", Collections.singleton(() -> "ROLE_USER"));

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.debug("JWT authentication successful for user: {}", email);
                } else {
                    logger.warn("Invalid JWT token for request: {}", requestPath);
                }
            } catch (ExpiredJwtException e) {
                logger.warn("JWT token expired for request: {}", requestPath);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token expired");
                return;
            } catch (SignatureException | MalformedJwtException e) {
                logger.warn("Invalid JWT signature or format for request: {}", requestPath);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid token");
                return;
            } catch (Exception e) {
                logger.error("Error processing JWT token: {}", e.getMessage());
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("Authentication error");
                return;
            }
        } else {
            logger.debug("No JWT token found in request: {}", requestPath);
        }

        filterChain.doFilter(request, response);
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7).trim();
        }
        return null;
    }

    private boolean isPublicEndpoint(String requestPath) {
        String[] publicEndpoints = {
                "/api/auth/register",
                "/api/auth/login",
                "/api/auth/refresh-token",
                "/api/auth/oauth2/callback",
                "/login/oauth2/code/",
                "/oauth2/",
                "/error"
        };
        for (String endpoint : publicEndpoints) {
            if (requestPath.startsWith(endpoint)) {
                return true;
            }
        }
        return false;
    }
}