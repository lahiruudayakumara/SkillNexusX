package com.example.server.service.plan;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.server.DTO.plan.PlanDTO;
import com.example.server.model.plan.Plan;
import com.example.server.repository.plan.PlanRepository;

@Service
public class PlanServiceImpl implements PlanService {

    @Autowired
    private PlanRepository planRepository;

    @Override
    public PlanDTO createPlan(PlanDTO planDTO) {
        // Generate ID if not provided
        if (planDTO.getId() == null || planDTO.getId().isEmpty()) {
            planDTO.setId(UUID.randomUUID().toString());
        }
        
        // Set creation and update timestamps
        LocalDateTime now = LocalDateTime.now();
        planDTO.setCreatedAt(now);
        planDTO.setUpdatedAt(now);
        
        // Initialize empty collections if null
        if (planDTO.getTopics() == null) {
            planDTO.setTopics(new ArrayList<>());
        }
        
        if (planDTO.getResources() == null) {
            planDTO.setResources(new ArrayList<>());
        }
        
        if (planDTO.getCompletedResources() == null) {
            planDTO.setCompletedResources(new ArrayList<>());
        }
        
        // Convert DTO to entity and save
        Plan plan = convertToEntity(planDTO);
        Plan savedPlan = planRepository.save(plan);
        
        // Return the saved entity as DTO
        return convertToDTO(savedPlan);
    }

