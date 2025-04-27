package com.example.server.repository.progress;

import com.example.server.model.progress.progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgressRepository extends JpaRepository<progress, String> {
    // Custom query methods (if needed)
    List<progress> findByUserId(String userId);

    List<progress> findByPlanId(String planId);

    List<progress> findBySharedTrue();
}