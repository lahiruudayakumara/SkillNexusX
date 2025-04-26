package com.example.server.repository.post;

import com.example.server.model.post.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByIsPublishedTrue();
    List<Post> findByUserId(Long userId);
}