    @Override
    public Optional<PlanDTO> getPlanById(String id) {
        return planRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public List<PlanDTO> getPlansByUserId(String userId) {
        return planRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PlanDTO> getSharedPlans() {
        return planRepository.findBySharedTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PlanDTO updatePlan(String id, PlanDTO planDTO) {
        // Check if plan exists
        Optional<Plan> existingPlanOpt = planRepository.findById(id);
        
        if (existingPlanOpt.isPresent()) {
            Plan existingPlan = existingPlanOpt.get();
            
            // Update fields, but keep original ID, userId, and createdAt
            existingPlan.setTitle(planDTO.getTitle());
            existingPlan.setDescription(planDTO.getDescription());
            existingPlan.setStartDate(planDTO.getStartDate());
            existingPlan.setEndDate(planDTO.getEndDate());
            existingPlan.setTopics(planDTO.getTopics());
            existingPlan.setShared(planDTO.isShared());
            
            // Only update resources if provided in DTO
            if (planDTO.getResources() != null) {
                existingPlan.setResources(planDTO.getResources());
            }
            
            // Only update completedResources if provided in DTO
            if (planDTO.getCompletedResources() != null) {
                existingPlan.setCompletedResources(planDTO.getCompletedResources());
            }
            
            // Update the updatedAt timestamp
            existingPlan.setUpdatedAt(LocalDateTime.now());
            
            // Save and return
            Plan updatedPlan = planRepository.save(existingPlan);
            return convertToDTO(updatedPlan);
        }
        
        // If plan doesn't exist, throw exception
        throw new RuntimeException("Plan not found with id: " + id);
    }

    @Override
    public boolean deletePlan(String id) {
        // Check if plan exists
        if (planRepository.existsById(id)) {
            planRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public PlanDTO updateCompletedResources(String id, List<String> completedResources) {
        // Check if plan exists
        Optional<Plan> existingPlanOpt = planRepository.findById(id);
        
        if (existingPlanOpt.isPresent()) {
            Plan existingPlan = existingPlanOpt.get();
            
            // Update completed resources
            existingPlan.setCompletedResources(completedResources);
            
            // Update the updatedAt timestamp
            existingPlan.setUpdatedAt(LocalDateTime.now());
            
            // Save and return
            Plan updatedPlan = planRepository.save(existingPlan);
            return convertToDTO(updatedPlan);
        }
        
        // If plan doesn't exist, throw exception
        throw new RuntimeException("Plan not found with id: " + id);
    }

    @Override
    public PlanDTO toggleResourceCompletion(String id, String resourceUrl) {
        // Check if plan exists
        Optional<Plan> existingPlanOpt = planRepository.findById(id);
        
        if (existingPlanOpt.isPresent()) {
            Plan existingPlan = existingPlanOpt.get();
            
            // Get completed resources
            List<String> completedResources = existingPlan.getCompletedResources();
            if (completedResources == null) {
                completedResources = new ArrayList<>();
            }
            
            // Toggle completion status
            if (completedResources.contains(resourceUrl)) {
                // If already completed, remove it
                completedResources.remove(resourceUrl);
            } else {
                // If not completed, add it
                completedResources.add(resourceUrl);
            }
            
            // Update completed resources
            existingPlan.setCompletedResources(completedResources);
            
            // Update the updatedAt timestamp
            existingPlan.setUpdatedAt(LocalDateTime.now());
            
            // Save and return
            Plan updatedPlan = planRepository.save(existingPlan);
            return convertToDTO(updatedPlan);
        }
        
        // If plan doesn't exist, throw exception
        throw new RuntimeException("Plan not found with id: " + id);
    }

    @Override
    public PlanDTO addResource(String id, String resourceUrl) {
        // Check if plan exists
        Optional<Plan> existingPlanOpt = planRepository.findById(id);
        
        if (existingPlanOpt.isPresent()) {
            Plan existingPlan = existingPlanOpt.get();
            
            // Get resources
            List<String> resources = existingPlan.getResources();
            if (resources == null) {
                resources = new ArrayList<>();
            }
            
            // Add resource if not already present
            if (!resources.contains(resourceUrl)) {
                resources.add(resourceUrl);
                existingPlan.setResources(resources);
                
                // Update the updatedAt timestamp
                existingPlan.setUpdatedAt(LocalDateTime.now());
                
                // Save and return
                Plan updatedPlan = planRepository.save(existingPlan);
                return convertToDTO(updatedPlan);
            }
            
            // If resource already exists, just return the existing plan
            return convertToDTO(existingPlan);
        }
        
        // If plan doesn't exist, throw exception
        throw new RuntimeException("Plan not found with id: " + id);
    }

    @Override
    public PlanDTO removeResource(String id, String resourceUrl) {
        // Check if plan exists
        Optional<Plan> existingPlanOpt = planRepository.findById(id);
        
        if (existingPlanOpt.isPresent()) {
            Plan existingPlan = existingPlanOpt.get();
            
            // Get resources
            List<String> resources = existingPlan.getResources();
            if (resources != null && resources.contains(resourceUrl)) {
                // Remove resource
                resources.remove(resourceUrl);
                existingPlan.setResources(resources);
                
                // Also remove from completed resources if present
                List<String> completedResources = existingPlan.getCompletedResources();
                if (completedResources != null && completedResources.contains(resourceUrl)) {
                    completedResources.remove(resourceUrl);
                    existingPlan.setCompletedResources(completedResources);
                }
                
                // Update the updatedAt timestamp
                existingPlan.setUpdatedAt(LocalDateTime.now());
                
                // Save and return
                Plan updatedPlan = planRepository.save(existingPlan);
                return convertToDTO(updatedPlan);
            }
            
            // If resource doesn't exist in plan, just return the existing plan
            return convertToDTO(existingPlan);
        }
        
        // If plan doesn't exist, throw exception
        throw new RuntimeException("Plan not found with id: " + id);
    }
    
    /**
     * Convert Plan entity to PlanDTO
     */
    private PlanDTO convertToDTO(Plan plan) {
        return PlanDTO.builder()
                .id(plan.getId())
                .userId(plan.getUserId())
                .title(plan.getTitle())
                .description(plan.getDescription())
                .startDate(plan.getStartDate())
                .endDate(plan.getEndDate())
                .topics(plan.getTopics())
                .resources(plan.getResources())
                .completedResources(plan.getCompletedResources())
                .shared(plan.isShared())
                .createdAt(plan.getCreatedAt())
                .updatedAt(plan.getUpdatedAt())
                .build();
    }
    
    /**
     * Convert PlanDTO to Plan entity
     */
    private Plan convertToEntity(PlanDTO planDTO) {
        return Plan.builder()
                .id(planDTO.getId())
                .userId(planDTO.getUserId())
                .title(planDTO.getTitle())
                .description(planDTO.getDescription())
                .startDate(planDTO.getStartDate())
                .endDate(planDTO.getEndDate())
                .topics(planDTO.getTopics())
                .resources(planDTO.getResources())
                .completedResources(planDTO.getCompletedResources())
                .shared(planDTO.isShared())
                .createdAt(planDTO.getCreatedAt())
                .updatedAt(planDTO.getUpdatedAt())
                .build();
    }

    @Override
    public List<PlanDTO> getAllPlans() {
        List<Plan> plans = planRepository.findAll();
        return plans.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
}