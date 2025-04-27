package com.example.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.server.model.plan.Plan;

@Repository
public interface PlanRepository extends JpaRepository<Plan, String> {
    
    /**
     * Find all plans by user ID
     * @param userId The user ID
     * @return List of plans
     */
    List<Plan> findByUserId(String userId);
    
    /**
     * Find all plans that are shared publicly
     * @return List of shared plans
     */
    List<Plan> findBySharedTrue();
}