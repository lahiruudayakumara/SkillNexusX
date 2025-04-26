package com.example.server.model.post;

import com.example.server.model.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "posts")
@Data
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "post")
    private List<ContentBlock> contentBlocks = new ArrayList<>(); // Removed @OrderColumn

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private boolean isPublished = false;

//    @PrePersist
//    @PreUpdate
//    public void validateMedia() {
//        int imageCount = (int) contentBlocks.stream()
//                .filter(block -> block.getType() == ContentType.IMAGE)
//                .count();
//        boolean hasVideo = contentBlocks.stream()
//                .anyMatch(block -> block.getType() == ContentType.VIDEO);
//
//        if (imageCount > 3) {
//            throw new IllegalStateException("A post cannot have more than 3 images.");
//        }
//        if (hasVideo && imageCount > 0) {
//            throw new IllegalStateException("A post cannot have both images and a video.");
//        }
//        if (hasVideo) {
//            ContentBlock videoBlock = contentBlocks.stream()
//                    .filter(block -> block.getType() == ContentType.VIDEO)
//                    .findFirst()
//                    .orElse(null);
//            if (videoBlock != null && (videoBlock.getVideoDuration() == null || videoBlock.getVideoDuration() > 30)) {
//                throw new IllegalStateException("Video duration must be 30 seconds or less.");
//            }
//        }
//    }
}