package com.influencehub.backend.auth.dto;

import java.time.LocalDateTime;

public class CreatorAuthResponse {

    private final String sessionToken;
    private final LocalDateTime expiresAt;
    private final Long connectionId;
    private final String channelId;
    private final String channelTitle;
    private final String channelDescription;
    private final String roomName;
    private final String roomSlug;
    private final String subscriberCount;

    public CreatorAuthResponse(
        String sessionToken,
        LocalDateTime expiresAt,
        Long connectionId,
        String channelId,
        String channelTitle,
        String channelDescription,
        String roomName,
        String roomSlug,
        String subscriberCount
    ) {
        this.sessionToken = sessionToken;
        this.expiresAt = expiresAt;
        this.connectionId = connectionId;
        this.channelId = channelId;
        this.channelTitle = channelTitle;
        this.channelDescription = channelDescription;
        this.roomName = roomName;
        this.roomSlug = roomSlug;
        this.subscriberCount = subscriberCount;
    }

    public String getSessionToken() {
        return sessionToken;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
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
