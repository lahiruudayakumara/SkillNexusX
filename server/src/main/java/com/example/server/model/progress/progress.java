package com.example.server.model.progress;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "progress") // Specifies the table name in the database
public class progress {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // Automatically generates a UUID for the ID
    private String id;

    @Column(name = "user_id", nullable = false) // Maps to the "user_id" column in the table
    private String userId;

    @Column(name = "plan_id") // Maps to the "plan_id" column (optional)
    private String planId;

    @Column(nullable = false) // Maps to the "title" column and makes it non-nullable
    private String title;

    @Column(columnDefinition = "TEXT") // Maps to the "content" column with a TEXT type
    private String content;

    @Column // Maps to the "shared" column
    private Boolean shared;

    @Column(name = "start_date", nullable = false) // Maps to the "start_date" column
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false) // Maps to the "end_date" column
    private LocalDateTime endDate;

    @Column(name = "created_at", nullable = false, updatable = false) // Maps to the "created_at" column
    private LocalDateTime createdAt;

    @Column(name = "updated_at") // Maps to the "updated_at" column
    private LocalDateTime updatedAt;

    // Constructors
    public progress() {
    }

    public progress(String id, String userId, String planId, String title, String content, Boolean shared,
                    LocalDateTime startDate, LocalDateTime endDate, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.planId = planId;
        this.title = title;
        this.content = content;
        this.shared = shared;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPlanId() {
        return planId;
    }

    public void setPlanId(String planId) {
        this.planId = planId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Boolean getShared() {
        return shared;
    }

    public void setShared(Boolean shared) {
        this.shared = shared;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "Progress{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", planId='" + planId + '\'' +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", shared=" + shared +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}