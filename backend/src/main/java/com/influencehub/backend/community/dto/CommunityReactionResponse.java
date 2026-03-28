package com.influencehub.backend.community.dto;

public class CommunityReactionResponse {

    private final Long postId;
    private final long likeCount;
    private final boolean likedByViewer;

    public CommunityReactionResponse(Long postId, long likeCount, boolean likedByViewer) {
        this.postId = postId;
        this.likeCount = likeCount;
        this.likedByViewer = likedByViewer;
    }

    public Long getPostId() {
        return postId;
    }

    public long getLikeCount() {
        return likeCount;
    }

    public boolean isLikedByViewer() {
        return likedByViewer;
    }
}
