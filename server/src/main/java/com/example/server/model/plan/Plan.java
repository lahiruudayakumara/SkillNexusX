package com.example.server.model.plan;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "learning_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Plan {
    
    @Id
    private String id;
    
    @Column(nullable = false)
    private String userId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String startDate;
    
    @Column(nullable = false)
    private String endDate;
    
    @ElementCollection
    private List<String> topics;
    
    @ElementCollection
    private List<String> resources;
    
    @ElementCollection
    private List<String> completedResources;
    
    @Column(nullable = false)
    private boolean shared;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}