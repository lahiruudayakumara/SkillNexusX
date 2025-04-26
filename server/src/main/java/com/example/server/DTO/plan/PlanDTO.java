package com.example.server.DTO.plan;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanDTO {
    private String id;
    private String userId;
    private String title;
    private String description;
    private String startDate;
    private String endDate;
    private List<String> topics;
    private List<String> resources;
    private List<String> completedResources;
    private boolean shared;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}