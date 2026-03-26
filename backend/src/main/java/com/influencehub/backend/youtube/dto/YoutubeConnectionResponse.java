package com.influencehub.backend.youtube.dto;

public class YoutubeConnectionResponse {

    private final String accessToken;
    private final String refreshToken;
    private final YoutubeChannelProfileResponse channel;

    public YoutubeConnectionResponse(
        String accessToken,
        String refreshToken,
        YoutubeChannelProfileResponse channel
    ) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.channel = channel;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public YoutubeChannelProfileResponse getChannel() {
        return channel;
    }
}
