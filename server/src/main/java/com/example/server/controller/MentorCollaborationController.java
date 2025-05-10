package com.example.server.controller;

import com.example.server.DTO.collaboration.MentorCollaborationRequestDTO;
import com.example.server.DTO.collaboration.MentorCollaborationResponseDTO;
import com.example.server.service.collaboration.MentorCollaborationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentor-collaboration")
@RequiredArgsConstructor
public class MentorCollaborationController {

    private final MentorCollaborationService mentorCollaborationService;

    // Create a new collaboration
    @PostMapping
    public ResponseEntity<MentorCollaborationResponseDTO> createCollaboration(@RequestBody MentorCollaborationRequestDTO requestDTO) {
        return ResponseEntity.ok(mentorCollaborationService.createCollaboration(requestDTO));
    }

    // Get collaborations for a specific user (either as user or mentor)
    @GetMapping("/{userId}")
    public ResponseEntity<List<MentorCollaborationResponseDTO>> getCollaborations(@PathVariable Long userId) {
        return ResponseEntity.ok(mentorCollaborationService.getCollaborations(userId));
    }

    // Get a specific collaboration by its ID
    @GetMapping("/collaboration/{collaborationId}")
    public ResponseEntity<MentorCollaborationResponseDTO> getCollaborationById(@PathVariable Long collaborationId) {
        return ResponseEntity.ok(mentorCollaborationService.getCollaborationById(collaborationId));
    }

    // Update a specific collaboration
    @PutMapping("/{collaborationId}")
    public ResponseEntity<MentorCollaborationResponseDTO> updateCollaboration(@PathVariable Long collaborationId,
                                                                              @RequestBody MentorCollaborationRequestDTO requestDTO) {
        return ResponseEntity.ok(mentorCollaborationService.updateCollaboration(collaborationId, requestDTO));
    }

    // Delete (cancel) a collaboration
    @DeleteMapping("/{collaborationId}")
    public ResponseEntity<String> deleteCollaboration(@PathVariable Long collaborationId,
                                                      @RequestParam Long userId) {
        mentorCollaborationService.deleteCollaboration(collaborationId, userId);
        return ResponseEntity.ok("Collaboration cancelled successfully.");
    }

    // Get all collaborations in the system
    @GetMapping("/all")
    public ResponseEntity<List<MentorCollaborationResponseDTO>> getAllCollaborations() {
        return ResponseEntity.ok(mentorCollaborationService.getAllCollaborations());
    }
}
