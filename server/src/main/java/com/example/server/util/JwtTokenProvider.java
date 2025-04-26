package com.example.server.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.refresh-secret}")
    private String jwtRefreshSecret;

    @Value("${jwt.expiration:3600000}")
    private long jwtExpirationInMs;

    @Value("${jwt.refresh-expiration:604800000}")
    private long jwtRefreshExpirationInMs;

    @Value("${jwt.algorithm:HS512}")
    private String algorithm;

    private SecretKey signingKey;
    private SecretKey refreshSigningKey;

    @PostConstruct
    public void init() {
        this.signingKey = generateKey(jwtSecret, "access token");
        this.refreshSigningKey = generateKey(jwtRefreshSecret, "refresh token");
        logger.info("JwtTokenProvider initialized with algorithm: {}", algorithm);
    }

    private SecretKey generateKey(String secret, String keyType) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 64) {
            logger.error("JWT {} secret is too short ({} bytes). Minimum 64 bytes required for HS512.", keyType, keyBytes.length);
            throw new IllegalArgumentException("JWT " + keyType + " secret must be at least 64 bytes for HS512");
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(String email, String provider) {
        return generateToken(email, jwtExpirationInMs, provider, signingKey);
    }

    public String generateRefreshToken(String email, String provider) {
        return generateToken(email, jwtRefreshExpirationInMs, provider, refreshSigningKey);
    }

    private String generateToken(String email, long expiration, String provider, SecretKey key) {
        return Jwts.builder()
                .setSubject(email)
                .claim("provider", provider)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key, SignatureAlgorithm.valueOf(algorithm))
                .compact();
    }

    public boolean validateToken(String token, boolean isRefresh) {
        try {
            parseClaims(token, isRefresh ? refreshSigningKey : signingKey);
            return true;
        } catch (ExpiredJwtException e) {
            logger.debug("Token expired: {}", e.getMessage());
            return false;
        } catch (SignatureException | MalformedJwtException e) {
            logger.debug("Invalid token signature or format: {}", e.getMessage());
            return false;
        } catch (JwtException e) {
            logger.debug("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    public boolean validateRefreshToken(String token) {
        return validateToken(token, true);
    }

    public String getEmailFromToken(String token) {
        return extractClaim(token, Claims::getSubject, signingKey);
    }

    public String extractEmail(String token, boolean isRefresh) {
        return extractClaim(token, Claims::getSubject, isRefresh ? refreshSigningKey : signingKey);
    }

    public String extractProvider(String token, boolean isRefresh) {
        return extractClaim(token, claims -> claims.get("provider", String.class),
                isRefresh ? refreshSigningKey : signingKey);
    }

    public Date getExpirationDateFromToken(String token) {
        return extractClaim(token, Claims::getExpiration, signingKey);
    }

    public Date extractExpiration(String token, boolean isRefresh) {
        return extractClaim(token, Claims::getExpiration, isRefresh ? refreshSigningKey : signingKey);
    }

    private Claims parseClaims(String token, SecretKey key) {
        validateTokenNotNullOrEmpty(token);
        try {
            return Jwts.parser()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token.trim())
                    .getBody();
        } catch (JwtException e) {
            logger.error("Error parsing JWT: {}", e.getMessage());
            throw new JwtAuthenticationException("Invalid JWT token", e);
        }
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver, SecretKey key) {
        return claimsResolver.apply(parseClaims(token, key));
    }

    private void validateTokenNotNullOrEmpty(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Token cannot be null or empty");
        }
    }

    public static class JwtAuthenticationException extends RuntimeException {
        public JwtAuthenticationException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}