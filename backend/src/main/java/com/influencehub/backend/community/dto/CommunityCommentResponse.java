package com.influencehub.backend.community.dto;

import java.time.LocalDateTime;

public class CommunityCommentResponse {

    private final Long commentId;
    private final String authorName;
    private final String content;
    private final LocalDateTime createdAt;

    public CommunityCommentResponse(Long commentId, String authorName, String content, LocalDateTime createdAt) {
        this.commentId = commentId;
        this.authorName = authorName;
        this.content = content;
        this.createdAt = createdAt;
    }

    public Long getCommentId() {
        return commentId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
