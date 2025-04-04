package com.example.server.service.post;

import com.example.server.DTO.post.PostCreateDTO;
import com.example.server.DTO.post.PostDTO;

import java.util.List;

public interface PostService {
    PostDTO createPost(PostCreateDTO postCreateDTO);
    PostDTO getPostById(Long id);
    List<PostDTO> getAllPublishedPosts();
    List<PostDTO> getPostsByUserId(Long userId);
    PostDTO updatePost(Long id, PostCreateDTO postCreateDTO);
    void deletePost(Long id);
}
