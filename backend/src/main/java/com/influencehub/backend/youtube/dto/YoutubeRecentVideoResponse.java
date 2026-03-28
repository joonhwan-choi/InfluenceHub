package com.influencehub.backend.youtube.dto;

public class YoutubeRecentVideoResponse {

    private final String videoId;
    private final String title;
    private final String description;
    private final String thumbnailUrl;
    private final String watchUrl;
    private final String publishedAt;
    private final String liveBroadcastContent;

    public YoutubeRecentVideoResponse(
        String videoId,
        String title,
        String description,
        String thumbnailUrl,
        String watchUrl,
        String publishedAt,
        String liveBroadcastContent
    ) {
        this.videoId = videoId;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.watchUrl = watchUrl;
        this.publishedAt = publishedAt;
        this.liveBroadcastContent = liveBroadcastContent;
    }

    public String getVideoId() {
        return videoId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public String getWatchUrl() {
        return watchUrl;
    }

    public String getPublishedAt() {
        return publishedAt;
    }

    public String getLiveBroadcastContent() {
        return liveBroadcastContent;
    }
}
