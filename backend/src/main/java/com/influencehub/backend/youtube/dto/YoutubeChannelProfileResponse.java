package com.influencehub.backend.youtube.dto;

public class YoutubeChannelProfileResponse {

    private final String channelId;
    private final String title;
    private final String description;
    private final String customUrl;
    private final String thumbnailUrl;
    private final String subscriberCount;

    public YoutubeChannelProfileResponse(
        String channelId,
        String title,
        String description,
        String customUrl,
        String thumbnailUrl,
        String subscriberCount
    ) {
        this.channelId = channelId;
        this.title = title;
        this.description = description;
        this.customUrl = customUrl;
        this.thumbnailUrl = thumbnailUrl;
        this.subscriberCount = subscriberCount;
    }

    public String getChannelId() {
        return channelId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getCustomUrl() {
        return customUrl;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public String getSubscriberCount() {
        return subscriberCount;
    }
}
