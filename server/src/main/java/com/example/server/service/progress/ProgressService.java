package com.example.server.service.progress;

import java.util.List;

import com.example.server.model.progress.progress;

public interface ProgressService {
    progress createProgress(progress progress);

    progress updateProgress(String id, progress progress);

    boolean deleteProgress(String id);

   progress getProgressById(String id);

    List<progress> getAllProgress();
}