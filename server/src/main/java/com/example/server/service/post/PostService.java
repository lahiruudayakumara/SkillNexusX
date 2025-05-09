package com.example.server.service.post;

import com.example.server.DTO.post.CommentResponseDTO;
import com.example.server.DTO.post.PostCreateDTO;
import com.example.server.DTO.post.PostDTO;
import com.example.server.model.post.Comment;
import jakarta.annotation.Nullable;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface PostService {
    PostDTO createPost(PostCreateDTO postCreateDTO,boolean draft);
    PostDTO getPostById(Long id);
    List<PostDTO> getAllPublishedPosts(@Nullable Long userId);
    List<PostDTO> getAllDraftPosts(@Nullable Long userId);
    List<PostDTO> getPostsByUserId(Long userId);
    List<PostDTO> getAllUserPublishedPosts(Long userId);
    PostDTO updatePost(Long id, PostCreateDTO postCreateDTO);
    void deletePost(Long id);
    ResponseEntity<String> likePost(Long postId, Long userId);
    long getLikeCount(Long postId);
    Comment addComment(Long postId, Long userId, String content);
    List<CommentResponseDTO> getComments(Long postId);
    Comment replyToComment(Long postId, Long parentCommentId, Long userId, String content);
    void deleteComment(Long commentId);
    void deleteReply(Long replyId);
}
