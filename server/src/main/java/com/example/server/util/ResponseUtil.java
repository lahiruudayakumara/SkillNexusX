package com.example.server.util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.Instant;
import java.util.Collections;

public class ResponseUtil {

    public static ResponseEntity<?> badRequestResponse(String message) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Collections.singletonMap("error", message));
    }

    public static ResponseEntity<?> unauthorizedResponse(String message) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Collections.singletonMap("error", message));
    }

    public static ResponseEntity<?> forbiddenResponse(String message) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Collections.singletonMap("error", message));
    }

    public static ResponseEntity<?> successResponse(String message) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Collections.singletonMap("message", message));
    }

    public static ResponseEntity<?> internalServerErrorResponse(String message) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", message));
    }
}
