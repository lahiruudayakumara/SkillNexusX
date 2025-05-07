package com.example.server.service.collaboration;

import com.example.server.DTO.collaboration.MentorCollaborationRequestDTO;
import com.example.server.DTO.collaboration.MentorCollaborationResponseDTO;
import com.example.server.model.collaboration.MentorCollaboration;
import com.example.server.repository.collaboration.MentorCollaborationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MentorCollaborationServiceImpl implements MentorCollaborationService {

    private final MentorCollaborationRepository collaborationRepository;

    @Override
    public MentorCollaborationResponseDTO createCollaboration(MentorCollaborationRequestDTO requestDTO) {
        if (requestDTO.getScheduledTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Scheduled time must be in the future.");
        }
        if (requestDTO.getDurationInMinutes() < 30 || requestDTO.getDurationInMinutes() > 180) {
            throw new IllegalArgumentException("Duration must be between 30 minutes and 3 hours.");
        }

        MentorCollaboration collaboration = new MentorCollaboration();
        collaboration.setMentorId(requestDTO.getMentorId());
        collaboration.setUserId(requestDTO.getUserId());
        collaboration.setScheduledTime(requestDTO.getScheduledTime());
        collaboration.setDurationInMinutes(requestDTO.getDurationInMinutes());
        collaboration.setTopic(requestDTO.getTopic());
        collaboration.setStatus("ACTIVE");

        collaboration = collaborationRepository.save(collaboration);

        return mapToResponseDTO(collaboration);
    }

    @Override
    public List<MentorCollaborationResponseDTO> getCollaborations(Long userId) {
        List<MentorCollaboration> collaborations = collaborationRepository.findByUserIdOrMentorId(userId, userId);
        return collaborations.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MentorCollaborationResponseDTO updateCollaboration(Long collaborationId, MentorCollaborationRequestDTO requestDTO) {
        MentorCollaboration collaboration = collaborationRepository.findById(collaborationId)
                .orElseThrow(() -> new RuntimeException("Collaboration not found."));

        if (requestDTO.getScheduledTime() != null && requestDTO.getScheduledTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Scheduled time cannot be in the past.");
        }

        if (requestDTO.getScheduledTime() != null) {
            collaboration.setScheduledTime(requestDTO.getScheduledTime());
        }
        if (requestDTO.getDurationInMinutes() != null) {
            collaboration.setDurationInMinutes(requestDTO.getDurationInMinutes());
        }
        if (requestDTO.getTopic() != null) {
            collaboration.setTopic(requestDTO.getTopic());
        }

        collaboration = collaborationRepository.save(collaboration);
        return mapToResponseDTO(collaboration);
    }

    @Override
    public void deleteCollaboration(Long collaborationId, Long userId) {
        MentorCollaboration collaboration = collaborationRepository.findById(collaborationId)
                .orElseThrow(() -> new RuntimeException("Collaboration not found."));

        if (!collaboration.getUserId().equals(userId)) {
            throw new RuntimeException("Only the user who initiated the collaboration can cancel it.");
        }

        collaboration.setStatus("CANCELLED");
        collaborationRepository.save(collaboration);
    }

    private MentorCollaborationResponseDTO mapToResponseDTO(MentorCollaboration collaboration) {
        MentorCollaborationResponseDTO responseDTO = new MentorCollaborationResponseDTO();
        responseDTO.setId(collaboration.getId());
        responseDTO.setMentorId(collaboration.getMentorId());
        responseDTO.setUserId(collaboration.getUserId());
        responseDTO.setScheduledTime(collaboration.getScheduledTime());
        responseDTO.setDurationInMinutes(collaboration.getDurationInMinutes());
        responseDTO.setTopic(collaboration.getTopic());
        responseDTO.setStatus(collaboration.getStatus());
        return responseDTO;
    }

    @Override
    public List<MentorCollaborationResponseDTO> getAllCollaborations() {
        return collaborationRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

}
