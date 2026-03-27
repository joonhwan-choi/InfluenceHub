package com.influencehub.backend.youtube.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

public class YoutubeCommentPublishRequest {

    @JsonAlias({"videoUrl", "video_url"})
    private String videoUrl;

    @JsonAlias({"message", "comment", "text"})
    private String message;

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
