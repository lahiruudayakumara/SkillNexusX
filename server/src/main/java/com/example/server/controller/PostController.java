package com.example.server.controller;

import com.example.server.DTO.post.CommentRequestDTO;
import com.example.server.DTO.post.CommentResponseDTO;
import com.example.server.DTO.post.PostCreateDTO;
import com.example.server.DTO.post.PostDTO;
import com.example.server.model.post.Comment;
import com.example.server.service.post.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping
    public ResponseEntity<PostDTO> createPost(
            @RequestBody PostCreateDTO postCreateDTO,
            @RequestParam(value = "draft", required = false, defaultValue = "false") boolean draft
    ) {
        PostDTO createdPost = postService.createPost(postCreateDTO, draft);
        return ResponseEntity.ok(createdPost);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable Long id) {
        PostDTO post = postService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllPublishedPosts(@RequestParam(value = "userId", required = false) Long userId) {
        List<PostDTO> posts = postService.getAllPublishedPosts(userId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/draft")
    public ResponseEntity<List<PostDTO>> getAllDraftPosts(@RequestParam(value = "userId", required = false) Long userId) {
        List<PostDTO> posts = postService.getAllDraftPosts(userId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostDTO>> getPostsByUserId(@PathVariable Long userId) {
        List<PostDTO> posts = postService.getPostsByUserId(userId);
        return ResponseEntity.ok(posts);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> updatePost(@PathVariable Long id, @RequestBody PostCreateDTO postCreateDTO) {
        PostDTO updatedPost = postService.updatePost(id, postCreateDTO);
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<?> likePost(@PathVariable Long postId, @RequestParam Long userId) {
        return postService.likePost(postId, userId);

    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable Long postId,
                                              @RequestParam Long userId,
                                              @RequestBody CommentRequestDTO content) {
        Comment comment = postService.addComment(postId, userId, content.getContent());
        return ResponseEntity.ok(comment);
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<CommentResponseDTO>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.getComments(postId));
    }

    @GetMapping("/{postId}/likes/count")
    public ResponseEntity<Long> getLikeCount(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.getLikeCount(postId));
    }

    @PostMapping("/{postId}/comments/{commentId}/replies")
    public ResponseEntity<Comment> replyToComment(@PathVariable Long postId,
                                                  @PathVariable Long commentId,
                                                  @RequestParam Long userId,
                                                  @RequestBody CommentRequestDTO content) {
        Comment reply = postService.replyToComment(postId, commentId, userId, content.getContent());
        return ResponseEntity.ok(reply);
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable Long commentId) {
        try {
            postService.deleteComment(commentId);
            return ResponseEntity.ok("Comment deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Comment not found");
        }
    }

    @DeleteMapping("/comments/replies/{replyId}")
    public ResponseEntity<String> deleteReply(@PathVariable Long replyId) {
        try {
            postService.deleteReply(replyId);
            return ResponseEntity.ok("Reply deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Reply not found");
        }
    }
}