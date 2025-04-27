package com.example.server.controller;

import com.example.server.DTO.progress.ProgressDTO;
import com.example.server.model.progress.progress;
import com.example.server.service.progress.ProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {
    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    // Create Progress
    @PostMapping
    public ResponseEntity<ProgressDTO> createProgress(@RequestBody ProgressDTO progressDTO) {
        progress progress = mapToEntityForCreate(progressDTO);
        progress createdProgress = progressService.createProgress(progress);
        return ResponseEntity.ok(mapToDTO(createdProgress));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProgressDTO> updateProgress(@PathVariable String id, @RequestBody ProgressDTO progressDTO) {
        progress progress = mapToEntityForUpdate(progressDTO);
        progress updatedProgress = progressService.updateProgress(id, progress);
        return ResponseEntity.ok(mapToDTO(updatedProgress));
    }


    // Delete Progress
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgress(@PathVariable String id) {
        boolean deleted = progressService.deleteProgress(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Get Progress by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProgressDTO> getProgressById(@PathVariable String id) {
        progress progress = progressService.getProgressById(id);
        return ResponseEntity.ok(mapToDTO(progress));
    }

    // Get All Progress
    @GetMapping
    public ResponseEntity<List<ProgressDTO>> getAllProgress() {
        List<progress> progressList = progressService.getAllProgress();
        List<ProgressDTO> progressDTOList = progressList.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(progressDTOList);
    }

    private ProgressDTO mapToDTO(progress progress) {
        ProgressDTO progressDTO = new ProgressDTO();
        progressDTO.setId(progress.getId());
        progressDTO.setUserId(progress.getUserId());
        progressDTO.setPlanId(progress.getPlanId());
        progressDTO.setTitle(progress.getTitle());
        progressDTO.setContent(progress.getContent());
        progressDTO.setShared(progress.getShared());
        progressDTO.setStartDate(progress.getStartDate());
        progressDTO.setEndDate(progress.getEndDate());
        return progressDTO;
    }


    // Helper Methods to Map Between Entity and DTO
    private progress mapToEntityForCreate(ProgressDTO progressDTO) {
        progress progress = new progress();
        // Do NOT set ID manually
        progress.setUserId(progressDTO.getUserId());
        progress.setPlanId(progressDTO.getPlanId());
        progress.setTitle(progressDTO.getTitle());
        progress.setContent(progressDTO.getContent());
        progress.setShared(progressDTO.getShared());
        progress.setStartDate(progressDTO.getStartDate());
        progress.setEndDate(progressDTO.getEndDate());
        return progress;
    }

    private progress mapToEntityForUpdate(ProgressDTO progressDTO) {
        progress progress = new progress();
        // Do NOT trust ID for updates (ID comes from @PathVariable)
        progress.setTitle(progressDTO.getTitle());
        progress.setContent(progressDTO.getContent());
        progress.setShared(progressDTO.getShared());
        progress.setStartDate(progressDTO.getStartDate());
        progress.setEndDate(progressDTO.getEndDate());
        return progress;
    }

}