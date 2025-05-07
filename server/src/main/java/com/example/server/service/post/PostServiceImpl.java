package com.example.server.service.post;

import com.example.server.DTO.post.ContentBlockDTO;
import com.example.server.DTO.post.PostCreateDTO;
import com.example.server.DTO.post.PostDTO;
import com.example.server.model.post.Comment;
import com.example.server.model.post.ContentBlock;
import com.example.server.model.post.Like;
import com.example.server.model.post.Post;
import com.example.server.model.user.User;
import com.example.server.repository.post.CommentRepository;
import com.example.server.repository.post.LikeRepository;
import com.example.server.repository.post.PostRepository;
import com.example.server.repository.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

    private static final Logger logger = LoggerFactory.getLogger(PostServiceImpl.class);

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Override
    @Transactional
    public PostDTO createPost(PostCreateDTO postCreateDTO) {
        logger.debug("Received isPublished: {}", postCreateDTO.isPublished());
        if (postCreateDTO.getContentBlocks().size() > 0) {
            logger.debug("Creating post with {} content blocks", postCreateDTO.getContentBlocks().size());
            postCreateDTO.getContentBlocks().forEach(block -> logger.debug("Block: {}", block));
        }
        User user = userRepository.findById(postCreateDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + postCreateDTO.getUserId()));

        Post post = new Post();
        post.setUser(user);
        post.setTitle(postCreateDTO.getTitle());
        post.setPublished(postCreateDTO.isPublished());
        System.out.println(postCreateDTO);

        List<ContentBlock> contentBlocks = postCreateDTO.getContentBlocks().stream()
                .map(dto -> mapToContentBlock(dto, post))
                .collect(Collectors.toList());
        post.setContentBlocks(contentBlocks);

        Post savedPost = postRepository.save(post);
        logger.info("Post saved with ID: {}, isPublished: {}", savedPost.getId(), savedPost.isPublished());
        return mapToPostDTO(savedPost);
    }

    @Override
    @Transactional(readOnly = true)
    public PostDTO getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + id));
        return mapToPostDTO(post);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostDTO> getAllPublishedPosts() {
        return postRepository.findByIsPublishedTrue().stream()
                .map(this::mapToPostDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostDTO> getPostsByUserId(Long userId) {
        return postRepository.findByUserId(userId).stream()
                .map(this::mapToPostDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PostDTO updatePost(Long id, PostCreateDTO postCreateDTO) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + id));

        User user = userRepository.findById(postCreateDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + postCreateDTO.getUserId()));

        post.setTitle(postCreateDTO.getTitle());
        post.setPublished(postCreateDTO.isPublished());
        post.getContentBlocks().clear();
        List<ContentBlock> contentBlocks = postCreateDTO.getContentBlocks().stream()
                .map(dto -> mapToContentBlock(dto, post))
                .collect(Collectors.toList());
        post.setContentBlocks(contentBlocks);

        Post updatedPost = postRepository.save(post);
        logger.info("Post updated with ID: {}", updatedPost.getId());
        return mapToPostDTO(updatedPost);
    }

    @Override
    @Transactional
    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + id));
        postRepository.delete(post);
        logger.info("Post deleted with ID: {}", id);
    }

    private PostDTO mapToPostDTO(Post post) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setUserId(post.getUser().getId());
        dto.setTitle(post.getTitle());
        dto.setContentBlocks(post.getContentBlocks().stream()
                .map(this::mapToContentBlockDTO)
                .collect(Collectors.toList()));
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        dto.setPublished(post.isPublished());
        return dto;
    }

    private ContentBlockDTO mapToContentBlockDTO(ContentBlock block) {
        ContentBlockDTO dto = new ContentBlockDTO();
        dto.setId(block.getId());
        dto.setType(block.getType());
        dto.setContent(block.getContent());
        dto.setUrl(block.getUrl());
        dto.setVideoDuration(block.getVideoDuration());
        dto.setPosition(block.getPosition());
        return dto;
    }

    private ContentBlock mapToContentBlock(ContentBlockDTO dto, Post post) {
        ContentBlock block = new ContentBlock();
        block.setPost(post);
        block.setType(dto.getType());
        block.setContent(dto.getContent());
        block.setUrl(dto.getUrl());
        block.setVideoDuration(dto.getVideoDuration());
        block.setPosition(dto.getPosition());
        return block;
    }

    public void likePost(Long postId, Long userId) {
        if (likeRepository.existsByPostIdAndUserId(postId, userId)) {
            throw new RuntimeException("Already liked");
        }
        Post post = postRepository.findById(postId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        Like like = new Like(null, post, user, null);
        likeRepository.save(like);
    }

    public Comment addComment(Long postId, Long userId, String content) {
        Post post = postRepository.findById(postId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        Comment comment = new Comment(
                null,                   // ID (let the DB auto-generate it)
                content,                // comment text
                post,                   // post entity
                user,                   // user entity
                null,                   // parent comment (null for top-level)
                new ArrayList<>(),      // empty replies list
                LocalDateTime.now()
        );
        return commentRepository.save(comment);
    }

    public List<Comment> getComments(Long postId) {
        return commentRepository.findByPostId(postId);
    }

    public long getLikeCount(Long postId) {
        return likeRepository.countByPostId(postId);
    }

    public Comment replyToComment(Long postId, Long parentCommentId, Long userId, String content) {
        Post post = postRepository.findById(postId).orElseThrow();
        Comment parent = commentRepository.findById(parentCommentId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();

        Comment reply = new Comment(
                null,
                content,
                post,
                user,
                parent,
                new ArrayList<>(),
                LocalDateTime.now()
        );

        reply.setContent(content);
        reply.setPost(post);
        reply.setUser(user);
        reply.setParent(parent);
        return commentRepository.save(reply);
    }
}