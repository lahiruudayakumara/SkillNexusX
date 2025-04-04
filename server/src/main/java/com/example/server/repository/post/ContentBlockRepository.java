package com.example.server.repository.post;

import com.example.server.model.post.ContentBlock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContentBlockRepository extends JpaRepository<ContentBlock, Long> {
}
