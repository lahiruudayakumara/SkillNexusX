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

    @PostMapping
    public ResponseEntity<MentorCollaborationResponseDTO> createCollaboration(@RequestBody MentorCollaborationRequestDTO requestDTO) {
        return ResponseEntity.ok(mentorCollaborationService.createCollaboration(requestDTO));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<MentorCollaborationResponseDTO>> getCollaborations(@PathVariable Long userId) {
        return ResponseEntity.ok(mentorCollaborationService.getCollaborations(userId));
    }

    @PutMapping("/{collaborationId}")
    public ResponseEntity<MentorCollaborationResponseDTO> updateCollaboration(@PathVariable Long collaborationId,
                                                                              @RequestBody MentorCollaborationRequestDTO requestDTO) {
        return ResponseEntity.ok(mentorCollaborationService.updateCollaboration(collaborationId, requestDTO));
    }

    @DeleteMapping("/{collaborationId}")
    public ResponseEntity<String> deleteCollaboration(@PathVariable Long collaborationId,
                                                      @RequestParam Long userId) {
        mentorCollaborationService.deleteCollaboration(collaborationId, userId);
        return ResponseEntity.ok("Collaboration cancelled successfully.");
    }
}
