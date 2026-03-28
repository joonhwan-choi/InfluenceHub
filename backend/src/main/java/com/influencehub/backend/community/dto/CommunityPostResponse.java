package com.influencehub.backend.community.dto;

import java.time.LocalDateTime;

public class CommunityPostResponse {

    private final Long postId;
    private final String postType;
    private final String title;
    private final String content;
    private final String authorName;
    private final String imageUrl;
    private final long likeCount;
    private final long commentCount;
    private final long reportCount;
    private final boolean likedByViewer;
    private final boolean highlighted;
    private final LocalDateTime createdAt;

    public CommunityPostResponse(
        Long postId,
        String postType,
        String title,
        String content,
        String authorName,
        String imageUrl,
        long likeCount,
        long commentCount,
        long reportCount,
        boolean likedByViewer,
        boolean highlighted,
        LocalDateTime createdAt
    ) {
        this.postId = postId;
        this.postType = postType;
        this.title = title;
        this.content = content;
        this.authorName = authorName;
        this.imageUrl = imageUrl;
        this.likeCount = likeCount;
        this.commentCount = commentCount;
        this.reportCount = reportCount;
        this.likedByViewer = likedByViewer;
        this.highlighted = highlighted;
        this.createdAt = createdAt;
    }

    public Long getPostId() {
        return postId;
    }

    public String getPostType() {
        return postType;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public String getAuthorName() {
        return authorName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public long getLikeCount() {
        return likeCount;
    }

    public long getCommentCount() {
        return commentCount;
    }

    public long getReportCount() {
        return reportCount;
    }

    public boolean isLikedByViewer() {
        return likedByViewer;
    }

    public boolean isHighlighted() {
        return highlighted;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
