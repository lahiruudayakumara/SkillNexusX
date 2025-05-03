package com.example.server.repository.collaboration;

import com.example.server.model.collaboration.MentorCollaboration;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MentorCollaborationRepository extends JpaRepository<MentorCollaboration, Long> {
    List<MentorCollaboration> findByUserIdOrMentorId(Long userId, Long mentorId);
    List<MentorCollaboration> findAll();

}


