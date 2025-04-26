package com.example.server.service.plan;

import java.util.List;
import java.util.Optional;

import com.example.server.DTO.plan.PlanDTO;

public interface PlanService {
    
    /**
     * Create a new learning plan
     * @param planDTO The plan data
     * @return The created plan
     */
    PlanDTO createPlan(PlanDTO planDTO);
    
    /**
     * Get a plan by its ID
     * @param id The plan ID
     * @return The plan if found
     */
    Optional<PlanDTO> getPlanById(String id);
    
    /**
     * Get all plans for a specific user
     * @param userId The user ID
     * @return List of plans
     */
    List<PlanDTO> getPlansByUserId(String userId);
    
    /**
     * Get all publicly shared plans
     * @return List of shared plans
     */
    List<PlanDTO> getSharedPlans();
    
    /**
     * Update an existing plan
     * @param id The plan ID
     * @param planDTO The updated plan data
     * @return The updated plan
     */
    PlanDTO updatePlan(String id, PlanDTO planDTO);
    
    /**
     * Delete a plan
     * @param id The plan ID
     * @return true if deleted successfully
     */
    boolean deletePlan(String id);
    
    /**
     * Update the completed resources for a plan
     * @param id The plan ID
     * @param completedResources The list of completed resource URLs
     * @return The updated plan
     */
    PlanDTO updateCompletedResources(String id, List<String> completedResources);
    
    /**
     * Toggle a resource completion status
     * @param id The plan ID
     * @param resourceUrl The resource URL to toggle
     * @return The updated plan
     */
    PlanDTO toggleResourceCompletion(String id, String resourceUrl);
    
    /**
     * Add a resource to a plan
     * @param id The plan ID
     * @param resourceUrl The resource URL to add
     * @return The updated plan
     */
    PlanDTO addResource(String id, String resourceUrl);
    
    /**
     * Remove a resource from a plan
     * @param id The plan ID
     * @param resourceUrl The resource URL to remove
     * @return The updated plan
     */
    PlanDTO removeResource(String id, String resourceUrl);
}