package com.example.server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.server.DTO.plan.PlanDTO;
import com.example.server.service.plan.PlanService;

@RestController
@RequestMapping("/api/plans")
@CrossOrigin(origins = "*")
public class PlanController {

    @Autowired
    private PlanService planService;  // lowercase variable name to follow Java conventions

    /**
     * Create a new learning plan
     * 
     * @param planDTO The plan data
     * @return The created plan
     */
    @PostMapping
    public ResponseEntity<PlanDTO> createPlan(@RequestBody PlanDTO planDTO) {
        PlanDTO createdPlan = planService.createPlan(planDTO);
        return new ResponseEntity<>(createdPlan, HttpStatus.CREATED);
    }

    /**
     * Get a plan by its ID
     * 
     * @param id The plan ID
     * @return The plan if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<PlanDTO> getPlanById(@PathVariable String id) {
        return planService.getPlanById(id)
                .map(plan -> new ResponseEntity<>(plan, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Get all plans for a specific user
     * 
     * @param userId The user ID
     * @return List of plans
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PlanDTO>> getPlansByUserId(@PathVariable String userId) {
        List<PlanDTO> plans = planService.getPlansByUserId(userId);
        return new ResponseEntity<>(plans, HttpStatus.OK);
    }

    /**
     * Get all publicly shared plans
     * 
     * @return List of shared plans
     */
    @GetMapping("/shared")
    public ResponseEntity<List<PlanDTO>> getSharedPlans() {
        List<PlanDTO> plans = planService.getSharedPlans();
        return new ResponseEntity<>(plans, HttpStatus.OK);
    }

    /**
     * Update an existing plan
     * 
     * @param id      The plan ID
     * @param planDTO The updated plan data
     * @return The updated plan
     */
    @PutMapping("/{id}")
    public ResponseEntity<PlanDTO> updatePlan(@PathVariable String id, @RequestBody PlanDTO planDTO) {
        try {
            PlanDTO updatedPlan = planService.updatePlan(id, planDTO);
            return new ResponseEntity<>(updatedPlan, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Delete a plan
     * 
     * @param id The plan ID
     * @return Status message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable String id) {
        boolean deleted = planService.deletePlan(id);
        return deleted ? new ResponseEntity<>(HttpStatus.NO_CONTENT) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    /**
     * Update the completed resources for a plan
     * 
     * @param id                The plan ID
     * @param completedResources The list of completed resource URLs
     * @return The updated plan
     */
    @PutMapping("/{id}/completed-resources")
    public ResponseEntity<PlanDTO> updateCompletedResources(@PathVariable String id, 
                                                          @RequestBody List<String> completedResources) {
        try {
            PlanDTO updatedPlan = planService.updateCompletedResources(id, completedResources);
            return new ResponseEntity<>(updatedPlan, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Toggle a resource completion status
     * 
     * @param id          The plan ID
     * @param resourceUrl The resource URL to toggle
     * @return The updated plan
     */
    @PutMapping("/{id}/toggle-resource/{resourceUrl}")
    public ResponseEntity<PlanDTO> toggleResourceCompletion(@PathVariable String id, 
                                                          @PathVariable String resourceUrl) {
        try {
            PlanDTO updatedPlan = planService.toggleResourceCompletion(id, resourceUrl);
            return new ResponseEntity<>(updatedPlan, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Add a resource to a plan
     * 
     * @param id         The plan ID
     * @param resourceDto Contains the resource URL to add
     * @return The updated plan
     */
    @PostMapping("/{id}/resources")
    public ResponseEntity<PlanDTO> addResource(@PathVariable String id, 
                                             @RequestBody ResourceDto resourceDto) {
        try {
            PlanDTO updatedPlan = planService.addResource(id, resourceDto.getResourceUrl());
            return new ResponseEntity<>(updatedPlan, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Remove a resource from a plan
     * 
     * @param id         The plan ID
     * @param resourceUrl The resource URL to remove
     * @return The updated plan
     */
    @DeleteMapping("/{id}/resources/{resourceUrl}")
    public ResponseEntity<PlanDTO> removeResource(@PathVariable String id, 
                                                @PathVariable String resourceUrl) {
        try {
            PlanDTO updatedPlan = planService.removeResource(id, resourceUrl);
            return new ResponseEntity<>(updatedPlan, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Simple DTO for receiving resource URL in requests
     */
    private static class ResourceDto {
        private String resourceUrl;

        public String getResourceUrl() {
            return resourceUrl;
        }

        public void setResourceUrl(String resourceUrl) {
            this.resourceUrl = resourceUrl;
        }
    }
}