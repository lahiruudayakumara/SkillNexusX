package com.example.server.service.collaboration;

import com.example.server.DTO.collaboration.MentorCollaborationRequestDTO;
import com.example.server.DTO.collaboration.MentorCollaborationResponseDTO;

import java.util.List;

public interface MentorCollaborationService {
    MentorCollaborationResponseDTO createCollaboration(MentorCollaborationRequestDTO requestDTO);
    List<MentorCollaborationResponseDTO> getCollaborations(Long userId);
    MentorCollaborationResponseDTO updateCollaboration(Long collaborationId, MentorCollaborationRequestDTO requestDTO);
    void deleteCollaboration(Long collaborationId, Long userId);
    List<MentorCollaborationResponseDTO> getAllCollaborations();
    MentorCollaborationResponseDTO getCollaborationById(Long collaborationId);  // New method
}
