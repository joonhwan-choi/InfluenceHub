package com.influencehub.backend.youtube.dto;

public class YoutubeConnectionSnapshotResponse {

    private final Long connectionId;
    private final String channelId;
    private final String channelTitle;
    private final String channelDescription;
    private final String roomName;
    private final String roomSlug;
    private final String subscriberCount;

    public YoutubeConnectionSnapshotResponse(
        Long connectionId,
        String channelId,
        String channelTitle,
        String channelDescription,
        String roomName,
        String roomSlug,
        String subscriberCount
    ) {
        this.connectionId = connectionId;
        this.channelId = channelId;
        this.channelTitle = channelTitle;
        this.channelDescription = channelDescription;
        this.roomName = roomName;
        this.roomSlug = roomSlug;
        this.subscriberCount = subscriberCount;
    }

    public Long getConnectionId() {
        return connectionId;
    }

    public String getChannelId() {
        return channelId;
    }

    public String getChannelTitle() {
        return channelTitle;
    }

    public String getChannelDescription() {
        return channelDescription;
    }

    public String getRoomName() {
        return roomName;
    }

    public String getRoomSlug() {
        return roomSlug;
    }

    public String getSubscriberCount() {
        return subscriberCount;
    }
}
