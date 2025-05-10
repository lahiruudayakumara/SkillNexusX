package com.example.server.repository.post;

import com.example.server.model.post.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostId(Long postId);
    Number countByPostId(Long id);
}
