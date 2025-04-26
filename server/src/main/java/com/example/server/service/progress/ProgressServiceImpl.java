package com.example.server.service.progress;
import com.example.server.model.progress.progress;
import com.example.server.repository.progress.ProgressRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProgressServiceImpl implements ProgressService {
    private final ProgressRepository progressRepository;

    public ProgressServiceImpl(ProgressRepository progressRepository) {
        this.progressRepository = progressRepository;
    }


    @Override
    public progress createProgress(progress progress) {
        progress.setId(null); // Force Hibernate to create a new ID
        progress.setCreatedAt(LocalDateTime.now());
        progress.setUpdatedAt(LocalDateTime.now());
        return progressRepository.save(progress);
    }

    @Override
    public progress updateProgress(String id, progress updatedProgress) {
        return progressRepository.findById(id)
                .map(existingProgress -> {
                    existingProgress.setTitle(updatedProgress.getTitle());
                    existingProgress.setContent(updatedProgress.getContent());
                    existingProgress.setShared(updatedProgress.getShared());
                    existingProgress.setStartDate(updatedProgress.getStartDate());
                    existingProgress.setEndDate(updatedProgress.getEndDate());
                    existingProgress.setUpdatedAt(LocalDateTime.now()); // << Always set server time
                    return progressRepository.save(existingProgress);
                })
                .orElseThrow(() -> new RuntimeException("Progress with ID " + id + " not found."));
    }


    @Override
    public boolean deleteProgress(String id) {
        if (progressRepository.existsById(id)) {
            progressRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public progress getProgressById(String id) {
        return progressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Progress with ID " + id + " not found."));
    }

    @Override
    public List<progress> getAllProgress() {
        return progressRepository.findAll();
    }
}