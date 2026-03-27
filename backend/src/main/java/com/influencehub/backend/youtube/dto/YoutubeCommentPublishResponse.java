package com.influencehub.backend.youtube.dto;

public class YoutubeCommentPublishResponse {

    private final String videoId;
    private final String commentId;
    private final String commentUrl;
    private final String message;

    public YoutubeCommentPublishResponse(
        String videoId,
        String commentId,
        String commentUrl,
        String message
    ) {
        this.videoId = videoId;
        this.commentId = commentId;
        this.commentUrl = commentUrl;
        this.message = message;
    }

    public String getVideoId() {
        return videoId;
    }

    public String getCommentId() {
        return commentId;
    }

    public String getCommentUrl() {
        return commentUrl;
    }

    public String getMessage() {
        return message;
    }
}
